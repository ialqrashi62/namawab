# P0-3 BCMA — Architecture

## Layers

### 1. Mobile App (Frontend)
- React Native or PWA
- Camera access for barcode scan
- Offline mode (queue scans, sync on reconnect)

### 2. API Layer (Express)
- /api/bcma/scan (5 Rights + allergy + interaction)
- /api/bcma/witness (2-nurse verification)
- /api/bcma/override (override workflow)
- /api/bcma/disposal (witnessed drug disposal)
- /api/bcma/chart (eMAR display)

### 3. Engine (Pure Functions)
- verifyFiveRights
- allergyCheck
- drugInteractionCheck
- highAlertDoubleCheck
- overrideWorkflow
- prnTracking
- insulinDoubleCheck
- chemoVerification
- disposalTracking
- lateDoseDetection

### 4. RAG Pipeline
- pgvector for drug interaction knowledge
- Embeddings: OpenAI text-embedding-3-small
- Cosine similarity + reranker

### 5. Database (PostgreSQL)
- FORCE RLS on all BCMA tables
- Audit log hash-chained
- 7-year retention