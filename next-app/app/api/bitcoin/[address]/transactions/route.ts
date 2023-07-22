import { NextResponse } from "next/server";
import { electrumClient } from "@/utils/clients/electrumClient";
import { addressToScriptHash } from "@/utils/addressToScriptHash";

export async function GET(request: Request, { params }) {
  try {
    const address = params.address;

    const scriptHash = addressToScriptHash(address);

    const response = await electrumClient.request(
      "blockchain.scripthash.get_history",
      [scriptHash]
    );

    return NextResponse.json(response);
  } catch (err) {
    return new Response(err.message, {
      status: 400,
    });
  }
}
