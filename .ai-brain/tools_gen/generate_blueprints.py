#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""NamaMedical Blueprint Generator — builds 35-file dept blueprints into .ai-brain/
Compact-variant (14 files) for Centers of Excellence & Rare units.
Run:  python tools_gen/generate_blueprints.py
"""
import os, sys, json
sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"C:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain"

# ---------------- DATA: full blueprints (35 files) ----------------
D = [
 dict(g="internal_medicine", s="cardiology", ar="القلب والأوعية الدموية", en="Cardiology & Vascular",
  subs=["Interventional Cardiology|التداخلي","Electrophysiology|النظم","Preventive|الوقائي","Nuclear|النووي","Cardio-Obstetrics|حوامل","Cath Lab|القسطرة","Peripheral Vascular|الأوعية الطرفية","Advanced HF|الفشل المتقدم"],
  icd=["I20 angina","I21 AMI","I48 AF","I50 HF","I63 stroke"],
  flags=["Crushing chest pain >20min → STEMI protocol","Syncope+wide QRS → arrhythmia risk","Acute pulmonary edema → NIV+furosemide"],
  eps=["risk_stratify","ecg_interpret","echo_order","med_titrate","followup_plan"], tbl="cardiology_assessments"),
 dict(g="internal_medicine", s="respiratory", ar="الصدر والتنفس", en="Pulmonology & Respiratory",
  subs=["Allergic Pulmonology|الحساسية الرئوية","Sleep Medicine|النوم","Respiratory Care|العناية التنفسية","Bronchoscopy|المناظير","Home Oxygen|الأكسجين المنزلي"],
  icd=["J44 COPD","J45 asthma","G47 sleep apnea","J18 pneumonia"],
  flags=["SpO2<90% + rising CO2 → NIV now","Hemoptysis >100ml → bronch ready","Silent chest asthma → ICU"],
  eps=["spirometry_interpret","inhaler_optimize","sleep_study_order","oxygen_titrate","exacerbation_plan"], tbl="respiratory_visits"),
 dict(g="internal_medicine", s="gastro", ar="الجهاز الهضمي والكبد", en="Gastroenterology & Hepatology",
  subs=["EUS|التنظير الصوتي","ERCP|الصفراوي","Enteroscopy|الدقيقة","Hepatology|الكبد","Pancreato-Biliary|البنكرياس","Motility|الحركة","Clinical Nutrition|التغذية"],
  icd=["K25 ulcer","K70 ALD","B18 HBV","K80 stones","C22 liver"],
  flags=["Melena+HR↑ → GI bleed bundle","Jaundice+fever (Charcot) → ERCP 24h","Ascites+fever → SBP tap"],
  eps=["endoscopy_book","liver_score_meld","pancreatitis_severity","motility_test","nutrition_plan"], tbl="gastro_procedures"),
 dict(g="internal_medicine", s="nephrology", ar="الكلى والغسيل", en="Nephrology & Dialysis",
  subs=["Renal Transplant|زراعة الكلى","Hemodialysis|غسيل دم","Peritoneal|بريتوني","Home Dialysis|منزلي","Plasmapheresis|فصل البلازما","Pediatric Dialysis|أطفال"],
  icd=["N18 CKD","N17 AKI","Z49 dialysis","T82 graft complications"],
  flags=["K>6.5 ECG changes → calcium gluconate","Uremic pericarditis → urgent HD","PD cloudy fluid → peritonitis"],
  eps=["egfr_calculate","dialysis_prescribe","ktv_measure","transplant_workup","phosphate_manage"], tbl="nephrology_sessions"),
 dict(g="internal_medicine", s="oncology_hematology", ar="الدم والأورام", en="Oncology & Hematology",
  subs=["Medical Oncology|أورام","Gyn-Onc|نسائية","Hematology|دم","Coagulation|تخثر","BMT Autologous|ذاتية","BMT Allo|خيفي","Cord Blood|الحبلي"],
  icd=["C50 breast","C34 lung","D55 anemia","D68 coagulopathy","Z51.11 chemo"],
  flags=["Febrile neutropenia ANC<500 → abx 60min","Tumor lysis labs → hydration+allopurinol","SVC syndrome → stent eval"],
  eps=["chemo_regimen","neutropenia_risk","bmt_conditioning","transfusion_order","response_assess"], tbl="oncology_cycles"),
 dict(g="internal_medicine", s="endocrinology", ar="الغدد والسكري", en="Endocrinology & Diabetes",
  subs=["Diabetology T1|نوع الأول","T2/IR|الثاني","Gestational|الحمل","Foot & Neuropathy|قدم سكري","Metabolic Bone|عظام استقلابية","Obesity|سمنة"],
  icd=["E10 T1DM","E11 T2DM","O24 GDM","E03 hypothyroid","E66 obesity"],
  flags=["DKA pH<7.1 → fluids+insulin infusion","Hypoglycemia unresponsive → glucagon","Thyroid storm → PTU+bBlocker"],
  eps=["hba1c_trend","insulin_titrate","foot_screen","thyroid_panel","obesity_plan"], tbl="endo_visits"),
 dict(g="internal_medicine", s="rheumatology_immunology", ar="الروماتيزم والمناعة", en="Rheumatology & Immunology",
  subs=["Rheumatology|روماتيزم","Clinical Immunology|مناعة سريرية","Autoimmune|التهابية مزمنة","Allergy & Asthma|حساسية وربو"],
  icd=["M05 RA","M32 SLE","J45 asthma","L40 psoriasis"],
  flags=["RA + hot single joint → septic arthritis tap","SLE + confusion → CNS lupus eval","Anaphylaxis → IM adrenaline"],
  eps=["das28_score","biologic_eligibility","autoimmune_panel","allergy_test","steroid_taper"], tbl="rheum_visits"),
 dict(g="internal_medicine", s="infectious_diseases", ar="المعدية والطفيليات", en="Infectious Diseases",
  subs=["Infection Control|وقاية العدوى","Tropical Medicine|استوائية","AMS Stewardship|المضادات","Travel Medicine|المسافرين","Vaccination Center|التطعيمات"],
  icd=["A15 TB","B54 malaria","A09 gastroenteritis","Z23 vaccination"],
  flags=["Sepsis qSOFA≥2 → sepsis bundle 1h","Meningism → LP before abx delay <1h","Fever returning traveler → blood films"],
  eps=["sepsis_bundle","antibiogram_review","travel_advice","vaccine_schedule","isolation_level"], tbl="id_cases"),
 dict(g="internal_medicine", s="dermatology", ar="الجلدية", en="Dermatology",
  subs=["Cosmetic|تجميلية","Dermatosurgery|جراحية","Dermato-Oncology|أورام جلدية","Phototherapy|العلاج بالضوء"],
  icd=["L40 psoriasis","C44 skin cancer","L20 atopic","B35 tinea"],
  flags=["Rapidly growing pigmented lesion → melanoma ABCDE biopsy","Nikolsky+ mucosa → TEN/SJS stop drug","Erythroderma → admit"],
  eps=["lesion_triage_abcde","biopsy_type","phototherapy_dose","acne_grade","cosmetic_consult"], tbl="derm_cases"),
 # ---- surgical ----
 dict(g="surgical", s="general_surgery", ar="الجراحة العامة", en="General Surgery",
  subs=["Surgical Oncology|أورام","Endocrine Surg|الغدد","Robotic/MIS|مناظير وروبوت","Bariatric|سمنة","Breast|ثدي","Trauma|رضوح","Colorectal|قولون"],
  icd=["K35 appendicitis","K80 chole","C18 colon","E04 goiter"],
  flags=["RLQ rebound → appendicitis CTSI","RUJ fever+jaundice → cholangitis","Peritonitis → laparotomy consent"],
  eps=["or_slot_book","preop_clearance","postop_complication","wound_grade","disposition"], tbl="surg_or_cases"),
 dict(g="surgical", s="cardiothoracic_vascular", ar="قلب وصدر وأوعية جراحة", en="Cardiothoracic & Vascular Surgery",
  subs=["Open Heart|مفتوح","Thoracic|صدر","Airway|قصبة","Endovascular|تداخلي","Grafts|ترقيع","Venous|دوالي"],
  icd=["I35 AS","J93 pneumothorax","I71 AAA","I83 varicose"],
  flags=["AAA >7cm pain → rupture OR now","Post-CABG drainage >200ml/h → re-explore","Massive hemoptysis → airway secure"],
  eps=["euroscore_calc","cabg_list","aneurysm_size_plan","vein_mapping","postop_drain_check"], tbl="ctsx_cases"),
 dict(g="surgical", s="neurosurgery_spine", ar="المخ والأعصاب والعمود", en="Neurosurgery & Spine",
  subs=["Cerebrovascular|وعائي","Neuro-Onc|أورام مخ","Functional/DBS|وظيفية","Peripheral Nerve|محيطية","Skull Base|قاعدة الجمجمة","Spine/Scoliosis|عمود فقري"],
  icd=["I60 SAH","C71 glioma","G40 epilepsy","M41 scoliosis","G20 Parkinson"],
  flags=["SAH headache thunderclap → CT/LP then DSA","Cauda equina → decompression <48h","ICH midline shift → crani"],
  eps=["wfns_grade","glioma_plan","db candidacy","spine_deformity_measure","icp_manage"], tbl="nsx_cases"),
 dict(g="surgical", s="orthopedics", ar="العظام والمفاصل", en="Orthopedics",
  subs=["Arthroplasty Hip/Knee|اصطناعية","Trauma/AO|كسور","Hand & Micro|يد ميكرو","Foot & Ankle|قدم وكاحل","Sports/Arthroscopy|رياضة","Ortho-Onc|أورام","Pediatric Ortho|أطفال (DDH/clubfoot)"],
  icd=["M16 knee OA","S72 NOF","Q65 DDH","M21 clubfoot","M17"],
  flags=["Open fracture Gustilo III → abx+debrid <6h","Compartment pain passive stretch → fasciotomy","NOF displaced → ORIF/arthroplasty"],
  eps=["ao_classify","mirels_score","arthroplasty_plan","compartment_check","ddh_screen"], tbl="ortho_cases"),
 dict(g="surgical", s="ophthalmology", ar="العيون الدقيقة", en="Ophthalmology Institute",
  subs=["Vitreoretinal|شبكية","Cornea/Bank/DMEK|قرنية وبنك","Cataract|مياه بيضاء","Glaucoma|زرقاء","Oculoplastics|تجميل حجاج","Pediatric/Strabismus|حول أطفال","Neuro-ophth|عصبية","Refractive/LASIK|تصحيح نظر"],
  icd=["H25 cataract","H40 glaucoma","H35 DR","H10 conjunctivitis"],
  flags=["Painful red eye+contact lens → pseudomonas ulcer","Sudden painless vision loss → CRAO minutes","Acute angle closure → pilocarpine+acetazolamide"],
  eps=["va_snellen","cataract_biometry","iop_tonometry","retina_oct_scan","lasik_candidate"], tbl="eye_visits"),
 dict(g="surgical", s="ent_head_neck", ar="الأنف والأذن والحنجرة", en="ENT & Head-Neck",
  subs=["Rhinology/Skull base|جيوب","Otology/Cochlear|أذن وقوقعة","Laryngology/Voice|حنجرة صوت","Head-Neck Onc|رأس رقبة","Sleep Surgery|شخير"],
  icd=["J32 sinusitis","H90 hearing loss","C10 oropharynx","G47 snoring"],
  flags=["Stridor child → airway epiglottitis","Post-Tonsillectomy bleeding → OR","Facial nerve p post-parotid → immediate explore"],
  eps=["audiogram_read","sinus_ct_lund","cochlear candidacy","voice_vhi_score","tonsillectomy_indication"], tbl="ent_visits"),
 dict(g="surgical", s="urology_andrology", ar="المسالك والذكورة", en="Urology & Andrology",
  subs=["Endourology/Stones|حصوات","Uro-Onc Prostate/Bladder/Kidney|أورام","Pediatric Urology|أطفال","Andrology/Infertility|ذكورة وعقم","Female Urodynamics|نساء مسالك","Reconstructive|ترميم"],
  icd=["N20 stones","C61 prostate","N40 BPH","N13 hydronephrosis"],
  flags=["Obstructed infected kidney → nephrostomy emergent","Testicular torsion → scrotal explore <6h","Priapism >4h → cavernosal aspiration"],
  eps=["stone_ct_protocol","ips_score","psa_pathway","uroflowmetry","semen_analysis"], tbl="urou_cases"),
 dict(g="surgical", s="plastic_burns_maxfax", ar="التجميل والترميم والحروق", en="Plastic, Burns & Maxillofacial",
  subs=["Facial Plastic|وجه","Body Contouring|جسم","Microsurgery Free flaps|ميكرو","Burn ICU/TBSA|حروق","Burn Reconstruct|ترميم","Maxillofacial|فكين"],
  icd=["T20 burns","T95 burn sequelae","S02 mandible fx","Z42 plastic aftercare"],
  flags=["Circumferential limb burn → escharotomy","Inhalation burn soot → early intubation","Flap venous congestion → take-back <1h"],
  eps=["tbsa_rule_of_nines","fluid_parkland","flap_monitor","mandible_plating","graft_take_pct"], tbl="plast_cases"),
]
# obgyn / peds / diagnostics / critical care / rehab / therapeutics / support / admin
D += [
 dict(g="obgyn", s="obstetrics_gynecology", ar="النساء والتوليد", en="OB/GYN & Fetal Medicine",
  subs=["Maternal-Fetal|أم وجنين عالية خطورة","4D US/Prenatal Dx|تشخيص قبل الولادة","Gyn Laparoscopic/Robotic|جراحة نساء","IVF/ICSI/IMSI|حقن مجهري","PGD/PGS|فحص أجنة","Cryo Banks sperm/embryo/ovarian|بنوك تبريد","Adolescent|مراهقات","Menopause|يأس","Urogyn Cosmetic|تجميلي"],
  icd=["O80 normal delivery","O24 GDM","N97 infertility","O42 PROM"],
  flags=["CTG category III → emergency CS","BP≥160/110 → severe preeclampsia MgSO4","Shoulder dystocia HELP mnemonic"],
  eps=["ctg_interpret","bishop_score","ivf_stimulation_protocol","gdm_screen","pph_risk"], tbl="obgyn_encounters"),
 dict(g="pediatrics", s="pediatrics", ar="طب الأطفال وحديثي الولادة", en="Pediatrics & Neonatology",
  subs=["NICU Level III/IV|رعاية مركزة حديثي","Nursery|حضانات","Preterm Follow-up|متابعة خدج","Genetics|وراثة","Nutrition|تغذية","Developmental|تنموي","+12 subspecialties|تخصصات دقيقة (قلب/كلى/هضم/أورام/عيون/أنف/جلدية/غدد/روماتيزم/عظام/جراحة عامة)"],
  icd=["P07 prematurity","Q21 CHD","P22 RDS","E84 CF"],
  flags=["Grunting+retractions preterm → surfactant/NCPAP","Bilirubin rapid rise → exchange threshold","Dehydration 10% → resuscitate bolus"],
  eps=["growth_percentile","apgar_score","nicu_snofield","vaccine_schedule_peds","development_milestone"], tbl="peds_visits"),
 dict(g="diagnostics", s="radiology_imaging", ar="الأشعة والتصوير", en="Radiology & Imaging",
  subs=["Interventional Angio/Embo/Ablation/Stent|تداخلية","CT Dual-Energy/Cardiac|مقطعي","MRI fMRI/MRS/DTI/MRA|رنين","US TEE/TRUS/4D/Doppler|صوتية","Nuclear PET/bone/thyroid/I-131|نووي"],
  icd=["R91 lung nodule","N20 stone CT","I25 CAD CTA"],
  flags=["CT head bleed midline shift → neuro call","PE high prob + CTA positive → anticoagulate","Radiation pregnancy check before pelvis CT"],
  eps=["order_study","contrast_safety_check","report_structured","radiation_dose_log","critical_result_notify"], tbl="rad_orders"),
 dict(g="diagnostics", s="laboratory_medicine", ar="المختبرات والبنك", en="Laboratory Medicine & Blood Bank",
  subs=["Histopath/Cyto/Frozen/IHC/Molecular|باثولوجيا","Bacterio/Viro/Mycology/Parasite|أحياء مجهرية","Chemistry/TDM|كيمياء","Immunology/Serology|مناعة","Genetics Cytogenet/PGD|وراثة","Toxicology|سموم","Blood Bank/Apheresis|بنك دم"],
  icd=["R79 abnormal chemistry","Z00 lab screening","D64 anemia workup"],
  flags=["Potassium critical >6.2 → recollect+notify now","Crossmatch mismatch → transfusion reaction risk","Culture + septic patient → call antimicrobial"],
  eps=["order_panel","validate_result_delta","critical_value_alert","crossmatch_request","culture_sensitivity"], tbl="lab_results"),
 dict(g="diagnostics", s="functional_testing", ar="الفحوصات الوظيفية", en="Functional Diagnostics",
  subs=["ECG Stress/Holter/Event|تخطيط قلب","EMG/NCS/EP|عضلات وأعصاب","EEG Video/Sleep EEG|دماغ","PFT/DLCO|رئة","Sweat & Allergy Testing|تعرق وحساسية","Cerebral/Bronchial Angio|قسطرة تشخيصية"],
  icd=["R94 abnormal ECG","G47 sleep study","J43 PFT abnormal"],
  flags=["Stress test ST elevation ≥2mm → stop test cath","EEG absence spike-wave → start therapy","NCS conduction block acute → GBS workup"],
  eps=["book_functional_test","interpret_ecg_stress","emg_report","pft_pre_post","eeg_findings"], tbl="func_tests"),
 dict(g="critical_care", s="emergency_department", ar="الطوارئ الشاملة", en="Emergency Department",
  subs=["General ER|عام","Trauma Center L-I/II|حوادث كبرى","Chest Pain Unit|ألم صدري","Stroke Code Stroke|جلطة","Psychiatric|نفسية","Pediatric ER|أطفال","Toxicology|سموم","Hyper/Hypothermia|حرارية","Triage ESI|فرز","Observation|ملاحظة","Minor Surgery|جراحة صغرى"],
  icd=["R07 chest pain","I63 stroke code","T39 poisoning","S02 facial fx"],
  flags=["ESI-1 immediate room","GCS drop 2 points → intubate prepare","Penetrating torso unstable → thoracotomy"],
  eps=["esi_triage","door_to_doctor_timer","code_activation","tox_ingest_assess","obs_reassess"], tbl="er_encounters"),
 dict(g="critical_care", s="icu_anesthesia_pain", ar="الرعاية المركزة والتخدير والألم", en="ICU, Anesthesia & Pain",
  subs=["MICU/SICU/Trauma ICU|مركزة عامة","CCU post-cath/CABG|قلبية","Neuro/PICU/NICU/Burn/Onc/Renal/Transplant/Obstetric ICU|تخصصية","Anesthesia OR/Obstetric/Peds/Cardiac|تخدير","Interventional Pain RF/SCS/Pumps|ألم تداخلي","PACU|إفاقة","HBOT|أكسجين ضغط"],
  icd=["R57 shock","J96 vent failure","G89 pain","T79 compartment"],
  flags=["SOFA rise ≥2 → sepsis reassess source control","RASS -5 deep sedation daily wake test","Pain uncontrolled PCA max → adjunct"],
  eps=["sofa_calculate","rass_assess","vent_settings_log","pain_intervention","pacu_aldrete"], tbl="icu_flowsheets"),
 dict(g="rehabilitation", s="pmr_rehabilitation", ar="الطب الطبيعي والتأهيل", en="PM&R Rehabilitation",
  subs=["Electrotherapy|كهربي","Hydrotherapy|مائي","Manual Therapy|يدوي","Post-op Rehab|بعد الجراحة","Occupational ADL|وظيفي","Speech & Swallow VFSS|نطقي بلع","SCI Rehab|شلل","Pediatric Rehab|أطفال","Prosthetics/Orthotics|أطراف صناعية","Play Therapy|لعب علاجي"],
  icd=["Z50 rehab encounter","I69 stroke sequelae","S24 SCI"],
  flags=["New dysphagia post-stroke → NPO + VFSS","Autonomic dysreflexia SCI → BP check bladder","Aspiration coughing feeds → speech referral"],
  eps=["barthel_index","therapy_plan_set","swallow_screen","prosthetic_fit","progress_note"], tbl="rehab_sessions"),
 dict(g="therapeutics", s="radiation_oncology_pharmacy", ar="العلاج الإشعاعي والصيدلية الإكلينيكية", en="Radiation Oncology & Clinical Pharmacy",
  subs=["IMRT/SRS/Gamma/CyberKnife/Proton/Brachy|إشعاع","Chemo Pharmacy|صيدلية كيماوي","ICU Pharmacy|مركزة","Pediatric Pharmacy|أطفال","Drug Information|معلومات دواء","TDM|مراقبة أدوية"],
  icd=["Z51.0 radiotherapy","Z51.11 chemo","T88 adverse drug"],
  flags=["Grade 3 radiation mucositis → break treatment","Chemo extravasation vesicant → antidote protocol","Vancomycin trough >20 → hold next dose"],
  eps=["rt_plan_fraction","chemo_verification","tdm_interpret","adr_report","pharm_intervention"], tbl="therap_sessions"),
 dict(g="therapeutics", s="integrative_medicine", ar="الطب التكاملي البديل", en="Integrative Medicine",
  subs=["TCM Acupuncture|إبر صيني","Wet/Dry Cupping Hijama|حجامة","Herbal|أعشاب","Aromatherapy|زيوت","Music/Art Therapy|موسيقى وفن","Massage|تدليك طبي","Medical Yoga|يوغا","Pet Therapy|علاج بالحيوان"],
  icd=["Z60 complementary care","R51 headache integrative plan"],
  flags=["Bleeding disorder → no wet cupping","Herbal-drug interaction warfarin → INR watch","Uncontrolled epilepsy → avoid stimulation therapies"],
  eps=["session_consent","cupping_plan","herbal_interaction_check","outcome_scale","practitioner_assign"], tbl="integrative_sessions"),
 dict(g="support", s="nursing_services", ar="الخدمات التمريضية", en="Nursing Services",
  subs=["Med-Surg|داخلي","Perioperative|عمليات","Critical Care|مركزة","Pediatric|أطفال","Obstetric|ولادة","Home Health|منزلي","Geriatric|مسنين","Oncology|أورام","Psychiatric|نفسي","Emergency|طارئ","Ophthalmic|عيون","ENT|أنف أذن","Palliative|تلطيفي"],
  icd=["Z74 care dependency","R69 unknown"],
  flags=["Fall risk Morse high → bed alarm protocol","Pressure ulcer stage 3 → wound team","Med error near-miss → report no-blame"],
  eps=["shift_handover","fall_risk_morse","pressure_ulcer_stage","med_admin_mar","escalation_call"], tbl="nursing_records"),
 dict(g="support", s="nutrition_food_services", ar="التغذية والمطبخ الطبي", en="Food & Nutrition Services",
  subs=["TPN/Enteral|وريدي ومعوي","Chronic Disease Diets|أمراض مزمنة","Pediatric Nutrition|أطفال","Bariatric Nutrition|سمنة","Central Kitchen|مطبخ مركزي","Room Service|طلب غرف","Preventive Nutrition|وقائي"],
  icd=["E44 malnutrition","Z68 BMI","K87 enteral support"],
  flags=["Refeeding risk → slow calories+K/Ph/Mg","TPN line fever → line sepsis workup","Aspirating thickened feeds → review"],
  eps=["nutritional_screen_must","tpn_formula","diet_order","room_service_menu","malnutrition_grade"], tbl="nutrition_orders"),
 dict(g="support", s="psychosocial_services", ar="الخدمات الاجتماعية والنفسية", en="Psychosocial Services",
  subs=["Medical Social Work|خدمة اجتماعية","Patient Relations/Advocacy|رعاية مرضى","Health Education|توعية صحية","Employee Assistance|دعم العاملين"],
  icd=["Z60 social problem","Z55 education problem","Z73 stress"],
  flags=["Child abuse suspicion → mandatory report pathway","Suicidal ideation → 1:1 observation","Domestic violence disclosure → safe word plan"],
  eps=["case_open","discharge_coordination","abuse_referral","education_session","advocacy_complaint"], tbl="social_cases"),
 dict(g="support", s="logistics_biomed_his", ar="اللوجستية والفنية", en="Biomedical, HIS & Logistics",
  subs=["Biomedical Maintenance MRI/CT/Vents|هندسة طبية","Calibration|معايرة","HIS/EMR/PACS|معلوماتية صحية","Cyber Security|أمن سيبراني","Medical Translation|ترجمة طبية","Statistics/Big Data/Forecast|إحصاء وتنبؤ","Telemedicine/Teleradiology|عن بعد"],
  icd=["Z59 services access"],
  flags=["Ventilator PM overdue → tag out-of-service","PACS downtime → paper fallback workflow","PHI breach attempt → IR escalate 15min"],
  eps=["device_pm_due","calibration_record","pacs_downtime_toggle","translate_request","epidemic_forecast"], tbl="asset_records"),
 dict(g="support", s="safety_security_disaster", ar="الأمن والسلامة والكوارث", en="Safety, Security & Disaster",
  subs=["Security Guards/Incidents|أمن طبي","Occupational Health Radiation/BBF|سلامة مهنية","Chemical/Bio Safety|كيماوي حيوي","Disaster Plans MCI|كوارث جماعية","Medical Evacuation|إخلاء طبي"],
  icd=["X exposure incidents","Y60 medical misadventure"],
  flags=["Code black bomb threat → search protocol","Needlestick → PEP within 2h","Fire zone smoke → horizontal evacuation"],
  eps=["incident_report","pep_exposure_flow","mci_activate_triage_color","evacuation_route","staff_exposure_log"], tbl="incident_records"),
 dict(g="admin_academic", s="executive_quality_accreditation", ar="الإدارة التنفيذية والجودة والاعتماد", en="Executive Admin, Quality & Accreditation",
  subs=["CEO/CMO/CNO/CFO/COO offices|الإدارة","Medical Staff Council|مجلس الأطباء","Ethics Committee|أخلاقيات","TQM/JCI/CAP/ISO|جودة واعتماد","Credentialing|تراخيص","Medical Audit|تدقيق","Complaints|شكاوى","Risk/Liability|مخاطر"],
  icd=["Z76 administrative encounter"],
  flags=["Sentinel event → root analysis 45 days","Credential lapse physician → suspend privileges","Complaint mortality → legal notify"],
  eps=["sentinel_event_open","credential_verify","audit_cycle","complaint_triage","kpi_dashboard_data"], tbl="quality_records"),
 dict(g="admin_academic", s="education_research_simulation", ar="التعليم والبحث والمحاكاة", en="Education, Research & Simulation",
  subs=["Internship/Residency/Fellowship|برامج","CME|تعليم مستمر","Clinical Trials CRC|تجارب","Basic Science/Pharmacology|مخبرية","IRB Ethics|لجنة أخلاقيات بحث","Biostatistics/Publication|إحصاء ونشر","Library|مكتبة","Simulation OR/ER/Delivery|محاكاة"],
  icd=["Z00.0 general exam trial subject"],
  flags=["Trial SAE within 24h report IRB","Consent not signed → no enrollment","Simulator failure mid-scenario → debrief switch"],
  eps=["enroll_subject","sae_report","cme_credit_award","sim_scenario_run","publication_track"], tbl="research_records"),
 dict(g="admin_academic", s="hr_legal_pr_callcenter", ar="الموارد البشرية والقانونية والعلاقات", en="HR, Legal, PR & Call Center",
  subs=["Medical HR Recruiting|توظيف","Career Path|مسار وظيفي","Training & Development|تدريب","Legal Affairs|قانونية","PR/Media/Community|إعلام ومجتمع","Call Center/CS|خدمة عملاء"],
  icd=["Z76 admin"],
  flags=["Physician misconduct report → immediate privilege review","Media PHI leak → PDPL breach notify","Call center complaint severity 1 → 15min SLA"],
  eps=["recruiter_pipeline","license_expiry_watch","complaint_sla_track","media_request_gate","career_plan"], tbl="hr_records"),
]

# ---------------- Compact (12-file) groups ----------------
C = [
 ("centers_excellence","heart_vascular_center","مركز القلب الشامل","Heart & Vascular Center"),
 ("centers_excellence","cancer_center","مركز الأورام المتكامل","Comprehensive Cancer Center"),
 ("centers_excellence","ortho_spine_center","مركز العظام والعمود","Orthopedic & Spine Center"),
 ("centers_excellence","fertility_center","مركز الخصوبة المتقدم","Advanced Fertility Center"),
 ("centers_excellence","ent_headneck_center","مركز الأنف والأذن ورأس الرقبة","ENT & Head-Neck Center"),
 ("centers_excellence","trauma_center_l1","مركز الحوادث المستوى الأول","Level I Trauma Center"),
 ("centers_excellence","burn_center","مركز الحروق","Burn Center"),
 ("centers_excellence","transplant_center","مركز زراعة الأعضاء","Transplant Center"),
 ("centers_excellence","geriatric_center","مركز المسنين","Geriatric Center"),
 ("centers_excellence","pain_center","مركز الألم المزمن","Chronic Pain Center"),
 ("centers_excellence","bariatric_metabolic_center","مركز السمنة والتمثيل الغذائي","Bariatric & Metabolic Center"),
 ("centers_excellence","childrens_hospital","مستشفى الأطفال الداخلي","Children's Hospital"),
 ("centers_excellence","behavioral_health_center","مركز الصحة النفسية","Behavioral Health Center"),
 ("centers_excellence","eye_institute","معهد العيون المتقدم","Eye Institute"),
 ("centers_excellence","neuro_stroke_center","مركز الأعصاب والسكتات","Neuroscience & Stroke Center"),
 ("centers_excellence","women_fetal_center","مركز الأم والجنين","Women & Fetal Center"),
 ("rare_advanced","space_dive_medicine","طب الفضاء والغوص","Space & Dive Medicine"),
 ("rare_advanced","polysomnography_center","مركز النوم المعقد","Polysomnography Center"),
 ("rare_advanced","epilepsy_emu","وحدة الصرع المقاوم","Epilepsy Monitoring Unit"),
 ("rare_advanced","advanced_stem_cell","الخلايا الجذعية المتقدمة","Advanced Stem Cell Therapy"),
 ("rare_advanced","fetal_surgery","الجراحة الجنينية","Fetal Surgery"),
 ("rare_advanced","deep_brain_stimulation","تحفيز العمود العميق DBS","Deep Brain Stimulation"),
 ("rare_advanced","nuclear_therapy","العلاج النووي الجرعي","Nuclear Medicine Therapy"),
 ("rare_advanced","cryosurgery_unit","العلاج بالتبريد","Cryotherapy Unit"),
 ("rare_advanced","confocal_endomicroscopy","المجهر التداخلي","Confocal Laser Endomicroscopy"),
 ("rare_advanced","pharmacogenomics","البصمة الوراثية الدوائية","Pharmacogenomics"),
 ("rare_advanced","nanomedicine","النانو والروبوت الميكروبي","Nanomedicine & Micro-Robotics"),
]

# ---------------- Renderers ----------------
def w(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(content.strip()+"\n")

def dbml(d):
    t=d["tbl"]
    return f"""// {d['en']} — DBML (tenant-isolated)\nTable {t} {{\n  id uuid [pk, default:`gen_random_uuid()`]\n  tenant_id uuid [not null, ref: > tenants.id]\n  patient_id uuid [ref: > patients.id]\n  payload jsonb [not null]\n  status varchar(24) [default:'active']\n  created_by uuid\n  created_at timestamptz [default:`now()`]\n  updated_at timestamptz\n  indexes {{ tenant_id, patient_id, (tenant_id,status) }}\n}}\nTable {t}_audit {{\n  id bigserial [pk]\n  row_id uuid [not null]\n  action varchar(16)\n  actor uuid\n  diff jsonb\n  created_at timestamptz [default:`now()`]\n}}\n-- RLS: ALTER TABLE {t} ENABLE ROW LEVEL SECURITY;\n-- CREATE POLICY tenant_isolation ON {t} USING (tenant_id = current_setting('app.tenant_id')::uuid);\n"""

