import {
  sha256,
  sha384,
  sha512,
  sha224,
  sha512_224,
  sha512_256,
} from "@noble/hashes/sha2.js";
import { sha1, md5, ripemd160 } from "@noble/hashes/legacy.js";
import { utf8ToBytes } from "@noble/hashes/utils";
import type { HashType } from "../types";

const hashTypesData = {
  sha256: {
    description:
      "Widely used cryptographic hash function producing 256-bit output; standard in Bitcoin and many security protocols.",
    generateHash: (message: string) => {
      const input = utf8ToBytes(message);
      const hashBytes = sha256(input);

      // Convert to hex:
      const hashHex = Array.from(hashBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return {
        hash: hashHex,
      };
    },
  },
  ripemd160: {
    description:
      "160-bit hash function designed as an alternative to SHA-1; commonly used in Bitcoin for address generation.",
    generateHash: (message: string) => {
      const input = utf8ToBytes(message);
      const hashBytes = ripemd160(input);

      // Convert to hex:
      const hashHex = Array.from(hashBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return {
        hash: hashHex,
      };
    },
  },
  sha1: {
    description:
      "Cryptographic hash function producing a 160-bit output; once widely used but now considered insecure due to proven collision vulnerabilities.",
    generateHash: (message: string) => {
      const input = utf8ToBytes(message);
      const hashBytes = sha1(input);

      // Convert to hex:
      const hashHex = Array.from(hashBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return {
        hash: hashHex,
      };
    },
  },
};

export function isSupportedHashType(hashType: string): hashType is HashType {
  return hashType in hashTypesData;
}

export function getSupportedHashTypes() {
  return Object.entries(hashTypesData).map(([name, { description }]) => ({
    name,
    description,
  }));
}

export function generateHash(hashType: HashType, message: string) {
  return hashTypesData[hashType].generateHash(message);
}
