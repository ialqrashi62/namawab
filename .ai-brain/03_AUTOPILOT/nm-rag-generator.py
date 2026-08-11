#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-rag-generator.py
Generates Python RAG pipelines for all 60 departments.
"""
import io
import os
import sys
import yaml
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
MODULES_DIR = WORKSPACE / ".ai-brain/02_MODULES"


def make_rag(code, code_short, name_ar, name_en, date):
    return (
        "# filepath: 02_MODULES/" + code + "/17_rag_pipeline.py\n"
        "# " + name_en + " (" + code + ") RAG Pipeline - Generated " + date + "\n"
        "# LangChain 0.1+ + pgvector + ChromaDB + LangGraph\n\n"
        "import os\nimport logging\nfrom typing import List, Optional, Dict, Any\n"
        "from langchain_community.vectorstores import PGVector, Chroma\n"
        "from langchain_openai import ChatOpenAI, OpenAIEmbeddings\n"
        "from langchain.chains import RetrievalQA, ConversationalRetrievalChain\n"
        "from langchain.memory import ConversationBufferMemory\n"
        "from langchain.prompts import PromptTemplate\n"
        "from langchain.agents import AgentExecutor, create_openai_functions_agent\n"
        "from langchain.tools.retriever import create_retriever_tool\n"
        "from langchain import hub\n"
        "from langgraph.graph import StateGraph, END\n"
        "from typing import TypedDict, Annotated\n"
        "import operator\n\n"
        "logger = logging.getLogger(__name__)\n\n"
        "# ============ Configuration ============\n"
        "COLLECTION_NAME = \"" + code_short + "\"\n"
        "PGVECTOR_URL = os.environ.get(\"PGVECTOR_URL\", \"postgresql://user:pass@localhost:5432/nama\")\n"
        "CHROMA_PERSIST_DIR = os.environ.get(\"CHROMA_PERSIST_DIR\", \"./chroma_" + code_short + "\")\n"
        "OPENAI_API_KEY = os.environ.get(\"OPENAI_API_KEY\", \"\")\n"
        "EMBEDDING_MODEL = \"text-embedding-3-large\"\n"
        "EMBEDDING_DIM = 3072\n"
        "LLM_MODEL = \"gpt-4o-mini\"\n"
        "LLM_MODEL_ADV = \"gpt-4o\"\n\n"
        "# ============ System Prompt ============\n"
        "SYSTEM_PROMPT = \"" + name_ar + " expert at CBAHI/JCI hospital. Use ONLY context. Cite ICD-10/SNOMED. If insufficient: say so. Bilingual (AR primary). Consider Saudi epidemiology.\"\n\n"
        "PROMPT_TEMPLATE = PromptTemplate(\n"
        "    input_variables=[\"context\", \"chat_history\", \"question\"],\n"
        "    template=SYSTEM_PROMPT + \"\\n\\nContext:\\n{context}\\n\\nChat:\\n{chat_history}\\n\\nQ:\\n{question}\\n\\nA:\"\n"
        ")\n\n\n"
        "# ============ Vector Store ============\n"
        "def get_embeddings():\n"
        "    return OpenAIEmbeddings(model=EMBEDDING_MODEL, dimensions=EMBEDDING_DIM)\n\n"
        "def get_pg_vectordb(tenant_id, collection_prefix=\"\"):\n"
        "    collection = f\"{tenant_id}_" + code_short + "\" if not collection_prefix else f\"{collection_prefix}_" + code_short + "\"\n"
        "    return PGVector(connection_string=PGVECTOR_URL, embedding_function=get_embeddings(), collection_name=collection)\n\n"
        "def get_chroma(persist_dir=None):\n"
        "    return Chroma(persist_directory=persist_dir or CHROMA_PERSIST_DIR, embedding_function=get_embeddings(), collection_name=COLLECTION_NAME)\n\n\n"
        "# ============ QA Chain ============\n"
        "def build_qa_chain(tenant_id, use_chroma=False, model=LLM_MODEL):\n"
        "    vectordb = get_chroma() if use_chroma else get_pg_vectordb(tenant_id)\n"
        "    llm = ChatOpenAI(model=model, temperature=0)\n"
        "    memory = ConversationBufferMemory(memory_key=\"chat_history\", return_messages=True)\n"
        "    retriever = vectordb.as_retriever(search_type=\"mmr\", search_kwargs={\"k\": 8, \"fetch_k\": 20, \"lambda_mult\": 0.5})\n"
        "    return ConversationalRetrievalChain.from_llm(llm=llm, retriever=retriever, memory=memory, combine_docs_chain_kwargs={\"prompt\": PROMPT_TEMPLATE}, return_source_documents=True, verbose=False)\n\n\n"
        "# ============ Agents ============\n"
        "def build_diagnosis_agent(tenant_id, use_chroma=False):\n"
        "    vectordb = get_chroma() if use_chroma else get_pg_vectordb(tenant_id)\n"
        "    retriever = vectordb.as_retriever(search_kwargs={\"k\": 6})\n"
        "    guidelines_tool = create_retriever_tool(retriever, name=\"" + code_short + "_guidelines_search\", description=\"Search " + name_en + " guidelines.\")\n"
        "    icd_tool = create_retriever_tool(retriever, name=\"icd10_search\", description=\"Search ICD-10 codes.\")\n"
        "    tools = [guidelines_tool, icd_tool]\n"
        "    prompt = hub.pull(\"hwchase17/openai-functions-agent\")\n"
        "    llm = ChatOpenAI(model=LLM_MODEL_ADV, temperature=0)\n"
        "    agent = create_openai_functions_agent(llm, tools, prompt)\n"
        "    return AgentExecutor(agent=agent, tools=tools, verbose=False, max_iterations=4)\n\n"
        "def build_triage_agent(tenant_id):\n"
        "    from langchain.chains import LLMChain\n"
        "    from langchain.prompts import PromptTemplate as PT\n"
        "    llm = ChatOpenAI(model=LLM_MODEL_ADV, temperature=0)\n"
        "    triage_prompt = PT(input_variables=[\"complaint\", \"vitals\", \"age\", \"gender\"], template=\"Patient: {complaint}, vitals {vitals}, age {age}, gender {gender}. ESI level (1-5) + red_flags + next_step. JSON only.\")\n"
        "    return LLMChain(llm=llm, prompt=triage_prompt)\n\n"
        "def build_drug_interaction_agent(tenant_id):\n"
        "    from langchain.chains import LLMChain\n"
        "    from langchain.prompts import PromptTemplate as PT\n"
        "    llm = ChatOpenAI(model=LLM_MODEL, temperature=0)\n"
        "    di_prompt = PT(input_variables=[\"medications\"], template=\"Medications: {medications}. List interactions as JSON.\")\n"
        "    return LLMChain(llm=llm, prompt=di_prompt)\n\n\n"
        "# ============ LangGraph ============\n"
        "class DeptState(TypedDict):\n"
        "    messages: Annotated[List, operator.add]\n"
        "    patient_ctx: Dict[str, Any]\n"
        "    next_action: str\n"
        "    esi_level: Optional[int]\n"
        "    differential: Optional[List]\n"
        "    plan: Optional[List]\n\n"
        "def triage_node(state): return {**state, \"next_action\": \"diagnosis\"}\n"
        "def diagnosis_node(state): return {**state, \"next_action\": \"plan\"}\n"
        "def plan_node(state): return {**state, \"next_action\": \"intervention\"}\n"
        "def intervention_node(state): return {**state, \"next_action\": \"discharge\"}\n"
        "def discharge_node(state): return {**state, \"next_action\": \"END\"}\n\n"
        "def build_workflow():\n"
        "    graph = StateGraph(DeptState)\n"
        "    graph.add_node(\"triage\", triage_node)\n"
        "    graph.add_node(\"diagnosis\", diagnosis_node)\n"
        "    graph.add_node(\"plan\", plan_node)\n"
        "    graph.add_node(\"intervention\", intervention_node)\n"
        "    graph.add_node(\"discharge\", discharge_node)\n"
        "    graph.add_edge(\"triage\", \"diagnosis\")\n"
        "    graph.add_edge(\"diagnosis\", \"plan\")\n"
        "    graph.add_edge(\"plan\", \"intervention\")\n"
        "    graph.add_edge(\"intervention\", \"discharge\")\n"
        "    graph.add_edge(\"discharge\", END)\n"
        "    graph.set_entry_point(\"triage\")\n"
        "    return graph.compile()\n\n\n"
        "# ============ Ingestion ============\n"
        "def ingest_chunks(chunks, tenant_id, batch_size=100):\n"
        "    vectordb = get_pg_vectordb(tenant_id)\n"
        "    total = 0\n"
        "    for i in range(0, len(chunks), batch_size):\n"
        "        batch = chunks[i:i+batch_size]\n"
        "        texts = [c['text'] for c in batch]\n"
        "        metas = [{**c.get('meta', {}), 'dept': '" + code_short + "', 'tenant_id': tenant_id} for c in batch]\n"
        "        vectordb.add_texts(texts=texts, metadatas=metas)\n"
        "        total += len(batch)\n"
        "    logger.info(f\"[" + code_short + "] Ingested {total} chunks for tenant {tenant_id}\")\n\n\n"
        "if __name__ == \"__main__\":\n"
        "    workflow = build_workflow()\n"
        "    initial = {\"messages\": [], \"patient_ctx\": {\"age\": 45, \"gender\": \"M\", \"complaint\": \"test\"}, \"next_action\": \"triage\", \"esi_level\": None, \"differential\": None, \"plan\": None}\n"
        "    print(workflow.invoke(initial))\n"
        "    chain = build_qa_chain(tenant_id=1)\n"
        "    print(chain({\"question\": \"ما هو العلاج؟\"})[\"answer\"])\n"
    )


def main():
    cfg_path = WORKSPACE / ".ai-brain/03_AUTOPILOT/dept_config_all.yaml"
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)
    date = datetime.now().strftime("%Y-%m-%d")
    written = 0
    for dept in cfg["depts"]:
        code = dept["code"]
        code_short = dept["code_short"]
        name_ar = dept.get("name_ar", code)
        name_en = dept["name_en"]
        dept_dir = MODULES_DIR / f"{code}_{code_short}"
        rag_path = dept_dir / "17_rag_pipeline.py"
        rag_path.write_text(make_rag(code, code_short, name_ar, name_en, date), encoding="utf-8")
        written += 1
    print(f"[STATS] RAG pipelines generated: {written}")


if __name__ == "__main__":
    main()
