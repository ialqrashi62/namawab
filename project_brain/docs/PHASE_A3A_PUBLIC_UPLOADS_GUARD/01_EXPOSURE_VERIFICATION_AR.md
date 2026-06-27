# Phase A3A — التحقّق من تعرّض public/uploads

> 2026-06-22 | قراءة-فقط، بلا عرض محتوى أي ملف. لا تغيير إنتاجي.

## الخلاصة
**لا تعرّض فعلي حالياً** (0 ملف PHI) — لكن **ثغرة هيكلية كامنة مؤكَّدة**: مجلّد الرفع تحت webroot المُخدَّم ثابتاً بلا حارس.

## الأدلة
| البند | النتيجة |
|---|---|
| الخدمة الثابتة | `app.use(express.static(path.join(__dirname,'public')))` (server.js:106) — يخدّم `public/` **بلا auth** |
| وجهة الرفع | `uploadsDir = path.join(__dirname,'public','uploads','radiology')` (server.js:17) — **تحت public/** |
| مسار العرض المُعاد للعميل | `/uploads/radiology/<rad_id_timestamp>.<ext>` (server.js:1271) — رابط مباشر |
| نمط الاسم | `rad_<recordId>_<timestamp>.<ext>` — قابل للتخمين/العدّ نسبياً |
| ملفات حالياً تحت public/uploads | **0** |
| ملفات PHI-type أخرى تحت public/ | **0** (excl. أصول التطبيق) |
| سلوك URL مباشر | `/uploads/...` غير الموجود → 200 (لكنه **SPA catch-all = index.html** وليس ملفاً مسرَّباً)؛ لو وُجد ملف فعلي لخدّمه express.static مباشرةً بـ200 بلا auth |
| جداول DB تخزّن المسار | المسار يُعاد ضمن استجابة رفع الأشعة (لا جدول phi_files بعد) |

## جدول الأصول
| Path | نوع | PHI محتمل | مرجوع بـDB | حالة URL مباشر | المخاطرة | الإجراء الموصى |
|---|---|---|---|---|---|---|
| public/uploads/radiology/ | صور أشعة (jpg/png/dcm) | YES (عند الرفع) | YES (في الاستجابة) | سيُخدَّم 200 بلا auth لو وُجد ملف | **عالية (كامنة)** | نقل خارج public + مسار تنزيل محكوم |
| public/uploads/ (عام) | متنوّع | UNKNOWN | — | static | عالية كامنة | كما أعلاه |

## التقييم
- **حالياً**: لا ملفات ⇒ لا تسريب فعلي (نشر تجريبي فارغ، متّسق مع 0 صفوف سريرية).
- **عند التشغيل الحقيقي**: أي صورة أشعة تُرفع ستكون قابلة للوصول المباشر عبر URL دون auth/tenant ⇒ تسريب PHI. **يجب الإصلاح قبل استقبال ملفات حقيقية.**

## الحالة
```text
FINAL_STATUS: NO_ACTIVE_PUBLIC_PHI_EXPOSURE (0 files) — LATENT_STRUCTURAL_RISK_CONFIRMED
ACTIVE_EXPOSURE: NO
LATENT_RISK: YES (uploadsDir under public/ + express.static, no auth)
RECOMMENDED: نقل الرفع لمجلّد خاص + مسار تنزيل محكوم (auth+tenant) قبل أي ملف حقيقي — تصميم في 02 (يربط Phase A3 vault)
```
