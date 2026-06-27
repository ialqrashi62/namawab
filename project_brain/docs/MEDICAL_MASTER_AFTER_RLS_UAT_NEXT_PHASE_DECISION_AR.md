# قرار المرحلة التالية بعد UAT تحت RLS (Master Decision)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_AFTER_RLS_UAT_RESELECT_NEXT_PHASE` | التاريخ: 2026-06-21.

```text
TEST_ACCOUNT_READY: NOT_ISSUED (ورد في قاعدة الاختيار شرطياً فقط)
=> حسب قاعدة القرار: اختير المسار البديل (audit_trail governance candidate).

SELECTED_NEXT_PHASE: P1_AUDIT_TRAIL_SUPER_ADMIN_GOVERNANCE_VIEW_OR_ROLE_CANDIDATE (نُفِّذ هذه الجولة — Gate 3B)
PRIORITY_LEVEL: P1 (بند الحوكمة المتبقّي بعد إنفاذ RLS)
WHY_SELECTED:
  - Full Browser E2E UAT يتطلب حساب اختبار داخل الواجهة (لم يصدر TEST_ACCOUNT_READY) ⇒ مؤجّل.
  - البند الآمن الأعلى أولوية: حل قراءة super-admin العابرة لـ audit_trail (بعد تشديد سياستها صارت
    معزولة بالمستأجر، فقراءة الامتثال العابرة محجوبة) عبر آلية محكومة بلا BYPASSRLS/SUPERUSER.
WHY_NOT_E2E_NOW: لا حساب اختبار (TEST_ACCOUNT_READY غير صادر) ⇒ BLOCKED_PENDING_TEST_ACCOUNT لذلك المسار.
WHY_NOT_ACCOUNTING: ممنوع؛ flag يبقى OFF، journal=0.
WHY_NOT_STITCH: BLOCKED_PENDING_MCP_AND_KEY.
WHY_NOT_NEW_DDL_ON_PROD: candidate فقط هذه الجولة؛ لا DDL على الإنتاج بلا موافقة.
EXECUTION_SCOPE: read-only audit + SQL candidate (up/validate/down) + rehearsal على DB معزول. لا DDL إنتاجي، لا تغيير بيانات/دور/نشر.
```

## التصميم المختار (الخيار 2: دور قارئ تدقيق محكوم)
دور `nama_audit_reader` بأقل امتياز (NOLOGIN/NOSUPERUSER/NOBYPASSRLS) + سياسة SELECT سماحية **مقيّدة بالدور** (`TO nama_audit_reader USING (true)`) تُدمج OR مع سياسة المستأجر القائمة. النتيجة: القارئ يرى كل صفوف audit_trail (للتدقيق فقط، SELECT)، وبقية الأدوار تبقى معزولة بمستأجرها. بلا BYPASSRLS/SUPERUSER، FORCE قائمة، عزل بقية الجداول غير مُمَس.

## تصنيف المرحلة السابقة (إلزامي)
```text
AUTHORIZATION_AND_RLS_RUNTIME_UAT_PASS
FULL_BROWSER_E2E_UAT_WITH_TEST_ACCOUNT: NOT_YET
```

`NEXT_PHASE_DECISION_COMPLETE`
