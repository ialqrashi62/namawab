"""
gen_icons.py — Generate PWA icons + update manifest + index.html + favicon
Run once on the production server as root.

Steps:
  1. Verify source SVG exists (else abort with instructions).
  2. Generate 8 PNGs at 72/96/128/144/152/192/384/512 with rsvg-convert.
  3. Validate each PNG (signature + IHDR width/height).
  4. Update manifest.json icons block (idempotent).
  5. Inject <link rel="apple-touch-icon"> into index.html <head> (idempotent).
  6. Create favicon.ico from logo-192.png if missing.
  7. Print summary table.
"""
import json
import os
import re
import struct
import subprocess
import sys
import shutil

PUBLIC = "/var/www/namaweb/public"
IMG = os.path.join(PUBLIC, "img")
SVG = os.path.join(IMG, "logo.svg")
MANIFEST = os.path.join(PUBLIC, "manifest.json")
INDEX = os.path.join(PUBLIC, "index.html")
FAVICON = os.path.join(PUBLIC, "favicon.ico")
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

# 1) Source SVG
if not os.path.isfile(SVG):
    print(f"ABORT: {SVG} missing. Cannot proceed.")
    sys.exit(1)
print(f"[1] Source SVG OK: {SVG} ({os.path.getsize(SVG)} bytes)")

# 2) Generate PNGs
for s in SIZES:
    out = os.path.join(IMG, f"logo-{s}.png")
    r = subprocess.run(
        ["rsvg-convert", "-w", str(s), "-h", str(s), SVG, "-o", out],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        print(f"  FAIL size {s}: {r.stderr}")
        sys.exit(2)
print(f"[2] Generated {len(SIZES)} PNGs")

# 3) Validate
print("[3] Validation:")
for s in SIZES:
    p = os.path.join(IMG, f"logo-{s}.png")
    with open(p, "rb") as f:
        sig = f.read(8)
        f.read(4)
        if f.read(4) != b"IHDR":
            print(f"  BAD {p}: not IHDR")
            sys.exit(3)
        w, h = struct.unpack(">II", f.read(8))
    ok = sig == b"\x89PNG\r\n\x1a\n" and w == s and h == s
    print(f"  logo-{s}.png: {w}x{h}  valid={ok}  bytes={os.path.getsize(p)}")
    if not ok:
        sys.exit(3)

# 4) Update manifest.json
with open(MANIFEST, "r", encoding="utf-8") as f:
    manifest = json.load(f)
new_icons = [
    {"src": f"/img/logo-{s}.png", "sizes": f"{s}x{s}",
     "type": "image/png",
     "purpose": "any maskable" if s in (192, 512) else "any"}
    for s in SIZES
]
manifest["icons"] = new_icons
with open(MANIFEST, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)
print(f"[4] manifest.json updated: {len(new_icons)} icons")

# 5) Inject apple-touch-icon link into index.html
with open(INDEX, "r", encoding="utf-8") as f:
    html = f.read()
needle = '<link rel="apple-touch-icon" href="/img/logo-192.png">'
if needle in html:
    print("[5] apple-touch-icon link already present (idempotent)")
else:
    # Insert right after <meta name="theme-color"> OR <link rel="manifest"> OR first <link>
    patterns = [
        r'(<link rel="manifest"[^>]*>)',
        r'(<meta name="theme-color"[^>]*>)',
        r'(<link[^>]*rel="icon"[^>]*>)',
    ]
    inserted = False
    for pat in patterns:
        m = re.search(pat, html)
        if m:
            html = html[:m.end()] + "\n    " + needle + html[m.end():]
            inserted = True
            break
    if not inserted:
        # Fallback: insert right after <head>
        html = re.sub(r'(<head[^>]*>)', r'\1\n    ' + needle, html, count=1)
    with open(INDEX, "w", encoding="utf-8") as f:
        f.write(html)
    print("[5] apple-touch-icon link inserted into index.html")

# 6) favicon.ico
if os.path.isfile(FAVICON):
    print(f"[6] favicon.ico already exists ({os.path.getsize(FAVICON)} bytes) — leaving in place")
else:
    shutil.copyfile(os.path.join(IMG, "logo-192.png"), FAVICON)
    print(f"[6] favicon.ico created from logo-192.png ({os.path.getsize(FAVICON)} bytes)")

# 7) Summary
print("\n=== SUMMARY ===")
for s in SIZES:
    p = os.path.join(IMG, f"logo-{s}.png")
    print(f"  logo-{s}.png  {os.path.getsize(p):>6} bytes  HTTP path: /img/logo-{s}.png")
print(f"  favicon.ico    {os.path.getsize(FAVICON):>6} bytes  HTTP path: /favicon.ico")
print(f"  manifest icons: {len(new_icons)}")
print("  apple-touch-icon: present" if needle in html else "  apple-touch-icon: MISSING")
print("DONE")
