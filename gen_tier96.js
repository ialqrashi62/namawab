// filepath: gen_tier96.js
const fs = require('fs');
const mounts = [
  { mount: '/api/diabetes_t1dm_v2', engine: 'tier96_diabetes_t1dm_503_engine', fns: ['t1dm_management','insulin_pump','cgm_review','dka_management','hypoglycemia'] },
  { mount: '/api/diabetes_t2dm_v2', engine: 'tier96_diabetes_t2dm_504_engine', fns: ['t2dm_management','oral_agents','injectable_therapy','diabetes_complications','gestational_diabetes'] },
  { mount: '/api/thyroid_extended_v2', engine: 'tier96_thyroid_extended_505_engine', fns: ['thyroid_nodule','thyroid_cancer','thyroid_surgery','rai_therapy','thyroid_eye'] },
  { mount: '/api/adrenal_pituitary_v2', engine: 'tier96_adrenal_pituitary_506_engine', fns: ['adrenal_incidentaloma','pheochromocytoma','cushings','pituitary_adenoma','adrenal_insufficiency'] },
  { mount: '/api/bone_metabolic_v2', engine: 'tier96_bone_metabolic_507_engine', fns: ['osteoporosis_screening','osteoporosis_treatment','hyperparathyroidism','pagets','vitamin_d'] },
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
  {"patient_id":"E0","visit_id":"ed_0","hba1c":7.2,"time_in_range":75,"hypoglycemia_episodes":2,"total_daily_dose":45,"insulin_regimen":"pump","c_peptide":0.1,"antibody_gad":120,"provider":"en_001"},
  {"patient_id":"E1","device_id":"ed_1","pump_type":"tandem","cgm_type":"dexcom","basal_rate":0.8,"carb_ratio":10,"correction_factor":50,"auto_mode":true,"time_in_range_pct":78,"provider":"en_001"},
  {"patient_id":"E2","session_id":"ed_2","days_reviewed":14,"average_glucose":142,"gmi":6.9,"cv":32,"tar_pct":15,"tbr_pct":3,"time_in_range":82,"provider":"en_001"},
  {"patient_id":"E3","episode_id":"ed_3","blood_glucose":450,"ph":7.2,"bicarbonate":14,"anion_gap":18,"ketones":4.5,"icu_admission":true,"icu_days":2,"time_to_resolution_hrs":18,"provider":"en_001"},
  {"patient_id":"E4","episode_id":"ed_4","blood_glucose":42,"severity":"severe","glucagon_given":true,"emergency_dept":true,"hospitalization":false,"cause":"insulin_dose_error","treatment_time_min":15,"provider":"en_001"},
  {"patient_id":"E5","visit_id":"ed_5","hba1c":7.5,"fasting_glucose":140,"bmi":32,"blood_pressure":135,"ldl":105,"drug_classes":"metformin","number_of_meds":2,"provider":"en_001"},
  {"patient_id":"E6","assessment_id":"ed_6","metformin":"on","sulfonylurea":"off","dpp4":"off","sglt2":"on","glp1":"on","hba1c_improvement":1.2,"weight_change_kg":-3,"provider":"en_001"},
  {"patient_id":"E7","plan_id":"ed_7","glp1_type":"semaglutide","dose_mg":1.0,"weight_loss_kg":6,"hba1c_improvement":1.5,"gi_side_effects":true,"adherence_pct":90,"provider":"en_001"},
  {"patient_id":"E8","assessment_id":"ed_8","hba1c":7.8,"egfr":75,"urine_albumin":45,"retinal_exam":1,"monofilament_test":1,"disease_duration_years":8,"cardiovascular_disease":true,"complication_count":3,"provider":"en_001"},
  {"patient_id":"E9","assessment_id":"ed_9","gestational_age_weeks":28,"fasting_glucose":100,"one_hr_glucose":180,"two_hr_glucose":155,"management":"insulin","fetal_weight_percentile":55,"delivery_mode":1,"provider":"en_001"},
  {"patient_id":"E10","assessment_id":"th_10","nodule_size_cm":1.2,"tirads":"4a","tsh":2.5,"tsh_normalized":2.5,"fna_done":true,"fna_result":"benign","provider":"en_001"},
  {"patient_id":"E11","assessment_id":"th_11","cancer_type":"papillary","tumor_size_cm":1.5,"nodes_involved":2,"distant_metastasis":0,"tnm_stage":"I","treatment":"surgery","provider":"en_001"},
  {"patient_id":"E12","procedure_id":"th_12","surgery_type":"total_thyroidectomy","glands_removed":1,"hospital_days":2,"complications":0,"recurrent_laryngeal":"intact","path_size_cm":1.8,"provider":"en_001"},
  {"patient_id":"E13","therapy_id":"th_13","dose_mci":100,"pre_tsh":35,"pre_tg":5,"post_tg_6mo":0.5,"dry_eye_severity":1,"sialadenitis":1,"provider":"en_001"},
  {"patient_id":"E14","assessment_id":"th_14","cas_score":3,"proptosis_mm":22,"optical_neuropathy":false,"diplopia":1,"smoking":false,"iv_steroid":false,"orbital_decompression":false,"provider":"en_001"},
  {"patient_id":"E15","assessment_id":"ap_15","lesion_size_cm":2.5,"hu_density":12,"cortisol_autonomous":false,"aldo_renin_ratio":15,"normetanephrine":120,"imaging":"ct","recommendation":"followup_imaging","provider":"en_001"},
  {"patient_id":"E16","assessment_id":"ap_16","normetanephrine":850,"metanephrine":420,"urine_catecholamines":450,"systolic_bp":180,"diastolic_bp":110,"alpha_blockade":true,"surgical_resection":true,"histology_confirmed":1,"provider":"en_001"},
  {"patient_id":"E17","assessment_id":"ap_17","cortisol_24h_urine":480,"late_night_salivary":0.4,"low_dose_dex":80,"acth":85,"cause":"pituitary","imaging_findings":1,"comorbidities":3,"provider":"en_001"},
  {"patient_id":"E18","assessment_id":"ap_18","adenoma_type":"prolactinoma","size_mm":12,"macroadenoma":true,"chiasmal_compression":false,"hypopituitarism":false,"surgery_required":0,"provider":"en_001"},
  {"patient_id":"E19","assessment_id":"ap_19","cortisol_morning":3,"acth":120,"cosyntropin_stim":4,"sodium":128,"potassium":5.5,"metabolic_acidosis":1,"hydrocortisone_replacement":true,"provider":"en_001"},
  {"patient_id":"E20","assessment_id":"op_20","age":68,"frax_score":18,"t_score_lumbar":-2.5,"t_score_hip":-2.0,"t_score_femoral_neck":-1.8,"prior_fracture":false,"vitamin_d":32,"risk_category":"moderate","provider":"en_001"},
  {"patient_id":"E21","plan_id":"op_21","bisphosphonate":"alendronate","duration_months":36,"denosumab":"off","teriparatide":"off","bmd_change":4.5,"fracture_reduction":40,"atypical_fracture":false,"provider":"en_001"},
  {"patient_id":"E22","assessment_id":"hp_22","calcium":11.2,"ionized_calcium":5.5,"pth":120,"vitamin_d":25,"urine_calcium":320,"kidney_stones":1,"bone_disease":1,"treatment":"surgery","provider":"en_001"},
  {"patient_id":"E23","assessment_id":"pg_23","alkaline_phosphatase":650,"bones_involved":"pelvis_spine","skeletal_burden":3,"pain":true,"fracture":false,"bisphosphonate_response":3,"zoledronic_acid":1,"provider":"en_001"},
  {"patient_id":"E24","assessment_id":"vd_24","vitamin_d_25":18,"vitamin_d_1_25":45,"parathyroid_hormone":85,"calcium":9.2,"phosphate":3.2,"severity":"insufficiency","replacement_ie":2000,"provider":"en_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
