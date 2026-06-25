# 04 — نموذج البيانات / مخطط العلاقات (ERD)

> الكيانات الأساسية عبر الـ43 وحدة. **كل كيان حسّاس يحمل `tenant_id` (FK→tenants) + RLS** (السياسة قائمة: 150 FORCE policy) + أعمدة تدقيق (`created_by`, `created_at`, `updated_at`). الترميز: PK = مفتاح أساسي، FK = أجنبي.

## 1) النواة التنظيمية / الهوية
```
tenants (PK id, name_ar, name_en, archetype, moh_license, cr_no, vat_no, status, created_by, created_at)
  └─1:N─ facilities (PK id, FK tenant_id, type, beds, currency, timezone, FK parent_facility_id→facilities)
  └─1:N─ facility_modules (PK id, FK tenant_id, module_index, enabled)
  └─1:N─ system_users (PK id, FK tenant_id, username, display_name, bcrypt_pw, FK role_id, mfa_secret[enc], last_ip, is_active)
  └─1:N─ roles (PK id, FK tenant_id, name, is_system) ─N:M─ permissions (via role_permissions)
  └─1:N─ integration_settings (PK id, FK tenant_id, provider, status, config_json[no-secrets], gated)
  └─1:N─ audit_log (PK id, FK tenant_id, actor_user_id, action, entity, entity_id, meta_json, ip, at)
```

## 2) المريض والزيارة (محور كل شيء)
```
patients (PK id, FK tenant_id, mrn UNIQUE-per-tenant, name_ar, name_en, national_id, dob, gender,
          phone, address, blood_type, allergies, chronic_diseases, insurance_company, insurance_class)
  └─1:N─ visits (PK id, FK tenant_id, FK patient_id, type[OPD/ER/IP], FK facility_id, status, opened_at, closed_at)
        └─1:N─ encounters (PK id, FK visit_id, FK doctor_id, FK department_id, started_at, signed_at)
              ├─1:N─ problems (PK id, FK encounter_id, icd10, snomed, status[active/resolved])
              ├─1:N─ clinical_notes (PK id, FK encounter_id, type[SOAP], body, FK author_id, signed_at)
              ├─1:N─ orders (PK id, FK encounter_id, type[lab/rad/med/consult], status, FK ordered_by, FK order_set_id)
              │     └─1:N─ order_items (PK id, FK order_id, catalog_id, qty, instructions)
              └─1:N─ vitals (PK id, FK encounter_id, bp, temp, pulse, o2_sat, weight, height, taken_by, at)
  └─1:N─ patient_wallet/deposits/installments/refunds (FK patient_id)
  └─1:N─ medical_records (PK id, FK patient_id, coding[], retention_until)  ─1:N─ record_amendments, record_access_log
```
> ملاحظة: `patients.mrn` فريد per-tenant؛ **EMPI** (منع التكرار) عبر (national_id + name + phone).

## 3) التشخيص (مختبر/أشعة/مرضيات)
```
lab_orders (PK id, FK tenant_id, FK order_id, FK patient_id, priority, status)
  └─1:N─ lab_samples (PK id, FK lab_order_id, barcode, state[Collected..Verified], collected_by)
        └─1:N─ lab_results (PK id, FK lab_sample_id, loinc, value, unit, normal_range, is_abnormal, verified_by)
lab_analyzers (PK id, FK tenant_id, hl7_endpoint)   lab_qc (PK id, analyzer_id, level, value, at)
rad_orders (PK id, FK tenant_id, FK order_id, FK patient_id, modality, status)
  └─1:N─ rad_exams ──1:N── dicom_studies (PK id, study_uid, accession, FK rad_order_id) [PACS]
  └─1:N─ rad_reports (PK id, FK rad_order_id, structured_json, FK radiologist_id, signed_at, addendum)
path_specimens → blocks → slides → path_reports (snomed)
```

## 4) الدواء والتمريض
```
prescriptions (PK id, FK tenant_id, FK encounter_id, FK patient_id, FK drug_id, dose, route, freq, duration, status)
  └─1:N─ pharmacy_dispense (PK id, FK prescription_id, FK batch_id, qty, dispensed_by, at)
drug_master (PK id, FK tenant_id, name, sfda_code, formulary)  ─1:N─ drug_batches (PK id, FK drug_id, lot, expiry, qty) [FEFO]
mar (PK id, FK tenant_id, FK patient_id, FK prescription_id, scheduled_at, administered_at, by, status[given/refused/held])
nursing_assessments / care_plans / io_records / nursing_scores (FK patient_id, FK encounter_id)
```

