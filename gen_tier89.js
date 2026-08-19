// filepath: gen_tier89.js
const fs = require('fs');
const mounts = [
  { mount: '/api/oncology_chemo_v2', engine: 'tier89_oncology_chemo_468_engine', fns: ['chemotherapy_regimen','cycle_count','dose_intensity','toxicity_assessment','efficacy_imaging'] },
  { mount: '/api/oncology_radiation_v2', engine: 'tier89_oncology_radiation_469_engine', fns: ['radiation_planning','dose_tracking','site_specific','radiation_toxicity','brachytherapy'] },
  { mount: '/api/hematology_benign_v2', engine: 'tier89_hematology_benign_470_engine', fns: ['anemia_workup','iron_deficiency','hemolysis_workup','bone_marrow','anticoagulation'] },
  { mount: '/api/oncology_support_v2', engine: 'tier89_oncology_support_471_engine', fns: ['palliative_care','pain_management','psychosocial_support','goals_of_care','nutrition_support'] },
  { mount: '/api/oncology_survivorship_v2', engine: 'tier89_oncology_survivorship_472_engine', fns: ['survivorship_plan','late_effects','screening_recurrence','lifestyle_counseling','followup_schedule'] },
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
  {"patient_id":"P0","cycle_id":"c0","regimen":"folfox","cycle_number":3,"dose_mg_m2":85,"height_cm":170,"weight_kg":72,"bsa":1.85,"dose_intensity":"full","premedications":2,"toxicity_grade":"2","efficacy_response":"partial_response","next_cycle_days":14,"provider":"oc_001"},
  {"patient_id":"P1","record_id":"r1","total_cycles_planned":12,"cycles_completed":11,"cycles_delayed":1,"cycles_reduced":2,"completed":false,"termination_reason":"toxicity","cumulative_dose_mg_m2":1020,"time_on_therapy_weeks":24,"response_evaluation":true,"imaging_modality":"ct","provider":"oc_001"},
  {"patient_id":"P2","assessment_id":"a2","planned_dose_mg":850,"actual_dose_mg":680,"planned_interval_days":14,"actual_interval_days":21,"relative_dose_intensity":0.8,"g_csf_used":true,"reduction_reason":"neutropenia","wbc_nadir":1.2,"anc_nadir":0.5,"platelet_nadir":80,"provider":"oc_001"},
  {"patient_id":"P3","assessment_id":"a3","toxicity_type":"hematologic","ctcae_grade":"3","dose_modified":true,"symptom_score":7,"hospitalization":true,"hospital_days":4,"iv_support":true,"g_csf_days":3,"antibiotic_days":5,"recovery_complete":true,"provider":"oc_001"},
  {"patient_id":"P4","scan_id":"s4","recist_response":"pr","target_lesions_sum_mm":45,"percent_change":-32,"new_lesions":false,"imaging_modality":"ct","scan_interval_weeks":8,"tumor_marker_change":-50,"mark_response":"responding","clinical_progression":false,"provider":"oc_001"},
  {"patient_id":"P5","plan_id":"pl5","intent":"curative","site":"prostate","technique":"imrt","total_dose_gy":78,"fractions":39,"dose_per_fraction_gy":2,"treatment_days":55,"image_guided":true,"gating_used":false,"provider":"rt_001"},
  {"patient_id":"P6","session_id":"s6","planned_dose_gy":2,"delivered_dose_gy":2,"session_number":15,"fractions_completed":true,"treatment_interrupted":false,"interruption_days":0,"interruption_reason":"none","cumulative_dose_gy":30,"dvh_max":45,"dvh_mean":25,"provider":"rt_001"},
  {"patient_id":"P7","assessment_id":"a7","site":"prostate","gtv_volume_cc":12,"ctv_volume_cc":25,"ptv_volume_cc":80,"oar_dose_limit_gy":78,"constraints_met":true,"conformity_index":1.05,"homogeneity_index":0.1,"boost_status":"simultaneous_integrated","provider":"rt_001"},
  {"patient_id":"P8","assessment_id":"a8","acute_toxicity":"dermatitis","ctcae_grade":"2","late_effects_score":1,"hospitalization":false,"steroid_use_days":0,"treatment_held":false,"days_held":0,"recovery_weeks":2,"provider":"rt_001"},
  {"patient_id":"P9","procedure_id":"pr9","type":"interstitial","anatomical_site":"prostate","total_dose_gy":110,"fractions":2,"dose_rate":80,"applicator":"needles","hospital_stay_days":2,"anesthesia_used":true,"complications":"none","provider":"rt_001"},
  {"patient_id":"P10","workup_id":"w10","hemoglobin":8.5,"hematocrit":26,"mcv":75,"mch":24,"mchc":30,"rdw":18,"retic_count":2,"ferritin":15,"tsat":10,"b12":400,"folate":8,"haptoglobin":120,"provider":"hm_001"},
  {"patient_id":"P11","assessment_id":"a11","ferritin":15,"tsat":10,"cause":"menstrual","gi_workup":false,"colonoscopy_done":false,"egd_done":false,"treatment":"iv_iron","dose_mg":1000,"weeks_to_response":4,"provider":"hm_001"},
  {"patient_id":"P12","workup_id":"w12","ldh":450,"haptoglobin":15,"retic_count":8,"indirect_bilirubin":3.5,"peripheral_smear_schistocytes":true,"direct_coombs":false,"indirect_coombs":false,"mechanism":"intravascular","diagnosis":"ttp","provider":"hm_001"},
  {"patient_id":"P13","procedure_id":"p13","site":"iliac_crest","cellularity_pct":40,"mye_eryth_ratio":3,"blasts_pct":3,"megakaryocytes":5,"flow_cytometry":true,"cytogenetics":true,"molecular_studies":true,"impression":"normal","provider":"hm_001"},
  {"patient_id":"P14","assessment_id":"a14","anticoagulant":"warfarin","dose_mg":5,"inr":2.5,"indication":"afib","duration_months":24,"bridging":false,"bleeding_event":false,"most_recent_creatinine":1.0,"time_in_therapeutic_range":75,"provider":"hm_001"},
  {"patient_id":"P15","visit_id":"v15","performance_status":"2","pain_score":6,"symptom_burden_score":7,"fatigue_score":8,"dyspnea_score":4,"nausea_score":3,"appetite_score":4,"sleep_score":5,"spiritual_assessment":"done","advance_directive":"complete","provider":"pc_001"},
  {"patient_id":"P16","assessment_id":"a16","pain_score":7,"pain_locations":"back_legs","pain_type":"mixed","current_opioid":"morphine","opioid_dose_mg_equiv":60,"breakthrough_doses":true,"breakthrough_count_24h":3,"constipation_prophylaxis":true,"adjuvant_gabapentinoid":true,"provider":"pc_001"},
  {"patient_id":"P17","assessment_id":"a17","distress_score":6,"anxiety_score":7,"depression_score":5,"social_work_consult":true,"psychiatry_consult":false,"counseling_referral":true,"support_group":false,"financial_counseling":true,"caregiver_burden_score":7,"coping_style":"accepting","provider":"pc_001"},
  {"patient_id":"P18","discussion_id":"d18","code_status":"dnr","goals":"comfort","family_meeting":true,"participants":5,"ethics_consult":false,"hospice_eligible":true,"hospice_enrolled":false,"care_setting":"home","provider":"pc_001"},
  {"patient_id":"P19","assessment_id":"a19","weight_kg":60,"weight_change_6mo_pct":-15,"bmi":20,"appetite":"decreased","diet":"soft","protein_intake_g":50,"calorie_intake_kcal":1200,"dietitian_consult":true,"peg_tube":false,"supplements":true,"provider":"pc_001"},
  {"patient_id":"P20","plan_id":"pl20","cancer_type":"breast","days_since_treatment":365,"treatment_summary_done":true,"recurrence_monitoring":true,"next_screening_weeks":12,"late_effects_score":2,"care_coordinator":"assigned","health_promotion":true,"fertility_counseling":false,"provider":"os_001"},
  {"patient_id":"P21","assessment_id":"a21","years_since_treatment":5,"cardiotoxicity":"mild","neuropathy":"sensory","renal_dysfunction":"none","cognitive_changes":"mild","second_malignancy_screening":true,"screening_uptodate":1,"provider":"os_001"},
  {"patient_id":"P22","assessment_id":"a22","cancer_type":"colon","last_screening_days":90,"imaging_done":true,"tumor_marker_done":true,"tumor_marker_value":3.2,"symptoms_review":true,"new_concerns":false,"outcome":"no_recurrence","provider":"os_001"},
  {"patient_id":"P23","assessment_id":"a23","smoking_cessation":true,"alcohol_cessation":true,"exercise_minutes_week":150,"diet_quality":"good","sleep_hours":7,"stress_score":4,"weight_management":true,"bmi":24,"blood_pressure":120,"provider":"os_001"},
  {"patient_id":"P24","plan_id":"pl24","months_since_treatment":18,"next_visit_months":3,"imaging_interval_months":6,"lab_interval_months":3,"telemedicine_available":true,"compliance_score":9,"barriers":"none","provider":"os_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
