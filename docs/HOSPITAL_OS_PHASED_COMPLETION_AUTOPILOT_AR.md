# Hospital OS Phased Completion Auto Pilot

التاريخ: 2026-07-03  
النطاق: تحويل نواقص NamaMedical Hospital OS مقارنة بالأنظمة العالمية إلى مراحل تنفيذ واضحة، باستخدام مهارات Hospital OS وai-brain governance.  
القيود: لا Production Deploy في هذه الوثيقة، لا DDL، لا Migration، لا Data Write، لا أسرار، لا PHI، لا UI جديد دون Stitch Source أو Stitch Prompt معتمد.

## 1. القرار التنفيذي

نعم، أصبح لدينا خط أساس قوي لمعرفة النواقص مقارنة بالأنظمة العالمية. هذا لا يعني أن كل فجوة أُغلقت، لكنه يعني أن المشروع أصبح لديه:

- خريطة أقسام شاملة بدون إسقاط.
- مقارنة مع أنظمة عالمية مرجعية.
- تصنيف للنواقص إلى clinical safety، RBAC، workflows، integrations، API، DB candidates، UI/Stitch، testing.
- آلية Auto Pilot لإغلاق النواقص على مراحل.
- بوابة ai-brain تلزم توثيق كل مرحلة.

`CURRENT_STATUS: GLOBAL_GAP_BASELINE_READY`

`NEXT_MODE: PHASED_COMPLETION_AUTOPILOT`

## 2. مراجع المقارنة العالمية

| المرجع | الرابط | سبب الاستخدام |
|---|---|---|
| Epic Specialties | https://www.epic.com/software/specialties/ | تغطية التخصصات ووجود workflows متخصصة حسب القسم. |
| Oracle Health Service Lines and Departments | https://www.oracle.com/health/service-lines-departments/ | تنظيم خطوط الخدمة والأقسام حول رعاية منسقة عبر continuum of care. |
| Oracle Health Products | https://www.oracle.com/health/products/ | تغطية منتجات سريرية وتشغيلية مثل critical care، emergency، radiology، lab، blood bank، pharmacy، infection control. |
| MEDITECH Expanse | https://ehr.meditech.com/ehr-solutions/meditech-expanse | نموذج EHR متكامل يربط الأطباء والتمريض والمرضى والتشغيل والتحليلات. |

## 3. ماذا عرفنا الآن؟

| المجال | هل عرفنا النقص؟ | مستوى الثقة | ما يلزم للإغلاق |
|---|---|---|---|
| الأقسام الأساسية | نعم | عال | إغلاق gaps حسب كل قسم. |
| التخصصات الدقيقة | نعم كخريطة نطاق | متوسط إلى عال | تحليل تفصيلي لكل تخصص قبل التنفيذ. |
| RBAC action-level | نعم | عال | تحويل كل module-level متبقٍ إلى action-level. |
| توقيع الطبيب والتمريض | نعم | عال | منع خلط Physician EMR مع Nursing Record دائماً. |
| tenant scope | نعم للأجزاء المفحوصة | متوسط | توسيع الفحص لكل endpoint قبل PASS شامل. |
| Workflows | نعم كقوالب ومسارات | متوسط | اختبار كل workflow فعلياً. |
| Integrations | نعم كخريطة | متوسط | sandbox لكل تكامل حساس. |
| DB/ERD gaps | نعم كمرشحات | متوسط | DB اختبار معزولة قبل أي DDL أو migration. |
| UI/UX gaps | نعم كاحتياج | متوسط | Stitch Source أو Stitch Prompt قبل أي تنفيذ. |
| Tests | نعم | عال | تشغيل DB tests فقط على DB اختبار معزولة. |

## 4. مبدأ التنفيذ المرحلي

كل مرحلة يجب أن تبدأ وتنتهي بهذه البوابات:

| Gate | المطلوب |
|---|---|
| G0 Scope | تحديد الأقسام والمسارات والملفات داخل النطاق. |
| G1 Safety Constraints | تأكيد لا Production Deploy، لا DDL، لا Migration، لا Data Write إلا بإذن مستقل. |
| G2 Existing State | فحص الكود، routes، menus، RBAC، tests. |
| G3 Gap Mapping | ربط الفجوة بالأنظمة العالمية وNo-Omission scope. |
| G4 Implementation | تنفيذ backend/docs/tests فقط حسب المسموح. |
| G5 Static Verification | `node --check`، static tests، mojibake scan. |
| G6 Safe Tests | `npm run test:safe` إذا كان مناسباً. |
| G7 DB Gate | أي DB test يبقى `BLOCKED_DB_TEST_ENV_REQUIRED` حتى تتوفر DB معزولة. |
| G8 ai-brain Closeout | إنشاء ملفات `task.md` إلى `memory-update.md`. |
| G9 Final Decision | PASS أو PARTIAL أو BLOCKED مع سبب واضح. |

