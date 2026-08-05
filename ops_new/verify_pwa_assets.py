"""verify_pwa_assets.py — live HTTPS verification of PWA icons"""
import json
import subprocess
import sys

SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
BASE = "https://jumanasoft.com"

def http(path):
    r = subprocess.run(
        ["curl", "-sk", "-o", "/dev/null",
         "-w", "%{http_code} %{size_download}",
         BASE + path],
        capture_output=True, text=True, timeout=15,
    )
    return r.stdout.strip().split()

print("=== Live HTTP for each icon ===")
for s in SIZES:
    code, size = http(f"/img/logo-{s}.png")
    ok = code == "200" and int(size) > 0
    print(f"  /img/logo-{s}.png  HTTP={code}  bytes={size}  ok={ok}")

print("\n=== favicon.ico ===")
code, size = http("/favicon.ico")
print(f"  /favicon.ico  HTTP={code}  bytes={size}")

print("\n=== manifest.json ===")
code, size = http("/manifest.json")
print(f"  /manifest.json  HTTP={code}  bytes={size}")

print("\n=== manifest icons (live parse) ===")
r = subprocess.run(
    ["curl", "-sk", BASE + "/manifest.json"],
    capture_output=True, text=True, timeout=15,
)
try:
    d = json.loads(r.stdout)
    print(f"  icon count: {len(d['icons'])}")
    for i in d["icons"]:
        print(f"   {i['sizes']:>8}  {i['src']:<22} purpose={i.get('purpose','-')}")
except Exception as e:
    print(f"  PARSE FAILED: {e}")
    print("  raw:", r.stdout[:300])

print("\n=== apple-touch-icon in index.html ===")
r = subprocess.run(
    ["curl", "-sk", BASE + "/"],
    capture_output=True, text=True, timeout=15,
)
lines = [l for l in r.stdout.splitlines() if "apple-touch-icon" in l.lower() or 'rel="manifest"' in l]
for l in lines[:5]:
    print(f"  {l.strip()[:150]}")
print(f"  apple-touch-icon line present: {'apple-touch-icon' in r.stdout.lower()}")

print("\n=== summary ===")
print("DONE")
