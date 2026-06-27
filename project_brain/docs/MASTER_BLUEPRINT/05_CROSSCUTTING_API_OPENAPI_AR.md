# 05 — منهج API + مواصفات OpenAPI تمثيلية

> الواجهة الحالية REST على Express (`/api/...`). هذا الملف: مبادئ التصميم + اتفاقيات + مواصفة OpenAPI 3.1 تمثيلية لمسارات نواة (يُعمّم النمط على الـ43 وحدة) + طبقة FHIR R4 للتبادل.

## 1) مبادئ ومعايير
- **REST + JSON**، مسارات بصيغة `/api/<domain>/<resource>`، أفعال HTTP صحيحة (GET/POST/PUT/PATCH/DELETE).
- **المصادقة:** session cookie (httpOnly+secure+sameSite=lax) — قائم. كل المسارات المحمية خلف `requireAuth` + `requireTenantScope` (RLS).
- **الترقيم/الفلترة:** `?page`, `?limit`, `?q`, `?status`, `?from/to` موحّدة.
- **الأخطاء:** `{ "error": "message" }` + رمز HTTP صحيح (400/401/403/404/409/422/429/500) — بلا stack trace (قائم).
- **التدقيق:** كل POST/PUT/DELETE حسّاس → `audit_log`.
- **التحقّق:** schema validation للمدخلات (طول/نوع/نطاق) + escape عند الإخراج.
- **CORS/CSRF/CSP:** allowlist + Origin-check + CSP Report-Only (قائم من Gate 3).
- **النسخ:** prefix `/api/v1/` موصى لإصدارات مستقبلية (الحالي بلا v — ترقية).
- **FHIR R4:** طبقة تبادل `/fhir/R4/<Resource>` (Patient/Encounter/Observation/MedicationRequest/DiagnosticReport) للتشغيل البيني (NPHIES/تكامل).

## 2) اتفاقيات الأمان لكل مسار (تنطبق على الكل)
| الجانب | القاعدة |
|---|---|
| العزل | `tenant_id` يُحقَن من الجلسة (لا من العميل) + RLS |
| الصلاحية | `requireRole`/`requirePermission` لكل إجراء حسّاس |
| الإدخال | تحقّق + حدود حجم (json limit) |
| الإخراج | لا أسرار/PHI زائدة؛ حقول حسب الصلاحية |
| المعدّل | rate-limit على login + endpoints حسّاسة |

## 3) مواصفة OpenAPI 3.1 تمثيلية (نواة)
```yaml
openapi: 3.1.0
info: { title: NamaMedical HIS API, version: 1.0.0 }
servers: [{ url: https://{host}/api }]
components:
  securitySchemes:
    sessionCookie: { type: apiKey, in: cookie, name: connect.sid }
  schemas:
    Error: { type: object, properties: { error: { type: string } } }
    Patient:
      type: object
      required: [name_ar]
      properties:
        id: { type: integer, readOnly: true }
        mrn: { type: string, readOnly: true }
        name_ar: { type: string }
        name_en: { type: string }
        national_id: { type: string }
        dob: { type: string, format: date }
        gender: { type: string, enum: [male, female] }
        phone: { type: string }
        allergies: { type: string }
    Order:
      type: object
      required: [type, items]
      properties:
        id: { type: integer, readOnly: true }
        encounter_id: { type: integer }
        type: { type: string, enum: [lab, rad, med, consult] }
        status: { type: string, enum: [draft, signed, in_process, completed], readOnly: true }
        items: { type: array, items: { type: object } }
security: [{ sessionCookie: [] }]
paths:
  /patients:
    get:
      summary: List/search patients (tenant-scoped)
      parameters:
        - { name: q, in: query, schema: { type: string } }
        - { name: page, in: query, schema: { type: integer, default: 1 } }
      responses:
        '200': { description: OK, content: { application/json: { schema: { type: array, items: { $ref: '#/components/schemas/Patient' } } } } }
        '401': { description: Unauthorized, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
    post:
      summary: Register patient (EMPI dedupe on national_id+name+phone)
      requestBody: { required: true, content: { application/json: { schema: { $ref: '#/components/schemas/Patient' } } } }
      responses:
        '201': { description: Created }
        '409': { description: Possible duplicate (EMPI), content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
  /orders:
    post:
      summary: Create CPOE order (runs CDS checks)
      requestBody: { required: true, content: { application/json: { schema: { $ref: '#/components/schemas/Order' } } } }
      responses:
        '201': { description: Created }
        '422': { description: CDS hard-stop (interaction/allergy), content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
  /admin/facilities/provision:
    post:
      summary: Provision new facility/tenant (super-admin only — Onboarding Wizard)
      responses:
        '201': { description: Tenant created }
        '403': { description: Super-admin only }
```

## 4) خريطة المسارات حسب القسم (نمط متكرّر)
> لكل قسم: `GET /api/<x>` (قائمة)، `POST /api/<x>` (إنشاء)، `PUT/PATCH /api/<x>/:id` (تحديث/حالة)، إجراءات خاصة `POST /api/<x>/:id/<action>`.
- Lab: `/api/lab/orders`, `/api/lab/samples`, `/api/lab/results`, `/api/lab/hl7`(inbound), `/api/print/lab-report/:id`.
- Rad: `/api/rad/orders`, `/api/rad/reports`, `/api/phi-files/:id`(صور، محمي قائم).
- Pharmacy: `/api/pharmacy/queue`, `/api/pharmacy/dispense`, `/api/prescriptions`.
- Nursing: `/api/nursing/assessment`, `/api/nursing/mar`, `/api/vitals`.
- ER/ADT: `/api/er/triage`, `/api/er/board`, `/api/adt/admit`, `/api/adt/census`.
- Finance/Insurance/ZATCA: `/api/invoices`, `/api/claims`(NPHIES gated), `/api/zatca/invoice/:id`(gated).
- Admin: `/api/admin/facilities/provision`, `/api/admin/audit-trail`(Admin 403 guard قائم), `/api/csp-report`(قائم).

## 5) FHIR R4 (طبقة التبادل)
| FHIR Resource | المصدر الداخلي |
|---|---|
| Patient | `patients` |
| Encounter | `encounters`/`visits` |
| Observation | `vitals`/`lab_results` (LOINC) |
| Condition | `problems` (ICD/SNOMED) |
| MedicationRequest | `prescriptions` |
| DiagnosticReport | `lab_results`/`rad_reports` |
| Coverage/Claim | `claims` (NPHIES) |
> تُستخدم لتكامل NPHIES والأنظمة الخارجية؛ كتابة عبر `transaction` Bundle + read-back (نمط مُثبت سابقاً في sandbox HAPI). لا PHI حقيقي في التكامل قبل بوابة مخصّصة.

## 6) ما لم يُنفَّذ
هذا تصميم API؛ الـendpoints الجديدة (CPOE/LIS/RIS/NPHIES…) تُبنى ضمن بوابات تطوير لكل قسم، مع الحفاظ على `requireAuth`+`requireTenantScope`+RLS+audit القائمة. لا تغيير كود في هذه الحزمة التوثيقية.
