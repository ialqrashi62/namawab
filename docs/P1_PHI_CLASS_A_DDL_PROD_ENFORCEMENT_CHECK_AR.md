# Gate 4 — التحقق من الإنفاذ بدون تبديل دور التشغيل (PHI Class A Enforcement Check)

> المرحلة: `P1_PHI_CLASS_A_RESIDUAL_RLS_PRODUCTION_DDL_CONTROLLED_EXECUTION` | التاريخ: 2026-06-21 | read-only، داخل معاملة `ROLLBACK` (لا تغيير بيانات، لا تبديل دور التطبيق).

## الأسلوب
لم يُبدَّل دور التطبيق (`.env` يبقى DB_USER=postgres). للتحقق من الإنفاذ الفعلي على **بيانات الإنتاج الحقيقية** استُخدم `SET ROLE nama_medical_app` داخل جلسة التحقق فقط، ضمن `BEGIN … ROLLBACK`، بـ `SET LOCAL app.tenant_id` و**SELECT فقط** — ثم `RESET ROLE`. لم تُنشأ بيانات اختبارية دائمة.

## الدور المستهدف
```text
nama_medical_app: superuser=false, bypassrls=false  (الدور الصحيح غير-المتجاوز)
SET ROLE active: current_user=nama_medical_app
```

## النتيجة — على بيانات الإنتاج الحقيقية
```text
audit_trail (44 صفاً، كلها tenant_id=1):
  app.tenant_id = 1    -> 44 صفاً   (يرى مستأجره)
  app.tenant_id = 999  -> 0 صفوف    (عابر-المستأجر محجوب)
  no app.tenant_id     -> 0 صفوف    (fail-closed)
  ENFORCEMENT_VERDICT: PASS

الجداول الفارغة (packages/blood_bank_donors/blood_bank_units/portal_users):
  app.tenant_id = 1    -> 0 صفوف    (السياسة + FORCE مفعّلة بنيوياً؛ ستنفذ على البيانات عند وجودها)
```

## ملاحظات
- هذا أقوى من البروفة: الإنفاذ مُثبَت على **بيانات إنتاج فعلية** (audit_trail) قراءةً فقط ودون أي أثر باقٍ.
- **الإنفاذ على الاتصال الحيّ للتطبيق ما زال `NOT_YET`**: التطبيق يتصل بـ postgres (superuser) فيتجاوز كل السياسات (الـ115 + الخمسة الجديدة). الإنفاذ الفعلي يبدأ فقط بعد `P0_RLS_RUNTIME_ROLE_SWITCH`.
- **تنبيه تصميمي لـ audit_trail**: إن كان يُقرأ عابراً للمستأجر من super-admin، فستحتاج سياسة استثناء/دور قراءة بعد التبديل (حالياً كل الصفوف tenant=1 فلا أثر فوري).
- **الاكتشاف التشغيلي fail-closed** (من البروفة، مؤكَّد هنا): بعد التبديل يجب أن يضبط التطبيق `app.tenant_id` في نطاق الاستعلام نفسه وإلا أعاد فارغاً.

`PRODUCTION_ENFORCEMENT_CHECK: PASS (proven via SET ROLE on real data; runtime enforcement awaits role switch)`
