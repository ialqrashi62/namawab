import urllib.request
from bs4 import BeautifulSoup
import re

url = "https://www.pharmacyonline.com/en-sa/plp/pharmacy-global?page=1"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Let's see if there are product items in the HTML
    products = soup.find_all('div', class_=re.compile('.*product.*item.*'))
    print(f"Found {len(products)} products using class .*product.*item.*")
    
    for script in soup.find_all('script'):
        if script.string and 'window.__INITIAL_STATE__' in script.string:
            print("Found __INITIAL_STATE__")
        if script.string and 'checkout' in script.string and 'product' in script.string:
            # print(script.string[:200])
            pass
            
    # Search for json definitions
    for s in soup.find_all('script', type='application/ld+json'):
        print("Found ld+json, length:", len(s.string))
        
    for s in soup.find_all('script', type='text/x-magento-init'):
        if 'product' in s.string.lower():
            print("Found x-magento-init with product:", len(s.string))
            
except Exception as e:
    print("Error:", e)
