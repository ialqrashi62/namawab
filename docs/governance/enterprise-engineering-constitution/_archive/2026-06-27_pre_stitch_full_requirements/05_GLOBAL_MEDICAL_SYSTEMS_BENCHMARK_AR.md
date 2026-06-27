# مصفوفة المنافسة مع الأنظمة الطبية العالمية
## Global Medical Systems Benchmark

| الحقل | القيمة |
|---|---|
| رمز الوثيقة | EEC-GLOBAL |
| المشروع | NamaMedical / الطبيب |
| التصنيف | داخلي / مؤسسي / مرجعي / غير مخصص للنشر العام إلا بموافقة |
| الإصدار | 3.0 |
| الحالة | مسودة مؤسسية رسمية جاهزة لمراجعة المالك والاعتماد |
| المالك | مكتب الهندسة المؤسسية والحوكمة التقنية |
| المعتمد | يحدد عند التوقيع الرسمي |
| تاريخ الإصدار | 2026-06-27 |
| اللغة | العربية المؤسسية مع مصطلحات إنجليزية تقنية عند الحاجة |
| نطاق التطبيق | جميع مكونات منصة الطبيب والفرق والوكلاء والوثائق والإصدارات |
| علاقة الوثيقة بالدستور الأعلى | وثيقة تابعة وملزمة لدستور الهندسة المؤسسية الأعلى |

> تنبيه اعتماد: هذه وثيقة هندسية مصممة للمواءمة مع المتطلبات السعودية والمقارنات العالمية. لا تعد شهادة امتثال قانوني أو اعتماد صحي نهائي إلا بعد مراجعة مختصة وأدلة تشغيلية وتوقيع مالك المجال.

---

## 1. الهدف

هذه الوثيقة لا تقول إن منصة الطبيب أصبحت Epic أو Oracle أو TrakCare. الهدف الصحيح هو تحويل عناصر قوتهم إلى قدرات هندسية قابلة للقياس: سجل موحد، تشغيل بيني، عمق أقسام، دورة إيراد، بوابة مريض، تحليلات، نضج رقمي، وسلامة سريرية.

## 2. مصفوفة القدرات العالمية

| القدرة | المرجع العالمي | المعيار المطلوب | التنفيذ في منصة الطبيب | الوثائق | الحالة |
| --- | --- | --- | --- | --- | --- |
| Unified Patient Record | Epic / TrakCare | سجل طبي موحد يربط رحلة المريض عبر الأقسام | EMR + MPI + ADT + OPD + ED + IPD | EEC-CLIN / DEPT-* | EVIDENCE_REQUIRED |
| Patient Portal | Epic MyChart-like capability | بوابة مريض عربية/إنجليزية للمواعيد والنتائج والتواصل | Portal + mobile | DEPT-PORTAL | ROADMAP_OR_IMPLEMENTATION_EVIDENCE |
| Revenue Cycle | Epic Access/RCM | دورة إيراد وفوترة ومطالبات وتسويات | Billing + Insurance + NPHIES + ZATCA guard | DEPT-RCM / EEC-ZATCA | EVIDENCE_REQUIRED |
| Interoperability | Oracle Health / HL7/FHIR | منصة تكامل standards-based، sandbox-first | FHIR/HL7/DICOM + audit | EEC-INT | EVIDENCE_REQUIRED |
| Unified HIS | InterSystems TrakCare | ربط الرعاية والعمليات والجودة في نظام موحد | Modules + governance + analytics | EEC-ARCH / DEPT-* | EVIDENCE_REQUIRED |
| Digital Maturity | HIMSS EMRAM | نموذج نضج ينتقل من الأنظمة المساعدة إلى EMR متقدم | Maturity roadmap | PHASE-* | MATURITY_REVIEW_REQUIRED |
| Operational Command Center | Global hospital operations | مركز قيادة للسرعة والسعة والجودة والتشغيل | dashboards + alerts + KPIs | DEPT-ANALYTICS | EVIDENCE_REQUIRED |
| Clinical Safety | CBAHI + global safety expectations | قفل السجل، النتائج الحرجة، الأوامر، التعديلات | clinical safety controls | EEC-CLIN | CLINICAL_REVIEW_REQUIRED |

## 3. قواعد المنافسة

- لا تكفي كثرة الشاشات؛ يجب أن تكون الرحلة السريرية متصلة.
- لا تكفي الجداول؛ يجب وجود نموذج بيانات موحد وتدقيق.
- لا تكفي واجهة FHIR؛ يجب وجود عقود تكامل وسجلات وsandbox.
- لا تكفي الفوترة؛ يجب وجود RCM وNPHIES وZATCA وحارس محاسبة.
- لا تكفي التقارير؛ يجب وجود مؤشرات جودة وتشغيل وسلامة.
- لا تكفي SaaS؛ يجب عزل مستأجرين مثبت وقابل للاختبار.
- لا يدعى التفوق العالمي دون benchmark evidence.

## 4. بوابة القبول

PASS: وجود capability map + evidence + gap owner.  
BLOCKED: ادعاء تنافس عالمي دون دليل أو دون خارطة فجوات.  
NEXT: تحويل كل فجوة إلى roadmap item.
