import type { Context } from "hono";
import type { KeyData } from "../types";

import { ed25519 } from "@noble/curves/ed25519";
import { secp256k1 } from "@noble/curves/secp256k1";

export async function keyControllerPost(c: Context): Promise<Response> {
  const keyType = c.req.param("keyType");

  if (!keyType || !keyType.length) {
    return c.json({ error: "Missing keyType parameter" }, 400);
  }

  let privateKeyRaw: Uint8Array;
  let publicKeyRaw: Uint8Array;

  switch (keyType.toLowerCase()) {
    case "ed25519":
      privateKeyRaw = ed25519.utils.randomPrivateKey();
      publicKeyRaw = ed25519.getPublicKey(privateKeyRaw);
      break;

    case "secp256k1":
      privateKeyRaw = secp256k1.utils.randomPrivateKey();
      publicKeyRaw = secp256k1.getPublicKey(privateKeyRaw);
      break;

    default:
      return c.json({ error: `Unsupported keyType: ${keyType}` }, 400);
  }

  const privateKey = Buffer.from(privateKeyRaw).toString("hex");
  const publicKey = Buffer.from(publicKeyRaw).toString("hex");

  const keyData: KeyData = {
    keyType: keyType.toLowerCase(),
    privateKey,
    publicKey,
  };

  return c.json(keyData);
}
