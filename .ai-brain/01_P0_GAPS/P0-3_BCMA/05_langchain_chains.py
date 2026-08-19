# P0-3 BCMA — LangChain Chains
# 5-Rights + Allergy + Interaction + High-Alert + Override

from langchain.chains import LLMChain, SequentialChain
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI

PROMPT_5R = PromptTemplate(
    input_variables=["patient_id", "drug", "dose", "route", "time", "prescriber"],
    template="""
    Verify the 5 Rights for medication administration:
    - Right Patient: {patient_id}
    - Right Drug: {drug}
    - Right Dose: {dose}
    - Right Route: {route}
    - Right Time: {time}
    - Right Patient (verify): already done via barcode
    - Right Documentation: required
    - Right Reason: required
    - Right Response: monitor

    Prescriber: {prescriber}
    Answer PASS or BLOCK with reason.
    """,
)

PROMPT_ALLERGY = PromptTemplate(
    input_variables=["drug", "allergies"],
    template="Drug: {drug}. Patient allergies: {allergies}. Block if match?",
)

PROMPT_INTERACTION = PromptTemplate(
    input_variables=["drug", "active_meds"],
    template="Drug: {drug}. Active meds: {active_meds}. List interactions.",
)

def build_bcma_chains(llm):
    return {
        "five_rights": LLMChain(llm=llm, prompt=PROMPT_5R),
        "allergy": LLMChain(llm=llm, prompt=PROMPT_ALLERGY),
        "interaction": LLMChain(llm=llm, prompt=PROMPT_INTERACTION),
    }