// filepath: gen_tier92.js
const fs = require('fs');
const mounts = [
  { mount: '/api/immunodeficiency_v2', engine: 'tier92_immunodeficiency_483_engine', fns: ['primary_immunodeficiency','hiv_care','immunoglobulin_replacement','vaccine_immunodeficiency','autoimmune_screening'] },
  { mount: '/api/allergy_clinical_v2', engine: 'tier92_allergy_clinical_484_engine', fns: ['allergic_rhinitis','asthma_management','food_allergy','drug_allergy','anaphylaxis'] },
  { mount: '/api/immunology_lab_v2', engine: 'tier92_immunology_lab_485_engine', fns: ['allergy_testing','lymphocyte_subsets','complement_levels','cytokine_panel','neutrophil_function'] },
  { mount: '/api/immunotherapy_v2', engine: 'tier92_immunotherapy_486_engine', fns: ['allergen_immunotherapy','biologic_therapy','oral_immunotherapy','desensitization','immunosuppression'] },
  { mount: '/api/autoimmune_v2', engine: 'tier92_autoimmune_487_engine', fns: ['autoimmune_assessment','lupus_disease_activity','autoimmune_arthritis','vasculitis_assessment','connective_tissue'] },
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
  {"patient_id":"I0","assessment_id":"ia_0","pid_type":"cvid","ige_level":5,"igg_level":350,"igm_level":40,"iga_level":35,"lymphocyte_count":1500,"infections_per_year":6,"ivig_replacement":true,"provider":"im_001"},
  {"patient_id":"I1","visit_id":"iv_1","cd4_count":650,"viral_load":40,"art_regimen":"tld","adherence_pct":95,"oi_prophylaxis":"tmp_smx","opportunistic_infections":false,"hep_b_screening":1,"provider":"im_001"},
  {"patient_id":"I2","infusion_id":"ii_2","product":"privigen","dose_g_kg":0.4,"duration_hours":4,"trough_igg":850,"adverse_reaction":false,"infusions_per_month":1,"route":"iv","provider":"im_001"},
  {"patient_id":"I3","assessment_id":"ia_3","vaccines_due":3,"vaccines_administered":2,"titer_checked":2,"titer_adequate":1,"vaccine_type":"inactivated","contraindicated_count":1,"provider":"im_001"},
  {"patient_id":"I4","workup_id":"iw_4","ana_titer":640,"ana_pattern":"homogeneous","anti_dsdna":true,"anti_smith":false,"anti_rnp":false,"anti_cca":"positive","crp":12,"esr":45,"provider":"im_001"},
  {"patient_id":"I5","visit_id":"iv_5","type":"perennial","symptom_score":7,"sneezing_score":6,"congestion_score":7,"rhinorrhea_score":5,"itching_score":4,"eye_symptoms":3,"asthma_present":true,"provider":"al_001"},
  {"patient_id":"I6","visit_id":"iv_6","control_level":"partly_controlled","act_score":18,"fev1":75,"fev1_fvc_ratio":0.65,"exacerbations_12mo":2,"step":"step_3","controller_med":true,"ics_dose":500,"provider":"al_001"},
  {"patient_id":"I7","assessment_id":"ia_7","food_allergen":"peanut","ige_mediated":true,"severity":"severe","skin_prick_mm":8,"specific_ige":25,"food_challenge":false,"anaphylaxis_history":true,"provider":"al_001"},
  {"patient_id":"I8","assessment_id":"ia_8","drug":"penicillin","reaction_type":"immediate","time_to_symptoms_min":15,"desensitization":false,"cross_reactivity":"penicillin","alternative_documented":true,"provider":"al_001"},
  {"patient_id":"I9","episode_id":"ie_9","trigger":"bee_sting","time_to_onset_min":5,"severity":"severe","epinephrine_admin":true,"epinephrine_dose_mg":0.3,"repeat_epinephrine":1,"emergency_dept":true,"provider":"al_001"},
  {"patient_id":"I10","test_id":"it_10","test_type":"skin_prick","allergens_tested":20,"positive_results":6,"histamine_control":"positive","wheal_size_mm":7,"flare_size_mm":18,"provider":"il_001"},
  {"patient_id":"I11","test_id":"it_11","cd3_count":1500,"cd4_count":850,"cd8_count":600,"cd19_count":250,"cd16_56_count":180,"cd4_cd8_ratio":1.4,"cd4_category":"normal","absolute_lymph_count":2200,"provider":"il_001"},
  {"patient_id":"I12","test_id":"it_12","c3":120,"c4":25,"ch50":85,"ah50":90,"c1_inhibitor":0.4,"deficiency":"c1_inhibitor","function_tested":true,"provider":"il_001"},
  {"patient_id":"I13","test_id":"it_13","il_2":3,"il_6":45,"tnf_alpha":22,"ifn_gamma":8,"il_10":5,"crp":30,"pattern":"pro_inflammatory","provider":"il_001"},
  {"patient_id":"I14","test_id":"it_14","test_type":"dhr","baseline_response":5,"stimulated_response":85,"fold_increase":17,"result":"normal","provider":"il_001"},
  {"patient_id":"I15","plan_id":"ip_15","allergen":"grass_pollen","type":"scit","vial_concentration":100,"dose_ml":0.5,"weeks_to_maintenance":16,"total_doses_administered":25,"local_reactions":true,"systemic_reactions":false,"provider":"it_001"},
  {"patient_id":"I16","assessment_id":"ia_16","medication":"dupilumab","dose_mg":300,"frequency_weeks":2,"induction_phase":false,"clinical_response":4,"adverse_events":false,"provider":"it_001"},
  {"patient_id":"I17","plan_id":"ip_17","food_allergen":"peanut","dose_mg":300,"doses_administered":50,"updosing_phase":false,"maintenance_phase":true,"home_doses":45,"reactions_observed":2,"provider":"it_001"},
  {"patient_id":"I18","protocol_id":"ip_18","drug":"trimethoprim","steps_completed":14,"total_steps":14,"successful":true,"reaction_during":false,"final_dose_mg":160,"provider":"it_001"},
  {"patient_id":"I19","assessment_id":"ia_19","medication":"tacrolimus","dose_mg":5,"level_ng_ml":8.5,"wbc_count":5.5,"lymphocyte_count":800,"infections_per_year":1,"prophylaxis":true,"provider":"it_001"},
  {"patient_id":"I20","assessment_id":"ia_20","ana_titer":1280,"anti_dsdna":true,"anti_smith":true,"anti_rnp":false,"anti_ro":true,"anti_la":false,"c3":65,"c4":12,"diagnosis_confirmed":true,"provider":"au_001"},
  {"patient_id":"I21","visit_id":"iv_21","sledai_score":8,"bilag_score":12,"das28_score":4.2,"renal_involvement":false,"cns_involvement":false,"flare_type":"moderate","prednisone_dose":15,"provider":"au_001"},
  {"patient_id":"I22","visit_id":"iv_22","tender_joints":8,"swollen_joints":6,"das28_esr":4.5,"das28_crp":4.1,"crp":15,"esr":35,"radiographic_progression":false,"haq_score":1.2,"provider":"au_001"},
  {"patient_id":"I23","assessment_id":"ia_23","vasculitis_type":"anca_associated","bv_as_score":14,"anca_titer":320,"crp":45,"organ_involvement":true,"prednisone_dose":40,"provider":"au_001"},
  {"patient_id":"I24","assessment_id":"ia_24","diagnosis":"ssc","skin_score":18,"joint_count":4,"muscle_score":2,"pulmonary_involvement":1,"renal_involvement":0,"cardiac_involvement":0,"provider":"au_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
