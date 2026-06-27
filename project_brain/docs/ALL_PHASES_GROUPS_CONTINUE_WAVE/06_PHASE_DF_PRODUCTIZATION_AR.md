# Wave 6 — Phase D / F Productization (docs/candidates فقط)

| البند | الوصف | التصنيف |
|---|---|---|
| observability candidate | مقاييس/تنبيهات تبني على health+watchdog؛ يشمل استرداد Docker daemon (Wave 4) | CANDIDATE_READY → APPROVE_PHASE_D_OBSERVABILITY_CANDIDATE |
| operator runbook update | PM2/Redis/Docker/health/restore drill/escrow؛ + إجراء حادثة Docker/Redis | COMPLETED_DOCS_ONLY |
| support handover update | جهات/إجراءات الدعم + المسارات الحرجة | COMPLETED_DOCS_ONLY |
| AI governance update | حدود البيانات + موافقة + لا PHI للنماذج بلا إذن | CANDIDATE_READY → APPROVE_PHASE_D_AI_GOVERNANCE_ONLY |
| privacy-safe data boundary policy | لا بيانات مرضى حقيقية للنماذج؛ لا PHI/أسرار في سجلّات الـprompt | COMPLETED_DOCS_ONLY |
| roadmap freeze candidate | تجميد ما بعد القبول؛ جاهز للإقرار | CANDIDATE_READY → APPROVE_FINAL_ROADMAP_FREEZE |
| client acceptance checklist | قائمة قبول (أمان/سريري/تشغيلي/امتثال) | CANDIDATE_READY |
| risk register update | DR/KEK escrow معلّق، تبعية Docker/Redis، تكاملات محجوبة، محاسبة OFF | COMPLETED_DOCS_ONLY |
| CBAHI/HIMSS readiness map | خريطة جاهزية الاعتماد | CANDIDATE_READY |

## سجلّ المخاطر (محدّث)
| المخاطرة | الحالة | التخفيف |
|---|---|---|
| KEK escrow (DR) | **PENDING_OWNER_ACTION** | أداة جاهزة؛ تشغيل المالك |
| Docker daemon ↔ Redis ↔ login | معروفة (عولِجت) | Wave 4 candidate (Redis native / استرداد daemon) |
| تكاملات تنظيمية | محجوبة | جاهزية ورقية؛ شهادات/أطراف |
| المحاسبة | OFF عمداً | بوابة مخصّصة |
| R17 beta | محفوظة b4270c7 | review read-only |

```text
PHASE_DF_STATUS: DOCS_AND_CANDIDATES_READY
PRODUCTION_CHANGES: NONE
```
