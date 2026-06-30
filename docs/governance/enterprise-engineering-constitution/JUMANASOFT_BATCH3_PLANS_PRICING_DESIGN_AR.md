# الدفعة 3 — تصميم الخطط والأسعار والاستحقاقات (GATE 3)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-plans-pricing`.
**المبدأ:** أقل بنية ممكنة، additive، soft-disable، تحقّق على الخادم، الإدارة لـ Super Admin فقط، لا دفع فعلي.

## 1) المخطط (3 جداول جديدة — candidate، غير مُشغَّل على production)
### `plans` (هوية + تسعير)
| العمود | النوع | قيود |
|---|---|---|
| `id` | SERIAL PK | |
| `plan_key` | VARCHAR(50) UNIQUE NOT NULL | `^[a-z0-9_]{2,40}$`؛ **ثابت بعد الإنشاء** (لا تعديل). |
| `name_ar` / `name_en` | VARCHAR(120) NOT NULL | غير فارغ. |
| `description_ar` / `description_en` | TEXT DEFAULT '' | |
| `currency` | CHAR(3) NOT NULL | ضمن قائمة: `SAR,USD,AED,EGP,KWD,BHD,QAR,OMR,JOD`. |
| `monthly_price` | NUMERIC(12,2) NOT NULL DEFAULT 0 | `>= 0` (CHECK). pg يُرجِع NUMERIC كنصّ → parseFloat. |
| `yearly_price` | NUMERIC(12,2) NOT NULL DEFAULT 0 | `>= 0` (CHECK). |
| `trial_days` | INTEGER NOT NULL DEFAULT 0 | `0..365`. |
| `active` | BOOLEAN NOT NULL DEFAULT true | **soft disable** (لا hard delete). |
| `sort_order` | INTEGER NOT NULL DEFAULT 0 | |
| `created_at` / `updated_at` | TIMESTAMP DEFAULT now() | |

### `plan_entitlements` (حدود الميزات — 1:1 مع الخطة)
| العمود | النوع | دلالة |
|---|---|---|
| `plan_id` | INTEGER PK REFERENCES plans(id) | |
| `max_users` | INTEGER NULL | `NULL` = غير محدود؛ وإلا `>= 0`. |
| `max_branches` | INTEGER NULL | كذلك. |
| `max_invoices_per_month` | INTEGER NULL | كذلك. |
| `modules_enabled` | TEXT NOT NULL DEFAULT '' | قائمة مفصولة بفواصل من **قائمة وحدات معروفة فقط** (allowlist). |
| `support_level` | VARCHAR(20) NOT NULL DEFAULT 'standard' | ضمن `basic,standard,priority,enterprise`. |
| `api_access` | BOOLEAN NOT NULL DEFAULT false | |
| `custom_domain` | BOOLEAN NOT NULL DEFAULT false | |

### `tenant_plan_assignments` (ربط مستأجر بخطة — سجلّ تاريخي)
| العمود | النوع | دلالة |
|---|---|---|
| `id` | SERIAL PK | |
| `tenant_id` | INTEGER NOT NULL REFERENCES tenants(id) | |
| `plan_key` | VARCHAR(50) NOT NULL REFERENCES plans(plan_key) | |
| `assignment_source` | VARCHAR(20) NOT NULL DEFAULT 'manual' | `manual,trial,migration`. |
| `assigned_by` | INTEGER NULL | id الـ Super Admin (من الجلسة). |
| `assigned_at` | TIMESTAMP DEFAULT now() | |
| `effective_from` | TIMESTAMP DEFAULT now() | |
| `effective_to` | TIMESTAMP NULL | اختياري (NULL = ساري). |

> **الخطة الحالية للمستأجر** = أحدث صف بـ `effective_to IS NULL` (أو الأعلى `assigned_at`). لا تحديث-بالمكان؛ كل تغيير صفّ جديد (سجلّ تدقيقي طبيعي). `tenants.plan_type` لا يُلمَس (توافق خلفي؛ يمكن مزامنته عرضاً لاحقاً).

