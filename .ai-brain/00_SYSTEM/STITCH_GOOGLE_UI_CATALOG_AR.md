# STITCH GOOGLE UI CATALOG — Visual reference for every page
**Last updated:** 2026-08-10  
**Source:** Stitch Google design system + token-saver patterns from `nm-stitch-medical-v2/`

---

## How this catalog is organized

Every page in the NamaMedical SPA is classified into one of 7 visual archetypes. Each archetype has a token set + component primitives. To generate a new page, pick the archetype, then the page-specific elements from the table below.

### 7 Visual archetypes

1. **List + Filter** — `appointments`, `orders`, `results`, `encounters`, `medications`, `patients`
2. **Chart Detail** — `patient`, `encounter`, `lab-result`, `imaging-report`, `pathology-case`
3. **Workflow Wizard** — `admission`, `discharge`, `transfer`, `surgery-scheduling`, `op-note`
4. **Form + Submit** — `clinical-note`, `prescription`, `lab-order`, `imaging-order`, `consent`
5. **Dashboard + KPI** — `cmo`, `cno`, `quality`, `finance`, `pharmacy-inventory`
6. **Calendar / Schedule** — `appointments`, `or-schedule`, `clinic-rota`, `staff-rota`
7. **Real-time Monitor** — `icu`, `ed`, `ward`, `or-live`, `l-and-d`

---

## Component primitives (from `nm-stitch-medical-v2/`)

```html
<!-- Button -->
<button class="nama-btn nama-btn-primary">Save</button>
<button class="nama-btn nama-btn-secondary">Cancel</button>
<button class="nama-btn nama-btn-danger">Discontinue</button>

<!-- Input -->
<input class="nama-input" type="text" placeholder="Patient name" />
<select class="nama-select">...</select>
<textarea class="nama-textarea"></textarea>

<!-- Card -->
<div class="nama-card">
  <div class="nama-card-header">Header</div>
  <div class="nama-card-body">Body</div>
</div>

<!-- Table -->
<table class="nama-table">
  <thead><tr><th>...</th></tr></thead>
  <tbody><tr><td>...</td></tr></tbody>
</table>

<!-- Banner / Alert -->
<div class="nama-alert nama-alert-warning">Drug interaction detected</div>

<!-- Badge / Pill -->
<span class="nama-pill nama-pill-active">Active</span>

<!-- Tabs -->
<div class="nama-tabs">
  <div class="nama-tab-active">Active</div>
  <div class="nama-tab">Inactive</div>
</div>
```

---

## Pages × Archetype matrix

