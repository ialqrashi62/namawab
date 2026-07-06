# كتالوج القوائم المرجعية (Reference Data Catalog) — NamaMedical / Jumanasoft
## GATE 5 — وثيقة تخطيط معتمدة (لا DDL — لا لمس إنتاج)

> **الغرض:** حصر كل القوائم المرجعية (Lookups / Value Sets) المطلوبة لتشغيل نظام HIS/EHR سعودي متعدد المستأجرين، مع القيم المقترحة (عربي/إنجليزي)، وسياسة التخصيص لكل مستأجر، وأثر كل قائمة على التقارير والفوترة، وربطها بالمعايير الوطنية والدولية (NPHIES / FHIR R4 / HL7 v2 / SNOMED CT / ICD-10-AM / SBS / UCUM / DICOM / ISO).
>
> **التاريخ:** 2026-07-06 — **الحالة:** مسودة معتمدة للتخطيط (Gate 5) — **النطاق:** مرجعي فقط، لا يتضمن أسراراً ولا بيانات مرضى.

---

## 0. منهجية الحوكمة وقواعد التخصيص

### 0.1 مستويات القفل (Lock Levels)

| المستوى | الوصف | أمثلة | من يعدّل؟ |
|---|---|---|---|
| **L0 — مقفول نظامياً (System-Locked)** | قيم يفرضها معيار وطني/دولي؛ أي تعديل يكسر الامتثال أو التبادل | ESI، administrative-gender، أنواع مطالبات NPHIES، أنواع فواتير ZATCA، فصائل الدم | لا أحد (تحديث بإصدار نظام فقط) |
| **L1 — قابل للتمديد (Extendable)** | القيم القياسية مقفولة + يُسمح للمستأجر بإضافة قيم محلية بشرط Mapping إلزامي لقيمة قياسية | أنواع العينات، طرق الإعطاء، أسباب الإلغاء | Super Admin للمستأجر + Mapping إجباري |
| **L2 — قابل للتخصيص الكامل (Tenant-Customizable)** | قوائم تشغيلية داخلية لا تعبر حدود المنشأة | أسماء العنابر، فئات الصيانة الفرعية، قوالب الوجبات | Admin المستأجر |
| **L3 — مركزي SaaS** | يديره مشغّل المنصة (Jumanasoft) لكل المستأجرين | خطط الاشتراك، أنواع المنشآت الـ17 | مشغّل المنصة فقط |

### 0.2 قواعد عرضية تسري على كل القوائم

| القاعدة | التفصيل |
|---|---|
| ثنائية اللغة | كل قيمة لها `name_ar` + `name_en` إلزامياً؛ العرض حسب لغة الواجهة (RTL/LTR) |
| عدم الحذف | القيم لا تُحذف بل تُعطَّل (`is_active=false`) حفاظاً على السجلات التاريخية والتدقيق |
| Mapping إلزامي | أي قيمة تعبر إلى NPHIES/ZATCA/HL7 يجب أن تحمل `standard_code` + `code_system_uri` |
| عزل المستأجر | جداول القيم المخصصة خاضعة لـ RLS بـ `tenant_id` أسوة بالـ150 سياسة FORCE القائمة |
| الإصدار | كل قائمة لها `version` و`effective_date` لدعم تغيّر أكواد NPHIES/SBS السنوية |
| التدقيق | كل تعديل قيمة يُسجَّل في سجل التدقيق (من/متى/قبل/بعد) |

---

## 1. المجموعة A — هوية المريض والتسجيل (MPI)

### 1.1 أنواع وثائق الهوية (Identity Document Types)

| # | عربي | English | كود مقترح | Mapping معياري |
|---|---|---|---|---|
| 1 | هوية وطنية | National ID | NI | HL7 v2-0203 `NI` — NPHIES identifier-type `NI` (نظام: `http://nphies.sa/identifier/nationalid`) |
| 2 | إقامة | Iqama / Resident Permit | PRC | v2-0203 `PRC` — NPHIES `iqama` |
| 3 | جواز سفر | Passport | PPN | v2-0203 `PPN` |
| 4 | رقم حدود | Border Number | BN | NPHIES KSA extension `BN` |
| 5 | هوية خليجية | GCC ID | GCC | NPHIES KSA `GCC` |
| 6 | تأشيرة زيارة | Visit Visa | VS | v2-0203 `VS` |
| 7 | رقم مؤقت لمولود | Newborn Temporary MRN | NB-TMP | داخلي — يُستبدل عند إصدار الهوية |
| 8 | مجهول الهوية (طوارئ) | Unidentified (John/Jane Doe) | UNK | داخلي + FHIR `data-absent-reason` |

- **قابلة للتخصيص؟** L0 (القيم 1–6 مقفولة لأنها شرط أهلية NPHIES) + L1 للقيم الداخلية 7–8.
- **أثر التقارير:** نعم — تقارير وزارة الصحة تفصل سعودي/مقيم/زائر؛ إحصاء مجهولي الهوية مؤشر طوارئ.
- **أثر الفوترة:** حرج — نوع الهوية يحدد مسار الأهلية NPHIES ونوع الدافع (حكومي/تأمين/نقدي).

### 1.2 الجنس الإداري (Administrative Gender)

| # | عربي | English | كود | Mapping |
|---|---|---|---|---|
| 1 | ذكر | Male | male | FHIR `administrative-gender#male` |
| 2 | أنثى | Female | female | FHIR `administrative-gender#female` |
| 3 | غير محدد | Undetermined | unknown | FHIR `unknown` — NPHIES KSA extension `ksa-administrative-gender` (حالات المواليد غير المحددة) |

- **قابلة للتخصيص؟** L0 مقفولة بالكامل (إلزام FHIR/NPHIES).
- **أثر التقارير:** نعم — كل التقارير الديموغرافية والوزارية. **أثر الفوترة:** نعم — التحقق من ملاءمة الخدمة للجنس (rejection edit في NPHIES).

### 1.3 الحالة الاجتماعية (Marital Status)

| # | عربي | English | كود | Mapping (FHIR v3-MaritalStatus) |
|---|---|---|---|---|
| 1 | أعزب | Never Married | S | `S` |
| 2 | متزوج | Married | M | `M` |
| 3 | مطلق | Divorced | D | `D` |
| 4 | أرمل | Widowed | W | `W` |
| 5 | غير معروف | Unknown | UNK | `UNK` |

