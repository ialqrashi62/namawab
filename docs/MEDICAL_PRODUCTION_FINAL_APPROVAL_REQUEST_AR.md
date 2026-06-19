# طلب الموافقة النهائية والتنفيذية للطرح الإنتاجي (Production Execution Approval Request)
## نظام نما الطبي (NamaMedical) - مرحلة التخطيط والتحقق

توثق هذه الوثيقة الطلب الرسمي الفني الموجه لإدارة النظام الطبي لمنح الموافقة التنفيذية الثانية (الموافقة الصريحة والنهائية) لتشغيل خطة النشر على خادم الإنتاج الفعلي.

---

### 1. نسخة الإطلاق المرشحة (Release Candidate)

تم إعداد واختبار نسخة الإطلاق الحالية على بيئة Staging بنجاح كامل بنسبة 100%:
* **الالتزام المرشح للنشر (Commit Hash)**:
  * المستودع الأب ([NamaMedical](.)): `4cbed5fb1f692abdb607df4579c4fb24e1fe2a3f` (مختصر: `4cbed5f`).
  * مستودع الويب ([namaweb](namaweb/)): `c6e44ae244148f35496df48788c61107b5707860` (مختصر: `c6e44ae`).

---

### 2. سياسة تفعيل متجر الجلسات Redis في الإنتاج
لتجنب تعريض أمن وتوسيع الجلسات للخطر في بيئة الإنتاج:
* **إلزامية Redis**: يعتبر ربط وتفعيل متجر الجلسات الموزع Redis إلزامياً كلياً في بيئة الإنتاج الفعلي.
* **حظر MemoryStore**: لا يُسمح بتشغيل النظام إنتاجياً على `MemoryStore` ولا يتم اعتبار النظام جاهزاً للإنتاج (`Production-ready`) في حال استمراره على الميموري ستور. التراجع التلقائي الصامت مرفوض إنتاجياً ومسموح به فقط في Staging لغايات التطوير.
* **سياسة إيقاف النشر عند الطوارئ (Decision Matrix)**:
  * **قبل النشر**: إذا تعثر الوصول لخادم Redis قبل البدء بالتنفيذ، يتم تجميد القرار فوراً كـ `CURRENT_GO_DECISION: NO_GO_FOR_NOW` وإلغاء العملية.
  * **بعد النشر**: في حال حدوث عطل لـ Redis في الإنتاج، يتم تفعيل قرار إيقاف خط النشر فوراً (Stop-The-Line) ثم تشغيل التراجع التلقائي (Rollback) للالتزام المستقر السابق.

---

### 3. قائمة الأوامر الموصى بتنفيذها على خادم الإنتاج (Execution Commands)

بمجرد صدور الموافقة التنفيذية الصريحة الثانية، سيتم تشغيل السلسلة التالية من الأوامر بالتسلسل الدقيق:

#### الفحوصات الاستباقية (Pre-execution Verification Gates)
* التحقق من وصول خدمة Redis ومنفذ 6379.
* التحقق من وجود المتغيرات البيئية اللازمة دون طباعة قيمها.
* التحقق من مسار وصلاحيات النسخ الاحتياطي لقاعدة البيانات وضمان عدم خضوعه لـ Git.
* التحقق من اسم عملية PM2 والتزامات Git السابقة للاستعداد للتراجع.

#### الأوامر التنفيذية المقترحة
1. **النسخ الاحتياطي لقاعدة البيانات (Database Backup)**:
   ```bash
   pg_dump -h localhost -p 5432 -U postgres -d nama_medical_web -F c -b -v -f /var/backups/db/nama_medical_prod_before_rls_up.bak
   ```
   *(إذا فشل النسخ الاحتياطي: **توقف فوراً (STOP)** ولا تنشر).*
2. **تحديث الكود وتثبيت التبعيات (Code Rollout)**:
   ```bash
   git fetch origin
   git checkout 4cbed5f
   cd namaweb
   npm install --production
   npm run build:css
   ```
3. **ترقية قاعدة البيانات وتفعيل FORCE RLS**:
   ```bash
   psql -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/production_readiness_force_rls_up.sql
   psql -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/production_readiness_force_rls_validate.sql
   ```
   *(إذا فشل استعلام التحقق الهيكلي أو ظهرت حالة false: **توقف فوراً (STOP)** وتشغيل التراجع Rollback).*
4. **إعادة تشغيل خادم الويب والتحقق من السجلات**:
   ```bash
   pm2 restart nama-web --update-env
   pm2 logs nama-web --lines 50
   ```
   *(إذا ظهر تحذير تراجع الجلسة للميموري ستور: **توقف فوراً (STOP)** وتشغيل التراجع).*
5. **فحص الصحة محلياً**:
   ```bash
   curl -I http://localhost:3000/api/health
   ```
   *(إذا لم تستجب الصحة برمز 200 OK: **توقف فوراً (STOP)** وتشغيل التراجع).*

---

### 4. خطة التراجع السريع عند الطوارئ (Rollback Steps)
1. **إلغاء قسرية الـ RLS عن قاعدة البيانات**:
   ```bash
   psql -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/production_readiness_force_rls_down.sql
   ```
   *(أو استرداد قاعدة البيانات بالكامل من النسخة الاحتياطية).*
2. **تراجع الكود وإعادة التشغيل**:
   ```bash
   git checkout <previous_stable_commit_hash>
   npm install --production
   pm2 restart nama-web
   ```

---

### 5. سجل مخاطر النشر ومعايير الأمان
* **سرية سجلات التنفيذ (Transcript Secrets)**:
  `SECRETS_IN_EXECUTION_TRANSCRIPT: YES_REDACTION_NOTE` (ملاحظة حجب كلمات المرور مستخدمة لوجود معلمات PGPASSWORD سابقة).
* **المخاطر المتبقية**: فشل Redis المباشر، فقدان جلسات المستخدمين المؤقت، وبطء استعلامات RLS.

---

### 6. القرار والتقييم الفني النهائي (Technical Recommendation Verdict)
* **القرار النهائي الموصى به**: **GO** (جاهز بالكامل ومستقر للنشر فور تلبية الشروط).
* **حالة الجاهزية الحالية**: `PRODUCTION_READY: NO` (بانتظار موافقة المستخدم الثانية الصريحة لتفعيل النشر).
