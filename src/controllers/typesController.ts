import type { Context } from "hono";
import crypto from "crypto";

export async function typesControllerGet(c: Context): Promise<Response> {
  return c.json({ keyTypes: [], hashTypes: crypto.getHashes() });
}