- L0 — **تقارير:** ديموغرافية/اجتماعية. **فوترة:** غير مباشر (تبعية التأمين للزوج).

### 1.4 الجنسية (Nationality)

- **المصدر:** قائمة ISO 3166-1 كاملة (alpha-2/alpha-3) مع أسماء عربية معتمدة (SA السعودية، EG مصر، PK باكستان...).
- **قابلة للتخصيص؟** L0 للأكواد + L2 لترتيب "الأكثر استخداماً" لكل مستأجر.
- **تقارير:** نعم (تقارير MOH حسب الجنسية). **فوترة:** نعم (أهلية الضمان الصحي للمقيمين). **Mapping:** FHIR `patient-nationality` extension + ISO 3166.

### 1.5 صلة القرابة / جهة الاتصال (Relationship)

| # | عربي | English | Mapping (FHIR v2-0131 / v3-RoleCode) |
|---|---|---|---|
| 1 | الشخص نفسه | Self | `self` |
| 2 | زوج/زوجة | Spouse | `SPS` |
| 3 | أب | Father | `FTH` |
| 4 | أم | Mother | `MTH` |
| 5 | ابن/ابنة | Child | `CHD` |
| 6 | أخ/أخت | Sibling | `SIB` |
| 7 | ولي أمر | Guardian | `GUARD` |
| 8 | أخرى | Other | `O` |

- L1 — **تقارير:** لا. **فوترة:** نعم — علاقة المشترك بالتأمين (subscriber relationship) في Coverage NPHIES: `self/spouse/child/parent/other`.

### 1.6 فصيلة الدم (Blood Group)

| القيم | Mapping |
|---|---|
| A+ ، A- ، B+ ، B- ، AB+ ، AB- ، O+ ، O- ، غير معروف | SNOMED CT (مثل `278149003` A+ ، `278152006` B+ ...) + HL7 v2 OBX |

- L0 — **تقارير:** بنك الدم وسلامة نقل الدم. **فوترة:** لا. (SafetyGate — لا تُدخل يدوياً في بنك الدم إلا بنتيجة مخبرية).

### 1.7 اللغة والديانة

- **اللغة:** ISO 639-1 (ar, en, ur, tl, hi...) — L0 أكواد + L2 ترتيب. أثرها: تواصل المريض وبوابة المرضى.
- **الديانة:** قائمة FHIR v3-ReligiousAffiliation مختصرة (مسلم/مسيحي/أخرى/يفضل عدم الإفصاح) — L1، أثر تشغيلي (وجبات/غسل الموتى) لا فوتري.

---

## 2. المجموعة B — الزيارات والمواعيد والتدفق

### 2.1 أنواع الزيارة / اللقاء (Encounter Class)

| # | عربي | English | كود | Mapping (HL7 v3-ActCode — يعتمده NPHIES) |
|---|---|---|---|---|
| 1 | عيادة خارجية | Ambulatory / OPD | AMB | `AMB` |
| 2 | طوارئ | Emergency | EMER | `EMER` |
| 3 | تنويم | Inpatient | IMP | `IMP` |
| 4 | إقامة قصيرة / يوم واحد | Short Stay / Daycase | SS | `SS` |
| 5 | رعاية منزلية | Home Health | HH | `HH` |
| 6 | طب عن بعد | Virtual / Telemedicine | VR | `VR` |
| 7 | تحت الملاحظة | Observation | OBSENC | `OBSENC` |

- L0 — **تقارير:** كل الإحصاءات التشغيلية تُفصَل حسب نوع الزيارة. **فوترة:** حرج — `Encounter.class` إلزامي في مطالبة NPHIES ويحدد subType (`ip/op/emr`).

### 2.2 حالة الموعد (Appointment Status)

| القيم (عربي/EN) | Mapping (FHIR appointmentstatus) |
|---|---|
| مقترح proposed، محجوز booked، وصل arrived، سُجّل وصوله checked-in، اكتمل fulfilled، ملغى cancelled، لم يحضر noshow، قائمة انتظار waitlist | أكواد FHIR بنفس الاسم |

- L0 للحالات + L1 لأسباب الإلغاء (2.3). **تقارير:** معدل عدم الحضور no-show KPI جودة. **فوترة:** غير مباشر (لا فاتورة بلا fulfilled/arrived).

### 2.3 أسباب إلغاء الموعد (Cancellation Reasons)

| أمثلة القيم | Mapping |
|---|---|
| طلب المريض، اعتذار الطبيب، خطأ حجز، تحويل لطوارئ، وفاة، ظروف تشغيلية للمنشأة، تأخر أهلية التأمين | FHIR `appointment-cancellation-reason` (pat, prov, maint...) |

- L1 — **تقارير:** نعم (تحليل أسباب الإلغاء). **فوترة:** لا.

### 2.4 مستوى الفرز (Triage Acuity — ESI)

| # | عربي | English | كود | Mapping |
|---|---|---|---|---|
| 1 | إنعاش فوري | Resuscitation | ESI-1 | ESI v4 — يُرسل كـ`triage-category` في ملف الطوارئ |
| 2 | طارئ جداً | Emergent | ESI-2 | ESI v4 |
| 3 | عاجل | Urgent | ESI-3 | ESI v4 |
| 4 | أقل إلحاحاً | Less Urgent | ESI-4 | ESI v4 |
| 5 | غير عاجل | Non-Urgent | ESI-5 | ESI v4 |

- **L0 مقفولة (SafetyGate)** — ممنوع إضافة/تعديل مستويات. **تقارير:** مؤشرات الطوارئ (Door-to-Doctor حسب ESI). **فوترة:** نعم — مستوى الفرز يبرر رسوم الطوارئ في المطالبة.

### 2.5 مصدر القبول ونوعه (Admission Source / Type)

| القوائم | القيم المقترحة | Mapping |
|---|---|---|
| مصدر القبول | من الطوارئ، من العيادات، تحويل من منشأة أخرى، حجز مسبق (elective)، ولادة داخل المنشأة | FHIR `admit-source` (emd, outp, hosp-trans, born...) |
| نوع القبول | اختياري Elective، عاجل Urgent، طارئ Emergency، ولادة Newborn | HL7 v2-0007 |

- L1 — **تقارير:** إشغال وإحصاء ADT. **فوترة:** نعم (encounter في المطالبة).

### 2.6 وجهة الخروج (Discharge Disposition)

