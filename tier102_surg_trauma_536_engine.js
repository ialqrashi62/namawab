// filepath: tier102_surg_trauma_536_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function trauma_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.injury_severity_score, 'iss');
  ensureEnum(req.mechanism, 'mech', ['motor_vehicle','fall','gunshot','stab','pedestrian','other','unknown']);
  ensureEnum(req.primary_survey, 'ps', ['stable','airway_compromised','breathing_compromised','circulatory_compromised','neurological_compromise','multiple','other','unknown']);
  ensureNum(req.gcs, 'gcs');
  ensureNum(req.sbp, 'sbp');
  ensureBool(req.resuscitation_required, 'rr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function damage_control(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureBool(req.damage_control_done, 'dcd');
  ensureNum(req.phase, 'ph');
  ensureNum(req.temperature, 'temp');
  ensureBool(req.coagulopathy, 'coag');
  ensureNum(req.lactate, 'lac');
  ensureBool(req.ic_done, 'icd');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function resuscitation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.crystalloid_ml, 'cm');
  ensureNum(req.blood_products_units, 'bpu');
  ensureBool(req.vasopressors, 'vp');
  ensureBool(req.trali, 'trali');
  ensureBool(req.stabilization, 'stab');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function penetrating_trauma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.injury_type, 'it', ['gunshot','stab','impalement','explosion','other','unknown']);
  ensureStr(req.location, 'loc');
  ensureNum(req.organs_injured, 'oi');
  ensureBool(req.hemoperitoneum, 'hpn');
  ensureBool(req.surgical_intervention, 'si');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function blunt_trauma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.injury_type, 'it', ['mvc','mcc','pedestrian_struck','fall_from_height','sports','assault','other','unknown']);
  ensureNum(req.organs_injured, 'oi');
  ensureBool(req.hemoperitoneum, 'hpn');
  ensureBool(req.surgical_intervention, 'si');
  ensureNum(req.complications, 'comp');
  ensureNum(req.iss, 'iss');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { trauma_assessment, damage_control, resuscitation, penetrating_trauma, blunt_trauma }; }
module.exports = { funcs, ValidationError };
