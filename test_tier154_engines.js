// filepath: test_tier154_engines.js
const modules = [
  { mod: 'tier154_ent_725', fns: ['ent_exam','audiology','surgery_ent','voice','sinus'] },
  { mod: 'tier154_oms_728', fns: ['consult','extraction','orthognathic','trauma','oral_pathology'] },
  { mod: 'tier154_ort_729', fns: ['consult','braces','aligner','retention','ortho_progress'] },
  { mod: 'tier154_per_730', fns: ['perio_exam','scaling','surgery_perio','implant','maintenance'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier154_ent_725') {
    if (fn === 'ent_exam') return { ...base, chief_complaint: 'hearing_loss', pure_tone_avg_left: 25, pure_tone_avg_right: 30, tympanogram: 'A_normal', nasal_endoscopy: 'normal', throat_exam: 'normal', neck_exam: 'normal' };
    if (fn === 'audiology') return { ...base, age_years: 45, ac_500_left: 30, ac_1000_left: 35, ac_2000_left: 40, ac_4000_left: 45, ac_500_right: 25, ac_1000_right: 30, ac_2000_right: 35, ac_4000_right: 40, srt_left: 35, srt_right: 30, word_recognition_left_pct: 88, word_recognition_right_pct: 92, hearing_loss_type: 'sensorineural', grade_left: 'mild', grade_right: 'mild' };
    if (fn === 'surgery_ent') return { ...base, procedure: 'T_and_A', duration_min: 45, ebl_ml: 30, bilateral: true, outpatient: true, los_days: 0, complications: 'none', pathology_sent: false, surgeon: 'dr_ent' };
    if (fn === 'voice') return { ...base, disorder: 'vocal_nodule', vhi_10_score: 25, f0_hz: 200, jitter_pct: 1.2, shimmer_db: 0.5, breathiness_index: 2, max_phonation_time: 12, smoker: false, voice_rest_days: 7, voice_therapy: true };
    if (fn === 'sinus') return { ...base, condition: 'chronic_rhinosinusitis', lund_mackay_score: 12, polyp_present: true, ct_findings: 4, allergy_present: true, aspirin_exacerbated: false, treatment: 'FESS', duration_weeks: 12 };
  }
  if (modName === 'tier154_oms_728') {
    if (fn === 'consult') return { ...base, indication: 'wisdom_teeth', classification: '3', age: 22, bmi: 25, asa: 1, smoker: false, chief_complaint: 'pain', diagnostic_count: 1 };
    if (fn === 'extraction') return { ...base, type: 'impacted', tooth_number: 32, arch: 'lower_left', difficulty: 'difficult', duration_min: 45, ebl_ml: 30, sections: 2, complications: 'none', antibiotic: true, healing_weeks: 2 };
    if (fn === 'orthognathic') return { ...base, procedure: 'LeFort_I', indication: 'class_III', maxillary_advancement_mm: 5, mandibular_advancement_mm: 0, cpb_min: 180, ebl_ml: 500, duration_hr: 4, fixation: 'miniplates', distraction_done: false, surgeon: 'dr_oms' };
    if (fn === 'trauma') return { ...base, type: 'mandible_fx', side: 'left', open_fx: true, displaced: true, airway_compromise: 'mild', broken_teeth: 2, ebl_ml: 200, or_surgery: true, duration_hr: 3, postop_trismus: false, healing_weeks: 6, surgeon: 'dr_oms' };
    if (fn === 'oral_pathology') return { ...base, site: 'tongue_lateral', lesion_type: 'leukoplakia', size_mm: 8, diagnosis: 'premalignant', biopsied: true, path_number: 12345, tnm_t: 1, margin: 'negative', refer_oncology: false, followup_months: 3 };
  }
  if (modName === 'tier154_ort_729') {
    if (fn === 'consult') return { ...base, age: 14, angle_class: 'II_division_1', malocclusion: 'crowding', overjet_mm: 8, overbite_mm: 5, midline_deviation_mm: 2, arch_length_discrepancy_mm: 5, par_index: 25, skeletal: true, goals: 'straight_teeth' };
    if (fn === 'braces') return { ...base, system: 'self_ligating', stage: 'active', treatment_months: 18, appointments_count: 12, last_adjustment_days: 30, elastics: true, headgear: false, expander: true, complications: 'none' };
    if (fn === 'aligner') return { ...base, brand: 'Invisalign', aligner_count: 24, treatment_weeks: 36, weeks_per_aligner: 2, compliance_good: true, attachment_count: '6_10', refinement_done: false, refinement_count: 0, completion: 'on_track' };
    if (fn === 'retention') return { ...base, retainer_type: 'Essix', maxillary_retainer: 1, mandibular_retainer: 1, wear_schedule: 'night_only', retention_months: 12, breakage_count: 0, lost_retainer: false, replacement_retainer: false, stable_occlusion: true };
    if (fn === 'ortho_progress') return { ...base, months_in_treatment: 12, overjet_mm: 3, overbite_mm: 2, arch_alignment_score: 80, space_closure_pct: 70, progress_assessment: 'on_track', estimated_months_remaining: 6, need_extractions: false, need_surgery: false, complications: 'none' };
  }
  if (modName === 'tier154_per_730') {
    if (fn === 'perio_exam') return { ...base, pocket_depth_avg: 4, pocket_depth_max: 7, classification: 'II_moderate', bleeding_on_probing_pct: 30, plaque_index: 1.5, gingival_recession_mm: 2, mobility_count: 0, furcation_count: 0, tooth_loss_count: 0, smoker: false, diabetes: false };
    if (fn === 'scaling') return { ...base, type: 'scaling_root_planing', quadrants: 4, duration_min: 60, bleeding_score: 2, anesthesia: true, anesthesia_type: 'local_infiltration', local_antibiotic: false, systemic_antibiotic: false, healing_weeks: 4, post_op_pain: 'mild' };
    if (fn === 'surgery_perio') return { ...base, procedure: 'flap', quadrant: 'UR', tooth_count: 4, graft_material_ml: 0, graft_type: 'none', duration_min: 60, sutures: 4, membrane: false, healing_weeks: 6 };
    if (fn === 'implant') return { ...base, system: 'Straumann', implant_count: 1, length_mm: 10, diameter_mm: 4.1, bone_quality: 'II_normal', torque_ncm: 35, bone_graft: false, sinus_lift: false, healing_months: 3, osteointegrated: true };
    if (fn === 'maintenance') return { ...base, recall_interval_months: 3, last_visit_days: 90, compliant: true, pocket_depth_change: 0, bleeding_pct_change: 5, stability: 'stable', needs_resurgery: false, tooth_loss_since_last: false, tooth_loss_count: 0 };
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