# خطة تحضير اختبارات المتصفح الحية - الموجة 3 (Wave 3 Browser Smoke Test Preparation Report)

| رمز الوثيقة | EEC-EVIDENCE-WAVE-3-PREPARATION |
|---|---|
| المرحلة | التحضير للموجة الثالثة: اختبارات المتصفح الحية (Browser Smoke) |
| تاريخ التحديث | 2026-06-27 |
| المشروع | NamaMedical / الطبيب |
| المُنفّذ | مراجع جودة الحوكمة والأمن السيبراني (Senior Governance Auditor) |
| الحالة النهائية | **WAVE_3_PREPARED (تم التحضير للموجة الثالثة بنجاح)** |

---

## 1. الملخص التنفيذي (Executive Summary)
تصف هذه الوثيقة خطة التحضير والتهيئة لتنفيذ **الموجة الثالثة (Wave 3 - Browser Smoke Tests)** لمشروع **NamaMedical / الطبيب**.

> [!CAUTION]
> **حالة تنفيذ الموجة (WAVE_3_EXECUTION_STATUS)**: **PREPARED_NOT_EXECUTED (تم التحضير فقط ولم يتم التنفيذ)**.
> 
> يمنع تشغيل أي فحص متصفح آلي (Playwright) أو تفاعلي على بيئة الإنتاج الفعلي في هذه المرحلة دون استلام موافقة صريحة ومكتوبة من مالك النظام.

---

## 2. متطلبات وضوابط الأمان قبل التشغيل (Safety Requirements)
قبل البدء في تشغيل اختبارات المتصفح لاحقاً، يجب الالتزام التام بالضوابط التالية:
1. **موافقة المالك الصريحة**: لا يجوز إجراء أي فحص متصفح دون الموافقة المرفقة أدناه.
2. **بيانات اختبارية وهمية (Synthetic/Test Accounts)**: يمنع استخدام أي حسابات أطباء أو موظفين حقيقيين.
3. **عدم استخدام PHI**: حظر إدخال أو تصوير أي بيانات صحية محمية أو ملفات طبية حقيقية للمرضى.
4. **عدم طباعة الأسرار**: حظر طباعة كلمات المرور أو سجلات الجلسات في تقارير الفحص.
5. **منع الكتابة والتعديل**: يقتصر الفحص التلقائي الأولي على القراءة والتنقل فقط.

---

## 3. نطاق فحص المتصفح المقترح (Suggested Browser Smoke Scope)
يقتصر النطاق الآمن على العمليات التالية (Read-Only Navigation):
- **صفحة تسجيل الدخول (Login)**: التحقق من وجود الحقول وعمل واجهة الدخول بحساب فحص وهمي.
- **لوحة التحكم (Dashboard)**: التحقق من تحميل الأقسام والهوية البصرية لـ Stitch.
- **صفحة الاستقبال والمواعيد (Appointments)**: التنقل ومطابقة جدولة المواعيد.
- **صفحة ملف المريض (Patients list)**: استعراض القوائم والتحقق من عزل المستأجرين بالقراءة فقط.
- **محطة الطبيب (Doctor Station EMR)**: التحقق من تحميل الواجهات بالقراءة فقط.
- **فحص الصلاحيات (Admin restricted access)**: محاولة الدخول لصفحات محظورة والتحقق من الاستجابة بـ 403 Forbidden.
- **فحص RLS السلبي (Cross-tenant negative check)**: محاولة استدعاء معرّف مريض مستأجر آخر والتحقق من ظهور 404 Not Found.

> [!CAUTION]
> أي إجراء كتابة أو تعديل أو توقيع أو أرشفة مثل (create/update/sign/amend/delete) يعتبر **خارج النطاق المسموح** ويصنف كـ `REQUIRES_EXPLICIT_OWNER_APPROVAL`.

---

## 4. قائمة العناصر المؤهلة والممنوعة (Scope Categorization)

### 4.1 العناصر المؤهلة لـ Read-Only Browser Smoke
- **Batch A**: الاستقبال والمواعيد.
- **Epic 01**: محطة الطبيب والسجل الطبي (القراءة والتنقل فقط).
- **E0**: ويزرد التهيئة Onboarding (بشكل محلي).

### 4.2 العناصر الممنوعة من فحص المتصفح حالياً
- **Epic 10 (ZATCA)**: توليد فواتير حقيقية أو الربط الفعلي مع بوابة هيئة الزكاة.
- **Epic 11 (NPHIES)**: إرسال معاملات التأمين للمجلس.
- **Batch D (المالية المحاسبية)**: ترحيل قيود اليومية للإنتاج.

---

## 5. نموذج طلب موافقة المالك (Owner Approval Request Template)
```text
============================================================
طلب موافقة صريحة لتشغيل اختبارات المتصفح الحية (Wave 3)
============================================================
بصفتي مالك مشروع NamaMedical / الطبيب، أمنح الإذن لفريق التطوير والجودة 
لتشغيل اختبارات متصفح Playwright (قراءة فقط) على بيئة الإنتاج الفعلي 
باستخدام حسابات فحص وهمية ومقيدة بنطاق المستأجر (Tenant Context)،
مع الالتزام بعدم كتابة بيانات حقيقية أو تصوير PHI.

التوقيع/الاعتماد: [........................................]
التاريخ: [........................................]
============================================================
```

---

## 6. سجل الحقول النهائي لخطة التحضير (Final Closeout Fields)
* **FINAL_STATUS**: `WAVE_3_PREPARED`
* **WAVE_2_REPORT_CORRECTED**: `YES`
* **WAVE_3_PREPARED**: `YES`
* **WAVE_3_EXECUTED**: `NO`
* **DIRECT_EVIDENCE_COLLECTED**: `0`
* **PARTIAL_EVIDENCE_COLLECTED**: `18`
* **EVIDENCE_GAP_REMAINS**: `18`
* **OWNER_APPROVAL_REQUIRED**: `3`
* **PRODUCTION_DB_TOUCHED**: `NO`
* **LOCAL_TEST_DB_TOUCHED**: `NOT_EVIDENCED`
* **CODE_CHANGED**: `NO`
* **TESTS_CHANGED**: `NO`
* **DOCS_CHANGED**: `YES`
* **PRODUCTION_TOUCHED**: `NO`
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
* **NEXT_RECOMMENDED_ACTION**: `RUN_WAVE_3_OWNER_APPROVAL_AND_TEST_ACCOUNT_PRECHECK`