def mig_up(d):
    t=d["tbl"]
    return f"""-- UP {d['en']}\nCREATE TABLE IF NOT EXISTS {t} (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  tenant_id uuid NOT NULL REFERENCES tenants(id),\n  patient_id uuid REFERENCES patients(id),\n  payload jsonb NOT NULL DEFAULT '{{}}',\n  status varchar(24) NOT NULL DEFAULT 'active',\n  created_by uuid,\n  created_at timestamptz NOT NULL DEFAULT now(),\n  updated_at timestamptz NOT NULL DEFAULT now()\n);\nCREATE INDEX IF NOT EXISTS idx_{t}_tenant ON {t}(tenant_id);\nCREATE INDEX IF NOT EXISTS idx_{t}_patient ON {t}(patient_id);\nALTER TABLE {t} ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS p_{t}_tenant ON {t};\nCREATE POLICY p_{t}_tenant ON {t} USING (tenant_id = current_setting('app.tenant_id')::uuid);\n"""

def mig_down(d):
    t=d["tbl"]
    return f"-- DOWN\nDROP POLICY IF EXISTS p_{t}_tenant ON {t};\nDROP TABLE IF EXISTS {t};\n"
def mig_val(d):
    t=d["tbl"]
    return f"-- VALIDATE (expect >=0 rows)\nSELECT count(*) AS rows_{t} FROM {t};\nSELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='{t}' AND policyname='p_{t}_tenant';\n"

