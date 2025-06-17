import { describe, it, expect } from "bun:test";
import app from "../../src/index";

import type { KeyData } from "../../src/types";

import { ed25519 } from "@noble/curves/ed25519";
import { secp256k1 } from "@noble/curves/secp256k1";
import { p256 } from "@noble/curves/p256";

const hexRegex = /^[0-9a-fA-F]+$/;

const curves = {
  ed25519: {
    lib: ed25519,
    expectedPubLen: 64,
  },
  secp256k1: {
    lib: secp256k1,
    expectedPubLen: [66, 130],
  },
  secp256r1: {
    lib: p256,
    expectedPubLen: [66, 130],
  },
} as const;

describe.each(Object.entries(curves))(
  "POST /key/:keyType - %s",
  (keyType, { lib, expectedPubLen }) => {
    it(`should return valid ${keyType} key pair`, async () => {
      const req = new Request(`http://localhost:3000/key/${keyType}`, {
        method: "POST",
      });
      const response = await app.fetch(req);
      const data: KeyData = await response.json();

      expect(response.status).toBe(200);
      expect(data.keyType).toBe(keyType);
      expect(hexRegex.test(data.privateKey)).toBe(true);
      expect(hexRegex.test(data.publicKey)).toBe(true);
      expect(data.privateKey.length).toBe(64);

      if (Array.isArray(expectedPubLen)) {
        expect(expectedPubLen).toContain(data.publicKey.length);
      } else {
        expect(data.publicKey.length).toBe(expectedPubLen);
      }

      const privBytes = Uint8Array.from(Buffer.from(data.privateKey, "hex"));
      const pubBytes = lib.getPublicKey(privBytes);
      expect(Buffer.from(pubBytes).toString("hex")).toBe(data.publicKey);

      const msg = new TextEncoder().encode("test message");
      const signature = lib.sign(msg, privBytes);
      const verified = lib.verify(signature, msg, pubBytes);
      expect(verified).toBe(true);

      expect(data.address).toBeUndefined();
    });
  }
);

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