| # | عربي | English | Mapping (FHIR discharge-disposition / HL7 v2-0112) |
|---|---|---|---|
| 1 | خروج للمنزل | Home | `home` |
| 2 | تحويل لمستشفى آخر | Transfer to acute facility | `other-hcf` |
| 3 | خروج ضد النصيحة الطبية | DAMA / AMA | `aadvice` |
| 4 | وفاة | Deceased | `exp` |
| 5 | هروب / مغادرة دون إذن | Absconded / LWBS | `oth` + كود داخلي |
| 6 | رعاية منزلية بمتابعة | Home with home-health | `hosp` (حسب الخريطة) |
| 7 | مركز تأهيل / رعاية ممتدة | Rehab / Long-term care | `rehab` / `long` |

- L0+L1 — **تقارير:** حرجة (وفيات، DAMA، معدل إعادة القبول). **فوترة:** نعم — إلزامية في مطالبات التنويم NPHIES.

---

## 3. المجموعة C — الأوامر السريرية CPOE

### 3.1 أنواع الأوامر (Order Categories)

| # | عربي | English | كود | Mapping |
|---|---|---|---|---|
| 1 | أمر دوائي | Medication Order | MED | FHIR `MedicationRequest` |
| 2 | فحص مختبري | Laboratory Order | LAB | FHIR `ServiceRequest` category `laboratory-procedure` (SNOMED 108252007) |
| 3 | فحص أشعة | Imaging Order | RAD | ServiceRequest category `imaging` (363679005) |
| 4 | إجراء / عملية | Procedure Order | PROC | ServiceRequest `387713003` |
| 5 | استشارة تخصصية | Consultation | CONS | ServiceRequest `consult` |
| 6 | أمر تغذية | Diet / Nutrition Order | DIET | FHIR `NutritionOrder` |
| 7 | محاليل وريدية | IV Fluids Order | IV | MedicationRequest (route IV) |
| 8 | أمر تمريضي | Nursing Order | NURS | ServiceRequest category تمريضي |
| 9 | نقل دم | Blood Transfusion Order | BLOOD | ServiceRequest + بروتوكول بنك الدم |
| 10 | فحص وظيفي (ECG/EEG/PFT/تنظير) | Functional Diagnostics | FUNC | ServiceRequest |

- L1 (الفئات مقفولة، الكتالوج الفرعي لكل فئة قابل للتمديد). **تقارير:** حجم أوامر + إغلاق حلقة النتائج (Gate 3). **فوترة:** حرج — كل أمر يولّد بند خدمة SBS.

### 3.2 حالة الأمر وأولويته

| القائمة | القيم | Mapping |
|---|---|---|
| حالة الأمر | مسودة draft، فعّال active، معلّق on-hold، مكتمل completed، ملغى revoked، خطأ إدخال entered-in-error | FHIR `request-status` |
| أولوية الأمر | روتيني routine، عاجل urgent، فوري stat، أقرب فرصة asap | FHIR `request-priority` (STAT = SafetyGate تنبيه) |
| نيّة الأمر | أمر أصلي order، خطة plan، اقتراح proposal | FHIR `request-intent` |

- L0 — **تقارير:** TAT (زمن الاستجابة) حسب الأولوية. **فوترة:** STAT قد يحمل رسوم استعجال.

---

## 4. المجموعة D — المختبر LIS

### 4.1 أنواع العينات (Specimen Types)

| # | عربي | English | HL7 v2-0487 | SNOMED CT |
|---|---|---|---|---|
| 1 | دم كامل | Whole Blood | BLD | 119297000 |
| 2 | مصل | Serum | SER | 119364003 |
| 3 | بلازما | Plasma | PLAS | 119361006 |
| 4 | بول | Urine | UR | 122575003 |
| 5 | سائل نخاعي | CSF | CSF | 258450006 |
| 6 | بصاق | Sputum | SPT | 119334006 |
| 7 | براز | Stool | STL | 119339001 |
| 8 | مسحة | Swab | SWB | 257261003 |
| 9 | نسيج | Tissue | TISS | 119376003 |
| 10 | سائل جنبي/بريتوني | Body Fluid | FLU | 258442002 |

- L1 — **تقارير:** معدلات رفض العينات (جودة). **فوترة:** غير مباشر (نوع العينة يحدد صلاحية الفحص).

### 4.2 أسباب رفض العينة (Specimen Rejection Reasons)

| أمثلة | Mapping |
|---|---|
| تحلل دموي Hemolyzed، كمية غير كافية QNS، أنبوب خاطئ، بلا ملصق/ملصق خاطئ، تأخر النقل، عينة متجلطة | HL7 v2-0490 (EX, QS, RB...) |

- L1 — **تقارير:** KPI جودة مختبر إلزامي CBAHI. **فوترة:** لا (يمنع الفوترة عن فحص مرفوض).

### 4.3 حالة النتيجة وأعلامها

| القائمة | القيم | Mapping |
|---|---|---|
| حالة التقرير | مسجل registered، أولي preliminary، نهائي final، معدَّل amended، مصحَّح corrected، ملغى cancelled | FHIR `diagnostic-report-status` |
| أعلام النتيجة | طبيعي N، مرتفع H، منخفض L، حرج مرتفع HH، حرج منخفض LL، غير طبيعي A | HL7 v2-0078 — القيم الحرجة تفعّل مسار التبليغ (SafetyGate + Gate 3 ack) |

- L0 — **تقارير:** سجل القيم الحرجة (Critical Values Log) CBAHI. **فوترة:** الفوترة عند "نهائي" فقط حسب السياسة.

---

## 5. المجموعة E — الأشعة RIS

### 5.1 طرائق التصوير (Modalities)

| # | عربي | English | Mapping (DICOM Modality) |
|---|---|---|---|
| 1 | أشعة سينية | X-Ray / Computed Radiography | CR / DX |
| 2 | أشعة مقطعية | CT | CT |
| 3 | رنين مغناطيسي | MRI | MR |
| 4 | موجات فوق صوتية | Ultrasound | US |
| 5 | تصوير الثدي | Mammography | MG |
| 6 | طب نووي | Nuclear Medicine | NM |
| 7 | قسطرة/تنظير وعائي | Angiography | XA |
| 8 | تنظير تألقي | Fluoroscopy | RF |
| 9 | أشعة أسنان بانورامية | Dental Panoramic | PX |

