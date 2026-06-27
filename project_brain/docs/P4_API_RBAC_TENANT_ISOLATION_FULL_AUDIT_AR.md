# تدقيق شامل لواجهات API والتحكم بالصلاحيات (RBAC) وعزل المستأجرين (Tenant Isolation)
## مشروع NamaMedical — تطبيق `namaweb/server.js`

> ## 🔴 تصحيح حاسم (يُقرأ أولاً) — مطابقة مع الحالة الفعلية لقاعدة البيانات
> هذا التقرير أُنتج بقراءة **كود** `db_postgres.js` فقط، فاستنتج خطأً أن «3 جداول فقط عليها FORCE RLS وأن العزل app-layer فقط». **هذا غير صحيح للقاعدة الحية**: تدقيق PHASE 3 عبر `pg_class` (القاطع) أثبت **125 جدول FORCE RLS** — الـ122 الأخرى طُبِّقت **خارج النطاق** (SQL مراحل سابقة، لا في db_postgres.js). تحقّق مباشر 2026-06-21:
> - `patients, invoices, medical_records, blood_bank_units, obgyn_pregnancies, rehab_sessions, hr_employees` = **FORCE RLS=true** ⇒ ثغرات IDOR/cross-tenant المذكورة على هذه الجداول **مُخفَّفة فعلياً وقت التشغيل بالـRLS** (دفاع-في-العمق ناقص، **لا تسريب حيّ**) لأن التطبيق يعمل كـ nama_medical_app مع app.tenant_id لكل طلب.
> - **المخاطر الحقيقية (app-layer فقط، بلا RLS في DB)**: (1) **`system_users`** (لا tenant_id/RLS) ⇒ **`PUT /api/settings/users/:id` (server.js:1435) بلا requireRole = P0 حقيقي (تصعيد صلاحيات)**. (2) **14 جدول tenant-sensitive بلا RLS** (من PHASE 3): finance_cost_centers, finance_fiscal_years, discount_rules, insurance_companies, insurance_contracts, employees, branches, departments, form_templates, cme_activities/registrations, cssd_instrument_sets/load_items/sterilization_cycles ⇒ المسارات التي تلمسها (finance/HR/insurance) بلا فلتر tenant = خطر cross-tenant حقيقي.
> - بعض جداول «Class B» التي عدّها التقرير بلا tenant_id (مثل dietary_plans, patient_consents) **غير موجودة أصلاً** ⇒ مساراتها تُرجِع 42P01 (معطّلة، لا تسرّب) — نمط route-DDL (PHASE 1).
> **الخلاصة**: الأولويات الحقيقية = (P0) حارس دور `PUT /api/settings/users/:id`؛ (P1) إضافة RLS للـ14 جدولاً + فلاتر tenant على مساراتها. باقي نتائج التقرير على الجداول المحميّة بـFORCE RLS = تحسين دفاع-في-العمق (أولوية أقل، ليست تسريباً حيّاً). «لا مسار يثق بـtenant_id من body/query» = صحيح ومؤكَّد.


> طبيعة المستند: تدقيق أمني للقراءة فقط (READ-ONLY). لم يُعدّل أي كود ولا قاعدة بيانات ولا إعدادات نشر. كل النتائج هنا مرشّحات (candidates) للمراجعة فقط — لا إصلاح.
> المنهجية: قراءة كامل ملف `server.js` (نحو 6956 سطرًا، ~370 تعريف مسار `app.get/post/put/delete('/api/...')`)، وفحص بنية الجداول في `db_postgres.js`. التدقيق تم حسب الوحدات/المجموعات مع تحديد المسارات الخطرة بدقّة، والإشارة لمواقع الكود بصيغة `server.js:<رقم السطر>`.
> ملاحظة سياق: كل أرقام الأسطر مرجعية للملف وقت التدقيق.

---

## 1. البنية الأمنية المشتركة (Middleware والمساعدات)

| العنصر | الموقع | الخلاصة |
|---|---|---|
| `requireAuth` | `server.js:108` | يتحقق فقط من وجود جلسة `req.session.user`؛ لا يتحقق من أي دور. |
| `requireRole(...modules)` | `server.js:137` | يطابق `req.session.user.role` بخريطة `ROLE_PERMISSIONS` (`server.js:124`). دور `Admin` = `*` (يمرّ دائمًا). |
| `requireTenantScope` | `server.js:175` | يرفض الطلب بـ403 فقط إذا لم يوجد `tenantId` **وفي الإنتاج فقط**. خارج الإنتاج لا يحجب شيئًا. |
| `getRequestTenantContext(req)` | `server.js:159` | يقرأ `tenantId/facilityId` من **الجلسة الموثوقة** (جيد). لكنه يرجع افتراضيًا `tenantId=1` خارج الإنتاج. |
| `requireCatalogAccess` | `server.js:114` | يسمح فقط لأدوار admin/manager/administrator بتعديل الكتالوج. |
| `logAudit(...)` | `server.js:149` | يكتب في جدول `audit_trail`. |
| `loginLimiter` | `server.js:41` | حد محاولات الدخول (20/15دقيقة)، مطبّق فقط على `/api/auth/login` (`server.js:222`). |
| ربط سياق المستأجر بـ RLS | `server.js:96` + `db_postgres.js:22-37` | عبر `AsyncLocalStorage` يُضبط `set_config('app.tenant_id', ...)` قبل أي استعلام عندما تتوفر جلسة مستأجر. |

