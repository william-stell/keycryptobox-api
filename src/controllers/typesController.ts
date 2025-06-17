import type { Context } from "hono";

import { getSupportedKeyTypes } from "../services/keyService";
import { getSupportedHashTypes } from "../services/hashService";

export async function typesControllerGet(c: Context): Promise<Response> {
  return c.json({
    keyTypes: getSupportedKeyTypes(),
    hashTypes: getSupportedHashTypes(),
  });
}
