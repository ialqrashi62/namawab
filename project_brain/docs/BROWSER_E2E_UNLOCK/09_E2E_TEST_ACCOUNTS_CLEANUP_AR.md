# تنظيف حسابات Browser E2E المؤقتة — إغلاق

> 2026-06-22 | بعد نجاح A1 UI + A3A PHI File Guard + A2 MFA، نُظِّفت حسابات الاختبار الموسومة `e2e_*` فقط عبر **soft-disable + سحب صلاحيات الوصول**، مع **الإبقاء على سجلّ التدقيق** كأثر. لم يُمَسّ أي مستخدم إنتاجي. لا DDL، لا كود، لا محاسبة، لا أسرار مطبوعة.

## ما تمّ (transaction واحدة)
- **soft-disable**: `UPDATE system_users SET is_active=0 WHERE username LIKE 'e2e_%'` ⟶ 4 حسابات (ids 61–64: e2e_admin/e2e_doctor/e2e_nurse/e2e_t2user). الدخول يرفضها الآن (login يشترط `is_active=1`).
- **سحب الوصول**: حُذفت روابط `user_facilities` (3) و`user_tenants` (4) للحسابات ⟶ بلا مستأجر/منشأة حتى لو أُعيد تفعيلها.
- **MFA**: `user_mfa`/`user_mfa_recovery_codes` للحسابات = 0 (نُظِّفت أصلاً عقب A2). أُعيد تنفيذ الحذف احترازياً (idempotent).
- **التدقيق محفوظ**: 77 صفّ `audit_trail` لهذه الحسابات بقيت كما هي (أثر تدقيقي).
- **الجلسات**: مخزّنة في Redis (لا جدول/مفتاح لكل مستخدم) ⟶ لا يمكن استهدافها فردياً دون مسح كل الجلسات (يطال الإنتاج) ⟹ تُركت تنتهي تلقائياً (≤8 ساعات)؛ والحسابات معطّلة فتعذّر استخدامها عملياً.
- **ملف الاعتماد المحلي**: `C:\Users\ice\nama_test_account_credentials` حُذف (خارج المستودع، غير متتبَّع). محتواه لم يُطبع.

## التحقّق
| البند | النتيجة |
|---|---|
| e2e accounts نشِطة بعد التنظيف | **0** (4 معطّلة) |
| دخول الحسابات الأربعة بعد التعطيل | **401** للأربعة (غير قابلة للاستخدام) ✓ |
| مستخدمون إنتاجيون نشطون (قبل/بعد) | 2 / 2 — **بلا تغيير** ✓ |
| مستخدمون إنتاجيون (إجمالي قبل/بعد) | 2 / 2 — بلا تغيير ✓ |
| user_mfa / user_tenants للـe2e | 0 / 0 |
| صفوف التدقيق (قبل/بعد) | 77 / 77 — **محفوظة** ✓ |
| health | local 200 |
| FORCE_RLS / accounting / journal | 150 / OFF / 0 |

## الحقول
```text
FINAL_STATUS: E2E_TEST_ACCOUNTS_CLEANED_UP
E2E_USERS_BEFORE: 4 (active)
E2E_USERS_AFTER: 4 rows kept but DISABLED (active=0); 0 active
CLEANUP_MODE: SOFT_DISABLE + ACCESS_REVOCATION (audit preserved)
MFA_ROWS_CLEANED: YES (0 remaining for e2e)
RECOVERY_ROWS_CLEANED: YES (0 remaining for e2e)
SESSIONS_CLEANED: REDIS_BACKED_NOT_PER_USER_PURGEABLE (accounts disabled; sessions expire <=8h)
AUDIT_ROWS_PRESERVED: YES (77 rows kept)
LOCAL_CREDENTIALS_FILE_REMOVED: YES (outside git, untracked)
PRODUCTION_USERS_IMPACTED: NO (2 active before=after, 2 total before=after)
DDL_EXECUTED: NO
DATA_CHANGED: YES (e2e access linkages deleted + e2e users disabled only)
CODE_DEPLOYED: NO
PM2_RESTARTED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
HEALTH_STATUS: 200
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
GIT_COMMIT: parent (docs only — this closeout)
GIT_PUSH: FF (parent origin/master)
NEXT_RECOMMENDED_ACTION: PHASE_A3_FULL_ENCRYPTION_AT_REST_OR_FINAL_PHASE_A_CLOSEOUT
```

## ملاحظات
- اختير soft-disable (لا hard-delete) عمداً للحفاظ على إسناد سجلّ التدقيق (77 صفّاً تشير إلى هذه المعرّفات) وتفادي أي قيود FK — يطابق طلب "يُفضّل الإبقاء كأثر تدقيقي" و"فضّل soft-disable". حذف لاحق صلب ممكن كمتابعة إن طُلب.
- لم تُمَسّ المحاسبة (OFF، journal=0)، ولا R17، ولا أي مستخدم حقيقي؛ لا DDL ولا نشر كود.

تم تنظيف حسابات Browser E2E المؤقتة دون التأثير على المستخدمين الحقيقيين أو كشف أسرار
