# OBG-001 — LLM Observability

## LangSmith Traces
- Project: nama-medical-obg
- Tags: preeclampsia, gdm, pph, labor, postpartum
- Metadata: tenant_id, encounter_id, gestational_age, user_role

## Metrics (Weekly)
| Metric | Target | Current |
|---|---|---|
| Latency P50 | <1.5s | TBD |
| Latency P95 | <4s | TBD |
| Token usage / request | <2K | TBD |
| Hallucination rate | <2% | TBD |
| PPH detection accuracy | >95% | TBD |
| Preeclampsia detection (early) | >90% | TBD |
| User satisfaction (CSAT) | >4.5/5 | TBD |

## Drift Monitoring
- ASPRE risk distribution shift
- Apgar score distribution
- PPH rate
- C-section rate
- Vacuum delivery rate

## Golden Dataset (100 cases)
- Normal pregnancy (20)
- Preeclampsia (15)
- GDM (10)
- Preterm labor (10)
- PPH (10)
- Multiple gestation (5)
- IVF pregnancy (5)
- Ectopic (5)
- Infertility (5)
- Gyn-onc referral (5)
- Cervical cancer screening (5)
- Menopause (5)

## Eval Pipeline
- **Pre-deploy:** Full golden set
- **Nightly:** 10% sample
- **Weekly:** Full
- **On-incident:** 100% affected

## Human-in-the-Loop
- **Mandatory for:** PPH protocol, MgSO4 order, delivery mode change
- **Recommended for:** Preeclampsia classification, GDM management
- **Optional for:** Documentation, screening recommendations

## Compliance
- **PDPL:** Pregnancy = special category (auto-redact + access-restricted)
- **Audit log:** Every AI recommendation (hash, tenant, user)
- **JCI:** All perinatal decisions documented
- **MOH:** Maternal + perinatal mortality reporting