### ملاحظات أمنية على البنية نفسها
- **P2 — الجلسات**: `saveUninitialized: true` و`resave: true` (`server.js:74-75`) ينشئان جلسات للزوّار غير الموثّقين (هدر موارد/سطح هجوم). كما يوجد سرّ جلسة احتياطي مضمّن في الكود إن لم يُضبط متغيّر البيئة (`server.js:73`) — يجب ضمان ضبط سرّ قوي من البيئة في الإنتاج. (لم تُطبع أي قيم سرّية هنا.)
- **P3 — CORS**: `cors({ origin: true, credentials: true })` (`server.js:44`) يعكس أي Origin مع تمرير الكوكيز؛ يُفضَّل تقييد قائمة المصادر في الإنتاج.

### حقيقة وضع RLS (مهم جدًا لتقييم الخطورة)
- في `db_postgres.js` لا يوجد سوى **ثلاثة جداول** عليها `FORCE ROW LEVEL SECURITY` فعليًا، وكلها جداول تسعير للمستأجر:
  `tenant_lab_test_overrides` (`db_postgres.js:1726`)، `tenant_radiology_overrides` (`db_postgres.js:1747`)، `tenant_service_overrides` (`db_postgres.js:1767`).
- جداول البيانات السريرية والمالية الأساسية (`patients`, `invoices`, `lab_radiology_orders`, `prescriptions`, ... إلخ) **ليست عليها سياسات RLS مفعّلة في هذا الكود**. عمود `tenant_id` يُضاف لها عبر `ALTER TABLE ... ADD COLUMN IF NOT EXISTS tenant_id` (ابتداءً من `db_postgres.js:1830`)، لكن دون ENABLE/FORCE RLS ودون سياسات.
- الخلاصة: **خلافًا للافتراض، RLS لا يحمي معظم المسارات هنا.** لذلك العزل الفعلي يعتمد بالكامل على ترشيح `tenant_id` في طبقة التطبيق. أي مسار يفتقد هذا الترشيح = تسريب فعلي عبر المستأجرين (وليس مجرد ضعف دفاع-بعمق).
- *حيث ذُكر أدناه «RLS قد يحمي لو فُعّل» فالمقصود إمكانية مستقبلية لا واقع حالي.*

### تصنيف بنيوي للجداول (نتيجة فحص `db_postgres.js`)
- **الفئة A — العمود `tenant_id` موجود لكن المسار لا يرشّح عليه** (إصلاح على مستوى المسار، وقابل لحماية RLS مستقبلًا): `telemedicine_sessions`, `pathology_cases`, `social_work_cases`, `mortuary_cases`, `cosmetic_cases`/`cosmetic_consents`/`cosmetic_followups`, `transport_requests`, `maintenance_work_orders`/`maintenance_equipment`/`maintenance_pm_schedules`, `quality_incidents`/`quality_kpis`/`quality_patient_satisfaction`, `infection_surveillance`/`infection_outbreaks`/`employee_exposures`/`hand_hygiene_audits`, `zatca_invoices`, `hr_*`, `finance_journal_*`/`finance_vouchers`/`finance_doctor_commissions`, `online_bookings`, `waiting_queue`, `medical_certificates`.
- **الفئة B — لا يوجد عمود `tenant_id` إطلاقًا** (يتعذّر عزلها دون تعديل سكيمة DDL أولًا): `blood_bank_*`, `diet_orders`/`diet_meals`, `nutrition_assessments`, `rehab_*`, `clinical_pharmacy_reviews`/`patient_drug_education`, `medical_records_files`/`medical_records_requests`/`medical_records_coding`, `obgyn_*` (الحمل/الولادة/السونار/NST), `cssd_*`, `cme_*`, `patient_consents`, `internal_messages`, `form_templates`, `queue_advertisements`(عمود مُضاف لكن غير مستخدم), `cash_drawer`, `visit_lifecycle`, `pathology_specimens`, `maintenance_orders`, `portal_users`.

---

## 2. مشكلة هيكلية عابرة: تعريفات مسارات مكرّرة

عدّة مسارات معرّفة **مرّتين**؛ Express ينفّذ **أول** معالج مسجّل ويتجاهل الثاني. هذا يربك التدقيق وقد يخفي سلوكًا أمنيًا مختلفًا بين النسختين:

| المسار | التعريف الأول (الفعّال) | التعريف الثاني (مُتجاهَل) |
|---|---|---|
| `GET /api/lab/orders` | `server.js:1028` | `server.js:2804` |
| `POST /api/lab/orders` | `server.js:1044` | `server.js:2851` |
| `GET /api/radiology/orders` | `server.js:1125` | `server.js:2820` |
| `POST /api/radiology/orders` | `server.js:1178` | `server.js:2874` |
| `GET /api/prescriptions` | `server.js:1495` | — |
| `POST /api/prescriptions` | `server.js:1519` | `server.js:4692` |
| `GET /api/pharmacy/queue` | `server.js:1278` | `server.js:4719` |
| `PUT /api/pharmacy/queue/:id` | `server.js:1289` | `server.js:4739` |
| `GET /api/pharmacy/drugs` | `server.js:1238` | `server.js:4794` |
| `POST /api/pharmacy/drugs` | `server.js:1262` | `server.js:4807` |
| `GET /api/referrals` | `server.js:1844` | `server.js:5731` |
| `POST /api/referrals` | `server.js:1875` | `server.js:5708` |
| `GET /api/messages` | `server.js:1472` | `server.js:4570` |
| `POST /api/messages` | `server.js:1479` | `server.js:4582` |

