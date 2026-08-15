# CARD-302_ADHF — LangChain Chains

```python
"""
Advanced Heart Failure — LangChain Orchestration
RAG-augmented clinical decision support for HF management.
"""

from langchain.chains import LLMChain, RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.vectorstores import PGVector
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI

# Chain 1: GDMT Optimization
GDMT_PROMPT = PromptTemplate(
    input_variables=["ef_pct", "nyha", "k", "gfr", "sbp", "current_meds"],
    template="""
You are an advanced HF cardiologist AI co-pilot.

Patient: EF {ef_pct}%, NYHA {nyha}, K+ {k}, GFR {gfr}, SBP {sbp}
Currently on: {current_meds}

Recommend the 4-pillar GDMT (Class I, AHA/ACC/HFSA 2022):
1. ARNI (Sacubitril/Valsartan) — target 97/103 mg BID
2. Beta-blocker — target dose
3. MRA (Spironolactone) — 25 mg daily
4. SGLT2i (Dapagliflozin) — 10 mg daily

Check: K+ (avoid MRA if >5.0), GFR (avoid if <30), SBP (avoid ARNI if <100).
Format: 4 bullet points with dose, titration, contraindications.
"""
)

gdmt_chain = LLMChain(llm=OpenAI(model_name="gpt-4-turbo", temperature=0), prompt=GDMT_PROMPT)

# Chain 2: Cardiogenic Shock Activation
SHOCK_PROMPT = PromptTemplate(
    input_variables=["sbp", "lactate", "ci", "pcwp", "pvr"],
    template="""
Cardiogenic shock assessment:
- SBP: {sbp}
- Lactate: {lactate}
- CI: {ci}
- PCWP: {pcwp}
- PVR: {pvr}

SCAI Stage (A-E based on hemodynamics):
Recommend DRIPS protocol:
- D — Definitive (transplant, LVAD)
- R — Revascularization
- I — IABP
- P — Percutaneous VAD (Impella, TandemHeart)
- S — Surgical (ECMO, LVAD)

Format: SCAI stage, DRIPS recommendation, escalation.
"""
)

shock_chain = LLMChain(llm=OpenAI(model_name="gpt-4-turbo", temperature=0), prompt=SHOCK_PROMPT)

# Chain 3: LVAD Candidate Evaluation
LVAD_PROMPT = PromptTemplate(
    input_variables=["ef_pct", "nyha", "intermacs", "comorbidities", "age"],
    template="""
LVAD candidate evaluation:
- EF: {ef_pct}%
- NYHA: {nyha}
- INTERMACS: {intermacs}
- Comorbidities: {comorbidities}
- Age: {age}

Recommend:
1. Indication (BTT/BTD/BTD)
2. Risk score (HeartMate II/III)
3. Pre-op checklist
4. Anticipated complications
5. Survival estimate (1-yr, 5-yr)

Format: 4 sections with citations.
"""
)

# Chain 4: Heart Transplant Listing
TRANSPLANT_PROMPT = PromptTemplate(
    input_variables=["ef_pct", "meld", "pcwp", "pvr", "pra", "blood_group"],
    template="""
Heart transplant evaluation:
- EF: {ef_pct}%
- MELD: {meld}
- PCWP: {pcwp}
- PVR: {pvr}
- PRA: {pra}%
- Blood Group: {blood_group}

Is transplant indicated? (Y/N + criteria)
If yes, list status (1A, 1B, 2).
Format: 3 sections with Class/Level citation.
"""
)

# RAG Pipeline
hf_vectorstore = PGVector(
    connection_string="postgresql://nama_app@db:5432/nama_medical_web",
    embedding_function=OpenAIEmbeddings(model="text-embedding-3-large"),
    collection_name="hf_clinical_knowledge",
)

hf_qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(model_name="gpt-4-turbo", temperature=0.1),
    chain_type="stuff",
    retriever=hf_vectorstore.as_retriever(search_kwargs={"k": 10}),
    return_source_documents=True,
)

# Safety
def hf_safety_check(recommendation):
    blocked = []
    if "lvad" in recommendation.lower() and "evaluation" not in recommendation.lower():
        blocked.append("NEVER recommend LVAD without full evaluation")
    if "transplant" in recommendation.lower() and "scot" not in recommendation.lower():
        blocked.append("NEVER recommend transplant without SCOT listing")
    if "arni" in recommendation.lower() and "k" in recommendation.lower():
        # Check if K+ mentioned
        blocked.append("CHECK potassium before ARNI initiation")
    return {"blocked": blocked, "safe": len(blocked) == 0}
```
