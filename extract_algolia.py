import asyncio
from playwright.async_api import async_playwright
import json

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        all_reqs = []
        async def handle_request(route, request):
            if 'h9x4ih7m99-dsn.algolia.net' in request.url:
                all_reqs.append({
                    'url': request.url,
                    'headers': request.headers,
                    'post_data': request.post_data
                })
                with open("algolia_creds.json", "w", encoding="utf-8") as f:
                    json.dump(all_reqs, f, indent=2)
            await route.continue_()
            
        await page.route("**/*", handle_request)
        
        try:
            await page.goto("https://www.pharmacyonline.com/en-sa/plp/pharmacy-global?page=1", timeout=15000)
            await page.wait_for_timeout(5000)
        except Exception:
            pass
            
        await browser.close()
        
asyncio.run(run())