> **P2 — مخاطرة صيانة**: يجب توحيد هذه المسارات. لحسن الحظ، النسخ الأولى الفعّالة لمسارات الصيدلية/الإحالات مُحكَمة العزل (`requireTenantScope` + ترشيح `tenant_id`)، لكن وجود نسخ ثانية يضلّل المراجعين ويزيد خطر تراجع أمني مستقبلي.

---

## 3. النتائج حسب الوحدة (مع التصنيف)

### 3.1 المصادقة والجلسات — `server.js:222-304`
- `POST /api/auth/login` (`server.js:222`): تحقق bcrypt صحيح، حد معدّل، جلسة واحدة لكل مستخدم، جلب `tenantId/facilityId` من جداول الربط. **SAFE**.
- `POST /api/auth/logout` (`server.js:288`)، `GET /api/auth/me` (`server.js:301`)، `GET /api/health` (`server.js:297`): **SAFE**.

### 3.2 المرضى (PHI أساسي) — `server.js:346-456`, `5158`
- `GET /api/patients` (`server.js:346`)، `GET /api/patients/:id` (`server.js:370`)، `POST` (`server.js:381`)، `PUT` (`server.js:413`): جميعها `requireRole('patients')` + ترشيح/ختم `tenant_id` من الجلسة (لا من الجسم)، وتتحقق من الملكية قبل التحديث. **SAFE** (نموذج جيد يُحتذى).
- `DELETE /api/patients/:id` (`server.js:5158`): فحص دور Admin داخلي + ترشيح `tenant_id` + تدقيق للحذف الناعم. **SAFE/P3** (يُستحسن توحيد وسم التدقيق للحذف الصلب إن وُجد).

### 3.3 طابور الانتظار (Waiting Queue) — `server.js:1664-1675`, `1692`
- **P0 — `GET /api/queue/patients` (`server.js:1664`)**: `SELECT * FROM patients WHERE status IN (...)` **بلا أي ترشيح `tenant_id`** وبـ`requireAuth` فقط (بلا `requireRole`). أي مستخدم موثّق من أي دور (حتى Staff/Lab/Pharmacist) يرى مرضى **كل المستأجرين** في الانتظار (أسماء، أرقام ملفات — PHI). تسريب فعلي عبر المستأجرين (RLS لا يحمي `patients` هنا).
- **P1 — `PUT /api/queue/patients/:id/status` (`server.js:1669`)**: `UPDATE patients SET status=$1 WHERE id=$2` بلا ترشيح مستأجر ولا تحقق ملكية — كتابة عابرة للمستأجرين على حالة أي مريض.
- **P1 — `PUT /api/patients/:id/referral` (`server.js:1692`)**: `UPDATE patients SET department=$1 WHERE id=$2` بلا ترشيح مستأجر (رغم وجود `requireRole('patients')`). كتابة عابرة للمستأجرين.

### 3.4 حساب/نتائج/الخط الزمني للمريض (PHI مركّب)
- **P1 — `GET /api/patients/:id/account` (`server.js:1627`)**: لا تحقق مستأجر **حتى على المريض نفسه** (`server.js:1630` `SELECT * FROM patients WHERE id=$1`)، ثم يجلب الفواتير + السجلات الطبية + المختبر + الأشعة + الوصفات بالـ`patient_id` فقط (`server.js:1632-1636`). IDOR كامل: أي مستخدم بدور `patients` أو `accounts` يقرأ كامل PHI والوضع المالي لأي مريض بترقيم المعرّف. (الأخطر في وحدة المرضى.)
- **P2 — `GET /api/patients/:id/results` (`server.js:1573`)**: المريض **مُحقَّق بالمستأجر** (404 صحيح، `server.js:1579`)، لكن استعلامات المختبر/الأشعة/السجلات لاحقًا بالـ`patient_id` فقط (`server.js:1581-1583`). عمليًا محمي ببوابة المريض (المعرّفات عامة تسلسلية لا تتصادم)، لكنه نقص دفاع-بعمق يجب سدّه.
- **P2 — `GET /api/patients/:id/timeline` (`server.js:2014`)**: نفس النمط — المريض محقَّق بالمستأجر، لكن الجداول الفرعية (medical_records/lab/rad/prescriptions/certificates) بالـ`patient_id` فقط.
- **P2 — `GET /api/patients/:id/summary` (`server.js:5811`)**: نفس النمط (بوابة مريض مُحقَّقة + فرعيات غير مرشَّحة).

### 3.5 إدارة المستخدمين والإعدادات — `server.js:1401-1469`
- **P0 — `PUT /api/settings/users/:id` (`server.js:1435`)**: **بـ`requireAuth` فقط، بلا `requireRole`**. أي مستخدم موثّق (حتى Staff) يستطيع تحديث **أي** مستخدم: تغيير الدور إلى `Admin` (تصعيد صلاحيات)، إعادة تعيين كلمة المرور (`server.js:1441-1449`)، تفعيل/تعطيل الحسابات. ثغرة تجاوز صلاحيات حرجة. كما لا يوجد ترشيح مستأجر (نظام المستخدمين غير معزول بمستأجر أصلًا).
- `POST /api/settings/users` (`server.js:1425`): `requireRole('settings')` موجود (admin/IT). **P3** (ينشئ مستخدمًا دون ربط مستأجر — قصور عزل لكن RBAC موجود).
- `DELETE /api/settings/users/:id` (`server.js:1454`): فحص `role==='Admin'` داخلي + حماية آخر admin + منع حذف الذات. مُطبَّق فعليًا لكن غير متّسق مع نمط الـ middleware. **P3**.
- `GET /api/settings/users` (`server.js:1420`): `requireRole('settings')` لكن يُعيد كل مستخدمي النظام عبر المستأجرين. **P2**.
- `GET/PUT /api/settings` (`server.js:1401`, `1410`): إعدادات الشركة عامة بلا ترشيح مستأجر (`company_settings` فيه عمود `tenant_id` لكن غير مستخدم). **P2**.

