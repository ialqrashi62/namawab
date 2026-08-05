# LAB-101 — Engine Module

```ts
// namaweb/engines/lab_101/main.engine.ts
import { Engine, ExecutionContext, PatientPort, GuidelinePort, AuditPort, CalculatorPort, RAGPort } from '../../shared';

interface lab_101_Input {
  visitId: string; patientId: string; providerId: string;
  context: any; // specialty-specific
}

interface lab_101_Output {
  result: any; redFlags: RedFlag[]; citations: Citation[];
  confidence: number; warnings: string[]; requiresHumanReview: boolean;
}

export class lab_101_Engine implements Engine<lab_101_Input, lab_101_Output> {
  id = 'LAB-101:main_assessment';
  version = '1.0.0';
  safetyClass = 'standard';

  constructor(
    private readonly patientRepo: PatientPort,
    private readonly guideline: GuidelinePort,
    private readonly rag: RAGPort,
    private readonly calc: CalculatorPort,
    private readonly audit: AuditPort,
  ) {}

  async execute(input: lab_101_Input, ctx: ExecutionContext): Promise<lab_101_Output> {
    const tenantId = ctx.requireTenantScope();
    const ctxBundle = input.context ? null : await this.patientRepo.getContext(input.patientId, tenantId);
    const chunks = await this.rag.retrieve({ query: 'specialty context', corpus: ['cba','lab'], topK: 5, tenantId });
    const redFlags = [] as RedFlag[];

    const llm = await this.langchain.build('PROMPT:LAB-101:main_assessment', { input, ctxBundle, chunks, redFlags, availableCalcs: this.calc.listForDept('LAB-101'), tenantId });
    const raw = await llm.invoke();
    const parsed = await this.parseOutput(raw);
    const output = await this.runPostGuardrails(parsed, ctx);

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

*Owner: SA — 2026-08-01*
