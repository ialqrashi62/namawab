# 03 — مواصفات بقية الأقسام (تدفّق/مالية/تشغيل/إدارة/تخصصية)

> صيغة مكثّفة لكل قسم: الحالة · فجوة (أهم البنود) · برومنت جاهز · سيناريو (سطر) · فلو بيانات (سطر). القالب في 00.

---
## 1 — Dashboard — P3 — L2
**الحالة:** بطاقات + top doctors + revenue. **فجوة:** لوحات حسب الدور + KPIs حيّة + drill-down + تنبيهات سريرية/تشغيلية + widgets قابلة للتخصيص.
**برومنت:** `أنشئ dashboard حسب الدور (طبيب/ممرضة/مدير/مالية): widgets KPI حيّة (occupancy/TAT/AR/ER wait) + drill-down + تنبيهات. مصدر البيانات aggregations مخزّنة، tenant-scoped، ع/EN.`
**سيناريو:** مدير يفتح لوحته → يرى occupancy 82% → drill-down على الجناح → الأسرّة المشغولة.
**فلو:** `GET /api/dashboard?role=` → aggregations (tenant) → widgets.

## 2 — Reception — P1 — L2
**الحالة:** تسجيل/بحث + فاتورة. **فجوة:** تحقّق هوية وطنية/إقامة (Absher/Yakeen) + **EMPI** (منع تكرار الملفات) + eligibility تأمين فوري (NPHIES) + التقاط صورة/وثائق + طوابير ذكية.
**برومنت:** `أنشئ reception: تسجيل مريض مع تحقّق هوية/إقامة + كشف تكرار (EMPI: اسم+هوية+جوال)، eligibility تأمين فوري (NPHIES gated)، التقاط وثائق، إنشاء زيارة/فاتورة. tenant-scoped، escapeHTML، ع/EN.`
**سيناريو:** مريض جديد → بحث بالهوية → لا تكرار → تسجيل + eligibility → زيارة.
**فلو:** `POST /api/patients` (EMPI dedupe) → `patients` → eligibility(NPHIES gated) → `visits` → audit.

## 3 — Appointments — P1 — L2
**الحالة:** جدول + check-in/no-show. **فجوة:** تقويم موارد (طبيب/غرفة/جهاز) + قواعد overbooking + تذكير SMS/واتساب + قوائم انتظار + recurring + online booking (portal).
**برومنت:** `أنشئ مواعيد: تقويم موارد (طبيب/غرفة) بفتحات، قواعد overbooking، تذكير SMS، waitlist، حجز أونلاين من البوابة. جداول appointments/slots(tenant_id)+audit. ع/EN.`
**سيناريو:** حجز موعد → فتحة متاحة → تأكيد + تذكير SMS → check-in → طابور.
**فلو:** `GET /api/appointments/slots` → `POST /api/appointments` → reminder job → check-in→`waiting_queue`.

## 8 — HR — P3 — L2
**الحالة:** موظفون + رواتب + إجازات + slip. **فجوة:** حضور بيومتري + جدولة مناوبات (rostering) + **تراخيص SCFHS** (تتبّع/تنبيه انتهاء) + تقييم أداء + self-service + نهاية خدمة (GOSI).
**برومنت:** `أنشئ HR: ملف موظف + تراخيص SCFHS مع تنبيه انتهاء، rostering مناوبات، حضور، payroll (GOSI/نهاية خدمة)، self-service إجازات. tenant-scoped+audit. ع/EN. لا كشف رواتب لغير المخوّل.`
**سيناريو:** اقتراب انتهاء ترخيص طبيب → تنبيه HR → تجديد → تحديث.
**فلو:** `employees`+`licenses`(expiry alert) → `shifts`/`attendance` → `payroll`.

