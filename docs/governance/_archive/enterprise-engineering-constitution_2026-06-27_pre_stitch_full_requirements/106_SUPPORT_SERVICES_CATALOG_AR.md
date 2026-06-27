# كتالوج الخدمات المساندة والداعمة
## Detailed Catalog

| الحقل | القيمة |
|---|---|
| رمز الوثيقة | CAT-106 |
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
سابعاً: الخدمات المساندة والداعمة (Support Services)
30. الخدمات التمريضية والرعاية (Nursing & Patient Care)
إدارة التمريض العامة (Nursing Administration)
قسم التمريض الداخلي (Medical-Surgical Nursing)
قسم تمريض العمليات (Perioperative Nursing)
قسم تمريض العناية المركزة (Critical Care Nursing)
قسم تمريض الأطفال (Pediatric Nursing)
قسم تمريض النساء والولادة (Obstetric Nursing)
قسم التمريض المنزلي (Home Health Nursing)
قسم تمريض المسنين (Geriatric Nursing)
قسم تمريض الأورام (Oncology Nursing)
قسم تمريض الصحة النفسية (Psychiatric Nursing)
قسم التمريض الطارئ (Emergency Nursing)
قسم التمريض ال specialized للعيون (Ophthalmic Nursing)
قسم التمريض المتخصص للأنف والأذن (ENT Nursing)
قسم التمريض في العناية بآلام المرضى (Palliative Care Nursing)
31. التغذية والمطبخ الطبي (Food & Nutrition Services)
قسم التغذية العلاجية (Clinical Nutrition):
وحدة الدعم الغذائي الوريدي والمعوي (TPN & Enteral Nutrition)
وحدة التغذية في الأمراض المزمنة (Diabetes, Renal, Cardiac Diets)
وحدة التغذية للأطفال (Pediatric Nutrition)
وحدة التغذية في علاج السمنة (Bariatric Nutrition)
المطبخ المركزي (Central Kitchen):
إعداد الوجبات العلاجية
نظام الوجبات وفق الطلب (Room Service)
قسم التغذية الوقائية (Preventive Nutrition)
32. الخدمات الاجتماعية والنفسية (Psychosocial Services)
قسم الخدمة الاجتماعية الطبية (Medical Social Work):
الدعم النفسي للمرضى وذويهم
التنسيق للخروج والرعاية المنزلية
حماية الطفل وكبار السن من الإهمال
قسم رعاية المرضى (Patient Relations / Patient Advocacy)
قسم التوجيه والإرشاد الصحي (Health Education)
قسم الدعم النفسي للعاملين (Employee Assistance Program)
33. الخدمات اللوجستية والفنية (Logistics & Technical)
قسم الهندسة الطبية (Biomedical Engineering):
صيانة الأجهزة المعقدة (MRI, CT, Ventilators)
معايرة الأجهزة (Calibration)
تقنية النانو الطبية
الأطراف الصناعية والأجهزة التعويضية
قسم المعلوماتية الصحية (Health Information Technology / HIS):
إدارة السجلات الطبية الإلكترونية (EMR)
إدارة أنظمة المستشفى (Hospital Information System)
الأرشفة الإلكترونية (PACS - Picture Archiving)
أمن المعلومات الصحية (Cyber Security)
قسم الترجمة الطبية (Medical Translation):
ترجمة التقارير الطبية
الترجمة الفورية للمرضى الأجانب
قسم الإحصاء الطبي والبيانات (Health Statistics & Data Analytics):
تحليل البيانات الصحية الضخمة (Big Data)
التنبؤ بالأمراض الوبائية
قسم الاتصالات الطبية (Medical Communication):
نقل الاستشارات عن بعد (Telemedicine)
نقل الصور الطبية (Teleradiology)
34. الخدمات الأمنية والسلامة (Safety & Security)
قسم الأمن الطبي (Security):
حماية الأطباء والمرضى
إدارة الحوادث العنيفة داخل المستشفى
قسم السلامة والصحة المهنية (Occupational Health & Safety):
حماية العاملين من الإشعاع والعدوى
السلامة الكيميائية والبيولوجية
قسم إدارة الكوارث (Disaster Management):
خطط الطوارئ للحوادث الجماعية
الإخلاء الطبي
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
