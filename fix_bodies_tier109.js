// filepath: fix_bodies_tier109.js
const fs = require('fs');
const fixes = {
  1: {"patient_id":"P1","prescription_id":"op_1","medication":"morphine","dose_mg":30,"frequency":"q12h","morphine_equivalent":30,"risk_score":3,"pain_contract_signed":true,"provider":"pm_001"},
  4: {"patient_id":"P4","followup_id":"pf_4","weeks_since_treatment":4,"pain_score":5,"functional_improvement":3,"adherence":1,"opioid_dose_change_pct":0,"provider":"pm_001"},
  6: {"patient_id":"P6","management_id":"sm_6","symptoms":"dyspnea,pain","interventions":"opioid,oxygen","response":"improved","family_meeting":true,"days_to_improvement":3,"provider":"pc_001"},
  7: {"patient_id":"P7","goals_id":"gc_7","discussion":"code_status","code_status":"dnr","family_present":3,"decisions":"comfort,no_icu","provider":"pc_001"},
  11: {"patient_id":"P11","treatment_id":"ct_11","type":"physical_therapy","duration_weeks":6,"exercises":8,"response":"partial","pain_reduction_pct":50,"provider":"sp_001"},
  13: {"patient_id":"P13","surgery_id":"ss_13","procedure":"fusion","levels":"l4_l5","approach":"posterior","duration_min":240,"blood_loss_ml":300,"complications":0,"provider":"sp_001"},
  15: {"patient_id":"P15","assessment_id":"sm_15","sport":"basketball","injury":"acl_tear","severity":"grade_3","side":"right","imaging":"mri","provider":"sm_001"},
  17: {"patient_id":"P17","rehab_id":"rb_17","phase":"phase_2","weeks_post_op":4,"rom_degrees":120,"strength_pct":70,"pain_score":3,"adherence":0.9,"provider":"sm_001"},
  18: {"patient_id":"P18","clearance_id":"rt_18","weeks_post_injury":32,"functional_tests":"y_balance","test_score":85,"cle_physician":"sm_doc","clearance_pct":90,"provider":"sm_001"},
  19: {"patient_id":"P19","concussion_id":"cn_19","mechanism":"impact","loss_of_consciousness":false,"symptoms":"headache,dizziness","scat_score":15,"return_protocol":"graduated","provider":"sm_001"},
  20: {"patient_id":"P20","assessment_id":"sl_20","chief_complaint":"insomnia","duration_months":6,"severity":"moderate","daytime_impairment":true,"sleep_hours":5,"epworth_score":15,"provider":"sl_001"},
  21: {"patient_id":"P21","psg_id":"ps_21","study_date":"2026-09-01","ahi":35,"min_spo2":80,"total_sleep_time":300,"sleep_efficiency":0.85,"diagnosis":"moderate_osa","provider":"sl_001"},
  22: {"patient_id":"P22","titration_id":"cp_22","device":"cpap","pressure_cm":10,"mask_type":"nasal","ahi_post":3,"compliance":1,"hours_per_night":7,"provider":"sl_001"},
  23: {"patient_id":"P23","treatment_id":"is_23","type":"cbt_i","duration_weeks":8,"sessions":8,"response":"partial","sleep_efficiency_change":0.15,"provider":"sl_001"},
  24: {"patient_id":"P24","followup_id":"sf_24","weeks_since_diagnosis":12,"treatment_adherence":0.9,"symptom_improvement":7,"ahi_recheck":4,"epworth_recheck":6,"provider":"sl_001"}
};
for (const [idx, body] of Object.entries(fixes)) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${idx}.json`, JSON.stringify(body));
}
console.log('Fixed 15 bodies');