- L0 (أكواد DICOM) — **تقارير:** إنتاجية أجهزة + جرعات إشعاع. **فوترة:** نعم — كل طريقة تربط بأكواد SBS مختلفة.
- قوائم فرعية: **حالة الدراسة** (مجدولة/قيد الالتقاط/بانتظار التقرير/تقرير نهائي/معدَّل — تتبع FHIR ImagingStudy + DiagnosticReport)، **مواد التباين** (بدون/فموي/وريدي — SafetyGate حساسية التباين وكرياتينين).

---

## 6. المجموعة F — الأدوية والصيدلية

### 6.1 طرق الإعطاء (Routes of Administration)

| # | عربي | English | كود | Mapping (SNOMED CT Route) |
|---|---|---|---|---|
| 1 | فموي | Oral | PO | 26643006 |
| 2 | وريدي | Intravenous | IV | 47625008 |
| 3 | عضلي | Intramuscular | IM | 78421000 |
| 4 | تحت الجلد | Subcutaneous | SC | 34206005 |
| 5 | تحت اللسان | Sublingual | SL | 37839007 |
| 6 | شرجي | Rectal | PR | 37161004 |
| 7 | موضعي جلدي | Topical / Cutaneous | TOP | 6064005 |
| 8 | استنشاق | Inhalation | INH | SNOMED مسار تنفسي (Respiratory tract route) |
| 9 | عيني | Ophthalmic | OPH | 54485002 |
| 10 | أذني | Otic | OT | 10547007 |
| 11 | أنفي | Nasal | NAS | 46713006 |
| 12 | مهبلي | Vaginal | PV | 16857009 |
| 13 | أنبوب تغذية | Via NG/PEG Tube | NG | SNOMED enteral route |
| 14 | فوق الجافية | Epidural | EPI | SNOMED epidural route |

- L1 (القياسي مقفول + محلي بـMapping) — **تقارير:** أخطاء دوائية حسب الطريقة. **فوترة:** نعم — NPHIES pharmacy claim يتطلب route؛ طرق التحضير الوريدي قد تضيف رسوم تحضير.

### 6.2 تكرار الجرعات (Dose Frequency)

| # | عربي | English | كود | Mapping (FHIR Timing) |
|---|---|---|---|---|
| 1 | مرة يومياً | Once daily | OD/QD | frequency=1, period=1d |
| 2 | مرتان يومياً | Twice daily | BID | 2/1d |
| 3 | ثلاث مرات يومياً | Three times daily | TID | 3/1d |
| 4 | أربع مرات يومياً | Four times daily | QID | 4/1d |
| 5 | كل 4/6/8/12 ساعة | q4h/q6h/q8h/q12h | qXh | period=X h |
| 6 | عند اللزوم | As needed | PRN | asNeeded=true (+سبب SNOMED) |
| 7 | جرعة فورية واحدة | Immediately, once | STAT | priority=stat, count=1 |
| 8 | قبل النوم | At bedtime | HS | when=HS |
| 9 | قبل/بعد الوجبات | AC / PC | AC/PC | when=AC/PC |
| 10 | أسبوعياً / شهرياً | Weekly / Monthly | QW/QM | period=1wk/1mo |

- L1 — **تقارير:** eMAR الالتزام بمواعيد الإعطاء. **فوترة:** يحدد الكمية الكلية (QtyTotal في Rx Refill الموجود).

### 6.3 الأشكال الصيدلانية ووحدات الجرعة

| القائمة | أمثلة | Mapping |
|---|---|---|
| الشكل الصيدلاني | قرص Tablet، كبسولة Capsule، شراب Syrup، حقن Injection، مرهم Ointment، قطرة Drops، لبوس Suppository، بخاخ Inhaler | FHIR `medication-form` (SNOMED dose forms) — NPHIES يعتمد قاموس SFDA للأدوية المسجلة |
| وحدة الجرعة | mg, g, mcg, mL, IU, mmol, قطرة drop, بخة puff | **UCUM** إلزامي |
| كتالوج الأدوية | SFDA Drug Code (الكود الوطني) + GTIN | إلزامي لمطالبات صيدلية NPHIES |

- L0 للوحدات (UCUM) + L1 للكتالوج — **فوترة:** حرجة (تسعيرة الدواء بالكود الوطني).

### 6.4 حالة الوصفة (Prescription Status)

قيم FHIR `medicationrequest-status`: فعّالة active، معلّقة on-hold، ملغاة cancelled، مكتملة completed، موقوفة stopped، مسودة draft. — L0. **تقارير:** وصفات موقوفة/معلقة (سلامة دوائية). **فوترة:** الصرف على active فقط.

---

## 7. المجموعة G — الحساسية والتنبيهات السريرية

### 7.1 تصنيف الحساسية

| القائمة | القيم | Mapping (FHIR AllergyIntolerance) |
|---|---|---|
| الفئة | دواء medication، غذاء food، بيئة environment، مواد حيوية biologic | `category` |
| الشدة (رد الفعل) | خفيفة mild، متوسطة moderate، شديدة severe | `reaction.severity` |
| الحرجية | منخفضة low، عالية high، تعذر التقييم unable-to-assess | `criticality` |
| حالة التحقق | مؤكدة confirmed، غير مؤكدة unconfirmed، منفية refuted، خطأ entered-in-error | `verificationStatus` |
| المادة المسببة | بنسلين، سلفا، أسبرين، NSAIDs، لاتكس، يود/تباين، فول سوداني، بيض، مأكولات بحرية... | SNOMED CT substance (مثل بنسلين 373270004) |
| مظاهر التفاعل | طفح، وذمة، صدمة تأقية Anaphylaxis، ضيق تنفس، غثيان | SNOMED CT (تأق 39579001) |

- L0 للفئات/الشدة + L1 لقائمة المواد — **تقارير:** SafetyGate تنبيه CPOE قبل الوصف. **فوترة:** لا، لكنها تمنع مطالبات أدوية خاطئة.

---

## 8. المجموعة H — الموافقات والإقرارات (Consents)

### 8.1 أنواع الموافقات

