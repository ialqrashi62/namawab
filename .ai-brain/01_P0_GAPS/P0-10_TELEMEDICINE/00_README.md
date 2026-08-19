# P0-10_TELEMEDICINE — Full Telemedicine Platform

> **Status**: L1 DRAFT

## Overview
WebRTC video + async chat + MoH Saudi telemedicine compliance. Supports prescriptions, vital signs, follow-up.

## Compliance
- ✅ MoH Saudi Telemedicine
- ✅ CBAHI Telehealth
- ✅ HIPAA-aligned
- ✅ SCFHS Provider License

## Features
- WebRTC video calls (DTLS-SRTP)
- Chat + file share
- Asynchronous consults
- E-prescription integration
- Vital signs stream (FHIR Observation)
- Follow-up scheduling

## Live Wire-Up
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/p0_10_tm_engine.js \
  namaweb/tm_router.js \
  root@204.168.144.74:/var/www/namaweb/
```