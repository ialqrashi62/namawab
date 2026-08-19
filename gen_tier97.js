// filepath: gen_tier97.js
const fs = require('fs');
const mounts = [
  { mount: '/api/neph_acute_v2', engine: 'tier97_neph_acute_508_engine', fns: ['aki_diagnosis','dialysis_initiation','ckd_staging','electrolyte_management','acid_base'] },
  { mount: '/api/neph_glomerular_v2', engine: 'tier97_neph_glomerular_509_engine', fns: ['glomerulonephritis','diabetic_nephropathy','polycystic_kidney','renal_transplant','renal_stones'] },
  { mount: '/api/neph_vascular_v2', engine: 'tier97_neph_vascular_510_engine', fns: ['renovascular','htn_renal','cardiorenal','hepatorenal','obstructive_uropathy'] },
  { mount: '/api/neph_dialysis_v2', engine: 'tier97_neph_dialysis_511_engine', fns: ['hemodialysis','peritoneal_dialysis','vascular_access','anemia_ckd','mineral_bone_ckd'] },
  { mount: '/api/neph_imaging_v2', engine: 'tier97_neph_imaging_512_engine', fns: ['renal_ultrasound','renal_ct','renal_biopsy','renal_nuclear','renal_angiography'] },
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
  {"patient_id":"N0","assessment_id":"na_0","creatinine":3.5,"baseline_creatinine":1.0,"bun":65,"aki_stage":3,"aki_type":"intrinsic","urine_output_ml_hr":25,"fena":2.5,"provider":"neph_001"},
  {"patient_id":"N1","session_id":"ns_1","modality":"hemodialysis","access_type":1,"frequency_per_week":3,"duration_hours":4,"uf_goal_ml":2500,"dry_weight_kg":72,"kt_v":1.4,"provider":"neph_001"},
  {"patient_id":"N2","assessment_id":"na_2","egfr":45,"urine_albumin":180,"creatinine":1.5,"ckd_stage":3,"albuminuria_category":"a3","progression_rate":3,"provider":"neph_001"},
  {"patient_id":"N3","assessment_id":"ne_3","sodium":138,"potassium":5.5,"chloride":102,"bicarbonate":18,"magnesium":1.8,"calcium":8.5,"phosphate":4.5,"dialysis_required":false,"provider":"neph_001"},
  {"patient_id":"N4","assessment_id":"na_4","ph":7.32,"pco2":35,"bicarbonate":18,"anion_gap":14,"lactate":1.5,"base_excess":-7,"primary_disorder":"metabolic_acidosis","provider":"neph_001"},
  {"patient_id":"N5","assessment_id":"ng_5","proteinuria_g_day":3.5,"hematuria_rbc":50,"creatinine":2.2,"egfr":35,"complement_c3":85,"complement_c4":15,"anca_positive":false,"diagnosis":"iga_nephropathy","provider":"neph_001"},
  {"patient_id":"N6","assessment_id":"nd_6","hba1c":8.5,"egfr":55,"urine_albumin":120,"blood_pressure":140,"disease_duration_years":15,"stage":"macroalbuminuria","progression_rate":5,"provider":"neph_001"},
  {"patient_id":"N7","assessment_id":"np_7","kidney_size_left":14,"kidney_size_right":13.5,"cyst_count":8,"family_history":true,"egfr":68,"blood_pressure":130,"liver_cysts":true,"tolvaptan":1,"provider":"neph_001"},
  {"patient_id":"N8","assessment_id":"rt_8","donor_type":1,"months_post_transplant":24,"creatinine":1.3,"tacrolimus_level":8.5,"rejection_episodes":0,"immunosuppression":"tacrolimus","graft_function":85,"provider":"neph_001"},
  {"patient_id":"N9","assessment_id":"rs_9","stone_type":"calcium_oxalate","stone_size_mm":8,"stone_count":2,"hydration_status":2,"urine_calcium":280,"urine_oxalate":45,"urine_uric_acid":650,"intervention":"lithotripsy","provider":"neph_001"},
  {"patient_id":"N10","assessment_id":"nr_10","creatinine":1.8,"blood_pressure":165,"kidney_size_asymmetry":3,"imaging":"cta","renal_artery_stenosis":1,"side":"unilateral","treatment":"revascularization","provider":"neph_001"},
  {"patient_id":"N11","assessment_id":"hp_11","blood_pressure_sys":170,"blood_pressure_dia":105,"egfr":65,"albuminuria":85,"aldosterone":25,"renin":2,"aldosterone_renin_ratio":12,"treatment":"ace_inhibitor","provider":"neph_001"},
  {"patient_id":"N12","assessment_id":"cr_12","ef":25,"creatinine":2.5,"egfr":25,"bnp":2500,"urine_output":600,"diuretic_dose":120,"club_stage":"cold_wet","provider":"neph_001"},
  {"patient_id":"N13","assessment_id":"hr_13","creatinine":3.5,"bilirubin":6,"inr":2.2,"urine_sodium":8,"fena":0.5,"ascites":true,"meld_score":32,"diagnosis":"type_1_hrs","provider":"neph_001"},
  {"patient_id":"N14","assessment_id":"ou_14","side":"bilateral","hydronephrosis_grade":2,"cause":"bph","post_void_residual":450,"creatinine":2.2,"relief_method":"catheter","provider":"neph_001"},
  {"patient_id":"N15","session_id":"hd_15","pre_weight_kg":75,"post_weight_kg":73.5,"uf_removed_ml":1500,"duration_hours":4,"blood_flow_rate":350,"dialysate_flow":500,"urea_reduction_ratio":72,"complications":0,"provider":"neph_001"},
  {"patient_id":"N16","session_id":"pd_16","modality":"capd","fill_volume_ml":2000,"dwell_time_hours":4,"exchanges_per_day":4,"ultrafiltration_ml":800,"creatinine_clearance":65,"peritonitis":false,"dwell_glucose_pd":2.5,"provider":"neph_001"},
  {"patient_id":"N17","assessment_id":"va_17","access_type":"avfistula","access_age_months":12,"location":"left_arm","fistula_flow_ml_min":800,"maturation_assessment":true,"complications":0,"provider":"neph_001"},
  {"patient_id":"N18","assessment_id":"an_18","hemoglobin":10.5,"ferritin":250,"tsat":25,"retic":1.5,"esa_use":true,"esa_dose":4000,"iron_replacement":1,"target_hgb":"10_11","provider":"neph_001"},
  {"patient_id":"N19","assessment_id":"mg_19","calcium":8.8,"phosphate":5.5,"pth":450,"vitamin_d":22,"fgf23":450,"ckd_mbd":"high_turnover","phosphate_binder":true,"calcimimetic":1,"provider":"neph_001"},
  {"patient_id":"N20","study_id":"us_20","right_kidney_length":11,"left_kidney_length":10.5,"corticomedullary_differentiation":3,"hydronephrosis":0,"cyst_count":0,"stone_present":0,"resistive_index":0.65,"provider":"neph_001"},
  {"patient_id":"N21","study_id":"ct_21","indication":"stone","kidney_size":11,"hydronephrosis_grade":1,"stone_size_mm":5,"stone_count":1,"stone_visibility":1,"imaging_modality":"non_contrast","findings":"stone","provider":"neph_001"},
  {"patient_id":"N22","procedure_id":"rb_22","glomeruli_count":18,"global_sclerosis":3,"segmental_sclerosis":2,"fibrosis_pct":15,"tubular_atrophy":1,"ifta_score":"1","diagnosis":"iga_nephropathy","provider":"neph_001"},
  {"patient_id":"N23","study_id":"rn_23","l_total_function":45,"r_total_function":55,"l_egfr":35,"r_egfr":42,"split_function":50,"obstruction":false,"differential_function":50,"provider":"neph_001"},
  {"patient_id":"N24","procedure_id":"an_24","renal_artery_stenosis":1,"stenosis_pct":70,"side":"unilateral","angioplasty":true,"stenting":true,"access_route":"femoral","complications":0,"provider":"neph_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
