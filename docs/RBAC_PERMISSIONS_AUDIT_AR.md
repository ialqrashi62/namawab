# تدقيق الصلاحيات والأدوار (RBAC & Permissions Audit)

> التاريخ: 2026-06-20 | مرجع: [GLOBAL_AUDIT_06_SECURITY_RISK_REGISTER_AR.md](GLOBAL_AUDIT_06_SECURITY_RISK_REGISTER_AR.md).

## 1. الطبقات الموجودة
| الطبقة | الآلية |
| ------ | ------ |
| المصادقة | جلسة (Redis)، bcrypt، فرض جلسة واحدة، تتبّع IP |
| أدوار الموديول | `ROLE_PERMISSIONS` + `requireRole(...)` على المسارات الحساسة (57 إشارة) |
| عزل المستأجر | `requireTenantScope` + ختم tenant من الجلسة + RLS (`app.tenant_id`) |
| نوع المنشأة | حارس entitlement عالمي (10 أنواع، fail-closed) — جديد |
| خصم/مالية | `MAX_DISCOUNT_BY_ROLE` (حدود خصم حسب الدور) |

## 2. مصفوفة موجزة (موديول × عملية) — تمثيلية
| الموديول | View | Create | Edit | Delete | Approve | Post | الملاحظة |
| -------- | :--: | :----: | :--: | :----: | :-----: | :--: | -------- |
| المرضى | role(patients) | ✓ | ✓ | ✓ (admin) | — | — | IDOR محمي |
| الفوترة | role(invoices/accounts) | ✓ | ✓ | cancel | — | (محاسبة OFF) | — |
| المالية | role(finance) | ✓ | — | — | — | — | لا POST journal API |
| الإعدادات/المستخدمون | role(settings) | ✓ | ✓ | ✓ | — | — | — |
| المختبر/الأشعة | requireAuth | ✓ | ✓ (نتيجة) | — | جزئي | — | اعتماد مزدوج ناقص |

## 3. مصفوفة نوع المنشأة (Facility × Module) — منشورة
Full ('*') لـ medical_city/large_hospital/medium_hospital؛ مجموعات مقيّدة لـ polyclinic/PHC/specialized؛ pharmacy_only/lab_only/radiology_only محصورة بموديولاتها. التفصيل في `facility_entitlements.js` و[P1_FACILITY_ENTITLEMENT_BACKEND_DESIGN_AR.md](P1_FACILITY_ENTITLEMENT_BACKEND_DESIGN_AR.md).

## 4. مخاطر/فجوات
| الفجوة | الخطورة | ملاحظة |
| ------ | ------- | ------ |
| صلاحيات على مستوى العملية (Approve/Post/Cancel) غير granular لكل موديول | P2 | RBAC موديولي لا op-level |
| Maker-checker (فصل المهام) للعمليات المالية/السريرية الحرجة | P2 | غير موجود |
| بعض admin routes (`/api/admin/*`) تعتمد requireAuth لا دور admin صارم | P2 | يُراجع/يُشدّد |
| الاعتماد المزدوج (verify/approve) للمختبر/الأشعة | P1/P2 | جودة سريرية |

## 5. نقاط قوة
ختم tenant من الجلسة لا العميل، RLS كطبقة ثانية، entitlement fail-closed، حدود خصم بالدور، least-privilege DB user.

## القرار
`RBAC_STATUS: WARNING (أساس قوي)`. تحسينات: صلاحيات op-level، maker-checker، تشديد admin routes، اعتماد مزدوج للنتائج.

`RBAC_PERMISSIONS_AUDIT_COMPLETE`
