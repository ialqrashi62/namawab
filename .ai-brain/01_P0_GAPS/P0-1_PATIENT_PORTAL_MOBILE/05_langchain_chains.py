# P0-1 Patient Portal — LangChain Chains

```python
"""
Patient Portal — LangChain Orchestration
RAG-augmented patient-facing conversational assistant.
"""

from langchain.chains import LLMChain, ConversationalRetrievalQA
from langchain.prompts import PromptTemplate, ChatPromptTemplate
from langchain.vectorstores import PGVector
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory

# Chain 1: Patient Symptom Checker
SYMPTOM_CHECKER_PROMPT = PromptTemplate(
    input_variables=["symptoms", "duration_days", "severity", "patient_age", "chronic_conditions"],
    template="""
Patient Symptom Checker (Triage, NOT diagnosis):

Symptoms: {symptoms}
Duration: {duration_days} days
Severity: {severity}
Age: {patient_age}
Chronic conditions: {chronic_conditions}

Provide triage recommendation:
1. EMERGENT (call 911 or go to ED): chest pain, stroke symptoms, severe bleeding, etc.
2. URGENT (visit within 24h): high fever, severe pain, breathing difficulty
3. SEMI-URGENT (visit within 1 week): persistent moderate symptoms
4. ROUTINE (book appointment): mild symptoms

ALWAYS recommend seeing a doctor for definitive diagnosis.
Never replace medical advice.

Format: triage level + brief explanation + recommended action + red flags.
"""
)

symptom_chain = LLMChain(llm=OpenAI(model_name="gpt-4-turbo", temperature=0.3), prompt=SYMPTOM_CHECKER_PROMPT)

# Chain 2: Lab Results Explainer
LAB_EXPLAINER_PROMPT = PromptTemplate(
    input_variables=["test_name", "value", "unit", "reference_range", "abnormal_flag"],
    template="""
Lab Results Explainer (Patient-Friendly):

Test: {test_name}
Result: {value} {unit}
Normal range: {reference_range}
Abnormal: {abnormal_flag}

Explain in:
1. What does this test measure?
2. What does my result mean?
3. Should I be concerned?
4. What actions should I take?

Use Arabic + English bilingual.
Keep tone reassuring but accurate.
ALWAYS recommend doctor consultation for abnormal results.
"""
)

lab_chain = LLMChain(llm=OpenAI(model_name="gpt-4-turbo", temperature=0.2), prompt=LAB_EXPLAINER_PROMPT)

# Chain 3: Medication Information
MED_INFO_PROMPT = PromptTemplate(
    input_variables=["drug_name", "dose", "indication", "patient_conditions"],
    template="""
Medication Information (Patient-Friendly):

Drug: {drug_name}
Dose: {dose}
Indication: {indication}
Patient conditions: {patient_conditions}

Explain:
1. What is this medication for?
2. How to take it correctly?
3. Common side effects
4. Important warnings (interactions, contraindications)
5. What to do if I miss a dose?

ALWAYS emphasize: do not stop or change without doctor consultation.
Cite Saudi FDA / MoH guidelines.
"""
)

med_chain = LLMChain(llm=OpenAI(model_name="gpt-4-turbo", temperature=0.2), prompt=MED_INFO_PROMPT)

# Chain 4: Telehealth Pre-Visit Triage
TELEHEALTH_TRIAGE_PROMPT = PromptTemplate(
    input_variables=["chief_complaint", "duration", "associated_symptoms", "medical_history"],
    template="""
Telehealth Pre-Visit Triage:

Chief complaint: {chief_complaint}
Duration: {duration}
Associated symptoms: {associated_symptoms}
Medical history: {medical_history}

Determine:
1. Telehealth appropriate? (yes/no)
2. If yes: what information to gather before visit
3. If no: recommend in-person visit + urgency level
4. Red flags requiring ED

Consider:
- Physical exam required?
- Imaging/labs needed before visit?
- Patient's technology capability (assume smartphone + internet)
"""
)

telehealth_chain = LLMChain(llm=OpenAI(model_name="gpt-4-turbo", temperature=0.1), prompt=TELEHEALTH_TRIAGE_PROMPT)

# RAG Pipeline
pp_vectorstore = PGVector(
    connection_string="postgresql://nama_app@db:5432/nama_medical_web",
    embedding_function=OpenAIEmbeddings(model="text-embedding-3-large"),
    collection_name="patient_portal_knowledge",
)

pp_qa_chain = ConversationalRetrievalQA.from_llm(
    llm=OpenAI(model_name="gpt-4-turbo", temperature=0.1),
    retriever=pp_vectorstore.as_retriever(search_kwargs={"k": 5}),
    memory=ConversationBufferMemory(memory_key="chat_history", return_messages=True),
    return_source_documents=True,
)

# Safety: Patient-facing AI MUST be safe
def pp_safety_check(query, response):
    blocked = []
    prohibited_topics = [
        "specific_diagnosis",
        "prescription_change",
        "controlled_substance_advice",
        "second_opinion_bypass",
    ]

    if any(t in response.lower() for t in ["you have cancer", "you have diabetes", "you definitely have"]):
        blocked.append("definitive_diagnosis_without_doctor")

    if "stop taking" in response.lower() and "doctor" not in response.lower():
        blocked.append("medication_change_without_doctor")

    if "controlled substance" in query.lower() and "physician" not in response.lower():
        blocked.append("controlled_substance_requires_physician")

    if any(t in response.lower() for t in ["ignore", "skip", "don't go to"]):
        if "emergency" in response.lower() or "ed" in response.lower():
            blocked.append("discouraging_emergency_care")

    return {"blocked": blocked, "safe": len(blocked) == 0}
```