### 3.6 لوحات الإدارة والنسخ الاحتياطي — `server.js:4606`, `5311`, `5356`, `6576`, `6599`
- **P1 — `GET /api/audit-trail` (`server.js:4606`)**: `requireAuth` فقط، بلا `requireRole`، بلا ترشيح مستأجر. أي مستخدم موثّق يقرأ سجل التدقيق **العام** (أفعال كل المستخدمين/المستأجرين + عناوين IP). تسريب سجل تدقيق شامل.
- **P1 — `GET /api/admin/audit-trail` (`server.js:5311`)**: نفس المشكلة — `requireAuth` فقط، بلا دور، بلا مستأجر.
- **P2 — `GET /api/admin/backup-info` (`server.js:5356`)**: `requireAuth` فقط (بلا فحص Admin، بخلاف نقطتي النسخ أدناه). يكشف اسم قاعدة البيانات وأحجام الجداول وتلميح أمر `pg_dump`. كشف بنية تحتية لأي مستخدم موثّق.
- **P2 — `POST /api/admin/backup` (`server.js:6576`)** و**`GET /api/admin/backups` (`server.js:6599`)**: فحص `role==='Admin'` داخلي **موجود وفعّال** (`server.js:6578`, `6601`). يُنفّذ `pg_dump` لكامل القاعدة (كل المستأجرين) ويتيح تنزيلها. الخطر تشغيلي/داخلي (Admin له حق فعلًا)، لكن: لا حد معدّل، لا عزل مستأجر بطبيعته. يُسجّل تدقيق للنسخ (`server.js:6591`). **P2**.

### 3.7 المختبر والأشعة (PHI) — `server.js:1028-1235`, `2804-3007`
- القراءات `GET /api/lab/orders` (`server.js:1028`) و`GET /api/radiology/orders` (`server.js:1125`) والإنشاء `POST` (`server.js:1044`, `1178`): تُرشّح/تختم `tenant_id` وتتحقق من ملكية المريض قبل الإدراج. **SAFE**.
- **P2 — `PUT /api/lab/orders/:id` (`server.js:1101`)، `PUT /api/radiology/orders/:id` (`server.js:1161`)، `POST .../upload` (`server.js:1215`)**: يوجد فحص ملكية مُسبق مرشَّح بالمستأجر يرجع 404 إن لم يكن الطلب ضمن المستأجر (`server.js:1108`, `1168`, `1223`)، **لكن** جملة الـ`UPDATE` نفسها `WHERE id=$2` بلا `tenant_id` (`server.js:1110/1117`, `1170/1171`, `1229`). الكتابة العابرة محجوبة عمليًا بالبوابة المسبقة (المعرّف ثابت، TOCTOU مهمَل)؛ يبقى نقص دفاع-بعمق يُفضّل دمج `tenant_id` في `UPDATE`. *(ملاحظة: الوكلاء الأولون صنّفوها P1؛ بعد التحقق من بوابة 404 المسبقة خُفّضت إلى P2.)*
- النسخ الثانية المكرّرة (`server.js:2804+`) مُتجاهَلة تنفيذيًا (انظر القسم 2).

### 3.8 الصيدلية والمخزون والوصفات — `server.js:1238-1340`, `1495-1571`, `4692-4821`, `5185-5243`, `6804-6929`
- جميعها تقريبًا `requireTenantScope` + ترشيح/ختم `tenant_id` + تحقق ملكية المريض/الصنف. الوصفات (PHI دوائي) `POST /api/prescriptions` (`server.js:1519`)، طابور الصيدلية، خصم المخزون (`server.js:5185`)، المخزون CRUD (`server.js:6804-6873`)، وصفات الصيدلية (`server.js:6876-6929`): **SAFE**. نموذج عزل جيد ومتّسق.
- `POST /api/medical/bill-procedures` (`server.js:766`): يُدرج فاتورة **بلا ختم `tenant_id/facility_id`** (`server.js:782`) ويجلب المريض بلا ترشيح مستأجر (`server.js:770`). **P2** (فاتورة بلا مستأجر تكسر تقارير العزل، وكشف اسم مريض عبر المعرّف).

### 3.9 المواعيد — `server.js:517-576`, `1914`, `6191-6249`
- `GET/POST/DELETE /api/appointments` (`server.js:517`, `531`, `563`)، المتابعة (`server.js:1914`)، check-in/no-show (`server.js:6191`, `6223`): مرشَّحة/مختومة بالمستأجر مع تحقق ملكية. **SAFE/P2**.
- **P2 — إدراج `waiting_queue` ضمن check-in (`server.js:6191`)** قد لا يختم `tenant_id` دائمًا؛ و`GET /api/appointments/check-conflict` (`server.js:5263`) و`POST /api/appointments/check-duplicate` (`server.js:6239`) يستعلمان بالطبيب/التاريخ بلا ترشيح مستأجر — تسرّب جدول طبيب عبر المستأجرين.

