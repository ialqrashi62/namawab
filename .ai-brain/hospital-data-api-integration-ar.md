# 🗄️ مخطط البيانات وواجهات البرمجة والتكامل (Data Model, API & Integration Plan)

**التاريخ**: 2026-07-06 | **الحالة**: معتمد (GATE 10) | **القيود**: تخطيط وتصميم فقط — يمنع تشغيل DDL أو Migration

---

## 1. نموذج قاعدة البيانات والجداول المقترحة (Proposed Schema)

لتنفيذ الأقسام المفقودة وعالية الأهمية، نقترح المخططات التالية للـ SQL مع تطبيق قيود SaaS المستأجرين وعزل البيانات:

### 1. جدول سجلات التخدير (`anesthesia_records`):
```sql
CREATE TABLE anesthesia_records (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,               -- عزل المستأجرين
    surgery_id INTEGER REFERENCES surgeries(id),
    patient_id INTEGER NOT NULL,
    asa_classification VARCHAR(16) NOT NULL,  -- ASA I - VI
    mallampati_score INTEGER CHECK (mallampati_score BETWEEN 1 AND 4),
    induction_time TIMESTAMPTZ,
    extubation_time TIMESTAMPTZ,
    anesthetic_agents JSONB,                  -- الأدوية والجرعات والتوقيت
    complications TEXT,
    anesthesiologist_id INTEGER NOT NULL,
    status VARCHAR(32) DEFAULT 'Pending',     -- Pending, Administered, Completed
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_anesthesia_tenant_patient ON anesthesia_records(tenant_id, patient_id);
```

### 2. جدول إفاقة PACU (`pacu_records`):
```sql
CREATE TABLE pacu_records (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    surgery_id INTEGER REFERENCES surgeries(id),
    patient_id INTEGER NOT NULL,
    admission_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    aldrete_score INTEGER CHECK (aldrete_score BETWEEN 0 AND 10),
    discharge_time TIMESTAMPTZ,
    destination VARCHAR(64),                  -- Ward, ICU, Home
    discharge_authorized_by INTEGER,
    status VARCHAR(32) DEFAULT 'Monitoring',  -- Monitoring, Discharged
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_pacu_tenant_patient ON pacu_records(tenant_id, patient_id);
```

### 3. جدول بلاغات الحوادث OVR (`ovr_reports`):
```sql
CREATE TABLE ovr_reports (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    reporter_id INTEGER,                      -- NULL في حال البلاغ السري
    event_time TIMESTAMPTZ NOT NULL,
    location VARCHAR(255) NOT NULL,
    event_type VARCHAR(128) NOT NULL,         -- Medication Error, Fall, Device Failure
    harm_level VARCHAR(64) NOT NULL,          -- No Harm, Mild, Moderate, Severe, Death
    description TEXT NOT NULL,
    immediate_actions TEXT,
    root_cause_analysis TEXT,                 -- يُعبأ من الجودة
    preventive_actions TEXT,                  -- يُعبأ من الجودة
    status VARCHAR(32) DEFAULT 'Submitted'    -- Submitted, Under Investigation, Closed
);
CREATE INDEX idx_ovr_tenant_status ON ovr_reports(tenant_id, status);
```

---

## 🌐 تصميم واجهات البرمجة (API Design)

| المسار (Route) | الطريقة (Method) | المدخلات (Body / Query) | المخرجات المتوقعة | قواعد التحقق (Validation) |
|---|---|---|---|---|
| `/api/anesthesia/pre-op` | `POST` | `surgery_id`, `asa_classification`, `mallampati_score` | `{ success: true, record_id: 12 }` | يجب أن يكون الدور طبيب تخدير؛ قيام فحص مجرى الهواء |
| `/api/pacu/discharge` | `PUT` | `aldrete_score`, `destination` | `{ success: true, status: 'Discharged' }` | منع الصرف خارج PACU إذا Score < 9 بدون استثناء استشاري |
| `/api/ovr/submit` | `POST` | `event_type`, `harm_level`, `description` | `{ success: true, reference_number: 'OVR-2026-001' }` | لا يُطلب توقيع رقمي أو هوية الموظف إذا تم اختياره سرياً |
| `/api/insurance/eligibility`| `POST` | `patient_id`, `insurance_company_id` | `{ eligible: true, coverage_pct: 90 }` | استجابة FHIR مطابقة لبوابة NPHIES |

---

## 🔗 خطة التكامل مع الأنظمة الطبية والوطنية (Integration & Interoperability)

تعتمد المنصة على معايير التكامل العالمية لضمان سهولة التوصيل والتشغيل:

### 1. التكامل مع المختبر والأشعة (HL7/FHIR):
- يتم إرسال طلبات الفحوصات (Orders) إلكترونياً باستخدام رسائل HL7 ORM.
- يتم استقبال نتائج المختبر وتقارير الأشعة باستخدام رسائل HL7 ORU وتحديث ملف المريض تلقائياً مع تنبيه الطبيب بالنتائج الحرجة.

### 2. التكامل مع بوابة التأمين الوطنية NPHIES:
- استخدام معايير FHIR (Fast Healthcare Interoperability Resources) لتمثيل طلبات الأهلية (CoverageEligibilityRequest) والموافقات الطبية (Claim/PriorAuthorization) وإرسالها مشفرة عبر قنوات الويب الآمنة.

### 3. التكامل مع الفوترة السعودية ZATCA (المرحلة الثانية - الربط والكامل):
- يولد النظام فاتورة XML مطابقة لمعايير الهيئة وتوقيعها رقمياً بالـ cryptographic stamp (الختم الرقمي) باستخدام الـ CSID المخصص لكل فرع ومستأجر، ثم دفعها فورياً لبوابة الفاتورة الإلكترونية لضمان الامتثال التام.
