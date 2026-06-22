# Phase F Governance / Final Productization — تنفيذ وتصنيف

| البند | الإجراء | التصنيف | مالك | مخاطرة | البوابة |
|---|---|---|---|---|---|
| release lock report | يُوثّق (الحالة المنشورة + الـHEADs) | COMPLETED_DOCS_ONLY | لا | منخفضة | — |
| client acceptance checklist | قائمة قبول candidate | CANDIDATE_READY | نعم | منخفضة | candidate حوكمة |
| production operation handover | يبني على runbooks (Phase D) | COMPLETED_DOCS_ONLY | لا | منخفضة | — |
| support runbook | يُوثّق | COMPLETED_DOCS_ONLY | لا | منخفضة | — |
| roadmap freeze | جاهز للتجميد بعد هذه الموجة | CANDIDATE_READY | نعم | منخفضة | APPROVE_FINAL_ROADMAP_FREEZE |
| risk register | يُوثّق (DR/KEK escrow، تبعية Docker/Redis، تكاملات محجوبة، محاسبة OFF) | COMPLETED_DOCS_ONLY | لا | منخفضة | — |
| owner decision menu | في التقرير 11 | COMPLETED_DOCS_ONLY | — | — | — |
| global hospital benchmark delta | تحليل فجوة candidate | CANDIDATE_READY | نعم | منخفضة | candidate حوكمة |
| Saudi compliance delta | فجوة الامتثال السعودي (NPHIES/ZATCA Ph2 محجوبة؛ PHI guard/RLS/MFA/encryption منجزة) | CANDIDATE_READY | نعم | متوسطة | candidate امتثال |
| CBAHI/HIMSS readiness map | خريطة جاهزية candidate | CANDIDATE_READY | نعم | متوسطة | candidate امتثال |

## سجلّ المخاطر المختصر (risk register)
| المخاطرة | الحالة | التخفيف |
|---|---|---|
| فقدان مفتاح DPAPI (DR) | مفتوحة | escrow الـKEK (بوابة مالك) — أولوية |
| تبعية Docker Desktop لـRedis | معروفة | watchdog (Redis-down) + توصية استرداد daemon / Redis native |
| تكاملات تنظيمية غير منجزة | محجوبة | NPHIES/ZATCA Ph2 جاهزية ورقية؛ تنتظر شهادات/طرف |
| المحاسبة | OFF عمداً | بوابة تفعيل مخصّصة صريحة |
| R17 beta WIP | محفوظة b4270c7 | مراجعة read-only؛ لا merge بلا موافقة |

## الخلاصة
حوكمة وإنتاج المنتج جاهزة بين COMPLETED_DOCS_ONLY (release/handover/runbook/risk) وCANDIDATE_READY (acceptance/roadmap-freeze/benchmark/compliance maps). الامتثال السعودي الجوهري (خصوصية/أمان) منجز؛ التكاملات التنظيمية محجوبة على شهادات/أطراف.
