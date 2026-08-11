-- filepath: .ai-brain/03_AUTOPILOT/seed_data.sql
-- Comprehensive seed data — Generated 2026-08-08
-- ICD-10, SNOMED-CT, SFDA drugs, facility types, RBAC roles
BEGIN;

-- ICD-10 codes (top 30)
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('I21.0', 'STEMI', 'احتشاء عضلة القلب الحاد مع ارتفاع ST') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('I21.4', 'NSTEMI', 'احتشاء عضلة القلب الحاد دون ارتفاع ST') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('I20.9', 'Angina', 'ذبحة صدرية غير محددة') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('I48.0', 'AF', 'رجفان أذيني') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('I50.9', 'Heart Failure', 'قصور القلب') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('J18.9', 'Pneumonia', 'التهاب رئوي') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('J44.0', 'COPD Acute', 'تفاقم COPD') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('E11.9', 'DM-T2', 'السكري من النوع الثاني') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('E10.9', 'DM-T1', 'السكري من النوع الأول') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('I10', 'Hypertension', 'ارتفاع ضغط الدم') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('K35.80', 'Appendicitis', 'التهاب الزائدة الدودية') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('K80.20', 'Cholecystitis', 'التهاب المرارة') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('N18.3', 'CKD-3', 'مرض الكلى المزمن المرحلة 3') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('N18.4', 'CKD-4', 'مرض الكلى المزمن المرحلة 4') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('N17.9', 'AKI', 'إصابة الكلى الحادة') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('C50.9', 'Breast Cancer', 'سرطان الثدي') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('C34.9', 'Lung Cancer', 'سرطان الرئة') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('C18.9', 'Colon Cancer', 'سرطان القولون') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('F32.9', 'Depression', 'اكتئاب') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('F41.9', 'Anxiety', 'قلق') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('M79.3', 'Arthritis', 'التهاب المفاصل') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('L40.0', 'Psoriasis', 'صدفية') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('H66.90', 'Otitis Media', 'التهاب الأذن الوسطى') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('J45.909', 'Asthma', 'ربو') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('A09.9', 'Gastroenteritis', 'التهاب المعدة والأمعاء') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('O80', 'Normal Delivery', 'ولادة طبيعية') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('O82', 'C-section', 'ولادة قيصرية') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('Z37.0', 'Live Birth', 'ولادة حية') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('S72.0', 'Hip Fracture', 'كسر الورك') ON CONFLICT (code) DO NOTHING;
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES ('S42.0', 'Clavicle Fracture', 'كسر الترقوة') ON CONFLICT (code) DO NOTHING;

-- SNOMED-CT codes (top 23)
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('12300007', 'ECG', 'تخطيط القلب الكهربائي') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('40733008', 'Infectious disease', 'مرض معدٍ') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('73211009', 'Diabetes mellitus', 'داء السكري') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('38341003', 'Hypertensive disorder', 'اضطراب ارتفاع الضغط') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('195967001', 'Asthma', 'ربو') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('13645005', 'COPD', 'مرض الانسداد الرئوي المزمن') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('84114007', 'Heart failure', 'قصور القلب') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('49436004', 'Atrial fibrillation', 'رجفان أذيني') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('22298006', 'Myocardial infarction', 'احتشاء عضلة القلب') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('233604007', 'Pneumonia', 'التهاب رئوي') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('34014006', 'Viral infection', 'عدوى فيروسية') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('271737000', 'Anemia', 'فقر الدم') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('84757009', 'Epilepsy', 'صرع') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('230690007', 'Cerebrovascular accident', 'سكتة دماغية') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('162864001', 'Body mass index', 'مؤشر كتلة الجسم') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('248342006', 'Anesthesia', 'تخدير') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('387713003', 'Surgical procedure', 'إجراء جراحي') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('77465005', 'Appendectomy', 'استئصال الزائدة') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('80146002', 'Appendicitis', 'التهاب الزائدة') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('74400008', 'Inflammation', 'التهاب') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('417532000', 'Cholecystectomy', 'استئصال المرارة') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('392021009', 'Lymphoma', 'ورم لمفي') ON CONFLICT (code) DO NOTHING;
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES ('91861009', 'Mental disorder', 'اضطراب عقلي') ON CONFLICT (code) DO NOTHING;

