---
module_id: ER-001
section: 05_ux_ui
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 i18n Keys (EN + AR)

## Pattern: `er.<section>.<element>`

### en.json (excerpt)
```json
{
  "er.board.title": "ER Board",
  "er.board.active": "Active",
  "er.board.waiting": "Waiting",
  "er.board.critical": "Critical",

  "er.triage.title": "Triage Assessment",
  "er.triage.chief_complaint": "Chief Complaint",
  "er.triage.chief_complaint_placeholder": "e.g., chest pain, abdominal pain",
  "er.triage.hpi": "History of Present Illness",
  "er.triage.pain_score": "Pain Score (0-10)",
  "er.triage.vitals": "Vital Signs",
  "er.triage.esi_level": "ESI Level",
  "er.triage.red_flags": "Red Flags",
  "er.triage.recommended_action": "Recommended Action",
  "er.triage.workup": "Suggested Workup",
  "er.triage.override": "Override",
  "er.triage.override_reason": "Override Reason (required)",
  "er.triage.ai_confidence": "AI Confidence",

  "er.encounter.arrival_time": "Arrival Time",
  "er.encounter.triage_time": "Triage Time",
  "er.encounter.provider_first_seen": "Provider First Seen",
  "er.encounter.disposition_time": "Disposition Time",
  "er.encounter.mrn": "MRN",
  "er.encounter.chief_complaint": "Chief Complaint",
  "er.encounter.status": "Status",

  "er.esi.level_1": "Resuscitation (1)",
  "er.esi.level_2": "Emergent (2)",
  "er.esi.level_3": "Urgent (3)",
  "er.esi.level_4": "Less Urgent (4)",
  "er.esi.level_5": "Non-Urgent (5)",

  "er.action.resus_bay": "Send to Resus Bay",
  "er.action.acute_bed": "Send to Acute Bed",
  "er.action.fast_track": "Send to Fast Track",
  "er.action.observation": "Send to Observation",
  "er.action.immediate_discharge": "Discharge",

  "er.vitals.bp_systolic": "BP Systolic",
  "er.vitals.bp_diastolic": "BP Diastolic",
  "er.vitals.heart_rate": "Heart Rate",
  "er.vitals.respiratory_rate": "Respiratory Rate",
  "er.vitals.spo2": "SpO2",
  "er.vitals.temperature_c": "Temperature (°C)",
  "er.vitals.pain_score": "Pain Score",
  "er.vitals.gcs": "GCS",

  "er.red_flag.cardiac_arrest": "Cardiac Arrest",
  "er.red_flag.stemi": "STEMI (ST-Elevation MI)",
  "er.red_flag.stroke": "Acute Ischemic Stroke",
  "er.red_flag.sepsis": "Sepsis",
  "er.red_flag.anaphylaxis": "Anaphylaxis",
  "er.red_flag.trauma": "Major Trauma",
  "er.red_flag.aaa": "AAA Rupture",
  "er.red_flag.ectopic": "Ruptured Ectopic Pregnancy",
  "er.red_flag.torsion_testicular": "Testicular Torsion",
  "er.red_flag.meningococcemia": "Meningococcemia",
  "er.red_flag.status_epilepticus": "Status Epilepticus",
  "er.red_flag.dka": "DKA (Severe)",

  "er.code.blue": "Code Blue",
  "er.code.stemi": "Code STEMI",
  "er.code.stroke": "Code Stroke",
  "er.code.trauma": "Code Trauma",
  "er.code.sepsis": "Code Sepsis",
  "er.code.mass_casualty": "Mass Casualty Incident",
  "er.code.activate": "Activate Code",
  "er.code.activation_reason": "Activation Reason",
  "er.code.team_notified": "Team Notified",

  "er.medication.drug": "Drug",
  "er.medication.dose": "Dose",
  "er.medication.route": "Route",
  "er.medication.frequency": "Frequency",
  "er.medication.indication": "Indication",
  "er.medication.five_rights": "5 Rights Check",
  "er.medication.right_patient": "Right Patient",
  "er.medication.right_drug": "Right Drug",
  "er.medication.right_dose": "Right Dose",
  "er.medication.right_route": "Right Route",
  "er.medication.right_time": "Right Time",
  "er.medication.allergy_alert": "Allergy Alert",
  "er.medication.interaction_alert": "Drug Interaction",
  "er.medication.renal_dose_alert": "Renal Dose Adjustment",
  "er.medication.pregnancy_alert": "Pregnancy Risk",
  "er.medication.override": "Override with Reason",

  "er.disposition.admit": "Admit",
  "er.disposition.discharge": "Discharge",
  "er.disposition.transfer": "Transfer",
  "er.disposition.ama": "AMA (Against Medical Advice)",
  "er.disposition.deceased": "Deceased",
  "er.disposition.observation": "Observation",
  "er.disposition.destination": "Destination",
  "er.disposition.discharge_instructions": "Discharge Instructions",
  "er.disposition.follow_up_provider": "Follow-up Provider",
  "er.disposition.follow_up_timeframe": "Follow-up Timeframe",
  "er.disposition.ama_witness": "AMA Witness",

  "er.kpi.door_to_provider": "Door to Provider",
  "er.kpi.lwbs": "Left Without Being Seen",
  "er.kpi.door_to_balloon": "Door to Balloon (STEMI)",
  "er.kpi.door_to_needle": "Door to Needle (Stroke)",
  "er.kpi.sepsis_bundle": "Sepsis Bundle <1h",
  "er.kpi.critical_callback": "Critical Callback <30min",
  "er.kpi.los": "ED Length of Stay",

  "er.alert.esi_1": "CRITICAL — Immediate Provider Required",
  "er.alert.red_flag_detected": "RED FLAG DETECTED",
  "er.alert.critical_lab": "CRITICAL LAB VALUE",
  "er.alert.allergy_conflict": "ALLERGY CONFLICT — BLOCKED",
  "er.alert.medication_blocked": "MEDICATION BLOCKED FOR SAFETY",
  "er.alert.pregnancy_risk": "PREGNANCY RISK — Teratogen",
  "er.alert.override_required": "OVERRIDE REQUIRED (provide reason)"
}
```

