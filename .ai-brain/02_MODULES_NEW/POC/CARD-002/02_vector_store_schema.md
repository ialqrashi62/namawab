<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Vector Store Schema (PGVector 768d)

## Index
- Name: cath_lab_kg_v1
- Vector dim: 768
- Distance: cosine
- HNSW: m=16, ef_construction=64

## Tables
`sql
CREATE TABLE cath_lab_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  source_type VARCHAR(50),  -- 'guideline' | 'protocol' | 'consent' | 'report'
  source_id VARCHAR(100),
  chunk_index INT,
  chunk_text TEXT,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cath_lab_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_embeddings FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_lab_embeddings_tenant ON cath_lab_embeddings
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
`

## Chunking
- Size: 512 tokens
- Overlap: 64 tokens
- Strategy: by section (ACC/AHA chapters, local protocol sections)

## Source Corpora
- ACC/AHA 2023 STEMI · 2024 NSTE-ACS · 2020 TAVR · 2024 Valvular · 2023 Chronic Coronary · 2023 AF
- SCAI 2021 Best Practices · 2023 PCI in Shock · 2024 Radiation Safety
- ESC 2023 ACS · 2021 Valvular · 2020 AF
- TAVR trials: PARTNER 2/3, Evolut Low Risk, NOTION
- MitraClip trials: COAPT, MITRA-FR, EXPAND
- Local: NamaMedical Cath Lab SOP, post-PCI DAPT protocol, radial-first pathway
- Local antibiogram + formulary

## Hybrid Retrieval
- Vector (0.5) + BM25 (0.3) + Knowledge Graph (0.2)
- Top-K=20 → rerank → Top-5
- Context window: ≤4000 tokens

---
*Section 17 of CARD-002. AIE voice. L1 DRAFT.*