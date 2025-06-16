import type { Context } from "hono";
import crypto from "crypto";

export async function hashControllerPost(c: Context): Promise<Response> {
  const { message } = await c.req.json();
  const hash = crypto
    .createHash("sha256")
    .update(message, "utf8")
    .digest("hex");
  return c.json({ hash });
}