### 3.10 الفواتير والمالية والتقارير — `server.js:602-632`, `1375-1399`, `1589-1624`, `4417`, `5624-5707`, `6026-6070`, `6614`
- `GET/POST /api/invoices` (`server.js:602`, `615`)، `generate` (`server.js:1589`)، `pay` (`server.js:1609`)، `cancel` (`server.js:5245`)، `partial-pay` (`server.js:6026`): مرشَّحة/مختومة بالمستأجر مع تحقق ملكية. **SAFE** (مع ملاحظة 3.7 حول `UPDATE ... WHERE id` بعد بوابة 404 — P2 دفاع-بعمق).
- **P1 — `GET /api/finance/accounts` (`server.js:1375`)، `POST` (`server.js:1380`)، `GET /api/finance/journal` (`server.js:1389`)، `GET /api/finance/vouchers` (`server.js:1394`)**: `requireRole` للمالية موجود، **لكن بلا ترشيح `tenant_id`** رغم وجود العمود في الجداول المالية (فئة A). موظف مالية في مستأجر يرى دفتر/سندات/شجرة حسابات **كل** المستأجرين. تسريب مالي عابر.
- **P1 — `GET /api/finance/daily-close` (`server.js:4417`)، `POST` (`server.js:4421`)**: بلا ترشيح مستأجر — بيانات الإيراد اليومي عابرة.
- **P2 — `POST /api/invoices/:id/refund` (`server.js:6054`)**: جلب الفاتورة الأصلية بلا ترشيح مستأجر؛ احتمال استرداد فاتورة مستأجر آخر + قيد استرداد غير مختوم.
- التقارير المالية المرشَّحة بالمستأجر صراحةً (`requireTenantScope` + ترشيح): `financial` (`server.js:1701`)، `pnl` (`server.js:4823`)، `daily-cash` (`server.js:5624`)، `doctor-revenue` (`server.js:5644`)، `aging` (`server.js:5680`)، `finance/summary` (`server.js:6614`). **SAFE**.

### 3.11 الموارد البشرية — `server.js:1345-1373`
- **P1 — `GET /api/hr/employees` (`server.js:1345`)، `POST` (`server.js:1350`)، `GET /api/hr/salaries` (`server.js:1359`)، `/leaves` (`server.js:1364`)، `/attendance` (`server.js:1369`)**: `requireRole('hr')` موجود، **لكن بلا ترشيح `tenant_id`** رغم وجود العمود (فئة A). موظف HR لمستأجر يرى رواتب/إجازات/حضور **كل** المستأجرين. تسريب بيانات موظفين حساسة عابر.

### 3.12 التأمين — `server.js:635-669`, `6795`
- `GET/POST /api/insurance/companies` (`server.js:635`, `640`)، `claims` (`server.js:649`, `654`, `663`)، `policies` (`server.js:6795`): `requireRole('insurance')` موجود، لكن بلا ترشيح مستأجر (`insurance_claims` فيه عمود `tenant_id`؛ الشركات/الوثائق قد تكون مرجعية مشتركة). **P2** (مطالبات بأسماء مرضى تُعرض عبر المستأجرين عند تعدّد المستأجرين).

### 3.13 السجلات الطبية والشهادات والإحالات — `server.js:671-689`, `1820-1842`, `4440-4478`, `6651`
- **P1 — `GET /api/medical/certificates` (`server.js:1820`)، `POST` (`server.js:1831`)**: `requireAuth` فقط، PHI (تشخيص)، بلا ترشيح مستأجر (`medical_certificates` فئة A — العمود موجود لكن غير مستخدم).
- **P1 — `GET /api/medical-records/files` (`server.js:4440`)، `/requests` (`server.js:4444`, `4448`, `4457`)، `/coding` (`server.js:4467`, `4471`)**: `requireAuth` فقط، بلا ترشيح، والجداول فئة B (لا عمود `tenant_id`). أي مستخدم موثّق يرى/يكتب بيانات الملفات الطبية لكل المستأجرين.
- **P1 — `GET /api/medical-records/patient/:patientId` (`server.js:6651`)**: IDOR مباشر — `patient_id` من المسار بلا تحقق ملكية ولا مستأجر.
- `GET/POST /api/medical/records` (`server.js:671`, `682`): `requireRole('doctor','nursing')` موجود لكن الاستعلام بالـ`patient_id` بلا ترشيح مستأجر (العمود موجود). **P2**.

### 3.14 وحدات سريرية كاملة بلا أي دور وبلا عزل (PHI) — الأخطر تجميعيًا
كل هذه الوحدات بـ`requireAuth` **فقط** (بلا `requireRole`)، لذا أي مستخدم موثّق من أي دور يصل إليها، وبلا ترشيح `tenant_id`. حسب البنية:

