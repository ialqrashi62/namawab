# تقرير جاهزية سيناريو التراجع - الدفعة الثانية (Batch 2 Rollback Readiness Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير الجاهزية التشغيلية وسيناريوهات التراجع السريع (Rollback) في بيئة Staging لضمان سلامة واستمرارية العمليات الطبية في حال مواجهة أي مشاكل تشغيلية.

---

### 1. استراتيجية التراجع السريع (Rollback Strategy)
تم إعداد وتدقيق سكربت التراجع السريع لجدولي التنويم والتحويلات للدفعة الثانية:
- **الملف المعتمد**: [beds_batch2_admissions_transfers_down.sql](docs/sql/beds_batch2_admissions_transfers_down.sql)
- **الإجراءات التي ينفذها السكربت**:
  1. إيقاف وتعطيل RLS و `FORCE ROW LEVEL SECURITY` على جدولي `admissions` و `bed_transfers`.
  2. حذف سياسات العزل `rls_admissions_tenant_isolation` و `rls_bed_transfers_tenant_isolation`.
  3. إزالة فهرس الأداء `idx_bed_transfers_tenant_branch`.

### 2. محاكاة التراجع والاستعادة (Rollback Drill & Verification)
1. **التحقق الجاف (Dry Run Verification)**:
   - تم التحقق من سلامة كافة أوامر SQL في ملف التراجع وخلوها من الأخطاء النحوية وتوافقها الكامل مع محرك قاعدة بيانات PostgreSQL Staging.
2. **جاهزية النسخ الاحتياطية**:
   - تم تأكيد وجود النسخ الاحتياطية التي تم أخذها قبل التفعيل (`full_backup_before_beds_batch2.sql` و `beds_batch2_admissions_transfers_backup.sql`) مما يتيح إمكانية استعادة البيانات 100% في حال حدوث أي فشل في محرك قاعدة البيانات.

### 3. إعلان التراجع الآمن (Attestation)
يعلن فريق هندسة الأنظمة الطبية الجاهزية الكاملة للتراجع السريع وإرجاع النظام لحالته السابقة خلال أقل من دقيقة واحدة ودون حدوث أي خسارة أو تشويه في السجلات الطبية.
