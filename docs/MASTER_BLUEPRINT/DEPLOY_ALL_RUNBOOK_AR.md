# DEPLOY_ALL — دليل النشر النهائي (E0 → E9)

> **الحالة:** كل الإبيكات التسعة (+E-X) مبنية ومُراجَعة ومُختبَرة كفروع `origin/feat/*` — **لا شيء منشور على alfaisal-erp.com** (live main = `171b7c2`).
> هذا الدليل يُنفَّذه **المالك** (DDL يتطلّب دور قاعدة بيانات مخوّل؛ الوكيل يملك صلاحيات دور التطبيق فقط). بعد تنفيذ المالك للـDDL ودمج الكود، يتولّى الوكيل النشر (`pm2 restart`) + smoke.
> **آخر تحديث:** 2026-06-26 — بعد اكتمال E9 (الأخير).

---

## 0) ⚠️ تحذير تكامل حاسم (اقرأه أولاً)

الفروع الأحد عشر **كلّها تعدّل نفس الملفّين الكبيرين** (`namaweb/server.js` و`public/js/app.js`). الدمج إلى `main` **ليس fast-forward** — ستحدث تعارضات (merge conflicts) لأن كل إبيك أضاف مسارات/دوال في نفس المناطق. **لا تدمجها بالتوازي العشوائي.** الطريقة الصحيحة:

1. أنشئ فرع تكامل: `integration/all-epics` من `main` (`171b7c2`).
2. ادمج الفروع فيه **بالترتيب أدناه**، محلّاً التعارضات يدوياً بعد كل دمج.
3. بعد كل دمج: `node --check server.js public/js/app.js` + شغّل **كل** اختبارات الإبيكات (انظر §4) — يجب أن تبقى خضراء.
4. بعد دمج الكل ونجاح كل الاختبارات على فرع التكامل: نفّذ DDL (§2) ثم انشر فرع التكامل (§3).

> بديل أبسط (موصى به للوضوح): دمج تسلسلي **إبيك واحد في كل نافذة نشر** (DDL الخاص به → دمج كوده → restart → smoke → التالي)، بدل دفعة واحدة. يقلّل المخاطرة ويُبقي إمكانية التراجع نظيفة.

---

## 1) ترتيب الاعتماديات (lineage)

```
main (171b7c2)
 ├─ E0  onboarding-wizard        (مستقل)
 ├─ E-X foundational (orders/RBAC/indexes) (مستقل — يُفضّل مبكراً: RBAC أساس)
 ├─ E2  HIM                       (مستقل)
 ├─ E3  laboratory                (مستقل)
 ├─ E4  radiology                 (مستقل — لا migrations جديدة، حُرّاس مسارات فقط)
 └─ E1  doctor-station (cds.js + CPOE)   ← الأساس السريري
      ├─ E5  pharmacy            (يعيد استخدام cds.js)
      ├─ E6  nursing-mar         (يعيد استخدام cds.js + getPatientActiveMeds)
      └─ E7  emergency-ed
           └─ E8  inpatient-adt  (يحتاج تسليم E7 ER→ADT)
                └─ E9  icu        (يربط بإقامات E8)
```
**ترتيب الدمج الموصى:** E-X → E1 → E2 → E3 → E4 → E5 → E6 → E7 → E8 → E9 → E0.
(E1 قبل E5/E6/E7 لأنها تعتمد cds.js؛ E7→E8→E9 سلسلة؛ E-X مبكراً لأن RBAC أساس؛ E0 في أي وقت.)

---

## 2) بوابة DDL (المالك — دور migration مخوّل)

نفّذ migrations كل إبيك **بالترتيب**، كلٌّ متبوعاً بـ`_validate.sql` (توقّع كل العدادات كما هي مُعلّمة + `force_rls = t`). جميعها candidate idempotent (`IF NOT EXISTS`/`DROP … IF EXISTS`)، FORCE RLS + السياسة المعيارية `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer` + `tenant_id NOT NULL REFERENCES tenants(id)`.

> ملاحظة: الفروع السريرية (E5/E6/E7/E8/E9) تتضمّن نسخاً من migrations الأقدم في سلسلتها (مثلاً e1_01/e1_02، وe7_* داخل E8/E9). نفّذ كل migration **مرّة واحدة فقط** — القائمة أدناه مزيلة للتكرار وبالترتيب الصحيح.

