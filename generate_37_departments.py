import os
import json

base_path = r"d:\NamaMedical\docs"

groups = [
    ("02", "pulmonology", "Pulmonology", "الأمراض الصدرية"),
    ("04", "nephrology", "Nephrology", "أمراض الكلى"),
    ("05", "hemato_oncology", "Hematology & Oncology", "أمراض الدم والأورام"),
    ("06", "endocrine_diabetes", "Endocrinology & Diabetes", "الغدد الصماء والسكري"),
    ("07", "rheum_immunology", "Rheumatology & Immunology", "الروماتيزم والمناعة"),
    ("08", "infectious_diseases", "Infectious Diseases", "الأمراض المعدية"),
    ("09", "dermatology", "Dermatology", "الجلدية"),
    ("10", "general_surgery", "General Surgery", "الجراحة العامة"),
    ("11", "cts_vascular_surgery", "CTS & Vascular Surgery", "جراحة القلب والأوعية الدموية"),
    ("12", "neurosurgery_spine", "Neurosurgery & Spine", "جراحة المخ والأعصاب والعمود الفقري"),
    ("13", "orthopedics", "Orthopedics", "جراحة العظام"),
    ("14", "ophthalmology", "Ophthalmology", "طب العيون"),
    ("15", "ent", "ENT", "الأنف والأذن والحنجرة"),
    ("16", "urology", "Urology", "المسالك البولية"),
    ("17", "plastic_burns", "Plastic Surgery & Burns", "جراحة التجميل والحروق"),
    ("18", "obgyn", "OBGYN", "النساء والولادة"),
    ("19", "neonatal_pediatrics", "Neonatal & Pediatrics", "طب الأطفال وحديثي الولادة"),
    ("20", "pediatric_subspec", "Pediatric Subspecialties", "تخصصات الأطفال الدقيقة"),
    ("21", "radiology_imaging", "Radiology & Imaging", "الأشعة والتصوير الطبي"),
    ("22", "laboratories", "Laboratories", "المختبرات"),
    ("23", "functional_diagnostics", "Functional Diagnostics", "التشخيص الوظيفي"),
    ("25", "intensive_care", "Intensive Care", "العناية المركزة"),
    ("26", "anesthesia_pain", "Anesthesia & Pain Management", "التخدير وعلاج الألم"),
    ("27", "rehab_pt", "Rehabilitation & PT", "التأهيل والعلاج الطبيعي"),
    ("28", "radiation_pharmacy", "Radiation & Pharmacy", "الإشعاع والصيدلة"),
    ("29", "integrative_medicine", "Integrative Medicine", "الطب التكاملي"),
    ("30", "nursing", "Nursing", "التمريض"),
    ("31", "nutrition", "Nutrition", "التغذية"),
    ("32", "social_psych", "Social & Psychology", "الخدمة الاجتماعية والنفسية"),
    ("33", "logistics_it", "Logistics & IT", "اللوجستيات وتقنية المعلومات"),
    ("34", "security_safety", "Security & Safety", "الأمن والسلامة"),
    ("35", "executive", "Executive", "الإدارة التنفيذية"),
    ("36", "quality_accreditation", "Quality & Accreditation", "الجودة والاعتماد"),
    ("37", "education_research", "Education & Research", "التعليم والأبحاث"),
    ("38", "hr_admin", "HR & Admin", "الموارد البشرية والإدارة"),
    ("39", "centers_of_excellence", "Centers of Excellence", "مراكز التميز"),
    ("40", "rare_advanced", "Rare & Advanced Diseases", "الأمراض النادرة والمتقدمة")
]

# Create directories if they don't exist
dirs = ["openapi", "seeders", "migrations", "erd", "i18n", "tests"]
for d in dirs:
    os.makedirs(os.path.join(base_path, d), exist_ok=True)

# Templates
openapi_tpl = """openapi: 3.1.0
info:
  title: NamaMedical — {en_name} API
  version: 0.1.0
  description: |
    {en_name} service. Inherits common schemas from `components.base.yaml`.

servers:
  - url: https://api.nama.local

tags:
  - {{ name: orders }}
  - {{ name: results }}

paths:
  /api/v1/{key}/orders:
    get:
      tags: [orders]
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: {{ type: array, items: {{ $ref: '#/components/schemas/DeptOrder' }} }}
    post:
      tags: [orders]
      requestBody:
        required: true
        content:
          application/json:
            schema: {{ $ref: '#/components/schemas/DeptOrderInput' }}
      responses:
        '201':
          content: {{ application/json: {{ schema: {{ $ref: '#/components/schemas/DeptOrder' }} }} }}

components:
  schemas:
    DeptOrderInput:
      type: object
      required: [patient_id, type]
      properties:
        patient_id: {{ type: string }}
        type:       {{ type: string }}
        priority:   {{ type: string, enum: [routine, urgent, stat, emergent] }}
        notes:      {{ type: string }}
    DeptOrder:
      allOf:
        - {{ $ref: '#/components/schemas/DeptOrderInput' }}
        - type: object
          properties:
            id:         {{ type: string, format: uuid }}
            status:     {{ type: string }}
            ordered_at: {{ type: string, format: date-time }}
"""

