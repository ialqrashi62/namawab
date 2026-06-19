# تقرير مراجعة وخطة تثبيت مهارات الأوتو بايلوت (Agent Skills.sh Review & Installation Plan)
## نظام نما الطبي - تأمين وحوكمة قواعد البيانات الطبية

---

### 1. ملخص البحث والمراجعة لـ Skills.sh (Search & Review Summary)

تم تدقيق وبحث مكتبة الحزم والأدوات المتاحة في مستودعات المهارات المفتوحة (Skills.sh) لاختيار المهارات الأكثر ملاءمة لتسريع وتأمين تطوير نظام نما الطبي. نجحت أداة `npx skills` في الاتصال وتثبيت المهارات الخارجية محلياً في مجلد الحزم البرمجية للاستفادة منها بواسطة بيئات التطوير الذكية.

---

### 2. تصنيف المهارات الخارجية (External Skills Status)

#### أ. المهارات التي تم تثبيتها بنجاح (Installed Skills):
1. **find-skills**: مهارة البحث التفاعلي في المهارات (تم التثبيت من vercel-labs/skills).
2. **skill-creator**: توليد وإعداد المهارات الجديدة (تم التثبيت من anthropics/skills).
3. **frontend-design**: تصميم واجهات الويب ومراعاة جودة التنسيق (تم التثبيت من anthropics/skills).
4. **web-design-guidelines**: ضوابط تنسيق الويب الحديث (تم التثبيت من vercel-labs/agent-skills).
5. **tdd**: ممارسات التطوير القائم على الاختبار (تم التثبيت من mattpocock/skills).
6. **improve-codebase-architecture**: تحسين بنية ملفات المشروع وسهولة صيانتها (تم التثبيت من mattpocock/skills).
7. **systematic-debugging**: استكشاف ومعالجة الأخطاء بشكل منهجي (تم التثبيت من obra/superpowers).
8. **verification-before-completion**: التحقق قبل إعلان انتهاء المهام (تم التثبيت من obra/superpowers).
9. **writing-plans**: كتابة خطط التنفيذ البرمجية (تم التثبيت من obra/superpowers).
10. **executing-plans**: آلية تشغيل ومراقبة خطط العمل (تم التثبيت من obra/superpowers).
11. **webapp-testing**: اختبارات الويب والـ E2E (تم التثبيت من anthropics/skills).
12. **pdf** / **docx** / **xlsx** / **pptx**: معالجة وقراءة وتوليد المستندات والتقارير الطبية الإدارية (تم التثبيت من anthropics/skills).

#### ب. المهارات المؤجلة أو غير المناسبة (Deferred / Unsuitable Skills):
- تم تثبيت كافة المهارات الخارجية المقترحة بنجاح بنسبة 100% دون أي تأجيل.

---

### 3. المهارات الطبية المخصصة التي تم إنشاؤها (Custom Created Medical Skills)

لتعويض الفجوات التخصصية بالقطاع الصحي وتأمين نظام الطبيب بالعيادات والفرز التفاعلي بالطوارئ، تم إنشاء 10 مهارات طبية وأمنية مخصصة في مجلد المهارات الذكية للمشروع:

