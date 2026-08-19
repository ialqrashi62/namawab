// filepath: gen_tier95.js
const fs = require('fs');
const mounts = [
  { mount: '/api/hepatology_viral_v2', engine: 'tier95_hepatology_viral_498_engine', fns: ['hcv_assessment','hcv_treatment','hbv_assessment','hbv_treatment','hepatitis_vaccination'] },
  { mount: '/api/hepatology_cirrhosis_v2', engine: 'tier95_hepatology_cirrhosis_499_engine', fns: ['cirrhosis_assessment','ascites_management','hepatic_encephalopathy','spontaneous_bacterial_peritonitis','variceal_bleeding'] },
  { mount: '/api/hepatology_liver_failure_v2', engine: 'tier95_hepatology_liver_failure_500_engine', fns: ['acute_liver_failure','decompensated_cirrhosis','transplant_evaluation','transplant_followup','liver_cancer'] },
  { mount: '/api/hepatology_pediatric_v2', engine: 'tier95_hepatology_pediatric_501_engine', fns: ['neonatal_hepatitis','biliary_atresia','pediatric_liver_transplant','pediatric_pf_icp','alpha_1_antitrypsin'] },
  { mount: '/api/hepatology_metabolic_v2', engine: 'tier95_hepatology_metabolic_502_engine', fns: ['nafld_assessment','nash_treatment','wilson_disease','hemochromatosis','autoimmune_hepatitis'] },
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
  {"patient_id":"H0","assessment_id":"ha_0","hcv_genotype":1,"hcv_rna":2500000,"alt":85,"ast":72,"bilirubin":1.2,"albumin":3.8,"fibroscan_kpa":8.5,"hiv_coinfection":false,"provider":"hp_001"},
  {"patient_id":"H1","plan_id":"hp_1","regimen":"sof_led","duration_weeks":12,"week_4_rna":"undetectable","sustained_virologic_response":true,"treatment_completed":true,"adherence_pct":95,"provider":"hp_001"},
  {"patient_id":"H2","assessment_id":"ha_2","hbsag":"positive","hbeag":"negative","anti_hbe":"positive","hbcab_igm":"negative","hbv_dna":1500,"alt":42,"fibroscan_kpa":6.5,"family_history":true,"provider":"hp_001"},
  {"patient_id":"H3","plan_id":"hp_3","nucleoside":"tenofovir","treatment_duration_months":48,"hbeag_seroconversion":true,"hbv_dna_undetectable":true,"alt_normalization":true,"renal_function":"stable","provider":"hp_001"},
  {"patient_id":"H4","vaccination_id":"hv_4","vaccine":"hepatitis_b","doses_completed":3,"anti_hbs_titer":350,"booster_needed":false,"non_responder":false,"vaccine_age":25,"provider":"hp_001"},
  {"patient_id":"H5","assessment_id":"ci_5","meld_score":14,"child_pugh":"B","albumin":3.2,"inr":1.4,"bilirubin":2.1,"ascites":"mild","encephalopathy":"none","etiology":"alcohol","provider":"hp_001"},
  {"patient_id":"H6","assessment_id":"as_6","ascites_grade":2,"diuretic_response":true,"lactulose_used":true,"spontaneous_bacterial_peritonitis":false,"large_volume_paracentesis_count":3,"serum_creatinine":1.2,"sodium":135,"provider":"hp_001"},
  {"patient_id":"H7","assessment_id":"he_7","grade":2,"asterixis":true,"lactulose_dose":30,"rifaximin_use":true,"triggers":["gi_bleeding","infection"],"hospitalization":true,"improvement_days":4,"provider":"hp_001"},
  {"patient_id":"H8","assessment_id":"sbp_8","anc_count":280,"ascites_fluid_pmn":250,"culture":"e_coli","antibiotic":"cefotaxime","iv_albumin":true,"response":"improved","hospital_days":8,"provider":"hp_001"},
  {"patient_id":"H9","episode_id":"vb_9","active_bleeding":true,"variceal_grade":3,"banding_done":8,"vasoconstrictor":"octreotide","antibiotic":"ceftriaxone","transfused_units":3,"mortality_risk":0.25,"provider":"hp_001"},
  {"patient_id":"H10","assessment_id":"ac_10","bilirubin":12,"inr":3.5,"alt":1200,"ast":800,"lactate":6.5,"hec_grade":2,"transplant_listed":true,"king_college_criteria":true,"provider":"hp_001"},
  {"patient_id":"H11","assessment_id":"ci_11","meld_score":22,"child_pugh":"C","albumin":2.5,"inr":1.8,"ascites":"refractory","encephalopathy":"grade_2","hospital_30d":2,"prognosis_6mo":0.55,"provider":"hp_001"},
  {"patient_id":"H12","evaluation_id":"ev_12","meld_score":18,"psychosocial_eval":true,"sobriety_duration":12,"cardiac_clearance":true,"infection_screen":"negative","listing_status":"active","contraindications":0,"provider":"hp_001"},
  {"patient_id":"H13","visit_id":"fv_13","months_post_transplant":36,"tacrolimus_level":8.5,"rejection_episodes":0,"bmi":24,"liver_function":"normal","compliance":"excellent","provider":"hp_001"},
  {"patient_id":"H14","assessment_id":"lc_14","lesion_count":2,"largest_size_cm":3.5,"mri_li_rads":"lr_4","afp":350,"bclc_stage":"B","child_pugh":"A","treatment_plan":"tace","provider":"hp_001"},
  {"patient_id":"H15","assessment_id":"nh_15","age_days":15,"jaundice_present":true,"direct_bilirubin":6.5,"alt":150,"ast":140,"cause":"unknown","workup_complete":false,"provider":"hp_001"},
  {"patient_id":"H16","assessment_id":"ba_16","age_weeks":6,"stool_color":"acholic","ultrasound_findings":"triangular_cord","kasai_done":true,"age_at_kasai_days":65,"outcome":"improved","provider":"hp_001"},
  {"patient_id":"H17","evaluation_id":"pt_17","age_years":5,"pediatric_end_stage_liver":true,"kasai_failure":true,"meld_peld_score":22,"donor_type":"living_related","outcome":"successful","provider":"hp_001"},
  {"patient_id":"H18","assessment_id":"ic_18","age_years":3,"icp_score":8,"behavior_score":9,"abdominal_pain":true,"hepatomegaly":true,"treatment":"ursodeoxycholic_acid","response":"partial","provider":"hp_001"},
  {"patient_id":"H19","assessment_id":"aa_19","age_years":2,"a1at_level":25,"phenotype":"piZZ","liver_involvement":true,"lung_involvement":false,"treatment":"supportive","vaccination_pneumococcus":true,"provider":"hp_001"},
  {"patient_id":"H20","assessment_id":"na_20","bmi":35,"alt":65,"ast":45,"fasting_glucose":125,"fibroscan_kpa":7.5,"nafld_score":3,"ultrasound_fatty":true,"metabolic_syndrome":true,"provider":"hp_001"},
  {"patient_id":"H21","plan_id":"nt_21","weight_loss_pct":10,"alt_improvement":40,"diabetes_control":true,"vitamin_e":true,"liraglutide":true,"alcohol_use":false,"nafld_resolution":1,"provider":"hp_001"},
  {"patient_id":"H22","assessment_id":"wd_22","ceruloplasmin":8,"urinary_copper_24h":180,"kayser_fleischer_rings":true,"neurological":true,"penicillamine":true,"zinc":true,"provider":"hp_001"},
  {"patient_id":"H23","assessment_id":"hh_23","ferritin":850,"tsat":65,"hfe_c282y":"homozygous","liver_biopsy_iron":3,"phlebotomy":true,"frequency_weeks":2,"cardiac_involvement":false,"provider":"hp_001"},
  {"patient_id":"H24","assessment_id":"ai_24","ana":"positive","anti_sma":"positive","lkm1":"negative","iga_level":450,"liver_biopsy":"interface_hepatitis","prednisone":true,"azathioprine":true,"response":"stable","provider":"hp_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
