import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import app from "../../src/index";

import { generateHash } from "../../src/services/hashService";
import type { HashType } from "../../src/types";

// All expected hashes of "Hello, world!"
const expectedHashes = {
  sha256: "315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3",
  ripemd160: "58262d1fbdbe4530d8865d3518c6d6e41002610f",
  sha1: "943a702d06f34599aee1f8da8ef9f7296031d699",
  keccak256: "b6e16d27ac5ab427a7f68900ac5559ce272dc6c37c82b3e052246c82244c50e4",
}

describe("POST /hash/:hashType", () => {
  const testCases: HashType[] = ["sha256", "ripemd160", "sha1", "keccak256"];
  const message = "Hello, world!";

  for (const hashType of testCases) {
    it(`POST /hash/${hashType} should return correct hash`, async () => {
      const expectedHash = expectedHashes[hashType];

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
