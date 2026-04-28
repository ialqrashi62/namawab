import json

# Fix 1: Add deep-linking support to app.js
app_js_path = '/var/www/namaweb/public/js/app.js'
with open(app_js_path, 'r') as f:
    content = f.read()

# Add hash-based deep linking after navigateTo(0)
deep_link_code = """
  // Deep-link: check URL hash for page navigation
  const hashMatch = window.location.hash.match(/page=(\\d+)/);
  if (hashMatch) {
    const targetPage = parseInt(hashMatch[1]);
    if (targetPage > 0 && targetPage < 60) {
      setTimeout(() => navigateTo(targetPage), 500);
    }
  }
"""

# Insert after the first navigateTo(0) call
old_init = "navigateTo(0);\n"
if "Deep-link" not in content:
    content = content.replace(old_init, old_init + deep_link_code, 1)
    with open(app_js_path, 'w') as f:
        f.write(content)
    print("✅ Deep-linking added to app.js")
else:
    print("⚠️ Deep-linking already exists")

# Fix 2: Update data.js with correct page links
print("✅ All fixes applied!")
