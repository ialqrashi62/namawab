# كتالوج الأقسام الإدارية والأكاديمية
## Detailed Catalog

| الحقل | القيمة |
|---|---|
| رمز الوثيقة | CAT-107 |
| المشروع | NamaMedical / الطبيب |
| التصنيف | داخلي / مؤسسي / مرجعي / غير مخصص للنشر العام إلا بموافقة |
| الإصدار | 4.0 |
| الحالة | مضافة إلى الحزمة الشاملة بعد استلام متطلبات المالك التفصيلية |
| المالك | مكتب الهندسة المؤسسية والحوكمة التقنية |
| تاريخ الإصدار | 2026-06-27 |
| اللغة | العربية المؤسسية مع المصطلحات الإنجليزية التقنية عند الحاجة |
| نطاق التطبيق | الدستور، التصميم، STITCH، الأقسام، الشاشات، الأزرار، المتطلبات، الاختبارات، والأدلة |
| ملاحظة اعتماد | هذه وثائق هندسية مرجعية وليست اعتماداً قانونياً أو سريرياً نهائياً دون مراجعة مختصة |

---

## 1. نص القسم كما ورد

```text
ثامناً: الأقسام الإدارية والأكاديمية (Administrative & Academic)
35. الإدارة التنفيذية والطبية (Executive Administration)
مكتب المدير العام (CEO Office)
المدير الطبي (Chief Medical Officer)
المدير التمريضي (Chief Nursing Officer)
المدير المالي (CFO)
المدير التشغيلي (COO)
مجلس الأطباء (Medical Staff Council)
لجنة الأخلاقيات الطبية (Ethics Committee)
لجنة الرعاية الطبية (Patient Care Committee)
36. إدارة الجودة والاعتماد (Quality & Accreditation)
قسم الجودة الشاملة (Total Quality Management)
قسم تراخيص مزاولة المهنة (Credentialing & Privileging)
قسم الاعتماد الدولي (JCI - Joint Commission International / CAP / ISO)
قسم التدقيق الطبي (Medical Audit)
قسم شكاوى المرضى (Patient Complaints)
قسم إدارة المخاطر (Risk Management):
التأمين الطبي (Medical Liability)
إدارة الأخطاء الطبية
37. التعليم والبحث العلمي (Education & Research)
مركز التعليم الطبي والتمريضي (Medical Education Center):
برامج الامتياز (Internship)
برامج الزمالة (Residency Programs)
برامج الزمالات الدقيقة (Fellowships)
التعليم الطبي المستمر (CME - Continuing Medical Education)
مركز البحوث الطبية (Research Center):
وحدة الأبحاث السريرية (Clinical Trials Unit / CRC)
وحدة الأبحاث المخبرية (Basic Science Research)
وحدة الأبحاث الصيدلانية (Clinical Pharmacology)
وحدة أخلاقيات البحث (IRB - Institutional Review Board)
وحدة إحصاء البحوث (Biostatistics)
وحدة نشر الأبحاث (Publication Office)
مكتبة المعرفة الطبية والإلكترونية (Medical Library)
مركز المحاكاة الطبية (Simulation Center):
محاكاة العمليات الجراحية
محاكاة الطوارئ
محاكاة الولادة والأطفال
38. الموارد البشرية والتطوير الإداري (HR & Admin)
قسم الموارد البشرية الطبية (Medical HR):
توظيف الأطباء والاختصاصيين
تخطيط المسار الوظيفي
قسم التدريب والتطوير (Training & Development)
قسم الشؤون القانونية (Legal Affairs)
قسم العلاقات العامة والإعلام (Public Relations):
الإعلام الطبي (Medical Media)
التواصل المجتمعي (Community Outreach)
قسم خدمة العملاء (Customer Service / Call Center)
```

## 2. متطلبات STITCH لكل بند في هذا الكتالوج

- شاشة قائمة أو لوحة رئيسية.
- شاشة تفاصيل.
- نموذج إنشاء/تعديل.
- أزرار: بحث، إنشاء، حفظ مسودة، اعتماد، تعديل ملحق، إلغاء، طباعة، تصدير، تصعيد.
- حالات: empty، loading، error، success، permission denied، locked، audit required.
- صلاحيات: قراءة، إنشاء، تعديل، اعتماد، إلغاء، تصدير، إدارة.
- حراس: tenant isolation، PHI guard، audit، role guard، clinical safety عند الانطباق.
- قصص مستخدم ومعايير قبول واختبارات.
- مفاتيح i18n عربية وإنجليزية.
- ربط API/ERD/OpenAPI عند التنفيذ.

## 3. قرار عدم الاختصار

كل سطر في النص أعلاه يجب أن يُغطى في STITCH أو يُوثق كـ OUT_OF_SCOPE بموافقة مالك.
