---
id: BACKEND-LOGIC
version: 1.0
date: 2026-08-01
owner: SA
status: ACTIVE
---

# Backend / Logic — Hexagonal Base + Event Bus v2 + Background Jobs

> **Purpose:** Standardize the boundary between business logic and infrastructure for every clinical engine. Adopt ports & adapters, CQRS-lite, event bus, and background jobs.

---

## 1. Global systems comparison

| System | Pattern |
|--------|---------|
| **Epic (InterConnect)** | Heavy cache + async events + SmartData |
| **Cerner Millennium** | Domain model + Event-driven + MPages |
| **InterSystems IRIS** | Object-oriented + native event |
| **MEDITECH** | Service-oriented + REST |
| **athena** | Cloud-native clean architecture |
| **NamaMedical** | **Hexagonal per engine + outbox + BullMQ-compatible queue** |

---

## 2. Hexagonal base (port + adapter)

```ts
// src/shared/Engine.ts (canonical)
export interface Engine<I, O> {
  execute(input: I, ctx: ExecutionContext): Promise<O>;
  // Optional: pre/post hooks, validation
}

// engines/cardiology/initial_assessment.engine.ts
export class CardiologyInitialAssessmentEngine implements Engine<CARDInput, CARDOutput> {
  constructor(
    private readonly patientRepo: PatientPort,
    private readonly guideline: GuidelinePort,
    private readonly audit: AuditPort,
    private readonly calculator: CalculatorPort,
  ) {}

  async execute(input: CARDInput, ctx: ExecutionContext): Promise<CARDOutput> {
    const tenantId = ctx.requireTenantScope();
    const patient = await this.patientRepo.findById(input.patientId, tenantId);
    const refs = await this.guideline.search(input.topic, tenantId);
    const calc = await this.calculator.run(input.calculatorName, input.calculatorInput);
    const output: CARDOutput = {
      differential: [],
      recommendations: [],
      red_flag: null,
      citations: refs.map(r => r.citationId),
    };
    await this.audit.record({
      tenantId, engine: 'CARD-001:initial_assessment',
      input: this.redact(input), output: this.redact(output), providerId: ctx.providerId,
    });
    return output;
  }
}
```

**Adapters injected** (postgres, vector store, audit, langchain, etc.).

---

## 3. Event Bus v2 (outbox + idempotency)

```sql
CREATE TABLE event_outbox (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  aggregate_id TEXT NOT NULL,
  aggregate_type TEXT NOT NULL,        -- 'encounter'|'order'|'lab'|'task'
  event_type TEXT NOT NULL,           -- 'encounter.closed','order.placed','lab.resulted'
  event_version INT DEFAULT 1,
  payload JSONB NOT NULL,
  occurred_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,
  publish_attempts INT DEFAULT 0,
  idempotency_key TEXT UNIQUE,
  -- RLS + audit
);
```

**Pattern**:
1. Business operation writes both business row + outbox row in one TX
2. Background poller picks up unpublished outbox rows
3. Dispatches to: subscribers (notifications, audit log, search index, downstream systems)
4. Idempotency-key prevents duplicate publishes

---

## 4. Background Jobs (BullMQ-style)

```ts
// src/jobs/Job.ts
export interface Job<T> {
  id: string;
  name: string;
  payload: T;
  attempts: number;
  backoff?: { type: 'fixed'|'exponential', delay: number };
}

// src/jobs/queue.ts (postgres-backed, no Redis required)
export class Queue {
  async enqueue<T>(name: string, payload: T, opts?: JobOpts): Promise<Job<T>> {...}
  async process(name: string, handler: (job: Job<T>) => Promise<void>): Promise<void> {...}
}
```

**Common jobs**:
- `audit.compact` (nightly)
- `notification.send` (on demand)
- `index.rebuild` (nightly)
- `vector.embed` (chunked)
- `report.generate` (long-running)

---

## 5. CQRS-lite for clinical queries

Reads don't go through engine — they hit repo directly (optimization).

```ts
// src/read/patientChart.ts
export const patientChartRead = {
  async get(pid: string, tenantId: string, opts: ChartOpts): Promise<Chart> {
    return db.query(`SELECT ... FROM ... WHERE tenant_id = $1 AND patient_id = $2`, ...);
  }
}
```

Writes go through engine.execute().

---

## 6. Engine registry

```ts
// src/registry/engine_registry.ts
const engines = new Map<string, Engine<any, any>>();

// Auto-discovery: src/engines/*/engine.ts → registered
export function engine<D extends keyof DeptMap>(
  deptId: D,
  feature: string,
): Engine<...> { return engines.get(`${deptId}:${feature}`); }
```

---

## 7. Files

```
src/
├── shared/
│   ├── Engine.ts
│   ├── ExecutionContext.ts
│   ├── EventBus.ts
│   └── Queue.ts
├── engines/
│   ├── card/
│   │   ├── initial_assessment.engine.ts
│   │   └── risk_stratification.engine.ts
│   ├── er/
│   ├── icu/
│   ├── peds/
│   └── ...
├── events/
│   ├── outbox.ts
│   └── dispatchers/
└── jobs/
    ├── workers/
    └── schedules/
```

---

## 8. Tests

- Unit: per engine (input → output)
- Integration: outbox flow + dispatch
- Idempotency: same op twice → one event
- Cross-tenant: attempts to read across tenants fail

---

*Owner: SA — version 1.0 — 2026-08-01*
