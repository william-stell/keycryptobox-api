import type { Context } from "hono";

import { ed25519 } from "@noble/curves/ed25519";

export async function keyControllerPost(c: Context): Promise<Response> {

  // Generate private key
  const privateKeyRaw = ed25519.utils.randomPrivateKey();

  // Get public key
  const publicKeyRaw = ed25519.getPublicKey(privateKeyRaw);

  const privateKey = Buffer.from(privateKeyRaw).toString("hex");
  const publicKey = Buffer.from(publicKeyRaw).toString("hex");

  return c.json({
    keyType: "ed25519",
    privateKey,
    publicKey,
  });
}
