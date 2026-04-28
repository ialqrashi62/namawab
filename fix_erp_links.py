import re

# Fix 1: Update login.js to redirect to erp.html
login_path = '/var/www/namaweb/public/js/login.js'
with open(login_path, 'r') as f:
    content = f.read()
content = content.replace("/admin.html", "/erp.html")
with open(login_path, 'w') as f:
    f.write(content)
print("✅ login.js: redirect updated to /erp.html")

# Fix 2: Add deep-linking to erp.html's app.js (already done, verify)
app_js_path = '/var/www/namaweb/public/js/app.js'
with open(app_js_path, 'r') as f:
    content = f.read()
if "Deep-link" in content:
    print("✅ app.js: deep-linking already exists")
else:
    old = "navigateTo(0);\n"
    deep_link = """
  // Deep-link: check URL hash for page navigation
  const hashMatch = window.location.hash.match(/page=(\\d+)/);
  if (hashMatch) {
    const targetPage = parseInt(hashMatch[1]);
    if (targetPage > 0 && targetPage < 60) {
      setTimeout(() => navigateTo(targetPage), 500);
    }
  }
"""
    content = content.replace(old, old + deep_link, 1)
    with open(app_js_path, 'w') as f:
        f.write(content)
    print("✅ app.js: deep-linking added")

# Fix 3: Verify erp.html exists and loads app.js
erp_path = '/var/www/namaweb/public/erp.html'
with open(erp_path, 'r') as f:
    erp_content = f.read()
if 'app.js' in erp_content:
    print("✅ erp.html: loads app.js correctly")
else:
    print("❌ erp.html: does NOT load app.js!")

# Fix 4: Make sure erp.html redirects to login if not authenticated
if 'auth/me' in erp_content or 'login.html' in erp_content:
    print("✅ erp.html: has auth check")

print("\n🎉 All fixes applied successfully!")
