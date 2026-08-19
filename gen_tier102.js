// filepath: gen_tier102.js
const fs = require('fs');
const mounts = [
  { mount: '/api/surg_general_v2', engine: 'tier102_surg_general_533_engine', fns: ['hernia_repair','cholecystectomy','appendectomy','bowel_resection','soft_tissue'] },
  { mount: '/api/surg_oncology_v2', engine: 'tier102_surg_oncology_534_engine', fns: ['cancer_staging','tumor_resection','lymph_node_dissection','recurrent_cancer','palliative_surgery'] },
  { mount: '/api/surg_vascular_v2', engine: 'tier102_surg_vascular_535_engine', fns: ['aaa_repair','carotid_endarterectomy','bypass_graft','varicose_veins','dvt_treatment'] },
  { mount: '/api/surg_trauma_v2', engine: 'tier102_surg_trauma_536_engine', fns: ['trauma_assessment','damage_control','resuscitation','penetrating_trauma','blunt_trauma'] },
  { mount: '/api/surg_transplant_v2', engine: 'tier102_surg_transplant_537_engine', fns: ['transplant_evaluation','transplant_surgery','post_transplant','donor_workup','immunosuppression'] },
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
  {"patient_id":"S0","procedure_id":"hp_0","hernia_type":"inguinal","approach":"laparoscopic","mesh_used":true,"complications":0,"hospital_days":1,"recurrence_risk":1,"provider":"sg_001"},
  {"patient_id":"S1","procedure_id":"ch_1","approach":"laparoscopic","cholecystitis_severity":"mild","complications":0,"hospital_days":1,"conversion_to_open":false,"provider":"sg_001"},
  {"patient_id":"S2","procedure_id":"ap_2","approach":"laparoscopic","perforation":false,"complications":0,"hospital_days":1,"antibiotic_days":3,"provider":"sg_001"},
  {"patient_id":"S3","procedure_id":"br_3","indication":"cancer","resection_type":"right_hemicolectomy","anastomosis":"side_to_side","complications":1,"hospital_days":7,"lymph_nodes_resected":18,"provider":"sg_001"},
  {"patient_id":"S4","procedure_id":"st_4","tumor_type":"lipoma","size_cm":5,"approach":"excisional","complications":0,"pathology":"benign","follow_up_weeks":2,"provider":"sg_001"},
  {"patient_id":"S5","assessment_id":"cs_5","cancer_type":"colon","t_stage":3,"n_stage":1,"m_stage":0,"tnm_stage":"IIIB","resectability":"resectable","treatment":"surgery","provider":"so_001"},
  {"patient_id":"S6","procedure_id":"tr_6","tumor_size_cm":5,"margins":"negative","lymph_nodes_resected":15,"lymph_nodes_positive":2,"complications":1,"hospital_days":5,"provider":"so_001"},
  {"patient_id":"S7","procedure_id":"ln_7","lymph_node_count":25,"positive_count":4,"sentinel_node":true,"completion":1,"complications":0,"pathology":"metastases","provider":"so_001"},
  {"patient_id":"S8","assessment_id":"rc_8","recurrence_site":"liver","time_to_recurrence_months":18,"resectability":"resectable","treatment":"resection","prognosis":"fair","provider":"so_001"},
  {"patient_id":"S9","procedure_id":"ps_9","indication":"bowel_obstruction","procedure":"bypass","complications":1,"hospital_days":8,"symptom_relief":true,"provider":"so_001"},
  {"patient_id":"S10","procedure_id":"aa_10","aaa_size_cm":5.5,"approach":"endovascular","stent_graft":true,"complications":0,"hospital_days":3,"leak_endoleak":false,"provider":"sv_001"},
  {"patient_id":"S11","procedure_id":"ce_11","stenosis_pct":80,"approach":"open","shunt_used":true,"complications":0,"stroke_risk":1,"hospital_days":2,"provider":"sv_001"},
  {"patient_id":"S12","procedure_id":"bg_12","graft_type":"vein","indication":"claudication","patency_pct":90,"complications":0,"hospital_days":5,"ambulation":3,"provider":"sv_001"},
  {"patient_id":"S13","procedure_id":"vv_13","vein_type":"great_saphenous","approach":"endovenous","complications":0,"recurrence":0,"symptom_relief":3,"provider":"sv_001"},
  {"patient_id":"S14","procedure_id":"dv_14","dvt_location":"femoral","treatment":"anticoagulation","catheter_directed":false,"filter_placement":true,"duration_months":6,"complications":0,"provider":"sv_001"},
  {"patient_id":"S15","assessment_id":"ta_15","injury_severity_score":18,"mechanism":"motor_vehicle","primary_survey":"stable","gcs":15,"sbp":110,"resuscitation_required":false,"provider":"st_001"},
  {"patient_id":"S16","procedure_id":"dc_16","damage_control_done":true,"phase":1,"temperature":35,"coagulopathy":false,"lactate":3.5,"ic_done":true,"provider":"st_001"},
  {"patient_id":"S17","assessment_id":"rs_17","crystalloid_ml":2000,"blood_products_units":2,"vasopressors":false,"trali":false,"stabilization":true,"provider":"st_001"},
  {"patient_id":"S18","procedure_id":"pt_18","injury_type":"gunshot","location":"abdomen","organs_injured":2,"hemoperitoneum":true,"surgical_intervention":true,"complications":1,"provider":"st_001"},
  {"patient_id":"S19","procedure_id":"bt_19","injury_type":"mvc","organs_injured":3,"hemoperitoneum":false,"surgical_intervention":true,"complications":2,"iss":25,"provider":"st_001"},
  {"patient_id":"S20","evaluation_id":"te_20","organ":"kidney","meld_score":22,"psychiatric_clearance":true,"cardiac_clearance":true,"infection_screen":false,"drug_screen":false,"contraindications":0,"status":"listed","provider":"stx_001"},
  {"patient_id":"S21","procedure_id":"ts_21","organ":"liver","donor_type":"deceased_dbd","cold_ischemia_hours":8,"surgery_hours":7,"ebl_ml":2000,"complications":1,"icu_days":3,"provider":"stx_001"},
  {"patient_id":"S22","visit_id":"pt_22","days_post_transplant":90,"tacrolimus_level":8.5,"creatinine":1.4,"liver_function":1,"rejection_episodes":0,"infections_count":1,"medication_adherence":95,"graft_function":85,"provider":"stx_001"},
  {"patient_id":"S23","workup_id":"dw_23","donor_type":"living_related","age":42,"medical_clearance":true,"psychiatric_clearance":true,"organ_specific_tests":5,"outcome":"cleared","follow_up":3,"provider":"stx_001"},
  {"patient_id":"S24","prescription_id":"im_24","regimen":"tacrolimus_mmf","tacrolimus_dose":3,"mmf_dose":1000,"steroid_use":true,"infection_prophylaxis":2,"drug_levels":8,"side_effects":1,"provider":"stx_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
