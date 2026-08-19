// filepath: test_tier155_engines.js
const modules = [
  { mod: 'tier155_spn_731', fns: ['disc','fusion','deformity','tumor_spine','outcome_spine'] },
  { mod: 'tier155_spt_732', fns: ['injury','concussion','surgical','rehab','prp'] },
  { mod: 'tier155_pmn_733', fns: ['pain_assess','injection','scs','opioid','outcomes'] },
  { mod: 'tier155_pmr_734', fns: ['stroke_rehab','tbi_rehab','amputation','wheelchair','community_reentry'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier155_spn_731') {
    if (fn === 'disc') return { ...base, level: 'l4_5', type: 'herniation', size_mm: 8, side: 'paracentral_left', pain_radicular: 7, motor_deficit: 4, sensory_deficit: 3, mri_signal: 4, conservative_trial: true, response: 'no_change' };
    if (fn === 'fusion') return { ...base, approach: 'TLIF', level: 'lumbosacral', levels: 1, graft_material_ml: 5, graft_type: 'autograft_bone', hardware: 'pedicle_screws', cpb_min: 120, ebl_ml: 200, duration_hr: 3, approach_access: 'open', surgeon: 'dr_sp' };
    if (fn === 'deformity') return { ...base, condition: 'scoliosis', cobb_angle: 55, sva_mm: 50, pelvic_tilt: 25, sacral_slope: 30, srs_classification: 'thoracolumbar', surgical_plan: 'posterior_only', planned_levels: 10, estimated_blood_loss: 1500, planned_correction_degrees: 50, surgeon: 'dr_sp' };
    if (fn === 'tumor_spine') return { ...base, location: 'vertebral_body', pathology: 'metastasis', treatment: 'separation_surgery', levels_instrumented: 4, spinal_cord_compression: true, frankel_score: 3, stabilization: true, reconstruction: true, ebl_ml: 1500, surgeon: 'dr_sp' };
    if (fn === 'outcome_spine') return { ...base, od_score: 30, vas_back: 3, vas_leg: 2, oswestry_score: 20, complications: 0, revision_surgery: 0, prom_score: 70, satisfaction: 85, months_post_op: 12, recovery_achieved: true };
  }
  if (modName === 'tier155_spt_732') {
    if (fn === 'injury') return { ...base, sport: 'soccer', type: 'ligament', body_part: 'knee', side: 'right', severity: 'G3_severe', mechanism: 'non_contact', mri_finding: 4, need_surgery: true, recovery_weeks: 24 };
    if (fn === 'concussion') return { ...base, scid_score: 5, headache: 6, burke_score: 30, loss_of_consciousness: false, loc_duration_min: 0, post_traumatic_amnesia: false, pta_duration_hr: 0, ct_finding: 'normal', scat5_score: 70, imPACT_score: 60, neurologist_consult: true, recovery_days: 14, protocol: 'graded_return', cleared_return: true };
    if (fn === 'surgical') return { ...base, procedure: 'ACL_recon', graft: 'BTB_autograft', duration_min: 90, ebl_ml: 50, fixation_devices: 8, approach: 'arthroscopic', bracing_postop: true, pt_visits: 30, expected_return_months: 9, surgeon: 'dr_sm' };
    if (fn === 'rehab') return { ...base, week: 8, rom_active_deg: 120, rom_passive_deg: 130, strength_pct: 75, swelling: 2, pain_score: 3, gait: 'normal', criteria_passed: 'quad_strength', lsi_pct: 80, cleared_rts: false };
    if (fn === 'prp') return { ...base, indication: 'tendinopathy', body_part: 'elbow', platelet_count: 1500000, volume_ml: 5, concentration: 2, activations: 1, injection_count: 1, weeks_to_response: 6, outcome: 'good', pre_score: 70, post_score: 30 };
  }
  if (modName === 'tier155_pmn_733') {
    if (fn === 'pain_assess') return { ...base, nrs_score: 7, vas_score: 70, body_part: 'back', type: 'neuropathic', duration_months: 12, bpi_severity: 7, bpi_interference: 8, dn4_score: 6, pdq_score: 25, depression_screening: true, anxiety_screening: true, substance_use: false };
    if (fn === 'injection') return { ...base, type: 'epidural', guidance: 'fluoroscopic', level: 'L5_S1', medication: 'steroid', dose_mg: 80, needle_gauge: 18, duration_min: 30, pre_pain: 7, post_pain: 3, duration_relief_days: 60, complications: 'none' };
    if (fn === 'scs') return { ...base, manufacturer: 'Medtronic', lead_type: 'percutaneous', leads_count: 2, target: 'thoracic', frequency_hz: 60, pulse_width_us: 350, amplitude_ma: 5, trial_performed: true, trial_days: 7, pain_reduction_pct: 70, oswestry_improvement: 50, battery_replacement: false, battery_longevity_years: 9 };
    if (fn === 'opioid') return { ...base, drug: 'oxycodone', daily_mme: 30, duration_days: 180, long_acting: true, short_acting: false, buprenorphine: false, methadone: false, uop_status: 'current', pmp_check: true, urinary_screen: true, naloxone_prescribed: true, cessation_plan: 90 };
    if (fn === 'outcomes') return { ...base, months_followup: 6, nrs_now: 3, nrs_baseline: 8, mme_reduction_pct: 50, function_improvement_pct: 40, satisfaction: 80, work_status: 'employed', re_intervention: false, complications: 'none', quality_of_life: 70, cost_savings: true };
  }
  if (modName === 'tier155_pmr_734') {
    if (fn === 'stroke_rehab') return { ...base, days_post_stroke: 14, nihss: 8, fugl_meyer_score: 50, modified_rankin: 3, barthel_index: 60, side: 'left', location: 'MCA', dysphagia: true, aphasia: false, hemineglect: true, pt_sessions: 20, ot_sessions: 15, st_sessions: 10 };
    if (fn === 'tbi_rehab') return { ...base, severity: 'severe', gcs_initial: 6, ptsd_days: 30, ranchos_scale: 4, drs_score: 15, tbi_length_days: 30, pcoma: false, agitation: true, cog_fim: 15, motor_fim: 30, mobility_index: 50, disposition: 'acute_rehab' };
    if (fn === 'amputation') return { ...base, level: 'below_knee_BK', cause: 'diabetes', healing_weeks: 8, prosthesis_fitted: true, prosthesis_type: 'microprocessor', gait_training_weeks: 12, phantom_pain: true, stump_issues: false, k_level: 2, mobility_score: 70, assistive_devices: 1 };
    if (fn === 'wheelchair') return { ...base, type: 'manual', custom_seat: true, cushion: true, cushion_type: 'gel', fim_score: 80, weight_kg: 70, usage: 'full_time', pressure_sore_count: 0, skin_condition: 'intact', wheelchair_skills_score: 75, adl_score: 70 };
    if (fn === 'community_reentry') return { ...base, weeks_in_rehab: 12, return_home: true, discharge_destination: 1, employment_return: false, community_mobility_km: 5, ciq_score: 18, life_satisfaction: 75, social_participation: 70, driver_eval_done: true, modified_home: true, caregiver_burden: 4, funding: 'Medicare' };
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