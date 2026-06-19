# خطة الأوامر التنفيذية التفصيلية للطرح الإنتاجي (Production Execution Command Plan)
## نظام نما الطبي (NamaMedical) - مرحلة التخطيط والتحقق

توثق هذه الخطة الأوامر والتعليمات الدقيقة الموصى بتنفيذها على الخادم الإنتاجي فور صدور موافقة التنفيذ الثانية الصريحة.

---

### 1. الخطوة الأولى: النسخ الاحتياطي لقاعدة البيانات (Database Backup)

قبل إجراء أي تعديل هيكلي، يتم أخذ لقطة كاملة لقاعدة البيانات الإنتاجية وحفظها في مجلد معزول خارج مستودع Git:
```bash
# أخذ نسخة احتياطية هيكلية وبيانية كاملة بصيغة مخصصة لتمكين الاستعادة التفصيلية
pg_dump -h localhost -p 5432 -U postgres -d nama_medical_web -F c -b -v -f /var/backups/db/nama_medical_prod_before_rls_up.bak
```

---

### 2. الخطوة الثانية: تحديث الكود وتثبيت التبعيات (Application Deploy)

الولوج لخادم التطبيق وتحديث مجلد العمل إلى نسخة الإطلاق المعتمدة:
```bash
# جلب التحديثات من الفرع الرئيسي للأب
git fetch origin
git checkout 91a009c

# الانتقال لمجلد الويب
cd namaweb

# تثبيت التبعيات الإنتاجية وتجميع ملف التنسيق
npm install --production
npm run build:css
```

---

### 3. الخطوة الثالثة: تفعيل قسرية الـ RLS والتحقق (Database Upgrade)

تشغيل ملفات الترقية والتحقق عبر موجه أوامر PostgreSQL:
```bash
# 1. تفعيل FORCE RLS للجداول الـ 13
psql -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/production_readiness_force_rls_up.sql

# 2. التحقق من نجاح التفعيل وظهور حالة true لجميع الجداول
psql -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/production_readiness_force_rls_validate.sql
```

المخططات المستهدفة بالتفعيل موجودة في:
* سكربت الترقية: [production_readiness_force_rls_up.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/production_readiness_force_rls_up.sql)
* سكربت التحقق: [production_readiness_force_rls_validate.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/production_readiness_force_rls_validate.sql)

---

### 4. الخطوة الرابعة: تفعيل متغيرات البيئة وإعادة تشغيل التطبيق (Process Manager)

ضبط متغيرات البيئة وإعادة تشغيل خادم الويب تحت PM2 للتأكد من ربط Redis الفعال:
```bash
# إعادة تشغيل التطبيق وتحديث إعدادات البيئة
pm2 restart nama-web --update-env

# عرض السجلات للتأكد من نجاح الاتصال بـ Redis وغياب أي تراجع للميموري ستور
pm2 logs nama-web --lines 50
```

---

### 5. الخطوة الخامسة: فحص الصحة المبدئي (Smoke Test)

التحقق محلياً من استجابة خادم الويب برمز 200 OK:
```bash
curl -I http://localhost:3000/api/health
```

---

### 6. الخلاصة وحالة العبور (Gate Conclusion)

* **حالة خطة الأوامر**: **PASS** (تم حصر وصياغة الأوامر المطلوبة للتنفيذ بدقة متناهية).
* **التوصية**: الانتقال للمستند التالي للتحقق من فحوصات الاستعادة والتراجع.

**القرار**: تم إعداد خطة الأوامر بنجاح وبانتظار موافقة التشغيل المباشر (**Command Plan: PASS**).
