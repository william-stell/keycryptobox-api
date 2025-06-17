import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import app from "../../src/index";
import * as crypto from "crypto";

describe("POST /hash/:hashType", () => {
  const testCases = ["sha256", "ripemd160", "sha1"];
  const message = "Hello, world!";

  for (const hashType of testCases) {
    it(`POST /hash/${hashType} should return correct hash`, async () => {
      const expectedHash = crypto
        .createHash(hashType)
        .update(message, "utf8")
        .digest("hex");

      const request = new Request(`http://localhost/hash/${hashType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, encoding: "utf8" }),
      });

      const response = await app.fetch(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("hash");
      expect(data.hash).toBe(expectedHash);
    });
  }

  it("POST /hash/invalidhash should return 400 for unsupported hash type", async () => {
    const hashType = "invalidhash";

    const request = new Request(`http://localhost/hash/${hashType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, encoding: "utf8" }),
    });

    const response = await app.fetch(request);

    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toMatch(/unsupported hash type/i);
  });
});
