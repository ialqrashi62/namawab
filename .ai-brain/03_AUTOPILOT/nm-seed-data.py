#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-seed-data.py
Loads ICD-10, SNOMED-CT, SFDA drugs, and reference data into the database.
"""
import io
import os
import sys
import yaml
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")


# Comprehensive seed data
SEED_DATA = {
    "icd10_top": [
        ("I21.0", "STEMI", "احتشاء عضلة القلب الحاد مع ارتفاع ST"),
        ("I21.4", "NSTEMI", "احتشاء عضلة القلب الحاد دون ارتفاع ST"),
        ("I20.9", "Angina", "ذبحة صدرية غير محددة"),
        ("I48.0", "AF", "رجفان أذيني"),
        ("I50.9", "Heart Failure", "قصور القلب"),
        ("J18.9", "Pneumonia", "التهاب رئوي"),
        ("J44.0", "COPD Acute", "تفاقم COPD"),
        ("E11.9", "DM-T2", "السكري من النوع الثاني"),
        ("E10.9", "DM-T1", "السكري من النوع الأول"),
        ("I10", "Hypertension", "ارتفاع ضغط الدم"),
        ("K35.80", "Appendicitis", "التهاب الزائدة الدودية"),
        ("K80.20", "Cholecystitis", "التهاب المرارة"),
        ("N18.3", "CKD-3", "مرض الكلى المزمن المرحلة 3"),
        ("N18.4", "CKD-4", "مرض الكلى المزمن المرحلة 4"),
        ("N17.9", "AKI", "إصابة الكلى الحادة"),
        ("C50.9", "Breast Cancer", "سرطان الثدي"),
        ("C34.9", "Lung Cancer", "سرطان الرئة"),
        ("C18.9", "Colon Cancer", "سرطان القولون"),
        ("F32.9", "Depression", "اكتئاب"),
        ("F41.9", "Anxiety", "قلق"),
        ("M79.3", "Arthritis", "التهاب المفاصل"),
        ("L40.0", "Psoriasis", "صدفية"),
        ("H66.90", "Otitis Media", "التهاب الأذن الوسطى"),
        ("J45.909", "Asthma", "ربو"),
        ("A09.9", "Gastroenteritis", "التهاب المعدة والأمعاء"),
        ("O80", "Normal Delivery", "ولادة طبيعية"),
        ("O82", "C-section", "ولادة قيصرية"),
        ("Z37.0", "Live Birth", "ولادة حية"),
        ("S72.0", "Hip Fracture", "كسر الورك"),
        ("S42.0", "Clavicle Fracture", "كسر الترقوة"),
    ],

    "snomed_top": [
        ("12300007", "ECG", "تخطيط القلب الكهربائي"),
        ("40733008", "Infectious disease", "مرض معدٍ"),
        ("73211009", "Diabetes mellitus", "داء السكري"),
        ("38341003", "Hypertensive disorder", "اضطراب ارتفاع الضغط"),
        ("195967001", "Asthma", "ربو"),
        ("13645005", "COPD", "مرض الانسداد الرئوي المزمن"),
        ("84114007", "Heart failure", "قصور القلب"),
        ("49436004", "Atrial fibrillation", "رجفان أذيني"),
        ("22298006", "Myocardial infarction", "احتشاء عضلة القلب"),
        ("233604007", "Pneumonia", "التهاب رئوي"),
        ("34014006", "Viral infection", "عدوى فيروسية"),
        ("271737000", "Anemia", "فقر الدم"),
        ("84757009", "Epilepsy", "صرع"),
        ("230690007", "Cerebrovascular accident", "سكتة دماغية"),
        ("162864001", "Body mass index", "مؤشر كتلة الجسم"),
        ("248342006", "Anesthesia", "تخدير"),
        ("387713003", "Surgical procedure", "إجراء جراحي"),
        ("77465005", "Appendectomy", "استئصال الزائدة"),
        ("80146002", "Appendicitis", "التهاب الزائدة"),
        ("74400008", "Inflammation", "التهاب"),
        ("417532000", "Cholecystectomy", "استئصال المرارة"),
        ("392021009", "Lymphoma", "ورم لمفي"),
        ("91861009", "Mental disorder", "اضطراب عقلي"),
    ],

    "sfda_drugs_top": [
        ("ACET001", "Paracetamol", "باراسيتامول", "N02BE01", "Pain/Fever"),
        ("AMOX001", "Amoxicillin", "أموكسيسيلين", "J01CA04", "Antibiotic"),
        ("METO001", "Metoprolol", "ميتوبرولول", "C07AB02", "Beta-blocker"),
        ("LISI001", "Lisinopril", "ليسينوبريل", "C09AA03", "ACE inhibitor"),
        ("ASPI001", "Aspirin", "أسبرين", "B01AC06", "Antiplatelet"),
        ("CLOP001", "Clopidogrel", "كلوبيدوجريل", "B01AC04", "Antiplatelet"),
        ("WARF001", "Warfarin", "وارفارين", "B01AA03", "Anticoagulant"),
        ("APIX001", "Apixaban", "أبيكسابان", "B01AF02", "DOAC"),
        ("ATOR001", "Atorvastatin", "أتورفاستاتين", "C10AA05", "Statin"),
        ("MET001", "Metformin", "ميتفورمين", "A10BA02", "Antidiabetic"),
        ("OME001", "Omeprazole", "أوميبرازول", "A02BC01", "PPI"),
        ("IBU001", "Ibuprofen", "إيبوبروفين", "M01AE01", "NSAID"),
        ("PRED001", "Prednisone", "بريدنيزون", "H02AB07", "Corticosteroid"),
        ("AMIO001", "Amiodarone", "أميودارون", "C01BD01", "Antiarrhythmic"),
        ("FURO001", "Furosemide", "فوروسيميد", "C03CA01", "Diuretic"),
        ("CETA001", "Cetirizine", "سيتريزين", "R06AE07", "Antihistamine"),
        ("SALI001", "Salbutamol", "سالبوتامول", "R03AC02", "Bronchodilator"),
        ("INSU001", "Insulin", "أنسولين", "A10AB01", "Antidiabetic"),
        ("CLOZ001", "Clozapine", "كلوزابين", "N05AH02", "Antipsychotic"),
        ("SERT001", "Sertraline", "سيرترالين", "N06AB06", "SSRI"),
    ],

    "facility_types": [
        ("medical_city", "مدينة طبية", "Medical City"),
        ("tertiary_hospital", "مستشفى تخصصي", "Tertiary Hospital"),
        ("general_hospital", "مستشفى عام", "General Hospital"),
        ("specialized_hospital", "مستشفى متخصص", "Specialized Hospital"),
        ("polyclinic", "مجمع طبي", "Polyclinic"),
        ("phc", "مركز صحي أولي", "Primary Health Center"),
        ("specialty_center", "مركز تخصصي", "Specialty Center"),
        ("diagnostic_center", "مركز تشخيصي", "Diagnostic Center"),
        ("rehabilitation_center", "مركز تأهيل", "Rehabilitation Center"),
        ("dialysis_center", "مركز غسيل كلى", "Dialysis Center"),
        ("dental_center", "مركز أسنان", "Dental Center"),
        ("mental_health_center", "مركز صحة نفسية", "Mental Health Center"),
        ("home_healthcare_unit", "وحدة رعاية منزلية", "Home Healthcare Unit"),
        ("mobile_clinic", "عيادة متنقلة", "Mobile Clinic"),
        ("virtual_clinic", "عيادة افتراضية", "Virtual Clinic"),
        ("health_unit", "وحدة صحية", "Health Unit"),
    ],

    "rbac_roles_global": [
        ("owner", "مالك", "Owner — full access"),
        ("admin", "مدير", "Admin — manage users + settings"),
        ("doctor", "طبيب", "Doctor — clinical per specialty"),
        ("nurse", "ممرض", "Nurse — limited clinical"),
        ("pharmacist", "صيدلي", "Pharmacist — pharmacy + drug check"),
        ("lab_tech", "فني مختبر", "Lab Technician"),
        ("rad_tech", "فني أشعة", "Radiology Technician"),
        ("biller", "محاسب", "Biller — billing + coding"),
        ("insurance_coordinator", "منسق تأمين", "Insurance Coordinator"),
        ("quality_officer", "مسؤول جودة", "Quality Officer"),
        ("viewer", "مشاهد", "Viewer — read-only"),
    ],
}


def main():
    sql_file = WORKSPACE / ".ai-brain/03_AUTOPILOT/seed_data.sql"
    lines = []
    lines.append("-- filepath: .ai-brain/03_AUTOPILOT/seed_data.sql")
    lines.append("-- Comprehensive seed data — Generated 2026-08-08")
    lines.append("-- ICD-10, SNOMED-CT, SFDA drugs, facility types, RBAC roles")
    lines.append("BEGIN;")
    lines.append("")

    # ICD-10
    lines.append("-- ICD-10 codes (top 30)")
    for code, name_en, name_ar in SEED_DATA["icd10_top"]:
        lines.append(
            f"INSERT INTO icd10_codes (code, name_en, name_ar) "
            f"VALUES ('{code}', '{name_en.replace(chr(39), chr(39)*2)}', '{name_ar}') "
            f"ON CONFLICT (code) DO NOTHING;"
        )

    lines.append("")

    # SNOMED
    lines.append("-- SNOMED-CT codes (top 23)")
    for code, name_en, name_ar in SEED_DATA["snomed_top"]:
        lines.append(
            f"INSERT INTO snomed_codes (code, name_en, name_ar) "
            f"VALUES ('{code}', '{name_en.replace(chr(39), chr(39)*2)}', '{name_ar}') "
            f"ON CONFLICT (code) DO NOTHING;"
        )

    lines.append("")

    # SFDA drugs
    lines.append("-- SFDA drugs (top 20)")
    for code, name_en, name_ar, atc, category in SEED_DATA["sfda_drugs_top"]:
        lines.append(
            f"INSERT INTO sfda_drugs (code, name_en, name_ar, atc_class, category, sfda_registered) "
            f"VALUES ('{code}', '{name_en}', '{name_ar}', '{atc}', '{category}', TRUE) "
            f"ON CONFLICT (code) DO NOTHING;"
        )

    lines.append("")

    # Facility types
    lines.append("-- Facility types (16)")
    for code, name_ar, name_en in SEED_DATA["facility_types"]:
        lines.append(
            f"INSERT INTO facility_types (code, name_ar, name_en) "
            f"VALUES ('{code}', '{name_ar}', '{name_en}') "
            f"ON CONFLICT (code) DO NOTHING;"
        )

    lines.append("")

    # RBAC roles
    lines.append("-- RBAC roles (global, 11)")
    for code, name_ar, description in SEED_DATA["rbac_roles_global"]:
        lines.append(
            f"INSERT INTO rbac_roles (code, name_ar, description, is_global) "
            f"VALUES ('{code}', '{name_ar}', '{description}', TRUE) "
            f"ON CONFLICT (code) DO NOTHING;"
        )

    lines.append("")
    lines.append("COMMIT;")
    lines.append("")
    lines.append(f"-- Generated: {datetime.now().isoformat()}")
    lines.append("-- Source: SEED_DATA in nm-seed-data.py")

    sql_file.parent.mkdir(parents=True, exist_ok=True)
    sql_file.write_text("\n".join(lines), encoding="utf-8")

    print(f"[OK] seed_data.sql written: {sql_file}")
    print(f"     ICD-10: {len(SEED_DATA['icd10_top'])}")
    print(f"     SNOMED: {len(SEED_DATA['snomed_top'])}")
    print(f"     Drugs: {len(SEED_DATA['sfda_drugs_top'])}")
    print(f"     Facility: {len(SEED_DATA['facility_types'])}")
    print(f"     Roles: {len(SEED_DATA['rbac_roles_global'])}")


if __name__ == "__main__":
    main()
