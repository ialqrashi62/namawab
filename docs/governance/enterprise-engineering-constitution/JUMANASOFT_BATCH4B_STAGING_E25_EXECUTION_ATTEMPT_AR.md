# الدفعة 4B — محاولة تنفيذ DevOps لتوفير e25 على staging (سجلّ تنفيذ)

**التاريخ:** 2026-06-30 · الفرع: `ops/jumanasoft-staging-e25-execution-attempt` (توثيق فقط).
**الحالة النهائية:** **`BATCH4B_STAGING_E25_PROVISIONING_BLOCKED`** — أُجهِضت قبل أي DDL: البيئة المتاحة **production**، ولا توجد staging معزولة.

## 1) الموافقة (مُسجّلة)
- المالك قدّم العبارة الصريحة: «أوافق على تشغيل e25 على staging فقط، بدون production». ⇒ حاجز **التفويض مرفوع**.
- لكن حاجز **العزل (البنية التحتية)** قائم — انظر §3.

## 2) الخطوة 1 الإلزامية: إثبات عزل staging (فحص آمن، بلا أسرار)
فحص config فقط (لا اتصال بأي قاعدة، لا طباعة passwords/connection strings/host):
| الإشارة (غير سرّية) | القيمة |
|---|---|
| `NODE_ENV` | **production** |
| `DB_NAME` المُهيّأ | `nama_medical_web` (قاعدة الإنتاج) |
| `STAGING_DB_NAME` / `STAGING_DATABASE_URL` / `PGDATABASE_STAGING` | **غير موجودة** |
| أي متغيّر `STAGING_*` | فقط `PUBLIC_STAGING_HTTP_ONLY` (علم HTTP لا علاقة له بقاعدة بيانات) |
| `ENTITLEMENTS_ENABLED` | غير مضبوط (= false) |

**الاستنتاج:** لا توجد قاعدة staging معزولة. البِركة (pool) الوحيدة في `db_postgres.js` تتّصل بقاعدة واحدة من `DB_*` = **الإنتاج**. تشغيل e25 من هنا = DDL على production (محظور قطعاً).

## 3) القرار: إجهاض قبل أي DDL
- الخطوة 1 من الـ Runbook (إثبات عزل staging) **فشلت** — بل ثبت العكس (البيئة production).
- لذلك **لم يُتّصل بالقاعدة** (استعلام `current_database()` كان سيتّصل بالإنتاج)، **ولم يُشغَّل e25**، **ولا seed**, **ولا تفعيل observe** (تفعيله هنا = تفعيل على الإنتاج).

## 4) المخرجات المطلوبة من DevOps (مُعبّأة)
| المخرج | القيمة |
|---|---|
| اسم قاعدة staging (غير حسّاس) | **لا يوجد** — لا قاعدة staging مُهيّأة. البيئة النشطة = production (`nama_medical_web`). |
| `current_database` / `current_user` | **لم يُستعلَم** عمداً (الاتصال كان سيطال الإنتاج؛ احتراماً لشرط «لا لمس production»). |
| هل e25 نُفّذت؟ | **NO.** |
| هل validate `all_ok=true`؟ | **N/A** (لم يُشغَّل). |
| هل seed تم؟ | **NO.** |
| هل observe تم؟ | **NO.** |
| هل enforce تم؟ | **NO.** |
| نتائج smoke | **N/A** (لا تنفيذ). |
| هل production لُمست؟ | **NO.** (لا DDL، لا اتصال؛ فحص config/env بلا أسرار فقط). |
| أخطاء/blockers | **Blocker:** `NODE_ENV=production` + لا قاعدة staging معزولة. الموافقة مستوفاة، البنية التحتية غير متوفّرة. |

## 5) الامتثال
- staging فقط: لم يُنفَّذ شيء (لا staging). ❌ لمس production. ❌ استخدام jumanasoft.com. ❌ enforce. ❌ طباعة أسرار/connection strings/env values. ❌ حذف بيانات.

## 6) المطلوب لرفع الحجب (لـ DevOps الحقيقي)
1. توفير **قاعدة/خادم staging معزول فعلاً** (منفصل عن production و jumanasoft.com)، عبر متغيّرات `DB_*` تشير لقاعدة staging، و`NODE_ENV != production` لتلك البيئة.
2. تشغيل الـ Runbook `JUMANASOFT_BATCH4B_STAGING_E25_PROVISIONING_RUNBOOK_AR.md` **داخل** بيئة staging تلك (حيث الخطوة 1 ستُثبِت العزل).
3. عندها: backup → e25_up → validate (`all_ok=true`) → seed → observe → smoke (يشمل تحقّق نمو `countTenantUsers` بعد الدفعة 4D).

## 7) القرار النهائي
**BATCH4B_STAGING_E25_PROVISIONING_BLOCKED** (السبب الآن مادّي ومؤكَّد: البيئة المتاحة production، لا staging معزولة). الكود والـ Runbook جاهزان للتنفيذ فور توفّر staging حقيقي.
