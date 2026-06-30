# الدفعة 2 — تقرير إغلاق تقوية Auth/RBAC (GATE 10)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-auth-rbac-hardening` (متفرّع من root `20405e2` / submodule `82f4572`).

## 1) ملخّص التنفيذ
توحيد طبقة Auth/RBAC قبل بناء الخطط/الأسعار: حارس أدمن مُسمّى مُختبَر واحد بدل فحوص inline متناثرة، إصلاح عطل حرج كان يُعطّل Super Admin (الدفعة 1)، وحارس Super Admin خارجي موحّد — **بأقل diff، سلوك محفوظ، بلا DDL، بلا كسر تسجيل الدخول أو الدفعة 1**.

## 2) الملفات (مُنشأة/معدّلة)
**كود (namaweb):**
- `rbac_guards.js` (جديد) — `isTenantAdmin` + `makeGuards()` → `{ requireAuthenticated, requireTenantAdmin, requireSuperAdmin }`؛ هوية Super Admin من `super_admin.js` (مصدر واحد).
- `rbac_guards_test.js` (جديد) — 23 اختباراً سلوكياً (يُشغّل الـ middleware فعلياً).
- `server.js` (معدّل، +27/-24) — تركيب الحُرّاس؛ ربط `requireTenantAdmin` بـ 3 مسارات؛ `requireSuperAdmin` خارجي للمنصّة؛ إضافة `username` للجلسة + استعلامي login/MFA.
- `a2_mfa_guard_test.js` / `settings_user_create_admin_guard_test.js` (معدّلان) — تحديث التوكيدات البنيوية للحارس الموحّد (الثبات الأمني محفوظ).

**توثيق (docs/governance/...):** INVENTORY · DESIGN · DDL_DECISION · SECURITY_REVIEW · CLOSEOUT (هذا).

## 3) أسئلة الامتثال (إجابات صريحة)
| سؤال | الجواب |
|---|---|
| هل تم لمس production؟ | **NO.** لا SSH، لا نشر؛ كل العمل على الفرع المحلي. |
| هل تم تشغيل DDL/migration؟ | **NO.** الدفعة no-DDL (لا migration جديد إطلاقاً). |
| هل ظهرت أسرار؟ | **NO.** فحص الأسرار نظيف؛ الهوية عبر env (لا قيم مطبوعة). |
| force push؟ | **NO.** · حذف بيانات؟ **NO.** · دمج boilerplate؟ **NO.** |
| كسر الدفعة 1؟ | **NO.** `super_admin_test` 28/28 سليمة. |

## 4) نتائج الاختبارات
- `rbac_guards_test`: **23/23** (anonymous/normal/tenant-admin/super-admin، قائمة فارغة/مشوّهة/wildcard، عزل التدقيق).
- `super_admin_test` (الدفعة 1): **28/28** سليمة.
- المجموعة الآمنة كاملة: **97/97** (تشمل `a2_mfa_guard` 19/19 و`settings_user_create_admin_guard` 6/6 بعد التحديث).
- idempotency 36/36 · zatca 33/33 · validation 37/37.

## 5) بوابات الجودة
- `node --check`: `rbac_guards.js` / `server.js` / `super_admin.js` — **OK**.
- mojibake: **0** على كل ملفات الدفعة (U+FFFD + BOM = 0؛ iconv UTF-8 = VALID).
- `git diff --check`: **نظيف** (root + submodule).
- secret scan: **نظيف**. dependency: **لا تبعيات جديدة** (سطح التبعيات دون تغيير؛ npm audit يتطلّب lockfile غير مُلتزَم بالريبو).
- typecheck/lint/build: غير منطبق (JS صرف، لا إعداد lint؛ لا تغيير CSS/build).

## 6) المخاطر المتبقية
- `requireCatalogAccess` مطابقة فضفاضة — تُركت عمداً (القاعدة 7)؛ خارج نطاق إدارة المستخدمين/المستأجرين.
- جلسات قائمة قبل النشر تفتقد `username` حتى إعادة تسجيل الدخول — لا أثر (غير منشور، Super Admin غير مُفعّل).
- صفحة Super Admin الساكنة بلا حارس صفحة (الـ API محمي 403؛ لا أسرار بالـ HTML) — تحسين اختياري لاحق.

## 7) خطة التراجع (Rollback)
- لا أثر على الإنتاج (لم يُنشر). محلياً: حذف الفرع `feature/jumanasoft-auth-rbac-hardening`، أو `git revert` لكوميت التقوية. لا rollback DB (no-DDL).

## 8) القرار النهائي
**BATCH2_AUTH_RBAC_HARDENING_PASS**

## 9) الخطوة التالية المقترحة
- (عند الرغبة) تفعيل مبوّب على staging: `SUPER_ADMIN_ENABLED=true` + `SUPER_ADMIN_USERS=<أسماء>` — **ويجب على Super Admins إعادة تسجيل الدخول** لتعبئة `username` بالجلسة.
- الدفعة 3 (الخطط والأسعار / Plans & Pricing) — تستفيد من الحُرّاس الموحّدة الجاهزة.