#### الفئة B (لا عمود `tenant_id` — يتعذّر عزلها دون DDL) — تسريب PHI فعلي عبر المستأجرين:
- **P1 — بنك الدم** `server.js:2486-2581`: الوحدات/المتبرّعون (PHI: هوية وطنية، تاريخ مرضي — `server.js:2516`)/المطابقة/عمليات النقل (`server.js:2554`). تسريب شامل + كتابات `WHERE id` بلا مستأجر.
- **P1 — التغذية والحمية** `server.js:3760-3814`: أوامر الطعام/الوجبات/تقييمات التغذية (قيود غذائية = PHI).
- **P1 — مكافحة العدوى** `server.js:3817-3886`: المراقبة/التفشّي/التعرّضات/نظافة الأيدي. *(تنبيه: `infection_surveillance`/`infection_outbreaks` فئة A فعليًا — العمود موجود — أي إصلاح على مستوى المسار ممكن؛ بينما `/api/infection-control/reports` (`server.js:6713-6770`) **مرشَّح بالمستأجر صحيحًا = SAFE**.)*
- **P1 — الجودة وسلامة المرضى** `server.js:3889-3949`: الحوادث/الرضا/مؤشرات الأداء. *(الجداول فئة A — العمود موجود لكن غير مستخدم.)*
- **P1 — التأهيل (Rehab)** `server.js:4519-4568`: المرضى/الجلسات/الأهداف (تشخيص + خطة علاج).
- **P1 — الصيدلة السريرية** `server.js:4481-4517`: المراجعات/التثقيف الدوائي (أسماء مرضى + توصيات).
- **P1 — النساء والولادة (OB/GYN)** `server.js:5373-5556`: الحمل/الزيارات/السونار/الولادات/NST — PHI شديد الحساسية. إضافةً: **`PUT /api/obgyn/pregnancies/:id` (`server.js:5413`) فيه إسناد جماعي (Mass Assignment)** — يحدّث أي عمود يصل في الجسم عدا `id/created_at` (`server.js:5417-5424`). و`GET /api/obgyn/stats` (`server.js:5558`) يضع `requireTenantScope` لكنه بلا أثر فعلي لأن الجدول بلا عمود `tenant_id` (تناقض).
- **P1 — الموافقات (Consents)** `server.js:5577-5622`: التوقيع/موافقات المريض (`patient_consents` فئة B). *(لاحظ أن وحدة `consent-forms` للجراحة `server.js:2584-2797` **مرشَّحة بالمستأجر صحيحًا = SAFE**.)*
- **P2 — CSSD** `server.js:3710-3757`, `6676-6695`؛ **CME** `server.js:4242-4269`, `6698-6710`؛ **pathology/specimens** `server.js:6661`؛ **maintenance/orders** `server.js:6773-6792` (بنية تحتية مشتركة غالبًا، لكن بلا أي دور وبلا عزل).

#### الفئة A (العمود `tenant_id` موجود لكن المسار لا يرشّح) — تسريب PHI/تشغيلي عابر (وإصلاحه على مستوى المسار):
- **P1 — Telemedicine** `server.js:4153-4172` (جلسات استشارة)، **Pathology cases** `server.js:4175-4194`، **Social Work** `server.js:4197-4216`، **Mortuary** `server.js:4218-4239` (سجلات وفاة)، **Cosmetic** `server.js:4042-4101` (حالات/موافقات/متابعات تجميل = PHI).
- **P2 — Transport** `server.js:4015-4040` (طلبات نقل مرضى)، **Maintenance work-orders/equipment/pm** `server.js:3951-4013`، **ZATCA** `server.js:4131-4150` (فواتير — يقرأ `invoices` بلا تحقق مستأجر)، **Portal** `server.js:4103-4128`.

### 3.15 الطباعة (PHI) — `server.js:4614-4652`
- **P1 — `GET /api/print/invoice/:id` (`server.js:4614`)**: `requireAuth` فقط (بلا دور)، `SELECT * FROM invoices WHERE id=$1` بلا ترشيح مستأجر (`server.js:4616`). أي مستخدم موثّق يطبع أي فاتورة (اسم مريض + مبالغ — PHI مالي) بترقيم المعرّف.
- `GET /api/print/prescription/:id` (`server.js:4625`): مرشَّح بالمستأجر بالكامل. **SAFE**.
- **P3 — `GET /api/print/lab-report/:id` (`server.js:4641`)**: الطلب مُحقَّق بالمستأجر (`server.js:4647`)، لكن النتائج/المريض بالـ`order_id`/`patient_id` المشتقّين منه (`server.js:4649-4650`) — محمي عمليًا بالبوابة، نقص دفاع-بعمق.

### 3.16 الجراحة/الطوارئ/التنويم/العناية المركّزة/eMAR/تمريض — `server.js:2049-2453`, `3010-3707`, `4272-4416`, `6350`
- هذه الوحدات الكبيرة **مُحكَمة العزل**: `requireTenantScope` + ترشيح `tenant_id` في كل قراءة + ختم على الإدراج + تحقق ملكية المريض/السرير/الإذن + `UPDATE/DELETE ... AND tenant_id=$x` صريح (مثلًا الجراحة `server.js:2122/2161`، الطوارئ `server.js:3073`، التنويم/الخروج `server.js:3385`، نقل الأسرّة `server.js:3505`، الفرز `server.js:6350`). **SAFE** (نموذج مرجعي).