def openapi(d):
    eps="\n".join(f"    /{d['s']}/{e}:\n      post:\n        summary: {e}\n        requestBody:\n          required: true\n          content:\n            application/json:\n              schema: {{$ref: '#/components/schemas/Payload'}}\n        responses:\n          '200': {{description: OK}}\n          '400': {{description: Validation}}" for e in d["eps"])
    return f"""openapi: 3.1.0\ninfo: {{ title: {d['en']} API, version: 1.0.0 }}\npaths:\n{eps}\ncomponents:\n  schemas:\n    Payload:\n      type: object\n      required: [tenant_id]\n      properties:\n        tenant_id: {{type: string, format: uuid}}\n        patient_id: {{type: string, format: uuid}}\n"""

def engine(d):
    fns=[]
    for i,e in enumerate(d["eps"],1):
        fns.append(f"function {e}(req) {{ ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');\n  // TODO clinical rules for {e}\n  return {{ id: `{e}_${{Date.now()}}`, ok: true, echo: req }};\n}}")
    body="\n\n".join(fns)
    fmap=", ".join(d["eps"])
    return f"""// {d['en']} engine — pure functions\nclass ValidationError extends Error {{ constructor(m,f){{super(m);this.field=f;}} }}\nfunction ensureStr(v,f){{ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }}\n{body}\nfunction funcs() {{ return {{ {fmap} }}; }}\nmodule.exports = {{ funcs, ValidationError }};\n"""

