# Phase A3 — اكتشاف تخزين PHI/PII (Discovery)

> 2026-06-22 | قراءة-فقط. لا تغيير. أساس تصميم التشفير at-rest وخزنة الملفات.

## الهدف/النطاق/المنهجية
حصر أصول PHI/PII (حقول DB، ملفات، نسخ، أسرار) وحالتها الأمنية الحالية. استبطان information_schema + grep لمسارات الملفات/التشفير.

## الأدلة (حيّ)
- ملفات مرفوعة عبر **multer diskStorage** تحت `namaweb/public/uploads/...` (مثال: `/uploads/radiology/<file>`). تنزيل عبر `res.download` (server.js:6685).
- **`public/` يُخدَّم ثابتاً** ⇒ ⚠ احتمال وصول مباشر لملفات PHI عبر URL دون فحص auth/tenant (يجب التحقّق/الحجب).
- crypto مستخدم فقط لـsha256 (integrity hash لـEMR — Phase A1). لا تشفير at-rest للحقول أو الملفات.
- حقول PHI/PII plaintext عبر جداول كثيرة (national_id, phone, email, diagnosis, symptoms, notes, results, address, post/pre_op_notes...). 6 جداول ملفات/صور/وثائق.

## جدول الأصول
| Asset | النوع | الموقع | الحساسية | tenant scoped | RLS | مشفّر حالياً | المخاطر | التوصية |
|---|---|---|---|---|---|---|---|---|
| national_id (donors/hr/patients) | DB_FIELD | جداول متعددة | عالية | Y | FORCE | لا | كشف هوية | تشفير عمودي انتقائي |
| phone/email/address | DB_FIELD | متعدد | متوسطة | Y | FORCE | لا | خصوصية | تشفير/تقنيع عند العرض |
| diagnosis/symptoms/notes | DB_FIELD | medical_records, admissions, nursing... | عالية (PHI) | Y | FORCE | لا | كشف سريري | full-disk + (انتقائي عمودي) |
| lab/blood results | DB_FIELD | lab_results, blood_bank_* | عالية | Y | FORCE | لا | كشف سريري | كما أعلاه |
| cosmetic photos / radiology images | FILE | public/uploads/* | عالية جداً | (مسار) | لا (ملف ثابت) | لا | **وصول URL مباشر محتمل** | نقل لخزنة محجوبة + تشفير + auth/tenant gate |
| medical_records_files / hr documents | FILE | uploads | عالية | جزئي | لا | لا | تسريب وثائق | خزنة + auth gate |
| mfa_secret (Phase A2 candidate) | DB_FIELD | user_mfa (مرشّح) | عالية جداً | n/a | n/a | لا | اختطاف MFA | تشفير at-rest إلزامي |
| النسخ الاحتياطية | BACKUP | ~/nama_deploy_backups | عالية | n/a | n/a | لا | تسريب نسخة | تشفير النسخ + offsite |
| السجلّات (logs) | LOG | pm2/watchdog | منخفضة-متوسطة | n/a | n/a | n/a | لا أسرار (مؤكَّد) | الإبقاء بلا PHI |
| الأسرار (.env, نص كلمة مرور الدور) | SECRET | .env + ملف خارج repo | عالية جداً | n/a | n/a | جزئي (خارج repo) | تسريب أسرار | KMS/keystore + عدم الالتزام |

## الفجوات
1. ملفات PHI في `public/` قد تكون قابلة للتنزيل المباشر دون حارس (الأخطر).
2. لا تشفير at-rest (حقول/ملفات/نسخ).
3. لا إدارة مفاتيح مركزية.

## 6-12
المتطلبات: خزنة ملفات محجوبة + تشفير at-rest + KMS + نسخ مشفّرة. الأولوية: ملفات public/ (P0/P1)، ثم تشفير الحقول/النسخ (P1). المخاطر: كشف PHI عبر URL/نسخة. توصيات: التصميم في 02. Acceptance: حُصرت الأصول (✅). Next: 02 Target Design.