## 9 — Finance — P1 — L2 (محاسبة OFF)
**الحالة:** فواتير + P&L + كشوف. **فجوة:** **GL (دفتر أستاذ) + posting محاسبي + CoA** + **مراكز تكلفة** + **AR aging** + بنوك/مطابقة + ربط ZATCA + إقفال دوري. (المحاسبة OFF حالياً — تُفعّل ببوابة مخصّصة.)
**برومنت:** `أنشئ finance: GL + chart of accounts + posting (مزدوج القيد) + cost centers + AR aging + bank reconciliation + period close. كل قيد متوازن، tenant-scoped+audit. posting خلف flag (افتراضي OFF). ع/EN.`
**سيناريو:** فاتورة → posting إلى GL (مدين/دائن) → AR → تحصيل → مطابقة بنكية → إقفال شهري.
**فلو:** invoice → (flag) `journal_entries`+`journal_lines`(balanced) → `gl` → AR aging → close.

## 10 — Insurance — P1 — L2
**الحالة:** شركات + مطالبات + حالة. **فجوة:** **NPHIES كامل**: eligibility + **pre-authorization** + claims (submit) + remittance/payment + رفض/استئناف + **عقود/تسعير** + **co-pay/deductible**.
**برومنت:** `أنشئ insurance/NPHIES: eligibility فوري، pre-auth، claim submission + tracking، remittance + رفض/استئناف، عقود تسعير + co-pay. كل اتصال NPHIES gated (لا شهادة/اتصال حقيقي الآن). tenant-scoped+audit. ع/EN.`
**سيناريو:** زيارة مغطّاة → eligibility → pre-auth لإجراء → claim → remittance/رفض → استئناف.
**فلو:** `eligibility`(gated) → `pre_auth` → `claims` → `remittance`/`denials` → audit.

## 11 — Inventory — P2 — L2
**الحالة:** أصناف + تعديل + فلترة. **فجوة:** **batch/expiry (FEFO)** + reorder points + **PO + استلام (GRN)** + جرد دوري (cycle count) + تحويلات بين المخازن + ربط الصيدلية/CSSD.
**برومنت:** `أنشئ inventory: مخزون بدفعات/انتهاء (FEFO) + reorder alerts + PO→GRN→استلام + cycle count + تحويلات. جداول items/batches/po/grn(tenant_id)+audit. ع/EN.`
**سيناريو:** صنف تحت نقطة الطلب → تنبيه → PO → استلام (GRN) → دفعات بصلاحية.
**فلو:** `items`/`batches` → reorder→`purchase_orders`→`grn` → decrement on dispense.

## 13 — Waiting Queue — P2 — L2
**الحالة:** طابور + استدعاء التالي. **فجوة:** شاشات عرض عامة (TV) + أولوية فرز + متوسط انتظار + توجيه متعدّد المحطات + نداء صوتي/رقم.
**برومنت:** `أنشئ queue: طابور بأولوية فرز + شاشة عرض عامة (رقم/محطة) + نداء + متوسط انتظار + توجيه متعدّد المحطات. tenant-scoped. ع/EN.`
**سيناريو:** check-in → رقم → شاشة → نداء → محطة.
**فلو:** check-in → `waiting_queue`(priority) → display feed → call next.

## 14 — Patient Accounts — P1 — L2
**الحالة:** كشف حساب + فواتير. **فجوة:** محفظة/إيداعات + تقسيط + co-pay + استرداد + بيان موحّد + ربط التأمين/الخصومات.
**برومنت:** `أنشئ patient accounts: محفظة/إيداع + خطط تقسيط + co-pay + استرداد + بيان موحّد عبر الزيارات + ربط تغطية التأمين. tenant-scoped+audit. ع/EN.`
**سيناريو:** إيداع → خصم تلقائي من الفواتير → تقسيط الرصيد → استرداد فائض.
**فلو:** `patient_wallet`/`deposits` → apply to `invoices` → `installments`/`refunds`.

## 15 — Reports — P3 — L1/L2
**الحالة:** تقارير + retry. **فجوة:** منشئ تقارير ad-hoc + جدولة + تصدير (PDF/Excel) + **لوحات تنظيمية CBAHI/MOH** + scheduled distribution.
**برومنت:** `أنشئ reports: منشئ تقارير ad-hoc (اختيار حقول/فلاتر) + قوالب CBAHI/MOH + جدولة + تصدير PDF/Excel + توزيع. tenant-scoped (لا تسريب عبر المستأجرين). ع/EN.`
**سيناريو:** مدير ينشئ تقرير occupancy شهري → يجدوله → يصل بريداً.
**فلو:** report builder → query(tenant) → export/schedule.

