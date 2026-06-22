# Phase A3 — التصميم الهدف (Target Design)

> 2026-06-22 | تصميم فقط. **لا مفاتيح حقيقية، لا مفتاح داخل Git، لا تنفيذ.**

## 1. تشفير at-rest (طبقتان)
- **(أ) أساس — تشفير القرص/المجلّد** (full-disk/volume encryption على مضيف Ubuntu للـDB + مجلّد الخزنة): يحمي كل البيانات والنسخ دون تغيير تطبيقي. **الأولوية والأقل تعقيداً**.
- **(ب) انتقائي — تشفير عمودي (pgcrypto pgp_sym_encrypt)** لأعلى الحساسية فقط (national_id, mfa_secret): المفتاح من KMS/env وقت التشغيل، لا في DB. **ملاحظة**: التشفير العمودي يكسر البحث/الفهرسة على الحقل ⇒ يُطبَّق انتقائياً على حقول لا تُبحَث.

## 2. خزنة ملفات PHI
- **نقل الملفات خارج `public/`** إلى مجلّد غير مُخدَّم (مثل `C:\nama_phi_vault\<tenant_id>\...` أو `/var/nama_phi_vault/` على Ubuntu).
- **تشفير الملف at-rest** (AES-256، مفتاح من KMS) أو الاعتماد على تشفير المجلّد.
- **تنزيل عبر مسار محكوم فقط**: `GET /api/phi-files/:id` خلف requireAuth + requireRole + فحص ملكية tenant (RLS على جدول السجل) ثم `res.download`؛ **لا وصول URL مباشر**.
- **سجلّ**: جدول `phi_files(id, record_type, record_id, stored_path, sha256, encrypted, tenant_id)` (FORCE RLS).

## 3. إدارة المفاتيح (Key Management)
- المفتاح في **KMS** (سحابي) أو OS keystore/HSM؛ **ليس** في DB/Git/.env عادي.
- تحميل المفتاح وقت التشغيل عبر متغيّر بيئة آمن/خدمة أسرار.
- **تدوير المفاتيح (rotation)**: مفتاح بإصدارات (key_version)؛ التدوير = إعادة تشفير تدريجية (decrypt-by-old → encrypt-by-new) في نافذة منخفضة الحمل.

## 4. تشفير النسخ الاحتياطية
- `pg_dump | (gpg/openssl enc -aes-256)` بمفتاح من KMS ⇒ نسخة مشفّرة + **offsite**.
- استعادة: فك التشفير بالمفتاح ثم pg_restore (drill دوري).

## 5. تدقيق الوصول والتنزيل
- كل تنزيل ملف PHI ⇒ logAudit `PHI_FILE_DOWNLOAD` (من/متى/أي سجل)؛ خلف requireAuth+tenant.
- authorization التنزيل = ملكية tenant + الدور.

## 6. الاحتفاظ (Retention) وBreak-glass
- سياسة احتفاظ (يرتبط جدول retention_policies — Blueprint 03/07): إتلاف آمن بعد المدة.
- **break-glass**: وصول طارئ لمفتاح/بيانات عبر **dual-control** (شخصان) + نسخة مفتاح مختومة offline + audit إلزامي؛ لا وصول فردي صامت.

## 7. التراجع (Rollback)
- **ملفات**: الإبقاء على النسخ الأصلية حتى التحقّق من الخزنة المشفّرة؛ feature-flag لمسار التنزيل.
- **عمودي**: decrypt + كتابة plaintext (بحذر) أو الإبقاء على عمود مزدوج أثناء الانتقال.
- **قرص/نسخ**: قابل للتراجع بإعدادات المضيف.

## 8. الحدود
- المفتاح/السر لا يُطبَع ولا يُلتزَم. التشفير العمودي انتقائي (لا يكسر البحث الحرج). full-disk هو الأساس الأقل خطراً.

## 9-12
المتطلبات: KMS + pgcrypto + خزنة محجوبة + مسار تنزيل محكوم. الأولوية: نقل ملفات public/ + تشفير القرص (P0/P1)؛ ثم عمودي/نسخ (P1). المخاطر: فقد المفتاح = فقد البيانات (مخفّف بنسخ مفتاح مختومة + dual-control). توصيات: ابدأ بالأساس (قرص + نقل الملفات) قبل العمودي. Acceptance: تصميم شامل (encryption/vault/keys/rotation/backup/audit/retention/break-glass/rollback) (✅). Next: 03 Candidate Plan.
