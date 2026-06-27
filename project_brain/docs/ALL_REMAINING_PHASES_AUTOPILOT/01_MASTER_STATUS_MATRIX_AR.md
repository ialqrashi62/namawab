# Master Status Matrix — كل المراحل والمجموعات (مراجعة شاملة)

> 2026-06-23 | مراجعة تنظيمية للقراءة، تعتمد على ما نُفِّذ فعلاً. لا تغيير إنتاجي. الأعمدة: مُنجز؟ / الآن؟ / مرشّح فقط؟ / DDL؟ / نشر كود؟ / طرف خارجي؟ / مفتاح-شهادة؟ / PHI حقيقي؟ / المخاطرة / البوابة التالية.

## Phase A Residuals / Infra Security
| البند | مُنجز | الآن | مرشّح | DDL | كود | خارجي | مفتاح/شهادة | PHI | مخاطرة | البوابة التالية |
|---|---|---|---|---|---|---|---|---|---|---|
| A3 DPAPI KEK escrow/readiness | لا | نعم(وثيقة) | نعم | لا | لا | لا | لا(توثيق) | لا | منخفضة | APPROVE_A3_DPAPI_KEK_ESCROW_READINESS |
| A3 Vault/KMS المرحلة 2 | لا | لا | نعم | لا | نعم(لاحقاً) | نعم(Vault/KMS) | نعم | لا | متوسطة | APPROVE_VAULT_KMS_PHASE2_KEY_MODEL |
| نسخ مشفّرة offsite | لا | لا | نعم | لا | لا(سكربت) | نعم(وجهة) | نعم(KEK) | لا | متوسطة | يعتمد على المفتاح + وجهة offsite |
| restore drill على DB معزولة | **نعم(هذه الجلسة)** | تم | لا | لا | لا | لا | لا | لا | منخفضة | (دوري) |
| audit-reader GRANT | لا | لا | نعم | لا(GRANT) | نعم(endpoint) | لا | لا | لا | منخفضة | APPROVE_AUDIT_READER_GRANT_AND_DEPLOY |
| tenant_id index | لا | نعم(آمن) | نعم | نعم(INDEX CONCURRENTLY) | لا | لا | لا | لا | منخفضة | APPROVE_TENANT_ID_INDEX_CANDIDATE |
| security incident runbook | لا | نعم(وثيقة) | نعم | لا | لا | لا | لا | لا | منخفضة | ضمن موجة الـrunbooks |

## Phase B Integrations
| البند | مُنجز | الآن | مرشّح | DDL | كود | خارجي | مفتاح/شهادة | PHI | مخاطرة | البوابة |
|---|---|---|---|---|---|---|---|---|---|---|
| D0 secrets/key model | **نعم(candidate + DPAPI منفّذ)** | — | — | لا | تم | لا | DPAPI | لا | — | منجز |
| D1 Mirth/NextGen assessment | لا | نعم(وثيقة) | نعم | لا | لا | لا | لا | لا | منخفضة | APPROVE_PHASE_B_D1_MIRTH_ASSESSMENT |
| D2 FHIR sandbox محلي بلا PHI | لا | نعم(candidate) | نعم | لا | نعم(لاحقاً) | لا(محلي) | لا | لا | متوسطة | APPROVE_PHASE_B_D2_FHIR_SANDBOX |
| D3 ZATCA Phase 2 | لا(محاكاة فقط) | لا | نعم | محتمل | نعم | نعم(ZATCA) | نعم(CSID) | لا | عالية | APPROVE_ZATCA_PHASE2_READINESS_ONLY |
| D4 NPHIES | لا | لا | نعم | نعم | نعم | نعم(NPHIES) | نعم(mTLS) | نعم | عالية | APPROVE_NPHIES_READINESS_ONLY |
| D5 PACS/Orthanc sandbox | لا | نعم(candidate) | نعم | محتمل | نعم(خدمة) | لا(محلي) | لا | لا(dummy) | متوسطة | APPROVE_PHASE_B_D5_ORTHANC_PACS_SANDBOX |
| D6 LIS/RIS أجهزة | لا | لا | نعم | محتمل | نعم | نعم(أجهزة) | لا | نعم | متوسطة | يعتمد D1+D2 |
| D7 insurance payer | لا | لا | نعم | نعم | نعم | نعم(payer) | نعم | نعم | عالية | = NPHIES |
| D8 monitoring/queue/retry | لا | نعم(وثيقة) | نعم | لا | نعم(لاحقاً) | لا | لا | لا | منخفضة | ضمن D1 |

