// filepath: test_tier175_engines.js
const ENGINE_TESTS = [
  { mod: 'tier175_eye_816', fns: ['glaucoma_follow','macular_degen','cataract_eval','retinal_detach','pediatric_eye'] },
  { mod: 'tier175_ent_817', fns: ['sinusitis_eval','hearing_aid_fit','tinnitus_eval','vertigo_eval','voice_disorder'] },
  { mod: 'tier175_ski_818', fns: ['derm_eval','skin_biopsy','excision','cryotherapy','patch_test'] },
  { mod: 'tier175_mus_819', fns: ['lupus_follow','ra_follow','vasculitis_follow','myositis_follow','scleroderma_follow'] },
  { mod: 'tier175_psy_820', fns: ['depression_screen','anxiety_screen','ptsd_screen','bipolar_follow','schizophrenia_follow'] }
];
const base = { tenant_id: 't1', patient_id: 'p1', provider: 'p' };
function bodyFor(mod, fn) {
  if (mod === 'tier175_eye_816') {
    if (fn === 'glaucoma_follow') return { ...base, age: 60, iop_od: 18, iop_os: 19, cup_disc_ratio: 'borderline', field_loss_pct: 15, drops_count: 2, laser_done: false, disposition: 'adjust' };
    if (fn === 'macular_degen') return { ...base, age: 70, type: 'wet', va_od: 20, va_os: 40, oct_findings: 'fluid', anti_vegf_treatment: true, injections_30d: 1, disposition: 'inject' };
    if (fn === 'cataract_eval') return { ...base, age: 70, eye: 'left', severity: 'moderate', va_pre: 20, glare_disability: true, surgery_planned: true, iol_type: 'monofocal', disposition: 'surgery_planned' };
    if (fn === 'retinal_detach') return { ...base, age: 60, eye: 'right', type: 'rhegmatogenous', macula_off_hr: 24, surgery_urgency: true, procedure: 'vitrectomy', anesthesia_min: 90, outcome: 'attached' };
    if (fn === 'pediatric_eye') return { ...base, age: 5, disorder: 'strabismus', va_od: 20, va_os: 20, treatment: 'patch', followup_months: 6, disposition: 'continue' };
  }
  if (mod === 'tier175_ent_817') {
    if (fn === 'sinusitis_eval') return { ...base, age: 35, type: 'chronic', duration_days: 90, polyps_present: true, ct_score: 12, treatment: 'spray', antibiotic_used: true, surgery_planned: true };
    if (fn === 'hearing_aid_fit') return { ...base, age: 70, audiogram_pta: 50, speech_discrimination: 60, type: 'BTE', feedback_count: 1, comfort: 'good', benefit_score: 7, followup_months: 6 };
    if (fn === 'tinnitus_eval') return { ...base, thi_score: 50, laterality: 'bilateral', pitch: 'high', hearing_loss: 'moderate', treatment: 'CBT', improvement_pct: 30 };
    if (fn === 'vertigo_eval') return { ...base, age: 60, dhi_score: 60, diagnosis: 'BPPV', duration_min: 5, treatment: 'Epley', response: 'good', balance_test: 'normal' };
    if (fn === 'voice_disorder') return { ...base, age: 50, diagnosis: 'nodules', vhi_score: 50, treatment: 'voice_therapy', sessions_completed: 4, improvement_pct: 40, disposition: 'continue' };
  }
  if (mod === 'tier175_ski_818') {
    if (fn === 'derm_eval') return { ...base, age: 40, body_area: 'face', lesion_type: 'nodule', count: 1, size_mm: 5, color: 'hyperpigmented', distribution: 'localized', followup_months: 3, biopsy_planned: true };
    if (fn === 'skin_biopsy') return { ...base, age: 60, type: 'punch', size_mm: 4, pathology: 'BCC', margin_status: 'clear', healing_days: 7, complication: 'none' };
    if (fn === 'excision') return { ...base, age: 50, type: 'simple', location: 'back', size_mm: 10, closure: 'primary', margin_mm: 4, complication: 'none', followup_days: 7 };
    if (fn === 'cryotherapy') return { ...base, age: 35, indication: 'wart', location: 'hand', freeze_time_sec: 20, lesions_count: 3, response: 'partial', blister_score: 2, followup_weeks: 4 };
    if (fn === 'patch_test') return { ...base, age: 35, condition: 'eczema', allergens_count: 30, positive_count: 4, allergens_positive: 'fragrance, nickel, balsam, cobalt', relevance_score: 8, reading_days: 2, late_read: false };
  }
  if (mod === 'tier175_mus_819') {
    if (fn === 'lupus_follow') return { ...base, age: 30, selena_sledai: 4, dsDNA: 80, complement: 60, urine_protein: 0.5, steroid_dose: 5, immunosuppression: 'MMF', flares_30d: 0, disposition: 'continue' };
    if (fn === 'ra_follow') return { ...base, age: 50, das28: 3.2, crp: 5, joints_swollen: 4, joints_tender: 6, biologic: 'adalimumab', methotrexate: true, response: 'moderate' };
    if (fn === 'vasculitis_follow') return { ...base, age: 50, type: 'GPA', bv_score: 2, pr3: 30, mpo: 1, steroid_dose: 10, immunosuppression: 'rituximab', flares_30d: 0 };
    if (fn === 'myositis_follow') return { ...base, age: 50, type: 'DM', ck: 200, aldolase: 12, mda5: 'positive', steroid_dose: 10, immunosuppression: 'IVIG', response: 'partial' };
    if (fn === 'scleroderma_follow') return { ...base, age: 50, type: 'limited', skin_score: 18, raynauds_severity: 5, pah_mmhg: 30, il6_therapy: 'tocilizumab', response: 'stable' };
  }
  if (mod === 'tier175_psy_820') {
    if (fn === 'depression_screen') return { ...base, phq9_score: 12, duration_days: 30, sleep_quality: 3, energy: 3, interest: 2, suicidal_ideation: false, treatment: 'SSRI', followup_months: 1 };
    if (fn === 'anxiety_screen') return { ...base, gad7_score: 12, duration_days: 60, triggers: 'work', somatic: true, sleep_quality: 3, treatment: 'SSRI', response: 'partial', followup_months: 1 };
    if (fn === 'ptsd_screen') return { ...base, pcl5_score: 45, trauma_type: 'combat', avoidance: true, hyperarousal: true, dissociative: false, treatment: 'CBT', therapy_sessions: 8, followup_months: 3 };
    if (fn === 'bipolar_follow') return { ...base, age: 40, mood_state: 'euthymic', young_score: 8, lithium_level: 0.8, mood_stabilizer: 'lithium', compliance_pct: 90, hospitalizations_30d: 0, followup_months: 1 };
    if (fn === 'schizophrenia_follow') return { ...base, age: 35, panss_score: 60, positive_score: 15, negative_score: 20, antipsychotic: 'olanzapine', compliance_pct: 80, side_effects: 'weight_gain', followup_months: 1 };
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