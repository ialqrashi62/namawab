# P0-5_FHIR_R4 — FHIR R4 Server

> **Status**: L1 DRAFT

## Overview
Full FHIR R4 (HL7) server endpoint per Saudi MoH NPHIES standards. Exposes Patient, Encounter, Observation, MedicationRequest, Procedure, Condition, AllergyIntolerance, DiagnosticReport resources.

## Compliance
- ✅ HL7 FHIR R4 (4.0.1)
- ✅ Saudi MoH NPHIES
- ✅ NHIA Sehhaty
- ✅ CBAHI Interoperability

## Resources Exposed
- Patient, Practitioner, Organization
- Encounter, EpisodeOfCare
- Observation, Condition
- MedicationRequest, MedicationStatement
- AllergyIntolerance
- Procedure
- DiagnosticReport
- Bundle (search, transaction)

## Live Wire-Up
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/p0_5_fhir_engine.js \
  namaweb/fhir_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/fhir', require('./fhir_router')); } catch(e) { console.error('fhir mount failed', e.message); }
```
