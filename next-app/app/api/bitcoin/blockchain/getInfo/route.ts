import btcdClient from "@/utils/clients/btcClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await btcdClient.getBlockchainInfo();

    return NextResponse.json(data);
  } catch (err) {
    return new Response(err.message, {
      status: 400,
    });
  }
}
