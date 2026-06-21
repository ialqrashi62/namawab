# دليل التشغيل — PM2 Windows Startup و Health Watchdog (NamaMedical)

> الغرض: ضمان عودة الخدمة تلقائياً بعد إعادة التشغيل/تسجيل الخروج أو توقّف Docker/Redis/PM2،
> بناءً على حادثة توقّف الخدمة السابقة (Docker Desktop توقّف ⇒ nama-redis غير متاح ⇒ التطبيق رفض الإقلاع).
> الطبيعة: hardening تشغيلي فقط — لا كود تطبيق، لا DB، لا .env، لا أسرار.

## المكوّنات المُركّبة

| المكوّن | الموقع | الوظيفة |
|---|---|---|
| سكربت الإحياء عند الدخول | `ops/startup/nama_pm2_resurrect.ps1` | ينتظر Redis ثم `pm2 resurrect` |
| سكربت المراقبة | `ops/watchdogs/nama_health_watchdog.ps1` | يفحص health؛ عند السقوط يُعيد Redis+PM2 |
| إدخال بدء التشغيل (Logon) | `HKCU\...\CurrentVersion\Run\NamaMedical-PM2-Resurrect` | يشغّل سكربت الإحياء عند تسجيل دخول المستخدم |
| مهمة المراقبة الدورية | Scheduled Task `NamaMedical-Health-Watchdog` | تشغّل المراقبة كل 5 دقائق (مدة غير منتهية) أثناء الدخول |
| السجلّات | `ops/watchdogs/logs/{startup,watchdog}.log` | سجلّ محلي بلا أسرار (تدوير عند ~1MB) |

> ملاحظة: مهمة logon عبر Scheduled Task تتطلّب صلاحيات Admin (فشلت بـ Access denied)،
> لذا اعتُمد إدخال **HKCU Run** (لكل مستخدم، بلا رفع صلاحية) — نفس آلية Docker Desktop.
> المراقبة كل 5 دقائق هي شبكة الأمان الثانية: حتى لو تأخّر الإحياء، تكتشف المراقبة السقوط وتُصلح خلال ≤5 دقائق.

## كيف أتحقّق من PM2
```powershell
pm2 status
pm2 jlist | ConvertFrom-Json | Select-Object name, pm2_env  # تفصيلي
```
- المتوقّع: `nama-app` = `online`.

## كيف أتحقّق من Redis
```powershell
docker ps --format "table {{.Names}}\t{{.Status}}"
docker exec nama-redis redis-cli ping   # المتوقّع: PONG
```

## كيف أشغّل Docker / Redis يدوياً
```powershell
# 1) تأكّد أن Docker Desktop يعمل (يبدأ تلقائياً عند الدخول عبر HKCU Run)
# إن لم يعمل: افتح Docker Desktop من قائمة ابدأ وانتظر "Engine running"
docker start nama-redis
docker exec nama-redis redis-cli ping
```

## كيف أعمل pm2 resurrect
```powershell
& 'C:\nvm4w\nodejs\pm2.cmd' resurrect   # يستعيد قائمة العمليات المحفوظة (dump.pm2)
pm2 save                                 # يحفظ القائمة الحالية (بعد أي تغيير مقصود)
```

## كيف أقرأ health
```powershell
(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/api/health -TimeoutSec 5).StatusCode  # 200
```

## كيف أُرجِع الخدمة بعد reboot (يدوياً عند الحاجة)
```powershell
# 1) Docker Desktop يبدأ تلقائياً؛ انتظر تشغيل المحرّك
# 2) تأكّد من Redis
docker start nama-redis; docker exec nama-redis redis-cli ping
# 3) أحْيِ التطبيق
& 'C:\nvm4w\nodejs\pm2.cmd' resurrect
# 4) تحقّق
(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/api/health).StatusCode
```
> في الوضع الطبيعي تتم هذه الخطوات تلقائياً (HKCU Run + المراقبة الدورية). الخطوات أعلاه للطوارئ فقط.

## كيف أراقب أو أوقف الأتمتة
```powershell
# عرض المهمة الدورية
Get-ScheduledTask -TaskName "NamaMedical-*" | Select TaskName, State
# قراءة سجلّ المراقبة
Get-Content "C:\Users\ice\Desktop\NamaMedical\ops\watchdogs\logs\watchdog.log" -Tail 20
# إيقاف/إزالة (تراجع نظيف)
Unregister-ScheduledTask -TaskName "NamaMedical-Health-Watchdog" -Confirm:$false
Remove-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -Name 'NamaMedical-PM2-Resurrect'
```

## ما الذي لا يجب فعله
- لا تشغّل التطبيق بدون Redis (التطبيق يرفض MemoryStore عمداً في الإنتاج — لا fallback).
- لا تحذف `C:\Users\ice\.pm2\dump.pm2` (هو قائمة العمليات المحفوظة).
- لا تغيّر دور قاعدة البيانات (`nama_medical_app`) ولا كلمة المرور ولا `.env`.
- لا تطبع أسرار في السجلّات؛ السكربتات لا تقرأ `.env` ولا تلمس DB.
- لا توقف `nama-redis` يدوياً أثناء عمل الخدمة (سياسته `unless-stopped`؛ يعود تلقائياً مع Docker).
- لا تلمس ملفات الجلسات الموازية (migrate.ps1 / protocol_x.ps1) ولا ملفات Stitch/MEDICAL.

## التحقّق من السياسات الحالية (مرجع)
```text
nama-redis RestartPolicy = unless-stopped
Docker Desktop autostart  = HKCU Run (مُهيّأ)
PM2 dump                  = C:\Users\ice\.pm2\dump.pm2 (محفوظ)
PM2 logon startup         = HKCU Run\NamaMedical-PM2-Resurrect
Health watchdog           = Scheduled Task كل 5 دقائق (مدة غير منتهية)
```
