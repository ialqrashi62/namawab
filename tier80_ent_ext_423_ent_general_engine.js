// filepath: tier80_ent_ext_423_ent_general_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ent_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.complaint, 'c', ['hearing_loss','tinnitus','vertigo','ear_pain','sore_throat','nasal_obstruction','epistaxis','hoarseness','snoring','other']);
  ensureNum(req.duration_months, 'dur');
  ensureBool(req.bilateral, 'bil');
  ensureStr(req.exam_findings, 'ef');
  ensureStr(req.diagnosis, 'dx');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.medications, 'meds');
  ensureEnum(req.laterality, 'lat', ['right','left','bilateral','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function audiometry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.ac_threshold_right_500, 'atr5');
  ensureNum(req.ac_threshold_left_500, 'atl5');
  ensureNum(req.ac_threshold_right_1000, 'atr1');
  ensureNum(req.ac_threshold_left_1000, 'atl1');
  ensureNum(req.ac_threshold_right_2000, 'atr2');
  ensureNum(req.ac_threshold_left_2000, 'atl2');
  ensureNum(req.ac_threshold_right_4000, 'atr4');
  ensureNum(req.ac_threshold_left_4000, 'atl4');
  ensureEnum(req.loss_type_right, 'ltr', ['normal','mild','moderate','severe','profound','unknown']);
  ensureEnum(req.loss_type_left, 'ltl', ['normal','mild','moderate','severe','profound','unknown']);
  ensureEnum(req.loss_pattern, 'lp', ['conductive','sensorineural','mixed','normal','central','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.study_id };
}
function hearing_aid(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.device_id, 'did');
  ensureEnum(req.ear, 'ear', ['right','left','bilateral','unknown']);
  ensureStr(req.model, 'model');
  ensureStr(req.manufacturer, 'mfgr');
  ensureNum(req.fit_date, 'fd');
  ensureNum(req.real_ear_gain_db, 'reg');
  ensureNum(req.hour_per_day_use, 'hpd');
  ensureBool(req.adjustments_made, 'adj');
  ensureStr(req.comfort_feedback, 'cf');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { did: req.device_id };
}
function cochlear_impl(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.device_id, 'did');
  ensureEnum(req.side, 'side', ['right','left','bilateral','unknown']);
  ensureStr(req.brand_model, 'bm');
  ensureNum(req.implant_date, 'id');
  ensureBool(req.activation_done, 'act');
  ensureNum(req.speech_score_pre, 'ssp');
  ensureNum(req.speech_score_post, 'ssp2');
  ensureBool(req.mapping_done, 'map');
  ensureNum(req.rehabilitation_hours, 'rh');
  ensureStr(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { did: req.device_id };
}
function ent_referral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureStr(req.referring_provider, 'rp');
  ensureEnum(req.specialty, 'sp', ['otology','rhinology','laryngology','head_neck','facial_plastics','pediatric_ent','audiology','balance','other']);
  ensureStr(req.reason, 'reason');
  ensureEnum(req.urgency, 'urg', ['routine','urgent','emergent','unknown','other']);
  ensureStr(req.clinical_question, 'cq');
  ensureStr(req.pertinent_findings, 'pf');
  ensureStr(req.workup_done, 'wd');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { rid: req.referral_id };
}

function funcs() { return { ent_clinic, audiometry, hearing_aid, cochlear_impl, ent_referral }; }
module.exports = { funcs, ValidationError };