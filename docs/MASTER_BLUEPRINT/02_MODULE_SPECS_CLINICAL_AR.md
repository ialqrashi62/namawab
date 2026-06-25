# 02 — مواصفات الأقسام السريرية/التشخيصية (P0/P1)

> لكل قسم: الحالة الفعلية + فجوة عالمية (جداول/أزرار/قوائم) + برومنت جاهز + سيناريو عمل + فلو بيانات. القالب في 00.

---
## 4 — Doctor Station (محطة الطبيب) — P0 — L2/L3
**الحالة:** بطاقة مريض (اسم/MRN/عمر/حساسية)، عرض نتائج، وصف دواء، فحص تفاعلات دوائية + حساسية، استدعاء التالي.
**فجوة عالمية (Epic Hyperdrive / Cerner PowerChart):**
- **Problem List** منظّمة (ICD-10/SNOMED) + **Allergies** مُرمّزة + **Medication Reconciliation**.
- **CPOE** (Computerized Provider Order Entry) موحّد: مختبر/أشعة/دواء/استشارة من شاشة واحدة + **Order Sets** + **Quick orders**.
- **Clinical Decision Support (CDS):** تنبيهات جرعة/تفاعل/حساسية/تكرار فحص + best-practice advisories.
- **SOAP / encounter notes** + قوالب تخصص + **dictation/voice**.
- **Flowsheets** (علامات حيوية/نتائج عبر الزمن) + **trending graphs**.
- **In-basket** (نتائج حرجة/رسائل/توقيع طلبات).
- **جداول:** `encounters`, `problems`, `orders`, `order_sets`, `clinical_notes`, `cds_alerts`.
- **أزرار:** New Order · Order Set · Sign Orders · Add Problem · New Note · Reconcile Meds · Refer.
**برومنت جاهز:**
```
أنشئ شاشة "Doctor Station / Encounter" لـEMR: رأس مريض (MRN/عمر/حساسية مُبرزة) + تبويبات
[Problem List, Orders(CPOE), Notes(SOAP), Results/Flowsheet, Meds]. CPOE: نموذج طلب موحّد
(lab/rad/med/consult) مع order sets + توقيع جماعي. CDS: تحقّق تفاعل/حساسية/جرعة عند الطلب يُظهر تنبيهاً
قابلاً للتجاوز مع سبب. كل طلب يُكتب في orders(tenant_id, encounter_id, type, status) + audit. ICD-10/SNOMED
للمشاكل. الواجهة ع/EN RTL، escapeHTML لكل بيانات المريض.
```
**سيناريو:** طبيب يفتح encounter → يضيف مشكلة (ICD) → ينشئ Order Set "Chest Pain" (ECG+Troponin+CXR) → CDS يحذّر من تفاعل → يتجاوز بسبب → يوقّع → الطلبات تُرسَل للمختبر/الأشعة → يكتب note SOAP → يوقّع الزيارة.
**فلو بيانات:** Doctor(UI) → `POST /api/orders` (requireTenantScope) → CDS check → `orders`+`order_items` (tenant_id) → events للمختبر/الأشعة/الصيدلية → `clinical_notes` → `audit_log`. النتائج ترجع عبر `GET /api/encounters/:id/results`.

---
## 5 — Laboratory (المختبر) — P0 — L2/L3
**الحالة:** طلبات + إدخال نتائج + باركود + طباعة تقرير + نطاق طبيعي + abnormal flag.
**فجوة عالمية (Epic Beaker / Cerner PathNet):**
- **تكامل الأجهزة (analyzers)** عبر **HL7 v2 / ASTM** (نتائج تلقائية، لا إدخال يدوي).
- **LOINC** لكل فحص + **specimen management** (sample lifecycle: collected→received→in-process→verified).
- **Auto-verification** + **delta checks** + **critical value** call-back موثّق.
- **QC** (ضبط جودة Levey-Jennings) + **calibration** + **reagent lots**.
- **Microbiology** (cultures/sensitivities/AST) + **TAT** monitoring.
- **جداول:** `lab_orders`, `lab_samples`, `lab_results`, `lab_analyzers`, `lab_qc`, `loinc_map`.
- **أزرار:** Collect · Receive · Run · Verify · Reject Sample · Critical Call · QC Entry.
**برومنت جاهز:**
```
أنشئ LIS: lifecycle العيّنة (Collected→Received→InProcess→Verified→Reported) مع باركود لكل عيّنة،
ربط كل فحص بـLOINC، auto-verification بقواعد (ضمن النطاق + لا delta) وإلا hold للمراجعة، critical value
يفرض call-back موثّق (من/متى)، QC entry + Levey-Jennings. تكامل أجهزة عبر HL7 v2 (واجهة inbound).
جداول lab_orders/lab_samples/lab_results(tenant_id)+audit. ع/EN، escapeHTML.
```
**سيناريو:** سحب عيّنة → باركود → استلام في المختبر → الجهاز يرسل نتيجة (HL7) → auto-verify إن طبيعية، وإلا تُعلّق → فني يراجع/يعتمد → critical → call-back للطبيب موثّق → تقرير.
**فلو بيانات:** Order(Doctor) → `lab_orders` → Collect `POST /api/lab/samples` → Analyzer→HL7 inbound `POST /api/lab/hl7` → `lab_results` (auto-verify rules) → critical→`messaging`+call-back log → `GET /api/print/lab-report/:id` → audit.

