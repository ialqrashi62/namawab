// filepath: gen_tier101.js
const fs = require('fs');
const mounts = [
  { mount: '/api/peds_neonatal_v2', engine: 'tier101_peds_neonatal_528_engine', fns: ['nicu_admission','respiratory_distress','neonatal_sepsis','feeding_growth','neonatal_jaundice'] },
  { mount: '/api/peds_picu_v2', engine: 'tier101_peds_picu_529_engine', fns: ['picu_admission','peds_septic_shock','status_asthmaticus','dka_pediatric','status_epilepticus'] },
  { mount: '/api/peds_cardiology_v2', engine: 'tier101_peds_cardiology_530_engine', fns: ['congenital_heart_disease','echocardiogram_peds','fetal_echo','peds_arrhythmia','chd_followup'] },
  { mount: '/api/peds_pulmonology_v2', engine: 'tier101_peds_pulmonology_531_engine', fns: ['asthma_peds','cf_followup','bronchopulmonary_dysplasia','sleep_peds','peds_bronchoscopy'] },
  { mount: '/api/peds_development_v2', engine: 'tier101_peds_development_532_engine', fns: ['developmental_screening','autism_screening','learning_disability','adhd_assessment','behavioral_assessment'] },
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
  {"patient_id":"P0","admission_id":"pa_0","gestational_age_weeks":28,"birth_weight_grams":950,"apgar_1":4,"apgar_5":6,"respiratory_support":"cpap","icu_days":35,"outcome":"improved","provider":"neo_001"},
  {"patient_id":"P1","assessment_id":"pr_1","respiratory_rate":70,"retractions":3,"grunting":true,"oxygen_required":true,"cpap_pressure":6,"imaging":"chest_xray","diagnosis":"rds","provider":"neo_001"},
  {"patient_id":"P2","assessment_id":"ps_2","age_days":7,"temperature":38.5,"blood_culture":"positive","antibiotic":1,"wbc":25000,"crp":45,"platelet":85000,"outcome":"stable","provider":"neo_001"},
  {"patient_id":"P3","assessment_id":"pf_3","age_days":14,"feeding_type":"breast","weight_gain_g_day":25,"calorie_intake":120,"growth_percentile":15,"concerns":"none","provider":"neo_001"},
  {"patient_id":"P4","assessment_id":"nj_4","age_days":3,"bilirubin":15,"phototherapy":true,"exchange_transfusion":false,"etiology":"physiologic","provider":"neo_001"},
  {"patient_id":"P5","admission_id":"pa_5","age_years":3,"weight_kg":14,"diagnosis":"respiratory_failure","oxygen_requirement":1,"icu_days":5,"severity":"critical","provider":"picu_001"},
  {"patient_id":"P6","episode_id":"ps_6","capillary_refill":4,"lactate":5.5,"fluid_resuscitation_ml_kg":60,"vasopressors":true,"antibiotic_time_min":30,"source":"pneumonia","provider":"picu_001"},
  {"patient_id":"P7","episode_id":"sa_7","age_years":7,"respiratory_rate":45,"oxygen_saturation":88,"peak_expiratory_flow":120,"severity":"severe","treatment":"magnesium","provider":"picu_001"},
  {"patient_id":"P8","episode_id":"dk_8","age_years":12,"blood_glucose":550,"ph":7.1,"bicarbonate":10,"ketones":4.5,"fluid_resuscitation_pct":10,"treatment":"insulin","provider":"picu_001"},
  {"patient_id":"P9","episode_id":"se_9","age_years":4,"seizure_type":"generalized","duration_min":15,"benzodiazepine_dose":2,"phenytoin_load":1,"imaging":"ct","etiology":"febrile","provider":"picu_001"},
  {"patient_id":"P10","assessment_id":"ch_10","chd_type":"vsd","defect_size":5,"pulmonary_hypertension":false,"eisenmenger":false,"treatment":"observation","saturation":96,"provider":"pc_001"},
  {"patient_id":"P11","study_id":"ep_11","ef":55,"septal_defect":"vsd","valve_function":1,"shunt_direction":"left_right","pressure_gradients":35,"pericardial_effusion":0,"provider":"pc_001"},
  {"patient_id":"P12","study_id":"fe_12","gestational_age_weeks":22,"cardiac_axis":65,"four_chamber_view":"normal","outflow_tracts":1,"abnormalities":"none","reassurance":1,"provider":"pc_001"},
  {"patient_id":"P13","visit_id":"pa_13","arrhythmia_type":"svt","heart_rate":220,"treatment":"adenosine","successful":true,"recurrence":0,"long_term_therapy":1,"provider":"pc_001"},
  {"patient_id":"P14","visit_id":"ch_14","age_years":5,"surgical_repair":"vsd_closure","surgery_age_months":8,"residual_defect":false,"ef":55,"medications_count":1,"growth_percentile":50,"provider":"pc_001"},
  {"patient_id":"P15","visit_id":"as_15","age_years":6,"asthma_severity":"moderate","controller":"ics","reliever":2,"exacerbations_12mo":3,"act_score":18,"step":3,"provider":"pp_001"},
  {"patient_id":"P16","visit_id":"cf_16","age_years":12,"fev1_pred":80,"fvc_pred":85,"exacerbations_12mo":2,"infections":"pa","modulator_therapy":true,"bmi_percentile":50,"provider":"pp_001"},
  {"patient_id":"P17","visit_id":"bd_17","gestational_age_weeks":26,"oxygen_weaning":"in_progress","current_oxygen_pct":30,"cpap_days":35,"weight_gain":"appropriate","neurodevelopment":"follow_up","provider":"pp_001"},
  {"patient_id":"P18","study_id":"ps_18","age_years":8,"ahi":3,"min_spo2":88,"etiology":"adenotonsillar","treatment":"watchful_waiting","reassess_months":6,"provider":"pp_001"},
  {"patient_id":"P19","procedure_id":"pb_19","age_years":5,"indication":"recurrent_pneumonia","findings":"normal","bal_cell_count":120,"biopsies_taken":2,"complications":0,"provider":"pp_001"},
  {"patient_id":"P20","assessment_id":"ds_20","age_months":18,"fine_motor":1,"gross_motor":1,"language":1,"social":1,"concerns":"none","screening":"asq","provider":"pd_001"},
  {"patient_id":"P21","assessment_id":"as_21","age_months":24,"mchat_score":8,"eye_contact":"poor","pointing":0,"repetitive_behavior":true,"sensory_concerns":true,"referral":"developmental","provider":"pd_001"},
  {"patient_id":"P22","assessment_id":"ld_22","age_years":8,"academic_score":75,"iq_score":85,"reading_disability":true,"math_disability":true,"iep":true,"accommodations":3,"provider":"pd_001"},
  {"patient_id":"P23","assessment_id":"ad_23","age_years":9,"vanderbilt_score":4,"inattention":1,"hyperactivity":1,"impulsivity":1,"school_performance":2,"treatment":"medication","provider":"pd_001"},
  {"patient_id":"P24","assessment_id":"be_24","age_years":5,"behavior_count":5,"severity":"moderate","family_history":true,"referral":"psychology","therapy":"play","medication":0,"provider":"pd_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