```bash
# E-X — الأساسيات (orders + RBAC + فهارس tenant_id)
psql -f migrations/ex_01_orders_up.sql            && psql -f migrations/ex_01_orders_validate.sql
psql -f migrations/ex_02_rbac_up.sql              && psql -f migrations/ex_02_rbac_validate.sql
psql -f migrations/ex_03_tenant_id_indexes_up.sql && psql -f migrations/ex_03_tenant_id_indexes_validate.sql

# E1 — النواة السريرية
psql -f migrations/e1_01_problems_up.sql          && psql -f migrations/e1_01_problems_validate.sql
psql -f migrations/e1_02_clinical_notes_up.sql    && psql -f migrations/e1_02_clinical_notes_validate.sql

# E2 — HIM
psql -f migrations/e2_01_coding_up.sql            && psql -f migrations/e2_01_coding_validate.sql
psql -f migrations/e2_02_roi_up.sql               && psql -f migrations/e2_02_roi_validate.sql
psql -f migrations/e2_03_record_access_up.sql     && psql -f migrations/e2_03_record_access_validate.sql

# E3 — LIS
psql -f migrations/e3_01_lab_samples_up.sql       && psql -f migrations/e3_01_lab_samples_validate.sql
psql -f migrations/e3_02_lab_results_up.sql       && psql -f migrations/e3_02_lab_results_validate.sql
psql -f migrations/e3_03_lab_qc_up.sql            && psql -f migrations/e3_03_lab_qc_validate.sql

# E4 — radiology: لا DDL جديد (حُرّاس مسارات + جداول قائمة)

# E5 — pharmacy
psql -f migrations/e5_01_drug_batches_up.sql      && psql -f migrations/e5_01_drug_batches_validate.sql
psql -f migrations/e5_02_pharmacy_dispense_up.sql && psql -f migrations/e5_02_pharmacy_dispense_validate.sql
psql -f migrations/e5_03_controlled_log_up.sql    && psql -f migrations/e5_03_controlled_log_validate.sql

# E6 — nursing/MAR
psql -f migrations/e6_01_mar_administrations_up.sql && psql -f migrations/e6_01_mar_administrations_validate.sql
psql -f migrations/e6_02_nursing_io_records_up.sql  && psql -f migrations/e6_02_nursing_io_records_validate.sql
psql -f migrations/e6_03_nursing_scores_up.sql      && psql -f migrations/e6_03_nursing_scores_validate.sql

# E7 — emergency/ED
psql -f migrations/e7_01_emergency_ed_workflow_up.sql && psql -f migrations/e7_01_emergency_ed_workflow_validate.sql
psql -f migrations/e7_02_emergency_rls_up.sql         && psql -f migrations/e7_02_emergency_rls_validate.sql

# E8 — inpatient/ADT
psql -f migrations/e8_01_inpatient_adt_rls_up.sql   && psql -f migrations/e8_01_inpatient_adt_rls_validate.sql
psql -f migrations/e8_02_bed_status_history_up.sql  && psql -f migrations/e8_02_bed_status_history_validate.sql

# E9 — ICU
psql -f migrations/e9_01_icu_rls_up.sql             && psql -f migrations/e9_01_icu_rls_validate.sql
psql -f migrations/e9_02_icu_infusions_up.sql       && psql -f migrations/e9_02_icu_infusions_validate.sql

# E0 — onboarding (في أي وقت)
psql -f migrations/e0_01_tenants_archetype_up.sql     && psql -f migrations/e0_01_tenants_archetype_validate.sql
psql -f migrations/e0_02_facilities_extend_up.sql     && psql -f migrations/e0_02_facilities_extend_validate.sql
psql -f migrations/e0_03_facility_modules_up.sql      && psql -f migrations/e0_03_facility_modules_validate.sql
psql -f migrations/e0_04_integration_settings_rls_up.sql && psql -f migrations/e0_04_integration_settings_rls_validate.sql
```

**تحذير backfill:** بعض migrations تحتوي `UPDATE … SET tenant_id = 1 WHERE tenant_id IS NULL` (نمط أحادي-المستأجر للـdev). **راجِعه قبل التنفيذ على قاعدة متعدّدة المستأجرين ذات بيانات حيّة** — قد يلزم backfill مخصّص بمعرّف المستأجر الصحيح.

---

## 3) نشر الكود (الوكيل — بعد نجاح DDL + دمج الكود)

1. على فرع التكامل (أو بعد دمج الإبيك في main):
   - `cd namaweb && node --check server.js && node --check public/js/app.js`