---
## 6 — Radiology (الأشعة) — P0 — L2
**الحالة:** طلبات + أنواع + إدخال نتائج + باركود.
**فجوة عالمية (Epic Radiant / Cerner RadNet + PACS):**
- **RIS worklist** (scheduled→arrived→in-progress→completed→reported) + **modality worklist (DICOM MWL)**.
- **PACS** عرض الصور (DICOM) + ربط التقرير بالصورة + **structured reporting** (BI-RADS/Lung-RADS).
- **Dose tracking** (جرعة الإشعاع) + **critical results** notification.
- **Peer review** + **addendum** + **prior comparison**.
- **جداول:** `rad_orders`, `rad_exams`, `rad_reports`, `dicom_studies`, `dose_records`.
- **أزرار:** Schedule · Arrive · Begin Exam · Complete · Report · Sign · Compare Prior · Critical Notify.
**برومنت جاهز:**
```
أنشئ RIS مربوط بـPACS: worklist بحالات (Scheduled→Arrived→InProgress→Completed→Reported)، modality
worklist (DICOM MWL) للأجهزة، عارض صور DICOM (web)، structured reporting بقوالب (BI-RADS)، dose tracking،
critical result alert. جداول rad_orders/rad_exams/rad_reports/dicom_studies(tenant_id). PHI image عبر
endpoint محمي (auth+tenant+لا webroot عام). ع/EN، escapeHTML.
```
**سيناريو:** طلب أشعة → جدولة → وصول المريض → الجهاز يلتقط (MWL) → الصور إلى PACS → أخصائي يكتب تقريراً منظّماً + يقارن السابق → critical→إشعار → توقيع.
**فلو بيانات:** Order → `rad_orders` → schedule → MWL→modality → DICOM→PACS `dicom_studies` → `rad_reports` (structured) → critical→`messaging` → صورة عبر `GET /api/phi-files/:id` (محمي، قائم) → audit.

---
## 7 — Pharmacy (الصيدلية) — P0 — L2
**الحالة:** طابور صرف + باركود وصفة + فاتورة صيدلية + dispense.
**فجوة عالمية (Epic Willow / Cerner PharmNet + Wasfaty):**
- **e-Prescribing** من الطبيب → الصيدلية (لا ورق) + **pharmacist verification**.
- **مخزون دفعات/انتهاء (batch/expiry/FEFO)** + **inventory decrement** عند الصرف + نواقص.
- **Drug interactions/allergy/dose** عند التحقّق + **formulary** + بدائل.
- **Wasfaty/NPHIES** للوصفات المغطّاة + **controlled drugs** (مخدّرات) سجل مزدوج.
- **MAR** ربط (للمنوّمين) + **unit dose** + **IV/TPN**.
- **جداول:** `prescriptions`, `pharmacy_dispense`, `drug_master`, `drug_batches`, `formulary`.
- **أزرار:** Verify · Dispense (scan) · Substitute · Counsel · Return · Controlled Log.
**برومنت جاهز:**
```
أنشئ صيدلية: e-prescribing (طبيب→صيدلي)، pharmacist verification (تفاعل/حساسية/جرعة/formulary)، dispense
بالباركود يخصم من drug_batches بقاعدة FEFO (الأقرب انتهاءً أولاً)، تنبيه نواقص/قرب انتهاء، سجل مزدوج
للمخدّرات، تكامل Wasfaty/NPHIES (gated). جداول prescriptions/pharmacy_dispense/drug_batches(tenant_id)+audit.
ع/EN، escapeHTML، لا كلمة مرور/سرّ مطبوع.
```
**سيناريو:** طبيب يصف → يصل الصيدلية → صيدلي يتحقّق (تفاعل) → يصرف بمسح الباركود → الخصم من أقرب دفعة انتهاءً → فاتورة/تغطية تأمين → تثقيف المريض.
**فلو بيانات:** Rx(Doctor) → `prescriptions` → `GET /api/pharmacy/queue` → verify → `POST /api/pharmacy/dispense` → `pharmacy_dispense` + decrement `drug_batches` (FEFO) → invoice/coverage(NPHIES gated) → audit.

