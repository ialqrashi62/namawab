"""Upload run_all_tests.sh via base64 (avoids scp hangs), then verify."""
import subprocess
import sys
import base64
import datetime

KEY = r"C:\Users\ice\.ssh\nama_medical_key"
HOST = "root@204.168.144.74"
LOCAL = r"C:\Users\ice\Desktop\NMEDCALVSCODE\ops_new\run_all_tests.sh"
REMOTE = "/var/www/namaweb/ops/run_all_tests.sh"


def ssh(cmd, timeout=180):
    r = subprocess.run(
        ["ssh", "-i", KEY, "-o", "BatchMode=yes",
         "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=15",
         HOST, cmd],
        capture_output=True, timeout=timeout,
    )
    out = (r.stdout or b"") + (r.stderr or b"")
    return r.returncode, out.decode("utf-8", errors="replace")


with open(LOCAL, "r", encoding="utf-8") as f:
    content = f.read()

# Split into chunks of 60 lines to avoid command-line length limits
lines = content.splitlines(keepends=True)
print(f"[1/5] uploading {len(lines)} lines in chunks...")
# First, truncate the remote file
rc, out = ssh(f": > {REMOTE}", timeout=15)
ok = True
chunk_size = 60
for i in range(0, len(lines), chunk_size):
    chunk = "".join(lines[i:i+chunk_size])
    # base64-encode the chunk
    b64 = base64.b64encode(chunk.encode("utf-8")).decode("ascii")
    cmd = f"echo '{b64}' | base64 -d >> {REMOTE}"
    rc, out = ssh(cmd, timeout=30)
    if rc != 0:
        print(f"chunk {i} failed: {out[:200]}")
        ok = False
        break
    if (i // chunk_size) % 5 == 0:
        print(f"  uploaded {min(i+chunk_size, len(lines))}/{len(lines)} lines")
if not ok:
    print("UPLOAD FAILED")
    sys.exit(1)
rc, out = ssh(f"chmod +x {REMOTE} && wc -l {REMOTE} && echo UPLOAD_OK", timeout=15)
print(out)
if "UPLOAD_OK" not in out:
    print("CHMOD/WC FAILED")
    sys.exit(1)

print("[2/5] bash -n syntax check...")
rc, out = ssh(f"bash -n {REMOTE} && echo SYNTAX_OK", timeout=30)
print(out)
if "SYNTAX_OK" not in out:
    print("SYNTAX CHECK FAILED")
    sys.exit(1)

print("[3/5] running --quick (capturing tail)...")
rc, out = ssh(f"bash {REMOTE} --quick --no-color 2>&1 | tail -25", timeout=240)
print("=== TAIL OF --quick RUN ===")
print(out)

print("[4/5] running --quick for real exit code...")
rc, out = ssh(
    f"bash {REMOTE} --quick --no-color >/dev/null 2>&1; echo EXIT=$?",
    timeout=240,
)
print(out.strip())

print("[5/5] LOC + last log lines...")
today = datetime.datetime.utcnow().strftime("%Y%m%d")
logf = f"/tmp/orchestrator-test-{today}.log"
rc, out = ssh(
    f"wc -l {REMOTE} && echo --- && ls -la {logf} 2>&1 && echo --- && tail -10 {logf} 2>&1"
)
print(out)
