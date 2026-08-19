// filepath: test_tier151_engines.js
const modules = [
  { mod: 'tier151_pls_713', fns: ['consult','recon','hand_surg','laser','cmo'] },
  { mod: 'tier151_wou_714', fns: ['wound_assess','dressing','debridement','healing_progress','wound_bio'] },
  { mod: 'tier151_pod_715', fns: ['assess','nail_care','orthotic','diabetic_foot','biomech'] },
  { mod: 'tier151_sle_716', fns: ['polysom','pap_titration','mslt','insomnia_cbt','parasomnia'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier151_pls_713') {
    if (fn === 'consult') return { ...base, procedure: 'rhinoplasty', bmi: 24, smoker: 'never', medical_clearance: true, psych_eval: true, goals: 'aesthetic', asa: 1 };
    if (fn === 'recon') return { ...base, indication: 'cancer_resection', reconstruct_type: 'free_flap', donor_site: 'anterolateral_thigh', flap_size_cm: 12, ebl_ml: 300, duration_hr: 6, microvascular_anastomosis: true, outcome: 'healing_well', surgeon: 'dr_p' };
    if (fn === 'hand_surg') return { ...base, procedure: 'carpal_tunnel_release', hand_involved: 'right', fingers_involved: 'NA', duration_min: 30, tourniquet: true, tourniquet_min: 20, nerve_conduction: 'moderate', immobilization: 'splint', hand_therapy_visits: 4, surgeon: 'dr_h' };
    if (fn === 'laser') return { ...base, laser_type: 'CO2', indication: 'acne_scars', fitzpatrick: '3', fluence_j_cm2: 10, pulse_duration_ms: 5, spot_size_mm: 10, session_number: 1, complications: 'none' };
    if (fn === 'cmo') return { ...base, complication: 'hematoma', days_post_op: 3, clavien_dindo: '3a', treatment: 'I_D', recovered: true, management: 'aspiration_dressing' };
  }
  if (modName === 'tier151_wou_714') {
    if (fn === 'wound_assess') return { ...base, type: 'diabetic', location: 'plantar_right_foot', length_cm: 3, width_cm: 2, depth_cm: 0.5, stage: 'II', exudate: 'serous', odor: 'none', undermining: false, tunneling: false, tissue: 'granulation', biofilm: false };
    if (fn === 'dressing') return { ...base, wound_id: 'w1', dressing_type: 'hydrocolloid', change_frequency_days: 3, exudate_amount: 'light', intact_at_change: true, skin_maceration: false, allergic_reaction: false };
    if (fn === 'debridement') return { ...base, wound_id: 'w1', method: 'sharp_conservative', tissue_removed_g: 5, blood_loss_ml: 10, depth: 'partial_thickness', duration_min: 20, performed_at_bedside: true, anesthesia: 'topical' };
    if (fn === 'healing_progress') return { ...base, wound_id: 'w1', week: 4, area_cm2: 4, area_pct_change: -30, depth_cm: 0.3, healing_index: 70, trajectory: 'healing', complete_closure: false, weeks_to_closure: 8 };
    if (fn === 'wound_bio') return { ...base, wound_id: 'w1', method: 'swab_culture', organism: 'Staph_aureus', sensitivity: 'sensitive', colony_count: 100000, biofilm_present: false, systemic_infection: false };
  }
  if (modName === 'tier151_pod_715') {
    if (fn === 'assess') return { ...base, foot_condition: 'diabetic_neuropathy', abi_left: 1.0, abi_right: 0.9, sensation: 'reduced_both', monofilament_score: 6, vibration_score: 4, skin: 'dry', deformity: 'none', risk_category: 'high' };
    if (fn === 'nail_care') return { ...base, procedure: 'ingrown_nail_excision', toe: 'right_hallux', num_toes: 1, bilateral: false, anesthesia: 'digital_block', antibiotic: false, healing_weeks: 2, recurrence_pct: 5 };
    if (fn === 'orthotic') return { ...base, type: 'custom_molded', shoe_size_us: 10, left_size: 10, right_size: 10, material: 'EVA', cost_usd: 300, replacement_months: '12', billed_to_insurance: true };
    if (fn === 'diabetic_foot') return { ...base, ulcer_grade: '2_deeper', wagner_classification: '2', healing_weeks: 8, osteomyelitis: false, revascularization_needed: false, amputation_level: 0, amputation_done: false, outcome: 'healed', off_loading: true };
    if (fn === 'biomech') return { ...base, gait_pattern: 'antalgic', cadence_steps_min: 110, stride_length_m: 1.2, stance_pct: 60, swing_pct: 40, pressure_peak_kpa: 250, foot_posture: 'pronated', fpi_score: 6, recommend_pt: true };
  }
  if (modName === 'tier151_sle_716') {
    if (fn === 'polysom') return { ...base, tst_min: 400, sleep_efficiency_pct: 85, n1_pct: 5, n2_pct: 50, n3_pct: 20, rem_pct: 25, rem_latency_min: 90, ahi: 12, odi: 8, min_sao2: 88, arousal_index: 15, plmd_index: 5 };
    if (fn === 'pap_titration') return { ...base, cpap_cm_h2o: 10, bipap_ipap: 14, bipap_epap: 6, min_pressure: 5, max_pressure: 15, mode: 'CPAP', final_ahi: 3, leak_l_min: 24, usage_hr_per_night: 6.5, mask_fit: 'good' };
    if (fn === 'mslt') return { ...base, nap_count: 4, mean_sleep_latency_min: 5, sleep_onset_rem_periods: 3, diagnosis: 'narcolepsy_type_1', rem_latency_min: 5, tst_min: 400 };
    if (fn === 'insomnia_cbt') return { ...base, isi_score: 18, sleep_diary_days: 14, avg_sleep_time_min: 360, avg_wake_time_min: 480, sleep_efficiency_pct: 75, stimulus_control_weeks: 6, sleep_restriction: true, cognitive_restructuring: true, sleep_hygiene: true, medication_tapered: true };
    if (fn === 'parasomnia') return { ...base, type: 'REM_behavior', frequency_per_week: 2, stage: 'REM', violent_episodes: false, self_injury: false, prevalence_age_onset: 60, treatment: 'melatonin' };
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