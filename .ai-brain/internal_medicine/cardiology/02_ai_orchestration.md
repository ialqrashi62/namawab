# 02_ai_orchestration.md - Cardiology AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The Cardiology Brain
The system implements a **RAG (Retrieval-Augmented Generation)** pipeline to assist cardiologists in diagnosis and treatment planning.

### A. VectorMine Implementation
- **Vector Database:** PGVector (PostgreSQL) storing embeddings of historical cardiology cases.
- **Embedding Model:** BioBERT / ClinicalBERT for medical-grade semantic understanding.
- **Retrieval Strategy:** Hybrid search (Keyword + Semantic) to find "Patient Cohorts" with similar ECG patterns and outcomes.

## 2. LangChain Orchestration
### Chain 1: ECG Analysis Chain
`Input (ECG Report) -> Vector Search (Similar Cases) -> LLM (Analysis) -> Output (Suggested Diagnosis)`
- **Prompt Engineering:** "Act as a World-Class Cardiologist. Analyze the provided ECG report against the retrieved similar cases. Identify anomalies in the ST-segment and suggest the most likely pathology."

### Chain 2: Predictive Heart Failure Chain
`Input (Patient Vitals + Labs) -> Predictive Model -> LLM (Risk Summary) -> Output (Preventive Action Plan)`

## 3. LLM Observability & Guardrails
- **Verification:** Every AI suggestion must be flagged as "AI-Suggested" and require a doctor's digital signature.
- **Hallucination Check:** Cross-referencing AI output with the `01_clinical_spec.md` protocols.
- **Token Optimization:** Using prompt compression for long-term patient history.
