# تدقيق نهايات الـ API (API Endpoints Audit)

> التاريخ: 2026-06-20 | الأدلة: `server.js` (370 مساراً تحت `/api/`).
> مراجع: `GLOBAL_AUDIT_06_SECURITY_RISK_REGISTER`, تقارير Wave1/Wave2/Binding.

## 1. الإحصاء العام (دليل برمجي)
| المقياس | العدد |
| ------- | ----- |
| إجمالي مسارات `/api/` | **370** |
| تستخدم `requireTenantScope` | ~155 (يشمل المُعرّفات) — مُطبّق فعلياً على الموديولات المؤمّنة |
| `requireAuth` فقط (بلا tenantScope) | **212** |
| تستخدم `requireRole(...)` | 57 |

> ملاحظة منهجية: التدقيق الكامل لـ 370 مساراً سطراً-بسطر ضخم؛ هذا التقرير يقدّم **تصنيفاً تمثيلياً للفئات الحرجة + الأنماط** مدعوماً بأدلة، لا 370 صفاً منفصلاً.

## 2. تصنيف الفئات الحرجة

| Method/Path (عيّنة) | Module | Auth | RBAC | Tenant Isolation | Facility Entitlement | Validation | Rate Limit | Error | Tests | التصنيف | Evidence |
| ------------------- | ------ | ---- | ---- | ---------------- | -------------------- | ---------- | ---------- | ----- | ----- | ------- | -------- |
| POST /api/auth/login | auth | — | — | n/a | ❌ | جزئي | ✅ 20/15د | ✅ | ✅ smoke | Safe | server.js login |
| GET/POST/PUT /api/patients | المرضى | ✅ | ✅ role | ✅ filter+RLS | ❌ | جزئي | ❌ | ✅ | ✅ | Needs improvement (no rate-limit, facility) | leak_test |
| /api/appointments* | المواعيد | ✅ | ✅ | ✅ | ❌ | conflict/dup | ❌ | ✅ | ✅ | Safe | server.js:519+ |
| /api/visits*, /api/encounters | الزيارات | ✅ | جزئي | ✅ | ❌ | جزئي | ❌ | ✅ | ⚠️ | Needs improvement | visits |
| /api/pharmacy/* | الصيدلية | ✅ | role/scope | ✅ (FORCE RLS) | ❌ | جزئي | ❌ | ✅ | ✅ | Safe-ish | pharmacy tests |
| /api/lab/*, /api/radiology/* | مختبر/أشعة | ✅ | requireAuth | ✅ (FORCE RLS) | ❌ | جزئي | ❌ | ✅ | ✅ | Needs improvement (role granularity) | lab_radiology |
| /api/invoices/*, /api/finance/* | فوترة/محاسبة | ✅ | role(invoices/finance) | ✅ | ❌ | جزئي | ❌ | ✅ | ✅/⚠️ | Needs improvement | financial_reports |
| /api/insurance/* | تأمين | ✅ | role | ✅ | ❌ | جزئي | ❌ | ✅ | ⚠️ | Needs improvement (no EDI) | server.js:651+ |
| /api/inventory/*, /api/dept-requests | مخزون | ✅ | requireAuth | ✅ | ❌ | جزئي | ❌ | ✅ | ✅ | Needs improvement | inventory tests |
| /api/blood-bank/* | بنك الدم | ✅ | requireAuth | **❌ لا tenant_id/filter** | ❌ | جزئي | ❌ | ✅ | ❌ | **Risky** (Class A معلّق) | server.js:2488+ |
| /api/medical-records/*, /clinical-pharmacy/*, /rehab/*, /portal/*, /dietary/* | حديثة | ✅ | requireTenantScope (Wave1) | ✅ كود | ❌ | جزئي | ❌ | ✅ | ✅ modern_modules | Safe (بعد Wave1؛ RLS DDL معلّق) | server.js:4442+ |
| /api/telemedicine,pathology,social-work,mortuary,zatca | حديثة | ✅ | requireTenantScope (Wave2) | ✅ منشور | ❌ | جزئي | ❌ | ✅ | ✅ wave2 | Safe | server.js:4155+ |
| /api/settings/users* | settings | ✅ | role(settings) | جزئي | ❌ | جزئي | ❌ | ✅ | ⚠️ | Needs improvement | server.js:1422+ |
| /api/admin/*, /api/audit-trail | admin | ✅ | requireAuth (لا admin-role صارم على بعضها) | جزئي | ❌ | — | ❌ | ✅ | ⚠️ | Needs improvement | server.js admin |
| (لا) /api/tenants provisioning | SaaS | — | — | — | — | — | — | — | ❌ | **Missing** | لا مسار |

## 3. المخاطر العرضية (تنطبق على معظم المسارات)
| الخطر | المدى | الدليل | التصنيف |
| ----- | ----- | ------ | ------- |
| **لا إنفاذ facility entitlement على أي مسار** | 370/370 | لا facilityType في server.js | Risky (للـ SaaS متعدد الأنواع) |
| rate limiting على login فقط | 369 مساراً بلا حد | loginLimiter فقط | Needs improvement |
| 212 مساراً requireAuth-only | بعضها يفلتر داخلياً، وبعضها فجوة (بنك الدم) | grep | متفاوت |
| لا validation library موحّدة | معظم المسارات | فحص يدوي بـ `|| ''` | Needs improvement |
| لا idempotency keys | كل POST | — | Needs improvement (مدفوعات/فواتير) |

## 4. الخلاصة
- **Safe/Safe-ish**: الموديولات المؤمّنة (Wave1/Wave2 + المرضى/المواعيد/الصيدلية/الطوارئ/الجراحة/التنويم).
- **Risky**: بنك الدم/الموافقات/الباقات (عزل ناقص — Class A)، وكل المسارات من منظور **غياب إنفاذ facility entitlement**.
- **Missing**: مسارات provisioning للمستأجرين (SaaS).
- **توصية شاملة**: rate-limit طبقي عام، validation موحّدة، إنفاذ facility entitlement على الـ backend، idempotency للمسارات المالية.

`API_ENDPOINTS_AUDIT_COMPLETE`
