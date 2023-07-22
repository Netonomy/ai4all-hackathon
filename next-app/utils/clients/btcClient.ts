import axios, { AxiosInstance } from "axios";

interface BitcoinCoreCredentials {
  username: string;
  password: string;
  url: string;
}

export class BitcoinCoreClient {
  client: AxiosInstance;
  id: number;

  constructor(credentials: BitcoinCoreCredentials) {
    this.client = axios.create({
      baseURL: credentials.url,
      auth: {
        username: credentials.username,
        password: credentials.password,
      },
    });
    this.id = 0;
  }

  async makeRequest(method, params = []) {
    this.id++;
    const data = {
      jsonrpc: "1.0",
      id: this.id,
      method,
      params,
    };
    try {
      const response = await this.client.post("", data);

      return response.data.result;
    } catch (error) {
      console.log(error);
      throw error.response.data.error;
    }
  }
  public async getBlockchainInfo() {
    return await this.makeRequest("getblockchaininfo");
  }
}
const credentials: BitcoinCoreCredentials = {
  url: process.env.BITCOIN_RPC_URL!,
  username: process.env.BITCOIN_RPC_USERNAME!,
  password: process.env.BITCOIN_RPC_PASSWORD!,
};

const btcdClient = new BitcoinCoreClient(credentials);

export default btcdClient;
