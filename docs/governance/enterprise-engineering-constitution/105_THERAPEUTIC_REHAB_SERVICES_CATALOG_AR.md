# كتالوج الخدمات العلاجية والتأهيلية
## Detailed Catalog

| الحقل | القيمة |
|---|---|
| رمز الوثيقة | CAT-105 |
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
سادساً: الخدمات العلاجية والتأهيلية (Therapeutic & Rehabilitative Services)
27. العلاج الطبيعي والتأهيل (Physical Medicine & Rehabilitation)
قسم العلاج الطبيعي (Physical Therapy):
وحدة العلاج الكهربي (Electrotherapy)
وحدة العلاج المائي (Hydrotherapy)
وحدة العلاج اليدوي (Manual Therapy)
وحدة العلاج بعد العمليات الجراحية
وحدة علاج آلام العمود الفقري
قسم العلاج الوظيفي (Occupational Therapy):
تأهيل الأنشطة اليومية
علاج اضطرابات الحواس (Sensory Integration)
قسم العلاج النطقي والبلع (Speech & Swallowing Therapy):
علاج اضطرابات الكلام
علاج اضطرابات البلع (Videofluoroscopic Swallow Study)
قسم تأهيل الحوادث والشلل (Spinal Cord Injury Rehab)
قسم تأهيل الأطفال ذوي الاحتياجات الخاصة (Pediatric Rehab)
قسم تأهيل حالات الأطراف الصناعية (Prosthetics & Orthotics)
قسم العلاج بالألعاب (Child Life Services / Play Therapy)
28. العلاج الإشعاعي والأدوية (Oncology Therapeutics)
قسم العلاج الإشعاعي (Radiation Oncology):
وحدة العلاج بالأشعة الموجهة (IMRT - Intensity Modulated Radiation Therapy)
وحدة العلاج بالجرعات العالية (SRS - Stereotactic Radiosurgery)
وحدة العلاج بالجاما سكين (Gamma Knife)
وحدة العلاج بالسايبر سكين (CyberKnife)
وحدة العلاج بالبروتون (Proton Therapy)
وحدة العلاج بالبروسيتال (Brachytherapy - العلاج بالإشعاع الداخلي)
قسم الصيدلية الإكلينيكية (Clinical Pharmacy):
وحدة صيدلية العلاج الكيميائي (Chemotherapy Pharmacy)
وحدة صيدلية العناية المركزة (ICU Pharmacy)
وحدة صيدلية الأطفال (Pediatric Pharmacy)
وحدة صيدلية أمراض الدم (Hematology Pharmacy)
وحدة معلومات الدواء (Drug Information Center)
وحدة مراقبة الأدوية (TDM - Therapeutic Drug Monitoring)
29. العلاج التكميلي والبديل (Integrative Medicine)
قسم الطب الصيني التقليدي (Traditional Chinese Medicine):
العلاج بالإبر (Acupuncture)
الحجامة الطبية (Wet & Dry Cupping)
قسم العلاج بالأعشاب الطبية (Herbal Medicine)
قسم العلاج بالزيوت العطرية (Aromatherapy)
قسم العلاج بالموسيقى (Music Therapy)
قسم العلاج بالفن (Art Therapy)
قسم العلاج بالتدليك الطبي (Medical Massage)
قسم العلاج بالحركة واليوغا الطبية (Medical Yoga)
قسم العلاج بالحيوانات (Pet Therapy / Animal Assisted Therapy)
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
