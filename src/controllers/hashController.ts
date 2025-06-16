import type { Context } from "hono";
import crypto from "crypto";

export async function hashControllerPost(c: Context): Promise<Response> {
  const hashType = c.req.param("hashType");

  const supportedHashes = crypto.getHashes();

  if (!hashType || !supportedHashes.includes(hashType)) {
    return c.json({ error: `Unsupported hash type: ${hashType}` }, 400);
  }

  const { message } = await c.req.json();

  const hash = crypto
    .createHash(hashType)
    .update(message, "utf8")
    .digest("hex");
  return c.json({ hash });
}
