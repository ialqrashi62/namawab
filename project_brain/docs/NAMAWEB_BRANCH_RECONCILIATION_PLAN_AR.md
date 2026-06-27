# خطة مصالحة فرع namaweb (Reconciliation Plan)

> المرحلة: `NAMAWEB_BRANCH_RECONCILIATION_AND_SECURITY_DELTA_CANDIDATE` | التاريخ: 2026-06-21 | candidate/plan فقط.

## القيود الصارمة
```text
لا force push ؛ لا overwrite للفرع الحي 039a7d7 ؛ لا حذف ملفات الجلسة الموازية (migrate.ps1/protocol_x.ps1) ؛
لا لمس .env ؛ لا تفعيل accounting ؛ لا GRANT/deploy/restart بلا أمر صريح لاحق ؛ cherry-pick/manual patch فقط عند اللزوم.
```

## الخيارات لمعالجة انحدار الكتابة (~44 جدول)
### ✅ المُوصى به — A: DEFAULT على مستوى القاعدة (شامل، أقل مخاطرة)
`docs/sql/rls_tenant_id_default_reconciliation_candidate_{up,validate,down}.sql`: ضبط `tenant_id DEFAULT (NULLIF(current_setting('app.tenant_id',true),''))::integer` لكل جداول FORCE-RLS.
- يصلح كل الـ44 دفعة واحدة **بلا تعديل ~44 مسار كود** ولا لمس فرع namaweb المتشعّب.
- يصلح أيضاً إسناد logAudit (audit_trail يُختم تلقائياً تحت سياق المستأجر).
- لا يضعف العزل: WITH CHECK يبقى؛ الـDEFAULT يوفّر نفس قيمة السياق فقط؛ تمرير صريح مخالف يُرفض؛ بلا سياق ⇒ NULL (fail-closed).
- **بروفة 6/6 PASS** على DB معزول (BEFORE 42501 → AFTER allowed+defaulted=1 → forge blocked → no-ctx blocked → down يعيد 42501). idempotent + down آمن.
- التطبيق: DDL واحد محكوم (psql atomic) — يحتاج `APPROVE`. **لا يلمس الكود أو الفرع.**

### B (بديل/تكميلي) — إعادة ختم tenant_id في الكود لكل مسار INSERT ناقص
- يتطلب تعديل ~44 مسار في server.js المتشعّب (churn كبير، عرضة للخطأ، تعارض محتمل مع الجلسة الموازية).
- مناسب كدفاع-في-العمق لاحقاً، لكنه ليس الحل الأول للطوارئ.

### C (حوكمة طويلة) — توفيق فرعَي namaweb
- مراجعة منظّمة لدمج حُرّاسي ضمن خط الجلسة الموازية عبر cherry-pick انتقائي + اختبارات، بلا force/overwrite. عمل أكبر، يُجدول لاحقاً.

## التوصية
1. **عاجل**: تطبيق المرشّح A (tenant_id DEFAULT) بموافقة `APPROVE` — يرفع انحدار الكتابة فوراً عن الـ44 جدولاً دون لمس الكود/الفرع. (مُختبَر 6/6.)
2. **لاحقاً**: مراجعة B/C كدفاع-في-العمق + إعادة ختم logAudit/blood-bank في الكود + توفيق الفرعين.
3. لا audit-reader GRANT ولا accounting قبل (1).

## الملفات المرشّحة (لا تُنفَّذ هنا)
```text
docs/sql/rls_tenant_id_default_reconciliation_candidate_up.sql      (DDL — DEFAULT لكل FORCE-RLS)
docs/sql/rls_tenant_id_default_reconciliation_candidate_validate.sql
docs/sql/rls_tenant_id_default_reconciliation_candidate_down.sql
(B لاحقاً: server.js مسارات INSERT الناقصة — لم تُلمس هذه المرحلة)
```

`RECONCILIATION_PLAN_COMPLETE`
