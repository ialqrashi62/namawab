# خطة الأوامر التنفيذية المقترحة للطرح الإنتاجي (Proposed Production Execution Command Plan)
## نظام نما الطبي (NamaMedical) - مرحلة التخطيط والتحقق

> [!IMPORTANT]
> **تنبيه هام**: هذه الأوامر والتعليمات هي خطة مقترحة ومعلقة بانتظار الموافقة التنفيذية الصريحة الثانية (`Proposed Commands Pending Final Approval`). يمنع منعاً باتاً البدء بتنفيذ أي منها قبل الحصول على موافقة العميل النهائية والخطية.

---

### 1. ضوابط وسياسة متجر الجلسات Redis للإنتاج
* **إلزامية اتصال Redis**: يعتبر اتصال خادم الويب بـ Redis متطلبًا إجباريًا لا غنى عنه في بيئة الإنتاج الفعلي.
* **حظر التراجع لـ MemoryStore**: لا يُسمح بتفعيل التراجع التلقائي الصامت لـ `MemoryStore` كحل دائم أو مقبول للتشغيل في الإنتاج. في حال فشل اتصال Redis قبل أو أثناء النشر، يتم تفعيل معايير إيقاف النشر والعودة تلقائياً للالتزام المستقر السابق. لا يُصنف النظام كجاهز للإنتاج (`Production-ready`) إذا كان متجر الجلسات متراجعاً للميموري ستور.

---

### 2. بوابات وفحوصات التحقق ما قبل التنفيذ (Pre-execution Verification Gates)
يجب تشغيل بوابات الفحص التالية والتأكد من نجاحها قبل كتابة أو تعديل أي ملف في الإنتاج:

1. **التحقق من وصول خدمة Redis (Verify Redis Reachability)**:
   التأكد من أن منفذ خادم Redis متاح للاتصال من خادم الويب:
   ```bash
   nc -z -v <redis_host> 6379
   ```
2. **التحقق من وجود متغيرات البيئة (Verify Env Vars Existence)**:
   التأكد من تعريف المتغيرات البيئية اللازمة (`REDIS_HOST` و `REDIS_PASSWORD` و `NODE_ENV`) دون طباعة قيمها الحساسة في السجلات.
3. **التحقق من مسار النسخ الاحتياطي (Verify Backup Path)**:
   التأكد من وجود مجلد النسخ الاحتياطي المخصص وصلاحيات الكتابة عليه، وضمان عدم خضوعه لتتبع Git:
   ```bash
   ls -la /var/backups/db/
   ```
4. **التحقق من الالتزام المستقر الأخير (Verify Previous Stable Commit)**:
   التأكد من تسجيل هاش الالتزام الفعال الحالي قبل التحديث للتمكن من التراجع الفوري إليه عند الضرورة.
5. **التحقق من اسم عملية PM2 (Verify PM2 Process)**:
   التأكد من اسم العملية ومطابقتها للتكوين:
   ```bash
   pm2 status
   ```
6. **التحقق من نهاية فحص الصحة (Verify Health Endpoint)**:
   التأكد من استجابة خادم Staging الحالي بصحة ممتازة قبل النقل.

---

### 3. الأوامر التنفيذية المقترحة (Proposed Execution Commands)

في حال الحصول على الموافقة الصريحة الثانية، سيتم إجراء التالي بدقة:

#### الخطوة الأولى: النسخ الاحتياطي لقاعدة البيانات (Database Backup)
```bash
pg_dump -h localhost -p 5432 -U postgres -d nama_medical_web -F c -b -v -f /var/backups/db/nama_medical_prod_before_rls_up.bak
```
* **شرط إيقاف (Stop Condition)**: إذا فشل أمر النسخ الاحتياطي لأي سبب: **توقف فوراً (STOP)**، ولا تقم بأي عملية نشر هيكلية أو كود.

#### الخطوة الثانية: تحديث الكود وتثبيت التبعيات (Application Deploy)
```bash
git fetch origin
git checkout 4cbed5f

cd namaweb
npm install --production
npm run build:css
```

#### الخطوة الثالثة: تفعيل قسرية الـ RLS والتحقق (Database Upgrade)
```bash
# 1. تفعيل FORCE RLS للجداول الـ 13
psql -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/production_readiness_force_rls_up.sql

# 2. التحقق من نجاح التفعيل وظهور حالة true لجميع الجداول
psql -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/production_readiness_force_rls_validate.sql
```
* **شرط إيقاف (Stop Condition)**: إذا فشل استعلام التحقق الهيكلي أو ظهرت حالة `false` لأي جدول: **توقف فوراً (STOP)**، وقم بتشغيل خطة التراجع السريع (Rollback) فوراً.

#### الخطوة الرابعة: تفعيل متغيرات البيئة وإعادة تشغيل التطبيق (Process Manager)
```bash
pm2 restart nama-web --update-env
pm2 logs nama-web --lines 50
```
* **شرط إيقاف (Stop Condition)**:
  * إذا لم تظهر حاوية Redis متصلة بنجاح أو ظهر تحذير تراجع الجلسة للميموري ستور (`MemoryStore fallback`): **توقف فوراً (STOP)**، ولا تعتمد النشر، وقم بالتراجع الفوري للالتزام المستقر السابق.

#### الخطوة الخامسة: فحص الصحة المبدئي (Smoke Test)
```bash
curl -I http://localhost:3000/api/health
```
* **شرط إيقاف (Stop Condition)**: إذا لم تستجب الصحة برمز `200 OK`: **توقف فوراً (STOP)**، وقم بالتراجع الفوري (Rollback).

---

### 4. الخلاصة وحالة العبور (Gate Conclusion)
* **حالة خطة الأوامر**: **PASS** (تم صياغة البوابات المسبقة، وشروط الإيقاف الصارمة بنجاح بمسارات نسبية).
* **التوصية**: الانتقال لتصحيح التقرير التالي.

**القرار**: تم إعداد خطة الأوامر بنجاح وبانتظار موافقة التشغيل المباشر (**Command Plan: PASS**).
