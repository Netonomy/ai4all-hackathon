import { Request, Response, NextFunction } from "express";
import { createInvoice, getInvoice } from "lightning";
import { lnd } from "../config/lndClient.js";
import * as Macaroon from "macaroon";

export async function L402Auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return createAndSendMacaroonAndInvoice(res);
  }

  const [authType, authValue] = authHeader.split(" ");

  if (authType !== "L402" || !isValidAuthValue(authValue)) {
    return res.status(401).json({
      message: "Invalid Authorization header.",
    });
  }

  const [macaroon, preimage] = authValue.split(":");

  const isValid = await validateMacaroonAndInvoice(macaroon, preimage);
  if (!isValid) {
    return res.status(401).json({
      message: "Invalid preimage provided.",
    });
  }

  next();
}

async function createAndSendMacaroonAndInvoice(res: Response) {
  const invoice = await createInvoice({ lnd, mtokens: "10000" });

  const macaroon = Macaroon.newMacaroon({
    version: 1,
    rootKey: process.env.TOKEN_SECRET,
    identifier: invoice.id,
    location: "http://localhost:3300",
  });

  const base64Macaroon = Buffer.from(
    JSON.stringify(macaroon.exportJSON())
  ).toString("base64");

  res.status(402);
  res.set(
    "WWW-Authenticate",
    `L402 macaroon=${base64Macaroon}, invoice=${invoice.request}`
  );
  return res.end();
}

function isValidAuthValue(authValue: string) {
  const [macaroon, preimage] = authValue.split(":");

  const base64Regex =
    /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  const hexRegex = /^[a-fA-F0-9]+$/;

  return (
    macaroon &&
    base64Regex.test(macaroon) &&
    preimage &&
    hexRegex.test(preimage)
  );
}

async function validateMacaroonAndInvoice(
  encodedMacaroon: string,
  preimage: string
) {
  const macaroonJson = JSON.parse(
    Buffer.from(encodedMacaroon, "base64").toString("utf8")
  );

  // Deserialize the macaroon
  const macaroon = Macaroon.importMacaroon(macaroonJson);

  // Verify the macaroon
  try {
    macaroon.verify(process.env.TOKEN_SECRET, () => {});
  } catch (e) {
    return false;
  }

  const invoiceId = macaroonJson.identifier;
  const invoice = await getInvoice({ lnd, id: invoiceId });

  return invoice.secret === preimage;
}
