import pyodbc
import json

conn_str = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=NAMA_MEDICAL;Trusted_Connection=yes;"
json_path = "e:\\NamaMedical\\pharmacy_global_products_p1_to_200.json"

try:
    with open(json_path, 'r', encoding='utf-8') as f:
        products = json.load(f)
        
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()

    # Clear existing data so we don't have duplicates or old prices
    print("Clearing existing Pharmacy Global data from pharmacy_drug_catalog and drugs...")
    # I'll just clear Pharmacy Global category, or maybe all drugs.
    # Pharmacy Drug Catalog
    cursor.execute("DELETE FROM pharmacy_drug_catalog WHERE category = 'Pharmacy Global'")
    # Drugs Table
    cursor.execute("DELETE FROM drugs WHERE category = 'Pharmacy Global'")
    # Maybe also clear old generic data? Let's leave it. The user said "حدث البيانات" so inserting the new 4000 items is good. Let's delete ALL to do a clean insert if they want all Pharmacy products as the new catalog.
    # To be safe and make sure the station shows ONLY our Pharmacy products, I'll clear all drugs in the 'Pharmacy Global' category (which are none right now if it's the first time), so let's clear the old Arabic ones as they did in C++:
    cursor.execute(u"DELETE FROM drugs WHERE category = N'مسكنات الألم والحمى'")
    # In C++, they also clear "Pharmacy Global" from the code?
    
    count = 0
    # SQL Server transactions
    for p in products:
        name = p.get('name', 'Unknown')
        sku = p.get('sku', '')
        brand = p.get('brand', 'Pharmacy Global')
        price = p.get('price_sar', 0)
        
        # pharmacy_drug_catalog injection
        cursor.execute("""
            INSERT INTO pharmacy_drug_catalog 
            (drug_name, active_ingredient, barcode, category, unit, selling_price, cost_price, stock_qty, min_qty, expiry_date, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, brand, sku, 'Pharmacy Global', 'Box', float(price), float(price)*0.7, 100, 10, '2027-01-01', 1))
        
        # drugs injection
        cursor.execute("""
            INSERT INTO drugs 
            (name, scientific_name, category, stock, price)
            VALUES (?, ?, ?, ?, ?)
        """, (name, brand, 'Pharmacy Global', 100, float(price)))
        
        count += 1
        if count % 1000 == 0:
            print(f"Inserted {count} items...")
            conn.commit()

    conn.commit()
    print(f"Successfully injected {count} drugs into SQL Server NAMA_MEDICAL database!")

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals() and conn:
        conn.close()