2. نشر static (app.js/icu_scoring.js/… العميل = live فور التحرير) + `pm2 restart nama-app` (server.js خامل حتى restart).
3. تقدّم gitlink الأب (`git add namaweb`) + commit + (المالك يعتمد) push.
4. **ملاحظة:** الملفّات الجديدة (cds.js, esi_engine.js, icu_scoring.js, nursing_scores.js, rbac.js, orders.js, onboarding.js, lis.js, clinical_cpoe.js) محرّكات/وحدات `require`d في server.js — تأكّد أنها مُضمَّنة في النشر.

---

## 4) Smoke / معايير القبول بعد النشر

```bash
curl -s -o /dev/null -w "%{http_code}" https://alfaisal-erp.com/health      # توقّع 200
# تحقّق FORCE_RLS ≥ 150 (سياسات جديدة من الإبيكات ترفع العدد)
```
- شغّل كل اختبارات الإبيكات (DB-free) قبل النشر على فرع التكامل: `e1_*`, `e5_*`, `e6_*`, `e7_*`, `e8_*`, `e9_*`, `esi_triage_unit_test`, `nursing_scores_unit_test`, `icu_scores_unit_test`, وكل `cross_tenant_*` — كلها 0 فشل (مُتحقَّق على كل فرع).
- **E2E بالمتصفّح (المالك):** تسجيل دخول → CPOE → صرف صيدلية (FEFO) → MAR بـ5 حقوق → فرز ESI → إدخال/نقل/خروج ADT → flowsheet/درجات ICU. تأكّد لا تسريب عبر المستأجرين.

## 5) التراجع (Rollback)

- **قاعدة البيانات:** نفّذ `_down.sql` المقابل **بترتيب عكسي** داخل كل إبيك ثم عبر الإبيكات (E9→…→E-X). كل down يُسقط إضافاته فقط (لا يُسقط الجداول القائمة سابقاً؛ الجداول الجديدة تُسقط أولاً ثم سياساتها).
- **الكود:** `git revert`/`checkout` للملفّ السابق + `pm2 restart` (server)؛ العميل (static) = استبدال ذرّي للملفّ.

## 6) قرارات للمالك (مُعلَّمة من المراجعات)

- **RBAC:** مُنح دور Doctor صلاحية `'inpatient'` (E8) و`'emergency'` (E7) لمطابقة وضع `requireRole('inpatient'/'emergency','nursing','doctor')` — أكّد القبول.
- **مسارات قديمة مُتقاعدة → 409:** `POST /api/admissions`, `PUT /api/admissions/:id/discharge`, `POST /api/bed-transfers` (E8) تُعيد 409 وتوجّه لـ`/api/adt/*`. إن وُجد تكامل خارجي يستخدمها، يجب ترحيله.
- **تكاملات gated:** HL7 (E3)، MWL (E4)، Wasfaty/NPHIES (E5) تبقى stubs حتى اعتماد مفاتيح حقيقية ببوابة مخصّصة.

---

## 7) سجلّ الفروع (origin)

| الإبيك | الفرع | commit |
|---|---|---|
| E0 | feat/e0-onboarding-wizard | `2b14cb9` |
| E-X | feat/ex-foundational | `1e6dfbf` |
| E1 | feat/e1-doctor-station | `b18694d` |
| E2 | feat/e2-him | `93ee1ba` |
| E3 | feat/e3-laboratory | `df9f4b3` |
| E4 | feat/e4-radiology | `b61d1fd` |
| E5 | feat/e5-pharmacy | `25b06c9` |
| E6 | feat/e6-nursing-mar | `2b0fe25` |
| E7 | feat/e7-emergency-ed | `14a6167` |
| E8 | feat/e8-inpatient-adt | `4b5c410` |
| E9 | feat/e9-icu | `9d08964` |
| E10 | feat/e10-finance-zatca | `d6a2da0` |
| E11 | feat/e11-insurance-nphies | `4ba4225` |
| E12 | feat/e12-surgery-or | `2c50451` |
| E13 | feat/e13-blood-bank | `960b641` |
| E14 | feat/e14-ob-maternity | `c2f3822` |
| E15 | feat/e15-pathology | `3891a25` |
| E16 | feat/e16-inventory-cssd | `6e92226` |
| E17 | feat/e17-quality-infection | `3c4026e` |
| E18 | feat/e18-hr-workforce | `963c08e` |

---

## 8) الموجة الثانية — migrations + ترتيب الدمج (E10→E18)

كلها مستقلّة عن السلسلة السريرية (تتفرّع من main `171b7c2`) إلا التكامل المنطقي (E11 تأمين يربط فواتير/مطالبات E10). **نفس قواعد §0 (دمج تسلسلي، تعارضات server.js/app.js متوقّعة) و§2 (DDL يُنفّذه المالك، كلٌّ متبوع بـ`_validate.sql`).**

