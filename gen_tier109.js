// filepath: gen_tier109.js
const fs = require('fs');
const mounts = [
  { mount: '/api/pain_mgmt_v2', engine: 'tier109_pain_management_571_engine', fns: ['pain_assessment','opioid_prescribing','non_opioid_treatment','interventional_pain','pain_followup'] },
  { mount: '/api/palliative_care_v2', engine: 'tier109_palliative_care_572_engine', fns: ['palliative_assessment','symptom_management','goals_of_care','hospice_referral','bereavement'] },
  { mount: '/api/spine_care_v2', engine: 'tier109_spine_care_573_engine', fns: ['spine_assessment','conservative_treatment','spine_injection','spine_surgery','post_op_spine'] },
  { mount: '/api/sports_medicine_v2', engine: 'tier109_sports_medicine_574_engine', fns: ['sports_assessment','injury_treatment','rehabilitation','return_to_play','concussion'] },
  { mount: '/api/sleep_medicine_v2', engine: 'tier109_sleep_medicine_575_engine', fns: ['sleep_assessment','polysomnography','cpap_titration','insomnia_treatment','sleep_followup'] },
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
  {"patient_id":"P0","pain_id":"pa_0","pain_score":8,"duration_days":90,"location":"back","character":"chronic","nrs":8,"impact_function":7,"provider":"pm_001"},
  {"patient_id":"P1","prescription_id":"op_1","medication":"morphine","dose_mg":30,"frequency":"q12h","morphine_equivalent":30,"risk_score":3,"provider":"pm_001"},
  {"patient_id":"P2","treatment_id":"no_2","type":"physical_therapy","duration_weeks":6,"sessions":12,"response":"partial","pain_reduction_pct":40,"provider":"pm_001"},
  {"patient_id":"P3","procedure_id":"ip_3","type":"epidural","level":"l4_l5","approach":"interlaminar","steroid":"methylpred","complications":0,"provider":"pm_001"},
  {"patient_id":"P4","followup_id":"pf_4","patient_id":"P0","weeks_since_treatment":4,"pain_score":5,"functional_improvement":3,"adherence":1,"provider":"pm_001"},
  {"patient_id":"P5","assessment_id":"pl_5","prognosis":"limited","karnofsky":50,"comorbidities":5,"symptom_burden":8,"goals_of_care":"comfort","provider":"pc_001"},
  {"patient_id":"P6","management_id":"sm_6","symptoms":["dyspnea","pain"],"interventions":["opioid","oxygen"],"response":"improved","family_meeting":true,"provider":"pc_001"},
  {"patient_id":"P7","goals_id":"gc_7","patient_id":"P5","discussion":"code_status","code_status":"dnr","family_present":3,"decisions":["comfort","no_icu"],"provider":"pc_001"},
  {"patient_id":"P8","referral_id":"hr_8","patient_id":"P5","prognosis_months":3,"karnofsky":40,"hospice_eligible":true,"disposition":"home_hospice","family_agreement":1,"provider":"pc_001"},
  {"patient_id":"P9","bereavement_id":"br_9","family_member":"spouse","time_to_bereavement_weeks":4,"support_offered":true,"referral":"support_group","response":"accepted","provider":"pc_001"},
  {"patient_id":"P10","assessment_id":"sa_10","region":"lumbar","pain_score":6,"radiculopathy":true,"motor_deficit":false,"imaging":"mri","indication":"surgery","provider":"sp_001"},
  {"patient_id":"P11","treatment_id":"ct_11","type":"physical_therapy","duration_weeks":6,"exercises":8,"response":"improved","pain_reduction_pct":50,"provider":"sp_001"},
  {"patient_id":"P12","injection_id":"si_12","type":"facet_block","level":"l5_s1","approach":"posterior","steroid":"methylpred","relief_pct":75,"provider":"sp_001"},
  {"patient_id":"P13","surgery_id":"ss_13","procedure":"fusion","levels":["l4","l5"],"approach":"posterior","duration_min":240,"blood_loss_ml":300,"complications":0,"provider":"sp_001"},
  {"patient_id":"P14","postop_id":"po_14","surgery_id":"ss_13","hospital_days":3,"pain_score":5,"mobility":"ambulating","complications":0,"discharge":"home","provider":"sp_001"},
  {"patient_id":"P15","assessment_id":"sm_15","sport":"basketball","injury":"acl_tear","severity":"grade_3","side":"right","imaging":"med","provider":"sm_001"},
  {"patient_id":"P16","treatment_id":"it_16","injury":"acl_tear","treatment":"reconstruction","approach":"arthroscopic","graft":"bptb","duration_months":6,"provider":"sm_001"},
  {"patient_id":"P17","rehab_id":"rb_17","patient_id":"P16","phase":"phase_2","weeks_post_op":4,"rom_degrees":120,"strength_pct":70,"pain_score":3,"provider":"sm_001"},
  {"patient_id":"P18","clearance_id":"rt_18","patient_id":"P16","weeks_post_injury":32,"functional_tests":"y_balance","test_score":85,"cle_physician":"sm_doc","provider":"sm_001"},
  {"patient_id":"P19","concussion_id":"cn_19","mechanism":"impact","loss_of_consciousness":false,"symptoms":["headache","dizziness"],"scat_score":15,"return_protocol":"graduated","provider":"sm_001"},
  {"patient_id":"P20","assessment_id":"sl_20","chief_complaint":"insomnia","duration_months":6,"severity":"moderate","daytime_impairment":true,"sleep_hours":5,"provider":"sl_001"},
  {"patient_id":"P21","psg_id":"ps_21","study_date":"2026-09-01","ahi":35,"min_spo2":80,"total_sleep_time":300,"sleep_efficiency":0.85,"provider":"sl_001"},
  {"patient_id":"P22","titration_id":"cp_22","patient_id":"P21","device":"cpap","pressure_cm":10,"mask_type":"nasal","ahi_post":3,"compliance":1,"provider":"sl_001"},
  {"patient_id":"P23","treatment_id":"is_23","type":"cbt_i","duration_weeks":8,"sessions":8,"response":"improved","sleep_efficiency_change":0.15,"provider":"sl_001"},
  {"patient_id":"P24","followup_id":"sf_24","patient_id":"P21","weeks_since_diagnosis":12,"treatment_adherence":0.9,"symptom_improvement":7,"provider":"sl_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');