## 16 — Messaging — P3 — L2
**الحالة:** inbox/sent/compose. **فجوة:** رسائل مرتبطة بالمريض (secure) + قوالب + **تنبيهات نتائج حرجة** + إشعارات داخل النظام + escalation.
**برومنت:** `أنشئ messaging آمن: رسائل مرتبطة بمريض/طلب + قوالب + تنبيه نتائج حرجة مع escalation + إشعارات. tenant-scoped، escapeHTML، لا PHI في إشعار خارجي. ع/EN.`
**سيناريو:** نتيجة حرجة → رسالة للطبيب → عدم قراءة خلال X → escalation.
**فلو:** event(critical) → `messages` → notify → escalate if unread.

## 17 — Catalog — P2 — L2
**الحالة:** أصناف مختبر/أشعة/خدمات + تسعير. **فجوة:** **CDM (chargemaster) موحّد** + **LOINC/CPT mapping** + إصدارات تسعير + عقود تأمين + bundles.
**برومنت:** `أنشئ chargemaster موحّد: خدمات/فحوص بربط LOINC/CPT + إصدارات تسعير (effective dates) + أسعار عقود التأمين + bundles. tenant-scoped+audit. ع/EN.`
**سيناريو:** تحديث سعر فحص → إصدار جديد بتاريخ سريان → الفواتير تستخدم الإصدار الساري.
**فلو:** `chargemaster`/`price_versions` → billing يقرأ السعر الساري.

## 18 — Dept Requests — P2 — L1/L2
**الحالة:** طلبات بين الأقسام. **فجوة:** سير موافقات (workflow) + SLA + تتبّع حالة + ربط المخزون/الصيانة + إشعارات.
**برومنت:** `أنشئ dept requests: طلب→موافقة(ات)→تنفيذ مع SLA + تتبّع + ربط inventory/maintenance + إشعار. tenant-scoped+audit. ع/EN.`
**سيناريو:** قسم يطلب مستلزمات → موافقة المدير → المخزون يصرف → إغلاق.
**فلو:** `dept_requests`(workflow states) → approval → fulfil → close.

## 21 — Consent Forms — P2 — L2
**الحالة:** قوالب + توقيع + طباعة + signature_data. **فجوة:** قوالب ديناميكية (حقول) + **توقيع رقمي موثّق** + ربط الإجراء/العملية + لغات متعدّدة + أرشفة + إصدارات قالب.
**برومنت:** `أنشئ consent: قوالب ديناميكية بإصدارات + توقيع رقمي (canvas/مصادق) مرتبط بإجراء/عملية + لغات + أرشفة + audit. tenant-scoped، escapeHTML. ع/EN.`
**سيناريو:** قبل عملية → اختيار قالب → ملء + توقيع المريض/الشاهد → ربط بالعملية → أرشفة.
**فلو:** `consent_templates`(versioned) → `signed_consents`(link procedure) → archive.

## 25 — CSSD (التعقيم المركزي) — P2 — L1
**الحالة:** أساسي. **فجوة:** تتبّع **صواني/أدوات** بالباركود + دورات تعقيم (autoclave) + **مؤشّرات بيولوجية/كيميائية** + ربط العمليات (استهلاك/إرجاع) + تتبّع loaner.
**برومنت:** `أنشئ CSSD: تتبّع صواني/أدوات بالباركود عبر دورة (Used→Decon→Pack→Sterilize→Store→Issue) + سجل دورات autoclave + BI/CI + ربط OR. tenant-scoped+audit. ع/EN.`
**سيناريو:** صينية بعد عملية → تنظيف → تعبئة → تعقيم (BI) → تخزين → صرف لعملية.
**فلو:** `cssd_trays`(lifecycle) → `sterilization_cycles`(BI/CI) → issue to OR.

