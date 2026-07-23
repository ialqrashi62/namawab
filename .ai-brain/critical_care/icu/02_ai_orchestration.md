# 02_ai_orchestration.md - ICU AI Orchestration
**Expert: Lead AI Engineer**

## 1. AI Architecture: The ICU Brain
Real-time waveform and lab trend analysis for early deterioration detection.

### A. VectorMine Implementation
- **Vector Database:** PGVector storing embeddings of waveform patterns and lab trajectories.
- **Retrieval:** Semantic search to find "Similar ICU Deterioration" cases.

## 2. LangChain Orchestration
- **Chain 1: Sepsis Early Warning:** `Input (Vitals + Lactate Trend) -> Predictive Model -> LLM (Review) -> Output (Sepsis Bundle Activation Prompt)`.
- **Chain 2: Weaning Predictor:** `Input (RSBI + Ventilator Settings) -> Predictive Model -> LLM (Summary) -> Output (Extubation Readiness Score)`.
