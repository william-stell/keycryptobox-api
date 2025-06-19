import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import app from "../src/index";
import { serve } from "bun";

import type { KeyPair } from "../src/types";

let server: ReturnType<typeof serve>;
const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

beforeAll(() => {
  server = serve({
    fetch: app.fetch,
    port: 4321,
  });
});

afterAll(() => {
  server?.stop?.();
});

describe("KeyCryptoBox API", () => {
  let keyPair: KeyPair;
  let signature: string;
  const message = "Hello, world!";

  it("GET /types should return supported key and hash types", async () => {
    const res = await fetch(`${BASE_URL}/types`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("keyTypes");
    expect(json).toHaveProperty("hashTypes");
  });

  it("POST /key/ed25519 should generate a key pair", async () => {
    const res = await fetch(`${BASE_URL}/key/ed25519`, {
      method: "POST",
    });
    expect(res.status).toBe(200);
    const json: KeyPair = (await res.json()) as KeyPair;
    expect(json).toHaveProperty("publicKey");
    expect(json).toHaveProperty("privateKey");
    keyPair = json;
  });

  it("POST /key/ed25519/sign should return a signature", async () => {
    const res = await fetch(`${BASE_URL}/key/ed25519/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        privateKey: keyPair.privateKey,
        message,
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("signature");
    signature = json.signature;
  });

  it("POST /key/ed25519/verify should validate the signature", async () => {
    const res = await fetch(`${BASE_URL}/key/ed25519/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publicKey: keyPair.publicKey,
        message,
        signature,
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.valid).toBe(true);
  });

  it("POST /hash/sha256 should return a hash", async () => {
    const res = await fetch(`${BASE_URL}/hash/sha256`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("hash");
    expect(typeof json.hash).toBe("string");
  });
});
