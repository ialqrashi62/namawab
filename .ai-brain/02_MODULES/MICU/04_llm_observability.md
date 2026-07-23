# MICU — LLM Observability

## LangSmith Traces
- **Trace ID:** UUID v7
- **Project:** nama-medical-micu
- **Tags:** sepsis, ards, vent, shock, gi-bleed
- **Metadata:** tenant_id, encounter_id, user_role, model_version

## Metrics (Weekly)
| Metric | Target | Current |
|---|---|---|
| Latency P50 | <1.5s | TBD |
| Latency P95 | <4s | TBD |
| Token usage / request | <2K | TBD |
| Hallucination rate | <2% | TBD |
| Refusal rate | <1% | TBD |
| User satisfaction (CSAT) | >4.5/5 | TBD |
| Bundle compliance (hour-1) | >85% | TBD |

## Drift Monitoring
- **Input drift:** Vital signs distribution shift
- **Output drift:** Recommendation pattern change
- **Concept drift:** New guidelines (SCCM updates)
- **Alert:** Page on-call if drift >2σ

## Golden Dataset (100 cases)
- Septic shock (25)
- ARDS (20)
- Cardiogenic shock (15)
- GI bleed (15)
- DKA (10)
- Stroke (10)
- Drug overdose (5)

## Eval Pipeline
- **Pre-deploy:** Full golden set regression
- **Nightly:** 10% sample
- **Weekly:** Full golden set
- **On-incident:** 100% affected

## Human-in-the-Loop
- **Mandatory for:** vasopressor initiation, code status change
- **Recommended for:** ABX selection, vent settings
- **Optional for:** documentation, lab interpretation

## Compliance
- **PDPL:** PHI auto-redacted before LLM call
- **Audit log:** Every recommendation (hash + tenant + user)
- **JCI:** All critical care decisions documented
