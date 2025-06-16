import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import app from "../../src/index";
import crypto from "crypto";

describe("POST /hash/:hashType", () => {
  it("POST /hash/sha256 should return correct hash", async () => {
    const message = "Hello, world!";
    const hashType = "sha256";

    // Expected hash computed locally using Node.js crypto
    const expectedHash = crypto
      .createHash(hashType)
      .update(message, "utf8")
      .digest("hex");

    const request = new Request(`http://localhost/hash/${hashType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        encoding: "utf8",
      }),
    });

    const response = await app.fetch(request);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("hash");
    expect(data.hash).toBe(expectedHash);
  });
});