### ar.json (excerpt)
```json
{
  "er.board.title": "لوحة الطوارئ",
  "er.board.active": "نشط",
  "er.board.waiting": "منتظر",
  "er.board.critical": "حرج",

  "er.triage.title": "تقييم الفرز",
  "er.triage.chief_complaint": "الشكوى الرئيسية",
  "er.triage.chief_complaint_placeholder": "مثل: ألم صدر، ألم بطن",
  "er.triage.hpi": "تاريخ المرض الحالي",
  "er.triage.pain_score": "درجة الألم (0-10)",
  "er.triage.vitals": "العلامات الحيوية",
  "er.triage.esi_level": "مستوى ESI",
  "er.triage.red_flags": "العلامات الحمراء",
  "er.triage.recommended_action": "الإجراء الموصى به",
  "er.triage.workup": "الفحوصات المقترحة",
  "er.triage.override": "تجاوز",
  "er.triage.override_reason": "سبب التجاوز (إلزامي)",
  "er.triage.ai_confidence": "ثقة الذكاء الاصطناعي",

  "er.encounter.arrival_time": "وقت الوصول",
  "er.encounter.triage_time": "وقت الفرز",
  "er.encounter.provider_first_seen": "أول رؤية للطبيب",
  "er.encounter.disposition_time": "وقت القرار",
  "er.encounter.mrn": "الرقم الطبي",
  "er.encounter.chief_complaint": "الشكوى الرئيسية",
  "er.encounter.status": "الحالة",

  "er.esi.level_1": "إنعاش (1)",
  "er.esi.level_2": "طارئ (2)",
  "er.esi.level_3": "عاجل (3)",
  "er.esi.level_4": "أقل عاجلة (4)",
  "er.esi.level_5": "غير عاجلة (5)",

  "er.action.resus_bay": "إلى غرفة الإنعاش",
  "er.action.acute_bed": "إلى سرير حاد",
  "er.action.fast_track": "إلى المسار السريع",
  "er.action.observation": "إلى الملاحظة",
  "er.action.immediate_discharge": "خروج",

  "er.vitals.bp_systolic": "ضغط انقباضي",
  "er.vitals.bp_diastolic": "ضغط انبساطي",
  "er.vitals.heart_rate": "نبض القلب",
  "er.vitals.respiratory_rate": "معدل التنفس",
  "er.vitals.spo2": "تشبع الأكسجين",
  "er.vitals.temperature_c": "الحرارة (°م)",
  "er.vitals.pain_score": "درجة الألم",
  "er.vitals.gcs": "مقياس غلاسكو",

  "er.red_flag.cardiac_arrest": "سكتة قلبية",
  "er.red_flag.stemi": "احتشاء مع ارتفاع ST",
  "er.red_flag.stroke": "سكتة دماغية",
  "er.red_flag.sepsis": "تعفن الدم",
  "er.red_flag.anaphylaxis": "صدمة تحسسية",
  "er.red_flag.trauma": "صدمة كبيرة",
  "er.red_flag.aaa": "تمدد الشريان الأبهر المتمزق",
  "er.red_flag.ectopic": "حمل خارج الرحم المتمزق",
  "er.red_flag.torsion_testicular": "التواء الخصية",
  "er.red_flag.meningococcemia": "تجرثم الدم السحائي",
  "er.red_flag.status_epilepticus": "صرع مستمر",
  "er.red_flag.dka": "حماض كيتوني سكري",

  "er.code.blue": "كود أزرق",
  "er.code.stemi": "كود STEMI",
  "er.code.stroke": "كود سكتة",
  "er.code.trauma": "كود صدمة",
  "er.code.sepsis": "كود تعفن",
  "er.code.mass_casualty": "حادث جماعي",
  "er.code.activate": "تفعيل الكود",
  "er.code.activation_reason": "سبب التفعيل",
  "er.code.team_notified": "تم إخطار الفريق",

  "er.medication.drug": "الدواء",
  "er.medication.dose": "الجرعة",
  "er.medication.route": "الطريق",
  "er.medication.frequency": "التكرار",
  "er.medication.indication": "الاستطباب",
  "er.medication.five_rights": "التحقق من 5 حقوق",
  "er.medication.right_patient": "المريض الصحيح",
  "er.medication.right_drug": "الدواء الصحيح",
  "er.medication.right_dose": "الجرعة الصحيحة",
  "er.medication.right_route": "الطريق الصحيح",
  "er.medication.right_time": "الوقت الصحيح",
  "er.medication.allergy_alert": "تنبيه حساسية",
  "er.medication.interaction_alert": "تفاعل دوائي",
  "er.medication.renal_dose_alert": "تعديل جرعة كلوية",
  "er.medication.pregnancy_alert": "خطر حمل",
  "er.medication.override": "تجاوز مع السبب",

  "er.disposition.admit": "قبول",
  "er.disposition.discharge": "خروج",
  "er.disposition.transfer": "تحويل",
  "er.disposition.ama": "خروج ضد النصيحة",
  "er.disposition.deceased": "وفاة",
  "er.disposition.observation": "ملاحظة",
  "er.disposition.destination": "الوجهة",
  "er.disposition.discharge_instructions": "تعليمات الخروج",
  "er.disposition.follow_up_provider": "طبيب المتابعة",
  "er.disposition.follow_up_timeframe": "وقت المتابعة",
  "er.disposition.ama_witness": "شاهد الخروج",

  "er.kpi.door_to_provider": "من الباب إلى الطبيب",
  "er.kpi.lwbs": "خروج قبل الكشف",
  "er.kpi.door_to_balloon": "من الباب إلى البالون (STEMI)",
  "er.kpi.door_to_needle": "من الباب إلى الإبرة (سكتة)",
  "er.kpi.sepsis_bundle": "حزمة التعفن <ساعة",
  "er.kpi.critical_callback": "استدعاء القيم الحرجة <30د",
  "er.kpi.los": "مدة البقاء",

  "er.alert.esi_1": "حرج — يلزم طبيب فوراً",
  "er.alert.red_flag_detected": "تم اكتشاف علامة حمراء",
  "er.alert.critical_lab": "قيمة مخبرية حرجة",
  "er.alert.allergy_conflict": "تعارض حساسية — محظور",
  "er.alert.medication_blocked": "الدواء محظور للسلامة",
  "er.alert.pregnancy_risk": "خطر حمل — ماسخ",
  "er.alert.override_required": "التجاوز مطلوب (اذكر السبب)"
}
```

## i18n Strategy
- All UI text in `namaweb/public/locales/en.json` + `ar.json`
- Loaded on app start, cached
- RTL support: automatic `dir="rtl"` for AR
- Number/date formats: per locale
- Pluralization: ICU MessageFormat (or simpler `{count, plural, ...}`)

---
*Section 05.c of ER-001. Owner: PM + i18n. L4 validated.*
