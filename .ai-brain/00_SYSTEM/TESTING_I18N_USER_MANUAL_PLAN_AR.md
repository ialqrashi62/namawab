# TESTING, I18N, USER MANUAL, TRAINING PLAN
**Last updated:** 2026-08-10

---

## 1. Testing strategy

### 1.1 Unit tests (Jest)

- Per engine file
- Per route helper
- Per middleware
- 80%+ coverage required (enforced in CI)

```js
// Example: pharmacy_queue.test.js
const { PharmacyQueue } = require('../pharmacy_queue');

describe('PharmacyQueue', () => {
  test('validateDispense requires valid batch', () => {
    expect(() => PharmacyQueue.validateDispense({ batch: null }))
      .toThrow('batch required');
  });

  test('deductStock decreases inventory atomically', () => {
    const stock = { batch: 'B1', qty: 100 };
    PharmacyQueue.deductStock(stock, 30);
    expect(stock.qty).toBe(70);
  });
});
```

### 1.2 Integration tests (Jest + pg pool)

- Database-backed
- Multi-tenant scenarios
- RLS verification
- Test fixture DSL

```js
// Example: patient_create_integration.test.js
const { setupTenant, cleanupTenant } = require('../helpers/test_fixture_dsl');

describe('POST /api/patients', () => {
  let tenant;
  beforeAll(async () => {
    tenant = await setupTenant({ name: 'Test Hospital' });
  });
  afterAll(async () => {
    await cleanupTenant(tenant.id);
  });

  test('creates patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('X-Tenant-Id', tenant.id)
      .send({ mrn: 'T-001', given_name: 'Ahmed', family_name: 'Ali', ... });
    expect(res.status).toBe(201);
  });

  test('rejects without tenant', async () => {
    const res = await request(app).post('/api/patients').send({ ... });
    expect(res.status).toBe(401);
  });

  test('rejects cross-tenant access', async () => {
    const res = await request(app)
      .get(`/api/patients/${otherTenantPatientId}`)
      .set('X-Tenant-Id', tenant.id);
    expect(res.status).toBe(404); // not 403 to avoid information leak
  });
});
```

### 1.3 BDD (Cucumber)

- Per major workflow
- Arabic + English

```gherkin
# features/er_triage.feature
Feature: ER Triage
  As an ER nurse
  I want to triage patients by ESI level
  So that critical patients get immediate care

  Scenario: ESI 1 patient arrives
    Given a patient arrives with cardiac arrest
    When I triage them
    Then ESI level should be "ESI-1"
    And they should be assigned to resuscitation room
    And the provider should be notified immediately

  Scenario: ESI 3 patient arrives
    Given a patient arrives with abdominal pain
    When I triage them
    Then ESI level should be "ESI-3"
    And they should be placed in waiting room
```

### 1.4 Guard tests

Static string-based checks that verify boundary schemas + middleware presence.

```js
// ai_services_infection_boundary_guard_test.js
const checks = [
  { route: '/api/medical/certificates', verb: 'post', schema: 'medicalCertificateCreate' },
  // ...
];
```

### 1.5 E2E (Playwright)

- Per major SPA workflow
- Cross-browser
- Mobile + desktop

### 1.6 Performance tests (k6)

- 1000 concurrent users
- p99 latency < 500ms
- Error rate < 0.1%

### 1.7 Security tests (OWASP ZAP, Burp, custom)

See `SECURITY_PENTEST_PLAN_AR.md`.

---

## 2. Test suites (npm scripts)

| Script | Purpose |
|---|---|
| `npm test` | All tests |
| `npm run test:safe` | Safe subset (fast feedback) |
| `npm run test:clinical:safety` | Boundary validation (all clinical specialties) |
| `npm run test:compliance:quick` | ZATCA + NPHIES + CBAHI + RLS |
| `npm run test:compliance:full` | Full compliance suite |
| `npm run test:money:safety` | Money + RCM routes |

---

## 3. i18n (Internationalization)

### Supported languages

| Code | Language | Direction | Coverage |
|---|---|---|---|
| `ar-SA` | Arabic (Saudi) | RTL | 100% |
| `en-US` | English (US) | LTR | 100% |
| `fr-FR` | French | LTR | 80% |
| `ur-PK` | Urdu (Pakistan) | RTL | 60% |

### Storage

```json
// public/js/i18n/ar-SA.json
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "search": "بحث",
    "loading": "جاري التحميل...",
    "error": "خطأ",
    "success": "نجح"
  },
  "patient": {
    "create": "إنشاء مريض",
    "edit": "تعديل بيانات المريض",
    "mrn": "رقم الملف الطبي",
    "name": "الاسم",
    "dob": "تاريخ الميلاد",
    "gender_m": "ذكر",
    "gender_f": "أنثى"
  },
  "encounter": {
    "create": "بدء زيارة",
    "sign": "توقيع الزيارة",
    "lock": "قفل السجل"
  },
  "pharmacy": {
    "dispense": "صرف الدواء",
    "controlled": "دواء خاضع للرقابة",
    "wasfaty": "وصفتي"
  },
  "lab": {
    "order": "طلب فحص",
    "result": "نتيجة الفحص",
    "verify": "تأكيد النتيجة",
    "critical": "حرج - يتطلب إبلاغ فوري"
  },
  "radiology": {
    "order": "طلب أشعة",
    "report": "تقرير الأشعة",
    "critical_notify": "إبلاغ نتيجة حرجة"
  },
  "surgery": {
    "schedule": "جدولة عملية",
    "who_checklist": "قائمة السلامة WHO",
    "operative_note": "تقرير العملية"
  },
  "er": {
    "triage": "فرز",
    "disposition": "القرار النهائي"
  },
  "oncology": {
    "regimen": "بروتوكول علاجي",
    "cycle": "دورة"
  },
  "icu": {
    "ews": "نظام الإنذار المبكر",
    "apache": "APACHE II score"
  },
  "obgyn": {
    "pregnancy": "حمل",
    "delivery": "ولادة",
    "fetal": "جنين"
  },
  "peds": {
    "growth_chart": "مخطط النمو"
  },
  "billing": {
    "invoice": "فاتورة",
    "pay": "دفع",
    "refund": "استرداد"
  },
  "insurance": {
    "claim": "مطالبة",
    "preauth": "موافقة مسبقة",
    "nphies": "منصة NPHIES"
  },
  "zatca": {
    "generate": "إنشاء فاتورة ZATCA",
    "credit_note": "إشعار دائن"
  },
  "ai": {
    "orchestrator": "منسق الذكاء الاصطناعي",
    "voice": "إدخال صوتي"
  },
  "quality": {
    "incident": "حادثة",
    "capa": "إجراء تصحيحي ووقائي"
  },
  "infection": {
    "surveillance": "مراقبة",
    "outbreak": "تفشي",
    "isolation": "عزل"
  }
}
```

