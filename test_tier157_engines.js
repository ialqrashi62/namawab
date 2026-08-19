// filepath: test_tier157_engines.js
const modules = [
  { mod: 'tier157_fm_739', fns: ['visit','screening','chronic_care','health_promotion','family_history'] },
  { mod: 'tier157_ger_740', fns: ['cga','cognitive','falls_assess','deprescribing','advance_care'] },
  { mod: 'tier157_sm_741', fns: ['pre_participation','concussion','acl_rehab','throwing','recovery'] },
  { mod: 'tier157_vac_742', fns: ['travel_consult','altitude','dive_med','vaccination','occupational'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier157_fm_739') {
    if (fn === 'visit') return { ...base, age: 35, sex: 'F', visit_type: 'preventive', bp_systolic: 120, bp_diastolic: 80, hr: 72, temperature_c: 36.7, bmi: 24, smoker: 'never', audit_score: 3, complaint: 'annual', diagnosis: 'healthy', plan: 'continue' };
    if (fn === 'screening') return { ...base, age: 50, cancer_screening: 'mammogram', due: 'up_to_date', diabetes_screen: 'a1c', lipid_screen: 'fasting_lipid', immunizations_due: 'flu', depression_screen: true, depression_score: 'PHQ2_negative' };
    if (fn === 'chronic_care') return { ...base, bp_systolic: 130, bp_diastolic: 85, hba1c: 7, ldl: 100, bmi: 28, smoker: false, aspirin: true, egfr: 80, uacr: 20, control: 'partially', medication_count: 3, medication_adherence_pct: 90 };
    if (fn === 'health_promotion') return { ...base, physical_activity_min_week: 150, fruit_veg_servings_day: 5, water_intake_l_day: 2, sleep_hours: 8, stress_score: 4, bmi: 25, waist_cm: 85, smoking_cessation: false, alcohol_screening: true, safe_sex_counseling: false, readiness: 'action' };
    if (fn === 'family_history') return { ...base, relative: 'mother', condition: 'breast_cancer', age_onset: 55, lineage: 'maternal', brca_relevant: true, genetic_test: 'recommended', relative_count: 2 };
  }
  if (modName === 'tier157_ger_740') {
    if (fn === 'cga') return { ...base, age: 80, frailty: 'mild_frail', fried_score: 2, sppb_score: 8, adl_score: 6, iadl_score: 7, mmse_score: 28, moca_score: 26, gds_score: 3, mini_nutritional_assessment: 24, falls_30d: 0, polypharmacy: 8 };
    if (fn === 'cognitive') return { ...base, age: 82, diagnosis: 'mild_dementia', mmse: 22, moca: 18, cdr: 1, fast_stage: 4, behavioral_symptoms: false, behavioral_type: 'none', safety_concern: false, driving_assessment: false };
    if (fn === 'falls_assess') return { ...base, falls_30d: 0, falls_90d: 1, injurious_falls_30d: 0, tug_sec: 14, tinetti_score: 22, berg_balance: 45, timed_up_go: 'moderate_risk', home_safety_eval: true, assistive_device: true, device_type: 'walker', vitamin_d_ng_ml: 30 };
    if (fn === 'deprescribing') return { ...base, medication_count: 12, beers_medications: 3, stopp_medications: 2, start_medication_count: 12, estimated_gfr: 50, adverse_drug_event: 'fall', taper_done: true, taper_weeks: 4, medications_removed: 3, qaly_gained: 0.2 };
    if (fn === 'advance_care') return { ...base, code_status: 'DNR', advance_directive: true, healthcare_proxy: true, polst: true, living_will: true, discussion_count: 2, family_meeting: true, dpoa: 'child', spiritual_care: true, hospice_referral: 0 };
  }
  if (modName === 'tier157_sm_741') {
    if (fn === 'pre_participation') return { ...base, age: 18, sport: 'football', level: 'high_school', bp_systolic: 120, bp_diastolic: 75, hr: 60, hgb: 15, heart_murmur: 'none', cardiac_history: false, musculoskeletal_history: false, cleared_weeks: 52, clearance: 'cleared' };
    if (fn === 'concussion') return { ...base, scid5_score: 30, bess_score: 18, voms_score: 15, tier: '3_vestibular', days_since_injury: 7, symptoms_count: 5, return_to_play: 'no_contact', rtp_days: 10, history_concussion: false, prior_concussions: 0, imaging_done: false, imaging_findings: 'not_done' };
    if (fn === 'acl_rehab') return { ...base, graft_type: 'BTB', weeks_post_op: 12, knee_extension_deg: 5, knee_flexion_deg: 130, quad_strength_pct: 75, hamstring_strength_pct: 80, y_balance_r: 95, ikdc_score: 75, lysolm_score: 80, run_phase: 'treadmill', criteria: 'not_passing' };
    if (fn === 'throwing') return { ...base, discipline: 'baseball_pitcher', velocity_mph: 90, pitch_count: 85, games_played: 15, rest_days: 4, arm_pain: 'mild', rom_pain: 'posterior', ucla_score: 30, kerlan_jobe: 'negative', need_mri: false };
    if (fn === 'recovery') return { ...base, week: 5, resting_hr: 55, hrv: 60, sleep_hours: 8, soreness: 4, fatigue: 5, mood: 7, stress: 4, training_load: 500, acwr: 1.2, recommendation: 'reduce_intensity', acwr_danger: false };
  }
  if (modName === 'tier157_vac_742') {
    if (fn === 'travel_consult') return { ...base, age: 30, destination: 'Thailand', duration_days: 14, departure_days: 30, purpose: 'leisure', risk: 'moderate', vaccines_due: 2, malaria_prophylaxis: true, meds_count: 3, pre_travel_clearance: true };
    if (fn === 'altitude') return { ...base, target_altitude_m: 4500, acclimatization_days: 3, ascent_rate_m_day: 500, altitude_sickness_risk: 'high', spo2_predicted: 80, hct_predicted: 50, diamox_prophylaxis: true, dexamethasone_dose_mg: 0, knowledge_warning: true, conditions: 'none' };
    if (fn === 'dive_med') return { ...base, age: 35, certification: 'AOW', max_depth_m: 30, dives_planned: 6, fitness_clearance: 'cleared', ent_clearance: true, cardiac_clearance: true, pulm_clearance: true, dcs_history: 'none', bps_dive_log: 50 };
    if (fn === 'vaccination') return { ...base, age: 45, vaccine: 'influenza', dose_number: 1, dose_age: 45, antibody_titer: 0, contraindication: 'none', route: 'IM', adverse_event: false };
    if (fn === 'occupational') return { ...base, age: 50, occupation: 'construction', exposure: 'dust', ppe_compliance: true, exposure_years: 20, pulmonary_function_pct: 80, nerve_conduction_score: 0, fit_duty: 'fit_with_restrictions' };
  }
  return base;
}
let pass = 0, fail = 0;
for (const { mod, fns } of modules) {
  const m = require(`./${mod}_engine.js`);
  const F = m.funcs();
  for (const fn of fns) {
    try {
      F[fn](makeBody(mod, fn));
      console.log(`OK ${mod}.${fn}`);
      pass++;
    } catch (e) {
      console.error(`FAIL ${mod}.${fn}: ${e.message}`);
      fail++;
    }
  }
}
console.log(`TOTALS: pass=${pass} fail=${fail}`);
process.exit(fail > 0 ? 1 : 0);