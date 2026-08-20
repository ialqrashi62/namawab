// filepath: test_tier166_engines.js
const ENGINE_TESTS = [
  { mod: 'tier166_cul_775', fns: ['cultural_assessment','interpreter_use','religious_considerations','community_health_worker','patient_navigator'] },
  { mod: 'tier166_psy_776', fns: ['psych_eval','psychotherapy','psych_pharm','substance_use','behavioral_health_crisis'] },
  { mod: 'tier166_den_777', fns: ['dental_exam','dental_procedure','orthodontic','endodontic','maxillofacial_surg'] },
  { mod: 'tier166_vis_778', fns: ['visual_acuity','refraction','ophthalmic_exam','retinal_screening','pediatric_vision'] }
];
const base = { tenant_id: 't1', patient_id: 'p1', provider: 'p' };
function bodyFor(mod, fn) {
  if (mod === 'tier166_cul_775') {
    if (fn === 'cultural_assessment') return { ...base, age: 30, language_pref: 'Arabic', religion: 'Muslim', family_present: true, decision_style: 'family', gender_pref_match: true, cultural_needs_met: true, barrier_type: 'language', satisfaction: 8 };
    if (fn === 'interpreter_use') return { ...base, interpreter_type: 'video', duration_min: 30, source_lang: 'Arabic', target_lang: 'English', medical_terms_checked: true, accuracy_score: 9, satisfaction: 9, modality: 'scheduled', disposition: 'continue' };
    if (fn === 'religious_considerations') return { ...base, religion: 'Muslim', dietary_observance: true, fasting: true, prayer_schedule: true, blood_products_ok: true, end_of_life_counsel: false, modesty_preference: 'high', care_plan_accommodated: true };
    if (fn === 'community_health_worker') return { ...base, age: 30, chw_visits_30d: '3-5', followup_adherence: 80, medication_reconcile: true, health_education: true, social_needs: 'food', referrals_made: 2, chw_setting: 'home', satisfaction_score: 9 };
    if (fn === 'patient_navigator') return { ...base, appointments_scheduled: 4, no_shows_30d: 0, barriers_resolved: true, barrier_type: 'transport', cost_savings: 200, days_to_first_appt: 5, disposition: 'engaged', contact_count: 10 };
  }
  if (mod === 'tier166_psy_776') {
    if (fn === 'psych_eval') return { ...base, age: 30, phq9_score: 12, gad7_score: 10, pcl5_score: 30, psychosis: 'none', cognitive: 'intact', risk_level: 'moderate', disposition: 'outpatient', safety_plan: true };
    if (fn === 'psychotherapy') return { ...base, age: 30, modality: 'CBT', sessions_30d: 4, session_min: 50, frequency: 'weekly', score_baseline: 20, score_current: 12, improvement_pct: 40, adherence: 'good' };
    if (fn === 'psych_pharm') return { ...base, age: 30, drug_class: 'SSRI', drug_name: 'sertraline', dose_mg: 50, days_on_med: 30, score_baseline: 20, score_current: 10, adverse_effects: false, adherence: 'good' };
    if (fn === 'substance_use') return { ...base, age: 30, substance: 'alcohol', audit_c_score: 8, dast_score: 4, days_used_30d: 5, severity: 'mild', treatment_engaged: true, treatment_type: 'CBT', days_clean: 30 };
    if (fn === 'behavioral_health_crisis') return { ...base, age: 25, crisis_type: 'suicidal', risk_score: 8, safety_plan: true, means_restricted: true, disposition: 'crisis_unit', followup_days: 1, referral: 'therapy' };
  }
  if (mod === 'tier166_den_777') {
    if (fn === 'dental_exam') return { ...base, age: 30, teeth_present: 28, teeth_missing: 4, teeth_decay: 2, teeth_filled: 3, periodontal: 'gingivitis', plaque_index: 30, oral_hygiene: 'good', last_cleaning_months: 6 };
    if (fn === 'dental_procedure') return { ...base, age: 30, procedure_type: 'filling', tooth_number: 14, duration_min: 30, lidocaine_mg: 40, complication: 'none', disposition: 'discharged', followup_days: 0 };
    if (fn === 'orthodontic') return { ...base, age: 15, treatment_type: 'braces', duration_months: 12, appointments_30d: 1, progress: 'mid', ovj_mm: 3, ovb_mm: 2, compliance: 'good', next_visit_days: 30 };
    if (fn === 'endodontic') return { ...base, age: 35, tooth: 19, diagnosis: 'pulpitis', canal_count: 2, duration_min: 60, material: 'gutta_percha', success_pct: 95, followup_days: 7 };
    if (fn === 'maxillofacial_surg') return { ...base, age: 25, surgery_type: 'impacted_tooth', duration_min: 45, ebl_ml: 50, biopsy_sent: false, pathology: 'no_result', hospital_days: 0, complication: 'none' };
  }
  if (mod === 'tier166_vis_778') {
    if (fn === 'visual_acuity') return { ...base, age: 30, left_eye_va: 20, right_eye_va: 20, both_eye_va: 20, correction: 'corrected', glasses_prescription: 2.0, refraction_done: true, disposition: 'change' };
    if (fn === 'refraction') return { ...base, age: 30, sphere_od: -2.0, cylinder_od: -0.5, axis_od: 90, sphere_os: -2.0, cylinder_os: -0.5, axis_os: 90, add_od: 0, add_os: 0, disposition: 'glasses' };
    if (fn === 'ophthalmic_exam') return { ...base, age: 50, exam_type: 'tonometry', iop_od: 16, iop_os: 17, cup_disc_ratio: 'normal', cataract: false, glaucoma: false, macula_normal: true, disposition: 'normal' };
    if (fn === 'retinal_screening') return { ...base, age: 60, diabetic: true, grade: 'mild', macula_edema: false, screening_count: 2, image_quality_ok: true, method: 'fundus_photo', disposition: 'follow_up' };
    if (fn === 'pediatric_vision') return { ...base, age: 5, test_method: 'LEA', va_od: 20, va_os: 20, amblyopia: false, strabismus: false, stereoacuity: 40, referral: 'monitor' };
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