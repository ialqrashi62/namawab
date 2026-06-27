# NamaMedical — حزمة الفحص العالمي والـProduct Blueprint (الفهرس)

> 2026-06-22 | فحص Fresh من الواقع الحالي + Blueprint كامل. تحليل/توثيق فقط — لا تغيير إنتاجي. 24 تقريراً + ملفات مرشّحة.

## الفهرس
| # | التقرير | الوصف |
|---|---|---|
| 00 | [الملخّص التنفيذي](00_EXECUTIVE_SUMMARY_AR.md) | الحالة + الفجوات + خارطة الطريق |
| 01 | [جرد التطبيق](01_APP_INVENTORY_AR.md) | 51 صفحة، 377 مسار، 162 جدول (≥80 صف) |
| 02 | [المقارنة العالمية](02_GLOBAL_SYSTEMS_BENCHMARK_AR.md) | 22 فئة، 9 أنظمة |
| 03 | [تحليل الفجوات](03_GAP_ANALYSIS_AND_PRIORITY_MATRIX_AR.md) | 62 فجوة P0-P3 |
| 04 | [الوحدات/القوائم/الأزرار](04_REQUIRED_MODULES_MENUS_TABLES_BUTTONS_FRAMES_AR.md) | 36 قسم |
| 05 | [تدفّقات العمل](05_BUSINESS_FLOWS_AND_DATA_FLOWS_AR.md) | 19 تدفّق |
| 06 | [مواصفات الواجهات](06_WIREFRAMES_AND_MOCKUPS_SPEC_AR.md) | 27 شاشة |
| 07 | [ERD ومرشّحات الهجرة](07_DATABASE_ERD_AND_MIGRATION_CANDIDATES_AR.md) | علاقات + جداول ناقصة |
| 08 | [مواصفات API](08_API_SPECIFICATIONS_OPENAPI_AR.md) | + [openapi_candidate.yaml](openapi_candidate.yaml) |
| 09 | [قصص المستخدم](09_USER_STORIES_AND_ACCEPTANCE_CRITERIA_AR.md) | 82 قصة، 14 دور |
| 10 | [خطة الاختبار](10_TEST_CASES_AND_TEST_PLAN_AR.md) | ~125 حالة |
| 11 | [المعمارية](11_ARCHITECTURE_DOCUMENT_AR.md) | حالي + هدف |
| 12 | [خطة الأمن](12_SECURITY_PLAN_AR.md) | تهديدات/ضوابط/خطة |
| 13 | [خطة النشر](13_DEPLOYMENT_PLAN_AR.md) | CI/backup/rollback |
| 14 | [دليل الأسلوب](14_STYLE_GUIDE_AND_DESIGN_SYSTEM_AR.md) | نظام تصميم RTL |
| 15 | [خطة i18n](15_I18N_TRANSLATION_PLAN_AR.md) | + [ar](i18n_ar_candidate.json)/[en](i18n_en_candidate.json) |
| 16 | [البيانات التجريبية](16_SAMPLE_DATA_AND_SEEDERS_PLAN_AR.md) | candidate |
| 17 | [مرشّحات الهجرة](migration_candidates/) | up/validate/down SQL (لا تنفيذ) |
| 18 | [دليل المستخدم](18_USER_MANUAL_AR.md) | حسب الدور |
| 19 | [سكربتات التدريب](19_TRAINING_VIDEO_SCRIPTS_AR.md) | 16 فيديو |
| 20 | [القانوني والامتثال](20_LEGAL_AND_COMPLIANCE_DOCS_AR.md) | سياسات + CBAHI |
| 21 | [مخطط AI/RAG](21_AI_PROMPT_RAG_AND_AGENT_BLUEPRINT_AR.md) | blueprint |
| 22 | [سجل المنتج](22_CONSOLIDATED_PRODUCT_BACKLOG_AR.md) | 103+ بند |
| 99 | [مصفوفة الاكتمال](99_COMPLETION_MATRIX_AR.md) | تحقّق التغطية |

## الملفات المرشّحة (لا تنفيذ)
- `openapi_candidate.yaml` — مواصفة API.
- `i18n_ar_candidate.json` / `i18n_en_candidate.json` — ترجمة.
- `migration_candidates/001_missing_modules_candidate_{up,validate,down}.sql` — DDL مرشّح.

## تأكيد
كل المخرجات توثيقية تحت `docs/FRESH_GLOBAL_AUDIT/`. لا DDL/Data/GRANT/Deploy/accounting/secrets. شجرة namaweb الموازية لم تُلمس.
