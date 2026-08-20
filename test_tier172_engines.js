// filepath: test_tier172_engines.js
const ENGINE_TESTS = [
  { mod: 'tier172_bun_799', fns: ['pain_evaluation','nerve_block','epidural','pca_pump','multimodal'] },
  { mod: 'tier172_car_805', fns: ['cardiac_rehab','heart_failure','arrhythmia','pci','valve_surgery'] },
  { mod: 'tier172_gyn_804', fns: ['cervical_screen','ovarian_screen','endometrial_biopsy','hysterectomy','oophorectomy'] },
  { mod: 'tier172_neu_802', fns: ['stroke_follow','epilepsy_follow','parkinson_follow','ms_follow','migraine'] },
  { mod: 'tier172_bre_803', fns: ['breast_screen','breast_dx','breast_surgery','breast_recon','breast_survivorship'] }
];
const base = { tenant_id: 't1', patient_id: 'p1', provider: 'p' };
function bodyFor(mod, fn) {
  if (mod === 'tier172_bun_799') {
    if (fn === 'pain_evaluation') return { ...base, age: 50, pain_score: 7, location: 'back', duration_days: 30, quality: 'aching', neuropathic: false, dn4_score: 2, pqas_score: 70 };
    if (fn === 'nerve_block') return { ...base, nerve: 'femoral', approach: 'ultrasound', local_volume_ml: 20, local_dose_mg: 100, duration_hr: 6, success_pct: 90, complication: 'none', pain_pre: 8, pain_post: 2 };
    if (fn === 'epidural') return { ...base, age: 35, height_cm: 170, weight_kg: 75, catheter_level: 8, medication: 'bupivacaine', infusion_rate_ml_hr: 8, days_in_place: 3, outcome: 'effective', complication_score: 1 };
    if (fn === 'pca_pump') return { ...base, drug: 'morphine', dose_mg: 2, lockout_min: 10, demands_24h: 30, deliveries_24h: 25, pain_score_avg: 3, sedation_score: -1, disposition: 'continue', days_in_use: 2 };
    if (fn === 'multimodal') return { ...base, surgery: 'ortho', opioid_mme_24h: 20, adjuvants_count: 3, acetaminophen: true, nsaid: true, gabapentinoid: true, lidocaine: false, pain_score: 4, opioid_adverse: 2 };
  }
  if (mod === 'tier172_car_805') {
    if (fn === 'cardiac_rehab') return { ...base, age: 60, diagnosis: 'post_MI', sessions: 30, mets_achieved: 5, bp_baseline: 150, bp_current: 130, hr_baseline: 80, hr_current: 70, adherence_pct: 80, disposition: 'graduate' };
    if (fn === 'heart_failure') return { ...base, age: 65, nyha_class: 'II', lvef_pct: 35, ntprobnp: 800, treatment: 'ARNI', fluid_intake_l: 1.5, weight_kg: 80, weight_change_kg: 1, disposition: 'home' };
    if (fn === 'arrhythmia') return { ...base, age: 65, type: 'AF', duration_min: 60, hr: 130, bp_systolic: 110, spo2: 95, symptoms: true, treatment: 'cardioversion', recurrence_count: 1 };
    if (fn === 'pci') return { ...base, age: 60, access: 'radial', lesions_count: 1, stents_count: 1, door_to_balloon_min: 60, timi_flow: '3', complication: false, complication_type: 'none', hospital_days: 2 };
    if (fn === 'valve_surgery') return { ...base, age: 70, type: 'AVR', approach: 'open', duration_min: 240, cpb_time_min: 120, complication: false, hospital_days: 7, disposition: 'rehab' };
  }
  if (mod === 'tier172_gyn_804') {
    if (fn === 'cervical_screen') return { ...base, age: 30, pap_result: 'normal', hpv_positive: false, hpv_types: 0, vaccination: 'complete', disposition: 'continue', next_screen_months: 36 };
    if (fn === 'ovarian_screen') return { ...base, age: 50, ca125: 15, he4: 50, roma_score: 10, family_history: false, brca_positive: false, imaging: 'normal', disposition: 'continue' };
    if (fn === 'endometrial_biopsy') return { ...base, age: 55, bleeding_days: 14, endometrial_mm: 4, pathology: 'benign', sufficient_sample: true, specimen_weight_mg: 100, complication: 'none' };
    if (fn === 'hysterectomy') return { ...base, approach: 'laparoscopic', type: 'total', duration_min: 120, ebl_ml: 100, complication: false, hospital_days: 1, pathology_count: 3, disposition: 'home' };
    if (fn === 'oophorectomy') return { ...base, indication: 'risk_reduction', ovaries_removed: 2, tubes_removed: 2, approach: 'laparoscopic', duration_min: 90, pathology: 'normal', hospital_days: 0, disposition: 'home' };
  }
  if (mod === 'tier172_neu_802') {
    if (fn === 'stroke_follow') return { ...base, age: 70, days_since_stroke: 30, nihss_baseline: 10, nihss_current: 4, recovery: 'good', mrs_score: 2, secondary_prevention: true, fall_risk_score: 5, disposition: 'home' };
    if (fn === 'epilepsy_follow') return { ...base, age: 30, seizure_type: 'generalized', seizures_30d: 0, aed_count: 1, aed_level_ng_ml: 10, adherence: 'good', aed_type: 'levetiracetam', adverse_score: 1 };
    if (fn === 'parkinson_follow') return { ...base, age: 70, hoehn_yahr: 2, udysrs_score: 30, mds_updrs: 40, medication: 'levodopa', meds_count: 3, dyskinesia: true, falls_30d: false, qol_pdq39: 50 };
    if (fn === 'ms_follow') return { ...base, age: 35, type: 'RRMS', edss_score: 2, relapses_30d: 0, mri_lesions_count: 10, dmt_adherence: 90, dmt: 'interferon', walking_test_25ft: 8, disposition: 'continue' };
    if (fn === 'migraine') return { ...base, age: 35, headaches_30d: 4, duration_hr: 6, pain_max: 8, aura: true, mid_score: 15, hit6_score: 60, prophylaxis: 'topiramate', acute_tx: 'triptan' };
  }
  if (mod === 'tier172_bre_803') {
    if (fn === 'breast_screen') return { ...base, age: 50, impression: 'BI-RADS_2', mass_mm: 5, calcification: false, family_history: false, density: 'scattered', recommendation: 'continue', next_screening_months: 12 };
    if (fn === 'breast_dx') return { ...base, biopsy_type: 'core', pathology: 'IDC', tumor_size_mm: 20, nodes_positive: 2, nodes_examined: 5, receptors: 'ER_pos', ki67_pct: 30, grade: 'II' };
    if (fn === 'breast_surgery') return { ...base, type: 'lumpectomy', duration_min: 90, ebl_ml: 50, nodes_removed: 2, margins_mm: 5, skin_sparing: false, reconstruction: 'none', hospital_days: 1, complication: 'none' };
    if (fn === 'breast_recon') return { ...base, age: 45, method: 'DIEP', stages: 2, duration_total_hr: 12, complication: false, implant_size: 0, satisfaction_score: 9, recovery_months: 6 };
    if (fn === 'breast_survivorship') return { ...base, months_since_dx: 36, lifestyle_score: 80, exercise: true, bmi: 25, endocrine_therapy: 'AI', adherence_pct: 90, recurrence_risk_pct: 5, disposition: 'continue' };
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