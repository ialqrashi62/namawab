// filepath: test_tier168_engines.js
const ENGINE_TESTS = [
  { mod: 'tier168_reh_783', fns: ['rehab_assessment','rehab_goals','functional_progress','discharge_planning','adaptive_equipment'] },
  { mod: 'tier168_ped_784', fns: ['well_child','growth_chart','immunization_peds','developmental_screen','adolescent_care'] },
  { mod: 'tier168_gyn_785', fns: ['pelvic_exam','contraception','iud_placement','fertility_eval','menopause_eval'] },
  { mod: 'tier168_obg_786', fns: ['prenatal_visit','lab_test','ultrasound','delivery','postpartum'] }
];
const base = { tenant_id: 't1', patient_id: 'p1', provider: 'p' };
function bodyFor(mod, fn) {
  if (mod === 'tier168_reh_783') {
    if (fn === 'rehab_assessment') return { ...base, age: 60, diagnosis: 'stroke', admission_fim: 60, current_fim: 80, mobility: 'wheelchair', cognitive: 'mild_impairment', goals_count: 5, days_in_program: 14, disposition: 'continue' };
    if (fn === 'rehab_goals') return { ...base, age: 60, goal_type: 'mobility', target_date: 20270101, progress_pct: 50, barriers: 'fatigue', support: 'family', modified: true, score: 7 };
    if (fn === 'functional_progress') return { ...base, age: 60, fim_baseline: 60, fim_current: 80, fim_gain: 20, mobility_score: 7, adl_score: 8, balance_score: 6, days: 14 };
    if (fn === 'discharge_planning') return { ...base, age: 60, destination: 'home', caregiver: 'spouse', equipment_count: 3, home_mod: true, followup_appointments: 5, barriers_resolved: 4, disposition: 'home' };
    if (fn === 'adaptive_equipment') return { ...base, age: 60, equipment_type: 'wheelchair', trial_days: 7, satisfaction: 8, comfort: 'good', training_hours: 4, followup_days: 30 };
  }
  if (mod === 'tier168_ped_784') {
    if (fn === 'well_child') return { ...base, age_months: 12, weight_kg: 10, height_cm: 75, head_cm: 46, feeding: 'mixed', development: 'normal', immunizations_count: 4, next_visit_days: 90 };
    if (fn === 'growth_chart') return { ...base, age_months: 24, weight_kg: 12, height_cm: 85, bmi: 16.6, weight_z: 0.5, height_z: 0, percentile_band: '15-50', trend: 'stable' };
    if (fn === 'immunization_peds') return { ...base, age_months: 12, vaccine: 'MMR', dose_number: 1, doses_total: 2, contraindication: false, observation_min: 15, ae: false, up_to_date: true };
    if (fn === 'developmental_screen') return { ...base, age_months: 18, tool: 'MCHAT', score: 5, domain_concern: 'language', referral_made: true, referral_count: 2, disposition: 'therapy' };
    if (fn === 'adolescent_care') return { ...base, age: 16, height_cm: 170, weight_kg: 60, tanner_stage: 'IV', mental_health_screen: 'PHQ', substance_use_screen: true, sexual_health_screen: true, disposition: 'normal' };
  }
  if (mod === 'tier168_gyn_785') {
    if (fn === 'pelvic_exam') return { ...base, age: 30, exam_type: 'annual', pap_done: true, hpv_test: true, pap_result: 1, bimanual: 'normal', discharge: 'normal', disposition: 'normal' };
    if (fn === 'contraception') return { ...base, age: 25, method: 'IUD', duration_months: 24, pearl_index: 0.2, side_effect: 'spotting', compliance: true, disposition: 'continue', followup_days: 365 };
    if (fn === 'iud_placement') return { ...base, age: 25, type: 'hormonal', successful: true, complication: false, complication_type: 'none', days_post_insert: 30, position: 'in_place', followup_days: 30 };
    if (fn === 'fertility_eval') return { ...base, age: 32, infertility_months: 12, cycle_length_days: 28, ovulation_confirmed: 1, amh: 2, fsh: 7, diagnosis: 'unexplained', disposition: 'IUI' };
    if (fn === 'menopause_eval') return { ...base, age: 52, fsh: 70, amh: 0.05, menopause_rating_scale: 18, stage: 'peri', symptoms: 'hot_flash', treatment: 'HRT' };
  }
  if (mod === 'tier168_obg_786') {
    if (fn === 'prenatal_visit') return { ...base, age: 30, gestational_age_weeks: 20, weight_kg: 65, bp_systolic: 120, uterine_height_cm: 20, fhr_bpm: 150, fundal_placenta: 1, complaint: 'none', next_visit_days: 30 };
    if (fn === 'lab_test') return { ...base, gestational_age_weeks: 28, test: 'Glucose', result: 'normal', action_taken: true, disposition: 'continue', days_since_test: 7 };
    if (fn === 'ultrasound') return { ...base, gestational_age_weeks: 20, type: 'anatomy', efw_grams: 350, crl_mm: 50, amniotic_fluid: 12, placental_location: 1, findings: 'normal', disposition: 'continue' };
    if (fn === 'delivery') return { ...base, gestational_age_weeks: 39, type: 'vaginal', duration_hours: 8, ebl_ml: 300, complication: 'none', apgar_1: 8, apgar_5: 9, outcome: 'alive' };
    if (fn === 'postpartum') return { ...base, days_postpartum: 14, bp_systolic: 120, recovery_status: 'normal', complication: 'none', edinburgh_score: 5, breastfeeding_ok: true, disposition: 'normal' };
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