# ZATCA Phase-2 — credential-ready status

`zatca_phase2.js` (+ 33/33 tests) completes the Phase-2 cryptographic pipeline **up to the credentialed
network call**. Phase-1 artifacts (UBL XML, QR tags 1-5, doc hash) remain in `finance_engine.js`.

## Built now (no ZATCA credential required)
- secp256k1 EC keypair generation (`generateKeyPair`) — the org owns this key.
- `invoiceHash` (base64 SHA-256 over canonical UBL) + PIH chain (`GENESIS_PIH`, `nextPih`).
- `signHashECDSA` / `verifyHashECDSA` — ECDSA over the invoice hash (QR tag 7), round-trip tested.
- `buildPhase2QR` — full 9-tag TLV QR (1-5 + 6 hash, 7 signature, 8 public key DER, 9 CA stamp).
- `generateCsrConfig` — exact ZATCA openssl CSR config (template OID 1.3.6.1.4.1.311.20.2 + SAN dirName)
  + the two openssl commands (Node stdlib cannot emit a PKCS#10 with ZATCA's custom SAN).
- `FatooraClient` — compliance / clearance(standard) / reporting(simplified) calls, **GATED**: throws
  `ZATCA_GATED` unless `enabled`, and `ZATCA_NO_CSID` unless a CSID+secret are configured. It transmits
  nothing by default.

## Credential boundary — needs the taxpayer's Fatoora portal (cannot be done for you)
1. Generate key + CSR with the emitted config:
   `openssl ecparam -name secp256k1 -genkey -noout -out ec-private.pem`
   `openssl req -new -sha256 -key ec-private.pem -extensions v3_req -config csr.cnf -out generated.csr`
2. In the org's Fatoora portal: get a one-time **OTP**, then `FatooraClient.submitCsr(base64(csr), otp)`
   → receive the **compliance CSID**.
3. Run the compliance checks, then request the **production CSID**.
4. Set env: `ZATCA_ENABLED=true`, `ZATCA_ENV=production`, `ZATCA_PROD_CSID`, `ZATCA_PROD_SECRET`,
   and the private key path. Wire `clearInvoice`/`reportInvoice` into `/api/zatca/submit` (the route
   already records intent + fail-closes today).

## Go-live wiring (one focused change, once CSID exists)
In `/api/zatca/submit`: build UBL → `invoiceHash` → `signHashECDSA` → `buildPhase2QR` → persist QR/hash →
`FatooraClient.clearInvoice|reportInvoice`. Store `clearance_status` + the returned cleared XML/QR.
Until then the module is INERT (imported by nothing), so it carries zero runtime risk.

## NOT deployed yet
Module lives in the repo only. Deploy + wiring happen together once the org has (at least sandbox) CSID,
so we can prove a real cleared invoice before flipping any flag on the live hospital.
