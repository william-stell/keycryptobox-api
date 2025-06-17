import type { Context } from "hono";
import { isSupportedHashType, generateHash } from "../services/hashService";

export async function hashControllerPost(c: Context): Promise<Response> {
  const hashType = c.req.param("hashType");

  if (!hashType || !isSupportedHashType(hashType)) {
    return c.json({ error: `Unsupported hash type: ${hashType}` }, 400);
  }

  const { message } = await c.req.json();

  const { hash } = generateHash(hashType, message);

  return c.json({ hash });
}
