# ANES-001 — LangChain

```ts
// chains/anes_001/initial_assessment.ts
import { UniversalChain } from 'src/langchain/UniversalChain';

export class ANES_001_Initial_Assessment extends UniversalChain<Input, Output> {
  id = 'CHAIN:ANES-001:initial_assessment';
  version = '1.0.0';
  deptId = 'ANES-001';
  safetyClass = 'critical';

  async prepInput(req) { /* see TPL:DEPT/CHAIN */ }
  async buildLLM(input) { return {prompt_id: 'PROMPT:ANES-001:initial_assessment', max_tokens: 1500, temperature: 0.1 }; }
  async parseOutput(raw) { /* JSON parse + validate */ }
}
```

Chains for ANES-001:
- CHAIN:ANES-001:initial_assessment
- CHAIN:ANES-001:risk_stratification
- CHAIN:ANES-001:plan_generation

Each chain inherits `preGuardrails` + `postGuardrails` from base.

---

*Owner: AIE — 2026-08-01*
