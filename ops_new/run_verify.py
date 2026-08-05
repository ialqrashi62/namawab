"""run_verify.py — pipe the verify script to the server over ssh via base64 stdin"""
import base64
import subprocess
import sys

LOCAL = r"C:\Users\ice\Desktop\NMEDCALVSCODE\ops_new\verify_pwa_assets.py"
KEY   = r"C:\Users\ice\.ssh\nama_medical_key"
HOST  = "root@204.168.144.74"

with open(LOCAL, "rb") as f:
    script = f.read()
script = script.replace(b"\r\n", b"\n")
b64 = base64.b64encode(script).decode()

ssh_cmd = [
    "ssh", "-i", KEY, HOST,
    f"python3 -c 'import base64,sys;exec(base64.b64decode(\"{b64}\").decode())'",
]

r = subprocess.run(ssh_cmd, capture_output=True, timeout=60)
print("=== STDOUT ===")
print(r.stdout.decode(errors="replace"))
print("=== STDERR (first 500) ===")
print(r.stderr.decode(errors="replace")[:500])
print("=== rc ===", r.returncode)
