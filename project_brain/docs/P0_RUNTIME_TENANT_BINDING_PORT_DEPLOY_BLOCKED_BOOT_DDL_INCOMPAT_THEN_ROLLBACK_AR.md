# P0 — نقل ربط app.tenant_id ثم نشر: النشر كشف عدم توافق إقلاعي ⇒ rollback محكوم إلى postgres

> المرحلة: `P0_PORT_RUNTIME_TENANT_BINDING_FROM_10DED01_THEN_DEPLOY` | التاريخ: 2026-06-21 | جهاز DESKTOP-T70LUCJ
> الخلاصة بسطر: الربط نُقل وثبت محلياً (8/8) ودُفع، لكن **النشر (restart) كشف أن السطر المنشور 039a7d7 لا يقلع أصلاً كدور غير-superuser**؛ التطبيق سقط، فجرى **rollback محكوم إلى postgres بموافقة المالك** واستُعيدت الخدمة.

## الاكتشاف الحرج (يعيد تأطير الوضع)
**تبديل الدور إلى `nama_medical_app` لم يكن حيّاً فعلياً في وقت التشغيل قط.** التطبيق ظل يعمل كـ `postgres` (العملية ما قبل التبديل). أمر `pm2 restart` في بوابة النشر هو ما كشف ذلك — وأسقط التطبيق.

السبب: `server.js` في 039a7d7 ينفّذ عند الإقلاع **DDL واسعاً + بذرة بيانات** تتطلب صلاحيات superuser:
- **20×** `permission denied for schema public` — كتل `CREATE/ALTER` إقلاعية متفرقة (pharmacy/obgyn/referrals/medical_reports/cash_drawer…) ⇐ `nama_medical_app` لا يملك `CREATE` على schema public (و GRANT ممنوع).
- **10×** `new row violates row-level security policy for table "patients"` — بذرة `INSERT INTO patients` إقلاعية (server.js:397) ⇐ لا `app.tenant_id` وقت الإقلاع + RLS مفروض على الدور غير-superuser.

⇒ 039a7d7 **غير قابل للإقلاع** إلا بدور superuser (CREATE + تجاوز RLS) = `postgres`. لذا «RLS_RUNTIME_ENFORCEMENT: YES» في مراحل سابقة كان يعكس **مجسّات سياق يدوية**، لا مسار التطبيق الفعلي.

## ما نُفِّذ (صحيح ومدفوع — لكنه خامل تحت postgres)
| العنصر | الحالة |
|---|---|
| نقل ربط ALS + غلاف `pool.query` (db_postgres.js) + middleware (server.js) من 10ded01 | تمّ — اختبار محلي 8/8 PASS، commit `10b7174`، push FF إلى origin/main |
| حارس إنتاج `initDatabase` (تخطّي DDL في الإنتاج) | تمّ — commit `825390b` (أزال أحد أسباب الانهيار؛ السجل يُظهر "Skipping table initialization") |
| دفع FF إلى origin/main | تمّ — `039a7d7..825390b`، بلا force |

## بوابة النشر (6) — فشلت ثم عولجت بـ rollback
1. `pm2 restart` ⇒ **crash-loop** (السبب الأول: `initDatabase` DDL كـ nama_medical_app).
2. نقل حارس `initDatabase` (825390b) ⇒ ما زال crash-loop (كُشفت الكتل الإقلاعية الأخرى + البذرة).
3. **توقّف + تصعيد للمالك** (السؤال التفاعلي): الخيار المُختار = **«Revert to postgres now»**.
4. **rollback محكوم**: إعادة `DB_USER/DB_PASSWORD` في .env إلى postgres (نسخة احتياطية محفوظة خارج المستودع؛ بلا طباعة قيم) ⇒ `pm2 restart` ⇒ **الخدمة مستعادة**: `✅ running!`، health **15/15** خلال 15s، online، restarts ثابتة (لا انهيار جديد).

> ملاحظة: حارس Gate-6 في التوجيه كان «rollback FILES» بافتراض أن العطل من كودي؛ لكن العطل **من كتل 039a7d7 الإقلاعية ذاتها**، وإرجاع ملفاتي لا يستعيد الخدمة (039a7d7 ينهار أيضاً كـ nama_medical_app). لذا الـ rollback الفعّال الوحيد = إرجاع الدور إلى postgres (بموافقة المالك، لأنه تغيير .env مُبوَّب).

