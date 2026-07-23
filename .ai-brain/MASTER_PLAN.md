# خطة العمل الشاملة — NamaMedical AI Ecosystem

> **الهدف**: بناء خطة عمل واضحة لتوليد `.ai-brain` للأقسام الناقصة، مع Multi-Agent، Autopilot، و Loop Engineering.
> **آخر تحديث**: 2026-07-22

---

## 1. المشكلة

- `.ai-brain` يحتوي على أقسام جزئية فقط.
- التطبيق `namaweb/public/js/app.js` يحتوي على routes لأقسام لا يوجد لها `station.js` مستقل.
- القائمة الكاملة للمستخدم تحتوي على **100+ قسم**، بينما `.ai-brain` يغطي حوالي 45 قسمًا.

---

## 2. الأهداف

1. إكمال `.ai-brain` لكل الأقسام المطلوبة (brain.md + 01-06).
2. إنشاء `station.js` للأقسام التي لها route في `app.js` بدون station.
3. تحديث `INDEX.md` و `DEPARTMENT_COVERAGE_MAP.md` بعد كل دفعة.
4. إنشاء سيناريوهات العمل وفلو البيانات الشامل.
5. استخدام Multi-Agent + Autopilot + Loop Engineering لتقليل التوكنز.

---

## 3. الفلسفة: Multi-Agent + Autopilot + Loop Engineering

### 3.1 Multi-Agent
كل "خبير" يتولى جزءًا محددًا:
- **CMO**: المواصفات السريرية (01).
- **Lead AI Engineer**: RAG/LangChain (02).
- **Principal Software Architect**: APIs/ERD (03).
- **Product/UX Lead**: Stitch UI (04).
- **Compliance Officer**: JCI/PDPL/CBAHI (05).
- **DevOps Lead**: خطة التنفيذ (06).
- **Master Orchestrator**: يركّب المخرجات في `brain.md`.

### 3.2 Autopilot
بدل توليد ملف واحد في كل turn، نولّع دفعات:
- **Batch A**: brain.md لمجموعة كاملة.
- **Batch B**: 01-06 لنفس المجموعة.
- **Batch C**: station.js + app.js notes.

### 3.3 Loop Engineering
لكل قسم:
```
Audit & Gap → Prompt Engineering → Backend → Frontend → QA/Compliance
```

---

## 4. الدفعات (Batches)

### الدفعة 0: التحضير
- [x] فحص `.ai-brain` الموجود.
- [x] فحص `namaweb/public/js/` و `app.js`.
- [x] إنشاء مهارات تخفيف التوكنز.
- [ ] إنشاء/تحديث `DEPARTMENT_COVERAGE_MAP.md`.
- [ ] إنشاء `STATION_MATCHER_REPORT.md`.

### الدفعة 1: الجراحة الناقصة (Surgical Subspecialties)
الأقسام التي لها route في `app.js` بدون station.js:
1. Neurosurgery
2. Orthopedics
3. Ophthalmology
4. ENT
5. Urology
6. Plastic & Burns
7. Pediatrics

لكل قسم:
- `brain.md`
- `01_clinical_spec.md`
- `02_ai_orchestration.md`
- `03_technical_arch.md`
- `04_ux_ui_stitch.md`
- `05_compliance_security.md`
- `06_implementation_plan.md`
- `<department>-station.js` (frontend)

### الدفعة 2: الباطنية الناقصة
- Cardiology subspecs: Interventional, Electrophysiology, Preventive, Nuclear, Cardio-Obstetrics, Cath Lab, PVD, Advanced Heart Failure.
- Respiratory subspecs: Allergic Pulmonology, Sleep Medicine, Respiratory Care, Bronchoscopy, Home Oxygen.
- Gastro subspecs: Advanced Endoscopy (EUS, ERCP, Enteroscopy), Hepatology, Pancreato-Biliary, GI Motility, Clinical Nutrition.
- Nephrology subspecs: Transplant, Dialysis (HD/PD/Home/Plasmapheresis/Pediatric).
- Endocrine subspecs: Diabetology (T1/T2/Gestational/Foot), Metabolic Bone, Obesity.
- Rheumatology/Immunology subspecs.
- Infectious subspecs: Infection Control, Tropical, ASP, Travel, Vaccination.
- Dermatology subspecs: Cosmetic, Dermatosurgery, Oncoderm, Phototherapy.
- Oncology/Hematology subspecs: Gyn Onc, Hematology, Coagulation, BMT (Auto/Allo/Cord).

