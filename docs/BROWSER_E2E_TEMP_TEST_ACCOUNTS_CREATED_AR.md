# حسابات Browser E2E المؤقتة — تم الإنشاء

> 2026-06-22 | حسابات اختبار مؤقتة موسومة test/e2e فقط. كلمات المرور لم تُطبع ولا تُلتزَم. لا محاسبة، لا PHI، لا مساس بالمستخدمين القائمين.

## ما أُنشئ (4 حسابات، ids 61-64)
| label | username | الدور | المستأجر | facility/branch | الغرض |
|---|---|---|---|---|---|
| tenant1_admin | e2e_admin | Admin | 1 | 1/1 | إدارة + اختبارات سلبية للامتياز |
| tenant1_doctor | e2e_doctor | Doctor | 1 | 1/1 | EMR/توقيع/قفل |
| tenant1_nurse | e2e_nurse | Nurse | 1 | 1/1 | تمريض/eMAR |
| tenant2_user | e2e_t2user | Reception | 2 | — | اختبار عزل سلبي (مستأجر آخر) |

- كل حساب: كلمة مرور عشوائية قوية (crypto.randomBytes، bcrypt cost 10)، display_name موسوم "E2E TEST ... (temp)"، is_active=1.
- ربط user_tenants (tenant 1 للثلاثة، tenant 2 للرابع) + user_facilities (facility 1 / branch 1 لحسابات المستأجر 1). صلاحيات بالدور فقط (لا منح زائد).

## smoke (الحالة فقط، بلا أسرار)
| الاختبار | النتيجة |
|---|---|
| admin login | 200 + session cookie ✅ |
| doctor login | 200 + session cookie ✅ |
| bad login (كلمة خاطئة) | 401 ✅ |
| تدقيق LOGIN/FAILED_LOGIN | 3 صفوف (آخر دقيقتين) ✅ |
| ملف الاعتماد خارج git | غير متتبَّع/مُدرَج ✅ |

## الحقول
```text
FINAL_STATUS: TEMP_BROWSER_E2E_TEST_ACCOUNTS_READY
ACCOUNTS_CREATED: 4
TENANT1_ADMIN_CREATED: YES (e2e_admin)
TENANT1_DOCTOR_CREATED: YES (e2e_doctor)
TENANT1_NURSE_CREATED: YES (e2e_nurse)
TENANT2_NEGATIVE_ACCOUNT_CREATED: YES (e2e_t2user, tenant 2)
CREDENTIALS_FILE_CREATED: YES (C:\Users\ice\nama_test_account_credentials، خارج git، mode 600)
CREDENTIALS_PRINTED: NO
SECRETS_COMMITTED: NO
DB_CHANGED: YES (4 صفوف system_users + user_tenants/user_facilities — حسابات اختبار موسومة فقط)
PRODUCTION_USERS_IMPACTED: NO (المستخدمان القائمان لم يُمسّا؛ حسابات جديدة موسومة test)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
NEXT_RECOMMENDED_ACTION: RUN_BROWSER_E2E_UNLOCK_GATE (NAMA_MEDICAL_BROWSER_E2E_UNLOCK_GATE_...)
```

## ملاحظات سلامة
- كلمات المرور عشوائية قوية، لم تُطبع في أي مخرج، محفوظة فقط في ملف خارج المستودع بصلاحية مقيّدة.
- الحسابات موسومة بوضوح (e2e_/temp) لتسهيل الحذف بعد E2E: `DELETE FROM system_users WHERE username LIKE 'e2e_%'` (+ user_tenants/user_facilities المرتبطة) — يُنفَّذ بعد انتهاء E2E.
- المحاسبة OFF، PHI upload freeze سارية، لا رفع PHI حقيقي.

## التنظيف بعد E2E (موصى)
حذف حسابات e2e_* + روابطها بعد اكتمال اختبارات A1 UI / A3A / A2 MFA.

تم إنشاء حسابات اختبار مؤقتة لـBrowser E2E دون كشف كلمات المرور أو تفعيل المحاسبة