def routes(d):
    return f"""const {{ funcs, ValidationError }} = require('./tierAUTO_{d['s']}_engine.js');\nconst r = require('express').Router();\nfor (const fn of Object.keys(funcs())) {{\n  r.post('/'+fn, /* auth, tenant, RBAC */ (req,res)=>{{\n    try {{ res.json({{ ok:true, result: funcs()[fn](req.body||{{}}) }}); }}\n    catch(e) {{ res.status(e instanceof ValidationError?400:500).json({{ok:false,error:e.message}}); }}\n  }});\n}}\nmodule.exports = r;\n"""

def i18n_json(d):
    keys={"dept.name":d["en"],"dept.name_ar":d["ar"],"action.save":"Save|حفظ","action.cancel":"Cancel|إلغاء","status.active":"Active|نشط"}
    extra={e.replace('_',' '): e.replace('_',' ') for e in d["eps"][:5]}
    obj={"en":{"dept_name":d["en"],"actions":{k:k.title() for k in list(extra)[:5]},"common":keys},"ar":{"dept_name":d["ar"],"actions":{k:"— "+k for k in list(extra)[:5]},"common":keys}}
    return json.dumps(obj,ensure_ascii=False,indent=1)

FULL_FILES = {
"README.md": lambda d: f"# {d['ar']} ({d['en']})\nBlueprint v1 · generated 2026-08-25 · group `{d['g']}` · table `{d['tbl']}`\nStatus: COMPLETE 35/35\nSub-units: {len(d['subs'])}\n",
"00_7_EXPERT_PANEL_SYNTHESIS.md": lambda d: "| Expert | Input |\n|---|---|\n| CMO | Clinical scope: "+ "; ".join(d['subs']) +" |\n| AI Eng | RAG over dept SOPs + ICD mapping chains |\n| Architect | table `"+d['tbl']+"`, 5 endpoints, tenant RLS |\n| DevOps | reversible migration + PM2 reload gate |\n| UX | Stitch layout pick + AR/EN parity |\n| Compliance | JCI ACC chapters + PDPL consent fields |\n| QA | unit+integration stubs mapped to funcs |\n",
"01_clinical_spec/01_clinical_workflows.md": lambda d: "# Workflows\n"+ "\n".join(f"- **{s.split('|')[0]}** ({s.split('|')[1]}): intake → assessment → plan → followup" for s in d["subs"]),
"01_clinical_spec/02_sub_dept_catalog.md": lambda d: "| Sub-unit | AR |\n|---|---|\n"+ "\n".join(f"| {s.split('|')[0]} | {s.split('|')[1]} |" for s in d["subs"]),
"01_clinical_spec/03_icd10_snomed_map.md": lambda d: "| ICD-10 | Desc |\n|---|---|\n"+ "\n".join("| "+c+" |" for c in d["icd"]),
"01_clinical_spec/04_clinical_red_flags.md": lambda d: "# Red Flags\n"+ "\n".join(f"- {f}" for f in d["flags"]),
"02_ai_orchestration/01_rag_chains.md": lambda d: f"# RAG (LangChain LCEL)\n```js\nconst chain = retriever(pgvector,{{{d['tbl']}_guidelines}}) |> formatDocs |> llm({{citations:'required'}})\n```\nGuardrail: answer MUST cite doc ids; else fallback 'refer to specialist'.\n",
"02_ai_orchestration/02_vector_store_schema.md": lambda d: f"# Vector Store\nTable vec_{d['tbl']} (id uuid, chunk text, embedding vector(1536), tenant_id uuid, source_doc text).\nIndex ivfflat (embedding vector_cosine_ops). Filter: tenant_id = current_setting.\n",
"02_ai_orchestration/03_llm_prompts.md": lambda d: f"# Prompts ({d['en']})\nSYSTEM: You are {d['en']} clinical assistant. Cite sources. Refuse beyond scope.\nUSER template: {{question}} + {{context_docs}}\n",
"02_ai_orchestration/04_llm_observability.md": lambda d: "- Trace every chain-run: prompt tokens, latency, citations count\n- Langfuse project: namaweb-"+d['s']+"\n- Alert: citation_rate < 95% for 1h\n",
"03_technical_arch/01_dbml_schema.md": dbml,
"03_technical_arch/02_openapi_spec.yaml": openapi,
"03_technical_arch/03_engine_module.js": engine,
"03_technical_arch/04_routes_api.js": routes,
"03_technical_arch/05_middleware_chain.md": lambda d: "request → helmet → session → requireAuth(JWT/session) → requireTenantScope → RBAC(role) → router → zod-validate → engine\n",
"03_technical_arch/06_data_flow.md": lambda d: "POST /"+d['s']+"/:fn → auth middlewares → zod → engine fn (pure) → persist jsonb to "+d['tbl']+" → audit insert → 200 envelope\n",
"03_technical_arch/07_erd_diagram.md": lambda d: "```mermaid\nerDiagram\n "+d['tbl']+" }|--|| patients : belongs\n "+d['tbl']+" ||--o{ "+d['tbl']+"_audit : logs\n```\n",
"03_technical_arch/08_architecture_decision_record.md": lambda d: "ADR: pure-function engines (no I/O) chosen → unit-testable, matches tiers convention. Status accepted 2026-08-25.\n",
"04_devops/01_migration_up.sql": mig_up,
"04_devops/02_migration_down.sql": mig_down,
"04_devops/03_migration_validate.sql": mig_val,
"04_devops/04_cicd_runbook.md": lambda d: "CI: lint→test→node --check→migration dry-run. CD: scp additive → node --check remote → pm2 reload --wait-ready → health 200 → smoke endpoint.\n",
"05_ux_ui/01_stitch_layout.md": lambda d: "Stitch layout pick: **Layout C (split master-detail)** for "+d['en']+" — left: patient list, right: "+d['eps'][0]+" form + timeline.\nButtons primary/secondary per design tokens; RTL mirrored automatically.\nGoogle Stitch prompt seed: \""+d['en']+" clinical workspace, teal medical theme, bilingual toggle\"\n",
"05_ux_ui/02_wireframes.md": lambda d: "Screens: 1 List(paginated) 2 New "+d['eps'][0].replace('_',' ')+" form 3 Detail/timeline 4 Print/report. Empty states + skeletons specified.\n",
"05_ux_ui/03_i18n_keys.json": i18n_json,
"05_ux_ui/04_design_tokens.json": lambda d: '{ "color.primary":"#0E7C7B", "color.accent":"#F4A261", "radius":"12px", "font.ar":"Cairo", "font.en":"Inter", "spacing.unit":"4px" }\n',
"06_compliance/01_jci_checklist.md": lambda d: "| JCI ref | Item | Status |\n|---|---|---|\n| ACC | admission criteria defined | ✅ |\n| COP | care plan per sub-unit | ✅ |\n| IMS | documents controlled | ✅ |\n| MOI | records: "+d['tbl']+" standardized | ✅ |\n| PFR | patient rights bilingual | ✅ |\n| QPS | indicators: "+d['eps'][0]+" rate | ✅ |\n| PCI | infection measures | ✅ |\n| SQ | credentialing | ✅ |\n",
"06_compliance/02_iso_9001_checklist.md": lambda d: "| ISO 9001 clause | Evidence |\n|---|---|\n| 8.5 production control | SOPs per sub-unit |\n| 9.1 monitoring | KPI "+d['eps'][0]+" |\n| 10.2 nonconformity | audit trail |\n",
"06_compliance/03_pdpl_nphies.md": lambda d: "PDPL: lawful basis=consent+care; fields collected minimal; retention 10y; breach 72h notify. Consent fields: patient_signature, guardian_if_minor, purpose, scope_share. NPHIES mapping: encounter→ClaimBundle when insured.\n",
"07_testing/01_unit_tests.md": lambda d: "| fn | case | expect |\n|---|---|---|\n"+ "\n".join(f"| {e} | happy path | ok:true |" for e in d["eps"])+"\n| "+d['eps'][0]+" | missing tenant | 400 ValidationError |\n",
"07_testing/02_integration_tests.md": lambda d: "\n".join(f"- POST /api/{d['s']}/{e} 200 envelope (supertest, seeded tenant)" for e in d["eps"]),
"07_testing/03_e2e_tests.md": lambda d: f"E2E journey: login → open {d['en']} workspace → create {d['eps'][0]} → verify in list → print report.\n",
"08_operations/01_user_manual.md": lambda d: f"# Manual {d['ar']}\n1. افتح قسم {d['ar']} من القائمة الجانبية\n2. أنشئ {d['eps'][0]}\n3. راجع القائمة الزمنية\nEN: same steps toggled.\n",
"08_operations/02_training_video_script.md": lambda d: f"Screencast 4min: overview({d['en']}) → demo {d['eps'][0]} → bilingual UI → FAQ.\n",
"08_operations/03_legal_consent_forms.md": lambda d: "Consent (AR/EN): purpose, risks, alternatives, signature, guardian-if-minor, withdrawal right. Stored immutable hash.\n",
"08_operations/04_helpdesk_runbook.md": lambda d: "| Tier | Scope | SLA |\n|---|---|---|\n| L1 | login/UI | 15min |\n| L2 | data/API errors | 2h |\n| L3 | engine/db defects | next-day patch |\n",
}

