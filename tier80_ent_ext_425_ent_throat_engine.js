// filepath: tier80_ent_ext_425_ent_throat_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tonsillitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','unknown','other']);
  ensureNum(req.centor_score, 'cs');
  ensureBool(req.strep_test_positive, 'stp');
  ensureBool(req.fever_present, 'fev');
  ensureBool(req.tonsillar_exudate, 'te');
  ensureBool(req.lymphadenopathy, 'lad');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.abscess_present, 'abs');
  ensureBool(req.referred_surgery, 'rs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function tonsillectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.indication, 'ind', ['recurrent_tonsillitis','abscess','sleep_apnea','cancer','peritonsillar_abscess','other','unknown']);
  ensureStr(req.technique, 'tech');
  ensureNum(req.operative_time_min, 'otm');
  ensureNum(req.ebl_ml, 'ebl');
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','airway_obstruction','dehydration','taste_change','other']);
  ensureNum(req.pod_diet_resume, 'podr');
  ensureNum(req.hospital_stay_hours, 'hsh');
  ensureStr(req.discharge_plan, 'dp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function obstructive_sleep_apnea(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.aahi, 'aahi');
  ensureEnum(req.severity, 'sev', ['normal','mild','moderate','severe','unknown','other']);
  ensureBool(req.sleep_study_done, 'ssd');
  ensureNum(req.lowest_o2, 'lo2');
  ensureStr(req.symptoms, 'sym');
  ensureBool(req.cpap_started, 'cpap');
  ensureBool(req.bariatric_consult, 'bc');
  ensureBool(req.surgical_referral, 'sr');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function laryngitis_reflux(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.laryngeal_findings, 'lf', ['normal','erythema','edema','nodules','polyps','leukoplakia','carcinoma','granuloma','other','unknown']);
  ensureNum(req.reflux_symptom_index, 'rsi');
  ensureBool(req.ppi_started, 'ppi');
  ensureBool(req.diet_lifestyle, 'dl');
  ensureBool(req.voice_therapy, 'vt');
  ensureBool(req.smoking_cessation, 'sc');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function voice_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.voice_handicap_index, 'vhi');
  ensureEnum(req.diagnosis, 'dx', ['functional_dysphonia','vocal_nodules','vocal_polyps','spasmodic_dysphonia','puberphonia','presbylarynx','other','unknown']);
  ensureBool(req.stroboscopy_done, 'std');
  ensureStr(req.therapy_modalities, 'tm');
  ensureNum(req.session_count, 'sc');
  ensureNum(req.improvement_score, 'is');
  ensureBool(req.surgical_discussed, 'sd');
  ensureStr(req.treatment_response, 'tr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { tonsillitis, tonsillectomy, obstructive_sleep_apnea, laryngitis_reflux, voice_therapy }; }
module.exports = { funcs, ValidationError };