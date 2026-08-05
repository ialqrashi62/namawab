# F-1 Closeout — Auth Deep (PKCE / Passkeys / Refresh Token)

## ما أُنجز
| Mode | Deliverable | Path |
|---|---|---|
| F-1.1 | PKCE (RFC 7636) code_verifier + S256 challenge + verify | `namaweb/lib/auth/PKCE.js` |
| F-1.2 | Passkeys (WebAuthn sandbox API shape) | `namaweb/lib/auth/Passkeys.js` |
| F-1.3 | Refresh token rotation + revocation list + tombstone | `namaweb/middleware/refresh_token.js` |

## Smoke
```
PASS: 47 / 47   OK — all smoke tests passed.
```
Added in F-1 (2 tests):
- PKCE: verifier → S256 challenge, verify round-trip
- Passkeys + refresh token rotation (issue → rotate → revoke replay)

## Safety rails honoured
- RAIL-1: refresh tokens are random 32 bytes base64url; never persisted to disk.
- RAIL-5: refresh tokens bound to (userId, tenantId); cross-tenant issuance requires separate identity.
- RAIL-11: fail-closed — `REFRESH_REPLAY_DETECTED`, `REFRESH_REVOKED`, `REFRESH_EXPIRED`, `REFRESH_UNKNOWN` all throw named errors.
- RAIL-2: Passkeys never log attestation blob or signature.

## Phase ledger
| Marker | Status |
|---|---|
| v13.0 closeout | ✅ |
| F-1.1 PKCE | ✅ |
| F-1.2 Passkeys | ✅ |
| F-1.3 Refresh token | ✅ |
| Total smoke tests | 47/47 |
