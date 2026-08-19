// filepath: tier98_cardio_electrophysiology_516_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pacemaker_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.device_type, 'dt', ['single_chamber','dual_chamber','biventricular','icd','leadless','other','unknown']);
  ensureNum(req.battery_voltage, 'bv');
  ensureNum(req.atrial_threshold, 'ath');
  ensureNum(req.ventricular_threshold, 'vth');
  ensureNum(req.atrial_pct_paced, 'ap');
  ensureNum(req.ventricular_pct_paced, 'vp');
  ensureEnum(req.lead_status, 'ls', ['normal','impending_failure','failed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function icd_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.battery_voltage, 'bv');
  ensureNum(req.shock_impedance, 'si');
  ensureNum(req.detection_zone, 'dz');
  ensureNum(req.shocks_delivered, 'sd');
  ensureNum(req.atp_sequences, 'atp');
  ensureNum(req.episodes_treated, 'et');
  ensureBool(req.inappropriate_shocks, 'is');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function anticoagulation_cardio(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.cha2ds2_vasc, 'c2v');
  ensureNum(req.has_bled, 'hbl');
  ensureEnum(req.anticoagulant, 'ac', ['warfarin','apixaban','rivaroxaban','dabigatran','edoxaban','other','unknown','none']);
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.inr, 'inr');
  ensureNum(req.time_in_range, 'tir');
  ensureNum(req.adherence, 'adh');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function lipid_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ldl, 'ldl');
  ensureNum(req.hdl, 'hdl');
  ensureNum(req.triglycerides, 'tg');
  ensureNum(req.lpa, 'lpa');
  ensureBool(req.statin, 'st');
  ensureNum(req.statin_dose, 'sd');
  ensureNum(req.pcsk9_inhibitor, 'pcsk');
  ensureEnum(req.ldl_target_met, 'ltm', ['yes','no','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cardiac_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.sessions_completed, 'sc');
  ensureNum(req.sessions_target, 'st');
  ensureNum(req.mets_improvement, 'mi');
  ensureNum(req.exercise_minutes_week, 'emw');
  ensureNum(req.bp_resting, 'bpr');
  ensureNum(req.bp_exercise, 'bpe');
  ensureNum(req.compliance, 'cmp');
  ensureBool(req.completed, 'done');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { pacemaker_followup, icd_followup, anticoagulation_cardio, lipid_management, cardiac_rehab }; }
module.exports = { funcs, ValidationError };
