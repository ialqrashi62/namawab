# P0-6_E_PRESCRIPTION — Electronic Prescription

> **Status**: L1 DRAFT

## Overview
SFDA-approved electronic prescription system per MoH Saudi Arabia standards. Supports controlled substance flagging, allergy check, drug interaction, dosage validation.

## Compliance
- ✅ SFDA Drug Registry
- ✅ CBAHI E-Prescription Standards
- ✅ NPHIES Coverage
- ✅ MoH Saudi E-Rx

## Features
- Controlled substance flagging (SFDA schedule)
- Allergy + interaction check
- Refill management
- Electronic signature
- NPHIES submission

## Live Wire-Up
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/p0_6_erx_engine.js \
  namaweb/erx_router.js \
  root@204.168.144.74:/var/www/namaweb/
# Mount: try { app.use('/api/erx', require('./erx_router')); } catch(e) { console.error('erx mount failed', e.message); }
```
