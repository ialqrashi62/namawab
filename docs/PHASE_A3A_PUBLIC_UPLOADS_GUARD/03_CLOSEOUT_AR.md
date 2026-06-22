# Phase A3A — إغلاق حارس ملفات public/uploads

> 2026-06-22 | تحقّق + تصميم. لا تغيير إنتاجي، لا حذف ملفات، لا أسرار.

## الحقول
```text
FINAL_STATUS: PHASE_A3A_NO_ACTIVE_EXPOSURE_LATENT_RISK_CONFIRMED_FIX_DESIGNED_DEFERRED
PUBLIC_UPLOADS_EXPOSURE_CONFIRMED: LATENT_ONLY (هيكلي: uploadsDir=public/uploads/radiology + express.static بلا auth)
ACTIVE_EXPOSURE_NOW: NO (0 ملف PHI — نشر تجريبي فارغ)
FILES_AFFECTED_COUNT: 0
PHI_FILES_MOVED_OR_PROTECTED: N/A (لا ملفات للنقل)
DIRECT_PUBLIC_ACCESS_STATUS: لا ملفات حالياً؛ بنيوياً سيُخدَّم بلا auth لو رُفع ملف (يجب الإصلاح قبل التشغيل الحقيقي)
GUARDED_DOWNLOAD_ROUTE: DESIGNED (GET /api/phi-files/:id) — غير منفّذ
AUTH_REQUIRED: (في التصميم) YES
TENANT_SCOPE_REQUIRED: (في التصميم) YES
AUDIT_LOGGING: (في التصميم) PHI_FILE_DOWNLOAD
BACKUP_CREATED: N/A (لا ملفات؛ لا نقل)
CODE_DEPLOYED: NO
DB_CHANGED: NO
DDL_EXECUTED: NO
DATA_DELETED: NO
PM2_RESTARTED: NO
HEALTH_STATUS: 200 (local) / 200 (domain)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
FORCE_PUSH_USED: NO
ROLLBACK_READY: N/A (لا تغيير)
GIT_COMMIT: docs only
GIT_PUSH: FF
NEXT_RECOMMENDED_ACTION: تنفيذ الحارس (نقل خارج public + /api/phi-files محكوم + phi_files DDL + تحديث UI) ضمن APPROVE_PHI_ENCRYPTION_VAULT_ROLLOUT مع Browser E2E — **قبل** استقبال أي ملف PHI حقيقي. توجيه مقترح: APPROVE_PHI_FILE_GUARD_DEPLOY (يحتاج test account لـE2E عرض الأشعة).
```

## القرار (شفافية)
- لا تسريب فعلي الآن (0 ملف) ⇒ لا hotfix عاجل لنقل/حذف.
- الإصلاح الاستباقي يلمس **رفع/عرض صور الأشعة (UI)** ⇒ لا يُنشر بلا Browser E2E (لا حساب اختبار) تفادياً لكسر الشاشة.
- **توصية حاسمة**: تنفيذ الحارس **قبل** أن يبدأ النظام في تخزين ملفات PHI حقيقية (إنتاج فعلي)، ضمن طرح A3 + E2E.

## ملاحظة أمنية للمالك
ما دام النظام تجريبياً (0 ملف/0 صفوف سريرية) فلا تسريب. لكن **لا تبدأ رفع صور أشعة/وثائق حقيقية قبل تنفيذ هذا الحارس** — وإلا تصبح الملفات قابلة للوصول المباشر عبر URL دون مصادقة.

تم التحقق من تعرض public uploads ومعالجة ملفات PHI خلف مسار محكوم دون حذف بيانات أو تفعيل المحاسبة