---
## 12 — Nursing (التمريض) — P0 — L2
**الحالة:** بطاقة علامات حيوية + تقييم تمريضي.
**فجوة عالمية (Epic/Cerner nursing):**
- **MAR** (Medication Administration Record) — إعطاء الدواء بالباركود (5 rights) + رفض/تأخير موثّق.
- **Care Plans** + **assessments** (admission/shift) + **scales** (Braden قرح/Morse سقوط/MEWS تدهور).
- **Intake/Output (I/O)** + **fluid balance** + **wound care**.
- **Handover (ISBAR)** + **task list** + **rounding**.
- **جداول:** `nursing_assessments`, `mar`, `care_plans`, `vitals`, `io_records`, `nursing_scores`.
- **أزرار:** Vitals · Administer Med (scan) · Assessment · Care Plan · I/O · Handover.
**برومنت جاهز:**
```
أنشئ تمريض: MAR بإعطاء دواء بالباركود (تحقّق 5 rights: مريض/دواء/جرعة/طريق/وقت) مع توثيق رفض/تأخير،
care plans + assessments (admission/shift) + scales (Braden/Morse/MEWS) مع تنبيه عند تجاوز العتبة، I/O
وميزان السوائل، handover ISBAR. جداول mar/care_plans/vitals/nursing_assessments(tenant_id)+audit. ع/EN.
```
**سيناريو:** ممرضة تسجّل علامات حيوية → MEWS مرتفع → تنبيه → تقييم → MAR: مسح سوار المريض + الدواء (5 rights) → إعطاء/توثيق → handover ISBAR نهاية الوردية.
**فلو بيانات:** Nurse(UI) → `vitals`/`POST /api/nursing/assessment` → scores→alert → MAR `POST /api/nursing/mar` (barcode verify) → `mar` decrement link الصيدلية → handover → audit.

---
## 22 — Emergency (الطوارئ) — P0 — L2/L3
**الحالة:** فرز + visits + نقل/خروج + خرائط أسرّة + ESI level.
**فجوة عالمية (Epic ASAP / Cerner FirstNet):**
- **Triage ESI/CTAS** (5 مستويات) + **acuity** + **time-to-provider**.
- **ED Tracking Board** حيّ (موقع/حالة/طبيب/ممرضة/مؤقّتات) + **LWBS** (غادر بلا علاج).
- **Rapid orders/protocols** (chest pain/stroke/sepsis) + **disposition** (admit/discharge/transfer).
- **EMS/ambulance** inbound + **bed assignment** + **boarding**.
- **جداول:** `er_visits`, `triage`, `er_tracking`, `er_disposition`.
- **أزرار:** Triage · Assign Bed · Start Care · Order Protocol · Disposition · Transfer to Inpatient · Discharge.
**برومنت جاهز:**
```
أنشئ ED: triage ESI (1-5) مع علامات حيوية + شكوى، tracking board حيّ (سرير/حالة/طبيب/مؤقّت time-to-provider
+ LOS)، بروتوكولات سريعة (sepsis/stroke/chest-pain)، disposition (admit→ربط ADT / discharge / transfer)،
استقبال إسعاف. جداول er_visits/triage/er_tracking(tenant_id)+audit. تنبيه critical. ع/EN، escapeHTML.
```
**سيناريو:** وصول مريض → triage ESI-2 → تخصيص سرير → tracking board → بروتوكول sepsis → طبيب → disposition: تنويم → نقل إلى ADT (سرير) أو خروج.
**فلو بيانات:** Arrival → `POST /api/er/triage` → `er_visits`+`triage`(ESI) → tracking board `GET /api/er/board` → orders/protocol → `er_disposition` → admit→`POST /api/adt/admit` أو discharge → audit.

