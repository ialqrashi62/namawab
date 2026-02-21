import sqlite3
import datetime

db_path = "e:\\NamaMedical\\build\\nama_medical.db"

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Insert Patient
    cursor.execute("""
        INSERT INTO patients (file_number, iqama_id, nationality, name_ar, name_en, gender, dob, phone, blood_type, is_insured, created_at, dob_hijri, cr_number, conditional_vat)
        VALUES ('E2E-100', '1010101010', 'Saudi', 'مريض الاختبار', 'E2E Test Patient', 'Male', '1985-05-15', '0500000000', 'O+', 0, datetime('now'), '1405-08-25', '', 0)
    """)
    patient_id = cursor.lastrowid
    
    # 2. Insert Vitals
    cursor.execute("""
        INSERT INTO patient_vitals (patient_id, bp_sys, bp_dia, heart_rate, temp, resp_rate, spo2, weight, height, bmi, created_at)
        VALUES (?, 120, 80, 75, 37.0, 16, 98, 70, 175, 22.8, datetime('now'))
    """, (patient_id,))
    
    # 3. Queue to Doctor Station (Consultation)
    cursor.execute("""
        INSERT INTO reception_queue (patient_id, department, status, visit_type, notes, created_at)
        VALUES (?, 'General Practice', 'Waiting', 'New Consultation', 'E2E Flow Test', datetime('now'))
    """, (patient_id,))
    
    conn.commit()
    print(f"E2E Patient Successfully Injected! ID: {patient_id}")

except Exception as e:
    print(f"Error updating database: {e}")
finally:
    if conn:
        conn.close()
