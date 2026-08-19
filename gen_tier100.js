// filepath: gen_tier100.js
const fs = require('fs');
const mounts = [
  { mount: '/api/obgyn_mfm_v2', engine: 'tier100_obgyn_mfm_523_engine', fns: ['prenatal_visit','high_risk_pregnancy','preeclampsia','gestational_diabetes_mgmt','delivery_summary'] },
  { mount: '/api/obgyn_gyn_onc_v2', engine: 'tier100_obgyn_gyn_onc_524_engine', fns: ['ovarian_cyst','cervical_cancer_screening','endometrial_cancer','ovarian_cancer_staging','gyn_chemotherapy'] },
  { mount: '/api/obgyn_rei_v2', engine: 'tier100_obgyn_rei_525_engine', fns: ['infertility_workup','ovulation_induction','ivf_cycle','icsi','recurrent_pregnancy_loss'] },
  { mount: '/api/obgyn_menopause_v2', engine: 'tier100_obgyn_menopause_526_engine', fns: ['menopause_assessment','hrt_therapy','urogynecology','abnormal_uterine_bleeding','endometriosis'] },
  { mount: '/api/obgyn_reproductive_v2', engine: 'tier100_obgyn_reproductive_527_engine', fns: ['contraception_counseling','iud_insertion','sti_screening','pelvic_pain','gyne_surgery'] },
];
for (const m of mounts) {
  const e = require('./' + m.engine);
  const fns = e.funcs();
  let r = `const express = require('express');\nconst router = express.Router();\nconst { funcs } = require('./${m.engine}');\nconst f = funcs();\nfunction asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }\n`;
  for (const fn of m.fns) {
    r += `router.post('/${fn}', asyncH((req, res) => { const r = f.${fn}(req.body || {}); res.json({ ok: true, op: '${fn}', result: r }); }));\n`;
  }
  r += `module.exports = router;\n`;
  const routerFile = m.engine.replace('_engine', '_router') + '.js';
  fs.writeFileSync(routerFile, r);
  console.log('Wrote', routerFile);
}
const bodies = [
  {"patient_id":"OB0","visit_id":"ov_0","gestational_age_weeks":24,"weight_kg":68,"bp_systolic":120,"bp_diastolic":75,"fundal_height":24,"fetal_heart_tone":"present","edema":1,"provider":"ob_001"},
  {"patient_id":"OB1","assessment_id":"hr_1","gestational_age_weeks":30,"risk_factors":"age_advanced","risk_score":5,"referrals_count":2,"ultrasounds_completed":4,"plan":"specialist_referral","provider":"ob_001"},
  {"patient_id":"OB2","assessment_id":"pe_2","bp_systolic":165,"bp_diastolic":105,"proteinuria":2,"edema":3,"platelets":85,"alt":85,"creatinine":1.3,"severity":"severe","treatment":"magnesium","provider":"ob_001"},
  {"patient_id":"OB3","assessment_id":"gd_3","gestational_age_weeks":28,"fasting_glucose":105,"postprandial_glucose":160,"hba1c":6.5,"treatment":"insulin","fetal_growth_percentile":55,"amniotic_fluid":12,"provider":"ob_001"},
  {"patient_id":"OB4","delivery_id":"ds_4","gestational_age_weeks":39,"delivery_mode":"spontaneous_vaginal","blood_loss_ml":300,"apgar_1":8,"apgar_5":9,"birth_weight_grams":3200,"complications":"none","provider":"ob_001"},
  {"patient_id":"OB5","assessment_id":"oc_5","cyst_size_cm":4,"cyst_type":"complex","ca125":45,"rims_wall":"thick","recommendation":"surgical","menopausal_status":false,"provider":"on_001"},
  {"patient_id":"OB6","assessment_id":"cc_6","age":35,"pap_result":"ascus","hpv_status":"positive","colposcopy_needed":"yes","follow_up_months":3,"provider":"on_001"},
  {"patient_id":"OB7","assessment_id":"ec_7","age":58,"endometrial_thickness":12,"biopsy_result":"hyperplasia","stage":1,"grade":"1","treatment":"surgery","provider":"on_001"},
  {"patient_id":"OB8","assessment_id":"ov_8","figo_stage":"3","tumor_size":7,"ca125_level":850,"ascites":2,"lymph_nodes_involved":3,"metastases":2,"treatment":"chemo","provider":"on_001"},
  {"patient_id":"OB9","cycle_id":"gc_9","regimen":"carbo_taxol","cycle_number":3,"dose_reduction_pct":10,"toxicity_grade":2,"response":1,"cycles_planned":6,"cycles_completed":3,"provider":"on_001"},
  {"patient_id":"OB10","assessment_id":"iw_10","duration_infertility":"over_2_years","amh_level":1.5,"fsh_day3":9.5,"antral_follicle_count":8,"semen_analysis":45,"tubal_patency":1,"ovulatory_cycles":12,"diagnosis":"tubal_factor","provider":"rei_001"},
  {"patient_id":"OB11","cycle_id":"oi_11","medication":"letrozole","dose_mg":5,"follicles_developed":2,"endometrial_thickness":9,"timed_intercourse":"yes","cancellation_reason":0,"pregnancy_test":0,"provider":"rei_001"},
  {"patient_id":"OB12","cycle_id":"iv_12","retrieved_oocytes":12,"mature_oocytes":10,"fertilized":9,"embryos_day3":8,"blastocysts_day5":5,"embryos_transferred":1,"embryos_frozen":3,"provider":"rei_001"},
  {"patient_id":"OB13","cycle_id":"ic_13","motile_sperm_count":2,"morphology":2,"oocytes_injected":8,"fertilization_rate":80,"embryos_formed":7,"pregnancy_test":0,"indications":"male_factor","provider":"rei_001"},
  {"patient_id":"OB14","assessment_id":"rp_14","losses_count":3,"gestational_age_lost":10,"uterine_anomaly":true,"karyotype_abnormal":false,"thrombophilia":true,"immunologic":false,"treatment":"aspirin","provider":"rei_001"},
  {"patient_id":"OB15","visit_id":"me_15","age":52,"amenorrhea_months":14,"fsh":65,"estradiol":25,"hot_flashes":7,"night_sweats":5,"sleep_disturbance":6,"stage":"menopause","provider":"men_001"},
  {"patient_id":"OB16","prescription_id":"hr_16","estrogen_type":"estradiol","dose_mg":1,"progesterone_added":true,"route":"transdermal","duration_months":24,"contraindications":false,"side_effects":1,"provider":"men_001"},
  {"patient_id":"OB17","assessment_id":"ug_17","complaint":"stress_incontinence","parity":3,"popq_stage":2,"pad_test":15,"pelvic_floor_therapy":"in_progress","treatment":"pt","provider":"men_001"},
  {"patient_id":"OB18","assessment_id":"ab_18","age":42,"pattern":"menorrhagia","endometrial_thickness":14,"fibroids":true,"polyp":false,"treatment":"hormonal","provider":"men_001"},
  {"patient_id":"OB19","assessment_id":"en_19","pain_score":8,"dysmenorrhea":9,"dyspareunia":7,"revised_asrm_score":65,"infertility":true,"treatment":"surgery","stage":"3","provider":"men_001"},
  {"patient_id":"OB20","visit_id":"cc_20","age":28,"parity":0,"preference":"hormonal","contraindications":0,"smoking":false,"medical_conditions":false,"method_chosen":"combined_oc","provider":"rh_001"},
  {"patient_id":"OB21","procedure_id":"iu_21","iud_type":"levonorgestrel","insertion_difficulty":1,"timing":1,"successful":true,"follow_up_weeks":6,"complications":0,"provider":"rh_001"},
  {"patient_id":"OB22","assessment_id":"st_22","chlamydia":false,"gonorrhea":false,"syphilis":false,"hiv_tested":true,"hpv_tested":true,"hepatitis_b":false,"trichomonas":"negative","partners_treated":0,"provider":"rh_001"},
  {"patient_id":"OB23","assessment_id":"pp_23","pain_score":7,"duration_months":6,"location":"bilateral","cyclic":true,"dyspareunia":true,"imaging":"ultrasound","treatment":"nsaid","provider":"rh_001"},
  {"patient_id":"OB24","procedure_id":"gs_24","procedure_type":"hysterectomy","approach":"laparoscopic","ebl_ml":200,"complications":0,"hospital_days":2,"specimen_pathology":1,"provider":"rh_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
