import { NextResponse } from "next/server";
import { electrumClient } from "@/utils/clients/electrumClient";

export async function GET(request: Request, { params }) {
  try {
    const txHash = params.txHash;

    const { searchParams } = new URL(request.url);
    const verbose = searchParams.get("verbose") === "true";

    const response = await electrumClient.request(
      "blockchain.transaction.get",
      [txHash, verbose]
    );

    return NextResponse.json(response);
  } catch (err) {
    return new Response(err.message, {
      status: 400,
    });
  }
}
