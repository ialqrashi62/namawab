# مصدر متطلبات المالك التفصيلية الكامل
## Owner Full Requirements Source

| الحقل | القيمة |
|---|---|
| رمز الوثيقة | EEC-OWNER-SOURCE-090 |
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
## 1. الغرض

هذا الملف يحفظ نص متطلبات المالك كما وصل، حتى لا يتم اختصار أو إسقاط أي بند. يستخدم هذا الملف كمرجع traceability لكل وثائق STITCH، الشاشات، الأزرار، user stories، ERD، OpenAPI، الاختبارات، والتوثيق.

## 2. نص المصدر الكامل

```text

Prompt Engineering
System Prompt
Context
Workflow & Orchestration
LangChain 
Chaining
VectorMine
Backend / Logic
API 
Data & Storage
Vector Databases
RAG
Frontend / UI-UX
Shutterstock
Infrastructure / DevOps
CI/CD
Testing & QA
Unit Testing
Integration Testing
Prompt
Workflow
Backend
Frontend
Database
Infrastructure
Wireframes & Mockups
Prompt
Business Flows
Wireframes & Mockups
Database ERD
API Specifications (OpenAPI)
User Stories & Acceptance Criteria
Test Cases & Test Plan
Architecture Document
Security Plan
Deployment Plan
Style Guide / Design System	
i18n Translation Files
Sample Data / Seeders
Migration Scripts
User Manual
Training Videos
Legal & Compliance Docs	


بالاضافة التاكد من كل المتطلبات لكل هذه الاقسام والازارار وكل شي 

أولاً: الأقسام الطبية الباطنية (Internal Medicine & Subspecialties)
1. القلب والأوعية الدموية
قسم طب القلب العام (Cardiology)
قسم طب القلب التداخلي (Interventional Cardiology)
قسم طب القلب الإلكتروفيزيولوجي (Electrophysiology - علاج اضطراب النظم)
قسم طب القلب الوقائي (Preventive Cardiology)
قسم طب القلب النووي (Nuclear Cardiology)
قسم طب القلب للحوامل (Cardio-Obstetrics)
قسم قسطرة القلب (Cardiac Catheterization Lab)
قسم أمراض الشرايين الطرفية (Peripheral Vascular Disease)
قسم الفشل القلبي المتقدم (Advanced Heart Failure)
2. الجهاز التنفسي
قسم طب الصدر والجهاز التنفسي (Pulmonology)
قسم الحساسية والمناعة الرئوية (Allergic Pulmonology)
قسم النوم واضطرابات التنفس (Sleep Medicine)
قسم العناية التنفسية (Respiratory Care)
قسم مناظير الجهاز التنفسي (Bronchoscopy Unit)
قسم علاج الأكسجين المنزلي (Home Oxygen Therapy)
3. الجهاز الهضمي والكبد
قسم طب الجهاز الهضمي (Gastroenterology)
قسم مناظير الجهاز الهضمي المتقدمة (Advanced Endoscopy):
وحدة التنظير الداخلي بالترددات الصوتية (EUS)
وحدة تنظير القنوات الصفراوية (ERCP)
وحدة تنظير الأمعاء الدقيقة (Enteroscopy)
وحدة منظار البطن (Laparoscopy Medical)
قسم أمراض الكبد (Hepatology)
قسم أمراض البنكرياس والقنوات الصفراوية (Pancreato-Biliary)
قسم حركة الجهاز الهضمي (Gastrointestinal Motility)
قسم التغذية السريرية (Clinical Nutrition Medicine)
4. الكلى والفشل الكلوي
قسم طب الكلى العام (Nephrology)
قسم زراعة الكلى (Renal Transplantation)
وحدة غسيل الكلى (Dialysis Unit):
وحدة غسيل الدم (Hemodialysis)
وحدة الغسيل البريتوني (Peritoneal Dialysis)
وحدة الغسيل المنزلي (Home Dialysis)
وحدة الفصل البديل (Plasmapheresis)
وحلة غسيل الكلى للأطفال (Pediatric Dialysis)
5. الدم والأورام
قسم طب الأورام العام (Medical Oncology)
قسم الأورام النسائية (Gynecologic Oncology)
قسم أمراض الدم (Hematology)
قسم التخثر والأنيميا (Coagulation & Anemia)
قسم زراعة النخاع العظمي (BMT Unit):
وحدة زراعة الخلايا الجذعية الذاتية (Autologous)
وحدة زراعة الخلايا الجذعية الت allogeneic
وحدة زراعة الخلايا الجذعية من الدم الحبلي (Cord Blood)
6. السكري والغدد الصماء والتمثيل الغذائي
قسم الغدد الصماء (Endocrinology)
قسم السكري (Diabetology):
وحدة السكري النوع الأول
وحدة السكري النوع الثاني والمقاومة الأنسولينية
وحدة سكري الحمل (Gestational Diabetes)
وحدة مضاعفات السكري (Diabetic Foot & Neuropathy)
قسم أمراض العظام الاستقلابية (Metabolic Bone Disease)
قسم السمنة والتمثيل الغذائي (Obesity Medicine)
7. المناعة والروماتيزم
قسم الأمراض الروماتيزمية (Rheumatology)
قسم المناعة السريرية (Clinical Immunology)
قسم الأمراض الالتهابية المزمنة (Autoimmune Diseases)
قصل الحساسية والربو (Allergy & Asthma)
8. الأمراض المعدية والطفيلية
قسم الأمراض المعدية (Infectious Diseases)
قسم الوقاية من العدوى (Infection Control)
قسم الحميات والأمراض الاستوائية (Tropical Medicine)
قسم العلاج بالمضادات الحيوية (Antimicrobial Stewardship)
قسم طب المسافرين (Travel Medicine)
قسم التطعيمات (Vaccination Center)
9. الجلدية
قسم الأمراض الجلدية (Dermatology)
قسم الجلدية التجميلية (Cosmetic Dermatology)
قسم الأمراض الجلدية الجراحية (Dermatosurgery)
قسم علاج الأورام الجلدية (Dermatologic Oncology)
وحدة العلاج بالضوء (Phototherapy)
ثانياً: الأقسام الجراحية (Surgical Departments)
10. الجراحة العامة
قسم الجراحة العامة (General Surgery)
قسم جراحة الأورام العامة (Surgical Oncology)
قسم جراحة الغدد الصماء (Endocrine Surgery):
جراحة الغدة الدرقية
جراحة الغدة الكظرية
جراحة الجنيبة (Parathyroid)
قسم جراحة المناظير والروبوت (Minimal Invasive & Robotic Surgery)
قسم جراحة السمنة المفرطة (Bariatric Surgery)
قسم جراحة الثدي (Breast Surgery)
قسم جراحة المناطق الحرجة (Trauma Surgery)
قسم جراحة الأمعاء والقولون (Colorectal Surgery)
11. جراحة القلب والصدر والأوعية
قسم جراحة القلب والصدر (Cardiothoracic Surgery):
وحدة جراحة القلب المفتوح (Open Heart Surgery)
وحدة جراحة الصدر (Thoracic Surgery)
وحدة جراحة القصبة الهوائية (Airway Surgery)
قسم جراحة الأوعية الدموية (Vascular Surgery):
وحدة القسطرة الشريانية (Endovascular Surgery)
وحدة زراعة الأوعية الصناعية (Vascular Grafts)
وحدة علاج الدوالي والقرحات الوعائية (Venous Disease)
12. جراحة المخ والأعصاب والعمود الفقري
قسم جراحة المخ والأعصاب (Neurosurgery):
وحدة جراحة الأعصاب الوعائية (Cerebrovascular)
وحدة أورام المخ (Neuro-oncology Surgery)
وحدة جراحة الأعصاب الوظيفية (Functional Neurosurgery - علاج الصرع والشلل الرعاش)
وحدة جراحة الأعصاب المحيطية (Peripheral Nerve Surgery)
وحدة جراحة القحف والوجه (Skull Base Surgery)
وحدة جراحة الأعصاب عبر الأنف (Endoscopic Neurosurgery)
قسم جراحة العمود الفقري (Spine Surgery):
جراحة العمود الفقري التداخلية
جراحة تشوهات العمود الفقري (Scoliosis Surgery)
13. جراحة العظام والمفاصل
قسم جراحة العظام العامة (Orthopedic Surgery)
قسم جراحة العمود الفقري العظمي (Spinal Orthopedics)
قسم جراحة المفاصل الاصطناعية (Joint Replacement - Arthroplasty):
جراحة مفصل الورك
جراحة مفصل الركبة
جراحة الكتف والكوع
قسم جراحة الحوادث والكسور (Trauma Orthopedics)
قسم جراحة اليد والجراحة الميكروسكوبية (Hand & Microsurgery)
قسم جراحة القدم والكاحل (Foot & Ankle Surgery)
قسم طب وجراحة الرياضة (Sports Medicine & Arthroscopy)
قسم أورام العظام (Orthopedic Oncology)
قسم جراحة الأطفال العظمية (Pediatric Orthopedics)
14. جراحة العيون التخصصية الدقيقة
قسم طب وجراحة العيون العام (Ophthalmology)
قسم جراحة الشبكية والجسم الزجاجي (Vitreoretinal Surgery)
قسم جراحة القرنية وزراعتها (Cornea & External Disease):
بنك القرنية (Eye Bank)
وحدة زراعة القرنية المتقدمة (DMEK, DSAEK)
قسم المياه البيضاء وجراحة العيون الأمامية (Cataract & Anterior Segment)
قسم المياه الزرقاء وجراحة الجلوكوما (Glaucoma)
قسم طب وجراحة العيون التجميلية (Oculoplastics & Orbit):
جراحة الحجاج والجراحة التجميلية للعين
جراحة المساريق والدموع
قسم طب عيون الأطفال وجراحة الحول (Pediatric Ophthalmology & Strabismus)
قسم طب العيون العصبي (Neuro-ophthalmology)
قسم علاج قصر النظر بالليزر والعدسات (Refractive Surgery & Lens Implantation)
15. جراحة الأنف والأذن والحنجرة
قسم الأنف والأذن والحنجرة العام (Otolaryngology - ENT)
قسم جراحة الرأس والرقبة (Head & Neck Surgery)
قسم جراحة الجيوب الأنفية الوظيفية (Rhinology & Skull Base):
مناظير الجيوب الأنفية المتقدمة
قسم جراحة الأذن والسمع (Otology & Neurotology):
جراحة قوقعة الأذن (Cochlear Implant)
جراحة قاعدة الجمجمة من خلال الأذن
قسم جراحة الحنجرة والصوت (Laryngology)
قسم جراحة الغدة الدرقية من خلال الرقبة (Thyroid Surgery)
قسم طب النوم والشخير (Sleep Surgery)
16. جراحة المسالك البولية والذكورة
قسم جراحة المسالك البولية العامة (Urology)
قسم جراحة الكلى المنظارية (Endourology & Stone Disease)
قسم أورام المسالك البولية (Urologic Oncology):
أورام البروستاتا
أورام المثانة
أورام الكلى
قسم جراحة الأطفال المسالك (Pediatric Urology)
قسم الذكورة والعقم (Andrology):
وحدة التقنيات المساعدة على الإنجاب للرجال
وحدة استعادة الخصوبة بعد العلاج الكيميائي
قسم علاج اضطرابات التبول والأمعاء (Female Urology & Urodynamics)
قسم جراحة ترميم المسالك (Reconstructive Urology)
17. جراحة التجميل والترميم والحروق
قسم جراحة التجميل والترميم (Plastic & Reconstructive Surgery):
وحدة الجراحة التجميلية للوجه (Facial Plastic Surgery)
وحدة تجميل الجسم (Body Contouring)
وحدة الجراحات الميكروسكوبية (Microsurgery)
وحدة زراعة الأنسجة المركبة (Composite Tissue Allotransplantation)
قسم الحروق (Burns Center):
وحدة الحروق الكيميائية والكهربائية
وحدة العناية المركزة للحروق (Burn ICU)
وحدة الترميم بعد الحروق
قسم جراحة الوجه والفكين (Maxillofacial Surgery):
جراحة الفكين التصحيحية
جراحة injuries الوجه الرضحية
ثالثاً: النساء والتوليد والأطفال (Obstetrics, Gynecology & Pediatrics)
18. النساء والتوليد
قسم النساء والولادة العام (Obstetrics & Gynecology)
قسم طب الأم والجنين (Maternal-Fetal Medicine):
وحدة العناية بالحوامل عالية الخطورة
وحدة التشخيص قبل الولادة (Prenatal Diagnosis):
السماع الرباعي (4D Ultrasound)
أخذ عينات المشيمة والسائل الأمنيوسي
قسم أمراض النساء الجراحية (Gynecologic Surgery):
جراحة المناظير النسائية
جراحة الروبوت النسائية
قسم أمراض النساء التناسلية العقيمة (Reproductive Endocrinology & IVF):
وحدة التلقيح الصناعي (IVF Lab)
وحدة الحقن المجهري (ICSI)
وحدة تقنية الحقن داخل البلازما (IMSI)
وحدة تشخيص الأجنة قبل الزرع (PGD/PGS)
وحدة الحفظ بالتبريد (Cryopreservation):
بنك السائل المنوي
بنك بويضات وأجنة
بنك أنسجة المبيض (لمرضى السرطان)
قسم طب المراهقات (Adolescent Gynecology)
قسم طب سن اليأس (Menopause Medicine)
قسم طب الأنثى التجميلي (Urogynecology & Cosmetic Gynecology)
19. طب الأطفال (حديثي الولادة والأطفال)
قسم طب الأطفال العام (Pediatrics)
قسم حديثي الولادة (Neonatology):
وحدة العناية المركزة لحديثي الولادة (NICU):
مستوى III (للأطفال المبتسرين جداً)
مستوى IV (للجراحة العصبية للأطفال حديثي الولادة)
وحدة الحضانات العادية (Nursery)
وحدة متابعة الخدج (Follow-up Clinic)
قسم الأمراض الوراثية للأطفال (Pediatric Genetics)
قسم التغذية وسوء التغذية للأطفال (Pediatric Nutrition)
قسم طب الأطفال التنموي والسلوكي (Developmental Pediatrics)
20. التخصصات الأطفال الدقيقة
قسم قلب الأطفال (Pediatric Cardiology):
قسطرة القلب للأطفال
جراحة القلب للأطفال
قسم كلى الأطفال (Pediatric Nephrology)
قسم جهاز هضمي الأطفال (Pediatric Gastroenterology)
قسم أورام وأمراض دم الأطفال (Pediatric Hematology-Oncology)
قسم عيون الأطفال (Pediatric Ophthalmology)
قسم أنف وأذن أطفال (Pediatric ENT)
قسم جلدية الأطفال (Pediatric Dermatology)
قسم غدد وأمراض استقلاب الأطفال (Pediatric Endocrinology)
قسم روماتيزم وأمراض مناعية أطفال (Pediatric Rheumatology)
قسم عظام أطفال (Pediatric Orthopedics)
قسم جراحة أطفال عامة (Pediatric General Surgery):
جراحة التشوهات الخلقية (Birth Defects)
جراحة المناظير للأطفال
جراحة الأورام للأطفال
رابعاً: الأقسام التشخيصية المتقدمة (Advanced Diagnostics)
21. الأشعة والتصوير الطبي
قسم الأشعة التشخيصية (Diagnostic Radiology)
قسم الأشعة التداخلية (Interventional Radiology):
وحدة التصوير الوعائي التداخلي (Angiography)
وحدة تصليد الأوردة (Embolization)
وحدة استئصال الأورام بالتردد الحراري (Tumor Ablation)
وحدة وضع الدعامات والفلاتر (Stenting & IVC Filters)
قسم التصوير المقطعي المحوسب (CT Scan):
CT ثنائية الطاقة (Dual Energy CT)
CT قلبية تاجية (Cardiac CT)
CT أنجيوغرافي للأطراف
قسم الرنين المغناطيسي (MRI):
وظيفي (fMRI)
الطيفي (MR Spectroscopy)
صورة الأعصاب الانتشاري (DTI)
تصوير الأوعية بالرنين (MRA/MRV)
تصوير الثدي والحوض
قسم الموجات الصوتية (Ultrasound):
الصوتية عبر المريء (TEE للقلب)
الصوتية عبر المستقيم (TRUS للبروستاتا)
الصوتية الرباعية للأجنة (4D)
الدوبلر اللوني للأوعية
قسم الطب النووي (Nuclear Medicine):
PET-CT / PET-MRI
تصوير العظام (Bone Scan)
تصوير الغدة الدرقية (Thyroid Scan)
تصوير الكلى (Renal Scan)
تصوير القلب (Myocardial Perfusion)
العلاج باليود المشع (I-131)
العلاج بالزرنيخ (Radioisotope Therapy)
22. المختبرات الطبية المركزية
قسم الباثولوجيا الإكلينيكية (Pathology):
وحدة فحص الأنسجة (Histopathology)
وحدة الفحص الخلوي (Cytopathology)
وحدة الفحص أثناء العملية (Frozen Section)
وحدة الفحص الإلكتروني (Electron Microscopy)
وحدة الفحص المناعي للأنسجة (Immunohistochemistry)
وحدة الفحص الجزيئي للأنسجة (Molecular Pathology)
قسم الأحياء المجهرية (Microbiology):
مختبر البكتيريا (Bacteriology)
مختبر الفيروسات (Virology)
مختبر الفطريات (Mycology)
مختبر الطفيليات (Parasitology)
مختبر زراعة الدماغ (Blood Culture)
مختبر التحسس للمضادات الحيوية (Antibiotic Sensitivity)
قسم الكيمياء الحيوية السريرية (Clinical Chemistry):
التحاليل الروتينية
هرمونات وماركرات الأورام
تحاليل الأدوية العلاجية (Therapeutic Drug Monitoring)
قسم المناعة المخبرية (Immunology & Serology):
الأمراض المناعية الذاتية
تحاليل الحساسية
قسم علم الوراثة الطبية (Medical Genetics):
تحليل الكروموسومات (Cytogenetics)
تحليل الدنا الجزيئي (Molecular Genetics)
تحليل الأحياج القبلية (Preimplantation Genetic Diagnosis)
قسم السموم (Toxicology):
تحاليل المخدرات
تحاليل المعادن الثقيلة
تحاليل المبيدات
بنك الدم (Blood Bank):
وحدة نقل الدم العامة
وحدة الفصل الآلي للدم (Apheresis)
وحدة العلاج بالخلايا الدموية المشتقة
وحدة صفائح الدم المخصصة (Single Donor Platelets)
23. الفحوصات الوظيفية
قسم تخطيط القلب (ECG & Stress Testing):
رسم القلب بالمجهود
رسم القلب بالمجهود الدوائي (Dobutamine Stress Echo)
رسم القلب المستمر (Holter Monitor)
رسم القلب بالحمل (Event Recorder)
قسم قسطرة الأوعية الدماغية (Cerebral Angiography)
قسم قسطرة الجنب (Bronchial Angiography)
قسم تخطيط العضلات والأعصاب (EMG & Nerve Conduction):
تخطيط العضلات (Electromyography)
تخطيط توصيل الأعصاب (Nerve Conduction Study)
تخطيط الاستجابة المتكررة (Evoked Potentials)
قسم تخطيط كهربية الدماغ (EEG):
مراقبة الدماغ بالفيديو (Video EEG)
رسم الدماغ أثناء النوم
قسم قياس وظائف الرئة (PFT - Pulmonary Function Test):
اختبار التحمل الرئوي
اختبار انتشار الغازات
قسم اختبارات التعرق والحساسية (Sweat Test & Allergy Testing)
خامساً: العناية المركزة والطوارئ والألم (Critical Care & Emergency)
24. أقسام الطوارئ الشاملة (Emergency Department)
وحدة الطوارئ العامة (General ER)
مركز الحوادث والإصابات الكبرى (Trauma Center):
مستوى I (Level I Trauma Center)
مستوى II (Level II)
وحدة الطوارئ القلبية (Chest Pain Unit)
وحدة طوارئ الجلطات الدماغية (Stroke Unit / Code Stroke)
وحدة الطوارئ النفسية والسلوكية (Psychiatric Emergency)
وحدة طوارئ الأطفال (Pediatric ER)
وحدة الطوارئ السامة (Toxicology Emergency)
وحدة الطوارئ الحرارية (Hyperthermia / Hypothermia Unit)
وحدة الفرز السريع (Triage)
وحدة الملاحظة القصيرة (Observation Unit)
وحدة الطوارئ الجراحية الصغرى (Minor Surgery ER)
25. أقسام العناية المركزة (Intensive Care Units)
قسم العناية المركزة العام للباطنة (Medical ICU)
قسم العناية المركزة الجراحية (Surgical ICU)
قسم العناية المركزة للحوادث (Trauma ICU)
قسم العناية المركزة القلبية (CCU - Coronary Care Unit):
وحدة العناية ما بعد القسطرة
وحدة العناية ما بعد جراحة القلب المفتوح
قسم العناية المركزة للأعصاب (Neuro ICU)
قسم العناية المركزة للأطفال (PICU - Pediatric ICU)
قسم العناية المركزة لحديثي الولادة (NICU)
قسم العناية المركزة للحروق (Burn ICU)
قسم العناية المركجة للأورام (Oncology ICU)
قسم العناية المركزة للكلى (Renal ICU / Dialysis ICU)
قسم العناية المركزة ما بعد زراعة الأعضاء (Transplant ICU)
قسم العناية المركزة للنساء الحوامل (Obstetric ICU)
26. إدارة الألم والتخدير (Anesthesia & Pain Management)
قسم التخدير العام (Anesthesiology):
وحدة التخدير للعمليات الجراحية
وحدة التخدير للولادة (Obstetric Anesthesia)
وحدة التخدير لطب الأطفال
وحدة التخدير لجراحة القلب
قسم العلاج التداخلي للألم (Interventional Pain Management):
حقن الفقرات والعمود الفقري
ترددات كهربائية للأعصاب (RF Ablation)
زرع المحفزات العصبية (Spinal Cord Stimulator)
مضخات الألم داخل النخاع (Intrathecal Pumps)
قسم العناية ما بعد التخدير (PACU - Post Anesthesia Care Unit)
قسم العلاج بالأكسجين عالي الضغط (Hyperbaric Oxygen Therapy - HBOT)
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
تاسعاً: المراكز المتخصصة المتكاملة (Centers of Excellence)
هذه تجمع عدة أقسام في وحدة متكاملة:

مركز القلب والأوعية الدموية الشامل (Heart & Vascular Center)
مركز الأورام المتكامل (Comprehensive Cancer Center)
مركز العظام والمفاصل والعمود الفقري (Orthopedic & Spine Center)
مركز العقم وعلاج الإنجاب المتقدم (Advanced Fertility Center)
مركز الأنف والأذن والحنجرة والرأس والرقبة (ENT & Head-Neck Center)
مركز الحوادث والإصابات الكبرى (Trauma Center)
مركز العناية المركزة للحروق (Burn Center)
مركز زراعة الأعضاء (Transplant Center)
مركز العناية بالمسنين (Geriatric Center)
مركز الألم المزمن (Pain Center)
مركز السمنة والتمثيل الغذائي (Bariatric & Metabolic Center)
مركز طب الأطفال (Children's Hospital within Hospital)
مركز الصحة النفسية (Behavioral Health Center)
مركز العيون المتقدم (Eye Institute)
مركز طب الأعصاب والسكتات الدماغية (Neuroscience & Stroke Center)
مركز الأم والجنين (Women & Fetal Center)
عاشراً: أقسام نادرة ومتقدمة جداً (Rare & Super-Specialized)
قسم طب الفضاء والغوص (Space & Dive Medicine)
قسم طب النوم المعقد (Sleep Disorders Center with Polysomnography)
قسم علاج الألم الصرعي المقاوم (Epilepsy Monitoring Unit)
قسم العلاج بالخلايا الجذعية المتقدم (Advanced Stem Cell Therapy)
قسم طب الأجنة الجراحي (Fetal Surgery)
قسم طب الأجنة والتشخيص قبل الولادة (Fetal Medicine Unit)
قسم علاج اضطرابات الحركة العميقة (DBS - Deep Brain Stimulation)
قسم العلاج بالجرعات المشعة النووية (Nuclear Medicine Therapy)
قسم العلاج بالتبريد (Cryotherapy / Cryosurgery)
قسم طب المجهر الضوئي التداخلي (Confocal Laser Endomicroscopy)
قسم طب البصمة الوراثية (Pharmacogenomics)
قسم طب النانو والروبوتات الميكروسكوبية (Nanomedicine)
```