### 3.17 متفرّقات بلا عزل — `server.js:6072-6189`, `6392-6461`
- **P2 — درج النقد** `server.js:6072-6127` (`cash_drawer` فئة B)، **دورة حياة الزيارة** `server.js:6131-6189` (`visit_lifecycle` فئة B)، **طابور الطبيب** `server.js:6392` و`6452` (استعلام بالطبيب فقط — يمكن لطبيب رؤية/تعديل طابور مستأجر آخر بمعرفة الاسم).
- **P3 — `PUT /api/auth/change-password` (`server.js:6465`)**: يغيّر كلمة مرور **الذات فقط** عبر `req.session.user.id` ويتحقق من الحالية. **SAFE**. (ملاحظة جانبية: يستعلم جدول `users` لا `system_users` المستخدم في الدخول — قد يكون مسارًا معطّلًا/ميتًا؛ يستحق تحققًا لكنه ليس مشكلة عزل.)
- مرجعيات للقراءة فقط (آمنة): `diagnosis-templates` (`server.js:4871`)، `lab/reference-ranges` (`server.js:6251`)، `drug-interactions/check` (`server.js:5907`)، قوالب الموافقة (`server.js:5577`, `5588`).
- **P3 — `POST /api/allergy-check` (`server.js:5982`)**: يجلب حساسية المريض بالمعرّف بلا ترشيح مستأجر — كشف حساسية عبر ترقيم المعرّف.
- **P2 — `GET /api/employees` (`server.js:579`)، `POST` (`server.js:587`)، `DELETE` (`server.js:596`)**: `requireAuth` فقط (بلا دور)، وجدول `employees` بلا عمود `tenant_id`. أي مستخدم موثّق يقرأ/ينشئ/يحذف الموظفين عبر المستأجرين.

---

## 4. خطط الإصلاح المقترحة (Batches) — مرشّحات للمراجعة فقط (بدون تنفيذ)

> مبدأ عام للإصلاح: (1) اشتقاق `tenantId/facilityId` من `getRequestTenantContext(req)` حصرًا — لا من الجسم/الاستعلام. (2) ترشيح `AND tenant_id=$x` على كل SELECT/UPDATE/DELETE، ودمج `tenant_id` في جملة `UPDATE/DELETE` نفسها لا في بوابة سابقة فقط. (3) إضافة `requireRole(...)` المناسب لكل وحدة سريرية/إدارية. (4) للجداول فئة B: إضافة عمود `tenant_id` (DDL) ثم تفعيل سياسات RLS كدفاع-بعمق. (5) تسجيل تدقيق للأفعال الحسّاسة وحدّ معدّل للنسخ الاحتياطي/التصدير.

### API_RBAC_BATCH_A_CRITICAL (P0 + تجاوز صلاحيات وتسريب PHI واسع)
- `PUT /api/settings/users/:id` (`server.js:1435`): إضافة `requireRole('settings')` (أو حصر Admin) ومنع رفع الدور بلا تفويض — يوقف تصعيد الصلاحيات.
- `GET /api/queue/patients` (`server.js:1664`): إضافة ترشيح `tenant_id` + `requireRole` مناسب.
- `PUT /api/queue/patients/:id/status` (`server.js:1669`) و`PUT /api/patients/:id/referral` (`server.js:1692`): دمج `tenant_id` في `UPDATE`.
- `GET /api/patients/:id/account` (`server.js:1627`): ترشيح المريض وكل الفرعيات بالمستأجر.

### API_RBAC_BATCH_B_CLINICAL (PHI سريري — أدوار + عزل)
- إضافة `requireRole` مناسب + عزل لكل وحدات القسم 3.14: بنك الدم، التغذية، مكافحة العدوى، الجودة، التأهيل، الصيدلة السريرية، OB/GYN، الموافقات، Telemedicine، Pathology، Social Work، Mortuary، Cosmetic.
- معالجة الإسناد الجماعي في `PUT /api/obgyn/pregnancies/:id` (`server.js:5413`) بقائمة حقول بيضاء.
- سدّ الفرعيات غير المرشَّحة في `results/timeline/summary` (`server.js:1581-1583`, `2014`, `5811`) ودمج `tenant_id` في تحديثات المختبر/الأشعة (`server.js:1110/1117`, `1170/1171`, `1229`).
- شهادات/ملفات/ترميز السجل الطبي (`server.js:1820`, `4440-4478`, `6651`).
- للجداول فئة B: DDL لإضافة `tenant_id` أولًا.

### API_RBAC_BATCH_C_ADMIN_REPORTING (مالية/HR/تدقيق/نسخ)
- المالية (`server.js:1375-1399`, `4417`, `6054`) والموارد البشرية (`server.js:1345-1373`): إضافة ترشيح `tenant_id` (العمود موجود — إصلاح مسار مباشر).
- سجلّات التدقيق (`server.js:4606`, `5311`): إضافة `requireRole` + ترشيح مستأجر + سقف آمن لـ`limit`.
- `backup`/`backups`/`backup-info` (`server.js:6576`, `6599`, `5356`): توحيد فحص Admin عبر `requireRole`، وحدّ معدّل، وحجب `backup-info` عن غير Admin.
- التأمين (`server.js:635-669`, `6795`) والتقارير العابرة.

### API_RBAC_BATCH_D_SECONDARY (تشغيلي/صيانة/توحيد)
- درج النقد ودورة الزيارة وطابور الطبيب (`server.js:6072-6189`, `6392`, `6452`).
- CSSD/CME/Maintenance/Transport/Portal/ZATCA (الفئتان A وB حسب الجدول).
- توحيد المسارات المكرّرة (القسم 2) لإزالة الالتباس وخطر التراجع.
- ضبط الجلسات (`saveUninitialized`/سرّ من البيئة) وتقييد CORS و`employees` (`server.js:579`)، و`bill-procedures` ختم المستأجر (`server.js:766`).

---

## 5. ملخّص ختامي

