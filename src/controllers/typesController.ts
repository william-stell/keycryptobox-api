import type { Context } from "hono";
import * as crypto from "crypto";

import { getSupportedKeyTypes } from "../services/keyService";

export async function typesControllerGet(c: Context): Promise<Response> {
  return c.json({
    keyTypes: getSupportedKeyTypes(),
    hashTypes: crypto.getHashes(),
  });
}
