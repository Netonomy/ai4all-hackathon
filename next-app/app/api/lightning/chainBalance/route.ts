import { authenticatedLndGrpc, getChainBalance } from "lightning";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }) {
  try {
    const { lnd } = authenticatedLndGrpc({
      macaroon:
        "AgEDbG5kAvgBAwoQ+YRiai7mKd9yvibz78Az6xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYgGN+9f6JtF88gjZyMTQPO+3rcKkBsgPXwgygyaBaAVww=",
      socket: "netonomy-test-node.t.gcp.voltageapp.io:10009",
    });

    const chainBalance = await getChainBalance({ lnd }).catch((err) => {
      console.error(err);
    });

    return NextResponse.json(chainBalance);
  } catch (err) {
    console.error(err);
    return new Response(err.message, {
      status: 400,
    });
  }
}
