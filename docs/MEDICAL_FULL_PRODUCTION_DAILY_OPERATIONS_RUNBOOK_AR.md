# كتاب التشغيل اليومي للإنتاج (Daily Operations Runbook)
## نظام نما الطبي (NamaMedical) - وثيقة التسليم النهائي

يوفر هذا الدليل الخطوات التفصيلية لإدارة وتشغيل خادم التطبيق بشكل يومي للتأكد من استدامة الخدمات ونظام العزل.

---

## 1. إدارة العمليات عبر PM2 (Process Management)

يعمل تطبيق الويب تحت إدارة PM2 باسم العملية `nama-medical-erp`. فيما يلي الأوامر القياسية المعتمدة للتشغيل:

* **فحص الحالة التشغيلية**:
  ```bash
  pm2 status
  # أو لإظهار معلومات تفصيلية
  pm2 show nama-medical-erp
  ```
* **إعادة تشغيل التطبيق وتحديث البيئة**:
  ```bash
  pm2 restart nama-medical-erp --update-env
  ```
* **إيقاف الخدمة**:
  ```bash
  pm2 stop nama-medical-erp
  ```
* **بدء تشغيل الخدمة**:
  ```bash
  pm2 start server.js --name nama-medical-erp
  ```
* **حفظ الحالة التشغيلية للتفعيل التلقائي عند إقلاع السيرفر**:
  ```bash
  pm2 save
  ```

---

## 2. إدارة خادم الويب Nginx (Reverse Proxy & Web Server)

يعمل Nginx كخادم ويب وبوابات عكسية آمنة (Reverse Proxy). لإدارة الخدمة:

* **فحص سلامة التكوين**:
  ```bash
  nginx -t
  ```
* **إعادة تشغيل خادم Nginx**:
  ```bash
  systemctl restart nginx
  ```
* **فحص الحالة التشغيلية للخدمة**:
  ```bash
  systemctl status nginx
  ```

---

## 3. قراءة سجلات التشغيل اليومية (Logs Observation)

* **عرض سجلات الأخطاء والمخرجات الفورية**:
  ```bash
  pm2 logs nama-medical-erp --lines 100 --nostream
  ```
* **مسارات السجلات القياسية**:
  - سجل المخرجات: `/root/.pm2/logs/nama-medical-erp-out.log`
  - سجل الأخطاء: `/root/.pm2/logs/nama-medical-erp-error.log`
  - سجل Nginx العام: `/var/log/nginx/access.log` و `/var/log/nginx/error.log`

---

## 4. سياسات المحافظة على سلامة البيئة

* **تعديل الإعدادات البيئية (`.env`)**: في حال الحاجة لتعديل الإعدادات، يمنع إدراج قيم معلنة في الكود أو Git. يجب تعديل الملف `/var/www/namaweb/.env` مباشرة ثم تشغيل `pm2 restart nama-medical-erp --update-env` لتفعيل التغييرات.
