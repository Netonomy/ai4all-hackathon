import tls from "node:tls";
import fs from "fs";
import { setInterval } from "timers";

class ElectrumClient {
  client;
  heartbeatInterval;
  constructor() {
    try {
      const options: tls.ConnectionOptions = {
        // cert: fs.readFileSync("/utils/clients/cert.pem"),
        // key: fs.readFileSync("/utils/clients/key.pem"),
        host: process.env.ELECTRUM_HOST,
        rejectUnauthorized: false,
      };
      this.client = tls.connect(50002, options, () => {
        console.log("connected to server");
        // Start the heartbeat when the connection is established
        this.startHeartbeat();
      });
      this.client.on("end", () => {
        console.log("disconnected from server");
        // Stop the heartbeat when the connection ends
        this.stopHeartbeat();
      });
      this.client.on("error", (err) => {
        console.error("Error with the client", err);
      });
    } catch (err) {
      console.error(err);
    }
  }
  // Sends a ping request to the server every 5 minutes
  startHeartbeat() {
    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.request("server.banner");
        console.log("Ping sent successfully");
      } catch (err) {
        console.error("Error sending ping", err);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
  // Stops the heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }
  async request(method, params: string[] = []) {
    return new Promise((resolve, reject) => {
      const requestId = Date.now();
      let buffer = "";
      const responseHandler = (data) => {
        buffer += data.toString();
        let endOfMessageIndex;
        while ((endOfMessageIndex = buffer.indexOf("\n")) !== -1) {
          const rawMessage = buffer.slice(0, endOfMessageIndex);
          buffer = buffer.slice(endOfMessageIndex + 1);
          let response;
          try {
            response = JSON.parse(rawMessage);
          } catch (err) {
            console.error("Error parsing message:", rawMessage);
            continue;
          }
          if (response.id === requestId) {
            this.client.off("data", responseHandler);
            if (response.error) {
              reject(response.error);
            } else {
              resolve(response.result);
            }
          }
        }
      };
      this.client.on("data", responseHandler);
      const request = {
        jsonrpc: "2.0",
        method,
        params,
        id: requestId,
      };
      this.client.write(JSON.stringify(request) + "\n");
    });
  }
}
export const electrumClient = new ElectrumClient();