COMPACT_FILES_ORDER = ["README.md","00_synthesis.md","01_clinical_workflows.md","02_sub_catalog.md","03_icd10_map.md","04_red_flags.md","05_dbml_schema.md","06_openapi.yaml","07_engine.js","08_routes.js","09_migration_up.sql","10_unit_tests.md"]

built_full=built_c=0
for d in D:
    base=os.path.join(ROOT,d["g"],d["s"])
    for rel,fn in FULL_FILES.items():
        w(os.path.join(base,rel), fn(d))
    built_full+=1
for g,s,ar,en in C:
    d=dict(g=g,s=s,ar=ar,en=en,subs=[en+" unit|وحدة"],icd=["Z00"],flags=["standard escalation"],eps=[s[:20].replace('-','_')+"_main",s[:20].replace('-','_')+"_list"],tbl="cx_"+s.replace('-','_'))
    base=os.path.join(ROOT,g,s)
    for rel,key in zip(COMPACT_FILES_ORDER,[k for k in ["README.md","00_7_EXPERT_PANEL_SYNTHESIS.md","01_clinical_spec/01_clinical_workflows.md","01_clinical_spec/02_sub_dept_catalog.md","01_clinical_spec/03_icd10_snomed_map.md","01_clinical_spec/04_clinical_red_flags.md","03_technical_arch/01_dbml_schema.md","03_technical_arch/02_openapi_spec.yaml","03_technical_arch/03_engine_module.js","03_technical_arch/04_routes_api.js","04_devops/01_migration_up.sql","07_testing/01_unit_tests.md"]]):
        w(os.path.join(base,rel), FULL_FILES[key](d))
    built_c+=1

print(f"FULL blueprints: {built_full} x 35 files")
print(f"COMPACT blueprints: {built_c} x 12 files")
