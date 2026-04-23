import asyncio
from playwright.async_api import async_playwright
import json

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        api_data = {}
        
        async def handle_response(response):
            # Look for graphql or algolia requests
            url = response.url
            if 'algolia' in url or 'graphql' in url or '/search' in url or '/products' in url:
                try:
                    req = response.request
                    if req.method == "POST":
                        post_data = req.post_data
                        # Verify it has products or hits
                        resp_json = await response.json()
                        if 'hits' in resp_json or 'data' in resp_json or 'items' in resp_json:
                            print(f"--- FOUND API: {url} ---")
                            print("Headers:", req.headers)
                            print("Post Data:", post_data)
                            api_data['url'] = url
                            api_data['headers'] = req.headers
                            api_data['post_data'] = post_data
                            
                            with open("api_info.json", "w", encoding="utf-8") as f:
                                json.dump(api_data, f, ensure_ascii=False, indent=2)
                except Exception as e:
                    pass
                    
        page.on("response", handle_response)
        
        print("Navigating to page...")
        await page.goto("https://www.pharmacyonline.com/en-sa/plp/pharmacy-global?page=1", wait_until="networkidle")
        print("Done navigating")
        await browser.close()
        
asyncio.run(run())
