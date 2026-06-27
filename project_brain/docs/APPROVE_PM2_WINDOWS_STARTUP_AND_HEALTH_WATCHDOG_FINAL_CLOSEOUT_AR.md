# الإغلاق النهائي — APPROVE_PM2_WINDOWS_STARTUP_AND_HEALTH_WATCHDOG

> 2026-06-22 | hardening تشغيلي فقط (لا كود تطبيق/DB/.env/GRANT/أسرار). الهدف: إغلاق فجوة الإحياء التلقائي بعد الحادثة.

## ملخّص ما نُفِّذ
أُغلِقت فجوة الإحياء التلقائي عبر طبقتين متكاملتين، كلاهما بلا رفع صلاحية وقابلتان للتراجع:
1. **بدء تشغيل عند الدخول (Logon)** عبر إدخال `HKCU\...\Run\NamaMedical-PM2-Resurrect` يشغّل `ops/startup/nama_pm2_resurrect.ps1` (ينتظر Redis ثم `pm2 resurrect`).
2. **مراقبة دورية** عبر Scheduled Task `NamaMedical-Health-Watchdog` كل 5 دقائق (مدة غير منتهية) تشغّل `ops/watchdogs/nama_health_watchdog.ps1` (يفحص health؛ عند السقوط يُعيد nama-redis ثم PM2، ويسجّل).

> سبب اختيار HKCU Run بدل Scheduled Task لـlogon: إنشاء مهمة بمُشغِّل AtLogOn يتطلّب صلاحيات Admin
> (فشل بـ "Access is denied" في الصدفة غير المرفوعة). HKCU Run هو المسار القياسي لكل-مستخدم بلا رفع صلاحية
> (نفس آلية Docker Desktop). المراقبة كل 5 دقائق تعمل أيضاً بعد الدخول (StartWhenAvailable + past-due Once + repetition)
> فتشكّل شبكة أمان ثانية تُصلح أي سقوط خلال ≤5 دقائق.

## نتائج البوابات
| البوابة | النتيجة |
|---|---|
| 0 Preflight | health=200، pm2 nama-app online (restarts=2)، Redis PONG، لا env/secrets staged |
| 1 Startup audit | pm2 dump محفوظ؛ nama-redis=unless-stopped؛ Docker autostart مُهيّأ؛ **لا startup/watchdog سابقاً** |
| 2 PM2 startup | ✅ HKCU Run\NamaMedical-PM2-Resurrect (logon)؛ pm2 save ✓ |
| 3 Redis/Docker | ✅ nama-redis=unless-stopped؛ Docker autostart=HKCU Run (مُهيّأ)؛ PONG |
| 4 Health watchdog | ✅ سكربت منفصل + Scheduled Task كل 5 دقائق (مدة غير منتهية) |
| 5 Recovery test | ✅ dry-run للسكربتين (watchdog سجّل OK؛ resurrect استعاد دون قتل العملية)؛ health بقي 200؛ لا crash-loop (لم يُنفَّذ stop test — غير مُصرّح في بلوك الموافقة) |
| 6 Runbook | ✅ `PM2_WINDOWS_STARTUP_AND_HEALTH_WATCHDOG_RUNBOOK_AR.md` |
| 7 Monitoring | ✅ health 200، PM2 online، Redis PONG، Docker UP، لا أسرار، .env غير ملموس، accounting OFF، journal=0 |
| 8 Hygiene/Git | ✅ ملفات ops/docs فقط؛ لا env/secrets؛ commit/push FF |
| 9 Closeout | ✅ هذا المستند |

## الحالة
```text
FINAL_STATUS: PM2_WINDOWS_STARTUP_AND_HEALTH_WATCHDOG_DEPLOYED_PASS
PM2_STARTUP_CONFIGURED: YES (HKCU Run — مهمة logon المجدولة تتطلّب Admin؛ استُعيض عنها بـHKCU Run + المراقبة الدورية)
PM2_DUMP_SAVED: YES
REDIS_RESTART_POLICY_OK: YES (unless-stopped)
HEALTH_WATCHDOG_DEPLOYED: YES (Scheduled Task كل 5 دقائق، مدة غير منتهية)
RUNBOOK_CREATED: YES
HEALTH_SMOKE: PASS (200)
DB_ROLE_CURRENT: nama_medical_app
APP_PATH_TENANT_BINDING: PASS
DDL_EXECUTED: NO
DATA_CHANGED: NO
GRANT_EXECUTED: NO
CODE_DEPLOYED: NO_APP_CODE (سكربتات ops منفصلة فقط)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: API_RBAC_DEFENSE_IN_DEPTH_BATCHES
```

## التراجع (إن لزم)
```powershell
Unregister-ScheduledTask -TaskName "NamaMedical-Health-Watchdog" -Confirm:$false
Remove-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -Name 'NamaMedical-PM2-Resurrect'
# (السكربتات تحت ops/ تبقى بلا أثر تشغيلي بعد الإزالة)
```

## ملاحظة تشغيلية متبقّية
- مهمة logon المجدولة (بدل HKCU Run) تتطلّب جلسة PowerShell **مرفوعة Admin** إن رُغبت لاحقاً؛ HKCU Run كافٍ حالياً ويغطّي السيناريو.

تم اكتمال ضبط PM2 وRedis والـhealth watchdog لتقليل خطر سقوط الخدمة بعد إعادة التشغيل
