# 22 — سجل المنتج الموحّد (Consolidated Product Backlog)

> 2026-06-22 | ≥100 بند مشتقّ من الفجوات (03) والقصص (09). صيغة مضغوطة: ID | Epic | البند | Pri | الوحدة | UI/API/DB | تعقيد | يعتمد على.
> المراحل: Phase A=أمن/امتثال أساسي، B=تكاملات، C=ميزات سريرية متقدّمة، D=UX/تشغيل/AI.

| ID | Epic | البند (Feature/Story) | Pri | الوحدة | نوع | تعقيد | Deps | Phase |
|---|---|---|---|---|---|---|---|---|
| B1 | Security | MFA/TOTP | P1 | auth | API+DB | متوسط | mfa_secrets | A |
| B2 | Security | تشفير at-rest (pgcrypto/disk) | P1 | infra | Infra | متوسط | - | A |
| B3 | Security | secure file vault لـPHI | P1 | storage | Infra | متوسط | - | A |
| B4 | Security | CSP صارم | P3 | api | API | منخفض | - | D |
| B5 | Security | per-route rate-limit | P3 | api | API | منخفض | - | D |
| B6 | Security | session تدوير/أجهزة | P3 | auth | API | منخفض | - | D |
| B7 | Security | entitlement guard backend per-endpoint | P2 | facility | API | متوسط | - | B |
| B8 | EMR | توقيع/قفل السجل | P0 | EMR | API+DB | متوسط | document_signatures | A |
| B9 | EMR | ترميز ICD-10/CPT | P1 | EMR | DB+UI | متوسط | clinical_codes | B |
| B10 | EMR | قوالب سريرية | P2 | EMR | UI | منخفض | - | C |
| B11 | EMR | تنبيه قيم حرجة | P1 | lab/EMR | API | متوسط | - | B |
| B12 | LIS | LOINC + تكامل أجهزة HL7/ASTM | P1 | lab | Integration | عالٍ | hl7 | B |
| B13 | LIS | باركود عينة | P2 | lab | UI+API | متوسط | - | C |
| B14 | RIS/PACS | DICOM/PACS viewer | P1 | radiology | Integration | عالٍ | dicom_studies | B |
| B15 | RIS | تقارير synoptic | P2 | radiology | UI | متوسط | - | C |
| B16 | Pharmacy | DDI engine فعّال | P1 | pharmacy | API+DB | متوسط | drug_interactions | B |
| B17 | Pharmacy | تتبّع دفعة/انتهاء متقدّم | P1 | pharmacy | API | متوسط | - | B |
| B18 | Nursing | BCMA باركود (5 rights) | P1 | emar | UI+API | عالٍ | - | C |
| B19 | Nursing | قوالب Braden/Morse | P2 | nursing | UI+DB | منخفض | - | C |
| B20 | ICU | APACHE/SOFA آلي | P1 | icu | API | متوسط | - | C |
| B21 | Admissions | HL7 ADT events | P1 | admissions | Integration | عالٍ | hl7 | B |
| B22 | Beds | bed board بصري | P2 | beds | UI | متوسط | - | C |
| B23 | OR | WHO surgical checklist | P1 | surgery | UI+DB | منخفض | who_checklist | C |
| B24 | ED | ESI triage آلي | P1 | emergency | API | متوسط | triage | C |
| B25 | Blood Bank | chain of custody/cold chain | P1 | blood_bank | API+DB | متوسط | - | C |
| B26 | Billing | بوابة دفع/POS/تقسيط | P2 | invoices | Integration | متوسط | - | B |
| B27 | Insurance | NPHIES eligibility | P1 | insurance | Integration | عالٍ | - | B |
| B28 | Insurance | NPHIES claims تبادل | P1 | insurance | Integration | عالٍ | - | B |
| B29 | Finance | تفعيل الترحيل المحاسبي (gated) | P1 | finance | DB+API | عالٍ | gate | A |
| B30 | Finance | تقارير مالية (trial balance/P&L) | P2 | finance | Report | متوسط | B29 | B |
| B31 | ZATCA | فوترة مرحلة-2 (QR/XML موقّع) | P1 | zatca | Integration | عالٍ | - | B |
| B32 | Inventory | 3-way match (PO/GRN/فاتورة) | P2 | inventory | Workflow | متوسط | - | C |
| B33 | Inventory | باركود مخزون | P2 | inventory | UI+API | متوسط | - | C |
| B34 | HR | WPS رواتب | P2 | hr | Integration | متوسط | - | B |
| B35 | Integration | FHIR R4 facade | P1 | integration | Integration | عالٍ | fhir_resources | B |
| B36 | Integration | HL7 v2 engine (ADT/ORM/ORU) | P1 | integration | Integration | عالٍ | hl7_messages | B |
| B37 | Integration | محرّك قنوات (Mirth-style) | P1 | integration | Integration | عالٍ | integration_channels | B |
| B38 | Integration | SMS/email تذكير | P2 | appointments | Integration | منخفض | - | B |
| B39 | Integration | Mawid/Seha | P2 | appointments | Integration | عالٍ | - | B |
| B40 | Telemedicine | WebRTC فيديو | P2 | telemedicine | Integration | عالٍ | - | C |
| B41 | Portal | بوابة مريض موسّعة | P2 | portal | UI+API | متوسط | - | C |
| B42 | Consent | توقيع رقمي/لوح | P2 | consent | UI+API | متوسط | - | C |
| B43 | Analytics | طبقة BI/لوحات تفاعلية | P2 | reports | Report | عالٍ | - | C |
| B44 | Analytics | تصدير PDF/Excel موحّد | P3 | reports | Report | منخفض | - | D |
| B45 | Audit | قارئ تدقيق super-admin (gated) | P2 | audit | DB+API | منخفض | gate | B |
| B46 | Compliance | وحدة CBAHI checklist | P2 | compliance | Report | متوسط | - | C |
| B47 | Compliance | retention policy + أرشفة | P2 | infra | DB+Policy | متوسط | retention_policies | B |
| B48 | Infra | نسخ مشفّرة مجدولة + offsite | P1 | infra | Infra | متوسط | - | A |
| B49 | Infra | alerting/APM | P2 | infra | Infra | متوسط | - | C |
| B50 | Infra | SLA dashboard | P3 | infra | Report | متوسط | - | D |
| B51 | Infra | HA/DR topology | P2 | infra | Infra | عالٍ | - | D |
| B52 | Infra | فهارس tenant_id (89، gated) | P3 | db | DB | منخفض | gate | D |
| B53 | Testing | suite آلي (Jest/supertest/Playwright) | P2 | test | Test | عالٍ | - | B |
| B54 | Testing | CI gate قبل الدمج | P2 | ci | Infra | متوسط | B53 | B |
| B55 | UX | i18n ملفات منفصلة | P3 | ui | UI | منخفض | - | D |
| B56 | UX | مكتبة مكوّنات موحّدة | P2 | ui | UI | متوسط | - | C |
| B57 | UX | skeletons موحّدة | P3 | ui | UI | منخفض | - | D |
| B58 | UX | مركز إشعارات | P3 | ui | UI+API | متوسط | notifications | D |
| B59 | UX | بحث عام متقدّم | P2 | search | API | متوسط | - | C |
| B60 | AI | مساعد سريري RAG (غير-PHI أولاً) | P3 | ai | Integration | عالٍ | pgvector | D |
| B61-B72 | Modules | تعميق ICU/ED/OBGYN/Cosmetic/Rehab/Dental/Pathology/CSSD/Infection/Maintenance/Quality/CME (workflows+تقارير) | P2 | المعنية | UI+API | متوسط | - | C |
| B73-B79 | Beta pages | بناء/تأكيد backend لـClinical Research/Public Health/Crisis/Smart Facility/Legal/Toxicology/Big Data/Patient Journey أو وسمها beta | P2 | beta | API+DB | عالٍ | - | C |
| B80-B89 | Dashboards | لوحات per-role قابلة للتخصيص (10 أدوار) | P3 | dashboards | UI | متوسط | B43 | D |
| B90-B95 | Reports | تقارير قسمية (مالية/سريرية/تشغيل/HR/مخزون/جودة) | P2 | reports | Report | متوسط | - | C |
| B96 | EMR | odontogram (أسنان) | P3 | dental | UI | متوسط | - | D |
| B97 | OBGYN | partograph | P3 | obgyn | UI | متوسط | - | D |
| B98 | Quality | RCA/CAPA workflow | P2 | quality | Workflow | متوسط | - | C |
| B99 | Infection | NHSN-style HAI surveillance | P2 | infection | Report | متوسط | - | C |
| B100 | Maintenance | PM scheduling آلي | P3 | maintenance | Workflow | منخفض | - | D |
| B101 | Defense-in-depth | AND tenant_id صريح على UPDATE/SELECT | P3 | api | API | منخفض | - | D |
| B102 | CSSD | باركود تتبّع أدوات | P3 | cssd | UI+API | متوسط | - | D |
| B103 | Catalog | تسعير per-tenant عبر overrides (تعميق) | P2 | catalog | API+DB | متوسط | - | C |

## 6-12
المتطلبات: تحويل البنود إلى sprints حسب Phase A→D. الأولويات: A (أمن/EMR/نسخ) ثم B (تكاملات) ثم C (سريري) ثم D (UX/AI). المخاطر: الاعتماديات على التكاملات الخارجية. توصيات: كل بند عبر بوابة بموافقة؛ احترام شجرة الجلسة الموازية. Acceptance: ≥100 بند (✅ 103+). Next: 00 Executive Summary + README + 99 Matrix.