## الحقول
```text
FINAL_STATUS: SERVICE_RESTORED_VIA_OWNER_APPROVED_ROLLBACK_TO_POSTGRES (نشر الربط محجوب بعدم توافق إقلاعي قائم في 039a7d7)
SELECTED_PHASE: P0_PORT_RUNTIME_TENANT_BINDING_FROM_10DED01_THEN_DEPLOY
CODE_PORTED: YES (binding 10b7174 + initDatabase guard 825390b)
CODE_PUSHED: YES (origin/main @ 825390b ; FF ; no force)
LOCAL_BINDING_TEST: 8/8 PASS (كـ nama_medical_app في بيئة اختبار)
PRODUCTION_DEPLOYED: NO (الربط لم يُنشر فعّالاً — restart انهار ثم rollback إلى postgres)
RUNTIME_CODE_LIVE: 825390b (الربط+الحارس حيّان لكن خاملان تحت postgres؛ benign)
DB_ROLE_CURRENT: postgres (أُرجِع من nama_medical_app — rollback طارئ بموافقة المالك)
RLS_RUNTIME_ENFORCEMENT: NO (التطبيق superuser ⇒ RLS متجاوَز؛ التبديل لم يكن حيّاً قط)
ENV_CHANGED: YES (.env DB_USER/DB_PASSWORD → postgres ؛ rollback طارئ موافَق عليه ؛ النسخة الأصلية محفوظة خارج المستودع)
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
DDL_EXECUTED: NO
GRANT_EXECUTED: NO
DATA_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
HEALTH_AFTER_ROLLBACK: 200 (15/15 خلال 15s ؛ online ؛ مستقر)
PARALLEL_SESSION_FILES_TOUCHED: NO (migrate.ps1/protocol_x.ps1 ظهرتا محذوفتين في working tree بفعل الجلسة الموازية — لم أمسّهما/أستجهّزهما)
CRITICAL_FINDING: role switch never live at runtime; 039a7d7 cannot boot as non-superuser (startup CREATE/ALTER + patients seed @ server.js:397 require superuser/RLS-bypass)
NEXT_REQUIRED_ACTION: PLAN_BOOT_DDL_REFACTOR (حراسة/إزالة كل DDL إقلاعي + بذرة patients) كشرط مسبق لتشغيل nama_medical_app فعلياً ⇐ ثم إعادة محاولة التبديل+النشر
```

## الطريق الحقيقي لتفعيل RLS (شغل لاحق، يحتاج تخطيطاً وموافقة)
لجعل `nama_medical_app` يقلع فعلاً (وبالتالي RLS يفرض عبر مسار التطبيق):
1. **حراسة/إزالة كل DDL إقلاعي** في server.js (الكتل المتفرقة CREATE/ALTER) — إمّا حارس إنتاج موحّد كما في initDatabase، أو نقلها إلى migration خارج وقت التشغيل.
2. **بذرة patients الإقلاعية (server.js:397)**: تعطيلها في الإنتاج أو تشغيلها داخل `runWithTenant` (الربط المنقول يدعم ذلك) بحيث تُختم tenant.
3. إعادة محاولة التبديل عبر `.env` (بموافقة توقفية) + نشر، ثم **إثبات مسار التطبيق** (قراءة مصادقة فعلية ترجع صفوف tenant، وكتابة مختومة) — لا اكتفاء بمجسّات يدوية.
4. الربط (10b7174) والحارس (825390b) جاهزان ومدفوعان بالفعل لهذه اللحظة.

## ما لم يُمَس
لا DDL، لا GRANT، لا accounting/journal، لا تفعيل audit-reader، لا force push، لا أسرار مطبوعة، لا ملفات جلسات موازية. تقرير SSL لـ alfaisal-erp نُقل خارج المستودع (لا يخص NamaMedical).

`RUNTIME_TENANT_BINDING_PORTED_BUT_DEPLOY_BLOCKED_BY_BOOT_DDL_INCOMPAT — SERVICE_RESTORED_AS_POSTGRES`