## 2) قواعد التحقّق (على الخادم — نواة نقيّة قابلة للاختبار)
- سعر سالب → رفض (400). `currency` خارج القائمة → رفض. `plan_key` بصيغة غير صالحة → رفض.
- خطة بلا `currency` أو بلا `name` → رفض.
- `modules_enabled` يحوي وحدة **غير معروفة** → رفض (allowlist من وحدات النظام).
- `support_level` خارج القائمة → رفض. الحدود سالبة → رفض (NULL مسموح = غير محدود).
- **`plan_key` غير قابل للتعديل** بعد الإنشاء (التحديث يتجاهله/يرفض تغييره).
- **soft disable فقط** (`active=false`) — لا DELETE.
- **تعيين خطة disabled مرفوض** (إلا إن كان `assignment_source='migration'` صراحةً — غير مُفعّل هنا) → الافتراض: لا تُعيَّن خطة غير نشطة.
- تعيين لمستأجر غير موجود → 404؛ تعيين `plan_key` غير موجود → 404.

## 3) مصفوفة الصلاحيات (Endpoints)
| Endpoint | الحارس |
|---|---|
| `GET /api/super-admin/plans` (كل الخطط) | `requireSuperAdmin` |
| `POST /api/super-admin/plans` (إنشاء) | `requireSuperAdmin` |
| `PUT /api/super-admin/plans/:key` (تعديل، عدا plan_key) | `requireSuperAdmin` |
| `POST /api/super-admin/plans/:key/disable` (soft) | `requireSuperAdmin` |
| `POST /api/super-admin/plans/:key/enable` | `requireSuperAdmin` |
| `GET /api/super-admin/tenants/:id/plan` (خطة المستأجر) | `requireSuperAdmin` |
| `POST /api/super-admin/tenants/:id/plan` (تعيين) | `requireSuperAdmin` |
| `GET /api/public/plans` (نشطة فقط، حقول عامة) | **عام** (بلا أسرار/خطط معطّلة/حدود داخلية حسّاسة) |

- **منع التصعيد:** كل مسارات الإدارة خلف `requireSuperAdmin` (الدفعة 2) — **أدمن المستأجر لا يدير الكتالوج ولا يغيّر خطته**. الهوية من الجلسة فقط.
- القراءة العامة تُرجع: `plan_key,name_ar,name_en,description,currency,monthly_price,yearly_price,trial_days` + استحقاقات عرضية آمنة (modules/limits كعرض تسويقي) — **بلا** حقول إدارية أو خطط `active=false`.

## 4) التدقيق (Audit)
- `PLAN_CREATE` / `PLAN_UPDATE` / `PLAN_DISABLE` / `PLAN_ENABLE` / `TENANT_PLAN_ASSIGN` — مع الفاعل/الـ IP/المفتاح (بلا أسرار).
- رفض وصول غير مصرّح → `SUPER_ADMIN_DENY` (من الحارس الموحّد).

## 5) المعمارية (أقل diff)
- **وحدة جديدة `namaweb/plans.js`:** نواة نقيّة (`KNOWN_MODULES`, `ALLOWED_CURRENCIES`, `validatePlanInput`, `validateEntitlements`, `canAssignPlan`, `deriveCurrentPlan`, `publicPlanView`) + `makePlansRouter(deps)`.
- **تركيب في server.js:** ضمن كتلة `SUPER_ADMIN_ENABLED` نفسها، `app.use('/api/super-admin', ... makePlansRouter(...))` (نفس الحارس الخارجي). القراءة العامة `GET /api/public/plans` تُركَّب دائماً لكنها تقرأ الكتالوج فقط (تعيد [] إن لم تُنشأ الجداول — fail-safe).
- **UI:** تبويب «الخطط والأسعار» في صفحة Super Admin + ربط خطة من تفاصيل المستأجر. CSP-friendly، مُهرَّب، RTL.
- **migration candidate** `e25_plans_pricing_*` (up/down/validate) — **لا يُشغَّل على production**.

## 6) خارج النطاق (مؤكَّد)
لا Stripe/Moyasar/HyperPay، لا checkout، لا webhook، لا capture، لا فواتير اشتراك فعلية، لا dunning، لا cron، لا auto-upgrade، لا نشر إنتاجي، لا hard delete.
