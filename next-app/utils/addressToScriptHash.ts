import config from "@/config";
import { address as addr } from "bitcoinjs-lib";
import crypto from "crypto";

export function addressToScriptHash(address: string) {
  const script = addr.toOutputScript(address, config.network);
  const scriptHash = crypto.createHash("sha256").update(script).digest();
  // Create a new buffer to store the reversed hash
  let reversedScriptHash = Buffer.alloc(scriptHash.length);
  // Copy each byte to the new buffer in reverse order
  for (let i = 0; i < scriptHash.length; i++) {
    reversedScriptHash[i] = scriptHash[scriptHash.length - i - 1];
  }
  // Convert the reversed hash to a hex string
  const reversedScriptHashHex = reversedScriptHash.toString("hex");

  return reversedScriptHashHex;
}
