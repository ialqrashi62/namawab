# تقرير أخذ نسخة احتياطية كاملة لموقع جمانة ميديكال وقاعدة البيانات
**التاريخ:** 17 يوليو 2026
**المنفذ:** فريق الهندسة والـ DevOps (S-MODE)
**الحالة:** مكتمل بنجاح 100%

---

## 1. تفاصيل النسخة الاحتياطية

| العنصر | القيمة / المسار | الحجم |
|---|---|---|
| **خادم الإنتاج (IP)** | `204.168.144.74` | - |
| **اسم قاعدة البيانات** | `nama_medical_web` | - |
| **مسار ملف قاعدة البيانات (المنفصل)** | `/root/backups/db_backup_20260717.dump` | `1.4 MB` |
| **مسار الملف المضغوط الكامل (الملفات + قاعدة البيانات)** | `/root/backups/jumanamedical_full_backup_20260717.tar.gz` | `47 MB` |
| **مجلدات الويب المؤرشفة** | `/var/www/namaweb` (مع استبعاد `node_modules` لتقليل الحجم) | - |

---

## 2. الخطوات المنفذة

1. **إنشاء مجلد النسخ الاحتياطية:**
   ```bash
   mkdir -p /root/backups
   ```

2. **تصدير قاعدة البيانات (PostgreSQL Dump):**
   تم تصدير قاعدة البيانات بصيغة مخصصة ومضغوطة (`-F c`) عبر حساب المستخدم `postgres`:
   ```bash
   sudo -u postgres pg_dump -d nama_medical_web -F c -f /tmp/db_backup_20260717.dump
   mv /tmp/db_backup_20260717.dump /root/backups/db_backup_20260717.dump
   ```

3. **دمج ملفات الويب وقاعدة البيانات في أرشيف واحد:**
   تم نقل ملف قاعدة البيانات مؤقتاً إلى مجلد الويب، ثم ضغط المجلد بالكامل مع استثناء `node_modules` لضمان الحصول على ملف صغير الحجم وسريع التحميل:
   ```bash
   cp /root/backups/db_backup_20260717.dump /var/www/namaweb/db_backup_20260717.dump
   tar --exclude='namaweb/node_modules' -czf /root/backups/jumanamedical_full_backup_20260717.tar.gz -C /var/www namaweb
   rm -f /var/www/namaweb/db_backup_20260717.dump
   ```

4. **التحقق من سلامة الأرشيف:**
   تم التأكد من احتواء الأرشيف المضغوط على ملف قاعدة البيانات الداخلي `namaweb/db_backup_20260717.dump` وجميع ملفات الأكواد بنجاح.
