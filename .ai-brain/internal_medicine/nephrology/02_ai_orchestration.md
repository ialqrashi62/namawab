# 02_ai_orchestration.md - Nephrology AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The Renal Brain
The system implements a predictive RAG pipeline for CKD progression and dialysis optimization.

### A. VectorMine Implementation
- **Vector Database:** PGVector storing embeddings of renal biopsy reports and longitudinal lab trends.
- **Embedding Model:** Clinical-BERT optimized for nephrology terminology.
- **Retrieval:** Semantic search to find "Patient Phenotypes" with similar GFR decline rates.

## 2. LangChain Orchestration
### Chain 1: Biopsy Analysis Chain
`Input (Pathology Report) -> Vector Search (Similar Biopsies) -> LLM (Analysis) -> Output (Suggested Diagnosis)`
- **Prompt:** "Act as a World-Class Nephrologist. Analyze the renal biopsy findings. Compare with retrieved cases of FSGS vs Membranous Nephropathy. Suggest the most likely pathology and recommended treatment."

### Chain 2: Dialysis Adequacy Predictor
`Input (Kt/V, URR, Patient Weight) -> Predictive Model -> LLM (Optimization Summary) -> Output (Suggested Prescription Adjustment)`

## 3. Guardrails
- **Verification:** All AI-suggested dialysis prescriptions must be signed by the attending nephrologist.
- **Observability:** Monitoring "Prediction Accuracy" against actual patient outcomes (e.g., graft survival).