### Translation keys

Naming: `{module}.{action}` or `{module}.{field}`

Plural forms: use ICU MessageFormat for AR (zero, one, two, few, many, other).

### RTL support

- `dir="rtl"` on `<html>` for Arabic + Urdu
- `dir="ltr"` for English + French
- CSS uses logical properties (`margin-inline-start` instead of `margin-left`)
- Tailwind RTL plugin enabled

### Hijri date support

```js
import { HijriCalendar } from './hijri';
const today = new Date();
const hijri = HijriCalendar.fromGregorian(today);
console.log(hijri.format('ar-SA')); // 1447-02-15
```

### Number formatting

- Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩) for AR
- Western digits (0123456789) for EN/FR/UR

---

## 4. User manual

### Structure (in `.ai-brain/02_MODULES/DEP-NNN/{29_USER_MANUAL}.md`)

1. Overview
2. Roles & permissions
3. Getting started
4. Common workflows
5. Tips & tricks
6. Troubleshooting
7. FAQ
8. Glossary
9. Contact support

### Sample (DEP-001 Patients)

```markdown
# Patients Module — User Manual

## Overview
The Patients module is the core of the EMR. It manages patient demographics, allergies, medications, and clinical history.

## Roles & permissions
- **Doctor** — full access (own specialty)
- **Nurse** — read all, write vitals + intake
- **Receptionist** — read demographics + appointments
- **Pharmacist** — read allergy + medications
- **Lab Tech** — read orders + results

## Getting started
1. Search for patient by MRN, name, or national ID
2. Click patient to open chart
3. Navigate tabs: Summary / Visits / Meds / Labs / Imaging / Notes / Billing

## Common workflows

### Register a new patient
1. Click "New Patient"
2. Enter MRN (auto-generated if blank)
3. Enter name (given + family)
4. Enter national ID (validated)
5. Enter DOB + gender
6. Enter phone + email
7. Click Save

### View patient chart
...

## Tips & tricks
- Use keyboard shortcut `Ctrl+K` to quick-search
- Use Arabic name field if patient prefers Arabic
- National ID is validated against Saudi national ID format

## Troubleshooting
- "Patient not found" → check MRN spelling
- "Permission denied" → check role
- "Duplicate MRN" → use search to find existing patient

## FAQ

### How do I find a patient with only Arabic name?
Search supports Arabic. Type Arabic name directly.

### How do I merge duplicate patients?
Contact admin. Manual merge tool in admin panel.

## Glossary
- **MRN** — Medical Record Number (unique identifier per tenant)
- **DOB** — Date of Birth
- **Allergy** — known adverse reaction to medication/food/environment

## Contact support
- In-app help (top-right)
- Email support@jumanasoft.com
- Phone +966 11 XXX XXXX
```

---

## 5. Training videos

### Format

- 5-15 min each
- Screen recording + voice narration
- Arabic + English
- Captions auto-generated (AR + EN)

### Library (per module)

| Module | Video 1 | Video 2 | Video 3 |
|---|---|---|---|
| Patients | Register new patient | Search + chart | Merge duplicates |
| Encounters | OPD visit | IPD admission | Discharge |
| Pharmacy | E-prescribe | Dispense | Controlled substances |
| Lab | Order | Enter result | Verify + critical callback |
| Radiology | Order | Read + report | Critical notify |
| Surgery | Schedule | Pre-op checklist | Operative note |
| ER | Triage | Trauma | Disposition |
| Oncology | Regimen | Cycle | Response |
| Billing | Invoice | Payment | Refund |
| Insurance | Pre-auth | Claim | NPHIES |

### Tools

- **Loom** (record + edit)
- **YouTube** (host)
- **In-app embed** (help icon)

---

## 6. Training plan

### Per role

| Role | Duration | Format |
|---|---|---|
| Doctor | 2 days | Classroom + hands-on |
| Nurse | 2 days | Classroom + hands-on |
| Receptionist | 1 day | Classroom + hands-on |
| Pharmacist | 1 day | Classroom + hands-on |
| Lab Tech | 1 day | Classroom + hands-on |
| Radiologist | 1 day | Classroom + hands-on |
| Cashier | 0.5 day | Classroom + hands-on |
| Admin | 1 day | Classroom + hands-on |
| CMO | 0.5 day | Demo + Q&A |
| CFO | 0.5 day | Demo + Q&A |

### During implementation

- 2-week hyper-care
- Onsite trainer for first 3 days
- Remote support for remaining 11 days

### After go-live

- Weekly office hours (video call)
- Monthly webinar (new features)
- Quarterly onsite refresher

---

End of testing / i18n / user manual / training plan.
