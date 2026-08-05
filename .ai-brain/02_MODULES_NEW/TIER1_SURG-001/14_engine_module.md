# SURG-001 — Engine Module

```ts
// namaweb/engines/surg_001/initial_assessment.engine.ts
import { Engine, ExecutionContext, PatientPort, GuidelinePort, AuditPort, CalculatorPort, RAGPort } from '../../shared';

interface SURG_001_Input {
  visitId: string; patientId: string; providerId: string;
  chiefComplaint: string; hpi: string; exam: string; vitals: Vitals;
  pmh: string[]; currentMeds: Medication[]; allergies: Allergy[];
  socialHistory: SocialHistory; imagingRefs?: ImagingRef[]; labRefs?: LabRef[];
}

interface SURG_001_Output {
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

export class SURG_001_Engine
  implements Engine<SURG_001_Input, SURG_001_Output>
{
  id = 'SURG-001:initial_assessment';
  version = '1.0.0';
  safetyClass = 'critical';

  constructor(
    private readonly patientRepo: PatientPort,
    private readonly guideline: GuidelinePort,
    private readonly rag: RAGPort,
    private readonly calc: CalculatorPort,
    private readonly audit: AuditPort,
  ) {}

  async execute(input: SURG_001_Input, ctx: ExecutionContext): Promise<SURG_001_Output> {
    const tenantId = ctx.requireTenantScope();

    // 1. Patient context
    const ctxBundle = await this.patientRepo.getContext(input.patientId, tenantId);

    // 2. RAG retrieval (specialty corpora filtered)
    const chunks = await this.rag.retrieve({
      query: input.chiefComplaint + ' ' + input.hpi,
      corpus: ['cba', 'guidelines', 'kb_surg-001'],
      topK: 8, tenantId,
    });

    // 3. Red-flag detection
    const redFlags = await this.redFlagDetector(input, ctxBundle);

    // 4. Drug safety
    const drugAlerts = await this.drugChecker.check({
      proposed: [], currentMeds: ctxBundle.currentMeds, allergies: ctxBundle.allergies,
      pregnancy: ctxBundle.pregnancy, renal: ctxBundle.renal, hepatic: ctxBundle.hepatic,
    });

    // 5. LLM call
    const llm = await this.langchain.build('PROMPT:SURG-001:initial_assessment',
      { input, ctxBundle, chunks, redFlags, drugAlerts, availableCalcs: this.calc.listForDept('SURG-001'), tenantId });
    const raw = await llm.invoke();

    // 6. Parse + guardrails
    const parsed = await this.parseOutput(raw);
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

### Composition root

```ts
// registry/engines.ts
engineRegistry.register(new SURG_001_Engine(
  patientRepo, guideline, rag, calc, audit,
));
```

### Tests

- Unit (engine.execute) with mocked ports
- Integration (real DB + langchain mock)
- Clinical safety: red-flag caught
- Citation: every claim cited
- Cross-tenant: throws on missing tenantId

---

*Owner: SA — 2026-08-01 — AUTOPILOT batch*
