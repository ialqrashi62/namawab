// filepath: test_tier145_engines.js
const modules = [
  { mod: 'tier145_ed_689', fns: ['triage','trauma','toxicology','proc','disposition'] },
  { mod: 'tier145_nep_690', fns: ['ckd_stage','dialysis','transplant','biopsy','electrolyte'] },
  { mod: 'tier145_pt_691', fns: ['assessment','exercise','manual','modality','discharge'] },
  { mod: 'tier145_cos_692', fns: ['consultation','surgery','injectable','las_skin','complications'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier145_ed_689') {
    if (fn === 'triage') return { ...base, acuity: '1_resuscitation', esi: 1, news2: 0, pain_score: 0, chief_complaint: 'chest pain', esi_alert: false };
    if (fn === 'trauma') return { ...base, mechanism: 'MVC', iss: 12, gcs_intubated: false, gcs_total: 14, tier: '1', lactate: 2, massive_transfusion: true };
    if (fn === 'toxicology') return { ...base, toxin: 'acetaminophen', peak_level: 150, ingestion_time: 60, activated_charcoal: true, antidote_given: true, epi_doses: 0 };
    if (fn === 'proc') return { ...base, ed_procedure: 'intubation', attempts: 1, successful: true, difficulty: 'easy', duration_min: 5 };
    if (fn === 'disposition') return { ...base, disposition: 'admit', los_hours: 4, los_min: 240, consult_count: 2, return_precaution: 'fever', referral: true, followup: '7d' };
  }
  if (modName === 'tier145_nep_690') {
    if (fn === 'ckd_stage') return { ...base, egfr: 45, creatinine: 1.5, bun: 20, stage: '3a', cause: 'DM', urine_acr: 100 };
    if (fn === 'dialysis') return { ...base, type: 'HD', dialyzer: 1, duration_hr: 4, access: 'AVF', uf_volume: 2.5, URR: 70, Kt_V: 1.3 };
    if (fn === 'transplant') return { ...base, organ: 'deceased_dbd', csa_level: 200, tac_level: 8, siro_level: 5, creatinine: 1.2, bk_virus: 100, rejection: false };
    if (fn === 'biopsy') return { ...base, cores: 5, approach: 'percutaneous', banff: 'normal', g_score: 0, i_score: 0, t_score: 0, v_score: 0 };
    if (fn === 'electrolyte') return { ...base, na: 140, k: 4.0, cl: 100, co2: 24, bun: 15, creatinine_e: 1.1, glucose: 100, ca: 9, mg: 2, ph: 7.4 };
  }
  if (modName === 'tier145_pt_691') {
    if (fn === 'assessment') return { ...base, body_part: 'knee', condition: 'post_surgical', pain_score: 5, range_motion: 90, strength: 4, endurance: 5, goals: 'walk 1 mile' };
    if (fn === 'exercise') return { ...base, session_id: 's1', exercise_name: 'squats', category: 'strength', sets: 3, reps: 10, weight_kg: 5, duration_min: 15, borg_rpe: 12 };
    if (fn === 'manual') return { ...base, session_id: 's1', technique: 'mobilization', duration_min: 10, body_part: 'knee', outcome_score: 50 };
    if (fn === 'modality') return { ...base, session_id: 's1', type: 'ultrasound', intensity_pct: 50, duration_min: 8, frequency_hz: 1000, params: 'cw' };
    if (fn === 'discharge') return { ...base, sessions_attended: 8, sessions_planned: 10, adherence_pct: 80, dyspnea_score: 2, tug_sec: 10, outcome_score: 50, reason: 'goal_met' };
  }
  if (modName === 'tier145_cos_692') {
    if (fn === 'consultation') return { ...base, procedure: 'rhinoplasty', goals: 'aesthetic', psych_eval: true, medical_clearance: true, bmi: 22, smoker: 0 };
    if (fn === 'surgery') return { ...base, consultation_id: 'c1', anesthesia: 'general', duration_hr: 3, ebl_ml: 100, asa: 1, complication: 'none', los_hours: 6, surgeon: 'dr_x' };
    if (fn === 'injectable') return { ...base, product: 'botox', area: 'glabellar', units: 20, volume_ml: 0.5, duration_min: 15, effect_months: 3 };
    if (fn === 'las_skin') return { ...base, laser_type: 'CO2', indication: 'wrinkles', fitzpatrick: '3', fluence_j_cm2: 10, pulse_ms: 5, duration_min: 30, session_number: 1 };
    if (fn === 'complications') return { ...base, original_procedure: 'rhinoplasty', days_post: 7, complication: 'none', clavien_dindo: '1', management: 'observe', resolved: true };
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