# خطة الأوامر التنفيذية النهائية للعبور للإنتاج (Final Execution Command Plan)
## نظام نما الطبي (NamaMedical) - تسلسل الأوامر الفنية للنشر والعبور

توثيق تسلسل الأوامر الفنية الدقيقة لتطبيق الترقية والعبور الفعلي لنظام نما الطبي على خادم الإنتاج عند صدور الموافقة التنفيذية النهائية.

---

## 1. تفاصيل الترتيب والتسلسل للأوامر (Step-by-Step Command Sequence)

يجب تنفيذ الأوامر بالترتيب الدقيق والتأكد من نجاح كل خطوة قبل الانتقال للتي تليها:

### الخطوة 1: أخذ نسخة احتياطية كاملة لقاعدة بيانات الإنتاج
قبل إجراء أي تعديل، يتم أخذ نسخة احتياطية مضغوطة ومحمية من قاعدة البيانات الحالية للإنتاج:
```bash
# pg_dump -U postgres -F c -b -v -f /var/backups/db/nama_medical_prod_before_cutover.bak nama_medical_production
```

### الخطوة 2: تحديث وجلب رموز الالتزام المرشحة (Release Candidate)
تحديث الكود البرمجي للمستودع الرئيسي والفرعي للتطابق مع نسخة الإطلاق المعتمدة:
```bash
# جلب وتحديث الفروع
git fetch origin master
git checkout 0ed77cd4141952f14c4ae20a9e2536212d7f9a10

# تحديث وتطابق المستودع الفرعي
git submodule update --init --recursive
cd namaweb
git checkout 7495fd53f4f24117741a9dd91de5b5ec19f4f248
cd ..
```

### الخطوة 3: تشغيل سكربتات تفعيل الـ RLS وترقية قاعدة البيانات
تنفيذ ملف الترقية الأمنية على قاعدة بيانات الإنتاج لتمكين وإنفاذ سياسات الـ RLS لجميع الجداول الحساسة:
```bash
# تشغيل سكربت الترقية باستخدام psql
psql -U postgres -d nama_medical_production -f docs/sql/production_readiness_force_rls_up.sql
```

### الخطوة 4: التحقق من إنفاذ RLS وعزل المستأجرين
تشغيل سكربت التحقق الفوري للتأكد من نجاح الـ RLS وحظر تسريب البيانات:
```bash
psql -U postgres -d nama_medical_production -f docs/sql/production_readiness_force_rls_validate.sql
```

### الخطوة 5: تهيئة المتغيرات البيئية الفعالة للإنتاج
التحقق من ضبط ملف الإعدادات البيئية `.env` بالقيم الحقيقية للإنتاج وتوجيه الجلسات لـ Redis وإنفاذ HTTPS Cookies:
```env
PORT=3000
NODE_ENV=production
REDIS_HOST=redis.nama.local
REDIS_PORT=6379
SESSION_SECRET=[REDACTED_SECRET_VALUE]
COOKIE_SECURE=true
```

### الخطوة 6: تشغيل وإعادة تشغيل التطبيق تحت إدارة PM2
بدء تشغيل خادم الويب للإنتاج بالاسم الموحد ومراقبة الأداء:
```bash
npx pm2 restart nama-web || npx pm2 start server.js --name nama-web
```

### الخطوة 7: إجراء الفحوصات التشغيلية والـ Smoke Tests
التحقق الفوري من استجابة خادم الويب للطلبات الخارجية وعودة الحالة `UP`:
```bash
curl.exe -i http://localhost:3000/api/health
```

---

## 2. إجراءات الطوارئ والتراجع الفوري (Emergency Rollback Protocol)

في حال حدوث أي فشل في بوابة اختبارات القبول أو ظهور أخطاء وقت التشغيل، يتم تفعيل التراجع السريع فوراً:
1. إيقاف خادم الويب:
   ```bash
   npx pm2 stop nama-web
   ```
2. إلغاء سياسات الـ RLS واستعادة الحالة السابقة لقاعدة البيانات:
   ```bash
   psql -U postgres -d nama_medical_production -f docs/sql/production_readiness_force_rls_down.sql
   ```
3. في حال وجود مشكلة أعمق، يتم استعادة النسخة الاحتياطية الكاملة:
   ```bash
   pg_restore -U postgres -d nama_medical_production --clean --verbose /var/backups/db/nama_medical_prod_before_cutover.bak
   ```
4. إعادة تشغيل الخادم بالنسخة السابقة المستقرة.
