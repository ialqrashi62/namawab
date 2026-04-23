import time
import json
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape_pharmacy_english():
    options = uc.ChromeOptions()
    options.headless = False  # Keep true so Datadome doesn't block it as easily
    driver = uc.Chrome(options=options)
    
    # Base URL for English Medical Drugs category
    base_url = "https://www.pharmacyonline.com/en/medicines-and-treatments"
    
    try:
        driver.get(base_url)
        print("Waiting for initial payload...")
        time.sleep(10) # Wait for Cloudflare
        
        # Accept cookies if present
        try:
            cookie_btn = driver.find_element(By.ID, "onetrust-accept-btn-handler")
            cookie_btn.click()
            time.sleep(2)
        except:
            pass
            
        drugs_list = []
        page = 1
        max_pages = 3 # Let's get ~60-100 drugs for the database
        
        while page <= max_pages:
            print(f"Scraping Page {page}...")
            
            # Scroll down to load all lazy-loaded products
            for _ in range(5):
                driver.execute_script("window.scrollBy(0, 1000);")
                time.sleep(1)
                
            products = driver.find_elements(By.CSS_SELECTOR, ".product-item-info")
            print(f"Found {len(products)} products on this page")
            
            for p in products:
                try:
                    name = p.find_element(By.CSS_SELECTOR, ".product-item-link").text.strip()
                    price = p.find_element(By.CSS_SELECTOR, ".price").text.replace("SAR", "").strip()
                    
                    if name and price:
                        drugs_list.append({
                            "name": name,
                            "category": "General Medication", # Defaulting to General as Pharmacy sometimes hides subcats in grid
                            "price": price
                        })
                except Exception as e:
                    continue
                    
            page += 1
            try:
                # Try to click next page
                next_btn = driver.find_element(By.CSS_SELECTOR, ".pages-item-next a")
                driver.execute_script("arguments[0].click();", next_btn)
                time.sleep(5)
            except:
                print("No more pages or couldn't click Next.")
                break
                
        # Deduplicate
        unique_drugs = {v['name']:v for v in drugs_list}.values()
        
        with open("english_drugs.json", "w", encoding="utf-8") as f:
            json.dump(list(unique_drugs), f, ensure_ascii=False, indent=4)
            
        print(f"Successfully exported {len(unique_drugs)} English drugs.")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_pharmacy_english()