## 5. Backlog الإغلاق المرحلي

### Phase 0 - Baseline and Governance

| العنصر | الحالة |
|---|---|
| No-Omission Master Scope | جاهز |
| Super-specialties appendix | جاهز |
| ai-brain governance skills | جاهزة |
| Partial closure report | جاهز |
| Global comparison baseline | جاهز |

`PHASE_0_STATUS: PASS_BASELINE_READY`

### Phase 1 - P0 Safety, Tenant, RBAC, Audit

الهدف: إغلاق أخطر فجوات السلامة والصلاحيات قبل توسيع الأقسام.

| العمل | المخرجات | القيود |
|---|---|---|
| مسح كل endpoints عالية الخطورة | جدول tenant/RBAC/audit coverage | لا DB write |
| تحويل RBAC المتبقي إلى action-level | View/Create/Update/Approve/Cancel/Print/Export/Override/Emergency/Sensitive | backend/docs/tests فقط |
| تثبيت physician vs nursing sign policy | منع توقيع Physician EMR من التمريض | لا خلط صلاحيات |
| مراجعة emergency access | break-glass audited policy | لا فتح صلاحيات عامة |
| إضافة static tests | إثبات guards والسياسات | DB-free |

الأقسام ذات الأولوية في Phase 1:
- Physician EMR.
- Nursing/eMAR.
- ER.
- ICU/CCU/PICU/NICU.
- OR/Anesthesia/PACU.
- Blood Bank.
- Pharmacy/High-Alert Medication.
- Lab/Radiology/Pathology.
- Insurance/Billing/HIM.

`PHASE_1_TARGET_STATUS: SAFETY_RBAC_AUDIT_READY`

### Phase 2 - Clinical Core Completion

الهدف: تقوية المسار السريري الأساسي من زيارة المريض إلى الإغلاق.

| المسار | المطلوب |
|---|---|
| Encounter lifecycle | فتح زيارة، تقييم، أوامر، نتائج، تشخيص، خطة، توقيع، amendment. |
| Orders and Results loop | Lab/Rad/Pharmacy orders مع result callback. |
| Nursing documentation | Vitals، assessments، care plans، MAR، escalation. |
| Medication safety | allergy، interactions، high-alert double check، controlled substances. |
| HIM and coding | lock، coding، ROI، audit، print/export controls. |

`PHASE_2_TARGET_STATUS: CLINICAL_CORE_WORKFLOWS_READY`

### Phase 3 - Acute and High-Risk Departments

الهدف: رفع جودة الأقسام التي تحمل أعلى مخاطر طبية وتشغيلية.

| القسم | نواقص يجب إغلاقها |
|---|---|
| ER | triage، ESI، code stroke، chest pain، observation، disposition. |
| ICU | ventilator، infusions، scores، fluid balance، sepsis/EWS. |
| OR | WHO checklist، counts، anesthesia، PACU، CSSD linkage. |
| Blood Bank | compatibility، crossmatch، issue، transfusion reaction. |
| OB/NICU | partogram، fetal monitoring، APGAR، NICU handoff. |
| Interventional Radiology | procedure workflow، sedation nursing، critical notify. |

`PHASE_3_TARGET_STATUS: HIGH_RISK_DEPARTMENTS_READY`

### Phase 4 - Revenue, Compliance, Saudi Integrations

الهدف: ضبط الماليات والتأمين والامتثال دون السماح لها بتغيير السجل السريري.

| المجال | المطلوب |
|---|---|
| NPHIES | eligibility، pre-auth، claims، denials، remittance، audit. |
| ZATCA | invoice lifecycle، credit notes، QR/hash، safe submission gates. |
| PDPL/Privacy | masking، access logs، ROI، retention. |
| Billing | patient accounts، refunds، approvals، segregation of duties. |
| Finance | GL/AP/AR، posting، reversal، reconciliation. |

`PHASE_4_TARGET_STATUS: REVENUE_COMPLIANCE_READY`

### Phase 5 - Department Expansion and Centers of Excellence

الهدف: تحويل قائمة التخصصات الفائقة إلى وحدات قابلة للتنفيذ حسب الأولوية.

| الحزمة | أمثلة |
|---|---|
| Internal Medicine | Cardiology، Pulmonology، GI، Nephrology، Oncology، Endocrine. |
| Surgical Specialties | Neurosurgery، Orthopedics، Ophthalmology، ENT، Urology، Burns. |
| Women and Children | MFM، IVF، Pediatrics، NICU، pediatric subspecialties. |
| Diagnostics | Advanced imaging، molecular pathology، genetics، toxicology. |
| Centers of Excellence | Heart، Cancer، Trauma، Stroke، Eye، Women/Fetal، Children. |

