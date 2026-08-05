# PSYC-001 — LangChain

```ts
// chains/psyc_001/initial_assessment.ts
import { UniversalChain } from 'src/langchain/UniversalChain';

export class PSYC_001_Initial_Assessment extends UniversalChain<Input, Output> {
  id = 'CHAIN:PSYC-001:initial_assessment';
  version = '1.0.0';
  deptId = 'PSYC-001';
  safetyClass = 'critical';

  async prepInput(req) { /* see TPL:DEPT/CHAIN */ }
  async buildLLM(input) { return {prompt_id: 'PROMPT:PSYC-001:initial_assessment', max_tokens: 1500, temperature: 0.1 }; }
  async parseOutput(raw) { /* JSON parse + validate */ }
}
```

Chains for PSYC-001:
- CHAIN:PSYC-001:initial_assessment
- CHAIN:PSYC-001:risk_stratification
- CHAIN:PSYC-001:plan_generation

Each chain inherits `preGuardrails` + `postGuardrails` from base.

---

*Owner: AIE — 2026-08-01*
