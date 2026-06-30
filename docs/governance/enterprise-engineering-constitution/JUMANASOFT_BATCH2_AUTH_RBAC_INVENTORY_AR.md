# الدفعة 2 — جرد Auth/RBAC (GATE 2)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-auth-rbac-hardening` (متفرّع من `20405e2` / submodule `82f4572`).
**النطاق:** قراءة فقط في هذه البوابة — لا تعديل كود.

## 1) آلية تسجيل الدخول والجلسة
- **POST `/api/auth/login`** ([server.js:700](../../../namaweb/server.js#L700)): تحقّق `bcrypt` (لا fallback نصّي)، قفل بعد 5 محاولات (15 دقيقة)، بوّابة MFA (TOTP) اختيارية لكل مستخدم.
- **الجلسة:** `express-session` + Redis. `establishSession()` ([server.js:653](../../../namaweb/server.js#L653)) يعيد توليد session id (مضاد لتثبيت الجلسة) ويُلغي الجلسة السابقة لنفس المستخدم (جلسة واحدة فعّالة).
- **محتوى `req.session.user`** ([server.js:670](../../../namaweb/server.js#L670)):
  `{ id, name, display_name, role, speciality, permissions, tenantId, facilityId }`.
  - **الهوية تُؤخذ من الجلسة فقط، لا من جسم الطلب** — جيّد.
  - **⚠️ لا يحتوي `username`** ولا `is_active` — انظر §6 (عطل حرج في حارس Super Admin).

## 2) الحراس (Middleware/Guards) الحالية
| الحارس | المصدر | الوظيفة |
|---|---|---|
| `requireAuth` | [server.js:304](../../../namaweb/server.js#L304) | تحقّق وجود جلسة فقط → 401. |
| `requireRole(...modules)` | [server.js:352](../../../namaweb/server.js#L352) | RBAC عبر خريطة `ROLE_PERMISSIONS`؛ `Admin='*'`؛ يسجّل `BLOCKED_AUTHORIZATION`. |
| `requireCatalogAccess` | [server.js:310](../../../namaweb/server.js#L310) | فحص دور inline (`admin/manager/administrator` بحروف صغيرة). |
| `requireTenantScope` / `requireTenantContext` / `requireFacilityContext` | [server.js:416](../../../namaweb/server.js#L416)+ | عزل المستأجر (يرفض غياب tenantId في الإنتاج). |
| `requirePermission` | `makeRequirePermission` ([server.js:13477](../../../namaweb/server.js#L13477)) | مصفوفة `role_permissions` في DB + fallback للقديم. |
| `requireSuperAdmin` (داخلي) | [super_admin.js:86](../../../namaweb/super_admin.js#L86) | قائمة بيئية `SUPER_ADMIN_USERS` (ليس دور مستأجر). |

## 3) الأدوار
- ~24 دوراً في `ROLE_PERMISSIONS` ([server.js:328](../../../namaweb/server.js#L328))؛ `Admin = '*'` (الأعلى).
- **لا يوجد دور "Super Admin" في قاعدة البيانات** — هوية Super Admin = قائمة بيئية فقط (منع تصعيد أدمن المستأجر).
- `system_users` **لا يحوي `tenant_id`** — النطاق عبر جدول `user_tenants`.

## 4) Endpoints الحساسة (تغيير tenant/status/plan/user/role)
| Endpoint | الحارس الحالي | ملاحظة |
|---|---|---|
| `POST /api/settings/users` | `requireRole('settings')` + **inline `role!=='Admin'`** | إنشاء مستخدم؛ الحارس inline يمنع IT (يملك settings) من خلق Admin. |
| `PUT /api/settings/users/:id` | `requireAuth` + **inline** | منطق دقيق: منع تصعيد الذات، حماية آخر أدمن، تحديث ملف ذاتي آمن لغير الأدمن. |
| `DELETE /api/settings/users/:id` | `requireAuth` + **inline `role!=='Admin'`** | حماية آخر أدمن + منع حذف الذات. |
| `POST /api/mfa/admin-reset` | `requireAuth` + **inline `role!=='Admin'`** | تصفير MFA لمستخدم آخر. |
| `PUT /api/settings` | `requireRole('settings')` | إعدادات الشركة. |
| Facility Onboarding | `requireAuth`+`requireRole('settings')`+inline Admin | توفير منشأة. |
| `/api/super-admin/*` | قائمة بيئية (خلف علم) | تعليق/تفعيل مستأجر. |

## 5) مسارات تعتمد على علم بيئي (env flags)
- `/api/super-admin/*` — خامل ما لم `SUPER_ADMIN_ENABLED=true` ([server.js:13495](../../../namaweb/server.js#L13495)).
- `AUDIT_ALL_MUTATIONS` — تدقيق آلي اختياري ([server.js:392](../../../namaweb/server.js#L392)).
- fallback `tenantId=1` فقط خارج الإنتاج ([server.js:406](../../../namaweb/server.js#L406), [669](../../../namaweb/server.js#L669)).

## 6) الفجوات والملاحظات (أهداف التقوية)
1. **⚠️ حرج — حارس Super Admin معطّل فعلياً:** `isSuperAdmin` يطابق `user.username` مقابل القائمة، لكن `req.session.user` **لا يحوي `username`** → القائمة لا تطابق أحداً أبداً. النتيجة fail-closed (آمنة) لكن المنصّة **لا تسمح لأحد** حتى بقائمة صحيحة. **الإصلاح:** إضافة `username` إلى الجلسة (additive، آمن، مُثبت الحاجة بموجب القاعدة 7) + استعلامي login/MFA.
2. **تكرار فحص Admin inline** في 3+ مواضع (`role !== 'Admin'`) بلا حارس مُسمّى موحّد → خطر انحراف (drift). **الإصلاح:** حارس موحّد `requireTenantAdmin` (سلوك محفوظ: 403 + audit).
3. **`requireCatalogAccess`** يطابق أدواراً غير موجودة (`manager`/`administrator` ليست في `ROLE_PERMISSIONS`) — مطابقة فضفاضة. **القرار:** يُترك سلوكه (قد تستخدمه نشرة بدور مخصّص) ويُوثّق كـ residual (القاعدة 7).
4. **`requirePermission`** سليم (DB matrix + fallback) — لا تغيير.
5. لا أسرار في الكود؛ هوية Super Admin عبر env. تسجيل الدخول وقفل الحساب سليمان — **لا نلمسهما** (القاعدة 7).

## 7) الخلاصة
الطبقة قوية لكنها تعاني: (أ) عطل حرج يمنع تفعيل Super Admin، (ب) تشتّت حُرّاس الأدمن. التقوية: حارس موحّد مُختبَر + إصلاح هوية الجلسة، بأقل diff وبلا كسر لتسجيل الدخول أو الدفعة 1.
