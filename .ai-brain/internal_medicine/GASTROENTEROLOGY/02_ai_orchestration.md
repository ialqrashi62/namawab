# 02_ai_orchestration.md - Gastroenterology AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The GI Brain
The system implements a multimodal RAG pipeline combining text reports and endoscopic image analysis.

### A. VectorMine Implementation
- **Vector Database:** PGVector storing embeddings of endoscopic findings and pathology reports.
- **Embedding Model:** Clinical-BERT + Vision-Transformer (ViT) for image-text alignment.
- **Retrieval:** Semantic search to find "Visual Phenotypes" of polyps or ulcers from historical cases.

## 2. LangChain Orchestration
### Chain 1: Endoscopy Report Analysis
`Input (Endoscopy Findings) -> Vector Search (Similar Visual Patterns) -> LLM (Analysis) -> Output (Suggested Diagnosis)`
- **Prompt:** "Act as a World-Class Gastroenterologist. Analyze the endoscopic findings (e.g., 'erythematous mucosa with friability'). Compare with retrieved cases of Crohn's vs Ulcerative Colitis. Suggest the most likely segment involvement."

### Chain 2: Liver Function Prediction
`Input (Lab Trends: Albumin, Bilirubin, INR) -> Predictive Model -> LLM (Risk Summary) -> Output (MELD Score Trend & Prognosis)`

## 3. Guardrails
- **Verification:** AI-suggested biopsy sites must be confirmed by the operator.
- **Observability:** Monitoring "Diagnostic Accuracy" by comparing AI suggestions with final pathology reports.
