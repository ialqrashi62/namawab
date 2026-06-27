# فهرس المهارات الطبية للأوتو بايلوت (Medical Autopilot Skills Index)
## نظام نما الطبي - تأمين وحوكمة قواعد البيانات الطبية

وثيقة مركزية تجمع كافة المهارات (Skills) المتاحة للأوتو بايلوت في النظام الطبي لتحديد أولويات المعالجة والضوابط الصارمة لسرية البيانات وجودة التوثيق.

---

### 1. القواعد العامة الصارمة (Strict Global Rules)
- **حظر كامل لبيانات المرضى الحقيقية**: يُمنع استخدام أي اسم أو سجل لمريض حقيقي. كل بيانات الفحوصات وهمية 100%.
- **حماية الأسرار السيبرانية**: منع تتبع ملفات التهيئة `.env` أو النسخ الاحتياطية أو سجلات التشغيل أو مفاتيح التشفير في مستودع Git.
- **التوافق اللغوي والترميز**: كتابة كافة الوثائق والتقارير الطبية باللغة العربية الفصحى بترميز UTF-8 السليم وتجنب تشويه الخطوط.

---

### 2. جدول المهارات وتصنيف الأولويات (Skills Matrix & Priorities)

| المهارة (Skill File) | الوصف والاستخدام | الأولوية |
| :--- | :--- | :---: |
| **[MEDICAL_AUTOPILOT_CORE_SKILL_AR](.ai-brain/skills/MEDICAL_AUTOPILOT_CORE_SKILL_AR.md)** | القيادة العامة للأوتو بايلوت الطبي وفحص بنية النظام. | **P0** |
| **[MEDICAL_ULTIMATE_AUTOPILOT_DECISION_ENGINE_SKILL_AR](.ai-brain/skills/MEDICAL_ULTIMATE_AUTOPILOT_DECISION_ENGINE_SKILL_AR.md)** | محرك اتخاذ القرار التلقائي الشامل وإدارة المراحل والالتزام بضوابط الأوتو بايلوت. | **P0** |
| **[MEDICAL_PATIENT_DATA_SAFETY_SKILL_AR](.ai-brain/skills/MEDICAL_PATIENT_DATA_SAFETY_SKILL_AR.md)** | حماية خصوصية المرضى ومنع ثغرات IDOR والتسريب بين المستأجرين. | **P0** |
| **[MEDICAL_RLS_AUTOPILOT_BLOCKER_SKILL_AR](.ai-brain/skills/MEDICAL_RLS_AUTOPILOT_BLOCKER_SKILL_AR.md)** | تحديد معايير التوقف الفوري في حال رصد خطر أمني P0/P1. | **P0** |
| **[MEDICAL_SECRETS_AND_LOGS_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_SECRETS_AND_LOGS_AUDIT_SKILL_AR.md)** | مراقبة سجلات الخادم وتطهير الأسرار وحماية ملفات `.env`. | **P0** |
| **[MEDICAL_STAGING_BACKUP_RESTORE_SKILL_AR](.ai-brain/skills/MEDICAL_STAGING_BACKUP_RESTORE_SKILL_AR.md)** | أخذ النسخ الاحتياطية وتخزينها الآمن قبل أي تعديل هيكلي. | **P0** |
| **[MEDICAL_STITCH_DESIGN_SYSTEM_SKILL_AR](.ai-brain/skills/MEDICAL_STITCH_DESIGN_SYSTEM_SKILL_AR.md)** | اعتماد مشروع Google Stitch كمصدر التصميم الرسمي واجهات نظام الطبيب. | **P0 (لكل UI/UX)** |
| **[MEDICAL_BACKUP_RESTORE_DRILL_SKILL_AR](.ai-brain/skills/MEDICAL_BACKUP_RESTORE_DRILL_SKILL_AR.md)** | إجراء محاكاة الاستعادة والتحقق الهيكلي الجاف في بيئة معزولة. | **P1** |
| **[MEDICAL_INCIDENT_RESPONSE_SKILL_AR](.ai-brain/skills/MEDICAL_INCIDENT_RESPONSE_SKILL_AR.md)** | إدارة حوادث تسريب البيانات والتراجع السريع (Rollback) الآمن. | **P1** |
| **[MEDICAL_RLS_POLICY_DESIGN_SKILL_AR](.ai-brain/skills/MEDICAL_RLS_POLICY_DESIGN_SKILL_AR.md)** | تصميم صياغة سياسات RLS وقواعد SELECT/INSERT للمستأجرين. | **P1** |
| **[MEDICAL_RLS_STAGING_ENABLEMENT_SKILL_AR](.ai-brain/skills/MEDICAL_RLS_STAGING_ENABLEMENT_SKILL_AR.md)** | خطوات تفعيل RLS التدريجي والتحقق الموضعي على Staging. | **P1** |
| **[MEDICAL_RLS_PRODUCTION_ENABLEMENT_SKILL_AR](.ai-brain/skills/MEDICAL_RLS_PRODUCTION_ENABLEMENT_SKILL_AR.md)** | ضوابط تفعيل RLS على خادم الإنتاج الفعلي وإعداد أدوار الاتصال المقيدة. | **P1** |
| **[MEDICAL_TENANT_ID_BACKFILL_SKILL_AR](.ai-brain/skills/MEDICAL_TENANT_ID_BACKFILL_SKILL_AR.md)** | خطة إضافة وتعبئة عمود معرف المستأجر وسكربتات الهجرة القديمة. | **P1** |
| **[MEDICAL_ADMISSIONS_TRANSFERS_RLS_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_ADMISSIONS_TRANSFERS_RLS_AUTOPILOT_SKILL_AR.md)** | حوكمة وتأمين التنويم الداخلي وحركات الأسرة وعزل المستأجرين. | **P1** |
| **[MEDICAL_DISCHARGE_OCCUPANCY_RLS_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_DISCHARGE_OCCUPANCY_RLS_AUTOPILOT_SKILL_AR.md)** | حوكمة وتصميم عزل إجراءات خروج المرضى وإحصاء إشغال الأسرة اليومي. | **P1** |
| **[MEDICAL_RLS_RECONCILIATION_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_RLS_RECONCILIATION_AUTOPILOT_SKILL_AR.md)** | تسوية وحل حظر RLS في جداول التنويم والتحويلات وتأكيد حماية البيانات. | **P1** |
| **[MEDICAL_POST_IMPLEMENTATION_MONITORING_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_POST_IMPLEMENTATION_MONITORING_AUTOPILOT_SKILL_AR.md)** | إرشادات وقواعد مراقبة ما بعد التنفيذ على بيئة Staging وتدقيق الروابط. | **P1** |
| **[MEDICAL_ICU_NURSING_RLS_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_ICU_NURSING_RLS_AUTOPILOT_SKILL_AR.md)** | حوكمة وتأمين عمليات أجنحة العناية المركزة (ICU)، التمريض (Nursing)، و eMAR. | **P1** |
| **[MEDICAL_NURSING_ASSESSMENTS_SCHEMA_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_NURSING_ASSESSMENTS_SCHEMA_AUTOPILOT_SKILL_AR.md)** | حوكمة وتصميم وإرشاد تعديل هيكل وعزل التقييمات التمريضية. | **P1** |
| **[MEDICAL_SURGERY_OR_RLS_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_SURGERY_OR_RLS_AUTOPILOT_SKILL_AR.md)** | حوكمة وتصميم عزل موديول العمليات الجراحية وغرف العمليات (Batch 5). | **P1** |
| **[MEDICAL_SURGERY_OR_POST_MONITORING_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_SURGERY_OR_POST_MONITORING_AUTOPILOT_SKILL_AR.md)** | حوكمة ومراقبة عزل موديول العمليات الجراحية وغرف العمليات والموافقات الطبية بعد التنفيذ. | **P1** |
| **[MEDICAL_HEALTHCARE_COMPLIANCE_SAUDI_SKILL_AR](.ai-brain/skills/MEDICAL_HEALTHCARE_COMPLIANCE_SAUDI_SKILL_AR.md)** | معايير الامتثال لوزارة الصحة ونفيس NPHIES والسيادة الجغرافية للبيانات. | **P1** |
| **[MEDICAL_FINAL_RLS_COVERAGE_REVIEW_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_FINAL_RLS_COVERAGE_REVIEW_AUTOPILOT_SKILL_AR.md)** | حوكمة ومراجعة تغطية عزل المستأجرين للوحدات المنجزة والتحقق من الجودة. | **P1** |
| **[MEDICAL_PRODUCTION_READINESS_RUNBOOKS_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_PRODUCTION_READINESS_RUNBOOKS_AUTOPILOT_SKILL_AR.md)** | مهارة أوتوبيلوت جاهزية الإنتاج وأدلة التشغيل وتدقيق الأسرار باللغة العربية. | **P1** |
| **[MEDICAL_CLINICAL_WORKFLOW_QA_SKILL_AR](.ai-brain/skills/MEDICAL_CLINICAL_WORKFLOW_QA_SKILL_AR.md)** | فحوصات الجودة الطبية ومحاكاة دورة حياة المريض وصرف الأدوية. | **P1** |
| **[MEDICAL_ARABIC_UTF8_ENFORCEMENT_SKILL_AR](.ai-brain/skills/MEDICAL_ARABIC_UTF8_ENFORCEMENT_SKILL_AR.md)** | فرض ترميز UTF-8 وعلاج تشويه الخطوط (Mojibake) وتنسيق RTL. | **P1** |
| **[MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR](.ai-brain/skills/MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR.md)** | شروط وبوابات الجودة المطلوبة لترقية البيئة إلى الإنتاج. | **P1** |
| **[MEDICAL_SAFE_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_SAFE_AUDIT_SKILL_AR.md)** | ضوابط الفحص الأولي للملفات والسورس كود دون تعديل. | **P2** |
| **[MEDICAL_SECURITY_COMPLIANCE_SKILL_AR](.ai-brain/skills/MEDICAL_SECURITY_COMPLIANCE_SKILL_AR.md)** | مراجعة صلاحيات التصفح وملفات الكوكيز وترويس Nginx الأمني. | **P2** |
| **[MEDICAL_UX_UI_DASHBOARDS_SKILL_AR](.ai-brain/skills/MEDICAL_UX_UI_DASHBOARDS_SKILL_AR.md)** | تحسين واجهات المستخدم الطبية ودعم بطاقات الزجاج المعزز. | **P2** |
| **[MEDICAL_ARABIC_DOCS_SKILL_AR](.ai-brain/skills/MEDICAL_ARABIC_DOCS_SKILL_AR.md)** | الهيكل الموحد لكتابة التقارير الإدارية والتقنية باللغة العربية. | **P2** |
| **[MEDICAL_GLOBAL_MODULES_SKILL_AR](.ai-brain/skills/MEDICAL_GLOBAL_MODULES_SKILL_AR.md)** | استكشاف المخططات والمسارات للوحدات والـ 41 قسماً. | **P2** |
| **[MEDICAL_QA_TESTING_SKILL_AR](.ai-brain/skills/MEDICAL_QA_TESTING_SKILL_AR.md)** | اختبارات الدخان للواجهة البرمجية ومعدلات الطلب Rate Limiter. | **P2** |
| **[MEDICAL_NEXT_PHASE_SELECTOR_SKILL_AR](.ai-brain/skills/MEDICAL_NEXT_PHASE_SELECTOR_SKILL_AR.md)** | معايير الانتقال وترتيب المراحل وخارطة الطريق العامة. | **P2** |
| **[MEDICAL_P0_TENANT_ISOLATION_WAVE_AUTOPILOT_SKILL_AR](.ai-brain/skills/MEDICAL_P0_TENANT_ISOLATION_WAVE_AUTOPILOT_SKILL_AR.md)** | معالجة موجات P0 لعزل المستأجرين: تصنيف Class A/B، قواعد الإصلاح، SQL، الاختبارات، وقرارات الإغلاق. | **P0** |
| **[MEDICAL_CONTROLLED_WEBSITE_DEPLOY_AND_GIT_SKILL_AR](.ai-brain/skills/MEDICAL_CONTROLLED_WEBSITE_DEPLOY_AND_GIT_SKILL_AR.md)** | النشر المحكوم على الموقع وGitHub: tests/smoke/hygiene، commit/push للـ submodule والـ parent، preflight، ونشر code-only مقابل DDL. | **P0** |
| **[MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR](.ai-brain/skills/MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR.md)** | توحيد التقارير العربية وتدقيق النظافة (أسرار/mojibake/مسارات محلية) وصيغة الإغلاق الموحدة. | **P0** |
| **[MEDICAL_GLOBAL_DISCOVERY_SKILL_AR](.ai-brain/skills/MEDICAL_GLOBAL_DISCOVERY_SKILL_AR.md)** | اكتشاف النظام الطبي الكامل (بنية/APIs/DB/tenant/موديولات) وإنتاج الخريطة والجرد. | **P1** |
| **[MEDICAL_GLOBAL_BENCHMARK_SKILL_AR](.ai-brain/skills/MEDICAL_GLOBAL_BENCHMARK_SKILL_AR.md)** | المقارنة العالمية (27 بُعداً) مع Epic/Cerner/MEDITECH وتوقعات السعودية. | **P1** |
| **[MEDICAL_FACILITY_TYPE_ENTITLEMENTS_SKILL_AR](.ai-brain/skills/MEDICAL_FACILITY_TYPE_ENTITLEMENTS_SKILL_AR.md)** | تدقيق وتصميم استحقاقات أنواع المنشآت العشرة وإنفاذها في UI/API/Service/DB. | **P1** |
| **[MEDICAL_PATIENT_FLOW_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_PATIENT_FLOW_AUDIT_SKILL_AR.md)** | تدقيق تدفّق المريض والاستقبال (تسجيل/MRN/تكرار/موعد/زيارة). | **P1** |
| **[MEDICAL_EMR_WORKFLOW_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_EMR_WORKFLOW_AUDIT_SKILL_AR.md)** | تدقيق سير عمل EMR السريري وعدم قابلية تعديل السجلات النهائية. | **P1** |
| **[MEDICAL_PHARMACY_INVENTORY_SKILL_AR](.ai-brain/skills/MEDICAL_PHARMACY_INVENTORY_SKILL_AR.md)** | سلامة الصيدلية/المخزون (القاعدة الحرجة: لا خصم قبل الصرف + الدُفعة/الانتهاء). | **P1** |
| **[MEDICAL_LAB_RADIOLOGY_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_LAB_RADIOLOGY_AUDIT_SKILL_AR.md)** | تدقيق المختبر/الأشعة وقواعد الاعتماد وجاهزية LIS/PACS. | **P1** |
| **[MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR](.ai-brain/skills/MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR.md)** | تدقيق الدورة الإيرادية والتأمين ومحرّك الترحيل المحاسبي وZATCA. | **P1** |
| **[MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR](.ai-brain/skills/MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR.md)** | تدقيق الصلاحيات وعزل المستأجرين والاستحقاقات على كل الطبقات. | **P0** |
| **[MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR.md)** | تدقيق الأمن وخصوصية المريض (IDOR/CSRF/XSS/الأسرار/سجل التدقيق). | **P0** |
| **[MEDICAL_TEST_SCENARIOS_SKILL_AR](.ai-brain/skills/MEDICAL_TEST_SCENARIOS_SKILL_AR.md)** | استراتيجية الاختبار ومصفوفة التغطية واختبارات العزل. | **P1** |
| **[MEDICAL_PERFORMANCE_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_PERFORMANCE_AUDIT_SKILL_AR.md)** | تدقيق الأداء (استعلامات/فهارس/N+1/تجميع الاتصالات/الحزمة). | **P2** |
| **[MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR](.ai-brain/skills/MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR.md)** | ضمان UTF-8 عربي نظيف وحظر الإغلاق عند mojibake. | **P1** |
| **[MEDICAL_GLOBAL_ROADMAP_SKILL_AR](.ai-brain/skills/MEDICAL_GLOBAL_ROADMAP_SKILL_AR.md)** | خارطة طريق مرحلية (Phase 0-7) للوصول للمعايير العالمية. | **P1** |
| **[MEDICAL_API_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_API_AUDIT_SKILL_AR.md)** | تدقيق كل نهاية API (auth/tenant/entitlement/validation/risks). | **P0** |
| **[MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR.md)** | تدقيق المخطط (tenant_id/RLS/الفهارس/سلامة المال/حوكمة RLS). | **P0** |
| **[MEDICAL_UX_UI_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_UX_UI_AUDIT_SKILL_AR.md)** | تدقيق UX/UI (RTL/الأدوار/الإتاحة WCAG/الموبايل/التجربة). | **P2** |
| **[MEDICAL_RISK_REGISTER_SKILL_AR](.ai-brain/skills/MEDICAL_RISK_REGISTER_SKILL_AR.md)** | سجل المخاطر والفجوات الشامل عبر كل الفئات. | **P1** |
| **[MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR](.ai-brain/skills/MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR.md)** | تدقيق منطق العمل الطبي الحقيقي مقابل شاشات CRUD + القواعد الحرجة. | **P0** |

---
STATUS:
  MEDICAL_SKILLS_INDEX_UPDATED_SUCCESSFULLY
