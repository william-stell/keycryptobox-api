import { describe, it, expect } from "bun:test";

import {
  isSupportedKeyType,
  getSupportedKeyTypes,
  generateKeyPair,
  sign,
  verify,
} from "../../src/services/keyService";
import type { KeyType } from "../../src/types";

describe("keyTypesData module", () => {
  const validKeyTypes: KeyType[] = ["ed25519", "secp256k1", "secp256r1"];

  describe("isSupportedKeyType", () => {
    it("returns true for supported key types", () => {
      validKeyTypes.forEach((keyType) => {
        expect(isSupportedKeyType(keyType)).toBe(true);
      });
    });

    it("returns false for unsupported key types", () => {
      expect(isSupportedKeyType("rsa")).toBe(false);
      expect(isSupportedKeyType("")).toBe(false);
      expect(isSupportedKeyType("invalidKeyType")).toBe(false);
    });
  });

  describe("getSupportedKeyTypes", () => {
    it("returns array of supported key types with descriptions", () => {
      const supported = getSupportedKeyTypes();
      expect(supported.length).toBe(validKeyTypes.length);
      validKeyTypes.forEach((keyType) => {
        expect(supported).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: keyType, description: expect.any(String) }),
          ])
        );
      });
    });
  });

  describe("generateKeyPair", () => {
    it("generates valid key pairs for supported key types", () => {
      validKeyTypes.forEach((keyType) => {
        const keyPair = generateKeyPair(keyType);
        expect(keyPair).toHaveProperty("privateKey");
        expect(keyPair).toHaveProperty("publicKey");
        expect(typeof keyPair.privateKey).toBe("string");
        expect(typeof keyPair.publicKey).toBe("string");
        expect(keyPair.privateKey.length).toBeGreaterThan(0);
        expect(keyPair.publicKey.length).toBeGreaterThan(0);
      });
    });

    it("throws error for unsupported key type", () => {
      expect(() => generateKeyPair("rsa" as KeyType)).toThrow("Invalid keyType: rsa");
    });
  });

  describe("sign and verify", () => {
    const messageHex = "68656c6c6f20776f726c64"; // "hello world" in hex

    validKeyTypes.forEach((keyType) => {
      it(`signs and verifies a message with ${keyType}`, () => {
        const { privateKey, publicKey } = generateKeyPair(keyType);

        const signature = sign(keyType, privateKey, messageHex);
        expect(typeof signature).toBe("string");
        expect(signature.length).toBeGreaterThan(0);

        const isValid = verify(keyType, publicKey, messageHex, signature);
        expect(isValid).toBe(true);

        // Invalid signature should fail
        const invalidSig = signature.slice(0, -2) + "00";
        expect(verify(keyType, publicKey, messageHex, invalidSig)).toBe(false);
      });
    });

    it("throws error for unsupported key type in sign", () => {
      expect(() => sign("rsa" as KeyType, "abc", messageHex)).toThrow("Invalid keyType: rsa");
    });

    it("throws error for unsupported key type in verify", () => {
      expect(() => verify("rsa" as KeyType, "abc", messageHex, "def")).toThrow(
        "Invalid keyType: rsa"
      );
    });
  });
});