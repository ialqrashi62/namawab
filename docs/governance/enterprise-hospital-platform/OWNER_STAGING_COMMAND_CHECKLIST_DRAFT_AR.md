# مسودة أوامر تهيئة بيئة الاختبار للمالك (Owner Staging Command Checklist Draft)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تسليم واعتماد تجهيز بيئة الاختبار للمالك (PHASE_OWNER_STAGING_PROVISIONING_HANDOFF_AND_SIGNOFF)
* **الهدف:** تقديم قائمة بالأوامر البرمجية المقترحة لمساعد مهندس العمليات (DevOps) على تهيئة الخادم وقاعدة البيانات والبيئة بشكل صحيح.

---

> [!WARNING]
> * **تحذير أمني شديد:** يمنع منعاً باتاً استبدال الرموز المحجوزة (Placeholders) بكلمات مرور أو أسرار حقيقية داخل هذا الملف أو نسخها في التقرير النهائي.
> * يجب استخدام كلمات مرور عشوائية وقوية ويتم إدخالها مباشرة على الخادم وتأمينها.

---

## 1. أوامر تهيئة الخادم وجدار الحماية (Host & Firewall)

تُنفذ هذه الأوامر على خادم Staging لتأمينه وعزل حركة الشبكة:

```bash
# تحديث الحزم البرمجية للخادم
sudo apt update && sudo apt upgrade -y

# تفعيل جدار الحماية وحظر كافة الاتصالات الواردة افتراضياً
sudo ufw default deny incoming
sudo ufw default allow outgoing

# السماح بالاتصال فقط من عناوين الآي بي الخاصة بالمطورين وفاحصي الجودة على منفذ SSH
sudo ufw allow from <DEVELOPER_IP> to any port 22 proto tcp

# السماح بحركة مرور الويب العامة لنقطة الصحة والتحقق
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# تفعيل جدار الحماية
sudo ufw enable
```

---

## 2. أوامر تهيئة قاعدة البيانات والمستخدم (PostgreSQL)

تُنفذ هذه الخطوات بصلاحيات مستخدم نظام التشغيل `postgres` لإنشاء الكائنات المعزولة:

```bash
# الدخول لوحدة تحكم PostgreSQL
sudo -u postgres psql

# داخل وحدة التحكم (psql):
# 1. إنشاء قاعدة بيانات الاختبار المستقلة
CREATE DATABASE nama_medical_staging;

# 2. إنشاء مستخدم معزول ومحمي بكلمة مرور مخصصة
CREATE USER nama_staging_user WITH PASSWORD '<STAGING_DB_PASSWORD>';

# 3. منح الصلاحيات الكاملة للمستخدم على قاعدة بيانات الاختبار فقط
GRANT ALL PRIVILEGES ON DATABASE nama_medical_staging TO nama_staging_user;

# 4. الخروج من وحدة التحكم
\q
```

---

## 3. إعداد ملف البيئة وعزل الأسرار (Staging Env File)

يتم إنشاء ملف التكوين المخصص في مسار المشروع وتأمين صلاحيات الوصول إليه:

```bash
# إنشاء وتعديل ملف البيئة
cat > /var/www/namaweb/.env.staging << 'EOF'
PORT=3010
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nama_medical_staging
DB_USER=nama_staging_user
DB_PASSWORD=<STAGING_DB_PASSWORD>
SESSION_SECRET=<STAGING_SESSION_SECRET>
JWT_SECRET=<STAGING_JWT_SECRET>
NODE_ENV=production
EOF

# تقييد صلاحيات الملف ليكون مقروءاً فقط من قبل المالك المسؤول عن تشغيل الخدمة
chmod 600 /var/www/namaweb/.env.staging
```

---

## 4. تهيئة عملية التشغيل في PM2 وعزل السجلات (PM2 & Logs)

```bash
# تشغيل التطبيق تحت عملية مستقلة بالكامل مع تحميل ملف بيئة الاختبار
pm2 start server.js --name nama-app-staging --update-env -- --env=staging

# عزل وتوجيه السجلات وتحديد مسارها
pm2 start server.js --name nama-app-staging --log /var/log/nama-app-staging/app.log --output /var/log/nama-app-staging/out.log --error /var/log/nama-app-staging/err.log

# حفظ وإعداد عملية البدء التلقائي لـ PM2 عند إعادة تشغيل الخادم
pm2 save
```

---

## 5. تهيئة النطاق الفرعي وتشفير TLS (Nginx & Certbot)

* **مثال لتهيئة خادم Nginx للنطاق الفرعي:**
  ```nginx
  server {
      listen 80;
      server_name <STAGING_DOMAIN>;

      location / {
          proxy_pass http://127.0.0.1:3010;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
  }
  ```
* **أمر تشغيل Certbot لتوليد شهادة SSL تلقائياً:**
  ```bash
  sudo certbot --nginx -d <STAGING_DOMAIN>
  ```

---

## 6. إعداد النسخ الاحتياطي التلقائي (Pg_dump)

```bash
# أمر النسخ الاحتياطي اليدوي والتأكد من نجاح العملية لقاعدة بيانات الاختبار
pg_dump -Fc -h localhost -U nama_staging_user -d nama_medical_staging > /var/backups/staging/nama_staging_$(date +%F).dump
```
