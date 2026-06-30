---
name: jumanasoft-global-gates
description: البوابات الإلزامية (Gates) لأي عمل على جمانة سوفت — تُفحص قبل أي merge أو نشر. استخدمها كقائمة تحقّق.
---

# جمانة سوفت — البوابات العالمية (Global Gates)

أي تغيير (كود/DDL/نشر) يجب أن يجتاز هذه البوابات. على فشل أي بوابة: **توقّف واكتب سبب + خطة**، لا تلتفّ عليها.

## G0 — السلامة والإذن
- الإنتاج للقراءة افتراضياً. أي DDL/حذف/تعديل بيانات/نشر/force-push → **إذن صريح** لكل إجراء.
- لا طباعة أسرار/مفاتيح. لا force push. خادم مستشفى/إنتاج حيّ = احترام كامل + نسخة احتياطية أولاً.

## G1 — عزل المستأجر (Tenant Isolation)
- كل جدول حسّاس: `tenant_id` + RLS (ENABLE + FORCE) بصيغة `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer`.
- لا تثق بـ `tenant_id` من الجسم — يُختم من الجلسة. الدور `nama_medical_app` (super=false, bypassrls=false). راجع [[jumanasoft-multi-tenant-rbac]].

## G2 — سلامة المال (Money Integrity)
- أعمدة المال = `NUMERIC(14,2)` لا REAL (هجرة e22). السائق يُرجِعها **نصوصاً** → استعمل `parseFloat`/`parseMoney` في كل جمع/عرض (ممنوع `+` الخام).
- التحقّق المالي خادمي (parseMoney/enforceDiscountCap/assertAmountWithinCap) — لا يُوثَق بقيم العميل.

## G3 — منع التكرار (Idempotency)
- مسارات المال POST تحمل `Idempotency-Key` → حارس `idempotency.js` (replay يُعيد الردّ المخزَّن، 409 للتكرار، fail-open). راجع [[jumanasoft-billing-payments]].

## G4 — التحقّق من المدخلات (Validation)
- `validateBody(schema)` على مسارات الكتابة الحرجة؛ fail-closed لكن **غير كاسر** (راجع البيانات الحيّة قبل enum/regex؛ المخطّط يُكتب من الاستعمال الفعلي).

## G5 — التدقيق (Audit)
- كل طفرة حسّاسة → `audit_trail` (من/ماذا/متى/IP)، مربوطة بسياق المستأجر. لا PHI في السجلّ.

## G6 — الأمان (Security)
- المخرجات تُهرَّب (escapeHTML) عند الإدراج في DOM. CSP enforce. الجلسة آمنة. lockout/MFA. راجع [[jumanasoft-security-audit]].

## G7 — الاختبار
- وحدات نقيّة لكل منطق جديد (نمط validation/idempotency/zatca: ملف + `*_test.js`). صفر تبعيات إن أمكن. لا نشر بلا اختبار أخضر.

## G8 — النشر (Deploy)
- نسخة احتياطية أولاً → staging/`node --check` → تطبيق → فحص صحّة (`/api/health` = UP) → **rollback تلقائي** عند الفشل. نافذة استخدام منخفض. راجع [[jumanasoft-observability-deployment]].

## G9 — التحقّق المعزول للـ DDL
- أي هجرة: جرّبها على **استرجاع معزول** من نسخة الإنتاج أولاً → `validate` يطبع المتوقّع → ثم الإنتاج.

## G10 — الديمومة
- ما يُنشر على الخادم يجب أن يكون في git (لا تغييرات «على الخادم فقط»). FF-only، ريموتات خاصة.

> القاعدة الذهبية: **الدقّة على المجاملة.** لا تفترض السلامة — أثبتها بدليل.
