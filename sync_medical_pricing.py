import os
import json
import pyodbc
import sys

DB_CONN = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=NAMA_MEDICAL;Trusted_Connection=yes;"
JSON_PATH = "e:\\NamaMedical\\medical_services_pricing.json"

DEFAULT_DATA = {
    "lab_tests": [
        {"test_name": "CBC (Complete Blood Count)", "category": "Hematology", "normal_range": "Normal", "price": 150.0},
        {"test_name": "Lipid Profile", "category": "Biochemistry", "normal_range": "Normal", "price": 200.0},
        {"test_name": "Fasting Blood Sugar (FBS)", "category": "Biochemistry", "normal_range": "70-100 mg/dL", "price": 80.0},
        {"test_name": "HbA1c", "category": "Biochemistry", "normal_range": "4.0-5.6%", "price": 180.0},
        {"test_name": "Vitamin D", "category": "Endocrinology", "normal_range": "30-100 ng/mL", "price": 250.0},
        {"test_name": "TSH", "category": "Hormones", "normal_range": "0.4-4.0 mIU/L", "price": 150.0},
        {"test_name": "Liver Function Test (LFT)", "category": "Biochemistry", "normal_range": "Normal", "price": 220.0},
        {"test_name": "Kidney Function Test (KFT)", "category": "Biochemistry", "normal_range": "Normal", "price": 210.0}
    ],
    "radiology": [
        {"exact_name": "Chest X-Ray (PA)", "modality": "X-Ray", "price": 150.0},
        {"exact_name": "MRI Brain without contrast", "modality": "MRI", "price": 1200.0},
        {"exact_name": "CT Brain without contrast", "modality": "CT", "price": 800.0},
        {"exact_name": "Ultrasound Abdomen", "modality": "Ultrasound", "price": 400.0},
        {"exact_name": "Ultrasound Pelvis", "modality": "Ultrasound", "price": 350.0},
        {"exact_name": "X-Ray Knee Joint", "modality": "X-Ray", "price": 160.0},
        {"exact_name": "MRI Cervical Spine", "modality": "MRI", "price": 1300.0}
    ]
}

def generate_json():
    if not os.path.exists(JSON_PATH):
        with open(JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(DEFAULT_DATA, f, ensure_ascii=False, indent=4)
        print(f"تم إنشاء ملف التسعيرة بنجاح في المسار:\n{JSON_PATH}")
        print("يمكنك الآن فتح الملف وتعديل الأسعار والمسميات براحتك.")
        return True
    return False

def sync_to_db():
    if not os.path.exists(JSON_PATH):
        print("خطأ: لم يتم العثور على ملف التسعيرة medical_services_pricing.json.")
        return

    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    try:
        conn = pyodbc.connect(DB_CONN)
        cursor = conn.cursor()

        # Update Lab Tests
        cursor.execute("DELETE FROM lab_tests_catalog")
        lab_count = 0
        for test in data.get("lab_tests", []):
            cursor.execute("""
                INSERT INTO lab_tests_catalog (test_name, category, normal_range, price)
                VALUES (?, ?, ?, ?)
            """, (test['test_name'], test['category'], test.get('normal_range', ''), float(test['price'])))
            lab_count += 1

        # Update Radiology
        cursor.execute("DELETE FROM radiology_catalog")
        rad_count = 0
        for scan in data.get("radiology", []):
            cursor.execute("""
                INSERT INTO radiology_catalog (modality, exact_name, default_template, price)
                VALUES (?, ?, ?, ?)
            """, (scan['modality'], scan['exact_name'], '', float(scan['price'])))
            rad_count += 1

        conn.commit()
        print(f"✅ نجاح: تم استيراد وتحديث {lab_count} فحص مختبر و {rad_count} جهاز أشعة في قاعدة البيانات.")

    except Exception as e:
        print(f"حدث خطأ أثناء الاتصال بقاعدة البيانات: {e}")
    finally:
        if 'conn' in locals() and hasattr(conn, 'close'):
            conn.close()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "sync":
        sync_to_db()
    else:
        is_new = generate_json()
        if not is_new:
            print(f"الملف موجود مسبقاً في:\n{JSON_PATH}")
            print("قم بتشغيل السكربت مع المعامل 'sync' لرفع التعديلات لقاعدة البيانات.")
