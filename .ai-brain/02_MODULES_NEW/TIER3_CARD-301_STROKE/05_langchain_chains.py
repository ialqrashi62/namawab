# CARD-301_STROKE — LangChain Chains

```python
"""
Stroke Center — LangChain Orchestration
RAG-augmented clinical decision support for stroke management.

Architecture:
  Query → Retrieve (clinical_knowledge_vectors)
        → Rerank (AHA/ASA guidelines + hospital protocol)
        → Compress (top-5 chunks)
        → Generate (with citations)
        → Validate (safety guardrails)
        → Log (ai_cds_log)
"""

from langchain.chains import RetrievalQA, LLMChain
from langchain.prompts import PromptTemplate
from langchain.vectorstores import PGVector
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI

# =================================================================
# Chain 1: Code Stroke Decision Support
# =================================================================
CODE_STROKE_PROMPT = PromptTemplate(
    input_variables=["nihss", "tlkw_minutes", "ct_findings", "contraindications"],
    template="""
You are a stroke neurologist AI co-pilot at NamaMedical.

Patient context:
- NIHSS: {nihss}
- Time from last known well: {tlkw_minutes} minutes
- CT findings: {ct_findings}
- Contraindications: {contraindications}

Decision (cite AHA/ASA Class/Level):
1. Is IV thrombolysis indicated? (Y/N + dose)
2. Is thrombectomy indicated? (Y/N + transfer)
3. Is BP management needed? (target)
4. Red flag for decompression? (Y/N)
5. Time-critical action and SLA

Format: 5 bullet points, each with citation.
""",
)

code_stroke_chain = LLMChain(
    llm=OpenAI(model_name="gpt-4-turbo", temperature=0),
    prompt=CODE_STROKE_PROMPT,
)

# =================================================================
# Chain 2: NIHSS Auto-Calculator + RAG
# =================================================================
NIHSS_PROMPT = PromptTemplate(
    input_variables=["exam_findings"],
    template="""
Given these stroke exam findings:
{exam_findings}

Calculate the NIHSS total score (0-42) and breakdown by:
- Consciousness (0-3)
- Gaze (0-2)
- Visual fields (0-3)
- Facial palsy (0-3)
- Motor arm L/R (0-4 each)
- Motor leg L/R (0-4 each)
- Limb ataxia (0-2)
- Sensory (0-2)
- Language (0-3)
- Dysarthria (0-2)
- Extinction/inattention (0-2)

Return JSON with breakdown and total.
""",
)

nihss_chain = LLMChain(
    llm=OpenAI(model_name="gpt-4-turbo", temperature=0),
    prompt=NIHSS_PROMPT,
)

# =================================================================
# Chain 3: ASPECTS Scoring (CT)
# =================================================================
ASPECTS_PROMPT = PromptTemplate(
    input_variables=["ct_regions"],
    template="""
ASPECTS scoring — 10 regions of MCA territory:
- Caudate (C), Lentiform (L), Internal capsule (IC), Insular ribbon (I),
- MCA cortex: M1-M6

Given: {ct_regions}

Score each region 0 (early ischemic change) or 1 (normal).
Total = 10 - (sum of affected regions). Range 0-10.
- 0-5: Consider not eligible for thrombolysis
- 6-7: Borderline
- 8-10: Favorable

Return JSON with per-region scores and total.
""",
)

# =================================================================
# Chain 4: Secondary Prevention Bundle
# =================================================================
SECONDARY_PREV_PROMPT = PromptTemplate(
    input_variables=["stroke_type", "afib", "ldl", "bp"],
    template="""
Stroke type: {stroke_type}
AFib detected: {afib}
LDL: {ldl}
BP: {bp}

Generate the 5-element secondary prevention bundle:
1. Antiplatelet (drug + dose)
2. Statin (intensity)
3. Anticoagulation (if AFib)
4. BP target
5. Lifestyle (Arabic patient education link)

Cite AHA/ASA Class I/IIa recommendation.
"""
)

# =================================================================
# RAG Pipeline
# =================================================================
stroke_vectorstore = PGVector(
    connection_string="postgresql://nama_app@db:5432/nama_medical_web",
    embedding_function=OpenAIEmbeddings(model="text-embedding-3-large"),
    collection_name="stroke_clinical_knowledge",
)

stroke_qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(model_name="gpt-4-turbo", temperature=0.1),
    chain_type="stuff",
    retriever=stroke_vectorstore.as_retriever(search_kwargs={"k": 10}),
    return_source_documents=True,
)

# =================================================================
# Safety Guardrails
# =================================================================
def stroke_safety_check(recommendation: str) -> dict:
    """Block recommendations that violate stroke safety rules."""
    blocked = []
    if "skip imaging" in recommendation.lower():
        blocked.append("NEVER skip imaging before thrombolysis")
    if "thrombolysis" in recommendation.lower() and "hemorrhage" in recommendation.lower():
        blocked.append("Cannot give thrombolysis with hemorrhage on CT")
    if "tenecteplase" in recommendation.lower() and "25 mg" not in recommendation.lower():
        blocked.append("Tenecteplase max single dose is 25 mg")
    return {"blocked": blocked, "safe": len(blocked) == 0}
```
