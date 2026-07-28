<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — End-to-End Data Flow

## STEMI Activation to D2B Timer

`
┌─────────┐
│ Patient │ arrives at ED
└────┬────┘
     │
     ▼
┌──────────────┐
│ 12-lead ECG  │ (within 10 min)
└────┬─────────┘
     │
     ▼
┌─────────────────┐
│ ED MD reads ECG │ (STEMI confirmed)
└────┬────────────┘
     │
     ▼
┌────────────────────────┐
│ POST /procedures       │ requireAuth + requireTenantScope + requireRole
│ { urgency: STEMI,      │ + validateBody + idempotencyGuard
│   procedure_type: PCI, │
│   door_time: T+0 }     │
└────┬───────────────────┘
     │
     ▼
┌────────────────────┐
│ cath.createProc    │ Controller
│ - tenant_id from   │
│   session (GATE4)  │
│ - INSERT INTO      │
│   cardiac_cath_    │
│   procedures       │
│ - audit event      │
│   cath.activation.│
│   triggered       │
└────┬───────────────┘
     │
     ▼
┌──────────────────────┐
│ DB: tenant_id = X,   │
│ RLS policy enforces  │
│ X can only see X     │
└────┬─────────────────┘
     │
     ▼
┌─────────────────────┐
│ STEMI page activation│
│ - cath lab paged     │
│ - D2B timer starts   │
│ - LLM triage chain   │
│   (stemi_activation) │
│   returns cath lab   │
│   ETA, team list     │
└────┬────────────────┘
     │
     ▼
┌──────────────────┐
│ Patient on table │
│ (T+45)           │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ PCI performed   │
│ Stent implanted  │
│ (T+75-90)        │
└────┬─────────────┘
     │
     ▼
┌──────────────────────────┐
│ POST /door-to-balloon-   │ requireAuth + requireTenantScope
│   timer                  │ + requireRole + validateBody
│ { door_time,             │ + idempotencyGuard
│   balloon_time }         │
└────┬─────────────────────┘
     │
     ▼
┌────────────────────┐
│ Compute D2B        │ cath_lab_engine.calculateD2BTime
│ - minutes          │
│ - compliant (≤90)  │
│ - exception reason │
└────┬───────────────┘
     │
     ▼
┌────────────────────────┐
│ INSERT INTO            │
│ cardiac_cath_procedures│
│   d2b_minutes,         │
│   d2b_compliant        │
│ - audit event          │
│   cath.door_to_balloon│
└────┬───────────────────┘
     │
     ▼
┌──────────────────┐
│ KPI dashboard    │
│ updated          │
└──────────────────┘
`

## Key RLS Touchpoints
- Every INSERT/UPDATE/SELECT enforces 	enant_id = current_setting('app.tenant_id')::UUID
- Even if middleware bypassed, DB blocks
- FORCE ROW LEVEL SECURITY ensures even table owner respects RLS

## Key Audit Touchpoints
- cath.activation.triggered — STEMI page
- cath.door_to_balloon — D2B recorded
- cath.stent_implanted — SFDA UDI scanned
- cath.procedure.completed — MD signed
- cath.consent_signed — patient + witness
- cath.llm.assisted — LLM call

---
*Section 33 of CARD-002. SA voice. L1 DRAFT.*