| # | عربي | English | Mapping |
|---|---|---|---|
| 1 | موافقة عامة على العلاج | General Consent to Treat | FHIR Consent `treatment` |
| 2 | موافقة إجراء جراحي | Surgical Procedure Consent | Consent + ربط ServiceRequest (SafetyGate قبل OR) |
| 3 | موافقة تخدير | Anesthesia Consent | Consent (SafetyGate — فجوة التخدير المرصودة) |
| 4 | موافقة نقل دم | Blood Transfusion Consent | Consent (SafetyGate بنك الدم) |
| 5 | موافقة فحص HIV/الأمراض المعدية | HIV / Infectious Testing | إلزام تنظيمي سعودي |
| 6 | تصوير/استخدام تعليمي | Photography / Teaching | Consent `research/idscl` |
| 7 | موافقة طب عن بعد | Telehealth Consent | Consent |
| 8 | خروج ضد النصيحة | DAMA Declaration | إقرار موقّع + يظهر في discharge |
| 9 | رفض الإنعاش | DNR / Code Status | SNOMED 304253006 (SafetyGate — سياسة وطنية) |
| 10 | إفصاح عن المعلومات (PDPL) | Information Disclosure | Consent `patient-privacy` — امتثال نظام حماية البيانات |
| 11 | موافقة ولي أمر لقاصر | Guardian Consent (Minor) | Consent + performer=guardian |

- L1 (قوالب النصوص L2 لكل مستأجر بمراجعة قانونية) — **تقارير:** اكتمال الموافقات قبل الإجراء (CBAHI). **فوترة:** غير مباشر (لا عملية بلا موافقة → لا مطالبة).
- **حالة الموافقة:** مسودة/سارية active/منتهية/مسحوبة rejected — FHIR `consent-state-codes`.

---

## 9. المجموعة I — التأمين والأهلية والمطالبات (NPHIES)

### 9.1 نوع التغطية (Coverage Type)

| # | عربي | English | Mapping (NPHIES coverage-type) |
|---|---|---|---|
| 1 | تأمين صحي خاص (إلزامي مقيمين) | Extended Health Policy | `EHCPOL` |
| 2 | تغطية حكومية | Public Health Program | `PUBLICPOL` |
| 3 | دفع ذاتي / نقدي | Self-Pay | داخلي `SELF` (خارج NPHIES) |
| 4 | جهة عمل متعاقدة | Corporate Contract | داخلي + عقد (قسم إدارة العقود المقترح) |

- L0 للأكواد NPHIES + L2 للعقود المحلية — **تقارير:** Payer Mix. **فوترة:** حرجة — تحدد مسار المطالبة كاملاً.

### 9.2 غرض فحص الأهلية (Eligibility Purpose)

قيم NPHIES: `benefits` (المنافع)، `discovery` (اكتشاف التغطية)، `validation` (التحقق). — L0. **فوترة:** حرجة — شاشة الأهلية المستقلة المرصودة كفجوة عليا. **تقارير:** معدل رفض من المنبع.

### 9.3 نوع المطالبة (Claim Type / SubType)

| القائمة | القيم | Mapping (NPHIES claim-type) |
|---|---|---|
| نوع المطالبة | مؤسسية institutional، مهنية professional، صيدلية pharmacy، أسنان oral، بصريات vision | NPHIES `claim-type` |
| النوع الفرعي | تنويم `ip`، عيادات `op`، طوارئ `emr` | NPHIES `claim-subtype` |
| نوع الطلب | تفويض مسبق Prior Authorization، مطالبة Claim، إشعار Advanced Authorization | NPHIES message types (priorauth-request / claim-request) |

- L0 — **فوترة:** حرجة. **تقارير:** حجم المطالبات ومعدلات القبول حسب النوع.

### 9.4 حالة المطالبة ونتيجة الفصل (Adjudication)

| القائمة | القيم | Mapping |
|---|---|---|
| حالة المطالبة | مسودة، مرسلة queued، مقبولة approved، مقبولة جزئياً partial، مرفوضة rejected، معلقة pended، ملغاة cancelled، أعيد تقديمها resubmitted | NPHIES ClaimResponse `outcome` + `adjudication` |
| فئات الفصل | مؤهل eligible، منفعة benefit، مشاركة المريض copay، تحمّل deductible، ضريبة tax، خصم تعاقدي | NPHIES adjudication categories |
| أسباب الرفض | قائمة أكواد رفض NPHIES الرسمية (أهلية منتهية، خدمة غير مغطاة، يتطلب تفويضاً، تكرار، توثيق ناقص...) | NPHIES adjudication-reason codes — **L0 تُحمَّل من ملفات NPHIES المنشورة** |

- **تقارير:** Denial Management أهم تقرير دورة إيرادات. **فوترة:** حرجة.

### 9.5 أكواد التشخيص والخدمات (المرجعان الأكبر)

| المرجع | الوصف | الحوكمة |
|---|---|---|
| **ICD-10-AM** | كل التشخيصات (رئيسي/ثانوي/سبب خارجي) + أنواع التشخيص NPHIES (principal, secondary, admitting, discharge) | L0 — تحديث بإصدارات وطنية؛ scaffolding NPHIES FHIR القائم (Gate 8) يستخدمه فعلاً |
| **SBS (Saudi Billing System)** | كتالوج كل الخدمات القابلة للفوترة (فحوصات/إجراءات/إقامة) — يُربط بكتالوج خدمات المستأجر | L1 — كتالوج المستأجر مخصص لكن كل بند يحمل كود SBS إلزامياً |

---

## 10. المجموعة J — الفوترة ZATCA والدفع

### 10.1 أنواع الفواتير (ZATCA Phase-2)

| # | عربي | English | Mapping (UBL/ZATCA) |
|---|---|---|---|
| 1 | فاتورة ضريبية (B2B) | Standard Tax Invoice | InvoiceTypeCode `388` subtype `01` |
| 2 | فاتورة مبسطة (B2C) | Simplified Tax Invoice | `388` subtype `02` |
| 3 | إشعار دائن | Credit Note | `381` |
| 4 | إشعار مدين | Debit Note | `383` |

- L0 — **تقارير:** تقارير ضريبية. **فوترة:** حرجة (منصة ZATCA القائمة المقيدة بـCSID).

### 10.2 فئات ضريبة القيمة المضافة

| القيم | Mapping |
|---|---|
| خاضعة 15% (S)، صفرية (Z)، معفاة (E)، خارج النطاق (O) | UN/ECE 5305 كما يعتمدها ZATCA — الخدمات الصحية للسعوديين المدفوعة حكومياً لها معاملة خاصة |

- L0 — **فوترة:** حرجة، **تقارير:** الإقرار الضريبي.

### 10.3 طرق الدفع (Payment Methods)

