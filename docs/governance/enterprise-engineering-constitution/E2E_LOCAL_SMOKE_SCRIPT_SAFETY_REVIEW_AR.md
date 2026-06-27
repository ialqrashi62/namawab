# تقرير تدقيق أمان سكربت الفحص الآلي (E2E Local Smoke Script Safety Review)

| رمز الوثيقة | EEC-E2E-SMOKE-SAFETY-REVIEW |
|---|---|
| المرحلة | مراجعة أمان سكربت الفحص الآلي بالقراءة فقط (Read-Only) |
| تاريخ التحديث | 2026-06-27 |
| المشروع | NamaMedical / الطبيب |
| المُنفّذ | مراجع جودة الحوكمة والأمن السيبراني (Senior Governance Auditor) |
| الحالة النهائية | **SCRIPT_SAFETY_REVIEWED_BLOCKED (تم تدقيق الأمان وحظر التشغيل)** |

---

## 1. ملخص القرار (Decision Summary)
بناءً على المراجعة الفنية والدقيقة لكود السكربت `e2e_local_smoke_test.js` بالقراءة فقط، يصدر هذا التقرير قراراً بـ **الحظر التام لتشغيل السكربت (SCRIPT_ALLOWED_NOW: NO)** على خادم الإنتاج أو حتى التطوير دون معالجة المخاطر الجسيمة المذكورة أدناه.

---

## 2. تفاصيل تدقيق الأمان والاستجابة للأسئلة الثمانية (Safety Findings)

1. **هل يحتوي كلمات مرور أو حسابات صريحة؟**
   - **نعم**. السكربت يحتوي على كلمة مرور صريحة مكتوبة بالكامل (`const TEST_PASSWORD = 'AdminTestPassword123!'`).
2. **هل يحتوي على رابط إنتاج (Production URL)؟**
   - **لا**. يعتمد السكربت افتراضياً على المنفذ المحلي (`http://localhost:3000`) ولكن إذا تم تهيئة متغيرات البيئة `DB_HOST` على الإنتاج، فقد يتصل السكربت بقاعدة البيانات الحية.
3. **هل يطبع أسراراً (Secrets) أو أجسام استجابات (Response Bodies)؟**
   - **لا يطبع** الأجسام بشكل افتراضي، ولكنه يطبع حالة الاستجابة ونجاح تسجيل الدخول.
4. **هل ينفذ عمليات كتابة (create/update/delete/sign/amend)؟**
   - **نعم**. يقوم بتعديل قاعدة البيانات مباشرة لتحديث هاش كلمة المرور لحساب `admin` الرئيسي (`UPDATE system_users SET password_hash = ...`). وهذا يمثل خطورة بالغة.
5. **هل يلمس صفحات قد تعرض بيانات صحية (PHI)؟**
   - **نعم**. يستدعي مسار المرضى والمواعيد والفواتير (`/api/patients`, `/api/appointments`, `/api/invoices`) والتي قد تعرض معلومات المرضى الحقيقية.
6. **هل يعتمد على حساب حقيقي أم حساب اختبار؟**
   - يعتمد على حساب `admin` الرئيسي الفعلي للنظام ويقوم بتعديل هاش كلمة المرور الخاصة به.
7. **هل يمكن تحويله إلى قائمة تحقق يدوية (Read-only manual checklist)؟**
   - **نعم، وبسهولة**. يمكن تحويل الخطوات إلى قائمة يدوية للتحقق من تحميل الصفحات دون تغيير كلمة المرور أو لمس قاعدة البيانات.
8. **هل يصلح للتشغيل لاحقاً بعد موافقة المالك أم يجب منعه؟**
   - **يجب منعه بصيغته الحالية**. لا يجوز تشغيله إلا بعد إعادة هيكلته بالكامل ليعتمد على مستخدم اختبار وهمي مخصص للـ QA بدلاً من تعديل كلمة مرور المشرف العام.

---

## 3. قائمة المخاطر ورصد الثغرات (Risk Assessment)
* **خطر قفل حساب المشرف (Admin Lockout Risk - Critical)**: يقوم السكربت بتعديل الهاش الأصلي في قاعدة البيانات ثم إرجاعه في كتلة `finally`. في حال انهيار السكربت أو الخادم قبل الوصول لعملية التنظيف والترميم، سيتم قفل حساب المشرف وتغيير كلمة مروره نهائياً، مما يتسبب في شلل تشغيلي للإنتاج.
* **خطر تشويه البيانات (Database Modification Risk - High)**: تشغيل عمليات `UPDATE` مباشرة على جداول مستخدمي النظام على السيرفر الحي يخالف معايير الأمان NCA و ECC.

---

## 4. شروط وإجراءات المعالجة المطلوبة (Remediation Actions)
- **منع التشغيل التلقائي**: حظر تشغيل السكربت بشكل قاطع حالياً: `SCRIPT_ALLOWED_NOW: NO`.
- **طلب موافقة المالك**: يتطلب أي تعديل أو تشغيل لاحق موافقة مالك النظام المكتوبة: `OWNER_APPROVAL_REQUIRED: YES`.
- **فصل مستخدمي الفحص**: تعديل السكربت لإنشاء واستخدام حساب فحص وهمي محدد للـ QA ومقيد سياقياً بالـ `tenant_id` بدلاً من المشرف الرئيسي.

---

## 5. سجل حقول مراجعة أمان السكربت (Final Closeout Fields)
* **FINAL_STATUS**: `WAVE_3_OWNER_APPROVAL_PRECHECK_READY_NOT_EXECUTED`
* **SCRIPT_REVIEWED**: `YES`
* **SCRIPT_EXECUTED**: `NO`
* **BROWSER_SMOKE_EXECUTED**: `NO`
* **PRODUCTION_TOUCHED**: `NO`
* **DB_TOUCHED**: `NO`
* **SECRETS_PRINTED**: `NO`
* **PHI_PRINTED**: `NO`
* **TEST_CREDENTIALS_FOUND**: `YES`
* **PRODUCTION_URL_FOUND**: `NO`
* **WRITE_ACTIONS_FOUND**: `YES`
* **PHI_RISK_FOUND**: `YES`
* **OWNER_APPROVAL_REQUIRED**: `YES`
* **SCRIPT_ALLOWED_NOW**: `NO`
* **REPORT_FILE**: `docs/governance/enterprise-engineering-constitution/E2E_LOCAL_SMOKE_SCRIPT_SAFETY_REVIEW_AR.md`
* **GIT_COMMIT**: `64eda4a6bfa99986ef72d0ae7af6a46a78ffc58e` (سيتم تحديثه)
* **PUSH_STATUS**: `SUCCESS`
* **NEXT_RECOMMENDED_ACTION**: `WAIT_FOR_EXPLICIT_OWNER_APPROVAL_BEFORE_WAVE_3_BROWSER_SMOKE`
