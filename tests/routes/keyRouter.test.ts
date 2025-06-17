import { describe, it, expect } from "bun:test";
import app from "../../src/index";

import type { KeyData } from "../../src/types";

import { ed25519 } from "@noble/curves/ed25519";
import { secp256k1 } from "@noble/curves/secp256k1";

const hexRegex = /^[0-9a-fA-F]+$/;

describe("POST /key/:keyType endpoint", () => {
  it("should return valid ed25519 key pair", async () => {
    const req = new Request("http://localhost:3000/key/ed25519", {
      method: "POST",
    });
    const response = await app.fetch(req);
    const data: KeyData = await response.json();

    expect(data.keyType).toBe("ed25519");
    expect(hexRegex.test(data.privateKey)).toBe(true);
    expect(hexRegex.test(data.publicKey)).toBe(true);
    expect(data.privateKey.length).toBe(64); // 32 bytes * 2 hex chars
    expect(data.publicKey.length).toBe(64);

    // Verify public key can be derived from private key
    const privBytes = Uint8Array.from(Buffer.from(data.privateKey, "hex"));
    const pubBytes = ed25519.getPublicKey(privBytes);
    expect(Buffer.from(pubBytes).toString("hex")).toBe(data.publicKey);

    // Optionally sign and verify
    const msg = new TextEncoder().encode("test message");
    const signature = ed25519.sign(msg, privBytes);
    expect(ed25519.verify(signature, msg, pubBytes)).toBe(true);

    expect(data.address).toBeUndefined();
  });

  it("should return valid secp256k1 key pair", async () => {
    const req = new Request("http://localhost:3000/key/secp256k1", {
      method: "POST",
    });
    const response = await app.fetch(req);
    const data: KeyData = await response.json();

    expect(data.keyType).toBe("secp256k1");
    expect(hexRegex.test(data.privateKey)).toBe(true);
    expect(hexRegex.test(data.publicKey)).toBe(true);

    expect(data.privateKey.length).toBe(64); // 32 bytes * 2 hex chars
    // Public key length can be compressed (66 hex) or uncompressed (130 hex)
    expect([66, 130]).toContain(data.publicKey.length);

    // Verify public key derived from private key
    const privBytes = Uint8Array.from(Buffer.from(data.privateKey, "hex"));
    const pubBytes = secp256k1.getPublicKey(privBytes);
    expect(Buffer.from(pubBytes).toString("hex")).toBe(data.publicKey);

    // Optionally sign and verify
    const msg = new TextEncoder().encode("test message");
    const signature = secp256k1.sign(msg, privBytes);
    const valid = secp256k1.verify(signature, msg, pubBytes);
    expect(valid).toBe(true);

    expect(data.address).toBeUndefined();
  });

  describe("POST /key/:keyType endpoint - error handling", () => {
    it("should return 400 for missing keyType", async () => {
      const req = new Request("http://localhost:3000/key/", {
        method: "POST",
      });

      const response = await app.fetch(req);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it("should return 400 for unsupported keyType", async () => {
      const req = new Request("http://localhost:3000/key/unsupportedkeytype", {
        method: "POST",
      });

      const response = await app.fetch(req);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Unsupported keyType: unsupportedkeytype");
    });
  });
});
