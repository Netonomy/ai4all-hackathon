import { BtcWallet } from "@/lib/BtcWallet";
// import { Web5 } from "@tbd54566975/web5/browser";
import { Web5 } from "@tbd54566975/web5";
import { useEffect, useState } from "react";
import * as bitcoin from "bitcoinjs-lib";
import config from "@/config";

export default function useWeb5() {
  const [web5, setWeb5] = useState<Web5 | null>(null);
  const [did, setDid] = useState<string | null>(null);

  const [btcWallet, setBtcWallet] = useState<BtcWallet | null>(null);

  async function connect() {
    const { web5, did } = await Web5.connect({
      techPreview: {
        dwnEndpoints: [],
      },
    });

    setWeb5(web5);
    setDid(did);

    setWeb5(web5);

    const btcWallet = new BtcWallet();
    await btcWallet.init({
      web5,
      network: config.network,
    });
    // const mneomic = btcWallet.mnemonic;
    // console.log(mneomic);
    setBtcWallet(btcWallet);

    // const balance = await btcWallet.getWalletBalance();
    // console.log(balance);

    // const address = await btcWallet.generateNewAddress(0);
    // console.log(address);
    // bcrt1qvt5kgsnj8mvuq4jkd3kacrg4a2lewhyxsrl4jy regtest

    // tb1q40zpla88upeavhyggv6f37w6jehs0udkphw7q8 testnet

    // const address = await netonomy.generateNewAddress(0);

    // console.log(address);
  }

  useEffect(() => {
    connect();
  }, []);

  return { web5, did, btcWallet };
}
