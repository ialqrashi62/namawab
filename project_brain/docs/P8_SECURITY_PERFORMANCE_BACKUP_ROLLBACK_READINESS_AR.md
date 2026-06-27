# PHASE 8 — جاهزية الأمن / الأداء / النسخ الاحتياطي / التراجع

> البرنامج: POST_RLS_FULL_SYSTEM_HARDENING — PHASE 8 | 2026-06-21 | تدقيق قراءة-فقط.

## الأمن (config حاضر)
- `server.js` يحوي helmet/headers + httpOnly/sameSite/secure cookie + loginLimiter/rate-limit (8 مؤشرات). الجلسات على Redis (connect-redis؛ التطبيق يرفض MemoryStore في الإنتاج).
- التحقق التفصيلي لكل header/cookie = ضمن `MEDICAL_SECURITY_PRIVACY_AUDIT` (مرجع). لا أسرار في الكود (تدقيقات سابقة).
- P0 system_users role guard مُصلَح ومنشور؛ لا مسار يثق بـtenant_id من body/query (P4).

## الأداء — تغطية فهارس tenant_id على جداول RLS (مهم بعد 147 جدول)
- **147 جدول FORCE RLS** (سياساتها تُرشّح `tenant_id = current_setting('app.tenant_id')`).
- **فهرس tenant_id موجود على 59 جدولاً؛ غائب على 88**.
- **لكن كل الـ88 غير المفهرسة صغيرة/فارغة (لا جدول >100 صف)** ⇒ **لا أثر أداء حالي**. الجداول الكبيرة (patients/invoices/medical_records…) مفهرسة.
- ⇒ **مرشّح فهارس tenant_id اختياري** (للتوسّع المستقبلي عند نمو الجداول)، **غير عاجل**. لو رُغب: `CREATE INDEX CONCURRENTLY` على tenant_id للجداول الـ88 — DDL (gated، غير مُنفَّذ). لا حاجة الآن.

## النسخ الاحتياطي / التراجع (جاهزية)
- نسخ احتياطية متعددة محفوظة خارج المستودع (schema dumps + data dumps لكل دفعة DDL: boot/route/14-table).
- **سكربتات rollback (down.sql) جاهزة** لكل دفعة RLS: route_level_ddl_batch_a/b/c + 14_table (+ schema/data dumps). أُثبتت قابلية التراجع في rehearsals.
- PM2 rollback: `git -C namaweb checkout <prev> -- server.js && pm2 restart` (مُستخدَم في دفعات سابقة).
- DB rollback: down.sql لكل دفعة (يُسقط RLS/policy/tenant_id بأمان للجداول الفارغة/المُضافة).
- backup/restore drill: تمارين على قواعد معزولة (rehearsals) PASS لكل الدفعات؛ تأكيد `pg_restore -l` على dumps موصى دورياً (MEDICAL_BACKUP_RESTORE_DRILL).

## الحالة
```text
FINAL_STATUS: SECURITY_PERFORMANCE_BACKUP_ROLLBACK_READINESS_COMPLETE
SECURITY_CONFIG: PRESENT (helmet/cookie/rate-limit؛ تفاصيل في security audit)
TENANT_ID_INDEX_COVERAGE: 59/147 (88 غير مفهرسة لكنها صغيرة/فارغة ⇒ لا أثر أداء؛ مرشّح فهارس اختياري gated)
RLS_ROLLBACK_SCRIPTS: READY (down.sql لكل دفعة)
BACKUPS: متعددة خارج المستودع
NEXT_REQUIRED_ACTION (اختياري): APPROVE_TENANT_ID_INDEX_CANDIDATE (للتوسّع، غير عاجل)
```
