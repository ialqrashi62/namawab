import requests

url = "https://www.pharmacyonline.com/graphql"

query = """
{
  products(search: "panadol", pageSize: 5) {
    items {
      name
      sku
      price_range {
        minimum_price {
          regular_price {
            value
            currency
          }
        }
      }
    }
  }
}
"""

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json={'query': query}, headers=headers)
    print("Status:", response.status_code)
    print(response.text[:500])
except Exception as e:
    print(e)
