# OBG-001 — Data Flow

```
Client (provider)
   ↓ HTTP
API gateway (CSP/CORS/rate-limit/session)
   ↓
Express route (requireAuth + tenant + role + validateBody)
   ↓
Engine.execute(input, ctx)
   ├─→ PatientRepo.getContext (PG)
   ├─→ GuidelinePort.search (vector + bm25)
   ├─→ RedFlagDetector (server-side)
   ├─→ DrugChecker (server-side, SFDA)
   ├─→ LangChain.build (PROMPT:OBG-001:...)
   ├─→ LLM.invoke (gpt-4o or claude-3.5)
   ├─→ parseOutput (JSON schema)
   ├─→ postGuardrails
   └─→ AuditRecord (hash-chained)
   ↓
DB transaction (insert visit + orders + ai_assessment + audit hash)
   ↓
Response (JSON)
```

---

*Owner: SA — 2026-08-01*
