# P0-3 BCMA — ERD

```
patients ──┐
           ├──< bcma_mar_entries >── bcma_overrides
drug_catalog─┘              │
                            ├──< bcma_disposals
                            │
                            ├──< bcma_patient_scans
                            └──< bcma_drug_scans

users (nurses, prescribers) ───< bcma_mar_entries.created_by
pharmacy_orders ───< bcma_mar_entries.order_id

bcma_vectors (pgvector + HNSW) — RAG source
```

## Relationships
- bcma_mar_entries.patient_id → patients.id
- bcma_mar_entries.drug_id → drug_catalog.id
- bcma_mar_entries.prescriber_id → users.id
- bcma_overrides.mar_id → bcma_mar_entries.mar_id
- bcma_patient_scans.patient_id → patients.id
- bcma_drug_scans.drug_id → drug_catalog.id

## Indexes
- bcma_mar_entries: (tenant_id, patient_id), (tenant_id, scheduled_at)
- bcma_overrides: (tenant_id, mar_id)
- bcma_vectors: HNSW on embedding