| # | عربي | English | Mapping |
|---|---|---|---|
| 1 | نقدي | Cash | UN/ECE 4461 `10` |
| 2 | مدى | Mada Debit | `48` (بطاقة) + كود داخلي MADA |
| 3 | بطاقة ائتمانية | Credit Card | `48` |
| 4 | تحويل بنكي | Bank Transfer | `30` |
| 5 | محفظة رقمية (STC Pay...) | Digital Wallet | `48` + كود داخلي |
| 6 | تغطية تأمين | Insurance Payer | تسوية عبر remittance (إجراءات Idempotency القائمة) |
| 7 | آجل / ذمم شركة | Corporate Credit | داخلي (حساب ذمم) |

- L1 — **تقارير:** تسوية الصندوق اليومية (daily_close القائم). **فوترة:** إلزامي على الفاتورة ZATCA (PaymentMeansCode).

### 10.4 أنواع الخصم وأسباب الإلغاء/الاسترداد المالي

| القائمة | القيم المقترحة | الحوكمة |
|---|---|---|
| أنواع الخصم | خصم تعاقدي مع دافع، خصم موظفين، خصم إنساني/إعفاء، خصم عرض ترويجي، خصم ولاء | L2 + سقف صلاحيات لكل دور (RBAC) — كل خصم يتطلب سبباً وموافقة |
| أسباب إلغاء فاتورة/استرداد | خطأ إدخال، إلغاء خدمة، ازدواجية، قرار طبي، شكوى مريض مقبولة | L1 — الإلغاء بعد الإصدار = إشعار دائن ZATCA إلزاماً (لا حذف) |
| حالة الفاتورة | مسودة، صادرة issued، مدفوعة paid، مدفوعة جزئياً، ملغاة (بإشعار)، متعثرة | FHIR Invoice status + ZATCA |

- **تقارير:** تسريب الإيرادات Revenue Leakage. **فوترة:** حرجة + خاضعة لسجل التدقيق.

---

## 11. المجموعة K — الجودة والسلامة ومكافحة العدوى

### 11.1 أنواع بلاغات الحوادث OVR

| # | عربي | English | ملاحظة |
|---|---|---|---|
| 1 | خطأ دوائي | Medication Error | تصنيف فرعي NCC-MERP (A–I) |
| 2 | سقوط مريض | Patient Fall | يرتبط بتقييم مخاطر السقوط بمحطة التمريض |
| 3 | قرحة فراش | Pressure Injury | مراحل 1–4 |
| 4 | جراحة موقع/مريض خاطئ | Wrong Site/Patient Surgery | حدث جسيم Sentinel |
| 5 | تفاعل نقل دم | Transfusion Reaction | يربط ببنك الدم |
| 6 | وخز إبرة/تعرض مهني | Needlestick / Exposure | يربط بصحة الموظفين |
| 7 | عطل جهاز طبي | Medical Device Failure | يربط بالهندسة الطبية الحيوية |
| 8 | هروب/اعتداء/أمن | Security / Violence | |
| 9 | خطأ تشخيصي/تأخر نتيجة حرجة | Diagnostic Delay | يربط بحلقة Gate 3 |
| 10 | كاد أن يقع | Near Miss | سري غير عقابي |

- **تصنيف الخطورة:** كارثي/جسيم Sentinel — كبير Major — متوسط Moderate — بسيط Minor — Near Miss (مصفوفة SAC 1–4). L1.
- **تقارير:** ركن CBAHI (بلاغ سري + RCA للجسيم خلال مهلة محددة). **فوترة:** لا. **Mapping:** لا يوجد معيار تبادل إلزامي؛ يُنصح بمواءمة تصنيف WHO ICPS.

### 11.2 ترصد العدوى HAI وأنواع العزل

| القائمة | القيم | Mapping |
|---|---|---|
| أنواع عدوى المنشأة | عدوى مجرى الدم بالقسطرة المركزية CLABSI، عدوى البول بالقسطرة CAUTI، التهاب رئوي بالتنفس الصناعي VAP، عدوى موقع جراحي SSI (سطحي/عميق/عضوي)، عدوى مطثية CDI، كائنات متعددة المقاومة MDRO (MRSA/CRE/ESBL) | تعاريف CDC/NHSN — ترميز الكائنات SNOMED CT |
| أنواع العزل | تلامسي Contact، رذاذي Droplet، هوائي Airborne، وقائي عكسي Protective | SNOMED CT isolation procedures — يظهر كتنبيه على ملف المريض ولوحة الأسرّة |
| كائنات الترصد | قائمة الكائنات الممرضة الخاضعة للتبليغ (HESN وزارة الصحة) | L0 قائمة وطنية |

- L0 للتعاريف + L2 لخطوط الترصد المحلية — **تقارير:** معدلات HAI لكل 1000 يوم جهاز (CBAHI/GDIPC). **فوترة:** لا.

---

## 12. المجموعة L — العمليات التشغيلية (صيانة/تعقيم/مخزون/تغذية/نفايات)

### 12.1 الصيانة والأجهزة الطبية (CMMS + Biomedical)

| القائمة | القيم | الحوكمة/Mapping |
|---|---|---|
| نوع أمر العمل | تصحيحي Corrective، وقائي مجدول PPM، معايرة Calibration، فحص سلامة كهربائية، استدعاء مصنّع Recall، تركيب/إخراج من الخدمة | L1 — المعايرة والاستدعاء SafetyGate للأجهزة الطبية |
| أولوية العطل | حرج (جهاز حياة) — عالي — متوسط — منخفض | L1 + SLA لكل مستوى |
| تصنيف الجهاز | جهاز حياة Life-Support، عالي الخطورة، متوسط، منخفض | يوجّه جدول PPM — مواءمة IEC/نظام SFDA للأجهزة |
| حالة الجهاز | يعمل، يعمل بتقييد، متوقف، تحت الصيانة، مكهَّن Condemned | L1 |

- **تقارير:** جاهزية الأجهزة Uptime + امتثال معايرة (فجوة الهندسة الطبية المرصودة). **فوترة:** لا (كلفة داخلية).

### 12.2 التعقيم المركزي CSSD

