import requests
import json
import time
import concurrent.futures

def fetch_page(page_num):
    url = "https://h9x4ih7m99-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.23.3)%3B%20Browser%3B%20next.js%20(14.0.0)"
    headers = {
        "x-algolia-api-key": "2bbce1340a1cab2ccebe0307b1310881",
        "x-algolia-application-id": "H9X4IH7M99",
        "content-type": "application/x-www-form-urlencoded"
    }
    
    # page in algolia is 0-indexed, so page 1 is page=0
    algolia_page = page_num - 1
    
    post_data = {
        "requests": [
            {
                "indexName": "prod_en_products",
                "params": f"filters=global_filter%3A%22Global%22&page={algolia_page}&hitsPerPage=20"
            }
        ]
    }
    
    try:
        req = requests.post(url, headers=headers, json=post_data, timeout=10)
        data = req.json()
        hits = data['results'][0].get('hits', [])
        return hits
    except Exception as e:
        print(f"Error on page {page_num}: {e}")
        return []

def main():
    print("Starting extraction of Pharmacy Global products (pages 1-200)...")
    start_time = time.time()
    
    all_products = []
    
    # Use ThreadPoolExecutor to speed up 200 reqs
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_page, p): p for p in range(1, 201)}
        
        for future in concurrent.futures.as_completed(futures):
            p = futures[future]
            try:
                hits = future.result()
                for hit in hits:
                    name = hit.get('name', '')
                    price = hit.get('price', {}).get('SAR', {}).get('default', 0)
                    sku = hit.get('sku', '')
                    brand = hit.get('brand', '')
                    
                    if name:
                        all_products.append({
                            "sku": sku,
                            "name": name,
                            "brand": brand,
                            "price_sar": price
                        })
                print(f"Fetched page {p} (Found {len(hits)} items)")
            except Exception as e:
                print(f"Failed page {p} - {e}")

    # Remove duplicates
    unique_products = {p['sku']: p for p in all_products}.values()
    
    with open("pharmacy_global_products_p1_to_200.json", "w", encoding="utf-8") as f:
        json.dump(list(unique_products), f, ensure_ascii=False, indent=2)
        
    print(f"Successfully extracted {len(unique_products)} unique products in {time.time() - start_time:.2f} seconds.")

if __name__ == "__main__":
    main()