-- SFDA drugs (top 20)
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('ACET001', 'Paracetamol', 'باراسيتامول', 'N02BE01', 'Pain/Fever', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('AMOX001', 'Amoxicillin', 'أموكسيسيلين', 'J01CA04', 'Antibiotic', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('METO001', 'Metoprolol', 'ميتوبرولول', 'C07AB02', 'Beta-blocker', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('LISI001', 'Lisinopril', 'ليسينوبريل', 'C09AA03', 'ACE inhibitor', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('ASPI001', 'Aspirin', 'أسبرين', 'B01AC06', 'Antiplatelet', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('CLOP001', 'Clopidogrel', 'كلوبيدوجريل', 'B01AC04', 'Antiplatelet', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('WARF001', 'Warfarin', 'وارفارين', 'B01AA03', 'Anticoagulant', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('APIX001', 'Apixaban', 'أبيكسابان', 'B01AF02', 'DOAC', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('ATOR001', 'Atorvastatin', 'أتورفاستاتين', 'C10AA05', 'Statin', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('MET001', 'Metformin', 'ميتفورمين', 'A10BA02', 'Antidiabetic', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('OME001', 'Omeprazole', 'أوميبرازول', 'A02BC01', 'PPI', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('IBU001', 'Ibuprofen', 'إيبوبروفين', 'M01AE01', 'NSAID', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('PRED001', 'Prednisone', 'بريدنيزون', 'H02AB07', 'Corticosteroid', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('AMIO001', 'Amiodarone', 'أميودارون', 'C01BD01', 'Antiarrhythmic', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('FURO001', 'Furosemide', 'فوروسيميد', 'C03CA01', 'Diuretic', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('CETA001', 'Cetirizine', 'سيتريزين', 'R06AE07', 'Antihistamine', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('SALI001', 'Salbutamol', 'سالبوتامول', 'R03AC02', 'Bronchodilator', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('INSU001', 'Insulin', 'أنسولين', 'A10AB01', 'Antidiabetic', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('CLOZ001', 'Clozapine', 'كلوزابين', 'N05AH02', 'Antipsychotic', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES ('SERT001', 'Sertraline', 'سيرترالين', 'N06AB06', 'SSRI', TRUE) ON CONFLICT (code) DO NOTHING;

-- Facility types (16)
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('medical_city', 'مدينة طبية', 'Medical City') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('tertiary_hospital', 'مستشفى تخصصي', 'Tertiary Hospital') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('general_hospital', 'مستشفى عام', 'General Hospital') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('specialized_hospital', 'مستشفى متخصص', 'Specialized Hospital') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('polyclinic', 'مجمع طبي', 'Polyclinic') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('phc', 'مركز صحي أولي', 'Primary Health Center') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('specialty_center', 'مركز تخصصي', 'Specialty Center') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('diagnostic_center', 'مركز تشخيصي', 'Diagnostic Center') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('rehabilitation_center', 'مركز تأهيل', 'Rehabilitation Center') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('dialysis_center', 'مركز غسيل كلى', 'Dialysis Center') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('dental_center', 'مركز أسنان', 'Dental Center') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('mental_health_center', 'مركز صحة نفسية', 'Mental Health Center') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('home_healthcare_unit', 'وحدة رعاية منزلية', 'Home Healthcare Unit') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('mobile_clinic', 'عيادة متنقلة', 'Mobile Clinic') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('virtual_clinic', 'عيادة افتراضية', 'Virtual Clinic') ON CONFLICT (code) DO NOTHING;
INSERT INTO facility_types (code, name_ar, name_en) VALUES ('health_unit', 'وحدة صحية', 'Health Unit') ON CONFLICT (code) DO NOTHING;

-- RBAC roles (global, 11)
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('owner', 'مالك', 'Owner — full access', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('admin', 'مدير', 'Admin — manage users + settings', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('doctor', 'طبيب', 'Doctor — clinical per specialty', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('nurse', 'ممرض', 'Nurse — limited clinical', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('pharmacist', 'صيدلي', 'Pharmacist — pharmacy + drug check', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('lab_tech', 'فني مختبر', 'Lab Technician', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('rad_tech', 'فني أشعة', 'Radiology Technician', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('biller', 'محاسب', 'Biller — billing + coding', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('insurance_coordinator', 'منسق تأمين', 'Insurance Coordinator', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('quality_officer', 'مسؤول جودة', 'Quality Officer', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES ('viewer', 'مشاهد', 'Viewer — read-only', TRUE) ON CONFLICT (code) DO NOTHING;

COMMIT;

-- Generated: 2026-08-08T18:43:02.017752
-- Source: SEED_DATA in nm-seed-data.py