# HOS_PRO_08_DATA_API_INTEGRATION_AR

## الغرض
تخطيط قاعدة البيانات وAPIs والتكاملات بدون تنفيذ DDL أو Migration إلا بتصريح صريح.

## لكل قسم حدد
- الجداول المقترحة.
- أهم الحقول.
- العلاقات.
- الفهارس.
- القيود.
- tenant_id إذا النظام SaaS.
- created_by.
- updated_by.
- deleted_at عند soft delete.
- audit fields.
- status lifecycle.
- ownership model.

## API Pattern
لكل مورد:
- GET list.
- GET detail.
- POST create.
- PATCH update.
- POST approve.
- POST cancel.
- POST close.
- POST print.
- POST export.
- GET audit.
- GET references.

## Validation
حدد:
- Required fields.
- Business rules.
- Clinical rules.
- Financial rules.
- Permission checks.
- Tenant checks.
- Status transition checks.
- Duplicate checks.
- Idempotency عند الحاجة.

## تكاملات أساسية
- EMR/EHR.
- LIS.
- RIS/PACS.
- Pharmacy/MAR/eMAR.
- Billing.
- Insurance/NPHIES.
- Inventory.
- HR.
- Patient Portal.
- Telemedicine.
- Messaging.
- Audit Log.
- FHIR/HL7 عند الحاجة.
- ZATCA عند الفوترة السعودية.

## ربط FHIR مفاهيمي
استخدم عند الحاجة:
Patient, Practitioner, Encounter, Appointment, Location, Organization, ServiceRequest, Observation, DiagnosticReport, ImagingStudy, MedicationRequest, MedicationAdministration, Procedure, Condition, AllergyIntolerance, CarePlan, Coverage, Claim, Invoice, Consent, DocumentReference, AuditEvent.

## ملف التقرير
احفظ في:
.ai-brain/hospital-data-api-integration-ar.md
