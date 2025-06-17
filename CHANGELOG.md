# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-06-17

### Added

    - Released stable version 1.0.0.
    - Update README to include all API endpoints

## [0.3.0] - 2025-06-17

### Added

- `POST /key/:keyType` endpoint to compute key pair
- Validation and error handling for unsupported key types
- Tests for valid and invalid key type hashing
- Update supported `keyTypes` with description

## [0.2.0] - 2025-06-16

### Added

- `POST /hash/:hashType` endpoint to compute hashes (e.g. sha256, ripemd160, sha1)
- Validation and error handling for unsupported hash types
- Tests for valid and invalid hash type hashing
- `GET /types` endpoint to list supported `keyTypes` and `hashTypes`
- Test for `/types` response structure

## [0.1.0] - 2025-06-16

### Added

- Initial project setup with Bun and Hono
