#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-seed-migration.py
Generates migration file that seeds reference data (ICD-10, SNOMED, drugs, etc.).
Output: namaweb/migrations/e61_reference_data_seed_up.sql + _down.sql
"""
import io
import os
import sys
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
MIG_DIR = WORKSPACE / "namaweb/migrations"


def make_up_migration(date):
    return f"""-- filepath: namaweb/migrations/e61_reference_data_seed_up.sql
-- Reference Data Seed — Generated {date}
-- Inserts ICD-10, SNOMED-CT, SFDA drugs, facility types, RBAC roles
BEGIN;

-- ====== ICD-10 codes (top 30) ======
INSERT INTO icd10_codes (code, name_en, name_ar) VALUES
('I21.0', 'STEMI', 'احتشاء عضلة القلب الحاد مع ارتفاع ST'),
('I21.4', 'NSTEMI', 'احتشاء عضلة القلب الحاد دون ارتفاع ST'),
('I20.9', 'Angina', 'ذبحة صدرية غير محددة'),
('I48.0', 'AF', 'رجفان أذيني'),
('I50.9', 'Heart Failure', 'قصور القلب'),
('J18.9', 'Pneumonia', 'التهاب رئوي'),
('J44.0', 'COPD Acute', 'تفاقم COPD'),
('E11.9', 'DM-T2', 'السكري من النوع الثاني'),
('E10.9', 'DM-T1', 'السكري من النوع الأول'),
('I10', 'Hypertension', 'ارتفاع ضغط الدم'),
('K35.80', 'Appendicitis', 'التهاب الزائدة الدودية'),
('K80.20', 'Cholecystitis', 'التهاب المرارة'),
('N18.3', 'CKD-3', 'مرض الكلى المزمن المرحلة 3'),
('N18.4', 'CKD-4', 'مرض الكلى المزمن المرحلة 4'),
('N17.9', 'AKI', 'إصابة الكلى الحادة'),
('C50.9', 'Breast Cancer', 'سرطان الثدي'),
('C34.9', 'Lung Cancer', 'سرطان الرئة'),
('C18.9', 'Colon Cancer', 'سرطان القولون'),
('F32.9', 'Depression', 'اكتئاب'),
('F41.9', 'Anxiety', 'قلق'),
('M79.3', 'Arthritis', 'التهاب المفاصل'),
('L40.0', 'Psoriasis', 'صدفية'),
('H66.90', 'Otitis Media', 'التهاب الأذن الوسطى'),
('J45.909', 'Asthma', 'ربو'),
('A09.9', 'Gastroenteritis', 'التهاب المعدة والأمعاء'),
('O80', 'Normal Delivery', 'ولادة طبيعية'),
('O82', 'C-section', 'ولادة قيصرية'),
('Z37.0', 'Live Birth', 'ولادة حية'),
('S72.0', 'Hip Fracture', 'كسر الورك'),
('S42.0', 'Clavicle Fracture', 'كسر الترقوة')
ON CONFLICT (code) DO NOTHING;

-- ====== SNOMED-CT codes (top 23) ======
INSERT INTO snomed_codes (code, name_en, name_ar) VALUES
('12300007', 'ECG', 'تخطيط القلب الكهربائي'),
('40733008', 'Infectious disease', 'مرض معدٍ'),
('73211009', 'Diabetes mellitus', 'داء السكري'),
('38341003', 'Hypertensive disorder', 'اضطراب ارتفاع الضغط'),
('195967001', 'Asthma', 'ربو'),
('13645005', 'COPD', 'مرض الانسداد الرئوي المزمن'),
('84114007', 'Heart failure', 'قصور القلب'),
('49436004', 'Atrial fibrillation', 'رجفان أذيني'),
('22298006', 'Myocardial infarction', 'احتشاء عضلة القلب'),
('233604007', 'Pneumonia', 'التهاب رئوي'),
('34014006', 'Viral infection', 'عدوى فيروسية'),
('271737000', 'Anemia', 'فقر الدم'),
('84757009', 'Epilepsy', 'صرع'),
('230690007', 'Cerebrovascular accident', 'سكتة دماغية'),
('162864001', 'Body mass index', 'مؤشر كتلة الجسم'),
('248342006', 'Anesthesia', 'تخدير'),
('387713003', 'Surgical procedure', 'إجراء جراحي'),
('77465005', 'Appendectomy', 'استئصال الزائدة'),
('80146002', 'Appendicitis', 'التهاب الزائدة'),
('74400008', 'Inflammation', 'التهاب'),
('417532000', 'Cholecystectomy', 'استئصال المرارة'),
('392021009', 'Lymphoma', 'ورم لمفي'),
('91861009', 'Mental disorder', 'اضطراب عقلي')
ON CONFLICT (code) DO NOTHING;

