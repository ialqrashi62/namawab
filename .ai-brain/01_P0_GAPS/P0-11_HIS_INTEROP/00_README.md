# P0-11_HIS_INTEROP — HIS Interoperability Bridges

> **Status**: L1 DRAFT

## Overview
HL7 v2.x + FHIR R4 + DICOM + X12 bridges for connecting NamaMedical to external HIS systems.

## Compliance
- ✅ HL7 v2.5 / v2.7
- ✅ FHIR R4
- ✅ DICOM 3.0
- ✅ IHE PCD/HIE
- ✅ MoH Saudi NHIE

## Bridges
- HL7 ADT (Patient Admin)
- HL7 ORM/ORU (Orders/Results)
- HL7 MDM (Documents)
- FHIR R4 REST
- DICOM C-STORE/C-FIND
- X12 270/271 (Eligibility)
- X12 837/835 (Claims)

## Live Wire-Up
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/p0_11_hl7_engine.js \
  namaweb/hl7_router.js \
  root@204.168.144.74:/var/www/namaweb/
```