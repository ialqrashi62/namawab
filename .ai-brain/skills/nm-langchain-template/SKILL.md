---
name: nm-langchain-template
description: Use when building any LangChain workflow (chains, agents, tool calling). Loads the canonical patterns: Chain → Tool → Agent → Memory so every LangChain module follows the same structure. Saves ~70% tokens per LangChain module.
---

# LangChain Template — Chains, Tools, Agents, Memory

## When to use

Any LangChain orchestrator: clinical Q&A, medication interaction checker, ICD-10
suggestion, lab interpretation, discharge summary generator.

## Required env

```bash
OPENAI_API_KEY=sk-...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls__...
LANGCHAIN_PROJECT=nama-medical
```

## Pattern 1 — Simple chain (RAG Q&A)

```js
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence } = require('@langchain/core/runnables');

const llm = new ChatOpenAI({ modelName: 'gpt-4o-mini', temperature: 0.2 });

const prompt = PromptTemplate.fromTemplate(`
You are a clinical decision support assistant for {tenant}.
Answer using ONLY the context. Cite each fact with [doc-N].
If unsure, say "I don't know based on provided documents."

Context: {context}
Question: {question}
`);

const chain = RunnableSequence.from([prompt, llm, new StringOutputParser()]);

async function ask({ tenant, context, question }) {
    return await chain.invoke({ tenant, context, question });
}
```

## Pattern 2 — Tool calling agent

```js
const { DynamicTool } = require('@langchain/core/tools');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');

const tools = [
    new DynamicTool({
        name: 'lookup_drug_interaction',
        description: 'Look up drug-drug interactions between two drug names.',
        func: async (input) => {
            const { drug1, drug2 } = JSON.parse(input);
            return await pharmacyEngine.interactions(drug1, drug2);
        }
    }),
    new DynamicTool({
        name: 'compute_ckd_stage',
        description: 'Compute CKD stage given age, sex, creatinine, race.',
        func: async (input) => {
            return await ckdStagingEngine.stage(JSON.parse(input));
        }
    }),
    new DynamicTool({
        name: 'lookup_icd10',
        description: 'Find ICD-10 code by description keyword.',
        func: async (keyword) => {
            const r = await db.query('SELECT code, name FROM icd10_codes WHERE name ILIKE $1 LIMIT 5', [`%${keyword}%`]);
            return JSON.stringify(r.rows);
        }
    })
];

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: 'openai-functions',
    verbose: false,
    maxIterations: 4
});

async function askAgent(query) {
    const r = await executor.call({ input: query });
    return r.output;
}
```

## Pattern 3 — Memory (conversational agent)

```js
const { BufferWindowMemory } = require('langchain/memory');
const { ConversationChain } = require('langchain/chains');

const memory = new BufferWindowMemory({ k: 5, memoryKey: 'history' });
const chain = new ConversationChain({ llm, memory });

async function chat(sessionId, userMsg) {
    return await chain.call({ input: userMsg, sessionId });
}
```

## Pattern 4 — Structured output

```js
const { z } = require('zod');
const { StructuredOutputParser } = require('langchain/output_parsers');

const parser = StructuredOutputParser.fromZodSchema(z.object({
    diagnosis: z.string(),
    confidence: z.enum(['low','moderate','high']),
    recommendations: z.array(z.string()),
    citations: z.array(z.string())
}));

const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`{input}\n{format_instructions}`),
    llm,
    parser
]);

const r = await chain.invoke({
    input: 'Patient: 65M with chest pain, troponin 0.5, ECG ST elevation',
    format_instructions: parser.getFormatInstructions()
});
// r.diagnosis, r.confidence, r.recommendations, r.citations
```

## Pattern 5 — Tracing (observability)

```js
const { getLangchainCallbacks } = require('./middleware/langchain_trace');

async function ask(query) {
    const callbacks = await getLangchainCallbacks({ tenantId, userId });
    return await chain.invoke({ question: query }, { callbacks });
}
```

## Safety

- ❌ Never send PHI to OpenAI without scrubbing (anonymize patient_id → MRN last-4)
- ❌ Never log embeddings or full prompts in production
- ❌ Never trust agent outputs as clinical decisions — show as suggestions only
- ✅ Always cite source documents
- ✅ Always include `confidence` for clinical outputs
- ✅ Always require human confirmation for treatment recommendations

## Token saving

Each LangChain module from scratch = ~300 lines. With template = ~80 lines
unique (tools, prompt). ~70% reduction.