import { describe, it, expect } from "bun:test";
import app from "../../src/index";

import * as keyService from "../../src/services/keyService";
import type { KeyType } from "../../src/types";
import { bytesToHex } from "@noble/hashes/utils";

const curves: KeyType[] = ["ed25519", "secp256k1", "secp256r1"];

describe.each(curves)("POST /key/:keyType/sign - %s", (keyType) => {
  it("should sign a message", async () => {
    const { privateKey } = keyService.generateKeyPair(keyType);
    const message = "test message";

    const req = new Request(`http://localhost/key/${keyType}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ privateKey, message }),
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const { signature } = await res.json();
    expect(typeof signature).toBe("string");
    expect(signature.length).toBeGreaterThan(0);
  });

  it("should return 400 if privateKey is missing", async () => {
    const req = new Request(`http://localhost/key/${keyType}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "test message" }),
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("should return 400 if message is missing", async () => {
    const { privateKey } = keyService.generateKeyPair(keyType);

    const req = new Request(`http://localhost/key/${keyType}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ privateKey }),
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });
});

describe.each(curves)("POST /key/:keyType/verify - %s", (keyType) => {
  it("should verify a valid signature", async () => {
    const { privateKey, publicKey } = keyService.generateKeyPair(keyType);
    const message = "test message";
    const messageHex = bytesToHex(new TextEncoder().encode(message));
    const signature = keyService.sign(keyType, privateKey, messageHex);

    const req = new Request(`http://localhost/key/${keyType}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey, message, signature }),
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const { valid } = await res.json();
    expect(valid).toBe(true);
  });

  it("should reject an invalid signature", async () => {
    const { publicKey } = keyService.generateKeyPair(keyType);
    const message = "test message";
    const badSignature = "00".repeat(64);

    const req = new Request(`http://localhost/key/${keyType}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey, message, signature: badSignature }),
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const { valid } = await res.json();
    expect(valid).toBe(false);
  });

  it("should return 400 if publicKey is missing", async () => {
    const message = "test message";
    const signature = "00".repeat(64);

    const req = new Request(`http://localhost/key/${keyType}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, signature }),
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("should return 400 if message is missing", async () => {
    const { publicKey } = keyService.generateKeyPair(keyType);
    const signature = "00".repeat(64);

    const req = new Request(`http://localhost/key/${keyType}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey, signature }),
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("should return 400 if signature is missing", async () => {
    const { publicKey } = keyService.generateKeyPair(keyType);
    const message = "test message";

    const req = new Request(`http://localhost/key/${keyType}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey, message }),
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });
});

describe("POST /key/:keyType - error handling", () => {
  it("should return 400 for missing keyType", async () => {
    const req = new Request(`http://localhost/key/`, {
      method: "POST",
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("should return 400 for unsupported keyType", async () => {
    const req = new Request(`http://localhost/key/invalidCurve`, {
      method: "POST",
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Unsupported keyType: invalidCurve");
  });
});