-- ====== SFDA drugs (top 20) ======
INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) VALUES
('ACET001', 'Paracetamol', 'باراسيتامول', 'N02BE01', 'Pain/Fever', TRUE),
('AMOX001', 'Amoxicillin', 'أموكسيسيلين', 'J01CA04', 'Antibiotic', TRUE),
('METO001', 'Metoprolol', 'ميتوبرولول', 'C07AB02', 'Beta-blocker', TRUE),
('LISI001', 'Lisinopril', 'ليسينوبريل', 'C09AA03', 'ACE inhibitor', TRUE),
('ASPI001', 'Aspirin', 'أسبرين', 'B01AC06', 'Antiplatelet', TRUE),
('CLOP001', 'Clopidogrel', 'كلوبيدوجريل', 'B01AC04', 'Antiplatelet', TRUE),
('WARF001', 'Warfarin', 'وارفارين', 'B01AA03', 'Anticoagulant', TRUE),
('APIX001', 'Apixaban', 'أبيكسابان', 'B01AF02', 'DOAC', TRUE),
('ATOR001', 'Atorvastatin', 'أتورفاستاتين', 'C10AA05', 'Statin', TRUE),
('MET001', 'Metformin', 'ميتفورمين', 'A10BA02', 'Antidiabetic', TRUE),
('OME001', 'Omeprazole', 'أوميبرازول', 'A02BC01', 'PPI', TRUE),
('IBU001', 'Ibuprofen', 'إيبوبروفين', 'M01AE01', 'NSAID', TRUE),
('PRED001', 'Prednisone', 'بريدنيزون', 'H02AB07', 'Corticosteroid', TRUE),
('AMIO001', 'Amiodarone', 'أميودارون', 'C01BD01', 'Antiarrhythmic', TRUE),
('FURO001', 'Furosemide', 'فوروسيميد', 'C03CA01', 'Diuretic', TRUE),
('CETA001', 'Cetirizine', 'سيتريزين', 'R06AE07', 'Antihistamine', TRUE),
('SALI001', 'Salbutamol', 'سالبوتامول', 'R03AC02', 'Bronchodilator', TRUE),
('INSU001', 'Insulin', 'أنسولين', 'A10AB01', 'Antidiabetic', TRUE),
('CLOZ001', 'Clozapine', 'كلوزابين', 'N05AH02', 'Antipsychotic', TRUE),
('SERT001', 'Sertraline', 'سيرترالين', 'N06AB06', 'SSRI', TRUE)
ON CONFLICT (code) DO NOTHING;

-- ====== Facility types (16) ======
INSERT INTO facility_types (code, name_ar, name_en) VALUES
('medical_city', 'مدينة طبية', 'Medical City'),
('tertiary_hospital', 'مستشفى تخصصي', 'Tertiary Hospital'),
('general_hospital', 'مستشفى عام', 'General Hospital'),
('specialized_hospital', 'مستشفى متخصص', 'Specialized Hospital'),
('polyclinic', 'مجمع طبي', 'Polyclinic'),
('phc', 'مركز صحي أولي', 'Primary Health Center'),
('specialty_center', 'مركز تخصصي', 'Specialty Center'),
('diagnostic_center', 'مركز تشخيصي', 'Diagnostic Center'),
('rehabilitation_center', 'مركز تأهيل', 'Rehabilitation Center'),
('dialysis_center', 'مركز غسيل كلى', 'Dialysis Center'),
('dental_center', 'مركز أسنان', 'Dental Center'),
('mental_health_center', 'مركز صحة نفسية', 'Mental Health Center'),
('home_healthcare_unit', 'وحدة رعاية منزلية', 'Home Healthcare Unit'),
('mobile_clinic', 'عيادة متنقلة', 'Mobile Clinic'),
('virtual_clinic', 'عيادة افتراضية', 'Virtual Clinic'),
('health_unit', 'وحدة صحية', 'Health Unit')
ON CONFLICT (code) DO NOTHING;