```bash
# E10 Finance/GL/ZATCA
psql -f migrations/e10_01_gl_structure_up.sql      && psql -f migrations/e10_01_gl_structure_validate.sql
psql -f migrations/e10_02_cost_centers_up.sql      && psql -f migrations/e10_02_cost_centers_validate.sql
psql -f migrations/e10_03_zatca_invoices_up.sql    && psql -f migrations/e10_03_zatca_invoices_validate.sql
psql -f migrations/e10_04_invoice_gl_link_up.sql   && psql -f migrations/e10_04_invoice_gl_link_validate.sql
psql -f migrations/e10_05_daily_close_rls_up.sql   && psql -f migrations/e10_05_daily_close_rls_validate.sql
# E11 Insurance/NPHIES
psql -f migrations/e11_01_claims_lifecycle_up.sql         && psql -f migrations/e11_01_claims_lifecycle_validate.sql
psql -f migrations/e11_02_companies_policies_up.sql       && psql -f migrations/e11_02_companies_policies_validate.sql
psql -f migrations/e11_03_nphies_lifecycle_tables_up.sql  && psql -f migrations/e11_03_nphies_lifecycle_tables_validate.sql
# E12 Surgery/OR
psql -f migrations/e12_001_surgery_or_up.sql       && psql -f migrations/e12_001_surgery_or_validate.sql
psql -f docs/sql/surgery_or_rls_up.sql             # FORCE RLS on pre-existing surgery tables
# E13 Blood Bank
psql -f docs/migrations/blood_bank/01_blood_bank_e13_up.sql && psql -f docs/migrations/blood_bank/01_blood_bank_e13_validate.sql
# E14 OB/Maternity
psql -f migrations/e14_ob_maternity_up.sql         && psql -f migrations/e14_ob_maternity_validate.sql
# E15 Pathology
psql -f migrations/e15_pathology_01_specimens_blocks_slides_reports_up.sql && psql -f migrations/e15_pathology_01_specimens_blocks_slides_reports_validate.sql
# E16 Inventory/CSSD
psql -f migrations/e16_01_inventory_cssd_rls_up.sql && psql -f migrations/e16_01_inventory_cssd_rls_validate.sql
psql -f migrations/e16_02_supply_chain_up.sql       && psql -f migrations/e16_02_supply_chain_validate.sql
psql -f migrations/e16_03_cssd_trays_up.sql         && psql -f migrations/e16_03_cssd_trays_validate.sql
# E17 Quality/Infection
psql -f migrations/e17_001_quality_capa_up.sql      && psql -f migrations/e17_001_quality_capa_validate.sql
psql -f migrations/e17_002_infection_up.sql         && psql -f migrations/e17_002_infection_validate.sql
# E18 HR/Workforce
psql -f migrations/e18_01_hr_workforce_up.sql       && psql -f migrations/e18_01_hr_workforce_validate.sql
```

**ترتيب الدمج الكامل الموصى (الموجتان):** E-X → E1 → E2 → E3 → E4 → E5 → E6 → E7 → E8 → E9 → E10 → E11 → E12 → E13 → E14 → E15 → E16 → E17 → E18 → E0.

**بوّابات gated في الموجة الثانية (تبقى مغلقة حتى اعتماد مفاتيح/أعلام حقيقية):**
- المحاسبة (E10 posting) = `ACCOUNTING_POSTING_ENABLED` **OFF**؛ القيود draft فقط، لا كتابة GL.
- ZATCA clearance (E10) = `ZATCA_ENABLED` OFF → 503 intent-only.
- NPHIES (E11 eligibility/pre-auth/claims submit) = `NPHIES_ENABLED` OFF → 503 intent-only.
- HR payroll posting (E18) = `HR_PAYROLL_POSTING_ENABLED` OFF؛ slips draft/محسوبة فقط.
- بوّابات سريرية gated محفوظة: HL7 (E3)، MWL (E4)، Wasfaty (E5).

**ثوابت أمان حرجة مُختبَرة (لا تُضعِفها عند الدمج):** توافق ABO/Rh fail-closed (E13)، بوابة BI قبل التعقيم (E16)، WHO checklist مرتّب (E12)، MAR 5-حقوق (E6)، CDS عند الوصف/الصرف/الإعطاء (E1/E5/E6)، عزل المستأجر + بوابة سرّية الحوادث (E17)، PII محصورة بـHR (E18).

**live main = `171b7c2` — غير منشور بعد. ينتظر اعتماد المالك لتنفيذ هذا الدليل.**
