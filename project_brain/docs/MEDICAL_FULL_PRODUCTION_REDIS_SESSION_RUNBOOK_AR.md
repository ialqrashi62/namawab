# دليل إدارة جلسات Redis والذاكرة المشتركة (Redis Session Runbook)
## نظام نما الطبي (NamaMedical) - وثيقة التسليم النهائي

يوثق هذا الدليل الخطوات والإجراءات المعتمدة لإدارة ومراقبة خادم Redis المسؤول عن إدارة الجلسات الموزعة وأمان هويات المستخدمين لمنع تراجع الجلسات.

---

## 1. الفحص الدوري والتحقق التشغيلي (Redis Health Checks)

تخضع خدمة Redis للفحوصات الدورية التالية:

* **فحص الاستجابة (Service Ping)**:
  ```bash
  redis-cli ping
  # الاستجابة المتوقعة: PONG
  ```
* **فحص استهلاك الذاكرة**:
  ```bash
  redis-cli info memory | grep used_memory_human
  # الاستهلاك المتوقع: أقل من 5 MB في الحالات العادية
  ```
* **التحقق من حالة مفاتيح الجلسات المشتركة**:
  ```bash
  redis-cli keys "*nama_session*"
  ```

---

## 2. إدارة خدمة Redis في النظام (Service Administration)

* **إعادة تشغيل خادم Redis**:
  ```bash
  systemctl restart redis-server
  ```
* **إيقاف خادم Redis**:
  ```bash
  systemctl stop redis-server
  ```
* **فحص حالة خادم Redis**:
  ```bash
  systemctl status redis-server
  ```

---

## 3. التعامل مع مشكلات انقطاع الاتصال (Troubleshooting)

إذا ظهر تحذير Redis أو انهار التطبيق بسبب فشل الاتصال بـ Redis:
1. تحقق من أن خادم Redis يعمل باستخدام `systemctl status redis-server`.
2. إذا كان معطلاً، قم بتشغيله `systemctl start redis-server`.
3. تحقق من سجلات التطبيق عبر PM2: `pm2 logs nama-medical-erp --lines 80 --nostream`.
4. تأكد من إعدادات المنفذ والمضيف بملف `.env`:
   - `REDIS_HOST=localhost`
   - `REDIS_PORT=6379`
5. أعد تشغيل التطبيق بالكامل: `pm2 restart nama-medical-erp --update-env`.
