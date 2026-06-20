# التدقيق العالمي 06 — سجل المخاطر الأمنية (Security Risk Register)

> التاريخ: 2026-06-20 | الفحص: قراءة فقط. لم تُطبع أي قيم أسرار/هاشات/سلاسل اتصال.

---

## سجل المخاطر

| الخطر | المستوى | الدليل | الأثر | الحل المقترح | عاجل؟ |
| ----- | ------- | ------ | ----- | ------------ | ----- |
| **عزل مستأجرين ناقص لموديولات حديثة** (السجلات الطبية/الصيدلية السريرية/التأهيل/البوابة/التغذية) — `requireAuth` بلا `requireTenantScope` ولا `tenant_id` | **P0** | server.js:4106-4563؛ لا ALTER tenant_id لها | تسريب بيانات مرضى بين المستأجرين عند تعدد المستأجرين | إضافة `tenant_id` + `requireTenantScope` + اختبارات عزل | **نعم** |
| **حوكمة RLS خارج المصدر** | **P0** | المصدر يحوي RLS لـ 3 جداول؛ الإنتاج 13 | إعادة بناء/استعادة DB تُسقط RLS صامتاً | migration متتبع idempotent للـ 13 جدولاً | **نعم** |
| **`SESSION_SECRET` افتراضي مضمّن في الكود** | **P1** | server.js (قيمة fallback مضمّنة) | تزوير الجلسات لمن يصل للمصدر | إلزام `SESSION_SECRET` من env في الإنتاج + رفض التشغيل بدونه + تدوير السر | **نعم** |
| **`DB_PASSWORD` افتراضي `'postgres'`** | **P1** | db_postgres.js fallback | اتصال DB ضعيف لو لم تُضبط env | إلزام كلمة مرور قوية + رفض الافتراضي في الإنتاج | نعم |
| **`CORS origin: true` + `credentials: true`** | **P1** | server.js:44 | مخاطر CSRF عبر النطاقات | تقييد `origin` لنطاقات معروفة | نعم |
| **لا حماية CSRF (لا توكن)** | **P1** | لا csrf middleware | هجمات CSRF على عمليات تغيير الحالة | توكن CSRF أو فحص Origin/Referer + `sameSite: strict` للحساس | نعم |
| **لا قفل حساب بعد محاولات فاشلة** | **P1** | لا عمود `failed_attempts`؛ rate limit 20/15د فقط | تخمين كلمات مرور موزّع | قفل حساب تدريجي + CAPTCHA + سجل محاولات | نعم |
| **CSP معطّل في Helmet** | **P2** | `contentSecurityPolicy: false` | يقلّل دفاع XSS | تفعيل CSP محكم | نعم |
| **لا تطهير مدخلات XSS** | **P2** | لا sanitize-html؛ تخزين خام | XSS مخزّن لو لم تُهرّب الواجهة | تطهير المدخلات + ترميز المخرجات | نعم |
| **رفع الملفات يُخزّن في `public/uploads`** | **P2** | multer destination public | وصول مباشر للملفات + لا فحص MIME حقيقي | نقل خارج public + توقيع روابط + فحص MIME/محتوى | نعم |
| **`old_values` نادراً ما يُملأ في audit_trail + الحذف الصلب غير مُدقّق** | **P2** | logAudit يخزّن new_values غالباً | تتبع تغييرات ناقص للتحقيق الجنائي | تسجيل old/new + تدقيق DELETE | لاحقاً |
| **معدل التحديد محصور بـ login فقط** | **P2** | loginLimiter فقط | إساءة استخدام/DoS على بقية المسارات | rate limit عام طبقي | لاحقاً |
| **`activeSessions` Map في الذاكرة** | **P2** | server.js | يكسر فرض الجلسة الواحدة عند تعدد العمليات + تسرب ذاكرة | نقل لـ Redis | لاحقاً |
| **rad upload يفحص الامتداد فقط (لا MIME/محتوى)** | **P2** | multer fileFilter regex | رفع ملف خبيث بامتداد مزدوج | فحص MIME + magic bytes | لاحقاً |

---

## نقاط القوة الأمنية (مؤكّدة — تُحمى)

| العنصر | الدليل |
| ------ | ------ |
| bcrypt للتجزئة + رفض fallback لكلمات نص صريح | server.js login (`startsWith('$2')`) |
| منع التراجع لـ MemoryStore في الإنتاج (`process.exit(1)`) | server.js session config |
| الجلسات في Redis ببادئة `nama_session:` + httpOnly + sameSite=lax + secure شرطي | server.js |
| فرض جلسة واحدة (single-session) | server.js |
| استعلامات parameterized في كل المسارات المفحوصة (حماية SQLi قوية) | server.js متعدد |
| ختم `tenant_id` من الجلسة لا من العميل + منع IDOR في الموديولات الأساسية | server.js + 63 اختبار |
| RBAC على مستوى الموديول (`ROLE_PERMISSIONS`) + قيود خصم حسب الدور | server.js:115-148 |
| تسجيل تدقيق (audit_trail) واسع التغطية (login/CRUD/مالي) | server.js logAudit |
| helmet + compression + حد JSON 10mb + rate limit على login | server.js:31-46 |
| مستخدم DB محدود الصلاحيات `nama_medical_app` (إنتاج) | الذاكرة المرحلة 106 |

---

## القرار

`SECURITY_STATUS: WARNING` — أساس أمني **قوي** (bcrypt، Redis، parameterized، RBAC، audit، least-privilege DB user)، لكن توجد **مخاطرتان P0** (عزل الموديولات الحديثة + حوكمة RLS) و**عدة P1** (أسرار افتراضية، CORS، CSRF، قفل الحساب) يجب إغلاقها قبل تشغيل **متعدد المستأجرين** فعلياً أو البيع لمستشفى كبير.

لا توجد ثغرة P0 تُعرّض **التشغيل أحادي المستأجر الحالي** لخطر فوري، لكن P0 المتعلقة بالعزل تصبح حرجة لحظة إضافة مستأجر ثانٍ.

`SECURITY_RISK_REGISTER_COMPLETE`
