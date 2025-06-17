import { ed25519 } from "@noble/curves/ed25519";
import { secp256k1 } from "@noble/curves/secp256k1";
import { p256 } from "@noble/curves/p256";

import type { KeyType } from "../types";

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const keyTypesData = {
  ed25519: {
    description:
      "Fast, deterministic signatures with strong security; used in Signal, Monero, Stellar, Cardano, and SSH.",
    generateKeyPair: () => {
      const privateKeyRaw = ed25519.utils.randomPrivateKey();
      const publicKeyRaw = ed25519.getPublicKey(privateKeyRaw);
      return {
        privateKey: toHex(privateKeyRaw),
        publicKey: toHex(publicKeyRaw),
      };
    },
  },
  secp256k1: {
    description:
      "Widely used in Bitcoin, Ethereum, and Litecoin; optimized for fast multiplication and popular in blockchain applications.",
    generateKeyPair: () => {
      const privateKeyRaw = secp256k1.utils.randomPrivateKey();
      const publicKeyRaw = secp256k1.getPublicKey(privateKeyRaw);
      return {
        privateKey: toHex(privateKeyRaw),
        publicKey: toHex(publicKeyRaw),
      };
    },
  },
  secp256r1: {
    description:
      "Most widely used NIST curve, common in TLS/SSL and government standards.",
    generateKeyPair: () => {
      const privateKeyRaw = p256.utils.randomPrivateKey();
      const publicKeyRaw = p256.getPublicKey(privateKeyRaw);
      return {
        privateKey: toHex(privateKeyRaw),
        publicKey: toHex(publicKeyRaw),
      };
    },
  },
};

export function isSupportedKeyType(keyType: string): keyType is KeyType {
  return keyType in keyTypesData;
}

export function getSupportedKeyTypes() {
  return Object.entries(keyTypesData).map(([name, { description }]) => ({
    name,
    description,
  }));
}

export function generateKeyPair(keyType: KeyType) {
  return keyTypesData[keyType].generateKeyPair();
}
