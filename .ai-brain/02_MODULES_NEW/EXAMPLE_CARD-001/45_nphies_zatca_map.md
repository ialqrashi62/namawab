# 45 — NPHIES / ZATCA Map (CARD-001)

> Owner: CQO · Tier 1

## NPHIES — National Platform for Health Insurance Exchange Services

### Cardiology bundles (most common)

| Bundle Code | Name | Components | Use |
|-------------|------|------------|-----|
| NPH-CARD-001 | Cardiology outpatient consult | Visit + ECG + plan | New consult, follow-up |
| NPH-CARD-002 | Cardiology follow-up | Visit + ECG | Established patient |
| NPH-CARD-005 | Hypertension management | Visit + labs | HTN clinic |
| NPH-CARD-014 | Heart failure clinic | Visit + ECG + BNP | HF clinic |
| NPH-CARD-019 | Atrial fibrillation | Visit + ECG + anticoag | AF clinic |
| NPH-CARD-022 | Aortic stenosis workup | Visit + echo | AS workup |
| NPH-CARD-PCI | PCI procedure | Cath + stent + drugs | PCI |
| NPH-CARD-DIAG | Diagnostic cath | Cath + images | Diagnostic |
| NPH-CARD-EP | EP study + ablation | EP lab + ablation | EP |
| NPH-CARD-DEV | Device implant | PM/ICD/CRT + procedure | Device |
| NPH-CARD-NUC | Nuclear cardiology | SPECT/PET MPI | Nuclear |
| NPH-CARD-STRESS | Stress test | Treadmill/pharmacologic | Stress lab |
| NPH-CARD-ECHO | Echocardiography | TTE/TEE | Echo lab |
| NPH-CARD-HOLTER | Holter | 24h-7d Holter | Holter |

### NPHIES workflow

```
1. Encounter closed
   ↓
2. Cardio_cath / cardio_devices / cardio_encounters signed
   ↓
3. Billing system auto-creates claim draft
   ↓
4. Eligibility check (NPHIES pre-auth if required)
   ↓
5. Doctor/billing review
   ↓
6. Submit to NPHIES with Idempotency-Key
   ↓
7. NPHIES response: approved / denied / partial
   ↓
8. If approved: amount + co-pay
9. If denied: queue for review + appeal
10. If partial: queue for reconciliation
11. Payment posting
12. Reconciliation
```

### NPHIES request format

```json
{
  "nphies_request_id": "uuid",
  "tenant_id": "uuid",
  "encounter_id": "uuid",
  "patient_id": "uuid",
  "insurance_no": "string",
  "payer_id": "string",
  "service_date": "YYYY-MM-DD",
  "diagnosis_codes": [
    { "type": "ICD-10", "code": "I21.01", "description": "STEMI anterior" }
  ],
  "procedure_codes": [
    { "type": "CPT-4", "code": "92928", "description": "PCI with stent" }
  ],
  "bundles": [
    { "code": "NPH-CARD-PCI", "lines": [ { "code": "...", "qty": 1, "unit_price": 25000, "currency": "SAR" } ] }
  ],
  "total_amount": 25000,
  "currency": "SAR",
  "attachments": [
    { "type": "cath_report", "file_id": "uuid" },
    { "type": "ecg", "file_id": "uuid" }
  ]
}
```

### NPHIES response format

```json
{
  "nphies_claim_id": "uuid",
  "nphies_request_id": "uuid",
  "status": "approved | denied | partial | pending",
  "response_code": "string",
  "approved_amount": 25000,
  "denied_amount": 0,
  "co_pay_amount": 2500,
  "reasons": [],
  "next_steps": "string"
}
```

### NPHIES error codes

