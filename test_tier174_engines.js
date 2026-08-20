// filepath: test_tier174_engines.js
const ENGINE_TESTS = [
  { mod: 'tier174_hem_811', fns: ['anemia_fup','coag_fup','bmt_fup','leukemia_fup','lymphoma_fup'] },
  { mod: 'tier174_onc_812', fns: ['cancer_staging','path_review','tumor_board','clinical_trial','survivorship_fup'] },
  { mod: 'tier174_car_813', fns: ['cad_follow','valve_fup','pacemaker_check','icd_follow','echo_followup'] },
  { mod: 'tier174_nep_814', fns: ['ckd_follow','dialysis_eval','transplant_fup','renal_biopsy','htn_renal'] },
  { mod: 'tier174_pal_815', fns: ['palliative_visit','pain_pump','spiritual_care','family_meeting','death_review'] }
];
const base = { tenant_id: 't1', patient_id: 'p1', provider: 'p' };
function bodyFor(mod, fn) {
  if (mod === 'tier174_hem_811') {
    if (fn === 'anemia_fup') return { ...base, hgb: 12, mcv: 85, ferritin: 100, iron_replacement: true, cause: 'iron_deficiency', disposition: 'continue' };
    if (fn === 'coag_fup') return { ...base, inr: 2.5, pt: 25, ptt: 35, warfarin_dose_mg: 5, bleeding: false, thrombosis: false, days_on_warfarin: 30, diet_stable: true };
    if (fn === 'bmt_fup') return { ...base, days_post: 90, engraftment: true, gvhd_grade: 1, immunosuppression: 'taper', chimerism_pct: 95, relapse_risk: 'low', next_visit_days: 30 };
    if (fn === 'leukemia_fup') return { ...base, type: 'AML', months_since: 12, cytogenetics: 'favorable', mrd_pct: 0.01, treatment_line: 'maintenance', response: 'mrd_negative', followup_days: 30 };
    if (fn === 'lymphoma_fup') return { ...base, type: 'NHL', months_since: 24, pet_result: 'negative', stage: 'I', surveillance_imaging: true, recurrence_score: 'low', followup_days: 90 };
  }
  if (mod === 'tier174_onc_812') {
    if (fn === 'cancer_staging') return { ...base, age: 60, tnm: 'T2', stage: 'II', grade: 'II', biomarkers: 'ER_pos', imaging: 'CT', metastasis_count: 0, treatment_plan: 'combination' };
    if (fn === 'path_review') return { ...base, specimen: 'biopsy', pathology: 'adenocarcinoma', grade: 'II', margins_mm: 5, biomarkers: 'KRAS_wt', biomarkers_count: 5, recommended_treatment: 'FOLFOX' };
    if (fn === 'tumor_board') return { ...base, age: 60, diagnosis: 'colon_ca', stage: 'III', cases_count: 3, consensus: 'surgery_then_chemo', duration_min: 45, followup_days: 14 };
    if (fn === 'clinical_trial') return { ...base, age: 60, trial_id: 'T001', phase: 'III', eligibility_met: true, enrollment_date: 20260101, cycles_planned: 12, cycles_completed: 3, adverse_count: 1 };
    if (fn === 'survivorship_fup') return { ...base, months_since_dx: 36, qol_score: 80, recurrence_risk_pct: 5, surveillance_imaging: true, late_effects_score: 2, exercise: true, sleep_score: 7 };
  }
  if (mod === 'tier174_car_813') {
    if (fn === 'cad_follow') return { ...base, age: 60, type: 'stable', lvef_pct: 55, stress_test: 'negative', med_adherence: 90, bp_baseline: 130, ldl_baseline: 100, symptoms: 0, followup_months: 6 };
    if (fn === 'valve_fup') return { ...base, age: 65, valve_type: 'AVR', echo_grad_mmHg: 15, lvef_pct: 50, anticoag: true, inr: 2.5, symptoms: 0, next_visit_months: 12 };
    if (fn === 'pacemaker_check') return { ...base, age: 70, battery_pct: 80, lead_impedance: 500, pacing_pct: 30, ekg_shows_paced: true, complications: false, months_post_implant: 12 };
    if (fn === 'icd_follow') return { ...base, age: 60, shock_count_30d: 0, battery_pct: 80, lead_impedance: 500, detection: 'normal', patient_activated: 0, shocks_appropriate: 0, followup_months: 3 };
    if (fn === 'echo_followup') return { ...base, age: 60, lvef_pct: 50, valve_function: 'normal', pah_mmHg: 30, diastolic_grade: 'I', mass_present: false, followup_months: 6 };
  }
  if (mod === 'tier174_nep_814') {
    if (fn === 'ckd_follow') return { ...base, age: 65, egfr: 35, acr: 300, stage: 'IIIb', bp_control: 130, diabetes_control: 'good', nephrotox_exposure: false, next_visit_months: 6 };
    if (fn === 'dialysis_eval') return { ...base, age: 65, modality: 'hemodialysis', access: 'AVF', kt_v: 1.4, urr_pct: 70, sessions_per_week: 3, weight_kg: 80, ed: 'home' };
    if (fn === 'transplant_fup') return { ...base, age: 50, months_post: 24, creatinine: 1.2, egfr: 60, tacrolimus_level: 8, rejection_episode: 0, complication: 'none' };
    if (fn === 'renal_biopsy') return { ...base, age: 50, indication: 'proteinuria', cores: 8, glomeruli_count: 18, pathology: 'FSGS', diagnosis_specific: 'tip_lesion', complication: 'none', followup_days: 30 };
    if (fn === 'htn_renal') return { ...base, age: 60, bp_avg: 140, egfr: 50, acr: 200, antihypertensive_count: 3, acei_arb: true, sodium_g: 4, lifestyle: 'moderate', followup_days: 30 };
  }
  if (mod === 'tier174_pal_815') {
    if (fn === 'palliative_visit') return { ...base, age: 70, karnofsky: 50, pain_score: 5, opioid_mme: 30, hospice_appropriate: true, family_meeting_count: 1, goals_of_care: 'comfort' };
    if (fn === 'pain_pump') return { ...base, age: 65, opioid: 'morphine', dose_mg_day: 30, route: 'intrathecal', bolus_per_day: 5, refill_days: 30, complication: 'none' };
    if (fn === 'spiritual_care') return { ...base, age: 70, religion: 'Muslim', requests_spiritual: true, chaplain_visit: true, family_present: true, distress_score: 5, followup_days: 7 };
    if (fn === 'family_meeting') return { ...base, age: 70, attendees_count: 5, duration_min: 60, decision_made: 'comfort_focus', conflict_resolved: true, goals_documented: true, followup_days: 14 };
    if (fn === 'death_review') return { ...base, age: 80, setting: 'home', family_present: true, symptoms_controlled: true, family_satisfaction: 9, morphine_in_last_24h: 30, bereavement_followup: true };
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