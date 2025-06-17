# KeyCryptoBox API

A fast and minimal REST API for cryptographic operations: key generation, message signing, signature verification, and hashing.  
Built with [Bun](https://bun.sh/) and [Hono](https://hono.dev/) for performance and simplicity.

## Tech Stack

- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Hono](https://hono.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

1. Clone the repository
2. Run `bun install`
3. Start the server with `bun start`
4. Visit `http://localhost:3000`

## API Endpoint

### GET /types

Retrieves the supported cryptographic key types and hash types.

#### Response

- **Status:** `200 OK`
- **Content-Type:** `application/json`

#### Example Response

```json
{
  "keyTypes": [
    { "name": "ed25519", "description": "..." },
    { "name": "secp256k1", "description": "..." },
    { "name": "secp256r1", "description": "..." }
  ],
  "hashTypes": [
    { "name": "sha256", "description": "..." },
    { "name": "ripemd160", "description": "..." },
    { "name": "sha1", "description": "..." }
  ]
}
```

### POST /key/:keyType

Generates a new public/private key pair for the specified key algorithm.

#### Request

- No request body required.

#### Example Request

```bash
curl -X POST localhost:3000/key/ed25519
```

#### Response

- **Status:** `200 OK`
- **Content-Type:** `application/json`

#### Example Response

```json
{
  "keyType": "ed25519",
  "privateKey": "dc5ddd10b344743e0d6829e3346048340a868103671357af7082c2e98225306f",
  "publicKey": "dd91c942422f3023625f58e8fc8195caa7f117d6c059884eee54abed0f9fa196"
}
```

### POST /hash/:hashType

Computes the hash of a given message using the specified hashing algorithm.

#### Request

- **Content-Type:** `application/json`
- **Body:**

```json
{
  "message": "string"
}
```

#### Example Request

```bash
curl -X POST localhost:3000/hash/sha256 \
     -H "Content-Type: application/json" \
     -d '{"message":"hello"}'
```

#### Response

- **Status:** `200 OK`
- **Content-Type:** `application/json`

#### Example Response

```json
{
  "hash": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}
```

## License

MIT License