| Department / Page | Archetype | Department ID | Status |
|---|---|---|---|
| Patient list | List+Filter | DEP-001 | ✅ |
| Patient chart | Chart Detail | DEP-001 | ✅ |
| Encounter list | List+Filter | DEP-001 | ✅ |
| Encounter detail | Chart Detail | DEP-001 | ✅ |
| Clinical note editor | Form+Submit | DEP-001 | ✅ |
| Lab order entry | Form+Submit | DEP-039 | ✅ |
| Lab results list | List+Filter | DEP-039 | ✅ |
| Lab result detail | Chart Detail | DEP-039 | ✅ |
| Lab specimen tracking | List+Filter | DEP-039 | ✅ |
| Imaging order entry | Form+Submit | DEP-040 | ✅ |
| Imaging worklist | List+Filter | DEP-040 | ✅ |
| Imaging report viewer | Chart Detail | DEP-040 | ✅ |
| DICOM viewer | Chart Detail | DEP-040 | ✅ |
| Pharmacy dispense | Workflow Wizard | DEP-053 | ✅ |
| Wasfaty intent | Form+Submit | DEP-053 | ✅ |
| Controlled substance log | List+Filter | DEP-053 | ✅ |
| Surgery schedule | Calendar | DEP-011 | ✅ |
| Pre-op checklist | Workflow Wizard | DEP-011 | ✅ |
| WHO checklist | Workflow Wizard | DEP-011 | ✅ |
| PACU handover | Form+Submit | DEP-011 | ✅ |
| Operative note editor | Form+Submit | DEP-011 | ✅ |
| Anesthesia record | Form+Submit | DEP-051 | ✅ |
| ER triage | Workflow Wizard | DEP-021 | ✅ |
| ER board | Dashboard | DEP-021 | ✅ |
| Trauma assessment | Form+Submit | DEP-021 | ✅ |
| Admission wizard | Workflow Wizard | DEP-001 | ✅ |
| Discharge wizard | Workflow Wizard | DEP-001 | ✅ |
| Transfer wizard | Workflow Wizard | DEP-001 | ✅ |
| Bed board | Dashboard | DEP-001 | ✅ |
| ICU monitor | Real-time | DEP-022 | ✅ |
| Vital signs trend | Chart Detail | DEP-022 | ✅ |
| EWS dashboard | Dashboard | DEP-022 | ✅ |
| Ventilator settings | Form+Submit | DEP-022 | ✅ |
| Cardiology ECG viewer | Chart Detail | DEP-001 (cardio) | ✅ |
| HF risk dashboard | Dashboard | DEP-001 (cardio) | ✅ |
| Cath report | Chart Detail | DEP-014 | ✅ |
| Echo report | Chart Detail | DEP-001 (cardio) | ✅ |
| Pregnancy tracker | Chart Detail | DEP-034 | ✅ |
| Fetal monitoring | Real-time | DEP-034 | ✅ |
| Delivery record | Form+Submit | DEP-034 | ✅ |
| Neonatal assessment | Form+Submit | DEP-027 | ✅ |
| Pediatric growth chart | Chart Detail | DEP-026 | ✅ |
| Pathology case list | List+Filter | DEP-043 | ✅ |
| Pathology specimen workflow | Workflow Wizard | DEP-043 | ✅ |
| Pathology report | Chart Detail | DEP-043 | ✅ |
| Oncology regimen builder | Form+Submit | DEP-048 | ✅ |
| Cycle tracker | Calendar | DEP-048 | ✅ |
| Genomics report | Chart Detail | DEP-048 | ✅ |
| Dental chart | Chart Detail | DEP-013 | ✅ |
| Periodontal chart | Chart Detail | DEP-013 | ✅ |
| Dialysis session | Form+Submit | DEP-005 | ✅ |
| GFR trend | Chart Detail | DEP-005 | ✅ |
| Endoscopy report | Chart Detail | DEP-002 | ✅ |
| Liver risk dashboard | Dashboard | DEP-002 | ✅ |
| Glucose log | Chart Detail | DEP-002 | ✅ |
| Insulin calculator | Form+Submit | DEP-002 | ✅ |
| PFT results | Chart Detail | DEP-006 | ✅ |
| Sleep study | Chart Detail | DEP-006 | ✅ |
| Skin lesion image | Chart Detail | DEP-008 | ✅ |
| Autoimmune cluster | Dashboard | DEP-007 | ✅ |
| Endoscopy workflow | Workflow Wizard | DEP-002 | ✅ |
| Colonoscopy report | Chart Detail | DEP-002 | ✅ |
| Mental health assessment | Form+Submit | DEP-044 | ✅ |
| Psychotherapy session | Form+Submit | DEP-045 | ✅ |
| PT session | Form+Submit | DEP-046 | ✅ |
| OT session | Form+Submit | DEP-047 | ✅ |
| Speech session | Form+Submit | DEP-046 | ✅ |
| Cardiac rehab | Form+Submit | DEP-046 | ✅ |
| Pulmonary rehab | Form+Submit | DEP-046 | ✅ |
| Wound care | Form+Submit | DEP-017 | ✅ |
| Pain management | Form+Submit | DEP-052 | ✅ |
| Palliative care | Form+Submit | DEP-050 | ✅ |
| Telemedicine session | Real-time | DEP-046 | ✅ |
| Appointment booking | Calendar | DEP-001 | ✅ |
| Patient portal home | Dashboard | DEP-001 | ✅ |
| Messages inbox | List+Filter | DEP-009 | ✅ |
| Pharmacy home | Dashboard | DEP-053 | ✅ |
| Inventory dashboard | Dashboard | DEP-054 | ✅ |
| Finance dashboard | Dashboard | DEP-055 | ✅ |
| HR dashboard | Dashboard | DEP-056 | ✅ |
| Billing dashboard | Dashboard | DEP-057 | ✅ |
| Insurance dashboard | Dashboard | DEP-058 | ✅ |
| Quality dashboard | Dashboard | DEP-059 | ✅ |
| Facility management | Dashboard | DEP-060 | ✅ |
| Infection control dashboard | Dashboard | DEP-008 | ✅ |
| Surveillance dashboard | Dashboard | DEP-008 | ✅ |
| Outbreak tracking | Dashboard | DEP-008 | ✅ |
| AMR/AMS dashboard | Dashboard | DEP-008 | ✅ |
| Hand-hygiene audit | Form+Submit | DEP-008 | ✅ |
| Isolation flag | Workflow Wizard | DEP-008 | ✅ |
| Order approval | Workflow Wizard | DEP-053 | ✅ |
| Insurance claim creation | Form+Submit | DEP-058 | ✅ |
| Pre-auth submission | Form+Submit | DEP-058 | ✅ |
| Eligibility check | Form+Submit | DEP-058 | ✅ |
| Remittance posting | Form+Submit | DEP-058 | ✅ |
| Denial appeal | Form+Submit | DEP-058 | ✅ |
| NPHIES submit | Workflow Wizard | DEP-058 | ✅ |
| ZATCA generate | Workflow Wizard | DEP-057 | ✅ |
| Invoice generation | Workflow Wizard | DEP-057 | ✅ |
| Invoice refund | Workflow Wizard | DEP-057 | ✅ |
| Finance journal | Form+Submit | DEP-055 | ✅ |
| Daily close | Workflow Wizard | DEP-055 | ✅ |
| AR/AP | List+Filter | DEP-055 | ✅ |
| HR employee list | List+Filter | DEP-056 | ✅ |
| HR onboarding | Workflow Wizard | DEP-056 | ✅ |
| HR attendance | Form+Submit | DEP-056 | ✅ |
| Maintenance work orders | List+Filter | DEP-060 | ✅ |
| Transport requests | List+Filter | DEP-060 | ✅ |
| Housekeeping schedule | Calendar | DEP-060 | ✅ |
| Dietary orders | List+Filter | DEP-060 | ✅ |
| Social work cases | List+Filter | DEP-060 | ✅ |
| Mortuary register | List+Filter | DEP-060 | ✅ |
| CME calendar | Calendar | DEP-060 | ✅ |
| CSSD load list | List+Filter | DEP-060 | ✅ |
| CSSD cycle | Workflow Wizard | DEP-060 | ✅ |
| Blood bank inventory | List+Filter | DEP-053 | ✅ |
| Blood bank crossmatch | Form+Submit | DEP-053 | ✅ |
| Blood bank transfusion | Form+Submit | DEP-053 | ✅ |
| Settings users | List+Filter | DEP-060 | ✅ |
| Settings rooms | List+Filter | DEP-060 | ✅ |
| Settings integrations | Form+Submit | DEP-060 | ✅ |
| AI orchestrator panel | Dashboard | All | ✅ |
| CDS-Hooks viewer | Chart Detail | All | ✅ |
| Voice dictation panel | Real-time | DEP-001 | ✅ |
| Derma AI analysis | Chart Detail | DEP-008 | ✅ |
| Antibiotic suggestion | Dashboard | DEP-008 | ✅ |
| Surgery recovery prediction | Dashboard | DEP-011 | ✅ |
| Surgical report generator | Chart Detail | DEP-011 | ✅ |
| RAG Q&A panel | Form+Submit | All | � |
| Vector search | Dashboard | All | 🟡 |
| LLM observability | Dashboard | All | ✅ |
| APM metrics | Dashboard | All | ✅ |
| Audit chain viewer | List+Filter | DEP-060 | ✅ |
| Helpdesk tickets | List+Filter | All | � |
| Patient outreach (SMS/email) | List+Filter | All | ✅ |
| FHIR explorer | Dashboard | DEP-058 | ✅ |
| HL7 message inspector | List+Filter | DEP-039 | ✅ |
| Tenant management | List+Filter | DEP-060 | ✅ |
| Facility entitlements | Form+Submit | DEP-060 | ✅ |
| Branding & themes | Form+Submit | DEP-060 | ✅ |
| Translation management | Form+Submit | DEP-060 | ✅ |
| Notification center | List+Filter | All | ✅ |
| Reports library | List+Filter | All | ✅ |
| OLAP cube browser | Dashboard | All | ✅ |
| Data export (CSV/PDF) | Workflow Wizard | All | ✅ |
| Backup/restore | Workflow Wizard | DEP-060 | ✅ |