### الدفعة 3: النساء/أطفال
- OB/GYN subspecs: MFM, Prenatal Diagnosis, Gyn Surgery, IVF/ICSI/IMSI/PGD/Cryo, Adolescent, Menopause, Urogynecology.
- Pediatrics subspecs: Neonatology, Genetics, Nutrition, Developmental, Pediatric Cardio/Nephro/Gastro/HemOnc/Ophth/ENT/Derm/Endo/Rheum/Ortho/Gen Surgery.

### الدفعة 4: التشخيص
- Radiology subspecs: Interventional, CT, MRI, Ultrasound, Nuclear Medicine.
- Laboratory subspecs: Pathology, Microbiology, Clinical Chemistry, Immunology, Genetics, Toxicology, Blood Bank.
- Functional Tests subspecs: ECG/Stress, Cerebral Angiography, Bronchial Angiography, EMG/Nerve Conduction, EEG, PFT, Sweat/Allergy.

### الدفعة 5: العناية/الطوارئ
- ER subspecs: Trauma Center, Chest Pain, Stroke, Psychiatric, Pediatric ER, Toxicology, Observation, Minor Surgery.
- ICU subspecs: Medical/Surgical/Trauma/CCU/Neuro/PICU/NICU/Burn/Oncology/Renal/Transplant/Obstetric ICU.
- Anesthesia subspecs: Obstetric, Pediatric, Cardiac, Pain Management, PACU, HBOT.

### الدفعة 6: الخدمات العلاجية والمساندة والإدارية
- Rehabilitation subspecs: PT, OT, Speech, Spinal Cord, Pediatric Rehab, Prosthetics, Child Life.
- Oncology Therapeutics: Radiation Oncology, Clinical Pharmacy.
- Integrative Medicine: TCM, Herbal, Aromatherapy, Music/Art/Massage/Yoga/Pet Therapy.
- Support Services: Nursing, Nutrition, Psychosocial, Logistics/Technical, Safety/Security.
- Admin & Academic: Executive, Quality/Accreditation, Education/Research, HR/Admin.
- Rare & Super-Specialized.

### الدفعة 7: التكامل
- تحديث `INDEX.md`.
- تحديث `DEPARTMENT_COVERAGE_MAP.md`.
- إنشاء `WORKFLOW_SCENARIOS_BY_GROUP.md`.
- إنشاء `STATION_MATCHER_REPORT.md`.

---

## 5. قواعد التوفير في التوكنز

1. **Reference, don't repeat**: الإشارة للوثائق المرجعية بالاسم/القسم فقط.
2. **Batch generation**: توليد 5-7 أقسام متشابهة في turn واحد.
3. **Use snippets**: استخدام `skills/shared/snippets.md`.
4. **Skeleton first**: brain.md أولاً، ثم 01-06.
5. **No verbose intros**: البدء مباشرة بالمحتوى.

---

## 6. قواعد السلامة

- لا secrets، لا PHI، لا أوامر نشر إنتاج بدون موافقة.
- كل ملف يذكر `requireTenantScope` + RLS + PHI vault + Golden Access Rule.
- التخطيط فقط في `.ai-brain`؛ لا تعديل `namaweb/server.js` أو `db_postgres.js` إلا بطلب منفصل.

---

## 7. المهارات المستخدمة

- `nm-ai-brain-master-orchestrator`
- `nm-ai-brain-autopilot`
- `nm-ai-brain-loop-engineering`
- `nm-ai-brain-department-generator`
- `nm-ai-brain-station-matcher`
- `nm-ai-brain-frontend-bridge`
- `nm-ai-brain-index-manager`
- `nm-ai-brain-workflow-scribe`
- `nm-ai-brain-token-saver`

---

## 8. الخطوة التالية المقترحة

الموافقة على الدفعة 1 (الجراحة الناقصة: Neurosurgery, Orthopedics, Ophthalmology, ENT, Urology, Plastic & Burns, Pediatrics) وبدء التوليد.
