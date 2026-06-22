# 08 — مواصفات الـAPI (OpenAPI)

> 2026-06-22 | 377 مسار حالي + مقترحات ناقصة. ملف مرشّح: `openapi_candidate.yaml`. لا تنفيذ.

## الهدف/النطاق/المنهجية
توصيف الأنماط الحالية (auth/role/tenant/errors) + endpoints ناقصة. استُخرجت المسارات من server.js (193 GET/121 POST/55 PUT/8 DELETE).

## أنماط عامة (تنطبق على كل المسارات)
- **Auth**: session cookie (httpOnly/sameSite/secure)؛ 366/377 خلف requireAuth؛ 401 بلا جلسة.
- **Roles**: requireRole(...) على 61 مسار؛ 403 عند نقص الصلاحية. ROLE_PERMISSIONS['Admin']='*'.
- **Tenant**: app.tenant_id من الجلسة (ALS)؛ RLS يفرض العزل؛ **لا ثقة بـtenant من body/query**.
- **Errors**: 200/201 نجاح، 400 تحقّق، 401 auth، 403 RBAC، 404 غير موجود، 429 rate-limit، 500 خطأ.
- **Rate limit**: loginLimiter على auth (مقترح توسيعه per-route).
- **Audit**: logAudit على الأحداث الحسّاسة (يُوصى توحيده لكل mutation).

## مجموعات المسارات الحالية (عيّنة تمثيلية)
| المجموعة | عدد | أمثلة | auth | role | tenant |
|---|---|---|---|---|---|
| auth | 4 | POST /api/auth/login, /logout, GET /me | عام | - | session |
| patients | 10 | GET/POST/PUT /api/patients(/:id) | ✅ | Reception | RLS |
| appointments | 8 | GET/POST/PUT /api/appointments | ✅ | Reception | RLS |
| medical | 7 | GET/POST /api/medical/records | ✅ | Doctor | RLS |
| lab | 10 | POST /api/lab/orders, PUT results | ✅ | Lab | RLS |
| radiology | 7 | /api/radiology/* | ✅ | Radiologist | RLS |
| pharmacy | 15 | /api/pharmacy/* | ✅ | Pharmacist | RLS+TenantScope |
| invoices | 7 | POST /api/invoices, /:id/refund | ✅ | Finance | RLS |
| insurance | 6 | /api/insurance/* | ✅ | Finance | RLS |
| finance | 7 | /api/finance/* (posting OFF) | ✅ | Finance | RLS |
| hr | 5 | /api/hr/* | ✅ | HR | RLS |
| employees | 3 | GET(open)/POST/DELETE(hr) | ✅ | HR(POST/DEL) | RLS |
| settings | 6 | /api/settings/users (Admin guards) | ✅ | Admin | RBAC |
| inventory | 7 | /api/inventory/* | ✅ | IT | RLS |
| surgeries/icu/nursing/emergency/admissions/... | 60+ | (سريرية) | ✅ | role | RLS |

## endpoints ناقصة مقترحة
| Method | Path | الغرض | auth | roles | tenant | error | audit | rate |
|---|---|---|---|---|---|---|---|---|
| POST | /api/auth/mfa/verify | تحقّق MFA | عام | - | - | 401 | login | صارم |
| POST | /api/medical-records/:id/sign | توقيع/قفل سجل | ✅ | Doctor | RLS | 403/409 | sign | عادي |
| GET | /api/insurance/eligibility/:policy | أهلية NPHIES | ✅ | Finance | RLS | 502 | eligibility | عادي |
| POST | /api/integration/fhir/:resource | FHIR upsert | ✅ | IT | RLS | 400 | fhir | عادي |
| POST | /api/integration/hl7 | استقبال HL7 | system | - | tenant-routed | 400 | hl7 | عالٍ |
| GET | /api/audit/search | قارئ تدقيق (gated) | ✅ | super-admin | cross-tenant | 403 | read | عادي |
| POST | /api/finance/post | ترحيل محاسبي (gated) | ✅ | Finance | RLS | 409 | post | عادي |
| GET | /api/pacs/study/:uid | ربط DICOM | ✅ | Radiologist | RLS | 404 | view | عادي |
| POST | /api/emar/scan | BCMA باركود | ✅ | Nurse | RLS | 409 | administer | عادي |
| POST | /api/notifications | مركز إشعارات | ✅ | الكل | RLS | 400 | notify | عادي |

## 6-12
المتطلبات: نشر OpenAPI كامل مولّد من المسارات؛ توحيد أكواد الأخطاء/الـschemas. الأولويات: sign(P0)، mfa/eligibility/fhir/hl7(P1). المخاطر: غياب توصيف معياري يعيق التكامل. توصيات: توليد OpenAPI آلياً + عقود schema. Acceptance: حالي+ناقص+openapi_candidate.yaml (✅). Next: 09 User Stories.