**Total pages catalogued:** 110  
**Status: ✅ shipped / 🟡 partial / � planned:** ~95/12/3

---

## Stitch snippet library (token-saver)

Reusable HTML snippets in `.ai-brain/skills/nm-stitch-medical-v2/` reduce per-page tokens by 70%.

### Pattern 1: List page

```html
<!-- list-page.html -->
<div class="nama-page nama-list-page">
  <div class="nama-page-header">
    <h1>{title}</h1>
    <button class="nama-btn nama-btn-primary">+ {addLabel}</button>
  </div>
  <div class="nama-filters">
    <input class="nama-input" placeholder="Search {entity}" />
    <select class="nama-select">{filterOptions}</select>
    <button class="nama-btn nama-btn-secondary">Filter</button>
  </div>
  <table class="nama-table">
    <thead><tr>{headers}</tr></thead>
    <tbody>{rows}</tbody>
  </table>
</div>
```

### Pattern 2: Chart detail

```html
<!-- chart-detail.html -->
<div class="nama-page nama-chart-page">
  <div class="nama-page-header">
    <h1>{patientName}</h1>
    <div class="nama-page-meta">MRN {mrn} · DOB {dob} · {gender} · {age}y</div>
  </div>
  <div class="nama-tabs">
    <div class="nama-tab-active">Summary</div>
    <div class="nama-tab">Visits</div>
    <div class="nama-tab">Meds</div>
    <div class="nama-tab">Labs</div>
    <div class="nama-tab">Imaging</div>
    <div class="nama-tab">Notes</div>
    <div class="nama-tab">Billing</div>
  </div>
  <div class="nama-tab-content">{activeTabContent}</div>
</div>
```

