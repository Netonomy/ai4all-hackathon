import axios, { Axios } from "axios";
import * as bitcoin from "bitcoinjs-lib";
import ecc from "@bitcoinerlab/secp256k1";
import * as bip39 from "bip39";
import BIP32Factory, { BIP32Interface } from "bip32";
import { Web5 } from "@tbd54566975/web5";
import { TransactionPriority } from "@/enums/TransactionPriority";
import AccountBalance from "@/types/AccountBalance";
import { AddressDetails } from "@/types/AddressDetails";
import RecommendedFees from "@/types/RecommendedFees";
import TransactionDetails, {
  TransactionType,
} from "@/types/TransactionDetails";
import Utxo from "@/types/Utxo";
import Transaction from "@/types/Transaction";
import config from "@/config";

const bip32 = BIP32Factory(ecc);

export interface NetonomyConstructorOptions {
  network?: bitcoin.networks.Network;
  web5: Web5;
}

export class BtcWallet {
  private network: bitcoin.networks.Network;

  private account: BIP32Interface;
  private axios: Axios;
  public mnemonic: string;

  public web5: Web5;

  /**
   * Initalize the SDK
   * @param {NetonomyConstructorOptions} options - Options for creating a Netonomy instance.
   */
  public async init(options: NetonomyConstructorOptions): Promise<void> {
    const { network, web5 } = options;

    this.network = network || bitcoin.networks.bitcoin;

    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    this.web5 = web5;

    // Query DWN to see if there is a mnemonic
    const mnemonicSchmea = `https://bitcoin.org/${this.network.wif}/mnemonic`;
    const mnemonicRes = await this.web5.dwn.records.query({
      message: {
        filter: {
          schema: mnemonicSchmea,
        },
      },
    });

    let mnemonic = "";
    if (mnemonicRes.records && mnemonicRes.records.length > 0) {
      mnemonic = await mnemonicRes.records[0].data.text();
    } else {
      // Create mnemonic
      mnemonic = bip39.generateMnemonic();

      // Store in DWN
      await this.web5.dwn.records.create({
        data: mnemonic,
        message: {
          schema: mnemonicSchmea,
        },
      });
    }

    // Validate the mnemonic phrase
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic");
    }
    this.mnemonic = mnemonic;

    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Create the master node from the seed.
    const root = bip32.fromSeed(seed, this.network);
    const path = `m/44'/0'/0'`;
    this.account = root.derivePath(path);
  }

  /**
   * Generate a new address
   * @param chain - The chain of the address, 0 for external/receiving, 1 for internal/change.
   * @returns {Promise<string | undefined>} - The generated address.
   */
  public async generateNewAddress(chain: number): Promise<string | undefined> {
    let index = 0;

    // Check if there is a current index for the given chain
    // Schema for index of account: https://bitcoin.org/{network}/{accout_index}/{chain_number}/index
    const schema = `https://bitcoin.org/${this.network.wif}/0/${chain}/index`;
    const indexRes = await this.web5.dwn.records.query({
      message: {
        filter: {
          schema,
        },
      },
    });

    // If index found then use it
    // Then iterate index
    if (indexRes.records && indexRes.records.length > 0) {
      const record = indexRes.records[0];
      index = (await record.data.json()).index;

      const nextIndex = index + 1;
      record.update({
        data: {
          index: nextIndex,
        },
      });
    } else {
      // Create index record
      await this.web5.dwn.records.create({
        data: {
          index: 1,
        },
        message: {
          schema,
        },
      });
    }

    // Create address
    const child = this.account.derive(chain).derive(index);
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: this.network,
    });

    // Store the address and the path used to generate
    this.web5.dwn.records.create({
      data: {
        address,
        chain: chain,
        index: index,
      },
      message: {
        schema: `https://bitcoin.org/${this.network.wif}/address`,
      },
    });

    return address;
  }

  /**
   * Get the fee rate based on the priority.
   * @param {TransactionPriority} priority - The priority of the transaction.
   * @returns {number} The fee rate.
   */
  private async getFeeRate(
    priority: TransactionPriority
  ): Promise<number | null> {
    try {
      const feeRates = await this.getFeeRates();
      if (feeRates) {
        switch (priority) {
          case TransactionPriority.high:
            return feeRates?.fastestFee;
          case TransactionPriority.medium:
            return feeRates?.halfHourFee;
          case TransactionPriority.low:
          default:
            return feeRates?.economyFee;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Failed to get the fee rate: ${error}`);
      return null;
    }
  }

  /**
   * Generate the keypair that was used to generate an address.
   * This will be used to sign the utxo when created a transaction
   * @param {string} address
   * @return {Promise<BIP32Interface | null>} The keypair used to create address if found
   */
  private async getKeyPairForAddress(
    address: string
  ): Promise<BIP32Interface | null> {
    // Get all addresses and their details
    const allAddressDetails = await this.getAllAddresses();

    // Search for details of this given address
    const detail = allAddressDetails.find(
      (detail) => detail.address === address
    );

    if (detail) {
      const chain = detail.chain;
      const index = detail.index;

      // Generate keypair
      const keyPair = this.account.derive(chain).derive(index);
      return keyPair;
    } else return null;
  }

  /**
   * Create a raw transaction
   * @param {TransactionPriority} priority - The priority of the transaction (high, medium, low).
   * @param {string} toAddress - The address to send to.
   * @param {number} amount - The amount to send.
   * @returns {Promise<string | null>} The raw transaction in hex format
   */
  public async createTransaction(
    priority: TransactionPriority,
    toAddress: string,
    amount: number
  ): Promise<string | null> {
    try {
      const feeRate = await this.getFeeRate(priority);
      if (!feeRate) return null;

      const estimatedTxSize = 250; // this is just a rough estimate, actual size may vary
      const txFee = Math.floor(estimatedTxSize * feeRate!);

      const utxos = await this.getWalletUtxos();
      if (!Array.isArray(utxos)) {
        throw new Error("Failed to get UTXOs.");
      }

      // Sort UTXOs in descending order by value
      utxos.sort((a, b) => b.value - a.value);

      // Select UTXOs
      let selectedUtxos: Utxo[] = [];
      let totalUtxoValue = 0;
      let optimalChange = Infinity;

      // Simplified "branch-and-bound" algorithm
      for (const utxo of utxos) {
        // Make sure the tx is not a coinbase transaction with less than 100 confirmations
        const txDetails = await this.getTransactionDetails(utxo.tx_hash);

        if (
          txDetails &&
          txDetails.vin[0] &&
          Object.keys(txDetails.vin[0]).includes("coinbase") &&
          txDetails.confirmations < 100
        )
          continue;

        totalUtxoValue += utxo.value;
        selectedUtxos.push(utxo);

        const change = totalUtxoValue - amount - txFee;

        if (totalUtxoValue >= amount + txFee && change < optimalChange) {
          optimalChange = change;
        } else if (
          totalUtxoValue >= amount + txFee &&
          change >= optimalChange
        ) {
          // This solution is not better than the previous one
          totalUtxoValue -= utxo.value;
          selectedUtxos.pop();
        }

        if (totalUtxoValue === amount + txFee) {
          // We've found an optimal solution
          break;
        }
      }

      // Ensure there's enough balance
      if (totalUtxoValue < amount + txFee) {
        throw new Error("Insufficient balance to create transaction.");
      }

      const psbt = new bitcoin.Psbt({ network: this.network });

      for (let i = 0; i < selectedUtxos.length; i++) {
        const utxo = selectedUtxos[i];

        const rawTx = await this.getRawTransaction(utxo.tx_hash);

        if (!rawTx)
          throw new Error(
            `Failed to get raw transaction for hash: ${utxo.tx_hash}`
          );
        psbt.addInput({
          hash: utxo.tx_hash,
          index: utxo.tx_pos,
          nonWitnessUtxo: Buffer.from(rawTx, "hex"),
        });
      }

      // Generate change address. TODO: Change to 1 for internal address. Need to keep track of address and indexes
      const changeAddress = await this.generateNewAddress(1);
      if (!changeAddress) throw new Error("Invalid Change Address");

      // Prepare transaction outputs
      const change = totalUtxoValue - amount - txFee;
      psbt.addOutput({ address: toAddress, value: amount });
      if (change > 0) {
        psbt.addOutput({ address: changeAddress, value: change });
      }

      // Sign all inputs
      for (let i = 0; i < selectedUtxos.length; i++) {
        // Get utxo details to find the address it went to
        const txDetails = await this.getTransactionDetails(
          selectedUtxos[i].tx_hash
        );

        if (!txDetails) throw new Error("Tx details not found");

        const address =
          txDetails.vout[selectedUtxos[i].tx_pos].scriptPubKey.address;

        // Derive the keypair that was used to create that address
        const keyPair = await this.getKeyPairForAddress(address);

        if (!keyPair) throw new Error("Invalid keypair");

        // Sign the input
        psbt.signInput(i, keyPair);
      }

      // Finalize and extract transaction
      psbt.finalizeAllInputs();
      const transaction = psbt.extractTransaction().toHex();

      return transaction;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Fetch all used bitcoin addresses from dwn
   * @returns {Promise<string[]>} - Promise of an array of bitcoin address strings
   */
  private async getAllAddresses(): Promise<AddressDetails[]> {
    try {
      const addressesRes = await this.web5.dwn.records.query({
        message: {
          filter: {
            schema: `https://bitcoin.org/${this.network.wif}/address`,
          },
        },
      });

      if (!addressesRes.records) throw new Error("Unable to get all addresses");

      let addresses: AddressDetails[] = [];
      for (const record of addressesRes.records) {
        const address: AddressDetails = await record.data.json();
        addresses.push(address);
      }

      return addresses;
    } catch (err) {
      console.error("Failed to fetch addresses");
      throw err;
    }
  }

  /**
   * Fetch the balance for a specific address
   * @param address - The address to check balance for.
   * @returns {Promise<AccountBalance | null>} - Promise object represents the balance of the address.
   */
  private async getBalanceForAddress(
    address: string
  ): Promise<AccountBalance | null> {
    try {
      const response = await this.axios.get(`bitcoin/${address}/balance`);
      if (response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch balance");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Fetch the balance for the entire wallet.
   * @returns {Promise<AccountBalance>} - Promise object represents the balance of the wallet.
   */
  public async getWalletBalance(): Promise<AccountBalance> {
    const allAddressDetails = await this.getAllAddresses();

    let totalBalance: AccountBalance = { confirmed: 0, unconfirmed: 0 };

    // Calculate the total balance
    for (const detail of allAddressDetails) {
      const address = detail.address;
      const balance = await this.getBalanceForAddress(address);

      if (balance && (balance.confirmed > 0 || balance.unconfirmed > 0)) {
        totalBalance = {
          confirmed: totalBalance.confirmed + balance.confirmed,
          unconfirmed: totalBalance.unconfirmed + balance.unconfirmed,
        };
      }
    }

    return totalBalance;
  }

  /**
   * Fetch the transactions for a specific address
   * @param address - The address to check transactions for.
   * @returns {Promise<Transaction[] | null>} - Promise object represents the transactions of the address.
   */
  private async getTransactionsForAddress(
    address: string
  ): Promise<Transaction[] | null> {
    try {
      const response = await this.axios.get(`bitcoin/${address}/transactions`);
      if (response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch transactions");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Fetch the transactions for the entire wallet.
   * @returns {Promise<Transaction[]>} - Promise object represents the transactions of the wallet.
   */
  public async getWalletTransactions(): Promise<Transaction[]> {
    const addresses = await this.getAllAddresses();

    let allTransactions: Transaction[] = [];
    for (const data of addresses) {
      const address = data.address;
      const transactions = await this.getTransactionsForAddress(address);
      if (transactions && transactions.length > 0) {
        allTransactions = allTransactions.concat(transactions);
      }
    }

    return allTransactions;
  }

  /**
   * Fetch all transaction for the entire wallet, with transaction details
   * @returns {Promise<TransactionDetails[]>} - Promise object represents a list of transaction details of the wallet
   */
  public async getWalletTransactionsWithDetails() {
    const transactions = await this.getWalletTransactions();
    const allAddressesWithDetails = await this.getAllAddresses();

    const allAddresses = allAddressesWithDetails.map(
      (detail) => detail.address
    );

    let transactionsWithDetails: TransactionDetails[] = [];

    for (const transaction of transactions) {
      // Get tx details
      let txDetails = await this.getTransactionDetails(transaction.tx_hash);

      let inputAmount = 0;

      // Get all from addresses
      let fromAddresses: string[] = [];
      for (const vin of txDetails!.vin) {
        const txHash = vin.txid;
        const pos = vin.vout;

        // If its a coinbase trans
        if (vin.coinbase) continue;

        const vinTxDetails = await this.getTransactionDetails(txHash!);
        fromAddresses.push(vinTxDetails!.vout[pos!].scriptPubKey.address);
        inputAmount += vinTxDetails!.vout[pos!].value;
      }
      txDetails!.fromAddresses = fromAddresses;

      // Check if the wallet owns any of the from addresses
      // Determine if this is a withdrawal or deposit
      if (fromAddresses.some((address) => allAddresses.includes(address))) {
        txDetails!.type = TransactionType.withdraw;
      } else {
        txDetails!.type = TransactionType.deposit;
      }

      // Get all to addresses and calculate output amount
      txDetails!.toAddresses = [];
      let outputAmount = 0;
      for (const vout of txDetails!.vout) {
        // Check to make sure its a valid vout
        if (vout.scriptPubKey.type === "nulldata") continue;

        outputAmount += vout.value;
        txDetails!.toAddresses.push(vout.scriptPubKey.address);
      }

      // Calculate transaction fee
      txDetails!.fees = inputAmount - outputAmount;

      // Total amount
      txDetails!.amount = outputAmount;
      transactionsWithDetails.push(txDetails!);
    }

    return transactionsWithDetails;
  }

  /**
   * Broadcast transaction
   * @param {string} rawTx - The raw transaction to broadcast.
   * @returns {Promise<string | null>} - Promise object represents the transaction hash as a hexadecimal string.
   */
  public async broadcastTransaction(rawTx: string): Promise<string | null> {
    try {
      const response = await this.axios.post("bitcoin/transaction/broadcast", {
        rawTx,
      });
      if (response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to broadcast transaction");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Fetch the UTXOs for a specific address
   * @param address - The address to check UTXOs for.
   * @returns {Promise<Utxo[] | null>} - Promise object represents the UTXOs of the address.
   */
  private async getUtxosForAddress(address: string): Promise<Utxo[] | null> {
    try {
      const response = await this.axios.get(`bitcoin/${address}/utxos`);
      if (response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch UTXOs");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Fetch the UTXOs for the entire wallet.
   * @returns {Promise<Utxo[]>} - Promise object represents the UTXOs of the wallet.
   */
  public async getWalletUtxos(): Promise<Utxo[]> {
    const addresses = await this.getAllAddresses();

    let allUtxos: Utxo[] = [];
    for (const data of addresses) {
      const address = data.address;
      const utxos = await this.getUtxosForAddress(address);
      if (utxos && utxos.length > 0) {
        allUtxos = allUtxos.concat(utxos);
      }
    }
    return allUtxos;
  }

  /**
   * Fetch the raw transaction
   * @param {string} txHash - The transaction hash to fetch raw transaction for.
   * @returns {Promise<string | null>} - Promise object represents the raw transaction as a hexadecimal string.
   */
  private async getRawTransaction(txHash: string): Promise<string | null> {
    try {
      const response = await this.axios.get(`bitcoin/transaction/${txHash}`);
      if (response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch raw transaction");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Fetch the transaction details
   * @param {string} txHash - The transaction hash to fetch raw transaction for.
   * @returns {Promise<TransactionDetails | null>} - Promise object represents the transaction details
   */
  private async getTransactionDetails(
    txHash: string
  ): Promise<TransactionDetails | null> {
    try {
      const response = await this.axios.get(
        `bitcoin/transaction/${txHash}?verbose=true`
      );
      if (response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch raw transaction details");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Fetch recommended blockchain fee rates
   * @returns {Promise<RecommendedFees | null>} - Promise object represents the estimated recommended fees.
   */
  private async getFeeRates(): Promise<RecommendedFees | null> {
    try {
      const response = await axios.get(
        `https://mempool.space/api/v1/fees/recommended`
      );
      if (response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch estimated fee");
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