كل تخصص يبدأ بـ:
- Department Charter.
- Role/RBAC matrix.
- Workflow.
- OpenAPI draft.
- ERD candidate without DDL.
- Stitch Prompt إذا احتاج UI.
- Test plan.

`PHASE_5_TARGET_STATUS: SPECIALTY_EXPANSION_PLANNED`

### Phase 6 - AI, RAG, LangChain, VectorMine

الهدف: إضافة الذكاء المساعد بشكل آمن ومحكوم، وليس كبديل للقرار الطبي.

| المجال | المطلوب |
|---|---|
| RAG | مصادر معرفة موثقة، citation، tenant/role filtering. |
| LangChain | chains للأدلة والسياسات والتدريب، لا أوامر طبية آلية. |
| Vector DB | metadata filters، no PHI ingestion، audit. |
| Clinical Copilot | suggestions only، human approval mandatory. |
| Prompt Governance | system prompts حسب الدور والقسم. |

`PHASE_6_TARGET_STATUS: AI_ASSISTANCE_GOVERNED`

### Phase 7 - UI/UX via Stitch Only

الهدف: تحسين الواجهات بعد وجود مصدر Stitch معتمد.

| المطلوب | القاعدة |
|---|---|
| شاشة جديدة | Stitch Source أو Stitch Prompt أولاً. |
| RTL | إلزامي. |
| Responsive | إلزامي. |
| Empty/Error/Loading States | إلزامية. |
| Accessibility | إلزامية. |
| Visual Smoke Test | إلزامي بعد التنفيذ. |

`PHASE_7_TARGET_STATUS: STITCH_IMPLEMENTATION_READY_WHEN_SOURCE_EXISTS`

## 6. ترتيب التنفيذ المقترح الآن

ابدأ بـ Phase 1 لأنها تمنع تضخم المشروع فوق أساس غير آمن.

| الأولوية | المرحلة | السبب |
|---|---|---|
| P0 | Phase 1 Safety/RBAC/Audit | تمنع أخطاء صلاحيات وسلامة سريرية. |
| P1 | Phase 2 Clinical Core | تجعل رحلة المريض الطبية متماسكة. |
| P1 | Phase 3 High-Risk Departments | أعلى أثر طبي وتشغيلي. |
| P2 | Phase 4 Revenue/Compliance | ضروري للإنتاج التجاري والامتثال. |
| P3 | Phase 5 Specialty Expansion | توسع عالمي منظم بعد صلابة الأساس. |
| P3 | Phase 6 AI/RAG | بعد ضبط البيانات والصلاحيات. |
| P3 | Phase 7 UI/Stitch | حسب توفر Stitch Source. |

## 7. Phase 1 Auto Pilot Prompt

```text
فعّل Hospital OS Skills كاملة مع ai-brain governance.

ابدأ Phase 1: P0 Safety, Tenant, RBAC, Audit.

النطاق:
- Physician EMR
- Nursing/eMAR
- ER
- ICU/CCU/PICU/NICU
- OR/Anesthesia/PACU
- Blood Bank
- Pharmacy/High-Alert Medication
- Lab/Radiology/Pathology
- Insurance/Billing/HIM

المطلوب:
1. افحص routes والملفات الفعلية.
2. لا تلمس DB ولا migrations ولا production deploy.
3. حدد كل endpoint عالي الخطورة.
4. أثبت tenant scope.
5. أثبت RBAC action-level.
6. أثبت audit events.
7. أثبت منع خلط physician sign مع nursing sign.
8. أضف static tests آمنة عند الحاجة.
9. شغّل فقط:
   - node --check server.js
   - node hospital_os_gate_static_test.js
   - npm run test:safe
10. أي DB test يعلن BLOCKED_DB_TEST_ENV_REQUIRED.
11. وثّق المرحلة داخل `.ai-brain`.

FINAL_DECISION:
- PASS إذا أغلقت الفجوات المحددة بأمان.
- PARTIAL إذا بقيت فجوات غير حرجة موثقة.
- BLOCKED إذا احتاج الأمر DB/DDL/Production/Secrets/Owner Decision.
```

## 8. القرار النهائي لهذه الوثيقة

هذه الوثيقة لا تغلق كل النواقص تنفيذياً، لكنها تجعل الإغلاق قابلاً للإدارة والقياس.

`FINAL_STATUS: PHASED_COMPLETION_AUTOPILOT_READY`
