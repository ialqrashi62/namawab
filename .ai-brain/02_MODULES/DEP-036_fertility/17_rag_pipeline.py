# filepath: 02_MODULES/DEP-036/17_rag_pipeline.py
# Reproductive_Medicine_IVF (DEP-036) RAG Pipeline - Generated 2026-08-08
# LangChain 0.1+ + pgvector + ChromaDB + LangGraph

import os
import logging
from typing import List, Optional, Dict, Any
from langchain_community.vectorstores import PGVector, Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools.retriever import create_retriever_tool
from langchain import hub
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

logger = logging.getLogger(__name__)

# ============ Configuration ============
COLLECTION_NAME = "fertility"
PGVECTOR_URL = os.environ.get("PGVECTOR_URL", "postgresql://user:pass@localhost:5432/nama")
CHROMA_PERSIST_DIR = os.environ.get("CHROMA_PERSIST_DIR", "./chroma_fertility")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
EMBEDDING_MODEL = "text-embedding-3-large"
EMBEDDING_DIM = 3072
LLM_MODEL = "gpt-4o-mini"
LLM_MODEL_ADV = "gpt-4o"

# ============ System Prompt ============
SYSTEM_PROMPT = "الإخصاب expert at CBAHI/JCI hospital. Use ONLY context. Cite ICD-10/SNOMED. If insufficient: say so. Bilingual (AR primary). Consider Saudi epidemiology."

PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["context", "chat_history", "question"],
    template=SYSTEM_PROMPT + "\n\nContext:\n{context}\n\nChat:\n{chat_history}\n\nQ:\n{question}\n\nA:"
)


# ============ Vector Store ============
def get_embeddings():
    return OpenAIEmbeddings(model=EMBEDDING_MODEL, dimensions=EMBEDDING_DIM)

def get_pg_vectordb(tenant_id, collection_prefix=""):
    collection = f"{tenant_id}_fertility" if not collection_prefix else f"{collection_prefix}_fertility"
    return PGVector(connection_string=PGVECTOR_URL, embedding_function=get_embeddings(), collection_name=collection)

def get_chroma(persist_dir=None):
    return Chroma(persist_directory=persist_dir or CHROMA_PERSIST_DIR, embedding_function=get_embeddings(), collection_name=COLLECTION_NAME)


# ============ QA Chain ============
def build_qa_chain(tenant_id, use_chroma=False, model=LLM_MODEL):
    vectordb = get_chroma() if use_chroma else get_pg_vectordb(tenant_id)
    llm = ChatOpenAI(model=model, temperature=0)
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    retriever = vectordb.as_retriever(search_type="mmr", search_kwargs={"k": 8, "fetch_k": 20, "lambda_mult": 0.5})
    return ConversationalRetrievalChain.from_llm(llm=llm, retriever=retriever, memory=memory, combine_docs_chain_kwargs={"prompt": PROMPT_TEMPLATE}, return_source_documents=True, verbose=False)


# ============ Agents ============
def build_diagnosis_agent(tenant_id, use_chroma=False):
    vectordb = get_chroma() if use_chroma else get_pg_vectordb(tenant_id)
    retriever = vectordb.as_retriever(search_kwargs={"k": 6})
    guidelines_tool = create_retriever_tool(retriever, name="fertility_guidelines_search", description="Search Reproductive_Medicine_IVF guidelines.")
    icd_tool = create_retriever_tool(retriever, name="icd10_search", description="Search ICD-10 codes.")
    tools = [guidelines_tool, icd_tool]
    prompt = hub.pull("hwchase17/openai-functions-agent")
    llm = ChatOpenAI(model=LLM_MODEL_ADV, temperature=0)
    agent = create_openai_functions_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=False, max_iterations=4)

def build_triage_agent(tenant_id):
    from langchain.chains import LLMChain
    from langchain.prompts import PromptTemplate as PT
    llm = ChatOpenAI(model=LLM_MODEL_ADV, temperature=0)
    triage_prompt = PT(input_variables=["complaint", "vitals", "age", "gender"], template="Patient: {complaint}, vitals {vitals}, age {age}, gender {gender}. ESI level (1-5) + red_flags + next_step. JSON only.")
    return LLMChain(llm=llm, prompt=triage_prompt)

def build_drug_interaction_agent(tenant_id):
    from langchain.chains import LLMChain
    from langchain.prompts import PromptTemplate as PT
    llm = ChatOpenAI(model=LLM_MODEL, temperature=0)
    di_prompt = PT(input_variables=["medications"], template="Medications: {medications}. List interactions as JSON.")
    return LLMChain(llm=llm, prompt=di_prompt)


# ============ LangGraph ============
class DeptState(TypedDict):
    messages: Annotated[List, operator.add]
    patient_ctx: Dict[str, Any]
    next_action: str
    esi_level: Optional[int]
    differential: Optional[List]
    plan: Optional[List]

def triage_node(state): return {**state, "next_action": "diagnosis"}
def diagnosis_node(state): return {**state, "next_action": "plan"}
def plan_node(state): return {**state, "next_action": "intervention"}
def intervention_node(state): return {**state, "next_action": "discharge"}
def discharge_node(state): return {**state, "next_action": "END"}

def build_workflow():
    graph = StateGraph(DeptState)
    graph.add_node("triage", triage_node)
    graph.add_node("diagnosis", diagnosis_node)
    graph.add_node("plan", plan_node)
    graph.add_node("intervention", intervention_node)
    graph.add_node("discharge", discharge_node)
    graph.add_edge("triage", "diagnosis")
    graph.add_edge("diagnosis", "plan")
    graph.add_edge("plan", "intervention")
    graph.add_edge("intervention", "discharge")
    graph.add_edge("discharge", END)
    graph.set_entry_point("triage")
    return graph.compile()


# ============ Ingestion ============
def ingest_chunks(chunks, tenant_id, batch_size=100):
    vectordb = get_pg_vectordb(tenant_id)
    total = 0
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        texts = [c['text'] for c in batch]
        metas = [{**c.get('meta', {}), 'dept': 'fertility', 'tenant_id': tenant_id} for c in batch]
        vectordb.add_texts(texts=texts, metadatas=metas)
        total += len(batch)
    logger.info(f"[fertility] Ingested {total} chunks for tenant {tenant_id}")


if __name__ == "__main__":
    workflow = build_workflow()
    initial = {"messages": [], "patient_ctx": {"age": 45, "gender": "M", "complaint": "test"}, "next_action": "triage", "esi_level": None, "differential": None, "plan": None}
    print(workflow.invoke(initial))
    chain = build_qa_chain(tenant_id=1)
    print(chain({"question": "ما هو العلاج؟"})["answer"])
