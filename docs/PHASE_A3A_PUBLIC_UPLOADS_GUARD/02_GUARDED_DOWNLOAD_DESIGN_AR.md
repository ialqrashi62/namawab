# Phase A3A — تصميم التنزيل المحكوم (Guarded Download)

> 2026-06-22 | تصميم الإصلاح الاستباقي. لا تنفيذ الآن (يلمس مسار عرض صور الأشعة في الواجهة ⇒ يحتاج Browser E2E + موافقة). يربط خزنة Phase A3 (phi_files).

## التغييرات المطلوبة (عند التنفيذ بموافقة + E2E)
1. **نقل وجهة الرفع خارج webroot**: `uploadsDir` من `public/uploads/radiology` → `nama_phi_vault/radiology/` (خارج public، صلاحيات OS مقيّدة). نسخ الموجود (لا حذف) ثم التحقّق.
2. **مسار تنزيل محكوم**: `GET /api/phi-files/:id` → requireAuth + requireRole + فحص ملكية tenant (phi_files RLS) → `res.download`. كل تنزيل ⇒ logAudit `PHI_FILE_DOWNLOAD`.
3. **سجلّ phi_files** (من مرشّح A3): يربط الملف بـrecord + tenant + sha256؛ FORCE RLS.
4. **تحديث رفع الأشعة**: يخزّن في الخزنة ويُدرج صفاً في phi_files ويعيد `/api/phi-files/:id` بدل `/uploads/...`.
5. **حجب المسار الثابت لـPHI**: منع `/uploads/radiology` من express.static (إزالته من public بعد النقل) — **بعد** تحديث الواجهة لاستخدام المسار المحكوم (وإلا تنكسر العروض).
6. **الواجهة**: عرض الصورة عبر المسار المحكوم (يتطلّب جلسة) بدل الرابط العام.

## لماذا مؤجّل (لا hotfix أعمى الآن)
- 0 ملفات حالياً ⇒ **لا تسريب فعلي عاجل**.
- التغيير يلمس **رفع/عرض صور الأشعة في شاشة الأشعة** (UI) — نشره بلا Browser E2E (لا حساب اختبار) يخاطر بكسر العرض/الرفع.
- الترتيب الآمن: تحديث الـbackend (خزنة + مسار محكوم + registry) **و** الـUI معاً، ثم E2E، ثم حجب المسار العام.

## التتابع الآمن
backend (خزنة+route+phi_files DDL) → UI (استخدام /api/phi-files) → E2E → حجب /uploads العام → smoke (URL مباشر ممنوع، route محكوم يتطلّب auth+tenant).

## Acceptance (عند التنفيذ)
direct /uploads PHI = denied/not-found · /api/phi-files بلا جلسة = 401 · مستأجر آخر = 403/404 · المستأجر الصحيح = مسموح + audit · path traversal مرفوض.
