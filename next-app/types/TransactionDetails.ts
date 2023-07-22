interface scriptPubKey {
  asm: string;
  desc: string;
  hex: string;
  address: string;
  type: string;
}

interface Vout {
  value: number;
  n: number;
  scriptPubKey: scriptPubKey;
}

interface scriptSig {
  asm: string;
  hex: string;
}

interface Vin {
  coinbase?: string;
  txid?: string;
  vout?: number;
  scriptSig?: scriptSig;
  txinwitness: string[];
  sequence: number;
}

export enum TransactionType {
  withdraw = "withdraw",
  deposit = "deposit",
}

export default interface TransactionDetails {
  // electrum details
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  hex: string;
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;

  // netonomy details
  type?: TransactionType;
  amount?: number;
  fees?: number; // the total input amount minus the total output
  note?: string;
  fromAddresses?: string[];
  toAddresses?: string[];
}
