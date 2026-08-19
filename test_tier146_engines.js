// filepath: test_tier146_engines.js
const modules = [
  { mod: 'tier146_ane_693', fns: ['preop','induction','intraop','pain','emergence'] },
  { mod: 'tier146_hem_694', fns: ['cbc','coagulation','transfusion','chemo','marrow'] },
  { mod: 'tier146_neu_695', fns: ['craniotomy','spine_op','vp_shunt','intracranial_monitor','skull_base'] },
  { mod: 'tier146_irr_696', fns: ['biopsy','drain','angio','tace','radiofrequency'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier146_ane_693') {
    if (fn === 'preop') return { ...base, asa: 2, airway_mallampati: '2', mets: 0, npo_status: 'clear_liquids_2h', allergies_reviewed: true, consent_obtained: true };
    if (fn === 'induction') return { ...base, case_id: 'c1', technique: 'GETA', airway_device: 'ETT 7.5', induction_agent: 'propofol', induction_dose_mg: 200, ett_attempts: 1, duration_min: 10 };
    if (fn === 'intraop') return { ...base, case_id: 'c1', duration_hr: 3, ebl_ml: 200, temperature_c: 36.5, map_mmhg: 75, urine_output_ml: 250, airway: 'ETT', surgical_position_change: false, complications: 'none' };
    if (fn === 'pain') return { ...base, pain_score: 5, modality: 'PCA_IV', morphine_equiv_mg: 30, bolus_doses: 5, prn_doses: 2, side_effects: false };
    if (fn === 'emergence') return { ...base, case_id: 'c1', alderete_score: 9, disposition: 'PACU_phase1', pacu_minutes: 60, pain_controlled: true, nausea: false, shivering: false };
  }
  if (modName === 'tier146_hem_694') {
    if (fn === 'cbc') return { ...base, wbc: 7, hgb: 14, hct: 42, platelet: 250, mcv: 90, rbc: 4.5, retic: 1, suspicious: 'none' };
    if (fn === 'coagulation') return { ...base, pt: 12, inr: 1, ptt: 30, fibrinogen: 300, d_dimer: 0.5, anticoag: 'none', anti_xa: 0 };
    if (fn === 'transfusion') return { ...base, product: 'PRBC', units: 2, indication: 'Hgb_less_7', pre_hgb: 6.5, post_hgb: 8, reaction: false, reaction_type: 'none' };
    if (fn === 'chemo') return { ...base, regimen: 'R-CHOP', cycle: 1, day: 1, anc: 2.5, platelet: 200, given_full_dose: true, toxicity: 'none' };
    if (fn === 'marrow') return { ...base, site: 'iliac_crest', cellularity_pct: 60, m_e_ratio: 3, blasts_pct: 2, diagnosis: 'normal', cytogenetics: 'normal', flow: 'negative' };
  }
  if (modName === 'tier146_neu_695') {
    if (fn === 'craniotomy') return { ...base, indication: 'tumor_resection', approach: 'pterional', duration_hr: 4, ebl_ml: 300, position: 'supine', neuronavigation: true, awake: false, gcs_post: 15, surgeon: 'dr_n' };
    if (fn === 'spine_op') return { ...base, procedure: 'ACDF', levels: 2, cervical_thoracic_lumbar: 'cervical', ebl_ml: 150, duration_hr: 3, motor_evoked: 100, neuromonitoring: true, surgeon: 'dr_n' };
    if (fn === 'vp_shunt') return { ...base, type: 'programmable', opening_pressure: 10, drainage_amount_ml: 50, revision: false, shunt_series: 1, indication: 'NPH', surgeon: 'dr_n' };
    if (fn === 'intracranial_monitor') return { ...base, type: 'EVD', opening_pressure: 15, max_pressure_24h: 25, min_pressure_24h: 5, treatment_threshold: '20', drainage_ml: 100, days_in_place: 3, infection: 'none' };
    if (fn === 'skull_base') return { ...base, approach: 'endoscopic_endonasal', indication: 'pituitary_adenoma', duration_hr: 4, ebl_ml: 200, csf_leak_repair: true, surgeon: 'dr_n' };
  }
  if (modName === 'tier146_irr_696') {
    if (fn === 'biopsy') return { ...base, target: 'liver', modality: 'CT', needle_gauge: 18, passes: 3, core_length_cm: 2, adequacy: true, complications: false };
    if (fn === 'drain') return { ...base, location: 'pleural', catheter_size_fr: 12, drainage_ml_initial: 800, drainage_ml_24h: 200, pigtail: true, successful: true, reaccumulation: false };
    if (fn === 'angio') return { ...base, vessel: 'renal', indication: 'stenosis', contrast_ml: 100, fluoro_min: 20, dose_mgy: 50, access: 'femoral' };
    if (fn === 'tace') return { ...base, indication: 'HCC', tumor_size_cm: 3, num_tumors: 1, child_pugh: 'A', bclc_stage: 'B', embolization_agent: 'doxorubicin_DEB', response_mRECIST: 30 };
    if (fn === 'radiofrequency') return { ...base, target: 'liver', lesion_size_cm: 2, num_lesions: 1, duration_min: 30, max_temp_c: 90, kw_used: 100, complete_ablation: true, complications: false };
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