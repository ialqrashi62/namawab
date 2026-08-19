# P0-3 BCMA — LLM Observability

## LLM Endpoints Used
- OpenAI text-embedding-3-small (1536-dim) for vector store
- OpenAI gpt-4 for RAG answer (when needed)

## Tracing
- Each LLM call wrapped in `withTracing(traceName, fn)`
- Logs: prompt, response, latency, token count, tenant_id
- Storage: `llm_traces` table with FORCE RLS

## Cost Tracking
- Embedding: $0.02 / 1M tokens
- GPT-4 input: $30 / 1M tokens
- GPT-4 output: $60 / 1M tokens
- Monthly budget cap: $100 (configurable per tenant)

## Quality Monitoring
- Drug interaction accuracy: spot-check 10% of responses weekly
- Override justification quality: review by pharmacy lead
- RAG retrieval recall: test set of 100 known interactions

## Latency SLA
- Embedding: < 200ms
- RAG retrieval: < 500ms
- RAG answer (if used): < 3s