## 5) تدفّق المريض / التنويم / الطوارئ
```
appointments (PK id, FK tenant_id, FK patient_id, FK doctor_id, FK slot_id, status)  slots (resource/time)
waiting_queue (PK id, FK tenant_id, FK patient_id, station, priority, status, called_at)
er_visits (PK id, FK tenant_id, FK patient_id, arrived_at, FK assigned_bed) ─1:1─ triage (esi_level, complaint, vitals) ─1:N─ er_tracking
admissions (PK id, FK tenant_id, FK patient_id, FK bed_id, admitted_at, FK attending_id, diagnosis)
  └─ transfers (FK admission_id, from_bed, to_bed) ─ discharges (FK admission_id, summary, at)
beds (PK id, FK tenant_id, FK ward_id, bed_no, status[Vacant/Occupied/Cleaning/Reserved])
icu_flowsheets / icu_scores / ventilator_records / infusions (FK admission_id)
```

## 6) العمليات / بنك الدم / الموافقات
```
or_schedule (PK id, FK tenant_id, FK room_id, FK surgeon_id, scheduled, FK patient_id)
  └─ surgeries ─ surgical_checklist(WHO) ─ anesthesia ─ pacu ─ or_consumption(→inventory)
blood_units (PK id, FK tenant_id, donor_id, abo, rh, component, expiry, status)
  └─ crossmatch (FK blood_unit_id, FK patient_id, compatible) ─ transfusions ─ transfusion_reactions
consent_templates (versioned) ─1:N─ signed_consents (FK patient_id, FK procedure_ref, signature_data, witness)
```

## 7) المالية / التأمين / الفوترة
```
invoices (PK id, FK tenant_id, FK patient_id, FK visit_id, total, vat, status)
  └─1:N─ invoice_items (FK invoice_id, FK chargemaster_id, qty, price)
chargemaster (PK id, FK tenant_id, code, loinc/cpt, name) ─1:N─ price_versions (effective_from)
claims (PK id, FK tenant_id, FK invoice_id, FK insurer_id, status) ─ pre_auth ─ remittance ─ denials   [NPHIES]
zatca_invoices (PK id, FK invoice_id, ubl_xml, stamp, qr, clearance_status)
journal_entries (PK id, FK tenant_id, ref, balanced) ─1:N─ journal_lines (FK account_id, debit, credit)   [posting OFF flag]
chart_of_accounts (PK id, FK tenant_id, code, name, type)   cost_centers
```

## 8) التشغيل / الدعم / الجودة / الموارد
```
items (inventory) ─ batches ─ purchase_orders ─ grn        cssd_trays ─ sterilization_cycles
meal_orders (dietary)   hai_surveillance/isolation (infection)   incidents ─ capa ─ risk_register (quality)
assets ─ work_orders ─ calibration (maintenance/CMMS)      transport_requests
employees ─ licenses(SCFHS) ─ shifts ─ attendance ─ payroll (HR)   cme_courses ─ cme_records
messages (linked patient/order)   reports/report_schedules
```

## 9) العلاقات الحاكمة (مختصر)
- **tenant_id** على كل كيان → عزل صارم (RLS).
- **patient** = المحور: visits → encounters → (orders/notes/results/meds).
- **orders** يولّد عبر الأقسام: lab_orders / rad_orders / prescriptions (نوع الطلب يوجّه القسم).
- **invoices** ← من الخدمات/الأصناف (chargemaster) ← تربط claims (NPHIES) + zatca_invoices + journal (GL).
- **beds** حالة حيّة تربط ER ↔ ADT ↔ Nursing ↔ Dietary ↔ Housekeeping/CSSD.
- **audit_log** يلتقط كل إجراء حسّاس (FK tenant_id + actor).

## 10) فهرسة/أداء موصاة
- فهرس على `tenant_id` لكل جدول حسّاس (الترقية 59/147 → الكل، gated سابقاً).
- فهارس مركّبة: `(tenant_id, patient_id)`, `(tenant_id, status)`, `(tenant_id, created_at)` للتقارير.
- `patients(tenant_id, national_id)` لـEMPI، `drug_batches(drug_id, expiry)` لـFEFO، `beds(tenant_id, status)` للـboard.

> الـDDL الفعلي يُولّد كـmigrations (انظر 07 §migrations) ضمن بوابة DB مخصّصة — **لا DDL في هذه الحزمة التوثيقية**.
