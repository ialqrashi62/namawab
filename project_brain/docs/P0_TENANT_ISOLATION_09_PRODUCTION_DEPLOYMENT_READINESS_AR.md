# P0 عزل المستأجرين — 09 جاهزية نشر الإنتاج (Production Deployment Readiness)

> التاريخ: 2026-06-20 | **لم يُنفَّذ أي تغيير على الإنتاج** (التزام بالـ Hard Stop). هذا تقييم جاهزية فقط.

---

## 1. هل الإنتاج يحتاج DDL؟ — **نعم**

الموديولات المعالَجة (Class A) تعتمد أعمدة `tenant_id`/`facility_id` غير موجودة على الإنتاج (الإنتاج يتخطّى تهيئة الجداول — المرحلة 106). نشر `server.js` المعدّل **وحده** سيكسر هذه الموديولات على الإنتاج (`column tenant_id does not exist`).

> **لذلك**: الكود + DDL يُنشران **معاً** تحت موافقة واحدة. لا يُنشر الكود منفرداً.

| السؤال | الإجابة |
| ------ | ------- |
| هل يحتاج DDL؟ | نعم — `docs/sql/p0_tenant_isolation_modern_modules_up.sql` |
| هل يحتاج backfill؟ | نعم — مُضمَّن في up.sql (`SET tenant_id=1` — single-tenant آمن) |
| هل يحتاج restart؟ | نعم — إعادة تشغيل PM2 بعد نشر `server.js` |
| هل يحتاج backup؟ | **نعم — إلزامي** قبل أي DDL |
| هل يحتاج rollback plan؟ | نعم — `down.sql` + git revert للكود |
| بدون downtime؟ | شبه نعم — `ADD COLUMN` + `CREATE INDEX` خفيفة على جداول صغيرة؛ نافذة قصيرة لإعادة تشغيل PM2 |
| الموافقة المطلوبة | **موافقة إنتاج صريحة منفصلة** (Hard Stop 5.1) |

---

## 2. تسلسل النشر المُعتمَد (للتنفيذ لاحقاً بموافقة)

1. **نسخة احتياطية كاملة** لقاعدة الإنتاج (`pg_dump`) + التحقق من حجمها.
2. تشغيل `p0_tenant_isolation_modern_modules_noop_safety_checks.sql` (read-only — تأكيد المستأجر 1 + عدد المستأجرين + المستخدم المحدود).
3. تشغيل `p0_tenant_isolation_modern_modules_up.sql` داخل معاملة.
4. تشغيل `p0_tenant_isolation_modern_modules_validate.sql` — تأكيد 13 عموداً + RLS forced + 0 nulls.
5. نشر `server.js` المحدّث (scp) + إعادة تشغيل PM2.
6. تشغيل `cross_tenant_modern_modules_test.js` + smoke + `/api/health`.
7. عند الفشل: `down.sql` + git revert + إعادة تشغيل.

---

## 3. ملاحظة RLS

- `up.sql` يفعّل ENABLE + FORCE RLS + policy على الجداول الـ13. هذا يكمّل حوكمة RLS (يعالج جزئياً P0-حوكمة من التدقيق العالمي بجعل السياسات version-controlled).
- يجب أن يُطبَّق بعد التأكد من أن `nama_medical_app` هو مستخدم الاتصال (NOBYPASSRLS) — مؤكَّد على الإنتاج (المرحلة 106).

---

## 4. الحالة

`PRODUCTION_DDL_REQUIRED: YES` | `PRODUCTION_BACKFILL_REQUIRED: YES` | `PRODUCTION_DEPLOYED: NO`

الحزمة (كود + SQL + اختبارات + تسلسل) **جاهزة للنشر المُتحكَّم به**، بانتظار **موافقة إنتاج صريحة منفصلة**.

`PRODUCTION_DEPLOYMENT_READINESS_COMPLETE`
