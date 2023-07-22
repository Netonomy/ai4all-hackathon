import { electrumClient } from "@/utils/clients/electrumClient";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: NextApiResponse) {
  try {
    const body = await request.json();
    const { rawTx } = body;

    const response = await electrumClient.request(
      "blockchain.transaction.broadcast",
      [rawTx]
    );

    return NextResponse.json({ response });
  } catch (err) {
    return new Response(err.message, {
      status: 400,
    });
  }
}
