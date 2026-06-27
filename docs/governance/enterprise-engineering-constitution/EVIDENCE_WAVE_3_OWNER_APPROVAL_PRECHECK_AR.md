# تقرير بوابة الموافقة والتحضير لتشغيل اختبارات المتصفح (Wave 3 Owner Approval & Precheck Report)

| رمز الوثيقة | EEC-EVIDENCE-WAVE-3-PRECHECK |
|---|---|
| المرحلة | تحضير وبوابة موافقة المالك لتشغيل اختبارات المتصفح الحية (Wave 3) |
| تاريخ التحديث | 2026-06-27 |
| المشروع | NamaMedical / الطبيب |
| المُنفّذ | مراجع جودة الحوكمة والأمن السيبراني (Senior Governance Auditor) |
| الحالة النهائية | **WAVE_3_BLOCKED_BY_OWNER_DECISION (تم حظر الموجة الثالثة بقرار المالك)** |

---

## 1. الملخص التنفيذي (Executive Summary)
يوثق هذا التقرير قرار مالك النظام بشأن Wave 3 وحالة حظر تشغيل اختبارات المتصفح على بيئة مشروع **NamaMedical / الطبيب**.

> [!CAUTION]
> **قرار تشغيل الفحص (BROWSER_SMOKE_ALLOWED_NOW)**: **لا (تم الحظر بقرار المالك)**.
>
> تم حظر تشغيل اختبارات المتصفح (Browser Smoke) بالكامل بقرار صريح من المالك حتى إتمام تدوير الأسرار المكتشفة بالكامل.

---

## 2. متطلبات وضوابط التشغيل الآمن (Preflight Requirements)
قبل البدء في تشغيل اختبارات المتصفح لاحقاً، يجب الالتزام التام بالضوابط التالية:
1. **موافقة صريحة من المالك**: اعتماد وتوقيع نموذج الموافقة المرفق أدناه.
2. **حساب اختبار غير حقيقي**: استخدام مستخدم فحص معزول تماماً ومخصص للـ QA.
3. **عدم استخدام PHI**: يمنع منعاً باتاً إدخال بيانات مرضى حقيقيين أو جلبها للواجهات أثناء الفحص.
4. **عدم طباعة الأسرار**: حظر طباعة كلمات المرور أو الرموز الأمنية (Tokens) أو سجلات الجلسات في مخرجات الطرفية.
5. **عدم إنشاء أو تعديل أو حذف بيانات**: يقتصر الفحص تماماً على الاستعراض والقراءة فقط.
6. **صفحات الاستعراض المحددة (Read-Only)**: حصر الفحص في الواجهات المقترحة أدناه.
7. **النتائج المتوقعة (Expected Results)**: مطابقة واجهات Stitch المحددة بالدستور.
8. **الإيقاف الفوري**: تفعيل آلية الإنهاء التلقائي للاختبار عند حدوث أي خطأ أمني أو ظهور بيانات حساسة.

---

## 3. نطاق اختبارات المتصفح المقترحة (Suggested Smoke Scope)
يقتصر النطاق الآمن على العمليات التالية:
* **Login بحساب اختبار**: التحقق من استجابة صفحة الدخول بالـ Tenant Context.
* **Dashboard read-only**: التحقق من تحميل الإحصائيات العامة والهوية البصرية.
* **Patients page navigation**: استعراض قوائم المرضى والتنقل بين الصفحات بالقراءة فقط.
* **EMR page read-only**: التحقق من ظهور السجل الطبي بالقراءة فقط دون توقيع.
* **Appointments page read-only**: استعراض المواعيد المجدولة.
* **Admin restricted access check**: محاولة دخول مستخدم عادي لصفحة الإدارة ومطابقة استلام 403 Forbidden.
* **Cross-tenant negative check**: محاولة جلب معرّف مريض ينتمي لمستأجر آخر والتأكد من استلام 404 Not Found.

---

## 4. العمليات الممنوعة والمحظورة (Prohibited Operations)
يمنع منعاً باتاً تشغيل أو استدعاء أي من العمليات التالية:
- عمليات الإنشاء أو التحديث أو الحذف (create / update / delete).
- عمليات التوقيع أو التعديل الطبي (sign / amend).
- ترحيل القيود المالية والمحاسبية (post accounting).
- استدعاء ربط بوابات ZATCA أو NPHIES الفعالة.