1. **[MEDICAL_PATIENT_DATA_SAFETY_SKILL_AR](.ai-brain/skills/MEDICAL_PATIENT_DATA_SAFETY_SKILL_AR.md)**: عزل ملفات المرضى ومنع ثغرات IDOR والتسريب المتقاطع.
2. **[MEDICAL_RLS_PRODUCTION_ENABLEMENT_SKILL_AR](.ai-brain/skills/MEDICAL_RLS_PRODUCTION_ENABLEMENT_SKILL_AR.md)**: ضوابط النشر والتفعيل لـ RLS على الإنتاج الفعلي.
3. **[MEDICAL_TENANT_ID_BACKFILL_SKILL_AR](.ai-brain/skills/MEDICAL_TENANT_ID_BACKFILL_SKILL_AR.md)**: استراتيجية وسكربتات تعبئة وهجرة البيانات القديمة.
4. **[MEDICAL_BACKUP_RESTORE_DRILL_SKILL_AR](.ai-brain/skills/MEDICAL_BACKUP_RESTORE_DRILL_SKILL_AR.md)**: محاكاة استعادة النسخ الاحتياطية فحص سلامتها فترات الطوارئ.
5. **[MEDICAL_INCIDENT_RESPONSE_SKILL_AR](.ai-brain/skills/MEDICAL_INCIDENT_RESPONSE_SKILL_AR.md)**: معالجة الاختراقات أو التسريبات والقيام بالتراجع الفوري السريع.
6. **[MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR](.ai-brain/skills/MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR.md)**: بوابات الجودة والتأمين المطلوب اجتيازها قبل ترحيل الكود للإنتاج.
7. **[MEDICAL_SECRETS_AND_LOGS_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_SECRETS_AND_LOGS_AUDIT_SKILL_AR.md)**: تطهير سجلات PM2 وحظر تتبع أسرار الخادم بـ Git.
8. **[MEDICAL_HEALTHCARE_COMPLIANCE_SAUDI_SKILL_AR](.ai-brain/skills/MEDICAL_HEALTHCARE_COMPLIANCE_SAUDI_SKILL_AR.md)**: الامتثال لتشريعات وزارة الصحة السعودية ومجلس الضمان ونظام نفيس.
9. **[MEDICAL_CLINICAL_WORKFLOW_QA_SKILL_AR](.ai-brain/skills/MEDICAL_CLINICAL_WORKFLOW_QA_SKILL_AR.md)**: سيناريوهات اختبار دورة حياة المريض وصرف الأدوية.
10. **[MEDICAL_ARABIC_UTF8_ENFORCEMENT_SKILL_AR](.ai-brain/skills/MEDICAL_ARABIC_UTF8_ENFORCEMENT_SKILL_AR.md)**: علاج تشويه النصوص العربية وفرض ترميز الملفات بـ UTF-8.

---

### 4. أين تُستخدم كل مهارة داخل نظام الطبيب (Usage Inside Doctor System)

- **ملف المريض الإلكتروني ورؤية الطبيب**: يتم توجيهها بمهارة عزل المرضى (`PATIENT_DATA_SAFETY`) لمنع تداخل الحالات الطبية للعيادات المختلفة.
- **طلب التحاليل وعينات الأشعة والنتائج**: تتدخل مهارة الجودة السريرية (`CLINICAL_WORKFLOW_QA`) لضمان ربط التحليل بالعينات السليم وإظهاره للطبيب المعالج.
- **وصفات وصرف الأدوية بالصيدلية**: تخضع لمهارة عزل وصفات الصيدلية ومبيعاتها وتدبير مخازن الأدوية الخاصة بكل مستأجر (`TENANT_ID_BACKFILL`).
- **الامتثال للتقارير والتدقيق الأمني**: تستخدم مهارة الامتثال السعودي وسجلات التدقيق (`HEALTHCARE_COMPLIANCE_SAUDI` & `SECRETS_AND_LOGS_AUDIT`) لضمان الخصوصية وسرية السجلات الطبية.

---

### 5. المخاطر والخطوات التالية (Risks & Next Phase)

* **المخاطر**: الاستخدام الخاطئ للمهارات البرمجية لتشغيل عمليات تعديل مخطط تلقائية على الإنتاج يظل خطراً قائماً. تم حظر هذا تماماً عبر مهارة التحكم بالإنتاج.
* **المرحلة التالية الموصى بها**: البدء في تصميم وتنفيذ الدفعة الخامسة (Batch 5) أو دراسة تفصيلية لخطة هجرة البيانات لجدول العينات والأدوية.

---
STATUS:
  MEDICAL_AGENT_SKILLS_SH_REVIEW_AND_SKILLS_PACK_COMPLETED
