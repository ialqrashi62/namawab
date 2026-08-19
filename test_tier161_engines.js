// filepath: test_tier161_engines.js
const ENGINE_TESTS = [
  { mod: 'tier161_imu_755', fns: ['allergy_assess','immunodeficiency','autoinflammatory','iga_deficiency','hypersensitivity'] },
  { mod: 'tier161_hem_756', fns: ['anemia_workup','coag_disorder','transfusion_med','hematologic_malignancy','bone_marrow'] },
  { mod: 'tier161_max_757', fns: ['facial_trauma','orthognathic_impl','tmj','sleep_apnea_oral','cleft_care'] },
  { mod: 'tier161_pod_758', fns: ['foot_assessment','diabetic_foot','biomechanics','nail_surgery','wound_care'] }
];
const base = { tenant_id: 't1', patient_id: 'p1', provider: 'p' };
function bodyFor(mod, fn) {
  const r = { ...base };
  if (mod === 'tier161_imu_755') {
    if (fn === 'allergy_assess') return { ...base, age: 30, allergen_type: 'food', reaction_type: 'urticaria', skin_test_mm: 5, ige_elevated: true, ige_total: 200, skin_prick_wheal: 4, severity: 'moderate', epipen_prescribed: true };
    if (fn === 'immunodeficiency') return { ...base, age: 25, category: 'primary', igg_level: 400, iga_level: 50, igm_level: 30, cd4_count: 800, cd8_count: 400, vaccine_response: false, substitution: 'IVIG' };
    if (fn === 'autoinflammatory') return { ...base, age: 20, disease: 'FMF', crp: 50, esr: 40, saa: 100, fever_episodes_30d: 2, flare_days_30d: 5, treatment: 'colchicine', amyloidosis_screen: true };
    if (fn === 'iga_deficiency') return { ...base, age: 30, iga_level: 50, igg_level: 1000, igm_level: 100, iga_classification: 'selective_partial', recurrent_infections: true, infections_30d: 2, autoimmune_comorb: false, vaccine_response: 'normal' };
    if (fn === 'hypersensitivity') return { ...base, gell_coombs: 'I', urticaria: true, angioedema: false, anaphylaxis: false, bp_systolic: 130, hr: 80, trigger: 'drug', episode_count: 1, treatment_response: true };
  }
  if (mod === 'tier161_hem_756') {
    if (fn === 'anemia_workup') return { ...base, hgb: 9, mcv: 80, mch: 27, retic_pct: 2, ferritin: 50, b12: 300, folate: 10, classification: 'microcytic', workup_complete: true };
    if (fn === 'coag_disorder') return { ...base, pt: 12, inr: 1.1, ptt: 30, fibrinogen: 300, platelet_count: 200, disorder: 'ITP', family_history: false, bleeding_score: 'mild' };
    if (fn === 'transfusion_med') return { ...base, hgb_pre: 7, units_ordered: 2, product: 'PRBC', indication: 'anemia', type_crossmatch: true, abo_compatible: true, pre_medication_min: 30, monitored: true };
    if (fn === 'hematologic_malignancy') return { ...base, diagnosis: 'AML', wbc: 50, hgb: 8, platelet: 30, bone_marrow_blast_pct: 65, stage: 'high', cytogenetics: 'adverse', treatment_line: 'first' };
    if (fn === 'bone_marrow') return { ...base, age: 50, site: 'iliac_crest', cellularity_pct: 30, blast_pct: 5, interpretation: 'normal', cd34_count: 0.5, biopsy_volume_ml: 2, flow_cytometry: true, cyto_results: 1 };
  }
  if (mod === 'tier161_max_757') {
    if (fn === 'facial_trauma') return { ...base, mechanism: 'MVC', fracture_type: 'zygoma', gcs_score: 15, bp_systolic: 130, airway_compromise: false, eye_injury: false, loss_of_consciousness_min: 5, disposition: 'observation' };
    if (fn === 'orthognathic_impl') return { ...base, age: 25, surgery_type: 'BSSO', surgery_duration_min: 180, ebl_ml: 300, plate_count: true, fixation_type: 'rigid', hospital_days: 2, dental_occlusion_ok: true, complication: 'none' };
    if (fn === 'tmj') return { ...base, age: 35, diagnosis: 'disc_displacement', mouth_opening_mm: 25, pain_score: 5, joint_sounds: true, sound_type: 'click', bruxism: false, clenching: true, treatment: 'splint', improvement_pct: 30 };
    if (fn === 'sleep_apnea_oral') return { ...base, age: 50, bmi: 30, mandibular_advance: 'moderate', aHI: 10, ahi_baseline: 30, tongue_retainer: false, device_type: 'MAD', adherence_pct: 80, comfortable: true, epworth_score: 8 };
    if (fn === 'cleft_care') return { ...base, age: 5, cleft_type: 'cleft_lip_palate', laterality: 'left', surgeries_count: 2, age_first_surgery_months: 3, speech_score: 'mild', feeding_issues: false, dental_issues: true, team_stage: 'rehabilitation' };
  }
  if (mod === 'tier161_pod_758') {
    if (fn === 'foot_assessment') return { ...base, age: 60, diabetic: true, skin_status: 'intact', skin_temp_c: 30, peripheral_pulses: true, pedal_pulse: 'normal', mono_filament_score: 10, vibration_score: 25, sensation: 'normal' };
    if (fn === 'diabetic_foot') return { ...base, hba1c: 7, duration_diabetes_yrs: 10, wagner_grade: '2', texas_stage: 'A', ulcer_size_cm: 2, ulcer_depth_mm: 5, infection: false, infection_type: 'none', vascular_assessment: true, ankle_brachial_index: 1.0 };
    if (fn === 'biomechanics') return { ...base, age: 30, arch_type: 'normal', pes_planus_angle: 5, hallux_abductus_angle: 10, gait_pattern: 'normal', q_angle_deg: 15, foot_posture_index: 0, recommendation: 'orthotics', shoe_modification: false, activity_level: 'active' };
    if (fn === 'nail_surgery') return { ...base, age: 25, pathology: 'ingrown', recurrence: false, previous_procedures: 0, procedure: 'partial_avulsion', lidocaine_mg: 20, tourniquet_min: 5, antibiotic_prophylaxis: true, healing_stage: 'normal', followup_days: 7 };
    if (fn === 'wound_care') return { ...base, wound_size_cm: 3, wound_depth_mm: 5, wagner_grade: '1', exudate: 'serous', infection: false, dressing_type: 'hydrocolloid', healing_rate_pct_30d: 50, offloading: true, disposition: 'home' };
  }
  return r;
}
let pass = 0, fail = 0;
for (const t of ENGINE_TESTS) {
  const { funcs, ValidationError } = require('./' + t.mod + '_engine.js');
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