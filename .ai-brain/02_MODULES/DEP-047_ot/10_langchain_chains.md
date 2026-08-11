# LangChain Chains — Occupational_Therapy (DEP-047)

## Chains

### 1. Diagnosis Chain
```python
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

PROMPT = PromptTemplate(
  input_variables=["context", "question"],
  template="""أنت خبير في العلاج الوظيفي. أجب بالعربية. اعتمد فقط على السياق.
السياق: {context}
السؤال: {question}
الإجابة:"""
)

chain = RetrievalQA.from_chain_type(
  llm=ChatOpenAI(model="gpt-4o-mini"),
  retriever=vectordb.as_retriever(k=5),
  chain_type_kwargs={"prompt": PROMPT}
)
```

### 2. Drug Interaction Chain
- Input: medication list
- Output: severity + recommendation

### 3. Triage Chain
- Input: chief complaint + vitals
- Output: ESI level + next step

### 4. Referral Chain
- Input: condition + facility type
- Output: appropriate dept + urgency

## Agents
- DiagnosisAgent: tools=[guidelines_search, drug_search, icd_search]
- TriageAgent: tools=[vitals_calc, red_flag_detect]

## Tools
- ot_guidelines_search
- ot_drug_search
- icd10_search
- snomed_search