| Code | Meaning | Action |
|------|---------|--------|
| NPH-001 | Patient not eligible | Verify insurance |
| NPH-002 | Service not covered | Check bundle |
| NPH-003 | Pre-auth required | Submit pre-auth |
| NPH-004 | Diagnosis-procedure mismatch | Update dx |
| NPH-005 | Bundle error | Validate bundle |
| NPH-006 | Payer down | Retry later |
| NPH-007 | Amount over limit | Adjust or appeal |
| NPH-008 | Duplicate claim | Idempotency caught |

### NPHIES retries

- Transient (NPH-006): exponential backoff, 3 retries
- Validation (NPH-001..005): manual review queue
- Permanent (NPH-007, NPH-008): appeal workflow

## ZATCA — Zakat, Tax and Customs Authority (E-Invoicing / FATOORA)

### Cardiology relevance

- Pharmacy prescriptions: ZATCA Phase 2 (UBL XAdES)
- Procedural billing: via NPHIES (not direct ZATCA)
- Out-of-pocket payments (e.g. non-covered services): ZATCA Phase 2 invoice

### ZATCA Phase 2 (currently blocked on real CSID/OTP — see GATE 9)

```yaml
zatca:
  status: blocked
  blocked_on: real_csid + otp
  blocker: docs/GATE9_ZATCA_UBL_XADES_BLOCKED_AR.md
  read_only_components:
    - zatca_phase2.js
    - ZATCA_PHASE2_READINESS.md
    - zatca_phase2_integration_test.js
    - zatca_phase2_test.js
  ready_components:
    - UBL 2.1 XML generation
    - XAdES-BES signature
    - QR code generation
    - Counterfactual UUID (CFDI)
  requires:
    - real CSID (Compliance CSID + Production CSID)
    - OTP device
    - ZATCA portal credentials
```

### ZATCA invoice format (when ready)

```xml
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <ID>INV-2026-001</ID>
  <IssueDate>2026-07-27</IssueDate>
  <IssueTime>01:00:00</IssueTime>
  <InvoiceTypeCode>388</InvoiceTypeCode>
  <DocumentCurrencyCode>SAR</DocumentCurrencyCode>
  <TaxCurrencyCode>SAR</TaxCurrencyCode>
  <AccountingSupplierParty>...</AccountingSupplierParty>
  <AccountingCustomerParty>...</AccountingCustomerParty>
  <LegalMonetaryTotal>
    <LineExtensionAmount currencyID="SAR">25000.00</LineExtensionAmount>
    <TaxExclusiveAmount currencyID="SAR">25000.00</TaxExclusiveAmount>
    <TaxInclusiveAmount currencyID="SAR">28750.00</TaxInclusiveAmount>
    <PayableAmount currencyID="SAR">28750.00</PayableAmount>
  </LegalMonetaryTotal>
  <InvoiceLine>...</InvoiceLine>
  <UBLExtensions>
    <UBLExtension>
      <ExtensionURI>urn:oasis:names:specification:ubl:dsig:signature</ExtensionURI>
      <ExtensionContent>
        <sig:Signature>...</sig:Signature>
      </ExtensionContent>
    </UBLExtension>
  </UBLExtensions>
</Invoice>
```

### VAT

- 15% standard (KSA)
- Server-side calculation only (snippet:money-vat)
- `finance_engine.vatFromInclusive` and `parseMoney` only
- Never trust client totals

## Mapping summary

| Activity | NPHIES | ZATCA | Server-side money | Tenant-scoped |
|----------|--------|-------|-------------------|---------------|
| Cardiology consult | bundle NPH-CARD-001/002 | — | yes (server) | yes |
| ECG | bundled in consult | — | — | yes |
| Echo | bundle NPH-CARD-ECHO | — | yes | yes |
| Stress | bundle NPH-CARD-STRESS | — | yes | yes |
| Cath | bundle NPH-CARD-PCI/DIAG | — | yes (server) | yes |
| Device | bundle NPH-CARD-DEV | — | yes (server) | yes |
| Prescription | pharmacy claim | ZATCA invoice (when ready) | yes (server) | yes |
| Out-of-pocket | — | ZATCA invoice (when ready) | yes (server) | yes |
