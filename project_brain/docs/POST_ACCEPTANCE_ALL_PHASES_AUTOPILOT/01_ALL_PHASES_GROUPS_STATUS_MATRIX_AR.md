# 01 — مصفوفة حالة كل المراحل والمجموعات (Post-Acceptance)

> 2026-06-22 | مراجعة فقط، لا تنفيذ. لا تكرار A3B. الأعمدة: الحالة | جاهز الآن | محجوب E2E | DDL | DATA | GRANT | طرف خارجي | مفاتيح | مخاطرة | أولوية | الإجراء.

## Phase A — الأمن / السلامة السريرية
| المجموعة | الحالة | جاهز الآن | E2E | DDL | DATA | GRANT | خارجي | مفاتيح | مخاطرة | أولوية | الإجراء |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A1 EMR Lock backend | **منشور ومُتحقَّق** | — | لا | تم | لا | لا | لا | لا | — | ✅ | مكتمل |
| A1 UI + E2E | مؤجّل | لا | **نعم** | لا | لا | لا | لا | لا | متوسط | P1 | بعد حساب اختبار |
| A2 MFA | candidate جاهز | لا | نعم | نعم(مرشّح) | لا | لا | لا | (سر TOTP) | متوسط | P1 | E2E + APPROVE_MFA_DDL_AND_DEPLOY |
| A3 PHI vault/encryption | candidate مُرهَّن | لا | جزئي | نعم(مرشّح) | لا | لا | لا | **نعم (KMS)** | عالٍ | P1 | APPROVE_PHI_ENCRYPTION_VAULT_ROLLOUT + KMS |
| A3A PHI file guard | مصمّم/مؤجّل | لا | نعم(عرض الأشعة) | نعم(phi_files) | لا | لا | لا | لا | عالٍ كامن | P1 | APPROVE_PHI_FILE_GUARD_DEPLOY |
| A3B upload freeze | **سياسة سارية** | — | لا | لا | لا | لا | لا | لا | — | ✅ | مكتمل (لا تكرار) |
| encrypted offsite backup | script candidate | جزئي (محلي بلا تشفير) | لا | لا | لا | لا | (offsite) | (مفتاح للتشفير) | متوسط | P1 | جدولة backup محلي الآن آمن؛ التشفير/offsite يحتاج KMS |
| break-glass / incident response | موثّق (runbook) | — | لا | لا | لا | لا | لا | لا | — | P2 | dual-control عند تفعيل KMS |
| audit hardening | backend code | **نعم** | لا | لا | لا | لا | لا | لا | منخفض | P2 | توسيع logAudit (deploy backend بلا E2E) |

## Phase B — التكاملات
| المجموعة | الحالة | جاهز الآن | E2E | DDL | DATA | GRANT | خارجي | مفاتيح | مخاطرة | أولوية | الإجراء |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FHIR R4 facade | غير مبدوء | لا | — | نعم | لا | لا | **نعم** | محتمل | عالٍ | P1 | تصميم candidate ثم بوابة |
| HL7 v2 (ADT/ORM/ORU) | غير مبدوء | لا | — | نعم | لا | لا | **نعم** | محتمل | عالٍ | P1 | candidate |
| NPHIES | غير مبدوء | لا | — | نعم | لا | محتمل | **نعم (CCHI)** | **نعم** | عالٍ | P1 | عقد + بيئة NPHIES |
| ZATCA Phase 2 | حقول حاضرة | لا | — | محتمل | لا | لا | **نعم (ZATCA)** | **نعم (شهادة)** | عالٍ | P1 | تكامل + شهادة |
| PACS/DICOM | غير مبدوء | لا | — | نعم | لا | لا | **نعم** | لا | عالٍ | P1 | خادم PACS |
| LIS/RIS device | غير مبدوء | لا | — | محتمل | لا | لا | **نعم (أجهزة)** | لا | عالٍ | P1 | واجهة أجهزة |
| insurance integrations | جزئي | لا | — | محتمل | لا | لا | **نعم** | محتمل | عالٍ | P2 | بعد NPHIES |

## Phase C — السريري المتقدّم
| المجموعة | الحالة | جاهز الآن | E2E | DDL | DATA | GRANT | خارجي | مفاتيح | مخاطرة | أولوية | الإجراء |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BCMA باركود | غير مبدوء | لا | **نعم** | محتمل | لا | لا | (أجهزة مسح) | لا | متوسط | P1 | candidate + E2E |
| ICU scores (APACHE/SOFA) | غير مبدوء | جزئي(backend) | جزئي | محتمل | لا | لا | لا | لا | متوسط | P2 | candidate backend |
| ESI triage | غير مبدوء | جزئي(backend) | جزئي | محتمل | لا | لا | لا | لا | متوسط | P1 | candidate backend |
| WHO surgery checklist | غير مبدوء | جزئي | نعم(UI) | نعم(جدول) | لا | لا | لا | لا | منخفض | P1 | candidate |
| clinical decision support | غير مبدوء | لا | نعم | محتمل | لا | لا | محتمل | لا | عالٍ | P3 | تصميم |
| BI / analytics | غير مبدوء | جزئي | لا | لا | لا | لا | لا | لا | منخفض | P2 | layer تقارير (backend) |
| beta pages verification | على فرع R17 | **نعم (مراجعة)** | لا | لا | لا | لا | لا | لا | متوسط | P2 | مراجعة R17 (بلا merge) |

## Phase D — UX / تشغيل / AI
| المجموعة | الحالة | جاهز الآن | E2E | DDL | DATA | GRANT | خارجي | مفاتيح | مخاطرة | أولوية | الإجراء |
|---|---|---|---|---|---|---|---|---|---|---|---|
| design system | موثّق (Blueprint 14) | **نعم (candidate)** | لا | لا | لا | لا | لا | لا | منخفض | P2 | مكتبة مكوّنات |
| i18n | candidate (Blueprint 15) | **نعم (candidate)** | لا | لا | لا | لا | لا | لا | منخفض | P3 | استخراج مفاتيح |
| accessibility | غير مبدوء | جزئي | نعم | لا | لا | لا | لا | لا | منخفض | P3 | تدقيق WCAG |
| alerting/observability | watchdog فقط | **نعم (infra)** | لا | لا | لا | لا | محتمل | لا | منخفض | P2 | قواعد تنبيه |
| HA/DR | single-box | لا | لا | لا | لا | لا | (بنية) | لا | عالٍ | P2 | تصميم topology |
| AI/RAG assistant | blueprint (21) | لا | لا | محتمل | لا | لا | **نعم (LLM)** | **نعم** | متوسط | P3 | غير-PHI أولاً |
| training/user manuals | موثّق (18/19) | **نعم (docs)** | لا | لا | لا | لا | لا | لا | منخفض | P3 | توسيع الأدلة |

## ملخّص
منشور: A1 backend، A3B policy. مرشّحات جاهزة: A2/A3/A3A/backup/i18n/design/training. محجوب E2E: A1 UI، A2 MFA، A3A guard، BCMA، WHO، accessibility. محجوب خارجي/مفاتيح: كل Phase B. قابل الآن بلا E2E/خارجي: audit hardening، scheduled local backup، beta review، BI/observability/design candidates.
