# طلب الموافقة النهائية والتنفيذية للطرح الإنتاجي (Production Execution Approval Request)
## نظام نما الطبي (NamaMedical) - مرحلة التخطيط والتحقق

توثق هذه الوثيقة الطلب الرسمي الفني الموجه لإدارة النظام الطبي لمنح الموافقة التنفيذية الثانية (الموافقة الصريحة والنهائية) لتشغيل خطة النشر على خادم الإنتاج الفعلي.

---

### 1. نسخة الإطلاق المرشحة (Release Candidate)

تم إعداد واختبار نسخة الإطلاق الحالية على بيئة Staging بنجاح كامل بنسبة 100%:
* **الالتزام المرشح للنشر (Commit Hash)**:
  * المستودع الأب ([NamaMedical](file:///c:/Users/ice/Desktop/NamaMedical/)): `184f4cb03f7d1ebc0b60e676ac95c9e02ed1be8a` (مختصر: `184f4cb`).
  * مستودع الويب ([namaweb](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/)): `d6c29d10ce4a31b3c62e537be8c66281a2d65de0` (مختصر: `d6c29d1`).

---

### 2. قائمة الأوامر الموصى بتنفيذها على خادم الإنتاج (Execution Commands)

بمجرد صدور الموافقة التنفيذية الصريحة الثانية، سيتم تشغيل السلسلة التالية من الأوامر بالتسلسل الدقيق:

#### الخطوة 1: النسخ الاحتياطي لقاعدة البيانات (Database Backup)
```bash
pg_dump -h localhost -p 5432 -U postgres -d nama_medical_web -F c -b -v -f /var/backups/db/nama_medical_prod_before_rls_up.bak
```

#### الخطوة 2: تحديث كود التطبيق وتثبيت التبعيات (Code Rollout)
```bash
git fetch origin
git checkout 184f4cb
cd namaweb
npm install --production
npm run build:css
```

#### الخطوة 3: ترقية هيكل قاعدة البيانات وتفعيل الـ FORCE RLS (Security Upgrades)
```bash
# 1. تفعيل سياسات الـ FORCE RLS
psql -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/production_readiness_force_rls_up.sql

# 2. التحقق من نجاح التفعيل
psql -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/production_readiness_force_rls_validate.sql
```
* رابط سكربت الترقية: [production_readiness_force_rls_up.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/production_readiness_force_rls_up.sql)
* رابط سكربت التحقق: [production_readiness_force_rls_validate.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/production_readiness_force_rls_validate.sql)

#### الخطوة 4: إعادة تشغيل خادم الويب والتحقق من السجلات (Process & Connection Recheck)
```bash
pm2 restart nama-web --update-env
pm2 logs nama-web --lines 50
```

#### الخطوة 5: فحص الصحة محلياً (Local Smoke Check)
```bash
curl -I http://localhost:3000/api/health
```

---

### 3. خطة التراجع السريع عند الطوارئ (Rollback Steps)

في حال رصد أي خلل تشغيلي (أخطاء 500، فشل اتصال Redis، تسريب بيانات المستأجرين)، يتم التراجع الفوري كالتالي:

1. **إلغاء قسرية الـ RLS عن قاعدة البيانات**:
   ```bash
   psql -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/production_readiness_force_rls_down.sql
   ```
   *(أو استعادة قاعدة البيانات بالكامل من النسخة الاحتياطية المأخوذة في الخطوة الأولى عبر `pg_restore`)*.
   * رابط سكربت التراجع الهيكلي: [production_readiness_force_rls_down.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/production_readiness_force_rls_down.sql)

2. **تراجع كود التطبيق وإعادة التشغيل**:
   ```bash
   git checkout <previous_stable_commit_hash>
   npm install --production
   pm2 restart nama-web
   ```

---

### 4. سجل المخاطر المتبقية والتخفيف (Residual Risks)

* **خطر 1: فشل اتصال خادم Redis**:
  * *التخفيف*: الكود يحتوي على تراجع تلقائي (Fallback) إلى `MemoryStore` لحماية التطبيق من الانهيار، مع طباعة سجل تحذيري واضح.
* **خطر 2: فقدان جلسات المستخدمين النشطين**:
  * *التخفيف*: تنفيذ العملية في نافذة صيانة مجدولة لتقليل الأثر على المستخدمين.
* **خطر 3: بطء استجابة الاستعلامات نتيجة الـ RLS**:
  * *التخفيف*: تم إنشاء فهارس مساعدة مركبة للأداء ومراقبة أزمنة الاستعلامات.

---

### 5. القرار والتقييم الفني النهائي (Technical Recommendation Verdict)

* **القرار النهائي الموصى به**: **GO** (جاهز بالكامل ومستقر للنشر).
* **حالة الجاهزية الحالية**: `PRODUCTION_READY: NO` (بانتظار موافقة المستخدم الثانية الصريحة لتفعيل النشر).

**التوصية**: نقترح منح الموافقة النهائية للبدء بالتنفيذ الفعلي بناءً على حزمة الأوامر المذكورة أعلاه.
