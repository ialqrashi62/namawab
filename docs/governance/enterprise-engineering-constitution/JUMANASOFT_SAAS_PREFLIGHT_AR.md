# تقرير الفحص والتحضير الأولي لمشروع جمانة سوفت (Preflight & Inventory)

مستند مرجعي يوضح حالة المشروع الحالية، المكونات البرمجية الأساسية، معمارية خادم الويب، وقواعد البيانات المعتمدة قبل البدء بالخطوات الهندسية.

---

## 1. الفحص الفني لبنية المشروع (Technical Stack Inspection)

تم فحص بنية المشروع الحالية في مجلد `namaweb` وتبين التالي:

### أ. إطار العمل الأساسي (Web Framework)
- **إطار العمل**: Node.js مع إطار عمل [Express.js](https://expressjs.com/) (الإصدار `^4.21.0`).
- **إدارة الجلسات**: [express-session](https://github.com/expressjs/session) مع دعم تخزين الجلسات محلياً أو عبر Redis (باستخدام `connect-redis` و `redis`).
- **الحماية والأمان**: مدمج مع حزمة [helmet](https://github.com/helmetjs/helmet) للترويسات الأمنية و [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) لمنع هجمات الحرمان من الخدمة.

### ب. مدير الحزم (Package Manager)
- الحزم تدار بالكامل عبر **npm** مع وجود ملف `package-lock.json` و `package.json`.
- تشمل الأوامر (npm scripts): `start`, `dev`, `test`, `test:safe`, `build:css`, `setup`.

### ج. قواعد البيانات ومحول البيانات (DB/ORM Adaptors)
- **بيئة التطوير والاختبارات المحلية**: تعتمد على قاعدة البيانات المدمجة [SQLite](https://sqlite.org/) عبر مكتبة [better-sqlite3](https://github.com/WiseLibs/better-sqlite3).
- **بيئة الإنتاج والتشغيل الفعلي**: تعتمد على قاعدة بيانات [PostgreSQL](https://www.postgresql.org/) عبر مكتبة [pg](https://github.com/brianc/node-postgres).
- لا يوجد ORM ثقيل (مثل Sequelize أو Prisma)، بل يتم صياغة وكتابة استعلامات SQL المباشرة (Raw SQL queries) لتحقيق أقصى درجات التحكم والأداء وتفعيل الـ Row Level Security (RLS) بدقة.

### د. نظام التحقق والتحكم بالصلاحيات (Authentication & RBAC)
- يتم التحقق من الهوية عبر الجلسة (Session-based auth) بمطابقة كلمة المرور المشفرة بـ `bcrypt` أو `bcryptjs`.
- التحكم بالصلاحيات (RBAC) معرف في `rbac.js` و `rbac_guards.js` عبر مستويات صلاحيات تبدأ من الـ Super Admin، مروراً بـ Tenant Admin، ووصولاً إلى الطاقم الطبي والإداري.

### هـ. نموذج المستأجرين (Tenant Model)
- يدعم عزل البيانات المتعددة للمستأجرين (Multi-tenant database isolation) عن طريق إدراج معرف المستأجر `tenant_id` في كافة الجداول التشغيلية.
- في PostgreSQL، يتم استخدام آلية **PostgreSQL Row Level Security (RLS)** مع ربط سياق الجلسة بالـ `tenant_id` باستخدام `AsyncLocalStorage` في Node.js، حيث يقوم الـ middleware بضبط المعامل `app.tenant_id` لكل طلب مستخدم لتصفية البيانات تلقائياً على مستوى محرك قاعدة البيانات.

### و. الفوترة والدفع المالي (Billing & Payments)
- الفوترة معرفة في `plans.js` عبر نظام خطط الاشتراك والخدمات (Entitlements) المسموح بها لكل مستأجر.
- يحتوي ملف `billing_adapter.js` على معمارية مجردة تدعم بوابات دفع متعددة مثل `stripe`, `moyasar`, `hyperpay` مع بقاء بوابة الاختبار `mock` كمحاكي افتراضي آمن لا يقوم بأي اتصالات خارجية.

### ز. لوحة التحكم (Admin & Tenant Dashboards)
- يوجد واجهات إدارية مخصصة للـ Super Admin لإدارة تراخيص المستأجرين وخطط الأسعار (`super_admin.js`).
- يوجد لوحات تحكم تشغيلية للمستأجرين لإدارة شؤون المستشفى والموارد الطبية.

### ح. برمجيات النشر والتشغيل (Deployment Scripts)
- تدار نصوص النشر والتشغيل عبر سكربتات bash مثل `deploy_web.sh` و `DEPLOY_RUN.sh` و `redeploy.sh`.
- تستخدم أداة **PM2** لإدارة تشغيل عملية التطبيق على خوادم Linux.

---

## 2. حالة مستودع كود جيت الحالي (Git Status & Branch Name)

عند تشغيل فحص مستودع Git في مجلد العمل، ظهرت البيانات التالية:

- **اسم الفرع النشط (Current Branch)**: `ops/jumanasoft-enterprise-facility-platform-staging-prep`
- **حالة المستودع (Git Status)**: `nothing to commit, working tree clean`
- المستودع متطابق تماماً مع الفرع البعيد (up to date with origin).

---

## 3. تأكيد الحفاظ على سلامة بيئة الإنتاج والتشغيل

- **لا توجد أي تعديلات برمجية** تم إجراؤها في هذه المرحلة (Phase 0).
- لم يتم إجراء أي عمليات ترحيل (Migrations) أو DDL على قواعد البيانات.
- لم يتم الكشف أو الطباعة لأي متغيرات بيئية سرية (.env) أو مفاتيح تشفير.
- التقرير متطابق 100% مع البنية الفعلية للمشروع.
