# GI-001 — DBML + ERD + Sub-Dept

## DBML
```dbml
Table gi_encounters {
  id bigserial [pk]
  uuid tenant_id
  bigint patient_id
  varchar encounter_type
  timestamptz started_at
  text primary_diagnosis
}
Table gi_endoscopies {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id
  varchar procedure_type // 'EGD', 'COLONOSCOPY', 'ERCP', 'EUS'
  timestamptz procedure_date
  text findings
  jsonb interventions
  text complications
}
Table gi_medications {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id
  varchar medication_name
  varchar dose
  boolean is_high_alert
}
Table gi_liver {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id
  int child_pugh_score
  varchar child_pugh_class
  int meld_score
  int meld_na_score
  decimal bilirubin
  decimal albumin
  decimal inr
}
Table gi_bleed_assessments {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id
  varchar assessment_type
  int gbs_score
  int aims65_score
}
```

## Sub-Dept
1. GI-001-OPD
2. GI-001-IP
3. GI-001-ENDO — Endoscopy
4. GI-001-ERCP
5. GI-001-HEPATO
6. GI-001-IBD
7. GI-001-ONC — GI cancer
8. GI-001-LIVER — Liver clinic
9. GI-001-TRANSPLANT — Pre-liver transplant
