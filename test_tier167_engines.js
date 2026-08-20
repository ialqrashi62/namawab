// filepath: test_tier167_engines.js
const ENGINE_TESTS = [
  { mod: 'tier167_aud_779', fns: ['audiometry','hearing_aid','tinnitus','vestibular','cochlear'] },
  { mod: 'tier167_spe_780', fns: ['speech_evaluation','speech_therapy','voice_therapy','swallowing','pediatric_speech'] },
  { mod: 'tier167_drm_781', fns: ['derm_exam','biopsy','mohs','skin_cancer_screening','dermatitis_mgmt'] },
  { mod: 'tier167_onc_782', fns: ['staging_solid','chemotherapy','radiation','tumor_markers','survivorship'] }
];
const base = { tenant_id: 't1', patient_id: 'p1', provider: 'p' };
function bodyFor(mod, fn) {
  if (mod === 'tier167_aud_779') {
    if (fn === 'audiometry') return { ...base, age: 50, pta_right: 30, pta_left: 25, type: 'sensorineural', word_recognition_right: 80, word_recognition_left: 85, tinnitus_severity: 3, disposition: 'HA' };
    if (fn === 'hearing_aid') return { ...base, age: 60, type: 'BTE', battery_days: 14, days_used: 10, feedback_complaints: 0, comfort: 'good', benefit_score: 8, followup_days: 30 };
    if (fn === 'tinnitus') return { ...base, age: 50, thi_score: 40, laterality: 'bilateral', pitch: 'high', duration_months: 12, treatment: 'CBT', improvement_pct: 30 };
    if (fn === 'vestibular') return { ...base, age: 60, dhi_score: 50, diagnosis: 'BPPV', hit_score_right: 80, hit_score_left: 85, fall_risk: 5, treatment: 'Epley', improvement_pct: 70 };
    if (fn === 'cochlear') return { ...base, age: 30, pta_pre: 100, pta_post: 30, disability_pct: 60, candidate: 'excellent', device: 'bilateral', rehab_sessions: 12, outcome: 'good' };
  }
  if (mod === 'tier167_spe_780') {
    if (fn === 'speech_evaluation') return { ...base, age: 30, disorder_type: 'articulation', score_baseline: 60, score_current: 80, dysphagia: false, dysphonia: false, severity: 'moderate', disposition: 'continue' };
    if (fn === 'speech_therapy') return { ...base, age: 30, sessions_30d: 4, session_min: 45, method: 'individual', score_baseline: 60, score_current: 75, improvement_pct: 25, disposition: 'continue' };
    if (fn === 'voice_therapy') return { ...base, age: 40, diagnosis: 'nodules', f0_hz: 200, shing_ratio_pct: 5, sessions_30d: 4, voice_rest_compliant: true, improvement_pct: 40, disposition: 'continue' };
    if (fn === 'swallowing') return { ...base, age: 60, phase: 'pharyngeal', dysphagia_severity: 5, aspiration_risk: true, diet_mod: 'puree', timed_swallow_test: 12, vfs_done: true, disposition: 'downgrade' };
    if (fn === 'pediatric_speech') return { ...base, age_months: 30, expressive_words: 20, receptive_words: 50, milestone: 'normal', autism_screening: true, hearing_test: true, sessions_30d: 2, improvement_pct: 30 };
  }
  if (mod === 'tier167_drm_781') {
    if (fn === 'derm_exam') return { ...base, age: 40, body_area: 'face', lesion_type: 'nodule', count: 1, size_mm: 5, color: 'hyperpigmented', distribution: 'localized', disposition: 'biopsy' };
    if (fn === 'biopsy') return { ...base, age: 50, type: 'excisional', site: 1, size_mm: 8, indication: 'suspicious', suture_count: 4, complication: false, pathology: 'benign', followup_days: 7 };
    if (fn === 'mohs') return { ...base, age: 65, tumor_type: 'BCC', size_mm: 10, location: 'nose', stages: 3, clear_margins: true, reconstruction: 'flap', followup_days: 30 };
    if (fn === 'skin_cancer_screening') return { ...base, age: 45, fitzpatrick: 'II', mole_count: 50, suspicious_count: '1', family_history: 'one', dermoscopy_used: true, images_taken: 1, disposition: 'follow_up' };
    if (fn === 'dermatitis_mgmt') return { ...base, age: 30, type: 'atopic', scorad_baseline: 60, scorad_current: 20, patch_test_done: true, topical_treatment: true, systemic_tx: 'none', improvement_pct: 70 };
  }
  if (mod === 'tier167_onc_782') {
    if (fn === 'staging_solid') return { ...base, age: 60, tumor_type: 'breast', tumor_size_mm: 25, nodes_positive: 2, nodes_examined: 15, metastasis: false, metastasis_site: 'none', tnm_stage: 'II', karnofsky_score: 80 };
    if (fn === 'chemotherapy') return { ...base, age: 55, height_cm: 165, weight_kg: 65, bsa: 1.7, regimen: 'AC-T', cycle_number: 3, dose_mg: 600, cycles_planned: 8, toxicity_grade: '2' };
    if (fn === 'radiation') return { ...base, age: 55, type: 'EBRT', dose_gy: 50, fractions: 25, dose_per_fraction: 2, target: 'adjuvant', days_treated: 25, toxicity_score: 2 };
    if (fn === 'tumor_markers') return { ...base, age: 60, marker: 'CEA', value: 5, baseline: 10, change_pct: -50, trend: 'falling', clinical_significance: 'moderate' };
    if (fn === 'survivorship') return { ...base, age: 60, months_since_dx: 36, comorbidities: 1, late_effects: 'fatigue', qol_score: 75, surveillance_imaging: true, followup_days: 90, disposition: 'survivor' };
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