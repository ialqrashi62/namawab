# DIAGNOSE_521_ORIGIN_DOWN_2026-07-23.md

> **Problem:** Cloudflare 521 — Origin web server is not reachable
> **Cloudflare:** ✅ UP (Zurich)
> **Host (www.jumanasoft.com / 204.168.144.74):** ❌ DOWN
> **Date:** 2026-07-23 20:08 UTC

---

## 1. SSH to the Hetzner server

```bash
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74
```

If this times out, the host is **completely unreachable** (network/firewall issue at Hetzner). If it works, proceed to step 2.

---

## 2. Run these diagnostic commands in order

Copy-paste the whole block:

```bash
echo "=== A. PM2 STATUS ===" && pm2 status

echo "=== B. NGINX STATUS ===" && systemctl status nginx --no-pager 2>&1 | head -20

echo "=== C. PORT 3000 LISTENING? ===" && ss -tlnp 2>&1 | grep -E ":3000|:80|:443"

echo "=== D. LOCAL HEALTH CHECK ===" && curl -s -m 3 http://127.0.0.1:3000/api/health

echo "=== E. PM2 LOGS (last 50) ===" && pm2 logs nama-medical-erp --lines 50 --nostream --raw 2>&1 | tail -50

echo "=== F. DISK SPACE ===" && df -h /

echo "=== G. MEMORY ===" && free -h

echo "=== H. CPU LOAD ===" && uptime

echo "=== I. NGINX ERROR LOG (last 20) ===" && tail -20 /var/log/nginx/error.log 2>&1

echo "=== J. NGINX ACCESS LOG (last 10) ===" && tail -10 /var/log/nginx/access.log 2>&1
```

---

## 3. Most likely causes + fixes

### Cause #1: PM2 process crashed (MOST COMMON)

**Symptom:** `pm2 status` shows `errored` or `stopped` for `nama-medical-erp`

**Fix:**
```bash
pm2 restart nama-medical-erp --update-env
pm2 save
curl -s http://127.0.0.1:3000/api/health  # should be {"status":"UP","db":"up"}
```

If it crashes immediately after restart, check logs:
```bash
pm2 logs nama-medical-erp --lines 200 --nostream --raw 2>&1 | tail -100
```

---

### Cause #2: nginx down

**Symptom:** `systemctl status nginx` shows `inactive (dead)` or `failed`

**Fix:**
```bash
systemctl start nginx
systemctl enable nginx
systemctl status nginx --no-pager
```

If it fails to start, check config:
```bash
nginx -t
# then fix any reported errors in /etc/nginx/sites-enabled/*
```

---

### Cause #3: Port 3000 not listening

**Symptom:** `ss -tlnp | grep :3000` shows nothing

**Fix:** PM2 is not running. See Cause #1.

---

### Cause #4: Database connection failed (PM2 up but unhealthy)

**Symptom:** `curl /api/health` returns `{"status":"DOWN","db":"down"}` or 500

**Fix:**
```bash
# Check postgres
systemctl status postgresql --no-pager
sudo -u postgres psql -d nama_medical_web -c "SELECT 1"  # should return 1

# If postgres is down:
systemctl start postgresql
systemctl status postgresql
```

Then restart PM2:
```bash
pm2 restart nama-medical-erp --update-env
curl -s http://127.0.0.1:3000/api/health
```

---

### Cause #5: Disk full (PM2 can't write logs)

**Symptom:** `df -h` shows 100% on `/` or `/var`

**Fix:**
```bash
# Clear old logs
pm2 flush
journalctl --vacuum-size=100M
rm -rf /var/log/*.gz
# Clear old PM2 backups older than 30 days
find /root/nama_backups -name "*.dump" -mtime +30 -delete
# Clear /tmp
rm -rf /tmp/*
df -h /
```

---

### Cause #6: Out of memory (OOM)

**Symptom:** `free -h` shows 0 available, OR `dmesg | grep -i oom` shows kills

**Fix:**
```bash
# Check OOM
dmesg | grep -i "out of memory" | tail -10

# Add swap if not present
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Restart
pm2 restart nama-medical-erp --update-env
```

---

## 4. After fixing — verify the site loads

```bash
# 1. Local health
curl -s http://127.0.0.1:3000/api/health
# Expected: {"status":"UP","db":"up"}

# 2. Direct IP health (bypass Cloudflare)
curl -s http://204.168.144.74:3000/api/health
# Expected: same as above

# 3. Through Cloudflare (this is what users see)
curl -s https://jumanasoft.com/api/health
# Expected: same as above (after fix)

# 4. PM2 should show online
pm2 status
# Expected: nama-medical-erp | online | 1|... 

# 5. Save PM2 state for next reboot
pm2 save
```

---

## 5. If nothing works — emergency reboot

```bash
# Last resort: reboot the whole VM (Hetzner console)
# After reboot, ssh back and:
pm2 resurrect    # restore PM2 processes from saved state
systemctl start nginx
systemctl start postgresql
curl -s http://127.0.0.1:3000/api/health
```

---

## 6. Tell me what the diagnostics show

After running the diagnostic block in step 2, paste the output. I'll tell you exactly which fix to apply.

**Critical info I need:**
1. `pm2 status` — what does the process status look like?
2. `curl /api/health` — does it respond at all?
3. `systemctl status nginx` — is nginx running?

---

> **Time to fix:** 1-10 minutes depending on cause
> **Risk:** NONE (we're just restarting already-running services)
