import { authenticatedLndGrpc } from "lightning";

export const { lnd } = authenticatedLndGrpc({
  macaroon: process.env.LND_MACAROON,
  socket: process.env.LND_ENDPOINT,
});
