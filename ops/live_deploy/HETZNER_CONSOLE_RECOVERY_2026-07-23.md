# HETZNER_CONSOLE_RECOVERY_2026-07-23.md

> **When:** SSH + Hetzner API are both unavailable (server completely frozen)
> **Tool:** Hetzner Cloud Console (web UI)
> **URL:** https://console.hetzner.cloud/

---

## 1. Open Hetzner Cloud Console

Go to: https://console.hetzner.cloud/

Sign in with your account (the one that owns the project containing 204.168.144.74).

---

## 2. Select the project

In the project list, click on the project that contains the NamaMedical server.

---

## 3. Find the server

You should see a list of servers. Find the one with:
- **IP:** 204.168.144.74
- **Name:** (likely `ubuntu-8gb-hel1-1` or similar)
- **Status:** Should show but possibly greyed out / unresponsive

Click on it.

---

## 4. Choose the recovery action

You have 4 options, in order of preference:

### Option A: Soft Reboot (try this first)

1. Go to the server's "Overview" tab
2. Scroll to the "Power" section
3. Click **"Reboot"** (NOT "Power off")
4. A confirmation dialog will appear → click "Reboot" again
5. Wait 60-90 seconds for the server to come back
6. SSH should be reachable again

If Option A doesn't work after 3 minutes, try Option B.

---

### Option B: Hard Reboot (force power cycle)

1. If "Reboot" doesn't work, click **"Power off"** first
2. Wait 30 seconds (the status should change to "off")
3. Click **"Power on"**
4. Wait 60-90 seconds
5. SSH should come back

---

### Option C: Rescue Mode (last resort if A and B fail)

1. Go to the "Rescue" tab in the left menu
2. Click **"Enable Rescue & Reboot"**
3. Choose OS: **ubuntu-22.04** (or whatever the original OS was)
4. Choose SSH key: pick your key
5. Click "Enable"
6. Wait 30-60 seconds — the server will boot into a **rescue Linux image** (not your real OS)
7. SSH in: `ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74`
8. You should see a rescue prompt like `rescue:~#`
9. Mount the real disk: `mount /dev/sda1 /mnt`
10. Investigate: `cat /mnt/var/log/syslog | tail -100`
11. Check what's wrong: `ls /mnt/var/www/namaweb/`
12. After fixing, reboot out of rescue: `reboot`

---

### Option D: Rebuild from snapshot (only if disk is corrupted)

If the disk is corrupted, you can rebuild from a snapshot:
1. Go to "Snapshots" tab
2. Find the most recent backup snapshot
3. Click "Restore" (this will REPLACE the current disk)
4. **WARNING:** All changes since the snapshot are LOST

---

## 5. After recovery — restore services

Once the server is back, SSH in and run:

```bash
# 1. Verify PM2
pm2 status
# If nama-medical-erp is stopped/error:
pm2 restart nama-medical-erp --update-env
pm2 save

# 2. Verify nginx
systemctl status nginx
# If down:
systemctl start nginx
systemctl enable nginx

# 3. Verify postgres
systemctl status postgresql
# If down:
systemctl start postgresql

# 4. Test health
curl -s http://127.0.0.1:3000/api/health
# Should be: {"status":"UP","db":"up"}

# 5. Wait for Cloudflare
sleep 60
curl -s https://jumanasoft.com/api/health
# Should be: {"status":"UP","db":"up"}
```

---

## 6. If NOTHING works

Contact Hetzner support:
- Email: support@hetzner.com
- Cloud Console: Help icon (bottom right) → Chat

Tell them:
> "Server 204.168.144.74 in project [your project name] is completely unresponsive. SSH and Hetzner API are both timing out. Please investigate and reboot or provide rescue access."

---

## 7. Automated alternative

If you have a Hetzner Cloud API token, you can automate the reboot:

```powershell
$token = "hcloud_xxxxxxxxxxxxx"  # get from console.hetzner.cloud
.\rescue_521_enhanced_2026-07-23.ps1 -HCLOUD_TOKEN $token
```

This will automatically find your server by IP and reboot it.

---

## 8. Quick reference card

| Problem | First action | If that fails |
|---|---|---|
| SSH timeout | Soft Reboot via Console | Power off → Power on |
| Server completely frozen | Soft Reboot | Rescue mode |
| Disk corrupted | Snapshot restore | Rebuild from backup |
| Repeated crashes after reboot | Enable Rescue + read syslog | Contact Hetzner support |

| Command (after recovery) | Purpose |
|---|---|
| `pm2 status` | Check app process |
| `pm2 restart nama-medical-erp` | Restart app |
| `systemctl status nginx` | Check nginx |
| `systemctl status postgresql` | Check DB |
| `curl http://127.0.0.1:3000/api/health` | Test app |
| `pm2 logs nama-medical-erp --lines 100` | Read error logs |
| `df -h` | Check disk space |
| `free -h` | Check memory |

---

> **Last resort:** If Hetzner is unresponsive, the data is safe in the daily backups at `/root/nama_backups/` (also copied to `local_backups/` on the local repo). You can rebuild on a new VM in 30-60 minutes.
