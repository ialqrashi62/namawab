# ADM-105 — Engine Module

```ts
// namaweb/engines/adm_105/main.engine.ts
import { Engine, ExecutionContext, PatientPort, GuidelinePort, AuditPort, CalculatorPort, RAGPort } from '../../shared';

interface adm_105_Input {
  visitId: string; patientId: string; providerId: string;
  context: any; // specialty-specific
}

interface adm_105_Output {
  result: any; redFlags: RedFlag[]; citations: Citation[];
  confidence: number; warnings: string[]; requiresHumanReview: boolean;
}

export class adm_105_Engine implements Engine<adm_105_Input, adm_105_Output> {
  id = 'ADM-105:main_assessment';
  version = '1.0.0';
  safetyClass = 'standard';

  constructor(
    private readonly patientRepo: PatientPort,
    private readonly guideline: GuidelinePort,
    private readonly rag: RAGPort,
    private readonly calc: CalculatorPort,
    private readonly audit: AuditPort,
  ) {}

  async execute(input: adm_105_Input, ctx: ExecutionContext): Promise<adm_105_Output> {
    const tenantId = ctx.requireTenantScope();
    const ctxBundle = input.context ? null : await this.patientRepo.getContext(input.patientId, tenantId);
    const chunks = await this.rag.retrieve({ query: 'specialty context', corpus: ['cba','adm'], topK: 5, tenantId });
    const redFlags = [] as RedFlag[];

    const llm = await this.langchain.build('PROMPT:ADM-105:main_assessment', { input, ctxBundle, chunks, redFlags, availableCalcs: this.calc.listForDept('ADM-105'), tenantId });
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
