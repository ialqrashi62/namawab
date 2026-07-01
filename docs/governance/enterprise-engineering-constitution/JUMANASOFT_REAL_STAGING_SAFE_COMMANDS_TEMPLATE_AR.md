# الأوامر الإرشادية الآمنة لتهيئة وفحص بيئة Staging (Jumanasoft Real Staging Safe Commands Template)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تهيئة وفحص جاهزية بيئة Staging الحقيقية (PHASE_REAL_STAGING_INFRA_PROVISIONING_AND_EVIDENCE_CAPTURE)
* **البوابة:** البوابة B3 — الأوامر الإرشادية الآمنة (Gate B3 — Safe Commands Template)
* **الحالة:** تم التوثيق والفرض بنجاح (ENFORCED) ✅

---

## 1. الأوامر الفنية الإرشادية الآمنة لمسؤول الديف أوبس (DevOps Setup Commands)

تمت صياغة أوامر التحقق والتهيئة باستخدام قوالب خالية من أي كلمات مرور أو معلومات بيئية حساسة لضمان السرية:

### 1. أوامر التحقق من صلاحيات قاعدة البيانات (SQL Checks):
```sql
-- فحص اسم قاعدة البيانات الفعالة
SELECT current_database();

-- فحص اسم مستخدم الاتصال الحالي للتطبيق
SELECT current_user;

-- فحص صلاحيات المستخدم للتأكد من حظر superuser وحظر bypassrls
SELECT rolname, rolsuper, rolbypassrls 
FROM pg_roles 
WHERE rolname = 'jumanasoft_staging_user';
```

### 2. أوامر التحقق من خادم التطبيقات (PM2 Setup):
```bash
# تشغيل خادم الاستضافة التجريبي تحت إدارة PM2
pm2 start server.js --name "jumanasoft-app-staging" --env staging

# عرض حالة تشغيل العمليات والتأكد من استقرار الخدمة
pm2 list
```

### 3. أوامر التحقق من خادم الويب وحظر الأرشفة (Nginx & Curl):
```bash
# فحص استجابة الصفحة الرئيسية لبيئة Staging
curl -I http://localhost:3010/api/health

# التحقق من وجود ترويسة حظر محركات البحث (noindex)
curl -s -I https://staging.jumanasoft.com | grep -i "X-Robots-Tag"
```

---
**القرار:** تم توثيق وصياغة الأوامر الإرشادية الآمنة للمسؤول، ومصرح بالانتقال لـ GATE B4 لإصدار قرار تعليق التشغيل بنجاح.
