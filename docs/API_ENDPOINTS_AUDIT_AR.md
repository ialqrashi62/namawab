# تدقيق نهايات الـ API (API Endpoints Audit)

> التاريخ: 2026-06-20 | الكود ef1acf9. مرجع: [MEDICAL_API_ENDPOINTS_AUDIT_AR.md](MEDICAL_API_ENDPOINTS_AUDIT_AR.md). هذا تحديث + الجديد.

## 1. الإحصاء الراهن (دليل)
| المقياس | العدد |
| ------- | ----- |
| مسارات `/api/` | **370** |
| إشارات `requireTenantScope` | 156 |
| إشارات rate limiter | 9 (login + **opt-in `/api` limiter جديد**) |
| حارس SESSION_SECRET | مُفعّل |
| حارس facility entitlement | عالمي على كل `/api/` |

## 2. طبقات الحماية لكل مسار (الحالة الراهنة)
1. **rate limit**: login دائماً؛ `/api` العام **اختياري** (opt-in عبر متغيّر بيئة) — تحسّن عن «login فقط» سابقاً.
2. **facility entitlement guard** (عالمي): يحجب الموديولات غير المستحقة (403/422) قبل المسار.
3. **requireAuth** [+ requireRole/requireTenantScope].
4. **tenant binding**: pool.query يضبط `app.tenant_id` → RLS.

## 3. تصنيف تمثيلي (الفئات الحرجة)
| المسارات | التصنيف | ملاحظة |
| -------- | ------- | ------ |
| auth/login | Safe | rate-limited؛ SESSION_SECRET guard |
| patients/appointments/visits | Safe-ish | role + tenant filter + RLS؛ entitlement؛ (idempotency للـ POST تحسين) |
| pharmacy/lab/radiology | Safe-ish | FORCE RLS لبعضها + entitlement |
| invoices/finance | Needs improvement | يعمل؛ idempotency للمدفوعات؛ المحاسبة OFF |
| insurance | Needs improvement | سجلات فقط (لا EDI) |
| blood-bank/approvals/packages | **Risky** | عزل ناقص (Class A، لا RLS/tenant_id) |
| inventory/dept-requests | Needs improvement | يعمل؛ 3-way match ناقص |
| settings/admin | Needs improvement | role(settings)؛ بعض admin routes تحتاج تدقيق دور أصرم |
| (لا) /api/tenants provisioning | Missing | لا SaaS provisioning |

## 4. مخاطر عرضية (محدّثة)
- **idempotency**: غائب لمعظم POST (مدفوعات/فواتير) → خطر تكرار.
- **validation**: يدوية (`|| ''`) بلا مكتبة موحّدة.
- **CORS**: يُراجع (كان `origin:true` — يُتحقق من الحالة الراهنة).
- **rate limit `/api`**: متاح لكنه opt-in → يُوصى بتفعيله افتراضياً للمسارات الحساسة.

## 5. القرار
`API_STATUS: WARNING (محسّن)`. التحسّن: entitlement عالمي + SESSION_SECRET guard + opt-in limiter. المتبقي: idempotency، validation موحّدة، عزل blood-bank/approvals، تفعيل limiter العام، provisioning.

`API_ENDPOINTS_AUDIT_COMPLETE`