-- ====== RBAC roles (11 global) ======
INSERT INTO rbac_roles (code, name_ar, description, is_global) VALUES
('owner', 'مالك', 'Owner — full access', TRUE),
('admin', 'مدير', 'Admin — manage users + settings', TRUE),
('doctor', 'طبيب', 'Doctor — clinical per specialty', TRUE),
('nurse', 'ممرض', 'Nurse — limited clinical', TRUE),
('pharmacist', 'صيدلي', 'Pharmacist — pharmacy + drug check', TRUE),
('lab_tech', 'فني مختبر', 'Lab Technician', TRUE),
('rad_tech', 'فني أشعة', 'Radiology Technician', TRUE),
('biller', 'محاسب', 'Biller — billing + coding', TRUE),
('insurance_coordinator', 'منسق تأمين', 'Insurance Coordinator', TRUE),
('quality_officer', 'مسؤول جودة', 'Quality Officer', TRUE),
('viewer', 'مشاهد', 'Viewer — read-only', TRUE)
ON CONFLICT (code) DO NOTHING;

COMMIT;
"""


def make_down_migration(date):
    return f"""-- filepath: namaweb/migrations/e61_reference_data_seed_down.sql
-- Reference Data Seed DOWN — Generated {date}
-- Reverse of e61_reference_data_seed_up.sql (NON-DESTRUCTIVE: only deletes what we added)
BEGIN;

DELETE FROM rbac_roles WHERE code IN (
  'owner', 'admin', 'doctor', 'nurse', 'pharmacist',
  'lab_tech', 'rad_tech', 'biller', 'insurance_coordinator',
  'quality_officer', 'viewer'
) AND is_global = TRUE;

DELETE FROM facility_types WHERE code IN (
  'medical_city', 'tertiary_hospital', 'general_hospital', 'specialized_hospital',
  'polyclinic', 'phc', 'specialty_center', 'diagnostic_center',
  'rehabilitation_center', 'dialysis_center', 'dental_center',
  'mental_health_center', 'home_healthcare_unit', 'mobile_clinic',
  'virtual_clinic', 'health_unit'
);

DELETE FROM sfda_drugs WHERE code IN (
  'ACET001', 'AMOX001', 'METO001', 'LISI001', 'ASPI001',
  'CLOP001', 'WARF001', 'APIX001', 'ATOR001', 'MET001',
  'OME001', 'IBU001', 'PRED001', 'AMIO001', 'FURO001',
  'CETA001', 'SALI001', 'INSU001', 'CLOZ001', 'SERT001'
);

DELETE FROM snomed_codes WHERE code IN (
  '12300007', '40733008', '73211009', '38341003', '195967001',
  '13645005', '84114007', '49436004', '22298006', '233604007',
  '34014006', '271737000', '84757009', '230690007', '162864001',
  '248342006', '387713003', '77465005', '80146002', '74400008',
  '417532000', '392021009', '91861009'
);

DELETE FROM icd10_codes WHERE code IN (
  'I21.0', 'I21.4', 'I20.9', 'I48.0', 'I50.9',
  'J18.9', 'J44.0', 'E11.9', 'E10.9', 'I10',
  'K35.80', 'K80.20', 'N18.3', 'N18.4', 'N17.9',
  'C50.9', 'C34.9', 'C18.9', 'F32.9', 'F41.9',
  'M79.3', 'L40.0', 'H66.90', 'J45.909', 'A09.9',
  'O80', 'O82', 'Z37.0', 'S72.0', 'S42.0'
);

COMMIT;
"""


def main():
    date = datetime.now().strftime("%Y-%m-%d")
    up_path = MIG_DIR / "e61_reference_data_seed_up.sql"
    down_path = MIG_DIR / "e61_reference_data_seed_down.sql"

    if up_path.exists():
        print(f"[SKIP] {up_path.name} already exists")
        return

    up_path.write_text(make_up_migration(date), encoding="utf-8")
    down_path.write_text(make_down_migration(date), encoding="utf-8")

    print(f"[OK] Created {up_path.name}")
    print(f"[OK] Created {down_path.name}")
    print(f"[STATS] 30 ICD-10, 23 SNOMED, 20 drugs, 16 facility, 11 roles")


if __name__ == "__main__":
    main()
