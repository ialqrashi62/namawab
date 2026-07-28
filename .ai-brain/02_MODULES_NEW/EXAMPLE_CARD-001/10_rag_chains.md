# 10 — RAG Chains (CARD-001)

> Owner: AIE · Snippet: snippet:langchain-rag · Tier 1

## RAG-1: Guidelines Q&A

```yaml
- id: rag_cardio_guidelines
  purpose: Ground answers in ACC/AHA/ESC/NPHIES guidelines
  index: nm_cardio_guidelines_v1
  retriever: mmr
  search_kwargs: { k: 5, fetch_k: 20, lambda_mult: 0.5, filter: { tenant_id, lang } }
  reranker: bge-reranker-large
  top_n_after_rerank: 3
  sources: [ACC-AHA-2024, ESC-2023, NPHIES-CARDIO-BUNDLE, SFDA-DRUG-LIST]
  citation_format: "{source} {year} §{section}"
```

## RAG-2: Drug interaction check

```yaml
- id: rag_cardio_drug_interactions
  purpose: Check DDI for cardiology prescriptions
  index: nm_drug_interactions_v1
  retriever: similarity
  search_kwargs: { k: 10, filter: { drug_class: ['antithrombotic', 'antihypertensive', 'antiarrhythmic', 'statin', 'diuretic'] } }
  reranker: cross-encoder
  sources: [Lexicomp, SFDA-DDI-DB, NPHIES-RX-RULES]
  citation_format: "{source} {interaction_id}"
  critical: true
```

## RAG-3: ECG pattern recognition

```yaml
- id: rag_cardio_ecg_patterns
  purpose: Match ECG patterns to canonical examples
  index: nm_cardio_ecg_patterns_v1
  retriever: similarity
  search_kwargs: { k: 3, filter: { pattern_type: ['STEMI', 'NSTEMI', 'AF', 'VT', 'BBB', 'ischemia'] } }
  sources: [Dublin-ECG-Library, AHA-ECG-Atlas, local-archive]
  critical: true
```

## RAG-4: Local hospital protocols

```yaml
- id: rag_cardio_local_protocols
  purpose: Hospital-specific protocols and SOPs
  index: nm_cardio_local_protocols_v1
  retriever: mmr
  search_kwargs: { k: 5, filter: { tenant_id, lang } }
  sources: [CODE-STEMI-SOP, CODE-STROKE-SOP, HF-CLINIC-SOP, DEVICE-IMPLANT-SOP, TAVR-PATHWAY-SOP]
  refresh: on-write
```

## RAG-5: Patient education material

```yaml
- id: rag_cardio_patient_education
  purpose: Patient-facing education content (AR + EN)
  index: nm_cardio_patient_edu_v1
  retriever: mmr
  search_kwargs: { k: 3, filter: { lang, reading_level: 6 } }
  sources: [AHA-patient, NHC-UK-patient, MOH-KSA-patient, local]
  language_pair: ar+en
```

## RAG-6: Clinical trial matching

```yaml
- id: rag_cardio_clinical_trials
  purpose: Match patients to active clinical trials
  index: nm_clinical_trials_v1
  retriever: similarity
  search_kwargs: { k: 5, filter: { status: 'recruiting', condition: cardiology } }
  sources: [ClinicalTrials.gov, local-trial-registry]
  privacy: strict (PHI never leaves tenant)
```

## Common RAG params

- chunk_size: 512
- chunk_overlap: 64
- embedding: multilingual-e5-large (1024d)
- normalize: true
- distance: cosine
- max_distance: 0.35 (filter low-relevance)
