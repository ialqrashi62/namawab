# nm-vector-rag-v2 — Vector + RAG + LangChain v2

> Production-grade RAG for medical systems.
> pgvector + ChromaDB + LangChain 0.1+ + LangGraph agents.
> Reduces RAG generation tokens by 60%.

---

## 1. Vector Collections Catalog (per dept)

| Collection | Embedding Model | Chunk Size | Use |
|---|---|---|---|
| `<dept>_guidelines` | text-embedding-3-large | 512 | Clinical guidelines (Uptodate-like) |
| `<dept>_protocols` | text-embedding-3-large | 1024 | Internal hospital protocols |
| `<dept>_drugs` | text-embedding-3-large | 256 | Drug monographs (SFDA) |
| `<dept>_icd10` | text-embedding-3-large | 128 | ICD-10 codes + descriptions |
| `<dept>_snomed` | text-embedding-3-large | 128 | SNOMED-CT concepts |
| `<dept>_cases` | text-embedding-3-large | 768 | Anonymized case summaries |

**Total per dept: 6 collections × ~10k chunks avg = 60k vectors**

---

## 2. Embedding Strategy (S-11)

```python
EMBEDDING_STRATEGY = {
    "model": "text-embedding-3-large",
    "dimensions": 3072,
    "chunk_size": {"guidelines": 512, "protocols": 1024, "drugs": 256, "icd10": 128, "snomed": 128, "cases": 768},
    "chunk_overlap": 50,
    "separators": ["\n\n", "\n", ". ", " "],
    "metadata": ["tenant_id", "dept", "source", "version", "last_reviewed", "language"]
}
```

---

## 3. pgvector Schema

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS <tenant>_<dept>_embeddings (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  collection TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_meta JSONB NOT NULL DEFAULT '{}',
  embedding vector(3072),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON <tenant>_<dept>_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
ALTER TABLE <tenant>_<dept>_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE <tenant>_<dept>_embeddings FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_iso ON <tenant>_<dept>_embeddings USING (tenant_id = current_setting('app.tenant_id')::BIGINT);
```

---

## 4. RAG Pipeline (S-06)

```python
# filepath: 06-vector-rag/<dept>_rag.py
import os
from typing import List
from langchain_community.vectorstores import PGVector
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools.retriever import create_retriever_tool

COLLECTION_URL = os.environ["PGVECTOR_URL"]  # postgresql://...
SYSTEM_PROMPT = """أنت خبير في <DEPT_NAME> في مستشفى معتمد. أجب بالعربية أو الإنجليزية حسب سؤال المستخدم.
اعتمد فقط على السياق المرفق. أذكر رقم ICD-10 أو SNOMED عند الإشارة لأي تشخيص.
إذا لم تجد إجابة في السياق، قل 'لا تتوفر معلومات كافية'."""

PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["context", "chat_history", "question"],
    template=SYSTEM_PROMPT + "\n\nالسياق:\n{context}\n\nالمحادثة:\n{chat_history}\n\nالسؤال:\n{question}\n\nالإجابة:"
)

def build_qa_chain(tenant_id: int, dept: str, model="gpt-4o-mini"):
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large", dimensions=3072)
    vectordb = PGVector(
        connection_string=COLLECTION_URL,
        embedding_function=embeddings,
        collection_name=f"{tenant_id}_{dept}",
    )
    llm = ChatOpenAI(model=model, temperature=0)
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    retriever = vectordb.as_retriever(search_type="mmr", search_kwargs={"k": 8, "fetch_k": 20, "lambda_mult": 0.5})
    return ConversationalRetrievalChain.from_llm(
        llm=llm, retriever=retriever, memory=memory,
        combine_docs_chain_kwargs={"prompt": PROMPT_TEMPLATE},
        return_source_documents=True,
        verbose=False
    )
```

---

## 5. LangChain Agents (per dept)

### 5.1 Diagnosis Agent
```python
def build_diagnosis_agent(dept: str):
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    retriever_tool = create_retriever_tool(
        retriever, name=f"{dept}_guidelines_search",
        description=f"Search {dept} clinical guidelines."
    )
    drug_tool = create_retriever_tool(drug_retriever, name=f"{dept}_drug_search", description="Search drug interactions.")
    icd_tool = create_retriever_tool(icd_retriever, name=f"{dept}_icd_search", description="Search ICD-10 codes.")
    tools = [retriever_tool, drug_tool, icd_tool]
    prompt = hub.pull("hwchase17/openai-functions-agent")
    agent = create_openai_functions_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=False, max_iterations=4)
```

### 5.2 Triage Agent
- Inputs: chief complaint, vitals, age, gender, allergies
- Output: ESI level (1-5), recommended dept, suggested tests
- Tools: vitals calculator, red-flag detector, dept-router

### 5.3 Drug Interaction Agent
- Inputs: medication list + new medication
- Output: severity, mechanism, recommendation
- Tools: drug DB lookup, renal/hepatic dose adjust, allergy check

---

## 6. LangGraph Orchestration (S-06 + supervisor)

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class DeptState(TypedDict):
    messages: Annotated[list, operator.add]
    patient_ctx: dict
    next_action: str

def triage_node(state): ...
def diagnosis_node(state): ...
def treatment_node(state): ...
def referral_node(state): ...

graph = StateGraph(DeptState)
graph.add_node("triage", triage_node)
graph.add_node("diagnosis", diagnosis_node)
graph.add_node("treatment", treatment_node)
graph.add_node("referral", referral_node)
graph.add_conditional_edges("triage", lambda s: "diagnosis" if s["next_action"]=="diag" else "referral")
graph.set_entry_point("triage")
graph.set_finish_point("referral")
app = graph.compile()
```

---

## 7. Ingestion Pipeline

```python
# filepath: 06-vector-rag/ingestion/<dept>_loader.py
def load_<dept>_guidelines():
    sources = [
        ("uptodate", "data/guidelines/<dept>/*.pdf"),
        ("internal", "data/protocols/<dept>/*.md"),
        ("sfda_drugs", "data/sfda/drugs.json"),
        ("icd10", "data/icd10/<dept>.csv"),
        ("snomed", "data/snomed/<dept>.ttl"),
    ]
    for src, pattern in sources:
        for doc in glob(pattern):
            chunks = chunk_by_strategy(doc, src)
            embed_and_store(chunks, collection=f"<dept>_{src}")
```

---

## 8. Cost & Performance Budget

| Metric | Target |
|---|---|
| Embedding cost / dept | ~$15 (one-time ingestion) |
| Query latency p95 | < 800 ms |
| Token budget / query | ≤ 4000 (incl. context) |
| Retrieval precision | > 0.85 (eval set) |
| Re-rank step | Cross-encoder (ms-marco-MiniLM) |

---

## 9. File Output (per dept)
- `11_vector_mine.md` (collections manifest)
- `17_rag_pipeline.py`
- `10_langchain_chains.md`

---

## 10. Integration
- Pairs with `nm-token-saver-pack-v2` (S-06)
- Pairs with `nm-ultimate-blueprint-factory`
- Required for `nm-dept-prompt-v3`
