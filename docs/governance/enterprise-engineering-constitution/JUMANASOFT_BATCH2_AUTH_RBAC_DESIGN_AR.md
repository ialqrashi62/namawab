# الدفعة 2 — نموذج التهديد والتصميم (GATE 3)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-auth-rbac-hardening`.
**المبدأ:** أقل diff، سلوك محفوظ، لا نظام Auth جديد، لا OAuth/SAML، لا impersonation.

## 1) مصفوفة الأدوار
| الدور | التعريف | المصدر |
|---|---|---|
| `anonymous` | بلا جلسة | `!req.session.user` |
| `authenticated` | جلسة صالحة لأي مستخدم | `req.session.user` موجود |
| `tenant user` | دور تشغيلي داخل مستأجر | `ROLE_PERMISSIONS[role]` (مصفوفة) |
| `tenant admin` | `role === 'Admin'` داخل المستأجر | `ROLE_PERMISSIONS['Admin']='*'` |
| `super admin` | عضو قائمة `SUPER_ADMIN_USERS` (منصّة، ليس دور مستأجر) | env + `username` بالجلسة |

**ترتيب الصلاحية:** super admin (منصّة) ⟂ tenant admin (مستأجر) — **بُعدان مستقلان**. super admin لا يُشتقّ من دور المستأجر، وtenant admin لا يصل أبداً لمسارات المنصّة.

## 2) مصفوفة الصلاحيات — Endpoints الحساسة
| Endpoint | الحارس المستهدف (موحّد) |
|---|---|
| `POST /api/settings/users` (إنشاء) | `requireAuth` → `requireRole('settings')` → **`requireTenantAdmin`** |
| `DELETE /api/settings/users/:id` | `requireAuth` → **`requireTenantAdmin`** (+ inline: آخر أدمن/حذف الذات) |
| `POST /api/mfa/admin-reset` | `requireAuth` → **`requireTenantAdmin`** |
| `PUT /api/settings/users/:id` | `requireAuth` + inline (يبقى — يسمح بتحديث الملف الذاتي لغير الأدمن؛ تغييره يكسر السلوك → القاعدة 7) |
| `/api/super-admin/*` | `requireAuth` → **`requireSuperAdmin(allowlist)`** (موحّد، خلف العلم) |

## 3) قواعد منع التصعيد (Anti-escalation)
1. **tenant admin لا يصبح super admin:** هوية super admin = قائمة `SUPER_ADMIN_USERS` فقط؛ `role==='Admin'` لا يكفي. `isSuperAdmin` يتجاهل دور المستأجر.
2. **super admin لا يعتمد على tenant_id:** يقرأ جدول `tenants` العلوي مباشرة؛ الإحصاءات لكل مستأجر داخل سياق RLS الخاص به فقط (لا قراءة عبر-المستأجر بالجملة).
3. **كل مسار إداري عبر حارس صريح:** لا فحوص inline متناثرة قابلة للانحراف — حارس مُسمّى مُختبَر واحد.
4. **الهوية من الجلسة فقط:** لا قراءة `role`/`username` من جسم الطلب أبداً.
5. **منع تصعيد الذات:** غير الأدمن لا يغيّر `role`/`permissions`/`is_active`/`username`/العمولة على حسابه (منطق PUT القائم — يبقى).
6. **حماية آخر أدمن:** منع إنزال/تعطيل/حذف آخر أدمن فعّال (منطق قائم — يبقى).

## 4) قواعد التدقيق (Audit)
- **رفض الوصول** لمسار حسّاس → حدث `BLOCKED_ADMIN_ONLY` / `SUPER_ADMIN_DENY` (مع الفاعل/الـ IP/المسار، **بلا أسرار**).
- **محاولة تصعيد** → `BLOCKED_PRIVILEGE_ESCALATION` (قائم في PUT).
- **تغيير role/status/tenant** → أحداث `UPDATE_USER` / `TENANT_SUSPEND` / `TENANT_REACTIVATE` (قائمة) — تبقى أسماء الأحداث كما هي لمنع كسر المراقبة.

## 5) إصلاح حرج مُثبت الحاجة (القاعدة 7)
**إضافة `username` إلى `req.session.user`** + إلى استعلامي SELECT في login وMFA. additive بحت (إضافة حقل)، لا يغيّر تدفّق تسجيل الدخول، ويُفعِّل حارس Super Admin (الذي بدونه يرفض الجميع). بدون هذا، GATE 6 يفشل ("لا يسمح إلا لمن في القائمة" = لا يسمح لأحد).

## 6) التصميم التقني (أقل diff)
- **وحدة جديدة `namaweb/rbac_guards.js`** (نقيّة + قابلة للاختبار):
  - `isTenantAdmin(user)` → `user.role === 'Admin'`.
  - `makeGuards({ logAudit })` → `{ requireAuthenticated, requireTenantAdmin(opts), requireSuperAdmin(allowlist, opts) }`.
  - **مصدر هوية واحد:** يعيد استخدام `isSuperAdmin`/`parseAllowlist` من `super_admin.js` (لا تعريف مكرّر).
  - كل حارس: الهوية من الجلسة فقط؛ على الرفض → 401/403 + `logAudit` (fail-closed).
- **تركيب في server.js (سلوك محفوظ):**
  - استبدال فحوص `role !== 'Admin'` المتناثرة بـ `requireTenantAdmin({action,module})` في 3 مسارات (نفس 403 + نفس أسماء أحداث التدقيق عبر معاملات).
  - إضافة `username` للجلسة + الاستعلامين.
  - الباقي دون مساس (login/logout/MFA/requireRole/requirePermission/الدفعة 1).
- **ما لا نفعله:** لا نظام Auth جديد، لا OAuth/SAML، لا impersonation، لا تغيير `requireCatalogAccess` (residual موثّق)، لا تغيير تدفّق تسجيل الدخول.