seeder_tpl = """-- {en_name} Seed Data
USE master;
GO

DECLARE @dept_patient NVARCHAR(20) = 'P-900001';

IF NOT EXISTS (SELECT 1 FROM {key}_orders WHERE patient_id = @dept_patient)
BEGIN
    INSERT INTO {key}_orders (id, patient_id, type, priority, status, notes)
    VALUES 
    (NEWID(), @dept_patient, 'consultation', 'routine', 'completed', 'Initial {en_name} consult'),
    (NEWID(), @dept_patient, 'procedure', 'urgent', 'scheduled', 'Urgent {en_name} procedure');
END
GO
PRINT 'Seeded {en_name} data';
GO
"""

migration_tpl = """-- Migration: 001_create_{key}_tables.sql
-- Up
CREATE TABLE {key}_orders (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    patient_id NVARCHAR(20) NOT NULL,
    type NVARCHAR(50) NOT NULL,
    priority NVARCHAR(20) NOT NULL,
    status NVARCHAR(20) NOT NULL,
    notes NVARCHAR(MAX),
    ordered_at DATETIME DEFAULT GETDATE()
);

-- Down
DROP TABLE {key}_orders;
"""

erd_tpl = """Table {key}_orders {{
  id uuid [pk]
  patient_id varchar [ref: > patients.mrn]
  type varchar
  priority varchar [note: 'routine, urgent, stat, emergent']
  status varchar
  notes text
  ordered_at datetime
}}
"""

test_tpl = """# {en_name} Test Plan
Target: `api.nama.local/api/v1/{key}/*`

## 1. Order Creation
- **Action**: Create a new `{key}` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `{key}` module.
- **Expected**: HTTP 200 OK.
"""

for num, key, en_name, ar_name in groups:
    # 1. OpenAPI
    with open(os.path.join(base_path, "openapi", f"{key}.yaml"), "w", encoding="utf-8") as f:
        f.write(openapi_tpl.format(key=key, en_name=en_name))
    
    # 2. Seeder
    with open(os.path.join(base_path, "seeders", f"{key}_seed.sql"), "w", encoding="utf-8") as f:
        f.write(seeder_tpl.format(key=key, en_name=en_name))
        
    # 3. Migration
    mig_dir = os.path.join(base_path, "migrations", key)
    os.makedirs(mig_dir, exist_ok=True)
    with open(os.path.join(mig_dir, "001_initial.sql"), "w", encoding="utf-8") as f:
        f.write(migration_tpl.format(key=key))
        
    # 4. ERD
    with open(os.path.join(base_path, "erd", f"{key}.dbml"), "w", encoding="utf-8") as f:
        f.write(erd_tpl.format(key=key))
        
    # 5. i18n EN
    en_json = json.dumps(
        {
            key: {
                "dashboard": {
                    "title": f"{en_name} Dashboard",
                    "todayOrders": "Today's Orders"
                },
                "order": {
                    "priority": {
                        "routine": "Routine",
                        "urgent": "Urgent",
                        "stat": "STAT"
                    }
                }
            }
        },
        indent=2
    )
    with open(os.path.join(base_path, "i18n", f"{key}.en.json"), "w", encoding="utf-8") as f:
        f.write(en_json)

    # i18n AR
    ar_json = json.dumps(
        {
            key: {
                "dashboard": {
                    "title": f"لوحة {ar_name}",
                    "todayOrders": "طلبات اليوم"
                },
                "order": {
                    "priority": {
                        "routine": "روتيني",
                        "urgent": "عاجل",
                        "stat": "طارئ"
                    }
                }
            }
        },
        ensure_ascii=False, indent=2
    )
    with open(os.path.join(base_path, "i18n", f"{key}.ar.json"), "w", encoding="utf-8") as f:
        f.write(ar_json)
        
    # 6. Tests
    with open(os.path.join(base_path, "tests", f"{key}_test.md"), "w", encoding="utf-8") as f:
        f.write(test_tpl.format(key=key, en_name=en_name))

print("Successfully generated all 222 artifact files for the 37 remaining clinical departments.")