| القائمة | القيم | Mapping |
|---|---|---|
| طرق التعقيم | بخار Steam (تفريغ مسبق/جاذبية)، بلازما بيروكسيد الهيدروجين H2O2، أكسيد الإيثيلين EO، حرارة جافة | L1 — ISO 17665 (بخار) وISO 11135 (EO) مرجعياً |
| نتائج المؤشرات | مؤشر كيميائي (فئات 1–6) ناجح/فاشل، مؤشر حيوي BI ناجح/فاشل، اختبار Bowie-Dick | L0 للفئات — فشل BI = استدعاء حمولة (SafetyGate) |
| حالة الحمولة/الطقم | قيد الغسيل، قيد التغليف، معقّم متاح، منتهي الصلاحية، مستدعى Recalled، قيد الاستخدام بعملية | L1 — تتبع الطقم إلى المريض/العملية (traceability) |

- **تقارير:** تتبع أطقم ↔ عمليات ↔ مرضى (CBAHI). **فوترة:** غير مباشر (كلفة العملية).

### 12.3 المخزون وسلسلة الإمداد

| القائمة | القيم | Mapping |
|---|---|---|
| أنواع الحركات | استلام GRN، صرف لقسم Issue، تحويل بين مخازن Transfer، تسوية زيادة/عجز Adjustment±، إرجاع لمورد RTV، إتلاف منتهي الصلاحية Expiry Write-off، استهلاك على مريض Consumption | L0 للأنواع (تدقيق مالي) + L2 لمراكز التكلفة |
| فئات الأصناف | دواء، مستلزم طبي، مستلزم مختبر، قطع غيار، قرطاسية، غذائي، خطر/كيميائي | L2 + ربط الدوائي بكتالوج SFDA |
| **وحدات القياس UOM** | وحدات UCUM للسريري (mg, mL, IU...) + وحدات تعبئة تجارية (علبة Box، شريط Strip، عبوة Pack، قطعة Each، كرتون Carton) مع معاملات تحويل إلزامية | L0 لـUCUM + L1 للتعبئة — **الفوترة بالوحدة السريرية والشراء بالتجارية: جدول تحويل إلزامي** |
| حالة أمر الشراء/طلب القسم | مسودة، معتمد، مرسل، مستلم جزئياً، مستلم، مغلق، ملغى | L1 — تبويب "طلبات الأقسام" المدمج بالمخازن |

- **تقارير:** انتهاء صلاحيات، مخزون راكد، دقة جرد. **فوترة:** حرج للمستهلكات المفوترة على المريض (SBS).

### 12.4 التغذية العلاجية

| القائمة | القيم | Mapping |
|---|---|---|
| أنواع الحميات | عادي Regular، لين Soft، سائل صافٍ Clear Liquid، سائل كامل Full Liquid، سكري Diabetic، كلوي Renal، قلبي قليل الملح Low-Salt، قليل الدهون، ممنوع بالفم **NPO**، تغذية أنبوبية Enteral، تغذية وريدية TPN | FHIR NutritionOrder — NPO تنبيه SafetyGate قبل العمليات/التخدير |
| القوام والحساسيات الغذائية | قوام IDDSI (مستويات 0–7)، حساسية غذائية تُسحب تلقائياً من ملف الحساسية 7.1 | IDDSI framework |

- L1 — **تقارير:** تغطية التقييم الغذائي للمنوّمين (CBAHI). **فوترة:** لا غالباً (TPN يُفوتر صيدلياً).

### 12.5 النفايات الطبية

| القيم | Mapping |
|---|---|
| عامة (أسود)، معدية (أصفر)، حادة Sharps (صندوق أصفر مقاوم)، باثولوجية، دوائية/كيميائية، سامة للخلايا Cytotoxic (بنفسجي)، مشعة | تصنيف WHO + اشتراطات المركز الوطني لإدارة النفايات (MWAN) — L0 |

- **تقارير:** كميات بالكيلوغرام حسب الفئة (التزام تنظيمي). **فوترة:** لا (عقود ناقل مرخّص).

---

## 13. المجموعة M — بنك الدم ونقل الدم

| القائمة | القيم | Mapping |
|---|---|---|
| مكونات الدم | كريات مكدسة PRBC، بلازما طازجة مجمدة FFP، صفائح Platelets، راسب بارد Cryoprecipitate، دم كامل | ISBT 128 (ترميز المكونات) — L0 |
| فحوصات التوافق | فصيلة وحفظ Type & Screen، توافق كامل Crossmatch، طوارئ O-سالب غير متوافق | L0 (SafetyGate) |
| أنواع تفاعلات نقل الدم | حموي غير انحلالي FNHTR، تحسسي، انحلالي حاد AHTR، تلوث جرثومي، إصابة رئة TRALI، فرط حمل دوران TACO | تعاريف الترصد الدموي Hemovigilance — يغذي OVR 11.1 |
| حالة الوحدة | متاحة، محجوزة لمريض، صُرفت، نُقلت، أُتلفت، أُرجعت | L1 |

- **تقارير:** استهلاك/إتلاف وحدات + سجل التفاعلات (CBAHI). **فوترة:** نعم — مكونات الدم لها أكواد SBS.

---

## 14. المجموعة N — الإدارة والنظام (SaaS)

| القائمة | القيم | الحوكمة |
|---|---|---|
| أنواع المنشآت | القائمة الحالية (17 نوعاً: مستشفى عام، مجمع طبي، عيادة أسنان...) | **L3 مركزي** — تتحكم بفلترة الأقسام الظاهرة |
| الأدوار والصلاحيات RBAC | الأدوار القياسية (طبيب، ممرض، صيدلي، فني مختبر، محاسب، استقبال، مدير جودة، Super Admin...) + صلاحيات لكل فهرس قسم | L1 — القوالب مركزية والتخصيص للمستأجر؛ تُراجع ضد فحوص الأمان القائمة (system_users P0) |
| خطط الاشتراك والاستحقاقات | Basic / Professional / Enterprise + حدود (max_users...) | L3 — Batch 3/4 القائمة (entitlements resolver) |
| حالات المستخدم | نشط، موقوف، مقفول (محاولات فاشلة)، بانتظار تفعيل، مؤرشف | L0 أمنياً |
| أحداث سجل التدقيق | دخول/خروج، عرض PHI، تعديل، طباعة، تصدير، كسر زجاج Break-the-glass، تغيير صلاحيات | L0 — يغذي "عارض سجل التدقيق" المقترح (فجوة مرصودة) — مواءمة FHIR AuditEvent |
| وحدات القياس الحيوية | العلامات الحيوية بوحدات UCUM (mmHg, bpm, °C, kg, cm, SpO2 %) | L0 — تغذي محركي EWS والدرجات القائمين |

