# Phase A3 — خطة التنفيذ المرشّحة (Candidate Plan)

> 2026-06-22 | مرشّحات فقط. لا تنفيذ.

## المكوّنات المرشّحة
| المكوّن | الوصف | النوع | ملاحظات |
|---|---|---|---|
| جدول phi_files | سجلّ ملفات PHI + مسار الخزنة + sha256 + encrypted + tenant_id | DDL candidate | FORCE RLS + DEFAULT tenant_id (نمط المشروع) |
| جدول encryption_metadata | key_version، الخوارزمية، الحقول/الجداول المشفّرة | DDL candidate | لا أسرار؛ ميتاداتا فقط |
| بنية مجلّد الخزنة | `nama_phi_vault/<tenant_id>/<record_type>/` خارج public/ | Filesystem | غير مُخدَّم؛ صلاحيات OS مقيّدة |
| Audit events | PHI_FILE_DOWNLOAD، KEY_ROTATION، BREAK_GLASS_ACCESS | code candidate | عبر logAudit |
| API guard | `GET /api/phi-files/:id` خلف auth+role+tenant ثم res.download؛ منع المسار الثابت | code candidate | يستبدل الوصول المباشر لـpublic/uploads |
| backup encryption script | pg_dump → gpg/openssl enc بمفتاح KMS → offsite | script candidate | مفتاح وقت التشغيل فقط |
| validate script | يتحقّق phi_files/encryption_metadata + لا ملف PHI في public/ | script candidate | — |
| rollback | feature-flag مسار التنزيل + الإبقاء على الأصول + down.sql | plan | — |

## تسلسل التنفيذ الموصى (عند الموافقة)
1. **full-disk encryption** على مضيف DB/الخزنة (infra، الأساس).
2. **نقل ملفات PHI خارج public/** + مسار تنزيل محكوم (auth+tenant) + phi_files registry. (يغلق أخطر فجوة.)
3. تشفير عمودي انتقائي (national_id, mfa_secret) عبر pgcrypto + KMS.
4. تشفير النسخ + offsite + drill.
5. تدوير المفاتيح + break-glass + retention.

## الحدود
DO_NOT_EXECUTE_SQL · DO_NOT_EXECUTE_BACKUP_ENCRYPTION · CANDIDATE_ONLY · NO_KEYS_IN_FILES.

## 6-12
المتطلبات: KMS + موافقة + نافذة منخفضة الحمل + بيئة rehearsal. الأولوية: نقل الملفات (P0/P1). المخاطر: كسر تنزيل ملفات قائمة عند النقل (مخفّف: الإبقاء على الأصول + feature-flag). توصيات: ابدأ بالملفات. Acceptance: كل المرشّحات محدّدة (✅). Next: SQL/scripts candidates + rehearsal.
