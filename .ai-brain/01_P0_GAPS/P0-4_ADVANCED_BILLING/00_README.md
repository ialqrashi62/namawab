# P0-4_ADVANCED_BILLING — Advanced Billing Module

> **Status**: L1 DRAFT
> **Files**: 51/51

## Overview
NPHIES claims, ZATCA e-invoicing, and Saudi MoH billing per SFDA drug codes.

## Compliance
- ✅ NPHIES Bundles
- ✅ ZATCA Phase 2
- ✅ CBAHI Revenue Cycle
- ✅ SFDA Drug Codes
- ✅ MoH Saudi Billing

## Special Features
- **NPHIES Claims** — Auto-submission
- **ZATCA E-Invoicing** — Phase 2 B2B/B2C
- **Drug Code Mapping** — SFDA + NHIA
- **Insurance Pre-Auth** — Wateen
- **VAT Calculation** — 15% Saudi
- **Multi-locale** — AR/EN/FR/UR
- **RAG Pipeline**
- **Vector Store** — pgvector + HNSW

## Live Wire-Up
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/p0_4_billing_engine.js \
  namaweb/billing_router.js \
  root@204.168.144.74:/var/www/namaweb/
```
