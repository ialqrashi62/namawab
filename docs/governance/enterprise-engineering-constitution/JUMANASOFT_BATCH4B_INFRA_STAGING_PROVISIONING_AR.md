# الدفعة 4B-INFRA — توفير staging معزول لـ e25 (تقرير + تسليم)

**التاريخ:** 2026-06-30 · الفرع: `ops/jumanasoft-staging-infra-prep` (توثيق/قوالب فقط).
**الحالة النهائية:** **`BATCH4B_INFRA_STAGING_BLOCKED`** — لا يمكن توفير staging معزول من داخل هذه الجلسة (البيئة المتاحة = production). أُعدّت حزمة توفير جاهزة لينفّذها DevOps على بنية staging حقيقية.

## 1) نتيجة GATE 0 (شرط التوقّف الإلزامي)
فحص آمن (بلا اتصال DB، بلا أسرار):
| فحص | نتيجة |
|---|---|
| `NODE_ENV` | **production** ← مُحفِّز التوقّف (القاعدة 10) |
| قاعدة البيئة النشطة | **nama_medical_web** (production) ← مُحفِّز التوقّف |
| `.env.staging` موجود | **NO** |
| `DB_NAME` → `jumanasoft_staging` | **NO** |
| أي config → production | **YES** |
| host (غير حسّاس) | `DESKTOP-T70LUCJ` |

**لماذا التوقّف:** خادم PostgreSQL الوحيد المتاح هو عنقود الإنتاج. إنشاء `jumanasoft_staging` فعلياً يتطلّب **superuser DDL على عنقود الإنتاج** = لمس production (القاعدة 1). كما لا يوجد خادم staging منفصل ولا تحكّم بـ DNS لـ `staging.jumanasoft.com` في هذه الجلسة. لذلك **لم يُنشأ أي شيء** (لا قاعدة، لا مستخدم، لا عملية، لا اتصال DB).

## 2) ما أُنجِز (آمن، بلا تنفيذ، بلا أسرار)
حزمة توفير تحت `ops/staging/` لينفّذها DevOps على staging حقيقي:
- `provision_staging.sql` — إنشاء دور `jumanasoft_staging_user` (**NOSUPERUSER / NOBYPASSRLS / NOCREATEDB / NOCREATEROLE**) + قاعدة `jumanasoft_staging` + قفل الصلاحيات (REVOKE PUBLIC، GRANT محصور) + REVOKE اختياري عن قاعدة الإنتاج (دفاع للعنقود المشترك) + استعلام تحقّق العزل. كلمة المرور تُمرَّر عبر متغيّر psql (لا secret في الملف).
- `.env.staging.example` — قالب بيئة (`NODE_ENV=staging`, `PORT=3010`, `DB_NAME=jumanasoft_staging`, flags آمنة) — placeholders فقط.
- `ecosystem.staging.config.example.js` — عملية PM2 منفصلة `jumanasoft-app-staging` (port 3010، مسار/لوجات staging، env معزول).
- `nginx.staging.conf.example` — عكسي لـ `staging.jumanasoft.com` → 3010، مع basic-auth/IP allowlist + noindex.

## 3) خطوات DevOps لرفع الحجب (على بنية staging حقيقية)
1. وفّر **عنقود/خادم staging معزول** (منفصل عن production و jumanasoft.com).
2. `psql -v staging_pw="'<قوي>'" -f ops/staging/provision_staging.sql` على عنقود staging.
3. انسخ `.env.staging.example` → `namaweb/.env.staging` واملأ القيم الحقيقية على الخادم (لا git).
4. شغّل العملية: `pm2 start ops/staging/ecosystem.staging.config.example.js` (بعد نسخه باسم نهائي).
5. ثبّت nginx + DNS (`staging.jumanasoft.com` → IP staging، ليس الإنتاج).
6. تحقّق العزل (GATE 5): `NODE_ENV!=production`, `current_database=jumanasoft_staging`, `current_user=jumanasoft_staging_user`, `rolsuper=f`, `rolbypassrls=f`.
7. ثم نفّذ **Runbook 4B**: backup → `e25_up` → validate (`all_ok=true`) → seed (starter/growth/enterprise) → observe → smoke (يشمل نمو `countTenantUsers` — مغلَق بالدفعة 4D).

## 4) GATE 7 — مخرجات التسليم (مُعبّأة)
| المخرج | القيمة |
|---|---|
| staging DB name | `jumanasoft_staging` (**لم يُنشأ بعد** — قالب جاهز) |
| staging DB user | `jumanasoft_staging_user` (**لم يُنشأ بعد** — قالب جاهز) |
| NODE_ENV (staging المقصود) | `staging` (القالب)؛ الجلسة الحالية = `production` |
| staging URL | `https://staging.jumanasoft.com` (يحتاج DNS+nginx) |
| PM2 process | `jumanasoft-app-staging` (port 3010) — قالب |
| `rolsuper=false`؟ | سيُضمَن بالسكربت (NOSUPERUSER) — **لم يُطبَّق بعد** |
| `rolbypassrls=false`؟ | سيُضمَن بالسكربت (NOBYPASSRLS) — **لم يُطبَّق بعد** |
| هل production لُمست؟ | **NO** (لا DDL، لا اتصال DB؛ فحص config فقط) |
| هل e25 شُغِّل؟ | **NO** |
| هل البيئة جاهزة لتشغيل Runbook 4B؟ | **NO** — تحتاج بنية staging حقيقية أولاً |

## 5) الامتثال
staging فقط (لا شيء نُفِّذ) · ❌ لمس production · ❌ jumanasoft.com · ❌ DB production · ❌ طباعة أسرار/connection strings/env values · ❌ enforce · ❌ force push · ❌ حذف · بيانات اختبار synthetic فقط (في الـ seed لاحقاً).

## 6) القرار النهائي
**BATCH4B_INFRA_STAGING_BLOCKED** — حزمة التوفير جاهزة؛ يلزم بنية staging معزولة فعلية (خادم/عنقود + DNS) ينفّذ عليها DevOps السكربتات ثم Runbook 4B.
