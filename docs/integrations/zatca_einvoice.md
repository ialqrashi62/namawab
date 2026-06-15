# Integration — ZATCA E-Invoice (Phase 2 Integration / Fatoora)

> KSA Zakat, Tax & Customs Authority e-invoicing requirement; Phase 2 = real-time
> clearance/reporting via FATOORA.

## What we send
- **Standard tax invoice (B2B)**: cleared before issue.
- **Simplified tax invoice (B2C / patient bills)**: reported within 24 h.

## Integration mode
- **Clearance** for standard invoices: ZATCA returns signed XML before we render.
- **Reporting** for simplified: we sign and submit asynchronously; ZATCA returns ack.

## Auth & cryptography
- ECDSA secp256k1 keypair per device (CSID — Compliance/Production CSID).
- Onboarded via ZATCA portal; certificate stored in HSM/Vault.
- XMLDSig per UBL 2.1 invoice.

## Endpoints
| Phase | Endpoint |
|-------|----------|
| Onboarding | `/api/dev/onboarding/csids` |
| Compliance check | `/api/v2/compliance/invoices` |
| Reporting (simplified) | `/api/v2/invoices/reporting/single` |
| Clearance (standard) | `/api/v2/invoices/clearance/single` |

## XML structure (UBL 2.1)
- Invoice → AccountingSupplierParty (clinic), AccountingCustomerParty (patient/insurer),
  InvoiceLine (each service), TaxTotal, AllowanceCharge, AdditionalDocumentReference (ICV, PIH).
- QR code embedded (per ZATCA Phase 2 schema): seller name, VAT no, timestamp, amount,
  VAT amount, hash, signature.

## Mapping
| NamaMedical | ZATCA invoice |
|-------------|---------------|
| `invoices.id` | `cbc:ID` |
| `invoices.patient_name` (B2C) | `cac:AccountingCustomerParty/Party/PartyLegalEntity` |
| `invoices.total` | `cbc:PayableAmount` |
| Each `invoice_item` | `cac:InvoiceLine` |
| Service code | `cbc:Item/StandardItemIdentification` |
| 15% VAT | `cac:TaxTotal/cbc:TaxAmount` |
| ICV (counter) | continuous; persisted in DB |
| PIH (previous invoice hash) | computed from previous cleared/reported XML |

## Implementation pieces
- `zatca_signer.py` — ECDSA + canonicalize C14N + embed signature.
- `qr_builder.py` — TLV → base64 → QR PNG.
- `invoice_builder.py` — UBL 2.1 from internal Invoice model.
- `zatca_client.py` — submit + retry + idempotency on ICV.
- `pih_chain.py` — maintain previous-invoice-hash chain.

## Storage
- Signed XML stored in MinIO bucket `nama-zatca` immutable 6 y.
- Audit row per submission with response code + UUID.

## Failure modes
- Clearance refused → display error; do NOT issue invoice to patient.
- Reporting rejected → flag invoice for resubmit; daily reconciliation job.
- Cert expired → automatic alert 30 days before; rotation procedure.

## Monitoring
- `zatca_submissions_total{type,status}`
- Alert: < 99% success → Sev2 (CFO + platform).

## Compliance
- 6-year retention of signed XML + responses.
- Cert handling in HSM; rotation logged.
- All financial logs immutable.
