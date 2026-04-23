import requests
import re
import json

url = "https://www.pharmacyonline.com/en-sa/plp/pharmacy-global?page=1"
headers = {"User-Agent": "Mozilla/5.0"}

try:
    html = requests.get(url, headers=headers).text
    
    # We can use regex to extract the JSON-like strings that look like products.
    # App router puts data in lines of the form:
    # 1:{"id":"..."}
    # It seems 'objectid' and 'sku' are there.
    
    # Let's extract everything inside {"objectid":..., ...}
    
    products = []
    
    matches = re.finditer(r'\{"objectid":"([^"]+)",(.*?)\}', html, re.IGNORECASE)
    for m in matches:
        obj_id = m.group(1)
        rest = m.group(2)
        
        name_match = re.search(r'"name":"([^"]+)"', rest)
        sku_match = re.search(r'"sku":"([^"]+)"', rest)
        price_match = re.search(r'"price":(\d+\.?\d*)', rest)
        # some price might be in regular_price or special_price
        if not price_match:
            price_match = re.search(r'"regular_price":(\d+\.?\d*)', rest)
            
        if name_match:
            name = name_match.group(1).replace('\\\\', '')
            # Clean up escaped quotes if any
            name = name.encode('utf-8').decode('unicode_escape', errors='ignore')
            
            sku = sku_match.group(1) if sku_match else ""
            price = price_match.group(1) if price_match else "0.0"
            
            products.append({
                "sku": sku,
                "name": name,
                "price": price
            })
            
    # Deduplicate
    unique_products = {p['sku']: p for p in products if p['sku']}
    print("Found unique products:", len(unique_products))
    for p in list(unique_products.values())[:3]:
        print(p)
except Exception as e:
    print(e)
