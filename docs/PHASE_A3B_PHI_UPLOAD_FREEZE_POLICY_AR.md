# Phase A3B — سياسة تجميد رفع ملفات PHI (Upload Freeze Policy)

> 2026-06-22 | سياسة تشغيلية مؤقتة حتى تنفيذ حارس التنزيل المحكوم. لا تغيير إنتاجي.

## السبب
`uploadsDir = public/uploads/radiology` تحت webroot المُخدَّم ثابتاً (`express.static('public')`، بلا auth). أي ملف PHI يُرفع الآن سيكون قابلاً للوصول المباشر عبر URL دون مصادقة/عزل مستأجر. **حالياً 0 ملف ⇒ لا تسريب فعلي**، لكن الخطر يتحقّق فور أول رفع حقيقي.

## التأكيد الحيّ (قراءة-فقط)
- ملفات تحت `public/uploads`: **0**. ملفات PHI-type تحت `public/` (عدا أصول التطبيق): **0**. health 200/200. drift 0/0.

## السياسة (سارية الآن)
```text
UPLOAD_FREEZE_REQUIRED: YES
PROHIBITED_UNTIL_GUARD:
- رفع صور أشعة حقيقية (radiology DICOM/JPG/PNG) لمرضى حقيقيين
- رفع أي مرفقات PHI/وثائق طبية حقيقية (medical_records_files، cosmetic photos، hr documents...)
ALLOWED_ACTIONS (آمنة):
- تشغيل النظام بلا رفع ملفات PHI
- بيانات تجريبية/تدريبية غير حقيقية في بيئة اختبار معزولة فقط
- كل العمليات النصّية (تشخيص/ملاحظات/فواتير...) — محميّة بـRLS، لا تتأثر بهذه السياسة
```

## Checklist قبل السماح بالرفع (يجب أن تكون كلها ✅)
```text
[ ] نُقل uploadsDir خارج public/ إلى خزنة محجوبة (nama_phi_vault)
[ ] مسار /api/phi-files/:id محكوم: requireAuth + requireRole + فحص ملكية tenant (RLS)
[ ] جدول phi_files مُطبَّق (FORCE RLS + tenant_id)
[ ] حُجب الوصول المباشر لـ/uploads/radiology عبر express.static
[ ] الواجهة تستخدم المسار المحكوم بدل /uploads/...
[ ] logAudit PHI_FILE_DOWNLOAD مفعّل
[ ] Browser E2E: رفع/عرض أشعة بحساب Doctor + رفض مستأجر آخر + رفض URL مباشر
[ ] backup قبل النقل + rollback جاهز
```

## خطة التنفيذ المختصرة (عند APPROVE_PHI_FILE_GUARD_DEPLOY)
1. backup. 2. phi_files DDL (مرشّح A3 جاهز). 3. نقل uploadsDir → خزنة محجوبة + نسخ (لا حذف). 4. مسار `/api/phi-files/:id` محكوم + audit. 5. تحديث UI الأشعة. 6. E2E (يحتاج حساب اختبار). 7. حجب /uploads العام. 8. smoke: URL مباشر ممنوع، route يتطلّب auth+tenant.

## الحالة
```text
FINAL_STATUS: PHI_UPLOAD_FREEZE_POLICY_ACTIVE
ACTIVE_EXPOSURE_NOW: NO
LATENT_RISK: YES
UPLOAD_FREEZE_REQUIRED: YES
PROHIBITED_UNTIL_GUARD: real radiology images and PHI attachments
ALLOWED_ACTIONS: text-based clinical ops (RLS-protected); test-only data in isolated env
REQUIRED_BEFORE_REAL_UPLOADS: PHI file guard (move out of public + guarded route + phi_files + UI + E2E)
PHI_FILE_GUARD_DEPLOY_GATE: APPROVE_PHI_FILE_GUARD_DEPLOY (needs test account for E2E)
OWNER_NOTICE: لا ترفع صور أشعة/وثائق PHI حقيقية حتى اكتمال الحارس — وإلا وصول مباشر عبر URL دون مصادقة.
PRODUCTION_CHANGES: NONE
DDL_EXECUTED: NO
DATA_CHANGED: NO
CODE_DEPLOYED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E_THEN_APPROVE_PHI_FILE_GUARD_DEPLOY
```

تم تفعيل سياسة تجميد رفع ملفات PHI حتى تنفيذ حارس التنزيل المحكوم
