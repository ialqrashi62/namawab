// filepath: tier39_ent_ext_230_laryngology_engine.js
// TIER39_ENT-230: Laryngology
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function hoarseness(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.duration_weeks, 'dur');
  ensureBool(req.smoker, 'smoke');
  ensureBool(req.reflux, 'reflux');
  ensureBool(req.flexible_laryngoscopy_done, 'flex');
  ensureEnum(req.lesion, 'lesion', ['normal','vocal_cord_polyp','vocal_cord_nodules','vocal_cord_cyst','vocal_cord_paralysis','laryngitis','leukoplakia','malignancy','granuloma','other']);
  let status;
  if (req.duration_weeks >= 4 && !req.flexible_laryngoscopy_done) status = 'chronic_hoarseness_laryngoscopy_indicated';
  else if (req.lesion === 'malignancy') status = 'malignancy_urgent_biopsy_refer';
  else if (req.lesion === 'vocal_cord_polyp' && req.smoker) status = 'polyp_smoker_surgical_excision';
  else if (req.smoker && req.reflux === false) status = 'smoker_hoarseness_cessation_aggressive';
  else status = 'hoarseness_review';
  return { status, l: req.lesion };
}

function vocal_cord_nodules(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.side, 'side', ['left','right','bilateral','midline','other']);
  ensureEnum(req.occupation, 'occ', ['teacher','singer','lawyer','call_center','salesperson','coach','parent','professional','student','other']);
  ensureBool(req.voice_therapy_initiated, 'vt');
  ensureBool(req.surgery_needed, 'sx');
  ensureBool(req.follow_up_8_weeks, 'fup');
  let status;
  if (req.voice_therapy_initiated === false && req.surgery_needed === false) status = 'voice_therapy_first_line_initiate';
  else if (req.surgery_needed && !req.voice_therapy_initiated) status = 'surgery_premature_voice_therapy_first';
  else if (req.voice_therapy_initiated && !req.follow_up_8_weeks) status = 'voice_therapy_8_week_follow_up_required';
  else if (req.voice_therapy_initiated && req.follow_up_8_weeks && req.surgery_needed === false) status = 'voice_therapy_continuing';
  else status = 'vocal_cord_nodules_review';
  return { status, occ: req.occupation };
}

function subglottic_stenosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.severity, 'sev', ['grade_1_cotton','grade_2_cotton','grade_3_cotton','grade_4_cotton','unknown','other']);
  ensureEnum(req.cause, 'cause', ['prolonged_intubation','trauma','autoimmune','idiopathic','infection','radiation','other']);
  ensureEnum(req.intervention, 'intervention', ['observation','balloon_dilation','laser_cordotomy','tracheal_resection','tracheostomy','stent','none','other']);
  ensureEnum(req.recurrence, 'rec', ['none','mild','moderate','severe','monitor','unknown','other']);
  ensureBool(req.follow_up_4_weeks, 'fup');
  let status;
  if (req.severity === 'grade_3_cotton' && req.intervention === 'observation') status = 'grade_3_cotton_intervention_indicated';
  else if (req.recurrence === 'severe' && req.intervention === 'balloon_dilation') status = 'recurrence_severe_re_evaluate_surgery';
  else if (!req.follow_up_4_weeks) status = 'sgs_follow_up_4_weeks_required';
  else status = 'sgs_review';
  return { status, sev: req.severity };
}

function laryngeal_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stage, 'stage', ['t1a_n0_m0','t1b_n0_m0','t2_n0_m0','t3_n0_m0','t1_n1_m0','t2_n1_m0','t3_n1_m0','t4a_n_any_m0','t4b_n_any_m0','any_t_n_any_m1','other']);
  ensureEnum(req.subsite, 'sub', ['glottic','supraglottic','subglottic','transglottic','other']);
  ensureBool(req.hpv_related, 'hpv');
  ensureEnum(req.treatment, 'rx', ['transoral_laser_microsurgery','partial_laryngectomy','total_laryngectomy','radiation','chemo_radiation','combination','observation','other']);
  ensureBool(req.smoking_cessation, 'cessation');
  let status;
  if (req.subsite === 'glottic' && req.stage === 't1a_n0_m0' && req.treatment === 'transoral_laser_microsurgery') status = 't1a_glottic_laser_curative';
  else if (req.stage.includes('m1')) status = 'metastatic_laryngeal_cancer_systemic';
  else if (!req.smoking_cessation) status = 'smoking_cessation_essential';
  else if (req.stage === 't2_n0_m0' && req.treatment === 'radiation') status = 't2_glottic_radiation_alternative';
  else status = 'laryngeal_cancer_review';
  return { status, st: req.stage };
}

function tracheostomy_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.trach_age_weeks, 'age');
  ensureBool(req.decannulation_planning, 'decann');
  ensureEnum(req.swallow_assessment, 'swal', ['passed','pending','failed','not_indicated','other']);
  ensureBool(req.first_trach_change_scheduled, 'first_change');
  ensureBool(req.humidification, 'humid');
  let status;
  if (req.first_trach_change_scheduled === false && req.trach_age_weeks >= 1) status = 'first_trach_change_due';
  else if (req.decannulation_planning && req.swallow_assessment !== 'passed') status = 'decannulation_swallow_assess_pass_first';
  else if (req.decannulation_planning && req.swallow_assessment === 'passed') status = 'decannulation_candidate_cap';
  else if (req.humidification === false) status = 'humidification_required_for_trach';
  else status = 'trach_care_review';
  return { status, age: req.trach_age_weeks };
}

function funcs() { return { hoarseness, vocal_cord_nodules, subglottic_stenosis, laryngeal_cancer, tracheostomy_care }; }
module.exports = { funcs, ValidationError };