## Phase C Clinical Advanced
| البند | مُنجز | الآن | مرشّح | DDL | كود | خارجي | مفتاح | PHI | مخاطرة | البوابة |
|---|---|---|---|---|---|---|---|---|---|---|
| BCMA (barcode med admin) | لا | لا | نعم | نعم | نعم | لا(أجهزة باركود) | لا | نعم | متوسطة | candidate لاحق |
| ICU scores / ESI triage / WHO checklist | لا | نعم(candidate) | نعم | محتمل | نعم | لا | لا | لا(logic) | منخفضة–متوسطة | candidate سريري |
| CDS / drug-interaction/allergy | جزئي(drug_interactions موجود) | نعم(candidate) | نعم | محتمل | نعم | لا | لا | نعم | متوسطة | candidate سريري |
| clinical BI / quality indicators | لا | نعم(candidate) | نعم | لا(قراءة) | نعم | لا | لا | نعم(تجميعي) | منخفضة | candidate BI |
| beta pages (R17) verification/promotion | لا | نعم(read-only) | نعم | لا | لا(حتى المراجعة) | لا | لا | لا | منخفضة(مراجعة) | R17 review (لا merge بلا موافقة) |

## Phase D UX / Ops / AI
| البند | مُنجز | الآن | مرشّح | DDL | كود | خارجي | مفتاح | PHI | مخاطرة | البوابة |
|---|---|---|---|---|---|---|---|---|---|---|
| design system / i18n / accessibility | جزئي(RTL موجود) | نعم(candidate) | نعم | لا | نعم | لا | لا | لا | منخفضة | candidate UX |
| observability/alerts | جزئي(watchdog/health) | نعم(candidate) | نعم | لا | نعم(لاحقاً) | لا | لا | لا | منخفضة | candidate ops |
| HA/DR plan + runbooks + user manuals | جزئي(infra memory) | نعم(وثيقة) | نعم | لا | لا | لا | لا | لا | منخفضة | موجة runbooks |
| AI/RAG assistant blueprint + governance | لا | نعم(وثيقة) | نعم | لا | لا | (نموذج Claude) | لا | لا(blueprint) | منخفضة(ورقي) | candidate AI |

## Phase E Finance / Accounting Optional
| البند | مُنجز | الآن | مرشّح | DDL | كود | خارجي | مفتاح | PHI | مخاطرة | البوابة |
|---|---|---|---|---|---|---|---|---|---|---|
| accounting posting enablement | لا(candidate مُجرّب 63/63) | لا | نعم | نعم | نعم | لا | لا | لا | **عالية** | APPROVE_ACCOUNTING_POSTING_ENABLEMENT (بوابة مخصّصة) |
| revenue/billing readiness | جزئي(invoices/VAT) | نعم(وثيقة) | نعم | لا | — | لا | لا | لا | منخفضة | readiness |
| ZATCA accounting link | لا | لا | نعم | محتمل | نعم | نعم(ZATCA) | نعم | لا | عالية | = D3 |
| insurance financial settlement | لا | لا | نعم | نعم | نعم | نعم | نعم | نعم | عالية | = D4/D7 |

## ملاحظة
المحاسبة تبقى OFF (journal=0). لا يُفتح A1/A2/A3A/A3 إلا regression. R17 لا تُمَسّ. التفاصيل في 02 (الحواجز)، 03 (الطابور)، 04 (الموجة الآمنة)، 05 (قائمة القرار).
