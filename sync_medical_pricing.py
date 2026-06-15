import os
import json
import pyodbc
import sys

import configparser

# Read database details from config.ini
config = configparser.ConfigParser()
config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.ini")
config.read(config_path)

server = config.get("Database", "Server", fallback="localhost")
db_name = config.get("Database", "DatabaseName", fallback="NAMA_MEDICAL")
username = config.get("Database", "Username", fallback="")
password = config.get("Database", "Password", fallback="")

if username:
    DB_CONN = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={db_name};UID={username};PWD={password};"
else:
    DB_CONN = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={db_name};Trusted_Connection=yes;"

JSON_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "medical_services_pricing.json")

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

    import sqlite3
    using_sqlite = False
    conn = None
    try:
        print("Connecting to SQL Server database...")
        conn = pyodbc.connect(DB_CONN)
        cursor = conn.cursor()
    except Exception as e:
        print(f"[WARNING] SQL Server failed: {e}")
        # Resolve path to the Qt application's SQLite database
        base_dir = os.path.dirname(os.path.abspath(__file__))
        sqlite_path = os.path.join(base_dir, "build", "nama_medical.db")
        if not os.path.exists(sqlite_path):
            alt_path = os.path.join(base_dir, "nama_medical.db")
            if os.path.exists(alt_path):
                sqlite_path = alt_path
            else:
                sqlite_path = os.path.join(base_dir, "database.db")

        print(f"Falling back to local SQLite database: {sqlite_path}")
        try:
            conn = sqlite3.connect(sqlite_path)
            cursor = conn.cursor()
            using_sqlite = True
        except Exception as sqlite_err:
            print(f"[ERROR] Failed to connect to SQLite database: {sqlite_err}")
            return

    try:
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
        db_type = "SQLite" if using_sqlite else "SQL Server"
        print(f"[SUCCESS] نجاح: تم استيراد وتحديث {lab_count} فحص مختبر و {rad_count} جهاز أشعة في قاعدة بيانات ({db_type}).")

    except Exception as e:
        print(f"حدث خطأ أثناء الاتصال بقاعدة البيانات: {e}")
    finally:
        if conn is not None:
            conn.close()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "sync":
        sync_to_db()
    else:
        is_new = generate_json()
        if not is_new:
            print(f"الملف موجود مسبقاً في:\n{JSON_PATH}")
            print("قم بتشغيل السكربت مع المعامل 'sync' لرفع التعديلات لقاعدة البيانات.")
