# Pharmacy Benchmark — Epic, Cerner, MEDITECH, SFDA Saudi

## Mandatory features

### 1. Drug Database
- [x] SFDA registered drugs (Saudi formulary) — `pharmacy_engine.drugs`
- [x] 20+ drug-drug interactions (warfarin/fluconazole, etc.) — **shipped**
- [x] Pregnancy category (FDA A/B/C/D/X) — **shipped**
- [ ] SFDA national drug code
- [ ] ATC classification
- [ ] Saudi MoH formulary alignment

### 2. Order Entry
- [x] Dose calculation by weight, BSA, age — `pharmacy_engine.dose`
- [x] Renal adjustment (Cockcroft-Gault) — **shipped**
- [ ] Hepatic adjustment (Child-Pugh)
- [ ] Geriatric (Beers criteria)
- [ ] Pediatric weight-based dosing
- [ ] IV compatibility checker
- [ ] TALLman lettering for look-alike/sound-alike

### 3. Clinical Decision Support
- [x] Allergy check
- [x] Drug-drug interaction — **shipped**
- [x] Drug-food interaction
- [ ] Duplicate therapy
- [ ] Renal dose alerts (CrCl-based)
- [ ] Pregnancy alerts
- [ ] Lactation alerts
- [ ] Pharmacogenomic alerts (CYP2D6, CYP2C19)

### 4. Dispensing
- [ ] Unit-dose cart fill
- [ ] IV admixture (TPN, chemotherapy)
- [ ] Narcotic double-locked cabinet
- [ ] Barcode scan at dispense

### 5. Administration (BCMA)
- [x] Right patient, right drug, right dose, right route, right time — `barcode-meds.js`
- [ ] Barcode scanning at bedside
- [ ] Override audit
- [ ] PRN effectiveness documentation

### 6. Controlled Substances
- [ ] DEA/SFDA schedule tracking
- [ ] Wastage witness
- [ ] Audit trail (SFDA requirement)

### 7. Chemotherapy (cross-link oncology)
- [ ] Closed-system transfer device
- [ ] USP <800> compliance
- [ ] Spill kit location

### 8. Antimicrobial Stewardship
- [ ] Days of therapy (DOT)
- [ ] Defined daily dose (DDD)
- [ ] Culture & sensitivity tracking
- [ ] IV-to-PO conversion

### 9. Inventory & Procurement
- [ ] Stock levels
- [ ] Reorder points
- [ ] Expiry tracking (FEFO)
- [ ] Recall management
- [ ] Lot/batch traceability

### 10. Reporting
- [ ] Narcotic usage log (SFDA)
- [ ] Adverse drug reaction (ADR) reports
- [ ] Near-miss reports
- [ ] Cost analysis

## Saudi-specific requirements
- SFDA AER (Adverse Event Reporting) — mandatory
- SFDA NPC (National Pharmacovigilance Center) integration
- SFDA barcode on every unit (GS1)
- Tadawi (Saudi pharma reimbursement) integration

## Gaps vs Epic
- Closed-loop MAR (need infusion pump integration)
- Pharmacogenomics (CYP testing workflow)
- Real-time inventory (RFID cabinets)

## Sources
- SFDA Drug List 2024
- ASHP Guidelines
- ISMP medication safety
- Saudi MoH Pharmacy Practice Regulations
