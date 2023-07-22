import { Network, networks } from "bitcoinjs-lib";

interface Config {
  network: Network;
}

const getNetwork = (env: string | undefined): Network => {
  switch (env) {
    case "regtest":
      return networks.regtest;
    case "testnet":
      return networks.testnet;
    case "mainnet":
      return networks.bitcoin;
    default:
      throw new Error(
        `Invalid Btc network: ${env}. Set it to either 'regtest', 'testnet' or 'mainnet'.`
      );
  }
};

const config: Config = {
  network: getNetwork(process.env.NEXT_PUBLIC_BITCOIN_NETWORK),
};

export default config;
