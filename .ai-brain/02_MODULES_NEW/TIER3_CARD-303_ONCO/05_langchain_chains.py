# CARD-303_ONCO — LangChain Chains

```python
"""
Cardio-Oncology — LangChain Orchestration
RAG-augmented clinical decision support for cancer therapy cardiac safety.
"""

from langchain.chains import LLMChain, RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.vectorstores import PGVector
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI

# Chain 1: Pre-Treatment CV Risk Assessment
RISK_PROMPT = PromptTemplate(
    input_variables=["age", "cancer_type", "therapy", "anthracycline_dose", "baseline_ef", "comorbidities"],
    template="""
Cardio-Onc Risk Stratification (HFA-ICOS 2022/ESC 2022):

Patient: Age {age}, Cancer {cancer_type}, Therapy {therapy}
Cumulative Anthracycline: {anthracycline_dose} mg/m²
Baseline EF: {baseline_ef}%
Comorbidities: {comorbidities}

Risk Category (LOW / MODERATE / HIGH / VERY HIGH):
- LOW: No risk factors
- MODERATE: Age >65, HTN, DM, smoking
- HIGH: Cumulative doxorubicin >250 mg/m², prior radiation, baseline EF 50-54%
- VERY HIGH: EF <50%, prior cardiotoxicity, AL amyloidosis

Recommend:
1. Monitoring plan (echo frequency, biomarker)
2. Cardioprotection (dexrazoxane, ACEi, BB, statin)
3. Cancer therapy modifications (if needed)
4. Hold/continue criteria

Format: 4 sections with citations.
"""
)

risk_chain = LLMChain(llm=OpenAI(model_name="gpt-4-turbo", temperature=0), prompt=RISK_PROMPT)

# Chain 2: ICI Myocarditis Detection
ICI_PROMPT = PromptTemplate(
    input_variables=["symptoms", "troponin", "ef_pct", "ecg_findings"],
    template="""
ICI (Immune Checkpoint Inhibitor) Myocarditis Detection:

Patient: Symptoms {symptoms}
Troponin: {troponin} ng/mL
EF: {ef_pct}%
ECG: {ecg_findings}

IC-OS Diagnostic Criteria:
- Troponin elevation
- ECG abnormalities (QRS widening, AV block, arrhythmia)
- Wall motion abnormalities on echo
- Cardiac MRI confirmation

Severity:
- MILD: Troponin <ULN
- MODERATE: Troponin 1-3x ULN
- SEVERE: Troponin >3x ULN, ICU admission
- FULMINANT: Hemodynamic instability

Treatment:
- MILD: Hold ICI, monitor
- MODERATE: High-dose steroids 1-2 mg/kg
- SEVERE: Methylprednisolone 1g/day, ICU
- FULMINANT: Mechanical support, transplant referral

Cite AHA/ACC 2023, IC-OS 2024.
"""
)

ici_chain = LLMChain(llm=OpenAI(model_name="gpt-4-turbo", temperature=0), prompt=ICI_PROMPT)

# Chain 3: VTE Treatment Decision
VTE_PROMPT = PromptTemplate(
    input_variables=["cancer_type", "drug_interactions", "creatinine", "platelets", "gi_lesions"],
    template="""
Cancer-Associated VTE Treatment:

Patient: Cancer {cancer_type}
Drug interactions: {drug_interactions}
Creatinine: {creatinine}
Platelets: {platelets}
GI lesions: {gi_lesions}

Recommendation (per NCCN 2024):
1. First-line: DOAC (Apixaban 5mg BID, Edoxaban 60mg daily)
2. Alternative: LMWH (Enoxaparin 1mg/kg q12h)
3. Avoid DOAC if: gastric/UGI cancer, drug interactions, platelets <50k

Duration: Minimum 3-6 months, indefinite while on chemo

Cite NCCN 2024, ASCO 2020.
"""
)

# Chain 4: Anthracycline Dose Adjustment
ANTHRA_PROMPT = PromptTemplate(
    input_variables=["cumulative_dose", "ef_drop", "gls_drop"],
    template="""
Anthracycline Cardiotoxicity Management:

Cumulative dose: {cumulative_dose} mg/m² (doxorubicin equivalent)
EF drop from baseline: {ef_drop}
GLS drop from baseline: {gls_drop}

Recommendations (per ESC 2022):
- GLS drop >15% relative: Hold chemo, optimize cardioprotection
- EF drop >10% to <50%: Hold chemo, start ACEi + BB
- Cumulative dose >400 mg/m²: Dexrazoxane 10:1 ratio
- Symptomatic HF: Standard HF therapy + restart chemo later

Cite ESC 2022, ASCO 2020.
"""
)

# RAG Pipeline
co_vectorstore = PGVector(
    connection_string="postgresql://nama_app@db:5432/nama_medical_web",
    embedding_function=OpenAIEmbeddings(model="text-embedding-3-large"),
    collection_name="cardio_onc_knowledge",
)

co_qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(model_name="gpt-4-turbo", temperature=0.1),
    chain_type="stuff",
    retriever=co_vectorstore.as_retriever(search_kwargs={"k": 10}),
    return_source_documents=True,
)

# Safety
def co_safety_check(recommendation):
    blocked = []
    if "ici" in recommendation.lower() and "myocarditis" not in recommendation.lower():
        blocked.append("ALWAYS check ICI myocarditis")
    if "anthracycline" in recommendation.lower() and "cumulative_dose" not in recommendation.lower():
        blocked.append("ALWAYS check cumulative dose")
    if "doac" in recommendation.lower() and "gi_lesions" not in recommendation.lower():
        blocked.append("CHECK GI lesions before DOAC")
    return {"blocked": blocked, "safe": len(blocked) == 0}
```
