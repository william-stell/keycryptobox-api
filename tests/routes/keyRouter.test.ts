import { describe, it, expect } from "bun:test";
import app from "../../src/index";

import type { KeyData } from "../../src/types";

const hexRegex = /^[0-9a-fA-F]+$/;

describe("POST /key/:keyType endpoint - ed25519 key generation", () => {
  it("should return valid ed25519 key pair with hex keys and no address", async () => {
    const req = new Request("http://localhost:3000/key/ed25519", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.fetch(req);

    expect(response.status).toBe(200);
    expect(
      response.headers.get("content-type")?.includes("application/json")
    ).toBe(true);

    const data: KeyData = await response.json();

    expect(data.keyType).toBe("ed25519");
    expect(typeof data.privateKey).toBe("string");
    expect(typeof data.publicKey).toBe("string");
    expect(hexRegex.test(data.privateKey)).toBe(true);
    expect(hexRegex.test(data.publicKey)).toBe(true);
    expect(data.address).toBeUndefined();
  });
});
