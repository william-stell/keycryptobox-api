import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import app from "../../src/index";
import * as crypto from "crypto";

describe("GET /types", () => {
  it("should return supported keyTypes and hashTypes", async () => {
    const expectedKeyTypes = [];

    const expectedHashTypes = crypto.getHashes();

    const request = new Request("http://localhost/types", {
      method: "GET",
    });

    const response = await app.fetch(request);
    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toHaveProperty("keyTypes");
    expect(data).toHaveProperty("hashTypes");

    // expect(data.keyTypes).toEqual(expect.arrayContaining(expectedKeyTypes));
    expect(data.hashTypes).toEqual(expect.arrayContaining(expectedHashTypes));
  });
});
