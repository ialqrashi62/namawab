import urllib.request
import re

url = "https://www.pharmacyonline.com/en-sa/plp/pharmacy-global?page=1"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    
    # print algolia occurrences
    algolias = re.findall(r'algolia', html.lower())
    print("algolia count:", len(algolias))
    
    # print magento occurrences
    magentos = re.findall(r'magento', html.lower())
    print("magento count:", len(magentos))
    
    # search for api key or similar configs
    print("algolia config:", re.findall(r'algoliaConfig\s*:\s*\{.*?\}', html, re.DOTALL))
    
    # check for algolia app id
    print("app id:", re.findall(r'\'[A-Z0-9]{10}\'', html)) # Algolia app IDs are usually 10 uppercase alphanumeric chars
    
except Exception as e:
    print("Error:", e)
