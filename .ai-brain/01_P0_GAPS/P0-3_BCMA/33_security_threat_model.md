# P0-3 BCMA — Security Threat Model (STRIDE)

| Threat | Vector | Mitigation |
|---|---|---|
| **Spoofing** | Fake barcode to bypass 5 Rights | Barcode includes encrypted patient_id HMAC; verify server-side |
| **Tampering** | Modify MAR entry after administration | Hash-chained audit log; append-only entries |
| **Repudiation** | Nurse denies administering | All scans logged with nurse badge + timestamp + IP |
| **Information Disclosure** | PHI leak in logs | No PHI in console.log; only IDs |
| **Denial of Service** | Spam scans | Rate limit per nurse_id (60/min) |
| **Elevation of Privilege** | Nurse overrides high-alert without witness | Witness must scan own badge, recorded separately |

## Compliance
- ✅ TJC NPSG.03.04.01 (Medication Safety)
- ✅ ISMP 5 Rights
- ✅ SFDA Saudi Drug Safety
- ✅ HIPAA 21 CFR 11 (electronic records, signatures)
- ✅ PDPL Saudi Data Protection