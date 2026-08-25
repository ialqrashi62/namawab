# Vector Store Schema — NS-NEURO (PGVector)

Table `ns_kb_chunks` (shared KB, dept-tagged):

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | chunk identity |
| tenant_id | uuid NOT NULL | RLS enforced |
| content | text | chunk body (~800 tok, 120 overlap) |
| embedding | vector(1536) | bge/text-embed class |
| tags | real[] | sparse keyword weights (NM REAL[] convention) |
| doc_type | text | guideline \| journal \| consent_template \| opnote_example \| policy |
| specialty | text[] | CBV/NONC/FUNC/PN/SB/ENDO/SPINE |
| icd_tags | text[] | e.g. {I60,G40} |
| locale | char(2) | en/ar |
| metadata | jsonb | title, publisher, pub_date, url, clause_id |
| created_at / updated_at | timestamptz | standard |

Index: `CREATE INDEX ON ns_kb_chunks USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);`
Partial index on `(doc_type, locale)` for hot filters.

Patient-scoped collection `ns_case_ctx_chunks`: encounter_id FK, TTL 180d purge job.

Retention: superseded guideline chunks soft-deleted (`valid_to`); embeddings re-derived on model version bump (backfill worker).