---

## 15. مصفوفة الملخص التنفيذي — كل القوائم في نظرة واحدة

| القائمة | القفل | تقارير؟ | فوترة؟ | المعيار الحاكم |
|---|---|---|---|---|
| أنواع الهوية | L0/L1 | نعم | حرج | HL7 v2-0203 + NPHIES |
| الجنس الإداري | L0 | نعم | نعم | FHIR administrative-gender |
| الحالة الاجتماعية | L0 | نعم | لا | FHIR v3-MaritalStatus |
| الجنسية | L0 | نعم | نعم | ISO 3166 |
| صلة القرابة/المشترك | L1 | لا | نعم | v2-0131 / NPHIES subscriber-rel |
| فصيلة الدم | L0 | نعم | لا | SNOMED CT |
| اللغة/الديانة | L1 | لا | لا | ISO 639 / v3-Religion |
| نوع الزيارة | L0 | نعم | حرج | v3-ActCode (NPHIES) |
| حالة الموعد | L0 | نعم | غير مباشر | FHIR appointmentstatus |
| أسباب إلغاء موعد | L1 | نعم | لا | FHIR cancellation-reason |
| فرز ESI | L0 | نعم | نعم | ESI v4 |
| مصدر/نوع القبول | L1 | نعم | نعم | admit-source / v2-0007 |
| وجهة الخروج | L0/L1 | نعم | نعم | discharge-disposition / v2-0112 |
| أنواع الأوامر | L1 | نعم | حرج | FHIR ServiceRequest/NutritionOrder |
| حالة/أولوية الأمر | L0 | نعم | نعم | request-status/priority |
| أنواع العينات | L1 | نعم | غير مباشر | v2-0487 + SNOMED |
| أسباب رفض العينة | L1 | نعم | لا | v2-0490 |
| حالة/أعلام النتائج | L0 | نعم | نعم | diagnostic-report-status / v2-0078 |
| طرائق التصوير | L0 | نعم | نعم | DICOM Modality |
| طرق الإعطاء | L1 | نعم | نعم | SNOMED CT Routes |
| تكرار الجرعات | L1 | نعم | نعم | FHIR Timing |
| الأشكال/وحدات الجرعة | L0/L1 | نعم | حرج | SNOMED forms + UCUM + SFDA |
| حالة الوصفة | L0 | نعم | نعم | medicationrequest-status |
| الحساسية (5 قوائم) | L0/L1 | نعم | لا | FHIR AllergyIntolerance + SNOMED |
| أنواع الموافقات | L1/L2 | نعم | غير مباشر | FHIR Consent |
| نوع التغطية | L0 | نعم | حرج | NPHIES coverage-type |
| غرض الأهلية | L0 | نعم | حرج | NPHIES eligibility |
| نوع/فرعية المطالبة | L0 | نعم | حرج | NPHIES claim-type/subtype |
| حالة/فصل/رفض المطالبة | L0 | نعم | حرج | NPHIES adjudication |
| التشخيصات | L0 | نعم | حرج | ICD-10-AM |
| كتالوج الخدمات | L1 | نعم | حرج | SBS |
| أنواع الفواتير | L0 | نعم | حرج | ZATCA UBL 388/381/383 |
| فئات VAT | L0 | نعم | حرج | UN/ECE 5305 (ZATCA) |
| طرق الدفع | L1 | نعم | نعم | UN/ECE 4461 |
| الخصومات/الإلغاء المالي | L1/L2 | نعم | حرج | داخلي + إشعار دائن ZATCA |
| أنواع OVR + خطورة | L1 | نعم | لا | WHO ICPS / NCC-MERP / SAC |
| أنواع HAI + العزل | L0/L2 | نعم | لا | CDC-NHSN / SNOMED / HESN |
| الصيانة/الأجهزة | L1 | نعم | لا | IEC + SFDA أجهزة |
| التعقيم CSSD | L0/L1 | نعم | غير مباشر | ISO 17665/11135 |
| حركات المخزون | L0/L2 | نعم | نعم | داخلي + UCUM |
| وحدات القياس | L0/L1 | نعم | حرج | UCUM + تعبئة تجارية |
| الحميات الغذائية | L1 | نعم | لا | FHIR NutritionOrder + IDDSI |
| النفايات الطبية | L0 | نعم | لا | WHO + MWAN |
| بنك الدم (4 قوائم) | L0/L1 | نعم | نعم | ISBT 128 + Hemovigilance |
| قوائم الإدارة والSaaS | L0/L3 | نعم | غير مباشر | FHIR AuditEvent + داخلي |

---

## 16. توصيات التنفيذ (تخطيط فقط — لا DDL الآن)

1. **نموذج بيانات موحّد مقترح:** جدولا `ref_list` (تعريف القائمة + مستوى القفل) و`ref_value` (القيمة: `code`, `name_ar`, `name_en`, `standard_code`, `code_system_uri`, `tenant_id NULL=عام`, `is_active`, `sort_order`, `effective_from/to`) مع RLS يسمح بقراءة القيم العامة + قيم المستأجر فقط — **صياغة DDL مؤجلة لبوابة اعتماد المالك أسوة بمرجع e-candidates**.
2. **أولوية التعبئة:** (1) قوائم NPHIES/ZATCA الحرجة فوترياً، (2) قوائم SafetyGate السريرية (فرز/حساسية/نقل دم/موافقات)، (3) القوائم التشغيلية، (4) قوائم الحوكمة والتقارير.
3. **محمّل قواميس (Terminology Loader):** آلية استيراد نسخ ICD-10-AM/SBS/أكواد رفض NPHIES بإصدارات مؤرخة بدل الإدخال اليدوي.
4. **واجهة إدارة القوائم:** شاشة ضمن "الإعدادات" تُظهر مستوى القفل وتمنع تحرير L0، مع سجل تدقيق لكل تعديل — وتخدم فجوة "عارض سجل التدقيق" جزئياً.
5. **اختبار المطابقة:** فحص آلي (CI) يتحقق أن كل قيمة L0/L1 تحمل `standard_code` صالحاً قبل أي إصدار.

---
*نهاية الوثيقة — Gate 5: كتالوج القوائم المرجعية. أي تنفيذ فعلي (DDL/شاشات) يمر عبر بوابات الاعتماد القائمة ولا يمس الإنتاج.*
