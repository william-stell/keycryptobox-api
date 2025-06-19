export type KeyType =
  | "ed25519"
  | "secp256k1"
  | "secp256r1"
  | "secp384r1"
  | "secp521r1";

export type KeyPair = {
  publicKey: string;
  privateKey: string;
};

/**
 * Represents a generated asymmetric key pair.
 */
export type KeyData = {
  /**
   * The algorithm or curve used for key generation.
   * Examples: 'secp256k1', 'ed25519', etc.
   */
  keyType: KeyType;

  /**
   * The private key as a hex-encoded string.
   * Keep this secure and do not expose unnecessarily.
   */
  privateKey: string;

  /**
   * The public key as a hex-encoded string.
   */
  publicKey: string;

  /**
   * Optional user-friendly address derived from the public key.
   * Present if applicable (e.g., Bitcoin, Ethereum addresses).
   */
  address?: string;
};

export type HashType = "sha256" | "ripemd160" | "sha1" | "keccak256";
