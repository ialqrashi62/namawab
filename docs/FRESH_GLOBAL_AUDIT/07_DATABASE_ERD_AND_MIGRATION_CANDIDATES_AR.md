# 07 — مخطط ERD ومرشّحات الهجرة (Database ERD & Migration Candidates)

> 2026-06-22 | DB حيّة: 162 جدول، 148 FORCE RLS، 149 tenant_id، 233 فهرس، 2053 عمود، 19 FK. **لا تنفيذ DDL** — مرشّحات فقط (راجع 17).

## الهدف/النطاق/المنهجية
استبطان `information_schema`/`pg_class`. تصميم العلاقات الأساسية + الجداول/الأعمدة الناقصة + قواعد العزل، كمرشّحات.

## العلاقات الجوهرية (ERD مختصر)
```
tenants 1─* user_tenants *─1 system_users ; system_users 1─* user_facilities *─1 facilities
tenants 1─* patients 1─* {medical_records, appointments, invoices, lab_radiology_orders, prescriptions, admissions, emergency_visits, surgeries, ...}
patients 1─* admissions 1─* admission_daily_rounds ; admissions *─1 beds *─1 wards
patients 1─* invoices 1─* (bنود) ; invoices *─ insurance_claims *─1 insurance_contracts *─1 insurance_companies
lab_radiology_orders 1─* lab_samples 1─* lab_results ; prescriptions 1─* emar_orders 1─* emar_administrations
finance_journal_entries 1─* finance_journal_lines *─1 finance_chart_of_accounts ; finance_* *─1 finance_cost_centers
inventory_purchases 1─* inventory_purchase_items ; pharmacy_sales 1─* pharmacy_sale_items
```
كل الجداول الحسّاسة تحمل `tenant_id` + FORCE RLS بسياسة `tenant_id = current_setting('app.tenant_id')`.

## جداول قائمة (تصنيف)
| الفئة | أمثلة | RLS |
|---|---|---|
| هوية/تينانسي | tenants, system_users, user_tenants, user_facilities, facilities | عام/junction (بالتصميم) |
| سريري PHI | patients, medical_records*, nursing_*, icu_*, emar_*, lab_*, surgeries*, emergency_* | FORCE |
| مالي | invoices, insurance_*, finance_*(9), zatca_invoices, daily_close, packages | FORCE |
| مخزون/صيدلية | inventory_*(10), pharmacy_*(9) | FORCE |
| HR | hr_*(7), employees | FORCE |
| تشغيل/جودة | maintenance_*, cssd_*, infection_*, quality_* | FORCE |
| كتالوجات (عام) | icd10_codes, medications, lab_tests_catalog, radiology_catalog, medical_services, drug_interactions, cosmetic_procedures | non-FORCE (مرجعي) |
| user-scoped | cash_drawer, internal_messages | non-FORCE |

## جداول/أعمدة ناقصة مقترحة (مرشّحات)
| المرشّح | الغرض | أعمدة رئيسية | tenant/RLS | rollback |
|---|---|---|---|---|
| fhir_resources | تخزين/تبادل FHIR | resource_type, resource_id, json, version, tenant_id | tid+FORCE | DROP TABLE |
| hl7_messages | سجل رسائل HL7 | msg_type(ADT/ORM/ORU), payload, status, tenant_id | tid+FORCE | DROP |
| integration_channels | قنوات تكامل | name, type, endpoint, status, tenant_id | tid+FORCE | DROP |
| dicom_studies | ربط PACS | study_uid, patient_id, modality, url, tenant_id | tid+FORCE | DROP |
| clinical_codes (ICD/CPT/LOINC) | تعبئة كتالوج | code_system, code, description | عام مرجعي | TRUNCATE |
| drug_interactions (تعبئة) | DDI فعّال | drug_a, drug_b, severity | عام | TRUNCATE |
| document_signatures | توقيع/قفل EMR | record_id, signer_id, signed_at, hash, tenant_id | tid+FORCE | DROP |
| mfa_secrets | MFA | user_id, secret, type | مرتبط system_users | DROP |
| notifications | مركز إشعارات | user_id, type, payload, read, tenant_id | tid+FORCE | DROP |
| retention_policies | احتفاظ بيانات | table_name, retain_days, policy | عام | DROP |
| appointment_reminders | تذكير | appointment_id, channel, status, tenant_id | tid+FORCE | DROP |
| who_surgical_checklist | OR checklist | surgery_id, phase, items_json, tenant_id | tid+FORCE | DROP |
| triage_assessments | ESI | emergency_visit_id, esi_level, vitals, tenant_id | tid+FORCE | DROP |

## فهارس مقترحة
- tenant_id على الـ89 جدولاً غير المفهرس (CONCURRENTLY) — gated، لا عائق حالي (راجع 17 candidate).
- فهارس مركّبة: (tenant_id, patient_id) على medical_records/invoices/lab_radiology_orders للأداء عند النمو.

## أعمدة تدقيق موحّدة (مقترح)
created_at/created_by/updated_at/updated_by/tenant_id على كل جدول معاملاتي (بعضها موجود؛ توحيد مقترح).

## 6-12
المتطلبات: جداول التكامل/التوقيع/MFA/الإشعارات أعلاه. الأولويات: document_signatures (P0 لقفل EMR)، fhir/hl7 (P1). المخاطر: أي DDL على إنتاج مقبول يحتاج بوابة+rehearsal+backup. توصيات: كل مرشّح بنمط الـ14-table المثبت (ADD+DEFAULT+FORCE+policy). **NO_DDL_EXECUTED**. Acceptance: ERD + موجود/ناقص/علاقات/فهارس/rollback (✅). Next: 08 API/OpenAPI.
