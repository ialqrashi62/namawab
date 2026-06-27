# PHASE 4 — دليل تسليم التشغيل (Operations Handover)

> 2026-06-22 | يُكمّل `PM2_WINDOWS_STARTUP_AND_HEALTH_WATCHDOG_RUNBOOK_AR.md` (لا تكرار).

## فحوص يومية سريعة
```powershell
# الصحة
(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/api/health).StatusCode   # 200
# PM2
pm2 status                                  # nama-app = online
# Redis
docker exec nama-redis redis-cli ping       # PONG
# watchdog
Get-ScheduledTask -TaskName "NamaMedical-*" | Select TaskName,State   # Ready
Get-Content C:\Users\ice\Desktop\NamaMedical\ops\watchdogs\logs\watchdog.log -Tail 5
```

## إعادة التشغيل الآمنة
```powershell
docker start nama-redis; docker exec nama-redis redis-cli ping
& 'C:\nvm4w\nodejs\pm2.cmd' resurrect       # أو: pm2 restart nama-app
(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/api/health).StatusCode
```

## التحقق من عزل المستأجرين / RLS (read-only)
```text
- الدور: current_user = nama_medical_app (rolsuper=false, rolbypassrls=false)
- عدد FORCE RLS = 148
- إثبات: ctx=1 → بيانات المستأجر؛ ctx=999 → 0؛ بلا سياق → 0
```

## ممنوعات تشغيلية
- لا تشغيل بلا Redis (التطبيق يرفض MemoryStore عمداً).
- لا تغيير دور DB / كلمة المرور / .env.
- لا حذف dump.pm2.
- لا تلمس migrate.ps1/protocol_x.ps1 ولا فرع namaweb الموازي `master`.

## تصعيد الحوادث
1. health ≠ 200 → تحقّق Redis (docker start) → pm2 resurrect → اقرأ سجل watchdog.
2. crash-loop → `git -C namaweb checkout <prev> -- server.js && pm2 restart` (rollback كود).
3. خطأ DB/RLS → راجع down.sql المناسب في docs/sql/ (بموافقة قبل أي تراجع DDL).
```text
OPERATIONS_HANDOVER: READY
```
