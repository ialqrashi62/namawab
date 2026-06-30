# مسودة أوامر التحقق الآمنة لبيئة الاختبار (Safe Staging Verification Commands Draft)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** خطة علاج فجوات بيئة الاختبار للمالك وفريق العمليات (PHASE_STAGING_GAPS_OWNER_REMEDIATION_PLAN)
* **الهدف:** تقديم مجموعة من الأوامر البرمجية المقترحة للقراءة فقط (Read-Only) لتمكين فريق العمليات وفحص الجودة من التحقق من عزل وصحة بيئة الاختبار دون تعريض أسرار النظام أو البيانات لأي مخاطر.

---

## 1. أوامر فحص الخادم والشبكة (Host & Network Checks)

تُنفذ هذه الأوامر على خادم Staging للتحقق من سلامة البيئة وحدود الموارد وجدار الحماية:

* **التحقق من مواصفات الذاكرة والموارد المحددة للبيئة:**
  ```bash
  free -m
  lscpu | grep "CPU(s):"
  ```
* **التحقق من حالة جدار الحماية وعزل المنافذ (Firewall Boundary):**
  ```bash
  sudo ufw status verbose
  # أو باستخدام iptables
  sudo iptables -L -n -v
  ```
  *(يجب التأكد من أن المنفذ 5432 الخاص بقاعدة بيانات الإنتاج غير مسموح بالاتصال به)*.

---

## 2. أوامر فحص عملية التشغيل والمنافذ (Process & Port Checks)

* **التحقق من حالة عملية التطبيق في PM2:**
  ```bash
  pm2 status
  pm2 describe nama-app-staging
  ```
  *(يجب التأكد من تشغيل التطبيق باسم العملية المخصصة له)*.
* **التحقق من المنفذ الذي يستمع إليه التطبيق:**
  ```bash
  ss -tulpn | grep 3010
  # أو باستخدام netstat
  netstat -tulpn | grep 3010
  ```

---

## 3. أوامر فحص نقطة الصحة والربط الشبكي (Health & Connectivity Checks)

* **التحقق من استجابة واجهة الصحة العامة (Health Endpoint):**
  ```bash
  curl -i -s https://staging.alfaisal-erp.com/api/health
  ```
  *(النتيجة المطلوبة: رمز الحالة 200 OK، والاستجابة: `{"status":"UP"}`)*.
* **التحقق من توجيه النطاق الفرعي وشهادة التشفير (TLS Verification):**
  ```bash
  curl -Iv https://staging.alfaisal-erp.com/api/health 2>&1 | grep -E "SSL connection|start date|expire date|common name"
  ```

---

## 4. أوامر فحص هوية قاعدة البيانات بدون طباعة أسرار (DB Identity Checks)

* **التحقق من اسم قاعدة البيانات والمستخدم المتصل حالياً:**
  ```bash
  # يستبدل اسم المستخدم وكلمة المرور بالقيم التجريبية المخزنة في البيئة
  psql -h localhost -U nama_staging_user -d nama_medical_staging -c "SELECT current_database(), current_user;"
  ```
* **التحقق من حظر وصول مستخدم الاختبار لقاعدة بيانات الإنتاج:**
  ```bash
  # يجب أن يفشل هذا الأمر ويرفض الاتصال لعدم وجود صلاحيات
  psql -h localhost -U nama_staging_user -d nama_medical_web -c "SELECT 1;"
  ```

---

## 5. أوامر فحص وجود ملف التكوين وصلاحياته (Env File Checks)

* **التحقق من وجود وصلاحيات ملف `.env.staging` (يجب أن يكون مقيداً للمالك فقط):**
  ```bash
  ls -l /var/www/namaweb/.env.staging
  # التحقق من أن الصلاحيات هي 600 أو 400 (قراءة فقط للمالك)
  stat -c "%a" /var/www/namaweb/.env.staging
  ```
* **التحقق من وجود المتغيرات الحيوية دون طباعة قيمها الفعلية:**
  ```bash
  grep -q "JWT_SECRET=" /var/www/namaweb/.env.staging && echo "JWT_SECRET is present"
  grep -q "SESSION_SECRET=" /var/www/namaweb/.env.staging && echo "SESSION_SECRET is present"
  ```

---

## 6. أوامر فحص أمان المسارات وصمامات العقود (Route & Contract Checks)

* **التحقق من حظر عمليات الكتابة على واجهات التطبيق المخططة:**
  ```bash
  # محاولة إرسال طلب POST تجريبي لواجهة نهائية
  curl -i -X POST -H "Content-Type: application/json" -d '{}' https://staging.alfaisal-erp.com/api/v1/actions/finalize
  ```
  *(النتيجة المطلوبة: استلام رمز حجب أو رفض مثل 403 Forbidden أو 404 Not Found تفيد بأن الواجهة غير مفعلة حياً)*.
* **التحقق من أعلام الأمان في ملف العقود المتاح للعموم:**
  ```bash
  curl -s https://staging.alfaisal-erp.com/js/enterprise-contracts.js | grep -E "isLiveEndpointEnabled|isWriteOperationEnabled"
  ```
  *(يجب التأكد من أن الدوال تُرجع دائماً القيمة `false`)*.
