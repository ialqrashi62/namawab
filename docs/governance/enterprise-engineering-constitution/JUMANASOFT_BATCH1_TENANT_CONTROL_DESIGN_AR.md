# الدفعة 1 — تصميم Tenant Control Center (GATE 3)

**التاريخ:** 2026-06-30 · المبدأ: **أقل diff ممكن**، additive، مبوّب بعلم، بلا DDL إنتاجي، يحترم RLS.

## 1) النطاق (هذه الدفعة)
داخل النطاق: قائمة المستأجرين · تفاصيل مستأجر · حالة (active/suspended/trial/cancelled) · الخطة الحالية · عدد المستخدمين · آخر نشاط · إجراءات آمنة (تعليق/إعادة تفعيل/فتح التفاصيل) · Audit لكل إجراء.
**خارج النطاق (صراحةً):** لا مدفوعات فعلية · لا حذف مستأجر · لا impersonation (تصميم مؤجّل فقط، لا تنفيذ).

## 2) هوية Super Admin (no-DDL)
- قائمة بيئية `SUPER_ADMIN_USERS` (أسماء مستخدمين مفصولة بفواصل) = منح منصّة صريح.
- دالة نقيّة `isSuperAdmin(user, allowlist)`: true فقط إذا `user.username ∈ allowlist` و `user.is_active`. أدمن المستأجر (`role='Admin'`) **لا** يكفي → يمنع التصعيد.
- كل مسارات Super Admin خلف `requireSuperAdmin` middleware (403 + audit عند الرفض).
- المنصّة مبوّبة بعلم `SUPER_ADMIN_ENABLED` (افتراضياً off = خامل، zero behavior change).

## 3) الواجهة الخلفية (API) — أقل سطح
| المسار | الوصف | RLS |
|---|---|---|
| `GET /api/super-admin/tenants` | قائمة (id/name/subdomain/status/plan_type/created_at) + بحث/فلترة بالحالة والخطة | يقرأ `tenants` (بلا RLS) |
| `GET /api/super-admin/tenants/:id` | تفاصيل: نواة + عدد المستخدمين + عدد المنشآت + آخر نشاط | يربط `app.tenant_id=:id` ثم يقرأ user_tenants/facilities/audit (يحترم RLS) |
| `POST /api/super-admin/tenants/:id/suspend` | status→suspended + audit | UPDATE tenants (بلا RLS) |
| `POST /api/super-admin/tenants/:id/reactivate` | status→active + audit | UPDATE tenants |
- كل تغيير حالة: `logAudit(actor, 'TENANT_SUSPEND'|'TENANT_REACTIVATE', 'SuperAdmin', detail, ip)`.
- لا حذف، لا تعديل بيانات المستأجر الداخلية، لا وصول PHI.

## 4) المنطق النقيّ (قابل للاختبار بلا DB)
- `isSuperAdmin(user, allowlist)`
- `ALLOWED_STATUSES = ['active','suspended','trial','cancelled']` + `canTransition(from, to)` (مثلاً active→suspended، suspended→active؛ امنع cancelled→active بلا تأكيد).
- `deriveTenantSummary(row, stats)` → كائن عرض موحّد (status badge، plan، counts، lastActivity).
- `parseTenantFilters(query)` → {status?, plan?, q?} مُتحقَّقة (enum + طول).

## 5) الواجهة (UI)
- صفحة `public/super-admin/index.html` (RTL، تصميم جمانة سوفت): جدول مستأجرين + فلاتر (حالة/خطة) + بحث + badges حالة + أزرار آمنة (تعليق/تفعيل) مع **confirmation** + صفحة/لوحة تفاصيل + حالات empty/loading/error.
- لا تكسر الصفحات الحالية (ملف جديد منفصل تحت `/super-admin`، noindex).

## 6) الأمان (بوابات [[jumanasoft-security-audit]])
- Super Admin فقط (env allowlist) + fail-closed. لا tenant breakout (التفاصيل تربط سياق المستأجر المحدّد فقط). لا طباعة أسرار. validation على المدخلات (id عدد، status enum). تهريب المخرجات في الواجهة.

## 7) قرار البوابة (GATE 3)
- ✅ **PASS** — تصميم بأقل diff، يغطّي المتطلّبات، يستثني (مدفوعات/حذف/impersonation)، بلا DDL، يحترم RLS. ننتقل إلى GATE 4.
