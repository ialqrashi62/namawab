<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — Vector Store (PGVector 768d)

## Index
- Name: 	ransplant_clinical_corpus
- Dim: 768
- Distance: cosine

## Tables
`sql
CREATE TABLE transplant_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  source_type VARCHAR(50),
  source_id VARCHAR(100),
  chunk_index INT,
  chunk_text TEXT,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE transplant_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_embeddings FORCE ROW LEVEL SECURITY;
CREATE POLICY transplant_embeddings_tenant ON transplant_embeddings USING (tenant_id = current_setting('app.tenant_id')::UUID);
`

## Source Corpora
- KDIGO 2009/2020 (CKD + transplantation)
- Banff 2017/2019 (renal allograft pathology, transcriptomics 2022)
- OPTN/SRTR (US allocation, KDPI/EPTS, 1/5-yr survival)
- CST 2023 (Canadian)
- ERA-EDTA consensus (AMR/DSA)
- SCOT annual reports (Saudi-specific)
- SFDA labeling (IS, ATG, rituximab, eculizumab — REMS)
- Internal transplant protocol (de-identified)

## Chunking
- 512 tokens, 64 overlap, by section

## Hybrid
- Vector (0.5) + BM25 (0.3) + KG (0.2), Top-K=20→5

---
*Section 17 of NEPH-002. AIE voice. L1 DRAFT.*