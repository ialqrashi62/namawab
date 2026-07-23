# NEPH-001 — DBML + Sub-Dept + Vector + Compliance

## DBML
```dbml
Table neph_encounters { id bigserial [pk] ... }
Table neph_labs { id bigserial [pk] ... creatinine, egfr, ... }
Table neph_dialysis { id bigserial [pk] ... dialysis_type, ... }
Table neph_transplant { id bigserial [pk] ... donor_type, ... }
Table neph_medications { id bigserial [pk] ... renal_dose_adjustment, ... }
Table neph_vector_index { id bigserial [pk] ... }
```

## Sub-Dept
1. NEPH-001-OPD
2. NEPH-001-IP
3. NEPH-001-HD — Hemodialysis unit
4. NEPH-001-PD — Peritoneal dialysis
5. NEPH-001-TRANSPLANT
6. NEPH-001-GN — Glomerulonephritis
7. NEPH-001-ACKD

## Vector Indexes
1. aki_protocols_idx
2. ckd_protocols_idx
3. dialysis_protocols_idx
4. transplant_idx
5. electrolyte_idx
6. glomerulonephritis_idx

## JCI / PDPL / NPHIES / CBAHI / MOH
- JCI: dialysis standards
- PDPL: dialysis, transplant data
- NPHIES: CKD bundle, transplant
- CBAHI: standards
- MOH: transplant registry
