# 02_ai_orchestration.md - Rheumatology AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The Immune Brain
RAG pipeline for complex autoimmune pattern recognition.

### A. VectorMine Implementation
- **Vector Database:** PGVector storing embeddings of serology reports and joint imaging.
- **Retrieval:** Semantic search for "Symptom Clusters" to differentiate between overlapping autoimmune syndromes.

## 2. LangChain Orchestration
- **Chain 1: Autoimmune Differential:** `Input (Serology/Symptoms) -> Vector Search (Similar Cases) -> LLM (Analysis) -> Output (Suggested Diagnosis)`.
- **Chain 2: Biologic Response Predictor:** `Input (Patient Profile) -> Predictive Model -> LLM (Summary) -> Output (Suggested Biologic Agent)`.