---
## 23 — Inpatient ADT (التنويم) — P0 — L2/L3
**الحالة:** قبول/نقل/خروج + census + خرائط أسرّة + diagnosis.
**فجوة عالمية:**
- **Live bed board** (حالة السرير: شاغر/مشغول/تنظيف/محجوز) + **occupancy** + **LOS**.
- **Admission→Transfer→Discharge** workflow + **discharge planning** + **discharge summary** + **medication reconciliation عند الخروج**.
- ربط **Nursing/Pharmacy/Dietary/Housekeeping** بحالة السرير.
- **جداول:** `admissions`, `beds`, `bed_status`, `transfers`, `discharges`, `ward_census`.
- **أزرار:** Admit · Assign Bed · Transfer · Discharge · Bed Clean · Discharge Summary.
**برومنت جاهز:**
```
أنشئ ADT: bed board حيّ (Vacant/Occupied/Cleaning/Reserved) + occupancy% + LOS، workflow Admit→Transfer→
Discharge مع discharge planning + summary + med reconciliation، ربط حالة السرير بالتمريض/التغذية/التنظيف.
جداول admissions/beds/transfers/discharges(tenant_id)+audit. ع/EN، escapeHTML.
```
**سيناريو:** قبول من الطوارئ → تخصيص سرير (الحالة→مشغول) → نقل بين الأجنحة → discharge planning → خروج → summary + med reconciliation → السرير→تنظيف→شاغر.
**فلو بيانات:** ER/OPD → `POST /api/adt/admit` → `admissions`+`beds`(status) → `transfers` → `discharges`+summary → bed→cleaning event(housekeeping) → census `GET /api/adt/census` → audit.

---
## 24 — ICU (العناية المركزة) — P0 — L2
**الحالة:** مرضى + مراقبة أساسية.
**فجوة عالمية:**
- **Flowsheets** عالية التردد (علامات/أجهزة/أدوية وريدية) + **ventilator** params + **I/O دقيق**.
- **Severity scoring** (APACHE II / SOFA / GCS) محسوب + trending.
- **Drips/infusions** (مضخّات) + **protocols** (sedation/glucose) + **device integration**.
- **جداول:** `icu_flowsheets`, `icu_scores`, `ventilator_records`, `infusions`.
- **أزرار:** Flowsheet Entry · Calc Score · Ventilator · Start Drip · Protocol.
**برومنت جاهز:**
```
أنشئ ICU: flowsheet زمني عالي التردد (علامات/ventilator/infusions/I-O)، حساب APACHE-II/SOFA/GCS تلقائياً
مع trending، إدارة drips بمضخّات + بروتوكولات (sedation/glucose). جداول icu_flowsheets/icu_scores(tenant_id)+
audit. ع/EN، escapeHTML.
```
**سيناريو:** قبول ICU → flowsheet كل ساعة → النظام يحسب SOFA → تدهور → تنبيه → بروتوكول → توثيق drips/ventilator.
**فلو بيانات:** Admit ICU → `icu_flowsheets` (high-freq) → compute `icu_scores` → alert → `infusions`/`ventilator_records` → audit.

---
## 42 — OB/GYN (النساء والتوليد) — P1 — L2
**الحالة:** حمل (GPAL) + متابعة antenatal + لوحات مختبر للحمل.
**فجوة عالمية (Epic Stork):**
- **Antenatal record** (زيارات/ضغط/وزن/ارتفاع الرحم/نبض الجنين) + **risk stratification**.
- **Ultrasound growth charts** + **EDD calculators** + **partogram** (مخطّط الولادة).
- **Delivery/L&D record** + **neonatal** (Apgar/وزن) + **postpartum**.
- **جداول:** `pregnancies`, `antenatal_visits`, `deliveries`, `neonatal`, `ob_risk`.
- **أزرار:** New Pregnancy · Antenatal Visit · Partogram · Record Delivery · Neonatal.
**برومنت جاهز:**
```
أنشئ OB/GYN: سجل حمل (GPAL + EDD)، زيارات antenatal (ضغط/وزن/SFH/FHR) مع risk stratification + تنبيه،
ultrasound growth، partogram للولادة، delivery record + neonatal (Apgar). جداول pregnancies/antenatal_visits/
deliveries(tenant_id)+audit. ع/EN، escapeHTML.
```
**سيناريو:** تسجيل حمل (GPAL) → زيارات antenatal دورية → ضغط مرتفع → high-risk flag → ولادة (partogram) → delivery record + neonatal Apgar → postpartum.
**فلو بيانات:** `POST /api/obgyn/pregnancy` → `pregnancies` → `antenatal_visits` (risk rules→alert) → `deliveries`+`neonatal` → audit.

