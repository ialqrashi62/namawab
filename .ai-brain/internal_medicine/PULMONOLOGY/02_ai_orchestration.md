# 02_ai_orchestration.md - Pulmonology AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The Respiratory Brain
The system implements a specialized RAG pipeline for respiratory diagnostics.

### A. VectorMine Implementation
- **Vector Database:** PGVector storing embeddings of pulmonary function tests (PFTs) and radiology reports.
- **Embedding Model:** Clinical-BERT optimized for respiratory terminology.
- **Retrieval:** Semantic search to find "Phenotypes" of asthma or COPD based on spirometry curves.

## 2. LangChain Orchestration
### Chain 1: PFT Interpretation Chain
`Input (Spirometry Data) -> Vector Search (Similar PFT Patterns) -> LLM (Analysis) -> Output (Suggested Diagnosis)`
- **Prompt:** "Act as a Pulmonologist. Analyze the FEV1/FVC ratio and flow-volume loop. Compare with retrieved patterns of obstructive vs restrictive disease. Suggest the most likely pathology."

### Chain 2: Sleep Apnea Prediction
`Input (Patient BMI, Neck Circ, Sleep History) -> Predictive Model -> LLM (Risk Summary) -> Output (Recommended Study Type)`

## 3. Guardrails
- **Verification:** AI suggestions for CPAP pressure must be verified by a licensed sleep specialist.
- **Observability:** Tracking "Diagnosis Drift" where AI suggestions deviate from GOLD guidelines.
