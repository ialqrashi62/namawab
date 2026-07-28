# nm-rag-vector-mine v2

> **Type:** AI infrastructure skill
> **Stack:** LangChain + PGVector + LLMOps
> **Index naming:** `nm_<group>_<topic>_v<major>`
> **Embeddings:** multilingual (AR + EN)

---

## Description

Authoritative skill for designing, building, indexing, querying, and observing RAG chains and vector stores for any NamaMedical department. The "VectorMine" is the project's vector index namespace — every dept gets its own dedicated index.

## When to use

- "Build a RAG chain for [department] on [topic]"
- "Index the [guideline|dataset|manual|protocol] into VectorMine"
- "Add multilingual support for AR + EN"
- "Set up LLM observability for [chain]"

## VectorMine namespace

```
<tenant_id>.<group>.<topic>.<version>
e.g. tenant_001.cardiology.acs_2024.v1
e.g. tenant_001.icu.sepsis_2024.v1
e.g. tenant_001.er.stroke_2024.v1
```

## Embedding model selection

| Model | Dims | Languages | Cost | When |
|-------|------|-----------|------|------|
| text-embedding-3-small | 1536 | multi | low | Default, fast |
| text-embedding-3-large | 3072 | multi | high | High-stakes |
| bge-m3 | 1024 | multi (incl. AR) | local/free | AR-heavy content |
| multilingual-e5-large | 1024 | 100+ | mid | Multilingual best |
| Cohere embed-multilingual-v3 | 1024 | 100+ | mid | Alt multilingual |

**Default:** `multilingual-e5-large` for any clinical content (AR + EN). Cost ~$0.0001/1k tokens.

## Chunking strategy

| Content type | Chunk size | Overlap | Notes |
|--------------|------------|---------|-------|
| Clinical guidelines | 512 | 64 | preserve section headers |
| Drug monographs | 384 | 64 | preserve indications/contraindications |
| Lab manuals | 384 | 32 | preserve units |
| Patient-facing consent | 256 | 32 | preserve intent |
| Discharge summaries | 512 | 64 | preserve timeline |
| Operative notes | 384 | 64 | preserve steps |
| Radiology reports | 256 | 32 | preserve findings/impression |
| Pathology reports | 384 | 64 | preserve dx |
| Nursing flowsheets | 256 | 32 | preserve shift context |
| H&P / admission notes | 512 | 64 | preserve problem list |

## Indexing pipeline

```python
# Pseudocode (real impl in ai-engine)
def index_document(tenant_id, group, topic, source_uri, content, doc_type):
    chunks = chunk(content, strategy=doc_type)
    enriched = []
    for chunk in chunks:
        meta = {
            "tenant_id": tenant_id,
            "group": group,
            "topic": topic,
            "doc_type": doc_type,
            "source_uri": source_uri,
            "ingested_at": now(),
            "lang": detect_lang(chunk),
            "phi": redact_phi(chunk),  # never store PHI in vector
            "version": 1,
        }
        enriched.append({**chunk, "metadata": meta})
    embeddings = embed_batch([c.text for c in enriched], model="multilingual-e5-large")
    upsert_to_pgvector(
        index_name=f"nm_{group}_{topic}_v1",
        chunks=enriched,
        embeddings=embeddings,
    )
    log_observability(event="index", count=len(enriched), cost=...)
```

## RAG chain pattern (LangChain + PGVector)

```python
from langchain.vectorstores.pgvector import PGVector
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

# 1) Embeddings
emb = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-large")

# 2) Vector store
store = PGVector(
    connection_string=os.environ["PGVECTOR_URL"],
    embedding_function=emb,
    collection_name="nm_cardio_acs_v1",
)

# 3) Retriever (tenant-scoped)
retriever = store.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 5,
        "fetch_k": 20,
        "lambda_mult": 0.5,
        "filter": {"tenant_id": current_tenant, "lang": "ar"},
    },
)

# 4) LLM with system prompt
system_prompt = """أنت مساعد سريري متخصص في طب القلب. أجب بناءً على الـ context فقط.
إذا لم تجد الإجابة، قل 'لا تتوفر معلومات كافية' ولا تخترع.
اذكر المصدر (اسم الدليل والسنة) لكل ادعاء."""

llm = OpenAI(model="gpt-4o", temperature=0.1)

# 5) Chain
chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type="stuff",
    return_source_documents=True,
)

# 6) Observability
from langfuse import Langfuse
langfuse = Langfuse(public_key=..., secret_key=...)

@langfuse.observe(name="cardio_acs_qa")
def query(question: str, tenant_id: str):
    with langfuse.span(name="retrieve") as span:
        docs = retriever.get_relevant_documents(question)
        span.end(output={"docs": len(docs)})
    with langfuse.span(name="generate") as span:
        result = chain({"query": question})
        span.end(output={"answer": result["result"][:200]})
    return result
```

## Per-department prompt template

```yaml
system_prompt: |
  أنت <role> في قسم <dept> في مستشفى <hospital>.
  تخصصك: <3-5 keywords>.
  أجب دائماً بالعربية ما لم يُطلب غير ذلك.
  استند فقط على الـ context المرفق + clinical guidelines المعتمدة.
  إذا غاب الدليل: قل "لا تتوفر معلومات كافية" + اطلب توضيحاً.
  التزم بـ: JCI 7th, CBAHI, MOH-KSA, NPHIES, ZATCA, SFDA, PDPL.
  احترام قاعدة الوصول الذهبية: لا تشارك بيانات مستأجر آخر.
  لا تنشر PHI في الـ output.
  cite: <format>
user_template: |
  السؤال: {question}
  Patient context (PHI-redacted): {patient_ctx}
  Retrieved guidelines: {retrieved_docs}
  --
  أرجع:
    1. الجواب (AR)
    2. المصدر (دليل + سنة)
    3. مستوى الدليل (A/B/C)
    4. تحذيرات (إن وجدت)
```

## LLMOps stack

| Concern | Tool | Why |
|---------|------|-----|
| Trace | Langfuse (default) or LangSmith | Open-source, multilingual, easy self-host |
| Eval | Promptfoo / DeepEval / RAGAS | offline batch eval |
| Cost | Langfuse cost tracking | per-tenant budget |
| Drift | Evidently AI / custom | detect embedding drift |
| Red-team | Promptfoo + Garak | safety |
| Latency | OTLP → Grafana | p50/p95/p99 |

## Safety rails (RAG-specific)

- **No PHI in vector index.** Always run PII/PHI redaction before embedding.
- **Tenant isolation:** every chunk has `tenant_id` metadata. Retriever always filters.
- **Source citation:** every answer must cite the source document + page/section.
- **Hallucination guard:** if retrieved docs < threshold, refuse.
- **Multi-lang parity:** test AR and EN coverage at least once per quarter.
- **Embedding drift:** re-embed major guideline updates within 7 days.
- **Cost guard:** per-tenant monthly token cap, enforced by Langfuse.

## Composability

- `nm-7-expert-panel-orchestrator` — AIE owns files 05-13
- `nm-dept-blueprint-template-v2` — files 09, 10, 11, 12, 13
- `nm-token-saver-pack` — reuses snippet:langchain-rag and snippet:vector-mine