## 26 — Dietary — P2 — L1/L2
**الحالة:** قائمة. **فجوة:** طلبات غذائية حسب **الحمية الطبية** (سكري/كلى) + حساسية + ربط القبول (تلقائي للمنوّمين) + توصيل + تكامل المطبخ + NPO.
**برومنت:** `أنشئ dietary: طلب وجبة حسب حمية المريض (محسوبة من تشخيصه) + حساسية + NPO + توصيل + ربط ADT تلقائياً. tenant-scoped+audit. ع/EN.`
**سيناريو:** قبول مريض سكري → النظام يقترح حمية سكري → طلب وجبة → مطبخ → توصيل.
**فلو:** admission→diet order(auto by Dx) → `meal_orders` → kitchen → deliver.

## 27 — Infection Control — P2 — L1/L2
**الحالة:** حسب النوع + سجل. **فجوة:** مراقبة **HAI** (عدوى مكتسبة) + تنبيهات + **عزل** (precautions) + إبلاغ تنظيمي (MOH) + **AMS** (إشراف مضادات حيوية) + outbreak.
**برومنت:** `أنشئ infection control: رصد HAI + قوائم عزل + تنبيه عند نمط مقاومة/عدوى + إبلاغ MOH + AMS (مراجعة مضادات). ربط المختبر (cultures). tenant-scoped+audit. ع/EN.`
**سيناريو:** زرع موجب لكائن مقاوم → تنبيه مكافحة العدوى → عزل + إبلاغ.
**فلو:** lab culture(+) → `hai_surveillance` alert → `isolation` + regulatory report.

## 28 — Quality — P2 — L2
**الحالة:** KPI + حوادث + audit log + compliance checklist (CBAHI/MOH ثابتة). **فجوة:** **حوادث/near-miss** + **CAPA** + **risk register** + مؤشّرات CBAHI ديناميكية + accreditation tracking + RCA.
**برومنت:** `أنشئ quality: تبليغ حوادث/near-miss → تصنيف → CAPA → إغلاق + RCA، risk register، مؤشّرات CBAHI + تتبّع اعتماد. tenant-scoped+audit. ع/EN.`
**سيناريو:** حادثة سقوط → تبليغ → تحقيق RCA → CAPA → إغلاق + مؤشّر.
**فلو:** `incidents`(near-miss) → `capa` → `risk_register` → CBAHI KPI.

## 29 — Maintenance — P2 — L2
**الحالة:** جداول + أوامر عمل + معدّات. **فجوة:** **CMMS** (أصول) + **صيانة وقائية مجدولة (PPM)** + **biomedical calibration** + downtime/MTBF + ربط الأجهزة الطبية + spare parts.
**برومنت:** `أنشئ CMMS: سجل أصول + work orders (corrective/preventive) + PPM schedule + calibration للأجهزة الطبية + downtime tracking. tenant-scoped+audit. ع/EN.`
**سيناريو:** جدول PPM لجهاز أشعة → أمر عمل تلقائي → فني → معايرة → إغلاق.
**فلو:** `assets` → `work_orders`(PM schedule) → `calibration` → close.

## 30 — Transport (نقل المرضى) — P2 — L1/L2
**الحالة:** طلبات. **فجوة:** تتبّع حيّ + أولوية + موارد (نقّالة/كرسي/مرافق) + ربط ADT/الأشعة + أوقات استجابة.
**برومنت:** `أنشئ transport: طلب نقل (من→إلى) بأولوية + تخصيص مورد + تتبّع حالة + أوقات استجابة + ربط ADT/الأشعة. tenant-scoped+audit. ع/EN.`
**سيناريو:** أشعة تطلب نقل مريض → تخصيص ناقل → تتبّع → إنجاز.
**فلو:** `transport_requests`(priority) → assign → track → complete.

## 32 — Clinical Pharmacy — P3 — L1
**الحالة:** أساسي. **فجوة:** **مراجعة دوائية** (med review) + **TPN/حساب جرعات** + **AMS** + **pharmacokinetics** + تثقيف + توصيات تدخّل موثّقة.
**برومنت:** `أنشئ clinical pharmacy: مراجعة دوائية شاملة + حساب جرعات كلوية/TPN + AMS + توصيات تدخّل (intervention) موثّقة + قبول/رفض الطبيب. tenant-scoped+audit. ع/EN.`
**سيناريو:** صيدلي سريري يراجع منوّماً → يكشف جرعة كلوية خاطئة → توصية → طبيب يقبل.
**فلو:** `med_reviews` → `pharmacy_interventions`(accept/reject) → audit.

