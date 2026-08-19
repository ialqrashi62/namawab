# P0-9_IMMUNIZATION — National Immunization Registry (MoH)

> **Status**: L1 DRAFT

## Overview
Full immunization registry connected to Saudi MoH. Supports all WHO and MoH-approved vaccines (EPI), tracks cold chain, adverse events, and contraindications.

## Compliance
- ✅ MoH Saudi EPI Schedule
- ✅ WHO PQS Cold Chain
- ✅ CDC ACIP
- ✅ HL7 VXU (Vaccine Update)

## Features
- EPI schedule per age
- Cold chain tracking
- AEFI (Adverse Event Following Immunization)
- Catch-up schedules
- Contraindication checks
- Lot number tracking

## Live Wire-Up
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/p0_9_imm_engine.js \
  namaweb/imm_router.js \
  root@204.168.144.74:/var/www/namaweb/
```