# 14 — Engine Module (PULM-001)

> **Owner:** SA
> **Path:** `namaweb/engines/pulm/initial_assessment.engine.ts`

---

## Hexagonal base

```ts
// engines/pulm/initial_assessment.engine.ts
import {
  Engine, ExecutionContext, PatientPort, GuidelinePort,
  AuditPort, CalculatorPort, RAGPort,
} from '../../shared';

interface PulmAssessmentInput {
  visitId: string;
  patientId: string;
  providerId: string;
  chiefComplaint: string;
  hpi: string;
  exam: string;
  vitals: Vitals;
  pmh: string[];
  currentMeds: Medication[];
  allergies: Allergy[];
  socialHistory: SocialHistory;
  imagingRefs?: ImagingRef[];
  labRefs?: LabRef[];
}

interface PulmAssessmentOutput {
  differential: DifferentialDx[];
  redFlags: RedFlag[];
  drugAlerts: DrugAlert[];
  recommendedOrders: Order[];
  carePlan: CarePlanDraft;
  citations: Citation[];
  confidence: number;
  warnings: string[];
  requiresHumanReview: boolean;
}

export class PulmInitialAssessmentEngine
  implements Engine<PulmAssessmentInput, PulmAssessmentOutput> {

  id = 'PULM-001:initial_assessment';
  version = '1.4.0';
  safetyClass = 'critical';

  constructor(
    private readonly patientRepo: PatientPort,
    private readonly guideline: GuidelinePort,
    private readonly rag: RAGPort,
    private readonly calc: CalculatorPort,
    private readonly audit: AuditPort,
    private readonly redFlagDetector: RedFlagDetector,
    private readonly drugChecker: DrugInteractionChecker,
    private readonly sfda: SFDARegistry,
  ) {}

  async execute(input: PulmAssessmentInput, ctx: ExecutionContext): Promise<PulmAssessmentOutput> {
    const tenantId = ctx.requireTenantScope();

    // 1. Patient context (deidentified)
    const ctxBundle = await this.patientRepo.getContext(input.patientId, tenantId);

    // 2. RAG retrieval
    const chunks = await this.rag.retrieve({
      query: input.chiefComplaint + ' ' + input.hpi,
      corpus: ['gold', 'gina', 'ers_ats', 'cps_guidelines', 'kci_pulm', 'nccn_lung'],
      topK: 8,
      tenantId,
    });

    // 3. Run red-flag detection (server-side authority)
    const redFlags = await this.redFlagDetector.detectPulm(input, ctxBundle);

    // 4. Drug safety check
    const drugAlerts = await this.drugChecker.check({
      proposed: [],
      currentMeds: ctxBundle.currentMeds,
      allergies: ctxBundle.allergies,
      pregnancy: ctxBundle.pregnancy,
      renal: ctxBundle.renal,
      hepatic: ctxBundle.hepatic,
    });

    // 5. Compose LLM call
    const llm = await this.langchain.build('PROMPT:PULM-001:initial_assessment', {
      input,
      ctxBundle,
      chunks,
      redFlags,
      drugAlerts,
      availableCalcs: this.calc.listForDept('PULM-001'),
      tenantId,
    });

    const raw = await llm.invoke();

    // 6. Parse + guardrails
    const parsed = await parsePulmOutput(raw);
    const output = await this.runPostGuardrails(parsed, ctx);

    // 7. Audit
    await this.audit.record({
      tenantId, engineId: this.id, version: this.version,
      input: this.redact(input), output: this.redact(output),
      providerId: ctx.providerId, latencyMs: ctx.elapsed,
      citationCount: output.citations.length,
      redFlagFired: output.redFlags.length > 0,
      confidence: output.confidence,
    });

    return output;
  }
}
```

---

## Engine registry entry

```ts
// registry/engines.ts
engineRegistry.register(new PulmInitialAssessmentEngine(
  patientRepo, guideline, rag, calc, audit, redFlag, drugChecker, sfda,
));
```

---

## Composition root

Each engine has 7-9 dependencies injected. Constructor signature is stable (CI-bumped on change).

---

## Files

```
namaweb/engines/pulm/
├── initial_assessment.engine.ts
├── copd_exacerbation.engine.ts
├── pe_pathway.engine.ts
├── asthma_pathway.engine.ts
├── sleep_study.engine.ts
├── ild_followup.engine.ts
├── lung_cancer_staging.engine.ts
└── bronchoscopy_readiness.engine.ts

namaweb/shared/
├── Engine.ts
├── ExecutionContext.ts
├── ports/
│   ├── PatientPort.ts
│   ├── GuidelinePort.ts
│   ├── RAGPort.ts
│   ├── AuditPort.ts
│   └── CalculatorPort.ts
└── guards/
    ├── RedFlagDetector.ts
    ├── DrugInteractionChecker.ts
    └── SFDARegistry.ts
```

---

## Tests

- Unit (engine.execute) with mocked ports
- Integration (real DB + langchain mock)
- Clinical safety: red-flag caught
- Citation: every claim cited
- Confidence threshold: <0.7 returns UNCERTAIN
- Cross-tenant: throws on missing tenantId (defense-in-depth)

---

*Owner: SA — version 1.0 — 2026-08-01*
