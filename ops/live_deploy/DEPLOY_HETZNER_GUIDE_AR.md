# دليل رفع الملفات إلى Hetzner — jumanasoft.com

> **متى يُنفَّذ**: بعد موافقة المالك الصريحة (AGENTS.md §2.4).
> **المالك**: ubuntu@204.168.144.74
> **المفتاح**: `C:\Users\ice\.ssh\nama_medical_key` (بدون passphrase)
> **أداة الرفع**: PSCP (PuTTY) — لا يحتاج Pageant.

---

## 1. التشغيل بنقرة واحدة

```powershell
pwsh -File C:\Users\ice\Desktop\NMEDCALVSCODE\deploy_hetzner.ps1
```

يقوم بـ:
1. `mkdir -p /var/www/namaweb/public/js/components /var/www/namaweb/public/i18n`
2. رفع 10 ملفات (HTMLs + JS + i18n JSON)
3. `pm2 reload nama-medical-erp --wait-ready`
4. `curl` لـ 6 عناوين للتأكد

## 2. التشخيص عند الفشل

```powershell
# اختبار المفتاح فقط
& "C:\Program Files\PuTTY\plink.exe" -i C:\Users\ice\.ssh\nama_medical_key -batch -ssh ubuntu@204.168.144.74 'whoami && hostname && uptime'
```

إذا فشل → **السبب الأكثر احتمالاً**: المفتاح العمومي غير مسجّل في `~/.ssh/authorized_keys` على الخادم. الإصلاح:

```bash
# على خادم Hetzner، كـ ubuntu:
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIERirsfzqG4TGfPhZJ9jk903KsyEwsAszDE0HwkndlBu ice@DESKTOP-T70LUCJ" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

(السطر أعلاه هو محتوى `C:\Users\ice\.ssh\nama_medical_key.pub`).

## 3. الرفع اليدوي بـ PSFTP

```powershell
"C:\Program Files\PuTTY\psftp.exe" -i C:\Users\ice\.ssh\nama_medical_key ubuntu@204.168.144.74
> cd /var/www/namaweb/public
> put C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\public\index.html
> put C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\public\station-index.html
> put C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\public\all-stations.html
> mkdir js/components
> put C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\public\js\wireframe-snippets.js
> put C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\public\js\components\hospital.js
> put C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\public\js\clinical-form-builder.js
> mkdir i18n
> put C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\i18n\medical_dictionary.json
> quit
```

ثم:
```powershell
& "C:\Program Files\PuTTY\plink.exe" -i C:\Users\ice\.ssh\nama_medical_key -batch -ssh ubuntu@204.168.144.74 'pm2 reload nama-medical-erp --wait-ready'
```

## 4. التحقق بعد الرفع

```powershell
& "C:\Program Files\PuTTY\plink.exe" -i C:\Users\ice\.ssh\nama_medical_key -batch -ssh ubuntu@204.168.144.74 'curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:3000/station-index.html'
```

النتيجة المتوقعة: `HTTP 200`.

## 5. التراجع (إن لزم)

```powershell
& "C:\Program Files\PuTTY\plink.exe" -i C:\Users\ice\.ssh\nama_medical_key -batch -ssh ubuntu@204.168.144.74 'cd /var/www/namaweb && git checkout -- public/' && pm2 reload nama-medical-erp
```

## 6. أمان (Safety Rails)

- ✅ RAIL-1: لا secrets (الـ `.env` لا يرفع)
- ✅ RAIL-3: لا force-push
- ✅ RAIL-12: لا طباعة PHI في logs
- ✅ PSCP/SFTP لا يطلب كلمة مرور (مصادقة مفتاح فقط)
- ✅ `--batch` يمنع أي prompt تفاعلي
