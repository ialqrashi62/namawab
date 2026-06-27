# NamaMedical — تسليم حسابات الاختبار وحماية worktree الجلسة الموازية

> 2026-06-22 | تثبيت بوابة حسابات الاختبار + حماية تعديلات الجلسة الموازية. لا تشغيل E2E، لا تغييرات إنتاجية، لا لمس لعمل الجلسة الموازية.

## Gate 0 — حماية worktree الموازي (R17)
- `namaweb` يحوي تعديلات **غير ملتزَمة**: `server.js` + `public/js/app.js` (664 إدراج، 10 حذف).
- `namaweb` HEAD = gitlink المسجّل = `bc24a47` ⇒ التعديلات working-tree فقط (لم تُلتزَم).
- تحقّق أنها **ليست من هذه الجلسة**: علامات حراساتي (BLOCKED_USER_CREATE / requireRole('hr') / CREATE_EMPLOYEE / rls_daily_close) **غائبة عن الـdiff** ⇒ المالك = الجلسة الموازية.
- **الإجراء**: لم يُلمس شيء — لا stage، لا commit، لا revert، لا format، لا deploy.

```text
PARALLEL_WORKTREE_DIRTY: YES
DIRTY_FILES: namaweb/server.js, namaweb/public/js/app.js
DIRTY_DIFF_OWNER: PARALLEL_SESSION_R17
PARALLEL_CHANGES_TOUCHED: NO
```

## Gate 1 — توفّر حسابات الاختبار
فحص وجود (دون قراءة/طباعة محتوى) للمسارات المتفق عليها — **كلها غير موجودة**:
- nama_test_account_credentials — absent
- nama_test_account — absent
- .test_accounts — absent
- test_accounts.txt — absent

```text
TEST_ACCOUNTS_AVAILABLE: NO
ROLES_COVERED: none
MISSING_ROLES: tenant1 Admin, Doctor/clinical, Billing/Finance, HR (+ optional 2nd tenant)
```

## Gate 2 — خيارات المالك
```text
OPTION_A (مفضّل): المالك يوفّر الحسابات out-of-band في ملف محلي مستبعد من git
                  (مثلاً C:\Users\ice\nama_test_account_credentials) — لا يُطبَع ولا يُلتزَم.
OPTION_B: موافقة منفصلة لإنشاء حسابات اختبار مؤقتة — باسم:
          APPROVE_CREATE_TEMP_BROWSER_E2E_TEST_ACCOUNTS
          (لا تُنفَّذ ضمن هذا البرومنت).
```

## الحالة
```text
FINAL_STATUS: BLOCKED_PENDING_TEST_ACCOUNT
TEST_ACCOUNTS_AVAILABLE: NO
ROLES_COVERED: none
MISSING_ROLES: tenant1 Admin/Doctor/Billing/HR (+ optional 2nd tenant)
PARALLEL_WORKTREE_DIRTY: YES
PARALLEL_FILES: namaweb/server.js, namaweb/public/js/app.js
PARALLEL_CHANGES_TOUCHED: NO
BROWSER_E2E_RUN: NO
PRODUCTION_CHANGES: NONE
DDL_EXECUTED: NO
DATA_CHANGED: NO
GRANT_EXECUTED: NO
CODE_DEPLOYED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E_OUT_OF_BAND
```

## ملاحظة
baseline سليم (health 3/3، parent drift 0/0 @ 239f35d، FORCE_RLS=148، DB role nama_medical_app). النواة تبقى GO_WITH_OWNER_GATES؛ Browser E2E هو البوابة الوحيدة المتبقية للقبول الرسمي، موقوفة على الحسابات. عند تشغيلها لاحقاً، أتحقق أولاً من حالة فرع namaweb (قد تكون الجلسة الموازية التزمت/غيّرت).

تم تثبيت بوابة حسابات الاختبار وحماية تعديلات الجلسة الموازية دون تشغيل Browser E2E
