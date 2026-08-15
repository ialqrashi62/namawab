# CARD-304_ROBOTIC — LangChain Chains

```python
"""
Robotic CV Surgery — LangChain Orchestration
RAG-augmented clinical decision support for cardiac surgery.
"""

from langchain.chains import LLMChain, RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.vectorstores import PGVector
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI

# Chain 1: Heart Team Recommendation
HEART_TEAM_PROMPT = PromptTemplate(
    input_variables=["age", "diagnosis", "sts_score", "ef_pct", "comorbidities"],
    template="""
Heart Team Recommendation (Robotic Cardiac Surgery):

Patient: Age {age}, Diagnosis {diagnosis}
STS Score: {sts_score}
EF: {ef_pct}%
Comorbidities: {comorbidities}

Recommendation (per STS 2024 + ESC 2023):
1. Heart Team MDT (Cardiologist + Surgeon + Anesthesia)
2. Surgical approach (Robotic vs Open vs Catheter)
3. Device selection
4. Pre-op optimization
5. Risk/benefit assessment

Format: 5 sections with citations.
"""
)

heart_team_chain = LLMChain(llm=OpenAI(model_name="gpt-4-turbo", temperature=0), prompt=HEART_TEAM_PROMPT)

# Chain 2: Pre-Op Checklist
PREOP_PROMPT = PromptTemplate(
    input_variables=["procedure", "device", "sts_score"],
    template="""
Pre-Operative Checklist (Robotic Cardiac Surgery):

Procedure: {procedure}
Device: {device}
STS Score: {sts_score}

Mandatory Items:
1. Echo within 30 days
2. Coronary anatomy known
3. Pulmonary function tests
4. Renal function (Cr clearance)
5. Frailty assessment
6. Coagulation profile
7. Blood typing + crossmatch
8. Patient consent (PDPL)
9. Anesthesia pre-op
10. Perfusionist consult

Format: checklist with completion status.
"""
)

# Chain 3: TAVI Eligibility
TAVI_PROMPT = PromptTemplate(
    input_variables=["age", "sts_score", "annulus_size", "ef_pct"],
    template="""
TAVI Eligibility Assessment:

Patient: Age {age}
STS Score: {sts_score}
Aortic Annulus: {annulus_size} mm
EF: {ef_pct}%

TAVI Eligibility (per ACC/AHA 2024 + ESC 2023):
- Age ≥65 with severe AS
- STS ≥4% (intermediate-high risk) OR Age ≥80
- Annulus 18-30 mm
- EF ≥20%
- Life expectancy >1 year

Recommendations:
1. Femoral access first-line
2. CT for sizing
3. Device: Sapien 3 or Evolut
4. Pre-procedure Heart Team
5. Post-TAVI dual antiplatelet 1-6 months
"""
)

# Chain 4: MitraClip Eligibility
MITRACLIP_PROMPT = PromptTemplate(
    input_variables=["mr_grade", "ef_pct", "nyha", "sts_score"],
    template="""
MitraClip Eligibility:

MR Severity: Grade {mr_grade}/4
EF: {ef_pct}%
NYHA: {nyha}
STS: {sts_score}

Eligibility (per ACC/AHA 2024):
- MR Grade ≥3+ (moderate-severe)
- EF 30-60%
- High surgical risk (STS ≥8%)
- NYHA II-IV despite optimal GDMT

Cite COAPT trial, ESC 2023.
"""
)

# RAG Pipeline
robotic_vectorstore = PGVector(
    connection_string="postgresql://nama_app@db:5432/nama_medical_web",
    embedding_function=OpenAIEmbeddings(model="text-embedding-3-large"),
    collection_name="robotic_cv_knowledge",
)

robotic_qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(model_name="gpt-4-turbo", temperature=0.1),
    chain_type="stuff",
    retriever=robotic_vectorstore.as_retriever(search_kwargs={"k": 10}),
    return_source_documents=True,
)

# Safety
def robotic_safety_check(recommendation):
    blocked = []
    if "surgery" in recommendation.lower() and "heart_team" not in recommendation.lower():
        blocked.append("ALWAYS Heart Team MDT")
    if "tavi" in recommendation.lower() and "annulus_size" not in recommendation.lower():
        blocked.append("CHECK annulus size")
    if "robot" in recommendation.lower() and "console" not in recommendation.lower():
        blocked.append("CHECK console availability")
    return {"blocked": blocked, "safe": len(blocked) == 0}
```
