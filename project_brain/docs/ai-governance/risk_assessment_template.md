# AI Risk Assessment — Template
v1.0 — Required before launch of any moderate/high tier AI feature

## 0. Meta
- **Feature**: ...
- **Risk tier**: ...
- **Author / date**: ...
- **Approvers (sign+date)**: AI Lead / Clinical Champion / DPO / CISO / Quality

## 1. Use case
- Description: ...
- Population: ...
- Decision affected: ...
- Frequency of use: ...

## 2. Failure modes (FMEA-style)
| ID | Failure mode | Cause | Effect on patient | Sev (1–5) | Likelihood (1–5) | Detectability (1–5) | RPN | Mitigation |
|----|--------------|-------|-------------------|-----------|------------------|---------------------|-----|-----------|
| F1 | False negative STEMI | model error | delayed reperfusion | 5 | 2 | 3 | 30 | clinician overread; sensitivity threshold |
| F2 | False positive STEMI | model error | unnecessary cath | 3 | 3 | 2 | 18 | physician confirm pre-activation |
| F3 | PHI leak via prompt | infra | privacy breach | 5 | 1 | 3 | 15 | redaction + DLP gateway |
| F4 | Drift over 6 mo | data shift | accuracy decay | 4 | 3 | 3 | 36 | monthly drift monitor |
| F5 | Bias against subgroup | data | inequitable care | 4 | 3 | 4 | 48 | subgroup audit + augmentation |
| F6 | UI misinterpretation | UX | wrong action | 3 | 2 | 3 | 18 | UX testing + advisory banner |
| ... | | | | | | | | |

## 3. Bias & fairness analysis
- Subgroup definitions: ...
- Performance gaps observed: ...
- Mitigation plan: ...

## 4. Privacy & data
- Data sources + lawful bases.
- Residency.
- Retention.
- Reuse limitations.

## 5. Human oversight design
- Where in workflow does a human review?
- What override is enabled?
- How is dissent captured?

## 6. Safety net
- Rollback plan if performance degrades.
- Kill switch + how to invoke.

## 7. Communications
- To clinicians (training + banner copy).
- To patients (Privacy Policy / Consent).

## 8. Approval
- AI Governance Committee minutes ref: ...
- Conditions for launch (if any): ...
- Re-review trigger conditions: ...
