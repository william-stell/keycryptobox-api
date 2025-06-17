import type { Context } from "hono";
import type { KeyData } from "../types";

import { isSupportedKeyType, generateKeyPair } from "../services/keyService";

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