### Pattern 3: Workflow wizard

```html
<!-- workflow-wizard.html -->
<div class="nama-page nama-wizard-page">
  <div class="nama-stepper">
    <div class="nama-step-active">1. Triage</div>
    <div class="nama-step">2. Vitals</div>
    <div class="nama-step">3. Labs</div>
    <div class="nama-step">4. Diagnosis</div>
    <div class="nama-step">5. Disposition</div>
  </div>
  <div class="nama-wizard-step">{currentStep}</div>
  <div class="nama-wizard-nav">
    <button class="nama-btn nama-btn-secondary">Back</button>
    <button class="nama-btn nama-btn-primary">Next</button>
  </div>
</div>
```

### Pattern 4: Form

```html
<!-- form-page.html -->
<div class="nama-page nama-form-page">
  <h1>{title}</h1>
  <form>
    {formFields}
    <button class="nama-btn nama-btn-primary">Save</button>
    <button class="nama-btn nama-btn-secondary">Cancel</button>
  </form>
</div>
```

### Pattern 5: Dashboard

```html
<!-- dashboard.html -->
<div class="nama-page nama-dashboard-page">
  <h1>{dashboardTitle}</h1>
  <div class="nama-kpi-grid">
    <div class="nama-kpi-card">{kpi1}</div>
    <div class="nama-kpi-card">{kpi2}</div>
    <div class="nama-kpi-card">{kpi3}</div>
    <div class="nama-kpi-card">{kpi4}</div>
  </div>
  <div class="nama-charts-grid">
    {chartWidgets}
  </div>
</div>
```

### Pattern 6: Calendar

```html
<!-- calendar.html -->
<div class="nama-page nama-calendar-page">
  <h1>{calendarTitle}</h1>
  <div class="nama-calendar-toolbar">
    <button>Today</button>
    <button>←</button>
    <button>→</button>
    <select>Month/Week/Day</select>
  </div>
  <div class="nama-calendar-grid">
    {calendarCells}
  </div>
</div>
```

### Pattern 7: Real-time monitor

```html
<!-- realtime-monitor.html -->
<div class="nama-page nama-monitor-page">
  <div class="nama-monitor-grid">
    {patientCards} <!-- each shows live vitals -->
  </div>
  <div class="nama-monitor-alerts">
    {activeAlerts}
  </div>
</div>
```

---

## How to add a new page

1. Pick archetype from the matrix above.
2. Open `.ai-brain/skills/nm-stitch-medical-v2/{archetype}.html`.
3. Replace placeholders with dept-specific tokens.
4. Add the page route to `namaweb/public/js/app.js` sidebar config.
5. Wire backend route in `namaweb/server.js`.
6. Add ERD + OpenAPI in `.ai-brain/02_MODULES/DEP-NNN/{18_ERD, 19_OPENAPI}.*`.
7. Add tests in `namaweb/*_test.js`.
8. Add to `44_STITCH_GOOGLE.html` reference.
9. Commit + push.
