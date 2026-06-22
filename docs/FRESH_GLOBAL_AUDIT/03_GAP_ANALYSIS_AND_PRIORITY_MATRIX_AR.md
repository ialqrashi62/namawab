# 03 — تحليل الفجوات ومصفوفة الأولويات (Gap Analysis)

> 2026-06-22 | يقارن الواقع (01) بالمعايير (02). تحليل فقط، لا تنفيذ. الأولوية: P0 حرج/أمني، P1 عالي القيمة، P2 تحسين، P3 اختياري.

## 1-4 الهدف/النطاق/المنهجية/الأدلة
الهدف: قائمة فجوات قابلة للتنفيذ مصنّفة. المنهجية: لكل قدرة عالمية مقابل الحالي → فجوة + خطورة + قيمة + أثر + تعقيد + أولوية + نوع تنفيذ (UI/API/DB/Workflow/Report/Integration). الأدلة: جرد 01 + benchmark 02.

## 5. مصفوفة الفجوات (≥60 صف)
| # | القدرة الحالية | المتوقّع عالمياً | الفجوة | خطورة | قيمة عمل | قيمة سريرية | أثر أمني | أثر بيانات | أثر UX | تعقيد | أولوية | الإجراء | النوع |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | session login | MFA/2FA | لا MFA | عالٍ | م | - | عالٍ | - | م | متوسط | P1 | إضافة TOTP/OTP | API+DB |
| 2 | RBAC 11 دور | RBAC دقيق per-field | حراسة حقول جزئية | متوسط | م | م | عالٍ | م | - | متوسط | P1 | حقول حسّاسة per-role | API |
| 3 | RLS 148 | تشفير at-rest/in-transit | تأكيد تشفير | متوسط | - | - | عالٍ | عالٍ | - | متوسط | P1 | TLS+pgcrypto توثيق | Infra |
| 4 | EMR records | توقيع إلكتروني + قفل | لا lock/توقيع | عالٍ | م | عالٍ | عالٍ | عالٍ | م | متوسط | P0 | finalize+signature | API+DB |
| 5 | medical_records_coding | ICD-10/CPT مدمج | كتالوج ICD فارغ | عالٍ | عالٍ | عالٍ | - | عالٍ | م | متوسط | P1 | تعبئة ICD/CPT | DB+Report |
| 6 | lab_results | LOINC + أجهزة HL7/ASTM | لا LOINC/أجهزة | عالٍ | عالٍ | عالٍ | - | عالٍ | - | عالٍ | P1 | LIS interface | Integration |
| 7 | lab_samples | باركود عينة | لا باركود | متوسط | م | عالٍ | - | م | م | متوسط | P2 | barcode | UI+API |
| 8 | radiology | PACS/DICOM viewer | غياب PACS | عالٍ | عالٍ | عالٍ | م | عالٍ | عالٍ | عالٍ | P1 | DICOM/PACS | Integration |
| 9 | radiology reports | structured/synoptic | تقارير نصّية | متوسط | م | عالٍ | - | م | م | متوسط | P2 | synoptic templates | UI |
| 10 | pharmacy dispense | تفاعلات دوائية فعّالة | drug_interactions فارغ | عالٍ | م | عالٍ | - | عالٍ | م | متوسط | P1 | DDI engine | API+DB |
| 11 | emar | BCMA باركود (5 rights) | لا باركود | عالٍ | م | عالٍ | عالٍ | عالٍ | م | عالٍ | P1 | BCMA | UI+API |
| 12 | nursing assessments | قوالب معيارية (Braden/Morse) | قوالب عامة | متوسط | - | عالٍ | - | م | م | منخفض | P2 | scored templates | UI+DB |
| 13 | icu_scores | APACHE/SOFA آلي | إدخال يدوي | عالٍ | م | عالٍ | - | م | - | متوسط | P1 | auto-score | API |
| 14 | admissions | HL7 ADT events | لا ADT | عالٍ | عالٍ | م | م | عالٍ | - | عالٍ | P1 | ADT messaging | Integration |
| 15 | beds | bed board بصري | قائمة | متوسط | م | م | - | - | عالٍ | متوسط | P2 | visual board | UI |
| 16 | surgery | WHO safety checklist | لا checklist | عالٍ | م | عالٍ | - | م | م | منخفض | P1 | WHO checklist | UI+DB |
| 17 | emergency | ESI triage آلي | يدوي | عالٍ | م | عالٍ | - | م | م | متوسط | P1 | ESI engine | API |
| 18 | blood_bank | chain of custody/درجة حرارة | تتبّع محدود | عالٍ | م | عالٍ | م | عالٍ | - | متوسط | P1 | cold chain | API+DB |
| 19 | invoices | بطاقات/تقسيط/POS | نقد/تأمين | متوسط | عالٍ | - | م | م | م | متوسط | P2 | payment gateway | Integration |
| 20 | insurance | NPHIES eligibility/claims | لا NPHIES | عالٍ | عالٍ | م | م | عالٍ | - | عالٍ | P1 | NPHIES | Integration |
| 21 | finance GL | posting مفعّل | posting OFF | عالٍ | عالٍ | - | م | عالٍ | - | عالٍ | P1(gated) | enable posting | DB+API |
| 22 | zatca_invoices | مرحلة-2 QR/XML موقّع | حقول فقط | عالٍ | عالٍ | - | م | عالٍ | - | عالٍ | P1 | ZATCA phase-2 | Integration |
| 23 | inventory | 3-way match (PO/GRN/فاتورة) | جزئي | متوسط | عالٍ | - | - | م | - | متوسط | P2 | 3-way match | Workflow |
| 24 | inventory | باركود مخزون | لا باركود | متوسط | م | - | - | م | م | متوسط | P2 | barcode | UI+API |
| 25 | hr payroll | WPS رواتب | لا WPS | متوسط | عالٍ | - | م | م | - | متوسط | P2 | WPS file | Integration |
| 26 | reports | BI/تحليلات تفاعلية | تقارير ثابتة | متوسط | عالٍ | م | - | - | عالٍ | عالٍ | P2 | BI layer | Report |
| 27 | dashboards | per-role قابلة للتخصيص | ثابتة | منخفض | م | - | - | - | عالٍ | متوسط | P3 | custom widgets | UI |
| 28 | audit_trail | قارئ super-admin عبر المستأجرين | candidate gated | متوسط | م | - | عالٍ | م | - | منخفض | P2 | audit-reader (gated) | DB+API |
| 29 | integration | FHIR R4 API | غياب | عالٍ | عالٍ | عالٍ | م | عالٍ | - | عالٍ | P1 | FHIR facade | Integration |
| 30 | integration | HL7 v2 (ADT/ORM/ORU) | غياب | عالٍ | عالٍ | عالٍ | م | عالٍ | - | عالٍ | P1 | HL7 engine | Integration |
| 31 | telemedicine | WebRTC فيديو | جلسات بلا فيديو | متوسط | عالٍ | م | م | م | عالٍ | عالٍ | P2 | WebRTC | Integration |
| 32 | patient portal | بوابة كاملة (نتائج/فواتير/تذاكر) | محدودة | متوسط | عالٍ | م | م | م | عالٍ | متوسط | P2 | portal expand | UI+API |
| 33 | appointments | تذكير SMS/بريد | لا تذكير | متوسط | عالٍ | - | - | - | م | منخفض | P2 | SMS/email | Integration |
| 34 | appointments | Mawid/Seha تكامل | لا | متوسط | عالٍ | م | - | م | - | عالٍ | P2 | Saudi gov integ | Integration |
| 35 | consent | توقيع رقمي/لوح | نص | متوسط | م | م | عالٍ | م | م | متوسط | P2 | e-signature | UI+API |
| 36 | tenant_id index | تغطية 59/148 | 89 غير مفهرس (صغيرة) | منخفض | - | - | - | - | - | منخفض | P3 | index (gated) | DB |
| 37 | i18n | ملفات ترجمة منفصلة | tr() inline | منخفض | م | - | - | - | عالٍ | منخفض | P3 | i18n files | UI |
| 38 | search | بحث مرضى متقدّم/global | أساسي | متوسط | م | م | - | - | عالٍ | متوسط | P2 | search index | API |
| 39 | notifications | مركز إشعارات موحّد | محدود | منخفض | م | - | - | - | عالٍ | متوسط | P3 | notif center | UI+API |
| 40 | file storage | تخزين PHI آمن/مشفّر | uploads مجلّد | متوسط | - | م | عالٍ | عالٍ | - | متوسط | P1 | secure storage | Infra |
| 41 | dental | odontogram | dental_records فقط | منخفض | م | م | - | م | م | متوسط | P3 | odontogram UI | UI |
| 42 | obgyn | partograph | جداول فقط | منخفض | م | عالٍ | - | م | م | متوسط | P3 | partogram | UI |
| 43 | quality | RCA/CAPA workflow | incidents فقط | متوسط | م | م | - | م | م | متوسط | P2 | CAPA workflow | Workflow |
| 44 | infection | NHSN-style مؤشرات | تقارير | متوسط | م | عالٍ | - | م | - | متوسط | P2 | HAI surveillance | Report |
| 45 | cssd | باركود تتبّع أدوات | جداول | منخفض | م | م | - | م | - | متوسط | P3 | barcode CSSD | UI+API |
| 46 | maintenance | PM scheduling آلي | يدوي | منخفض | م | - | - | - | م | منخفض | P3 | PM scheduler | Workflow |
| 47 | backup | drill آلي مجدول + offsite | يدوي/dumps | متوسط | عالٍ | - | عالٍ | عالٍ | - | متوسط | P1 | scheduled backup | Infra |
| 48 | monitoring | alerting/APM | watchdog فقط | متوسط | م | - | م | - | - | متوسط | P2 | alerting | Infra |
| 49 | HA/DR | تكرار/فشل تلقائي | single-box | عالٍ | عالٍ | م | م | عالٍ | - | عالٍ | P2 | HA topology | Infra |
| 50 | facility entitlements | حارس backend per-endpoint | UI map فقط | متوسط | م | - | عالٍ | م | - | متوسط | P2 | entitlement guard | API |
| 51 | data retention | سياسة احتفاظ/أرشفة | غير منفّذة | متوسط | م | - | عالٍ | عالٍ | - | متوسط | P2 | retention policy | DB+Policy |
| 52 | AI assistant | مساعد سريري/RAG | غياب | منخفض | عالٍ | م | عالٍ | عالٍ | عالٍ | عالٍ | P3 | RAG blueprint | Integration |
| 53 | accreditation | CBAHI checklist | غير منهجي | متوسط | عالٍ | م | - | م | - | متوسط | P2 | CBAHI module | Report |
| 54 | clinical_research page | backend/جداول | صفحة beta | متوسط | م | م | - | م | م | متوسط | P2 | build backend | API+DB |
| 55 | public_health/crisis/legal/toxicology/big_data/patient_journey | backend/جداول | صفحات beta | متوسط | م | م | - | م | م | عالٍ | P2 | build or mark beta | API+DB |
| 56 | rate limiting | per-route granular | loginLimiter عام | منخفض | م | - | عالٍ | - | - | منخفض | P3 | granular limits | API |
| 57 | CSP/headers | CSP صارم | helmet أساسي | منخفض | - | - | عالٍ | - | - | منخفض | P3 | CSP tighten | API |
| 58 | session | تدوير/انتهاء/أجهزة | أساسي | منخفض | - | - | عالٍ | - | - | منخفض | P3 | session mgmt | API |
| 59 | export | PDF/Excel موحّد | جزئي | منخفض | م | - | - | - | عالٍ | منخفض | P3 | export service | Report |
| 60 | KPIs/SLA | لوحة SLA تشغيلية | غياب | منخفض | م | - | - | - | م | متوسط | P3 | SLA dashboard | Report |
| 61 | UPDATE/SELECT tenant filter | AND tenant_id صريح (دفاع) | RLS-mitigated | منخفض | - | - | متوسط | م | - | منخفض | P3 | explicit filters | API |
| 62 | test coverage | اختبارات آلية شاملة | static + harness | متوسط | م | - | عالٍ | م | - | عالٍ | P2 | test suite | Test |

## 6-12
- **المتطلبات**: راجع 04 (تصميم الوحدات) لتفصيل كل P0/P1.
- **الأولويات الكبرى P0/P1**: قفل/توقيع EMR (P0)؛ ثم MFA، ICD/CPT، LIS/PACS، DDI، BCMA، ICU scores، ADT، WHO checklist، ESI، blood cold-chain، NPHIES، ZATCA-2، FHIR/HL7، accounting posting (gated)، secure storage، scheduled backup.
- **المخاطر**: تأجيل التكاملات المعيارية يعيق الاعتماد الوطني؛ صفحات beta توحي بنضج غير قائم.
- **Acceptance**: ≥60 صف فجوة مصنّفة P0-P3 (✅ 62 صف).
- **Next**: 04 يصمّم الوحدات/القوائم/الجداول/الأزرار المطلوبة.
