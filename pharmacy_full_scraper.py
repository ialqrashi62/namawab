import time
import json
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape_pharmacy_all():
    options = uc.ChromeOptions()
    options.headless = False # Must be False for Cloudflare WAF bypass
    driver = uc.Chrome(options=options)
    
    # Target diverse subcategories to build the best ERP database
    categories = {
        "Pain Relief": "https://www.pharmacyonline.com/en-sa/otc-treatments/pain-killers",
        "Cold & Cough": "https://www.pharmacyonline.com/en-sa/otc-treatments/cough-cold-flu",
        "Digestive Health": "https://www.pharmacyonline.com/en-sa/otc-treatments/digestive-care",
        "Vitamins": "https://www.pharmacyonline.com/en-sa/vitamins-and-supplements/multivitamins",
        "Diabetes": "https://www.pharmacyonline.com/en-sa/vitamins-and-supplements/diabetic-care",
        "Child Health": "https://www.pharmacyonline.com/en-sa/vitamins-and-supplements/kids-health"
    }
    
    all_drugs = []
    
    try:
        # Initial wait to pass Cloudflare on the first load
        print("Bypassing Initial WAF...")
        driver.get("https://www.pharmacyonline.com/en-sa/otc-treatments")
        time.sleep(10)
        
        # Accept Cookies
        try:
            cookie_btn = driver.find_element(By.ID, "onetrust-accept-btn-handler")
            cookie_btn.click()
            time.sleep(2)
        except:
            pass

        for cat_name, url in categories.items():
            print(f"\\n--- Scraping Category: {cat_name} ---")
            driver.get(url)
            time.sleep(5)
            
            pages_to_scrape = 3
            current_page = 1
            
            while current_page <= pages_to_scrape:
                print(f"Scraping Page {current_page} of {cat_name}...")
                
                # Scroll down to load all lazy-loaded products
                for _ in range(6):
                    driver.execute_script("window.scrollBy(0, 800);")
                    time.sleep(0.5)
                time.sleep(2)
                    
                products = driver.find_elements(By.CSS_SELECTOR, ".product-item-info")
                found_on_page = 0
                
                for p in products:
                    try:
                        name = p.find_element(By.CSS_SELECTOR, ".product-item-link").text.strip()
                        price = p.find_element(By.CSS_SELECTOR, ".price").text.replace("SAR", "").strip()
                        
                        if name and price:
                            all_drugs.append({
                                "name": name,
                                "category": cat_name,
                                "price": price
                            })
                            found_on_page += 1
                    except Exception as e:
                        continue
                        
                print(f"Found {found_on_page} items on this page.")
                
                # Next Page
                try:
                    next_btn = driver.find_element(By.CSS_SELECTOR, ".pages-item-next a")
                    driver.execute_script("arguments[0].click();", next_btn)
                    time.sleep(5)
                    current_page += 1
                except:
                    print(f"End of pagination for {cat_name}.")
                    break
                    
    finally:
        # Deduplication
        unique_drugs = {v['name']:v for v in all_drugs}.values()
        
        with open("english_drugs_full.json", "w", encoding="utf-8") as f:
            json.dump(list(unique_drugs), f, ensure_ascii=False, indent=4)
            
        print(f"\\nSuccessfully exported {len(unique_drugs)} total unique English drugs.")
        driver.quit()

if __name__ == "__main__":
    scrape_pharmacy_all()