## 33 — Rehabilitation — P3 — L1
**الحالة:** أساسي. **فجوة:** **PT/OT/Speech** + خطط علاج + جلسات + **قياس تقدّم (outcome measures)** + ربط الإحالات + جدولة.
**برومنت:** `أنشئ rehab: إحالة → تقييم → خطة علاج (PT/OT/Speech) → جلسات → قياس تقدّم. جدولة + ربط الطبيب. tenant-scoped+audit. ع/EN.`
**سيناريو:** إحالة لعلاج طبيعي → تقييم → خطة 12 جلسة → متابعة تقدّم.
**فلو:** referral → `rehab_assessments` → `therapy_plans` → `sessions`(outcomes).

## 34 — Patient Portal — P3 — L1
**الحالة:** أساسي. **فجوة:** (مرآة MyChart) **حجز** + **نتائج** + **فواتير/دفع** + **telehealth** + رسائل + تثقيف + موافقات + بيانات العائلة.
**برومنت:** `أنشئ portal مريض: تسجيل آمن (OTP) + حجز مواعيد + عرض نتائج (المُفرَج عنها) + فواتير/دفع + رسائل آمنة + telehealth. RLS صارم (المريض يرى بياناته فقط)، escapeHTML. ع/EN.`
**سيناريو:** مريض يدخل البوابة → يحجز موعداً → يرى نتيجة مختبر مُفرَجاً عنها → يدفع فاتورة.
**فلو:** portal auth(OTP) → `GET /api/portal/...`(self only) → book/results/pay.

## 35 — ZATCA E-Invoice — P1 — L1/L2
**الحالة:** أساسي. **فجوة:** **Phase 2**: ختم رقمي (cryptographic stamp) + **XML (UBL 2.1)** + **QR** + **clearance/reporting** لـZATCA + أرشفة + رفض/إعادة. (CSID حقيقي gated.)
**برومنت:** `أنشئ ZATCA Phase 2: توليد فاتورة UBL XML + ختم رقمي + QR + clearance (standard) / reporting (simplified) إلى ZATCA + أرشفة + حالة. CSR/CSID/الاتصال gated (لا OTP/شهادة حقيقية). tenant-scoped+audit. ع/EN.`
**سيناريو:** فاتورة → توليد XML+QR+ختم → clearance ZATCA(gated) → أرشفة + QR على الطباعة.
**فلو:** invoice → UBL XML+stamp+QR → ZATCA clearance(gated) → `zatca_invoices`(status) → audit.

## 36 — Telemedicine — P3 — L1
**الحالة:** رابط جلسة crypto. **فجوة:** **فيديو مدمج** (WebRTC) + جدولة + موافقة + **وصف عن بعد** + فوترة + تسجيل (بموافقة) + waiting room.
**برومنت:** `أنشئ telemedicine: جدولة جلسة فيديو (WebRTC) + waiting room + موافقة + وصف/طلبات أثناء الجلسة + فوترة + تسجيل اختياري بموافقة. روابط غير قابلة للتخمين (قائم). tenant-scoped+audit. ع/EN.`
**سيناريو:** حجز telehealth → رابط آمن → فيديو → وصف → فاتورة.
**فلو:** schedule → secure room(WebRTC) → in-session orders → invoice.

## 37 — Pathology — P3 — L1
**الحالة:** أساسي. **فجوة:** **عيّنات/تشريح** (gross/microscopic) + **SNOMED** + **cassettes/slides/blocks** tracking + تقارير منظّمة + immunohistochemistry + ربط المختبر.
**برومنت:** `أنشئ pathology: استقبال عيّنة → gross → blocks/slides (باركود) → micro → تقرير منظّم (SNOMED) + IHC. tenant-scoped+audit. ع/EN.`
**سيناريو:** عيّنة جراحية → gross → شرائح → تقرير مرضي منظّم.
**فلو:** `path_specimens` → `blocks`/`slides` → `path_reports`(SNOMED).

