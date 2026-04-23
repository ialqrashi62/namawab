import requests
import re
import json

url = "https://www.pharmacyonline.com/en-sa/plp/pharmacy-global?page=1"
headers = {"User-Agent": "Mozilla/5.0"}
try:
    response = requests.get(url, headers=headers)
    html = response.text
    
    # Try to extract the Next.js build ID
    match = re.search(r'"buildId":"([^"]+)"', html)
    if match:
        build_id = match.group(1)
        print("Found __NEXT_DATA__ buildId:", build_id)
        
        # Test the _next/data/ endpoints
        next_data_url = f"https://www.pharmacyonline.com/_next/data/{build_id}/en-sa/plp/pharmacy-global.json?page=1"
        r2 = requests.get(next_data_url, headers=headers)
        if r2.status_code == 200:
            print("Successfully got JSON data length:", len(r2.text))
            data = r2.json()
            # print top keys
            print("Keys:", data['pageProps'].keys())
            if 'products' in data['pageProps']:
                products = data['pageProps']['products']
                print(f"Products type: {type(products)}, len: {len(products)}")
            else:
                print("No products key in pageProps")
        else:
            print("Next Data API returned:", r2.status_code)
            
    else:
        print("No buildId found.")
        # Try to find __NEXT_DATA__ block if it is there
        next_block = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
        if next_block:
            print("__NEXT_DATA__ block found. Length:", len(next_block.group(1)))
            data = json.loads(next_block.group(1))
            print("buildId:", data.get('buildId'))
            print("pageProps keys:", data.get('props', {}).get('pageProps', {}).keys())
except Exception as e:
    print(e)