---

## 5. صيغة موافقة المالك المطلوبة قبل التنفيذ (Owner Approval Form)
> **نص الموافقة المعتمد**:
> "أوافق صراحة على تنفيذ Wave 3 Browser Smoke بنطاق Read-only فقط، باستخدام حساب اختبار مؤقت غير حقيقي، بدون PHI، بدون طباعة أسرار أو كلمات مرور أو session أو token، بدون تعديل بيانات، وبدون ZATCA/NPHIES/Accounting calls. أوافق على الإيقاف الفوري عند أي فشل أو ظهور بيانات حساسة."
>
> لا يجوز تنفيذ Wave 3 Browser Smoke قبل موافقة المالك الصريحة، ولا يجوز طلب أو تخزين أو طباعة كلمة مرور أو session أو token. أي تسجيل دخول يجب أن يتم بحساب اختبار مؤقت وبطريقة لا تكشف الأسرار في السجلات.
>
> تم مراجعة `e2e_local_smoke_test.js` للقراءة فقط ولم يتم تشغيله. لا يجوز نسخ أو طباعة أي كلمة مرور أو token أو session. إذا احتوى السكربت على بيانات دخول صريحة، يجب تصنيفها كفجوة قبل أي تنفيذ.

---

## 6. سجل حقول بوابة الموافقة والتجهيز (Final Closeout Fields)
* **FINAL_STATUS**: `WAVE_3_BLOCKED_BY_OWNER_DECISION`
* **CURRENT_BRANCH**: `audit/phase-1-critical-remediation`
* **PUSH_BRANCH**: `audit/phase-1-critical-remediation`
* **MASTER_UPDATED**: `NO`
* **MERGE_TO_MASTER**: `NO`
* **OWNER_DECISION_RECEIVED**: `YES`
* **OWNER_DECISION**: `OPTION_B_ROTATION_REQUIRED`
* **ROTATION_REQUIRED**: `YES`
* **ROTATION_EXECUTED**: `NO`
* **WAVE_3_ALLOWED**: `NO`
* **BROWSER_SMOKE_EXECUTED**: `NO`
* **WAVE_3_PREPARED**: `YES`
* **WAVE_3_EXECUTED**: `NO`
* **OWNER_APPROVAL_PRECHECK_CREATED**: `YES`
* **OWNER_APPROVAL_RECEIVED**: `NO_BLOCKED`
* **SCRIPT_ALLOWED_NOW**: `NO`
* **LOCAL_TEST_DB_TOUCHED**: `NOT_EVIDENCED`
* **TEST_CREDENTIALS_REVIEW**: `REQUIRED_BEFORE_EXECUTION`
* **CODE_CHANGED**: `NO`
* **TESTS_CHANGED**: `NO`
* **DOCS_CHANGED**: `YES`
* **PRODUCTION_TOUCHED**: `NO`
* **DB_TOUCHED**: `NO`
* **DDL_RUN**: `NO`
* **DEPLOY_RUN**: `NO`
* **PM2_RESTARTED**: `NO`
* **ZATCA_CALLS**: `NO`
* **NPHIES_CALLS**: `NO`
* **ACCOUNTING_POSTING**: `NO`
* **JOURNAL_ENTRIES_CREATED**: `0`
* **SECRETS_PRINTED**: `NO`
* **PHI_PRINTED**: `NO`
* **MOJIBAKE_AUDIT**: `CLEAN_FOR_SCANNED_SCOPE_ONLY`
* **UTF8_STATUS**: `CLEAN`
* **REPORT_FILE**: `docs/governance/enterprise-engineering-constitution/EVIDENCE_WAVE_3_BROWSER_SMOKE_PREPARATION_AR.md`
* **GIT_COMMIT**: `e78c698c3ad2d662786d33782f10339d4d0779a0` (سيتم تحديثه)
* **PUSH_STATUS**: `SUCCESS`
* **NEXT_RECOMMENDED_ACTION**: `EXECUTE_SECURE_CREDENTIAL_ROTATION_OR_DISABLE_OLD_CREDENTIALS_THEN_KEEP_WAVE_3_BLOCKED`
