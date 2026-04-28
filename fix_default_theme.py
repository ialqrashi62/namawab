path = '/var/www/namaweb/public/js/app.js'
with open(path, 'r') as f:
    c = f.read()

# Add theme 10 to the theme names array
old_themes = "const themeNames = ["
new_addition = """const themeNames = ["""

# Make the default theme load as 10 if no setting found
# Change the settings load to default to theme 10
old_theme_load = "if (s.theme) { document.documentElement.setAttribute('data-theme', s.theme);"
new_theme_load = "{ const t = s.theme || '10'; document.documentElement.setAttribute('data-theme', t);"
c = c.replace(old_theme_load, new_theme_load)

# Also add theme 10 option to the theme selector  
old_select = '<option value="7"'
if '<option value="10"' not in c:
    c = c.replace(old_select, '<option value="10">🏥 Medical Dark</option>\\n            ' + old_select)

with open(path, 'w') as f:
    f.write(c)

print("✅ app.js: default theme set to 10 (Medical Dark)")
