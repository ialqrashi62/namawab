with open('/var/www/namaweb/public/erp.html', 'r') as f:
    content = f.read()

# Change from Light Classic (theme 5) to Dark Medical theme (theme 0 = Dark Blue default)
content = content.replace('data-theme="5"', 'data-theme="0"')

with open('/var/www/namaweb/public/erp.html', 'w') as f:
    f.write(content)

print("✅ erp.html: theme changed to Dark Blue (0)")

# Also update the default theme in the CSS to add a premium medical dark theme
# We'll create a new theme 10 = "Medical Dark" that matches the portal

css_path = '/var/www/namaweb/public/css/styles.css'
with open(css_path, 'r') as f:
    css = f.read()

# Add a new premium medical dark theme that matches the portal
medical_theme = """
/* Theme 10: Medical Dark (Matches Portal) */
[data-theme="10"] {
  --bg: #0a0e1a;
  --sidebar: linear-gradient(180deg, #0d1527 0%, #0a1628 100%);
  --sidebar: #0d1527;
  --header: #111b2e;
  --accent: #00d4ff;
  --accent-hover: #00b8db;
  --accent-glow: rgba(0, 212, 255, 0.15);
  --text: #e2e8f0;
  --text-dim: #64748b;
  --border: rgba(0, 212, 255, 0.08);
  --selected-bg: rgba(0, 212, 255, 0.15);
  --selected-fg: #00d4ff;
  --hover: rgba(0, 212, 255, 0.05);
  --input: rgba(255, 255, 255, 0.04);
  --input2: rgba(255, 255, 255, 0.02);
  --card-bg: #111b2e;
  --alt-row: rgba(0, 212, 255, 0.02);
  --success: #00e5a0;
  --warning: #fbbf24;
  --danger: #ef4444;
  --info: #00d4ff;
  --shadow: rgba(0, 0, 0, 0.5);
}
"""

if 'Theme 10' not in css:
    # Insert after the last theme definition
    css = css.replace('/* ===== Global Reset =====', medical_theme + '\n/* ===== Global Reset =====')
    if '/* ===== Global Reset =====' not in css:
        # fallback: look for body or * selector
        css = css.replace('\n* {', medical_theme + '\n* {', 1)

with open(css_path, 'w') as f:
    f.write(css)

print("✅ styles.css: Medical Dark theme (10) added")

# Now set erp.html to use theme 10
with open('/var/www/namaweb/public/erp.html', 'r') as f:
    content = f.read()
content = content.replace('data-theme="0"', 'data-theme="10"')
with open('/var/www/namaweb/public/erp.html', 'w') as f:
    f.write(content)

print("✅ erp.html: switched to Medical Dark theme (10)")
print("🎉 Done!")
