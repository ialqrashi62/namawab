# P0-1 Patient Portal — VectorMine Strategy

## Knowledge Corpus
- PDPL 2024 (Saudi Personal Data Protection Law)
- CBAHI Patient Portal Standards 2024
- NHIA Sehhaty Integration Guide
- MoH Mawid Appointment System Docs
- Wateen Insurance Verification API
- NAFATH/Absher SSO Documentation
- SFDA Patient Medication Leaflets
- FHIR R4 Standard (HL7)
- MoH Patient Education Materials (AR/EN)
- Hospital Service Catalog (16 facility types)
- Specialty Clinics Directory
- Pharmacy Drug Database (Saudi FDA)
- Insurance Payer Directory (KSA + GCC)
- Telehealth Guidelines (MoH)
- Mental Health Resources (Saudi MOH)
- Chronic Disease Self-Management Guides

## Chunking Strategy
- 512 tokens, 50-token overlap
- Bilingual (AR/EN side by side for medical content)
- H1/H2/H3 preserved
- Metadata: source, year, language, topic, audience

## Embedding
- OpenAI text-embedding-3-large (3072) for primary
- BGE-M3 for Arabic-optimized
- Cohere multilingual-v3 for cross-language

## Vector DB
- pgvector + HNSW (m=16, ef=64)
- Cosine similarity + 30% BM25 hybrid
- Tenant-isolated collection per facility

## Index Strategy
- Partition: topic (consent/labs/medications/appointments/billing/telehealth)
- Refresh: monthly + regulatory update
- Cache: Redis (TTL 5 min)

## Retrieval
- Top-10 → Rerank → Top-5
- P95 latency <200ms
- Bilingual retrieval (Arabic query → Arabic/English docs)

## Sample Patient Queries
1. "How do I book an appointment with cardiology?"
2. "ما هي حقوقي في خصوصية البيانات؟" (What are my data privacy rights?)
3. "Can I request a refill of my Metformin?"
4. "How do I share my records with my family doctor?"
5. "Is this lab result normal?"
6. "كيف أستخدم خدمة التطبيب عن بعد؟" (How do I use telehealth?)
7. "What does my SGPT 65 mean?"
8. "Can I pay my bill in installments?"

## Quality Targets
- Recall@10 ≥0.95
- MRR ≥0.85
- Citation accuracy ≥0.98
- Hallucination rate <2%
- Patient satisfaction ≥4.5/5

## Safety Guardrails
- NEVER provide definitive diagnosis
- NEVER recommend medication changes
- NEVER replace emergency services (911 / ED)
- ALWAYS cite Saudi MoH / SFDA sources
- ALWAYS recommend doctor consultation
