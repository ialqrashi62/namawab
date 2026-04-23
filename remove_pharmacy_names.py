import pyodbc

conn_str = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=NAMA_MEDICAL;Trusted_Connection=yes;"

try:
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()

    # 1. Update pharmacy_drug_catalog for drug_name
    cursor.execute("""
        UPDATE pharmacy_drug_catalog
        SET drug_name = LTRIM(RTRIM(REPLACE(REPLACE(REPLACE(drug_name, 'Pharmacy Global', ''), 'pharmacy global', ''), 'Pharmacy', '')))
        WHERE drug_name LIKE '%Pharmacy%'
    """)
    print(f"Updated {cursor.rowcount} names in pharmacy_drug_catalog")

    # 2. Update pharmacy_drug_catalog for active_ingredient (Since we put "Pharmacy Global" there for brand)
    cursor.execute("""
        UPDATE pharmacy_drug_catalog
        SET active_ingredient = LTRIM(RTRIM(REPLACE(REPLACE(REPLACE(active_ingredient, 'Pharmacy Global', ''), 'pharmacy global', ''), 'Pharmacy', '')))
        WHERE active_ingredient LIKE '%Pharmacy%'
    """)
    print(f"Updated {cursor.rowcount} brands/ingredients in pharmacy_drug_catalog")
    
    # 3. Update pharmacy_drug_catalog for category
    cursor.execute("""
        UPDATE pharmacy_drug_catalog
        SET category = 'General Medication'
        WHERE category = 'Pharmacy Global' OR category LIKE '%Pharmacy%'
    """)
    print(f"Updated {cursor.rowcount} categories in pharmacy_drug_catalog")

    # 4. Update drugs for name
    cursor.execute("""
        UPDATE drugs
        SET name = LTRIM(RTRIM(REPLACE(REPLACE(REPLACE(name, 'Pharmacy Global', ''), 'pharmacy global', ''), 'Pharmacy', '')))
        WHERE name LIKE '%Pharmacy%'
    """)
    print(f"Updated {cursor.rowcount} names in drugs")
    
    # 5. Update drugs for scientific_name
    cursor.execute("""
        UPDATE drugs
        SET scientific_name = LTRIM(RTRIM(REPLACE(REPLACE(REPLACE(scientific_name, 'Pharmacy Global', ''), 'pharmacy global', ''), 'Pharmacy', '')))
        WHERE scientific_name LIKE '%Pharmacy%'
    """)
    print(f"Updated {cursor.rowcount} scientific_names in drugs")
    
    # 6. Update drugs for category
    cursor.execute("""
        UPDATE drugs
        SET category = 'General Medication'
        WHERE category = 'Pharmacy Global' OR category LIKE '%Pharmacy%'
    """)
    print(f"Updated {cursor.rowcount} categories in drugs")

    conn.commit()
    print("Successfully removed all 'Pharmacy' references from the database!")

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals() and conn:
        conn.close()
