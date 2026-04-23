import pyodbc 

conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=NAMA_MEDICAL;Trusted_Connection=yes;')
c = conn.cursor()

keywords = [
    'Shampoo', 'Conditioner', 'Soap', 'Deodorant', 'Toothbrush', 'Toothpaste', 
    'Perfume', 'Makeup', 'Mascara', 'Lipstick', 'Nail', 'Hair Color', 
    'Diaper', 'Wipes', 'Cleanser', 'Body Wash', 'Face Wash', 'Scrub', 
    'Pacifier', 'Feeding Bottle', 'Sunscreen', 'Lip Balm', 'Lotion', 
    'Mouthwash', 'Floss', 'Fragrance', 'Body Mist', 'Eyeliner', 
    'Foundation', 'Concealer', 'Bronzer', 'Blush', 'Hair Dye', 'Hair Spray',
    'Shower Gel', 'Bath', 'Toner', 'Brush', 'Sponge', 'Plumper', 'Polish'
]

conditions = ' OR '.join([f"name LIKE '%{k}%'" for k in keywords])
conditions_catalog = ' OR '.join([f"drug_name LIKE '%{k}%'" for k in keywords])

print('Before deletion, drugs count:', c.execute('SELECT COUNT(*) FROM drugs').fetchone()[0])
c.execute(f'DELETE FROM drugs WHERE {conditions}')
c.execute(f'DELETE FROM pharmacy_drug_catalog WHERE {conditions_catalog}')
conn.commit()

print('After deletion, drugs count:', c.execute('SELECT COUNT(*) FROM drugs').fetchone()[0])
