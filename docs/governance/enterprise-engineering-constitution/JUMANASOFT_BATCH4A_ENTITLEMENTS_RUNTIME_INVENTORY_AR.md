# الدفعة 4A — جرد نقاط الإنفاذ وقت التشغيل (GATE 2)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-entitlements-runtime` (من root `6927d89` / submodule `de3b762`).
**النطاق:** قراءة فقط — لا تعديل.

## 1) نقاط الإنشاء/الوصول المرشّحة للاستحقاقات (مستقبلاً)
| الاستحقاق | نقطة/نقاط الإنفاذ | الخطورة | عدّاد الاستخدام المتاح |
|---|---|---|---|
| `max_users` | `POST /api/settings/users` ([server.js:3490](../../../namaweb/server.js#L3490)) — نقطة **واحدة** نظيفة. | منخفضة | `COUNT(*) FROM user_tenants WHERE tenant_id=? AND is_active=true` (تستخدمه super_admin بالفعل). |
| `max_branches` | إنشاء الفروع/المنشآت يتم داخل **معاملة onboarding** ([onboarding.js](../../../namaweb/onboarding.js)) — **لا route مستقل** لإنشاء فرع. | منخفضة | `COUNT(*) FROM branches b JOIN facilities f ON b.facility_id=f.id WHERE f.tenant_id=?` أو عدّ `facilities`. |
| `max_invoices_per_month` | **~13 موضع** `INSERT INTO invoices` موزّعة (POST /api/invoices، /generate، ومضمَّنة في تدفّقات المرضى/الطلبات/المختبر/الأشعة — أسطر 1002,1138,1255,1940,2230,2699,3686,3844,6169,10436,10718,12339). | **عالية (واسعة الانتشار)** | `COUNT(*) FROM invoices WHERE tenant_id=? AND created_at >= date_trunc('month', now())`. |
| `modules_enabled` | بوّابة الوحدات الحالية = `requireRole(...)` ([server.js:352](../../../namaweb/server.js#L352)) + `requirePermission` (مصفوفة `role_permissions`). **مرتبطة بالدور، لا بالخطة.** | متوسطة | لا عدّاد (gating منطقي). |
| `api_access` | **لا مسار كود حالي** لوصول API خارجي مُمَيَّز. | — | — |
| `custom_domain` | **لا مسار كود حالي** (النطاق الفرعي عبر `tenants.subdomain`؛ لا نطاق مخصّص). | — | — |
| `support_level` | وصفي فقط — لا إنفاذ تقني. | — | — |

## 2) بوّابات الـ module الحالية (لا علاقة لها بالخطة بعد)
- `requireRole(...modules)` يتقاطع مع `ROLE_PERMISSIONS[role]` (Admin='*').
- `requirePermission` يقرأ `role_permissions` من DB مع fallback للقديم.
- **كلاهما يعتمد الدور وليس خطة المستأجر** — ربط الوحدات بالخطة سيكون طبقة إضافية مستقبلاً (ليس في 4A).

## 3) ملاحظات الخطورة (تحدّد نطاق الربط في 4A)
- **الفواتير = أعلى خطورة**: ~13 نقطة إدخال؛ إنفاذ حدّ شهري هنا يتطلّب لمس مسارات مال حسّاسة → **مؤجّل** (ليس في 4A، ولا حتى observe على نقاط المال في هذه الدفعة).
- **المستخدمون = أنظف نقطة**: route واحد — مرشّح طبيعي **لاحقاً** (4A: observe فقط عبر عرض القيمة المحسوبة، بلا ربط بنقطة الإنشاء).
- **e25 غير موفّر**: أي resolver يجب أن يعمل بأمان عند **غياب جداول** `plans`/`plan_entitlements`/`tenant_plan_assignments` (سلوك افتراضي موثّق، لا crash).

## 4) الخلاصة (تغذّي التصميم)
- 4A = **resolver + حراس قابلة للتفعيل** + ربط **observe-only منخفض المخاطر** (عرض الاستحقاقات المحسوبة في Super Admin) — **بلا إنفاذ فعلي على أي نقطة إنشاء**، **بلا DDL**، آمن عند غياب e25 (fail-open موثّق).
- الإنفاذ الفعلي (users ثم لاحقاً invoices) = دفعات تالية خلف flags، بعد توفير e25 على staging واختباره.