---
## 19 — Surgery & Pre-Op (العمليات) — P1 — L2
**الحالة:** قائمة عمليات + pre-op checklist + إجراءات + موافقات.
**فجوة عالمية (Epic OpTime / Cerner SurgiNet):**
- **OR scheduling** (غرفة/جرّاح/تخدير/وقت) + **block time** + **utilization**.
- **WHO Surgical Safety Checklist** (sign-in/time-out/sign-out) + **counts** (إسفنج/أدوات).
- **Anesthesia record** + **intra-op** + **PACU** (إفاقة) + **implant tracking** + استهلاك.
- **جداول:** `or_schedule`, `surgeries`, `surgical_checklist`, `anesthesia`, `pacu`, `or_consumption`.
- **أزرار:** Schedule OR · Pre-Op Checklist · Time-Out · Record Procedure · Counts · PACU · Implants.
**برومنت جاهز:**
```
أنشئ Surgery/OR: جدولة غرف (غرفة/جرّاح/تخدير/فترة) + utilization، WHO checklist (sign-in/time-out/sign-out)
+ counts الأدوات، anesthesia record + intra-op + PACU، تتبّع implants واستهلاك (يخصم المخزون). جداول
or_schedule/surgeries/surgical_checklist(tenant_id)+audit. ع/EN، escapeHTML.
```
**سيناريو:** جدولة عملية (غرفة/فريق) → pre-op checklist → time-out (WHO) → تنفيذ + counts → PACU → تقرير عملية + استهلاك يخصم المخزون.
**فلو بيانات:** `POST /api/or/schedule` → `or_schedule` → checklist → `surgeries`+`anesthesia` → counts → `pacu` → `or_consumption`→inventory decrement → audit.

---
## 20 — Blood Bank (بنك الدم) — P1 — L2
**الحالة:** crossmatch + وحدات + نقل + خيارات فصيلة/مكوّن.
**فجوة عالمية:**
- **Donor→Unit lifecycle** (تبرّع→فحص→تصنيف→تخزين→صلاحية→صرف) + **ABO/Rh + antibody screen**.
- **Crossmatch** + **compatibility** + **transfusion reaction** reporting + **lookback/recall**.
- **Temperature/storage** monitoring + **inventory by component** (RBC/plasma/platelets).
- **جداول:** `blood_donors`, `blood_units`, `crossmatch`, `transfusions`, `transfusion_reactions`.
- **أزرار:** Register Donor · Screen Unit · Crossmatch · Issue · Transfuse · Report Reaction · Recall.
**برومنت جاهز:**
```
أنشئ Blood Bank: دورة الوحدة (Donated→Screened→Typed→Stored→Issued) مع ABO/Rh+antibody، crossmatch +
compatibility check قبل الصرف، transfusion record + reaction reporting + lookback/recall، مخزون حسب المكوّن
+ صلاحية + حرارة. جداول blood_units/crossmatch/transfusions(tenant_id)+audit. ع/EN، escapeHTML.
```
**سيناريو:** طلب دم → crossmatch مع وحدات متوافقة → صرف الوحدة المتوافقة → نقل + مراقبة تفاعل → توثيق/إبلاغ تفاعل إن وُجد.
**فلو بيانات:** `POST /api/bloodbank/crossmatch` → `crossmatch`(ABO/Rh) → issue `blood_units`(status) → `transfusions` → reaction→`transfusion_reactions`+recall → audit.

---
## 31 — Medical Records (السجلات الطبية) — P0 — L1/L2
**الحالة:** أساس سجلات + تعديلات (amendments قائمة من العمل الأمني).
**فجوة عالمية (HIM):**
- **Unified longitudinal record** (كل اللقاءات/النتائج/الصور/الملاحظات).
- **Coding** (ICD-10-AM/SNOMED/CPT) + **DRG** + **deficiency tracking** (نقص التوثيق).
- **Release of Information (ROI)** + **retention/purge** policy + **chart amendments** (قائم) + **break-glass** access.
- **جداول:** `medical_records`, `coding`, `roi_requests`, `record_amendments`, `record_access_log`.
- **أزرار:** View Chart · Code Encounter · ROI Request · Amend · Deficiency · Break-Glass.
**برومنت جاهز:**
```
أنشئ HIM: سجل طولي موحّد للمريض (لقاءات/نتائج/صور/ملاحظات)، ترميز ICD-10/SNOMED + deficiency tracking،
ROI (طلب نسخة سجل بموافقة)، amendments (قائم) + audit وصول كامل + break-glass موثّق. جداول medical_records/
coding/roi_requests(tenant_id)+RLS+audit. ع/EN، escapeHTML.
```
**سيناريو:** مرمّز يفتح لقاءً مكتملاً → يضيف ICD/CPT → deficiency إن نقص توقيع → ROI: مريض يطلب نسخة → موافقة → إصدار موثّق.
**فلو بيانات:** Encounter complete → `coding` → deficiency queue → ROI `POST /api/him/roi` → access logged `record_access_log` → audit.

> بقية الأقسام (التشغيل/المالية/الإدارة/التخصصية) في `03_MODULE_SPECS_OPERATIONS_ADMIN_AR.md`.
