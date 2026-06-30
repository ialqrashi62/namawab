# الدفعة 4C — تصميم إنفاذ max_users (مرشّح) (GATE 3)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-max-users-enforcement-candidate`.
**المبدأ:** نقطة إنفاذ واحدة، خلف flags، يعيد استخدام `entitlements.js`، أقل diff، لا تفعيل حيّ.

## 1) نقطة الإنفاذ
- **`POST /api/settings/users` فقط.** لا ربط بأي مسار آخر (لا فواتير، لا فروع، لا وحدات).
- الحارس يُضاف **بعد** `requireTenantAdmin` في السلسلة (لا يصل إليه إلا أدمن المستأجر).

## 2) السلوك حسب الأعلام
| الوضع | السلوك |
|---|---|
| `ENTITLEMENTS_ENABLED=false` (افتراضي) | **no-op تام** — `next()` فوراً، **بلا أي استعلام**، السلوك الحالي محفوظ بالكامل. |
| `ENABLED=true` + `MODE=observe` (افتراضي عند التفعيل) | يحسب الحدّ والاستخدام، يسجّل `USER_CREATE_LIMIT_OBSERVED` عند التجاوز، **لا يمنع** (`next()`). |
| `ENABLED=true` + `MODE=enforce` | يمنع إذا `current_users >= max_users` → `409` + `USER_CREATE_LIMIT_BLOCKED`؛ وإلا `next()`. |

## 3) سياسة العدّ (count policy)
- `current_users = COUNT(*) FROM user_tenants WHERE tenant_id=$1 AND is_active=true` (active فقط).
- `tenant_id` من الجلسة (`req.session.user.tenantId`) — **لا من جسم الطلب** (منع انتحال).
- `super admin` خارج المستأجر غير محتسَب (العدّ tenant-scoped).
- `max_users === null` → **غير محدود** → يسمح دائماً.

## 4) الاستجابة عند المنع (enforce)
- `HTTP 409` (تعارض حالة الموارد — يطابق نمط المشروع لـ «الحد مبلوغ»؛ بخلاف 403 RBAC).
- جسم: `{ error: 'User limit reached for current plan', error_ar: 'تم بلوغ الحد الأقصى لعدد المستخدمين في خطة المستأجر', code: 'USER_LIMIT_REACHED' }`.
- **لا تفاصيل داخلية حسّاسة** (لا أسماء جداول/استعلامات).

## 5) fail-open (عدم كسر المستأجرين)
- أي خطأ في الحلّ/العدّ (غياب e25، خطأ DB) → **يسمح** (`next()`) + يسجّل `USER_CREATE_LIMIT_FAILOPEN`. يطابق `FAIL_MODE=allow_existing`.
- غياب `tenantId` في الجلسة → يسمح (لا سياق مستأجر للإنفاذ).

## 6) التدقيق (Audit)
- `USER_CREATE_LIMIT_OBSERVED` (observe، عند التجاوز، لا منع).
- `USER_CREATE_LIMIT_BLOCKED` (enforce، عند المنع).
- `USER_CREATE_LIMIT_FAILOPEN` (خطأ → سُمح).
- كلها بلا أسرار/PII (tenant id + أرقام فقط).

## 7) المعمارية (أقل diff)
- **يُضاف إلى `entitlements.js`:** `countTenantUsers(pool, tenantId)` + `makeUserLimitGuard(deps)` (middleware factory يعيد استخدام `makeEntitlementsResolver` + `checkLimit` + `pickEnforcement`).
- **server.js:** `require` + إنشاء `userLimitGuard` مرة واحدة مبكراً (يقرأ `process.env`) + إدراجه في سلسلة `POST /api/settings/users` بعد `requireTenantAdmin`. لا تغيير على المعالج إلا مرور الحارس قبله.
- **لا تكرار منطق** — كل الحساب من `entitlements.js`.

## 8) rollback / activation
- **rollback فوري:** `ENTITLEMENTS_ENABLED=false` (يُعيد no-op) أو `MODE=observe` (يوقف المنع).
- **التفعيل الحيّ مؤجّل** حتى نجاح 4B على staging (توفير e25 + خطط + ربط مستأجر + قراءة `max_users` حقيقي) ثم observe ثم enforce على staging فقط. لا production.
- **شرط تفعيل إضافي:** تأكيد أن إنشاء المستخدم يربط `user_tenants` (وإلا العدّ لا ينمو عبر هذا المسار — فجوة §6 من الجرد).

## 9) خارج النطاق (مؤكَّد)
لا DDL، لا e25، لا seed، لا production/staging، لا فواتير/فروع/وحدات، لا دفع/checkout/webhook، لا إنفاذ على نقاط متعددة.
