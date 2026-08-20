// filepath: test_tier173_engines.js
const ENGINE_TESTS = [
  { mod: 'tier173_pul_806', fns: ['asthma_eval','copd_eval','sleep_study','tb_screening','home_oxygen'] },
  { mod: 'tier173_skp_807', fns: ['knee_replace','hip_replace','shoulder_replace','sports_surgery','spine_surgery'] },
  { mod: 'tier173_mus_808', fns: ['fracture_assess','cast_management','amputation','external_fixation','bone_biopsy'] },
  { mod: 'tier173_int_809', fns: ['gi_bleed','ibd_flare','liver_cirrhosis','transplant_eval','endoscopy_followup'] },
  { mod: 'tier173_ped_810', fns: ['neonatal_screenal','feeding_eval','growth_failure','childhood_vaccine','autism_screen'] }
];
const base = { tenant_id: 't1', patient_id: 'p1', provider: 'p' };
function bodyFor(mod, fn) {
  if (mod === 'tier173_pul_806') {
    if (fn === 'asthma_eval') return { ...base, age: 30, control: 'partially', act_score: 18, fev1_pct: 80, fe_no_ppb: 30, exacerbations_30d: 1, gina_step: 'step_3', inhaler_adherence: 80, disposition: 'step_up' };
    if (fn === 'copd_eval') return { ...base, age: 65, gold_stage: 'III', fev1_pct: 40, exacerbations_30d: 1, mmrc_dyspnea: 2, cat_score: 18, treatment: 'LABA_LAMA', smoker_pack_yrs: 30, disposition: 'continue' };
    if (fn === 'sleep_study') return { ...base, age: 50, bmi: 32, ahi: 25, oxygen_min_pct: 80, epworth_score: 12, severity: 'moderate', position_dependent: true, supine_ahi: 35, disposition: 'PAP' };
    if (fn === 'tb_screening') return { ...base, age: 35, test: 'TST', tst_mm: 12, igra_result: 'positive', bcg_history: false, symptoms: true, sputum_count: 3, cxr_done: true, disposition: 'active' };
    if (fn === 'home_oxygen') return { ...base, age: 70, pao2: 55, sao2_rest: 88, sao2_walk: 82, liters_needed: '2', continuous: true, days_on_oxygen: 30, disposition: 'continue' };
  }
  if (mod === 'tier173_skp_807') {
    if (fn === 'knee_replace') return { ...base, age: 65, side: 'right', approach: 'medial_parapatellar', duration_min: 90, ebl_ml: 200, computer_navigation: false, implant_size: 5, hospital_days: 3, disposition: 'rehab' };
    if (fn === 'hip_replace') return { ...base, age: 70, side: 'left', approach: 'anterior', duration_min: 80, ebl_ml: 150, bearing: 'ceramic', hospital_days: 2, disposition: 'rehab' };
    if (fn === 'shoulder_replace') return { ...base, age: 70, side: 'right', type: 'reverse', duration_min: 120, ebl_ml: 250, glenoid_prep: 1, hospital_days: 2, disposition: 'rehab' };
    if (fn === 'sports_surgery') return { ...base, age: 22, procedure: 'ACL', duration_min: 90, ebl_ml: 50, grafts_used: 1, complication: false, rehab_weeks: 24, disposition: 'rehab' };
    if (fn === 'spine_surgery') return { ...base, age: 60, procedure: 'ACDF', levels: 2, duration_min: 180, ebl_ml: 300, complications_count: 0, hospital_days: 3, disposition: 'home' };
  }
  if (mod === 'tier173_mus_808') {
    if (fn === 'fracture_assess') return { ...base, age: 40, bone: 'tibia', type: 'spiral', ao_class: 'B1', displacement_pct: 50, neurovascular: true, mechanism: 'MVC', plan: 'ORIF', followup_days: 7 };
    if (fn === 'cast_management') return { ...base, age: 30, location: 'forearm', material: 'plaster', weeks_in_place: 4, skin_status: 'intact', pressure_sores: false, edema: false, neurovascular_ok: true, plan: 'remove' };
    if (fn === 'amputation') return { ...base, age: 65, level: 'BKA', indication: 'PAD', laterality: 'right', healing_days: 14, prosthetic_ready: true, rehab_weeks: 12, disposition: 'rehab' };
    if (fn === 'external_fixation') return { ...base, age: 35, location: 'tibia', pin_count: 6, weeks_in_place: 8, infection: false, healing_score: 7, plan: 'remove', followup_days: 14 };
    if (fn === 'bone_biopsy') return { ...base, age: 50, location: 'femur', approach: 'core', size_mm: 10, pathology: 'benign', sufficient: true, complication: 'none', followup_days: 7 };
  }
  if (mod === 'tier173_int_809') {
    if (fn === 'gi_bleed') return { ...base, age: 60, source: 'peptic', hgb: 7, melena: true, hematemesis: false, hemodynamics: 'stable', transfusion_units: 2, scope: 'urgent', intervention: 'epinephrine' };
    if (fn === 'ibd_flare') return { ...base, age: 30, type: 'UC', score_mayo: 9, calprotectin: 500, crp: 50, treatment: 'steroid', iv_steroid: true, response: 'partial', followup_days: 14 };
    if (fn === 'liver_cirrhosis') return { ...base, age: 60, meld_score: 15, child_pugh: 'B', varices_grade: 'II', ascites_grade: 2, hepatic_encephalopathy: 1, treatment: 'beta_blocker', followup_days: 30 };
    if (fn === 'transplant_eval') return { ...base, age: 50, organ: 'kidney', meld_score: 20, status: 'active', antibodies: 0, crossmatch: 'negative', donor_type: 'deceased', listing_date: 20260101 };
    if (fn === 'endoscopy_followup') return { ...base, age: 50, type: 'EGD', indication: 'GERD', findings: 'normal', biopsies_count: 4, pathology: 'normal', recommendation: 'continue', next_interval_months: 36 };
  }
  if (mod === 'tier173_ped_810') {
    if (fn === 'neonatal_screenal') return { ...base, age_days: 5, screening_complete: true, heel_stick_done: true, hearing_test: 'pass', metabolic_results: 'normal', followup_days: 14 };
    if (fn === 'feeding_eval') return { ...base, age_months: 4, breastfeeding: true, formula_topup: false, latch_score: 8, weight_gain_kg: 0.6, mother_diet_ok: true, lactation_consult: true, followup_days: 14 };
    if (fn === 'growth_failure') return { ...base, age_months: 12, weight_kg: 7, height_cm: 70, weight_z: -3, height_z: -2, caloric_intake_kcal: 400, organic_cause: false, intervention: 'supplementation', followup_days: 30 };
    if (fn === 'childhood_vaccine') return { ...base, age_months: 12, vaccines_given: 4, vaccines_due: 5, missing: 1, contraindication: false, ae: false, parent_consent: true, next_visit_days: 60 };
    if (fn === 'autism_screen') return { ...base, age_months: 18, mchat_score: 10, social_concerns: true, language_concerns: true, behavioral_concerns: false, referral_made: true, intervention: 'early_start', followup_days: 30 };
  }
  return { ...base };
}
let pass = 0, fail = 0;
for (const t of ENGINE_TESTS) {
  const { funcs } = require('./' + t.mod + '_engine.js');
  const f = funcs();
  for (const fn of t.fns) {
    const b = bodyFor(t.mod, fn);
    try {
      const out = f[fn](b);
      if (out && out.patient_id) { console.log('OK', t.mod + '.' + fn); pass++; }
      else { console.log('FAIL', t.mod + '.' + fn, 'no patient_id'); fail++; }
    } catch (e) {
      console.log('FAIL', t.mod + '.' + fn + ':', e.message);
      fail++;
    }
  }
}
console.log('TOTALS: pass=' + pass + ' fail=' + fail);