# P0 عزل المستأجرين — 03 تدقيق عزل المسارات والاستعلامات (Route & Query Isolation Audit)

> التاريخ: 2026-06-20 | الفحص: نص handlers الفعلي في `server.js`.

---

## 1. معايير التدقيق لكل مسار

| المعيار | المطلوب |
| ------- | ------- |
| Middleware | `requireAuth` **+ `requireTenantScope`** |
| قراءة السياق | `getRequestTenantContext(req)` لاستخراج `tenantId` |
| SELECT | شرط `tenant_id = $N` (عند وجود tenantId) |
| INSERT | ختم `tenant_id`/`facility_id` تلقائياً من السياق |
| UPDATE/DELETE | تحقق ملكية + `WHERE id=$X AND tenant_id=$Y` |
| IDOR | تحقق تبعية المريض للمستأجر قبل أي ربط |
| الإنتاج بلا سياق | `403` عبر `requireTenantScope` |

النمط المرجعي الصحيح موجود في `/api/surgeries` (server.js:2051+) ويُحتذى.

---

## 2. نتائج التدقيق للموديولات المستهدفة (الموجة 1)

| المسار | requireTenantScope | فلتر SELECT | ختم INSERT | تحقق UPDATE/DELETE | الحكم |
| ------ | :----------------: | :---------: | :--------: | :-----------------: | ----- |
| GET /api/medical-records/files | ❌ | ❌ | — | — | فجوة |
| GET /api/medical-records/requests | ❌ | ❌ | — | — | فجوة |
| POST /api/medical-records/requests | ❌ | — | ❌ | — | فجوة |
| PUT /api/medical-records/requests/:id | ❌ | — | — | ❌ (id فقط) | فجوة |
| GET /api/medical-records/coding | ❌ | ❌ | — | — | فجوة |
| POST /api/medical-records/coding | ❌ | — | ❌ | — | فجوة |
| GET/POST/PUT /api/clinical-pharmacy/reviews | ❌ | ❌ | ❌ | ❌ | فجوة |
| GET/POST /api/clinical-pharmacy/education | ❌ | ❌ | ❌ | — | فجوة |
| GET/POST /api/rehab/patients | ❌ | ❌ | ❌ | — | فجوة |
| GET/POST /api/rehab/sessions | ❌ | ❌ (patient_id فقط) | ❌ | — | فجوة |
| GET/POST/PUT /api/rehab/goals | ❌ | ❌ | ❌ | ❌ | فجوة |
| GET/POST /api/portal/users | ❌ | ❌ | ❌ | — | فجوة |
| GET/PUT /api/portal/appointments | ❌ | ❌ | — | ❌ | فجوة (Class B) |
| GET/POST/PUT /api/dietary/orders | ❌ | ❌ | ❌ | ❌ | فجوة |
| POST/PUT /api/dietary/meals | ❌ | — | ❌ | ❌ | فجوة |
| GET/POST /api/nutrition/assessments | ❌ | ❌ | ❌ | — | فجوة |

> **ملاحظة `clinical-pharmacy/interactions`**: تقرأ `drug_interactions` (بيانات مرجعية عالمية مشتركة) — **لا تحتاج عزلاً** (KEEP).

---

## 3. ملاحظات IDOR

- جميع مسارات الموجة 1 التي تقبل `patient_id` (POST) **لا تتحقق** من تبعية المريض للمستأجر → ثغرة IDOR محتملة عند تعدد المستأجرين.
- الإصلاح: إضافة فحص `SELECT id FROM patients WHERE id=$1 AND tenant_id=$2` قبل الإدراج (نمط surgeries).

---

## 4. القرار

كل مسارات الموجة 1 (~28 مساراً) **تفتقر للعزل على مستوى الـ middleware والاستعلام**. الإصلاح في Gate 6 يطبّق النمط المرجعي بالكامل: `requireTenantScope` + فلتر + ختم + تحقق ملكية + IDOR.

`ROUTE_QUERY_ISOLATION_AUDIT_COMPLETE`