## 38 — Social Work — P3 — L1/L2
**الحالة:** قوائم حالات. **فجوة:** تقييم اجتماعي + خطط + **إحالات خارجية** + دعم مالي/خيري + متابعة + ربط الخروج (discharge).
**برومنت:** `أنشئ social work: تقييم اجتماعي → خطة → إحالات (خيري/حكومي) → متابعة + ربط discharge planning. tenant-scoped+audit. ع/EN.`
**سيناريو:** مريض محتاج → تقييم → دعم خيري → متابعة.
**فلو:** `social_cases` → `social_plans` → `referrals` → follow-up.

## 39 — Mortuary — P3 — L1/L2
**الحالة:** قوائم وفيات. **فجوة:** **تسجيل وفاة** + **شهادة وفاة** + تتبّع جثمان (استلام/تسليم) + موافقات + ربط الأحوال/التصاريح + تبريد.
**برومنت:** `أنشئ mortuary: تسجيل وفاة + شهادة + تتبّع جثمان (receive→store→release) + موافقات أهل + تصاريح. tenant-scoped+audit. ع/EN، حسّاسية عالية للخصوصية.`
**سيناريو:** وفاة → تسجيل → شهادة → استلام جثمان → تسليم بموافقة/تصريح.
**فلو:** `deaths` → `death_certificates` → `body_tracking`(release auth).

## 40 — CME — P3 — L1
**الحالة:** أساسي. **فجوة:** دورات + **ساعات SCFHS** + شهادات + تتبّع امتثال تجديد الترخيص + تقييم.
**برومنت:** `أنشئ CME: كتالوج دورات + تسجيل + ساعات معتمدة SCFHS + شهادات + ربط تتبّع تراخيص HR. tenant-scoped+audit. ع/EN.`
**سيناريو:** طبيب يحضر دورة → ساعات CME → شهادة → امتثال الترخيص.
**فلو:** `cme_courses` → `cme_records`(hours) → link `licenses`.

## 41 — Cosmetic Surgery — P3 — L2
**الحالة:** إجراءات + موافقات + طباعة. **فجوة:** **باقات** + **before/after (PHI صور)** آمنة + تسعير خاص + جدولة + متابعة + تسويق/CRM + استشارات.
**برومنت:** `أنشئ cosmetic: باقات إجراءات + استشارة + before/after آمنة (PHI، endpoint محمي) + تسعير خاص + جدولة + متابعة + CRM. tenant-scoped+audit. ع/EN.`
**سيناريو:** استشارة → باقة → موافقة → إجراء → متابعة + صور آمنة.
**فلو:** `cosmetic_consults` → `packages` → procedure → `before_after`(PHI guarded).

## 43 — Settings — P3 — L2/L3
**الحالة:** إعدادات + مستخدمون + تدقيق + نسخ احتياطي + role guards (قائمة من العمل الأمني). **فجوة:** **مصفوفة RBAC** كاملة (دور×صلاحية) + إعدادات منشأة + قوالب + **تكاملات** (NPHIES/ZATCA/PACS keys gated) + جدولة نسخ + استرداد + **Facility Setup Wizard** (انظر 08).
**برومنت:** `أنشئ settings: مصفوفة RBAC (دور×إجراء)، إعدادات منشأة، قوالب، تكاملات (gated)، جدولة نسخ احتياطي + استرداد، Facility Onboarding Wizard. super-admin فقط للحسّاس. tenant-scoped+audit. لا أسرار مطبوعة. ع/EN.`
**سيناريو:** Admin يضبط صلاحيات دور "ممرضة" → يفعّل تكامل NPHIES (gated) → يجدول نسخة احتياطية.
**فلو:** `roles`/`permissions`(matrix) → `facility_settings` → `integration_settings`(gated) → backup schedule → audit.

> الكيانات المشتركة لكل هذه الجداول في `04_CROSSCUTTING_ERD_AR.md`. كلها تحت RLS + tenant_id + audit.
