// filepath: gen_tier91.js
const fs = require('fs');
const mounts = [
  { mount: '/api/geriatric_assessment_v2', engine: 'tier91_geriatric_assessment_478_engine', fns: ['comprehensive_assessment','adl_iadl','cognitive_screening','functional_status','social_assessment'] },
  { mount: '/api/geriatric_falls_v2', engine: 'tier91_geriatric_falls_479_engine', fns: ['fall_risk','home_safety','balance_training','post_fall','fall_prevention'] },
  { mount: '/api/geriatric_polypharmacy_v2', engine: 'tier91_geriatric_polypharmacy_480_engine', fns: ['medication_reconciliation','beers_criteria','deprescribing','adherence','prescribing_principles'] },
  { mount: '/api/geriatric_dementia_v2', engine: 'tier91_geriatric_dementia_481_engine', fns: ['dementia_diagnosis','bpsd','dementia_medications','caregiver_support','safety_assessment'] },
  { mount: '/api/geriatric_palliative_v2', engine: 'tier91_geriatric_palliative_482_engine', fns: ['advance_care_planning','frailty_assessment','nursing_home_placement','hospice_eligibility','goals_care_old'] },
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
  {"patient_id":"G0","assessment_id":"ga_0","age":82,"adl_score":5,"iadl_score":6,"mmse_score":24,"moca_score":22,"gait_speed":0.9,"grip_strength":18,"weight_loss_kg":4,"frailty_status":"pre_frail","multimorbidity":true,"provider":"ger_001"},
  {"patient_id":"G1","assessment_id":"ga_1","bathing":5,"dressing":5,"toileting":5,"transferring":5,"continence":4,"feeding":5,"shopping":4,"cooking":4,"housekeeping":3,"medication_management":4,"finances":3,"provider":"ger_001"},
  {"patient_id":"G2","assessment_id":"ga_2","test_type":"moca","orientation_score":6,"registration_score":3,"attention_score":5,"recall_score":3,"language_score":5,"visuospatial_score":3,"total_score":25,"education_years":12,"impression":"mci","provider":"ger_001"},
  {"patient_id":"G3","assessment_id":"ga_3","tug_seconds":14,"sppb_score":8,"gait_speed_mps":0.85,"balance_score":3,"chair_stands":10,"six_min_walk":350,"walking_aid_used":true,"fear_of_falling":true,"falls_last_year":2,"provider":"ger_001"},
  {"patient_id":"G4","assessment_id":"ga_4","living_situation":"alone","social_isolation_score":7,"caregiver_present":false,"caregiver_burden":0,"financial_concerns":3,"elder_abuse_suspected":false,"advance_directive":true,"health_proxy":true,"provider":"ger_001"},
  {"patient_id":"G5","assessment_id":"ga_5","falls_last_year":3,"tug_seconds":18,"morse_score":55,"stratify_score":4,"balance_impairment":true,"gait_impairment":true,"muscle_weakness":true,"vision_score":6,"cognition_score":24,"risk_level":"high","provider":"gf_001"},
  {"patient_id":"G6","assessment_id":"ga_6","bathroom_grab_bars":true,"raised_toilet_seat":true,"bath_mat":true,"good_lighting":true,"no_loose_rugs":true,"stair_handrails":true,"clutter_free":false,"home_modifications":6,"assistive_devices":2,"provider":"gf_001"},
  {"patient_id":"G7","session_id":"gs_7","program_type":"tai_chi","sessions_per_week":3,"duration_weeks":12,"balance_improvement":3,"strength_score":7,"home_exercise":true,"compliance_pct":85,"provider":"gf_001"},
  {"patient_id":"G8","incident_id":"gi_8","fall_time":3,"fall_location":"bathroom","injury":true,"injury_type":"fracture","hospitalization_days":5,"fear_of_falling":true,"activity_reduction":2,"provider":"gf_001"},
  {"patient_id":"G9","plan_id":"gp_9","medications_reviewed":8,"medications_discontinued":2,"vision_correction":1,"footwear_assessment":1,"bone_density_test":1,"vitamin_d_level":22,"calcium_intake":800,"exercise_program":true,"provider":"gf_001"},
  {"patient_id":"G10","session_id":"gs_10","medications_total":12,"prescribed_meds":8,"otc_meds":3,"herbal_supplements":1,"discrepancies_found":2,"duplications":1,"drug_interactions":2,"reconciliation_completed":true,"medications_reconciled":12,"provider":"gp_001"},
  {"patient_id":"G11","assessment_id":"ga_11","beers_medications":3,"high_risk_medications":2,"antianxiety_use":1,"anticholinergic_burden":4,"sedative_load":3,"hypoglycemic_risk":2,"fall_risk_medications":3,"beers_compliance":false,"provider":"gp_001"},
  {"patient_id":"G12","plan_id":"gp_12","medications_reviewed":10,"candidates_for_dc":5,"successfully_dc":3,"failed_dc":1,"reason_dc":"no_indication","follow_up_weeks":4,"benefits_realized":3,"provider":"gp_001"},
  {"patient_id":"G13","assessment_id":"ga_13","morisky_score":6,"pill_burden":12,"dose_aid_used":true,"family_supervision":true,"adherence_pct":80,"refill_compliance":85,"missed_doses_weekly":2,"cost_barriers":1,"provider":"gp_001"},
  {"patient_id":"G14","review_id":"gr_14","start_low":true,"go_slow":true,"renal_dose_adjusted":true,"drug_drug_checked":true,"drug_disease_checked":true,"beers_avoided":3,"simple_regimen":1,"outcome":"stable","provider":"gp_001"},
  {"patient_id":"G15","assessment_id":"ga_15","dementia_type":"alzheimer","mmse_score":18,"moca_score":16,"severity":"moderate","symptoms_duration_months":36,"behavior_changes":3,"family_history":true,"imaging_performed":true,"csf_biomarkers":1,"provider":"gd_001"},
  {"patient_id":"G16","assessment_id":"ga_16","agitation_score":5,"aggression_score":3,"hallucinations":2,"delusions":3,"depression_score":6,"anxiety_score":7,"apathy_score":5,"sleep_disturbance":4,"wandering":2,"elopement_risk":3,"provider":"gd_001"},
  {"patient_id":"G17","review_id":"gr_17","cholinesterase":"donepezil","cholinesterase_dose":10,"memantine":true,"memantine_dose":20,"antipsychotic_used":true,"antipsychotic_type":"atypical","behavioral_response":3,"side_effects":2,"provider":"gd_001"},
  {"patient_id":"G18","session_id":"gs_18","caregiver_burden":7,"caregiver_age":65,"caregiver_health_score":5,"caregiver_depression":true,"respite_hours":10,"support_group":true,"financial_assistance":1,"burnout_level":"high","provider":"gd_001"},
  {"patient_id":"G19","assessment_id":"ga_19","wandering_risk":true,"driving_assessed":true,"cooking_safety":false,"medication_safety":false,"home_alone_safe":false,"gun_access":false,"financial_vulnerability":true,"safety_modifications":3,"guardianship_needed":false,"provider":"gd_001"},
  {"patient_id":"G20","session_id":"gs_20","advance_directive":true,"living_will":true,"durable_poa":true,"health_proxy":true,"code_status":"dnr","values_beliefs":"comfort_focus","family_meetings":3,"physician_orders":2,"provider":"gpa_001"},
  {"patient_id":"G21","assessment_id":"ga_21","frailty_index":0.35,"frailty_category":"frail","comorbidities_count":5,"weight_loss":5,"exhaustion":true,"physical_activity":1,"walking_speed":0.65,"grip_strength":18,"provider":"gpa_001"},
  {"patient_id":"G22","assessment_id":"ga_22","nh_eligible":true,"placement_type":"assisted","caregiver_availability":2,"financial_assessment":1,"facilities_visited":3,"family_conferences":2,"application_status":1,"provider":"gpa_001"},
  {"patient_id":"G23","assessment_id":"ga_23","terminal_illness":true,"life_expectancy_months":4,"functional_decline":true,"weight_loss_pct":10,"karnofsky_score":50,"palliative_performance":50,"hospice_consented":true,"hospice_level":"routine","provider":"gpa_001"},
  {"patient_id":"G24","discussion_id":"gd_24","chair_time_min":45,"family_present":3,"shared_decisions":2,"comfort_focus":3,"treatment_intensity":"comfort_only","trial_of_treatment":false,"revisit_interval":4,"provider":"gpa_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
