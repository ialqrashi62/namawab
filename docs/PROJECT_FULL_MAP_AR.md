# خريطة المشروع الكاملة (Project Full Map)

> التاريخ: 2026-06-20 | الكود الحالي: namaweb @ `ef1acf9` | parent @ `601c2c4`
> مرجع تفصيلي: [GLOBAL_AUDIT_01_PROJECT_DISCOVERY_AR.md](GLOBAL_AUDIT_01_PROJECT_DISCOVERY_AR.md) (هذا التقرير تحديث للحالة الراهنة + الفروقات الجديدة).

## 1. الهوية
- **الاسم**: نما الطبي (NamaMedical) — نظام HIS/EMR + ERP + SaaS متعدد المستأجرين.
- **الحالة**: إنتاج فعلي (`jumanasoft.com`، PM2 `nama-medical-erp`، Nginx، Let's Encrypt) + بيئة dev محلية (`localhost:3000`، PM2 `nama-app`).
- **المستخدمون**: استقبال، أطباء، تمريض، صيدلة، مختبر، أشعة، محاسبة/مالية، تأمين، مخازن، HR، جودة، إدارة، مالك SaaS.

## 2. التقنية
| الطبقة | التقنية |
| ------ | ------- |
| Backend | Node.js + Express ^4.21 (`server.js` monolith) |
| Frontend | SPA Vanilla JS (`public/js/app.js`) + Tailwind + Stitch Premium CSS (8 ثيمات) |
| قاعدة البيانات | PostgreSQL (`pg`) + better-sqlite3 (dev) |
| الجلسات | express-session + connect-redis (Redis إلزامي في الإنتاج، لا تراجع MemoryStore) |
| الأمن | helmet، bcrypt، express-rate-limit، RLS، least-privilege DB user |
| التشغيل | PM2 (+ ecosystem.config.js)، Nginx، Docker (Redis محلي) |

## 3. الهيكل
```
NamaMedical/ (parent: توثيق + ذاكرة + 40 مهارة)
├── .ai-brain/ (AI_PROJECT_MEMORY.md + skills/)
├── docs/ (500+ تقرير عربي: GLOBAL_AUDIT_*, MEDICAL_*, P0/P1_*)
└── namaweb/ (submodule @ ef1acf9 — التطبيق)
    ├── server.js (~7200 سطر، 370 مسار API)
    ├── db_postgres.js (~148 جدول + RLS + tenant context)
    ├── accounting_posting.js + accounting_posting_service.js (محرك ترحيل مُوصَّل خلف flag OFF)
    ├── facility_entitlements.js (سجل استحقاقات 10 أنواع منشآت، fail-closed)
    ├── public/ (index.html SPA + app.js 10K+ سطر + css)
    └── 24 ملف اختبار (cross_tenant_*, accounting_posting_test, staging_*)
```

## 4. الموديولات (43) — مجمّعة
سريرية: لوحة، استقبال، مواعيد، محطة طبيب، EMR، تمريض، طابور، طوارئ، تنويم/ADT، ICU، عمليات/OR، بنك دم، تعقيم CSSD، تغذية، مكافحة عدوى، سجلات طبية، صيدلية سريرية، تأهيل، بوابة مرضى، طب عن بعد، علم أمراض، وفيات، CME، تجميل، OB/GYN، مختبر، أشعة، صيدلية. | إدارية/مالية: مالية/محاسبة، فوترة، تأمين، مخازن، مشتريات/طلبات أقسام، HR، جودة، تقارير، رسائل، كتالوج، صيانة، نقل، ZATCA، إعدادات. | منصّة: مستأجرون/منشآت/فروع، استحقاقات نوع المنشأة، صلاحيات/أدوار.

## 5. التغييرات الجوهرية منذ آخر تدقيق شامل (ef1acf9)
- **محرك الترحيل المحاسبي مُوصَّل** (`accounting_posting_service.js`) خلف `ACCOUNTING_POSTING_ENABLED` (الافتراضي **OFF** على الإنتاج)، fail-closed + يربط `app.tenant_id` داخل المعاملة.
- **حارس SESSION_SECRET** في الإنتاج (يرفض الإقلاع بالسرّ الافتراضي) + **rate limiter اختياري على `/api`**.
- **ربط `app.tenant_id` لكل طلب** (P0 binding، منشور) — التطبيق يقرأ بيانات الجداول المحمية بـ RLS.
- **استحقاقات نوع المنشأة fail-closed** (منشور، facility_type=large_hospital على الإنتاج).
- PM2 ecosystem.config.js + توثيق Redis env.

## 6. ملفات حرجة
`server.js`، `db_postgres.js`، `accounting_posting_service.js`، `facility_entitlements.js`، `tenant_context_pg_session.js`، `.env` (gitignored)، `public/js/app.js`.

`PROJECT_FULL_MAP_COMPLETE`
