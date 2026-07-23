# MICU — Data Flow

## Architecture
```
[Browser/Mobile]
  → [Express API] → [Middleware: auth/tenant/rbac/validation]
  → [MICU Engine] (pure functions: SOFA, APACHE, sepsis, vent)
  → [PostgreSQL] (15 tables, RLS, FORCE_RLS)
  → [PGVector] (RAG chains: sepsis, ARDS, vent weaning)
  → [LLM Service] (OpenAI/Anthropic, PHI-redacted)
  → [Audit Log] (hash-chained, 7-year)
  → [Observability] (LangSmith, Sentry, PG logs)
```

## Request Flow Example: Record Vitals
```
1. Nurse opens ICU dashboard (browser)
2. Enters vitals (HR, BP, RR, SpO2, temp)
3. POST /api/micu/admissions/1234/vitals
   - Body: { admissionId: 1234, heartRate: 110, map: 65, ... }
4. requireAuth → session valid (nurse session)
5. requireTenantScope → tenant_id from session
6. requireRole(['nurse']) → OK
7. validateBody → schema check
8. INSERT INTO icu_vitals (...) → success
9. Trigger: AI early warning (qSOFA)
   - qSOFA = 2 (HR>22? No; SBP≤100? No; GCS<15? Yes + RR≥22? No) = 1... recalc
   - If high risk → alert intensivist, activate bundle
10. Return 201 with new vital record
```

## Sepsis Bundle Flow
```
1. Vitals show: HR 110, SBP 85, RR 24, SpO2 94, temp 39.5
2. qSOFA = 3 (HR>22? Yes; SBP≤100? Yes; GCS<15? Assume 14 = Yes) = 3
3. AI alerts: "Possible sepsis, activate hour-1 bundle"
4. ICU nurse sees alert, draws lactate + blood cultures
5. Bundle timer starts (system logs bundle_started_at)
6. MD orders empiric ABX (e.g., pip-tazo 4.5g IV)
7. ABX started within 45 min → bundle met
8. If hypotensive after 30 mL/kg → norepinephrine
9. Bundle completed, marked COMPLIANT
10. Audit log: 7 steps, time-to-completion, outcome
```

## Ventilator Liberation Flow
```
1. Daily screen: P/F 220, PEEP 6, FiO2 0.4, no pressor, GCS 14
2. RSBI calculated: f=18, Vt=0.5 → 36 (passes)
3. AI suggests: "Ready for SBT"
4. RT performs SBT (T-piece, 30 min)
5. Patient tolerates: RR stable, SpO2 stable, no distress
6. MD orders extubation
7. Document SBT result
8. Extubation performed (RT or MD)
9. Post-extubation monitoring
10. Outcome: success → continue; failure → reintubate
```

## Critical Value Callback
```
1. Lab result: K+ = 6.8 (critical)
2. System flags as critical
3. Auto-page ICU nurse (3 attempts)
4. Nurse acknowledges, calls MD
5. Treatment: calcium gluconate, insulin + D50, kayexalate, dialysis eval
6. Document callback: who, when, what action
7. Audit log: critical value, time-to-callback
```

## Code Status Change
```
1. Family meeting → discussion of prognosis
2. Patient/family decides: DNR / comfort care
3. MD documents in icu_code_status
4. Audit log: change, family present, advance directive
5. Bedside chart updated
6. Nursing handoff
7. Pharmacy notified (no escalation meds)
```

## RAG Chain (Sepsis) Flow
```
1. User query: "65M, septic shock, hypotensive after 2L fluid"
2. Embed query → MedEmbed 768d
3. Search critical_care_scenarios_idx (HNSW, top 5)
4. Retrieve: hour-1 bundle, norepinephrine protocol
5. LLM (GPT-4) with system prompt + retrieved context
6. Generate recommendation (deterministic, temp 0)
7. PHI auto-redacted before LLM call
8. Return: bundle checklist, drug dose, monitoring
9. Audit log: query hash, response hash
```

## Multi-Tenant Isolation
```
Session: { userId: 5, tenantId: 'uuid-X' }
All queries: WHERE tenant_id = 'uuid-X'
RLS Policy: USING (tenant_id = current_setting('app.tenant_id')::uuid)
Tenant from URL/body → IGNORED (use session)
```

## Failure Modes
- **DB unavailable:** Return 503, queue writes
- **LLM timeout:** Fall back to deterministic rules
- **Audit log full:** Block writes (fail-closed)
- **PHI leak detected:** Page on-call, freeze session