```
ENDPOINTS_REVIEWED (by group):
  Auth/Session(4)=SAFE | Patients core(5)=SAFE/P3 | Waiting-Queue(3)=P0/P1
  Patient account/results/timeline/summary(4)=P1+P2 | Settings/Users(5)=P0+P2/P3
  Admin/Audit/Backup(5)=P1+P2 | Lab/Radiology(≈14, مع تكرار)=SAFE core / P2 updates
  Pharmacy/Inventory/Prescriptions(≈18)=SAFE | Appointments(≈8)=SAFE/P2
  Invoices/Finance/Reports(≈18)=SAFE core / P1 finance-accounts+daily-close
  HR(5)=P1 | Insurance(6)=P2 | Medical-records/Certificates(≈8)=P1/P2
  Surgery/Emergency/Inpatient/ICU/eMAR/Nursing(≈45)=SAFE (نموذج مرجعي)
  Clinical-unscoped [Blood-bank/Dietary/Infection/Quality/Rehab/Clinical-pharmacy/OB-GYN/
    Consents/Telemedicine/Pathology/Social-work/Mortuary/Cosmetic](≈70)=P1/P2
  Print(3)=P1 invoice / SAFE rx / P3 lab | Misc(cash-drawer/visit-lifecycle/doctor-queue/
    employees/allergy-check)(≈12)=P2/P3 | Reference-readonly(≈6)=SAFE

P0_BLOCKER: 3
  - PUT  /api/settings/users/:id            server.js:1435  (تجاوز صلاحيات: أي مستخدم يعدّل أي مستخدم/يرفع نفسه Admin)
  - GET  /api/queue/patients                server.js:1664  (قراءة PHI لكل المستأجرين، بلا دور وبلا عزل)
  - GET  /api/patients/:id/account          server.js:1627  (IDOR كامل: PHI+مالي لأي مريض بلا تحقق مستأجر)

P1_HIGH: 19 (مجموعات/مسارات تمثيلية)
  - PUT  /api/queue/patients/:id/status     server.js:1669  (كتابة عابرة على المريض)
  - PUT  /api/patients/:id/referral         server.js:1692  (كتابة عابرة على المريض)
  - GET  /api/audit-trail                   server.js:4606  (سجل تدقيق عام بلا دور/عزل)
  - GET  /api/admin/audit-trail             server.js:5311  (سجل تدقيق عام بلا دور/عزل)
  - GET  /api/print/invoice/:id             server.js:4614  (IDOR طباعة فاتورة/PHI مالي)
  - GET  /api/finance/accounts|journal|vouchers  server.js:1375/1389/1394  (تسريب مالي عابر)
  - GET  /api/finance/daily-close           server.js:4417  (إيراد يومي عابر)
  - GET/POST /api/hr/* (employees/salaries/leaves/attendance)  server.js:1345-1372  (بيانات موظفين عابرة)
  - GET/POST /api/medical/certificates      server.js:1820/1831  (PHI تشخيص بلا عزل)
  - GET  /api/medical-records/files|requests|coding  server.js:4440/4444/4467  (ملفات طبية عابرة)
  - GET  /api/medical-records/patient/:patientId  server.js:6651  (IDOR مباشر)
  - Blood-bank module                       server.js:2486-2581  (PHI متبرّعون/نقل دم، فئة B)
  - Dietary/Nutrition module                server.js:3760-3814  (PHI، فئة B)
  - Infection-control module                server.js:3817-3886  (تسريب، أغلبه فئة A)
  - Quality module                          server.js:3889-3949  (فئة A)
  - Rehab module                            server.js:4519-4568  (PHI، فئة B)
  - Clinical-pharmacy module                server.js:4481-4517  (PHI، فئة B)
  - OB/GYN module (+Mass-Assignment 5413)   server.js:5373-5556  (PHI شديد، فئة B)
  - Consents (patient) module               server.js:5577-5622  (PHI، فئة B)
  - Telemedicine/Pathology/SocialWork/Mortuary/Cosmetic  server.js:4042-4239  (PHI، أغلبه فئة A)

P2_MEDIUM: ~30
  (نسخ UPDATE المختبر/الأشعة بعد بوابة 404 [1101/1161/1215]، insurance، invoices/refund 6054،
   settings/company، settings/users GET، admin/backup* تشغيلي، appointments check-conflict/duplicate،
   bill-procedures ختم مستأجر، transport/maintenance/zatca/portal [فئة A]، CSSD/CME/pathology-specimens،
   cash-drawer/visit-lifecycle/doctor-queue، employees، results/timeline/summary فرعيات، المسارات المكرّرة،
   جلسات/CORS)

P3_LOW: ~8
  (settings/users DELETE فحص داخلي، print/lab-report دفاع-بعمق، allergy-check، change-password جدول users،
   patients DELETE وسم تدقيق، مرجعيات للقراءة)

TRUSTS_BODY_TENANT_ID_ROUTES: (none)
  لم يُرصد أي مسار يثق بـ tenant_id / facility_id / branch_id من req.body أو req.query.
  جميع المسارات المعزولة تشتق السياق من الجلسة عبر getRequestTenantContext(req) (تصميم سليم).
  المشكلة ليست «الثقة بالجسم» بل «غياب الترشيح/الدور» وغياب أعمدة tenant_id (فئة B) وغياب سياسات RLS فعلية.

FINAL_STATUS: API_RBAC_TENANT_ISOLATION_CANDIDATES_READY_NOT_DEPLOYED
```

> تذكير: هذا تدقيق مرشَّح للقراءة فقط. لم يُنفَّذ أي إصلاح أو تعديل سكيمة أو نشر. أي إصلاح يتطلّب مراجعة واعتمادًا منفصلًا، مع اختبار تكامل عزل عبر المستأجرين (يوجد ملف اختبار ذو صلة: `cross_tenant_clinical_reports_test.js`).
