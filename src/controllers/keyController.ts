import type { Context } from "hono";
import type { KeyData } from "../types";

import {
  isSupportedKeyType,
  generateKeyPair,
  verify,
  sign,
} from "../services/keyService";
import { SignatureKind } from "typescript";
import { bytesToHex } from "@noble/hashes/utils";

export async function keyControllerPost(c: Context): Promise<Response> {
  const keyType = c.req.param("keyType");

  if (!keyType || !isSupportedKeyType(keyType)) {
    return c.json({ error: `Unsupported keyType: ${keyType}` }, 400);
  }

  const { privateKey, publicKey } = generateKeyPair(keyType);

  const keyData: KeyData = {
    keyType,
    privateKey,
    publicKey,
  };

  return c.json(keyData);
}

export async function keyControllerSignPost(c: Context): Promise<Response> {
  const keyType = c.req.param("keyType");

  if (!keyType || !isSupportedKeyType(keyType)) {
    return c.json({ error: `Unsupported keyType: ${keyType}` }, 400);
  }

  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const { privateKey, message } = body;

  if (typeof privateKey !== "string" || privateKey.length === 0) {
    return c.json({ error: "Missing or invalid privateKey" }, 400);
  }
  if (typeof message !== "string" || message.length === 0) {
    return c.json({ error: "Missing or invalid message" }, 400);
  }

  const messageHex = bytesToHex(new TextEncoder().encode(message));
  const signature = sign(keyType, privateKey, messageHex);

  return c.json({ signature });
}

export async function keyControllerVerifyPost(c: Context): Promise<Response> {
  const keyType = c.req.param("keyType");

  if (!keyType || !isSupportedKeyType(keyType)) {
    return c.json({ error: `Unsupported keyType: ${keyType}` }, 400);
  }

  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const { publicKey, message, signature } = body;

  if (typeof publicKey !== "string" || publicKey.length === 0) {
    return c.json({ error: "Missing or invalid publicKey" }, 400);
  }
  if (typeof message !== "string" || message.length === 0) {
    return c.json({ error: "Missing or invalid message" }, 400);
  }
  if (typeof signature !== "string" || signature.length === 0) {
    return c.json({ error: "Missing or invalid signature" }, 400);
  }

  const messageHex = bytesToHex(new TextEncoder().encode(message));
  const isValid = verify(keyType, publicKey, messageHex, signature);

  return c.json({ valid: isValid });
}
