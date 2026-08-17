// filepath: tier49_nursing_ext_278_nurs_assess_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function vital_signs_full(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.temp, 'temp');
  ensureNum(req.heart_rate, 'hr');
  ensureNum(req.resp_rate, 'rr');
  ensureNum(req.bp_systolic, 'sbp');
  ensureNum(req.bp_diastolic, 'dbp');
  ensureNum(req.oxygen_sat, 'spo2');
  ensureNum(req.pain_score, 'pain');
  ensureEnum(req.consciousness, 'cons', ['alert_oriented','confused','obtunded','stuporous','comatose']);
  return { hr: req.heart_rate, spo2: req.oxygen_sat };
}
function neuro_assess(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.gcs, 'gcs');
  ensureStr(req.pupils, 'pup');
  ensureStr(req.motor, 'mot');
  ensureStr(req.verbal, 'verb');
  ensureStr(req.glasgow_components, 'gc');
  return { gcs: req.gcs };
}
function pain_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.pain_score, 'pain');
  ensureStr(req.location, 'loc');
  ensureStr(req.character, 'chr');
  ensureStr(req.duration, 'dur');
  ensureStr(req.aggravating, 'agg');
  ensureStr(req.relieving, 'rel');
  return { pain_score: req.pain_score, location: req.location };
}
function fall_risk(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.morse_fall_score, 'mfs');
  ensureBool(req.history_of_falling, 'hxf');
  ensureEnum(req.mental_status, 'ms', ['oriented_to_own_ability','forgot_limitations','overestimates_ability']);
  ensureEnum(req.gait, 'gait', ['normal','weak','impaired','bedrest']);
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high']);
  return { morse: req.morse_fall_score, risk: req.risk_level };
}
function pressure_injury_risk(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.braden_score, 'bs');
  ensureEnum(req.sensory_perception, 'sp', ['no_impairment','slightly_limited','very_limited','completely_limited']);
  ensureEnum(req.moisture, 'm', ['rarely_moist','occasionally_moist','very_moist','constantly_moist']);
  ensureEnum(req.activity, 'a', ['walking_frequent','walking_occasional','chair_fast','bedfast']);
  ensureEnum(req.mobility, 'mob', ['no_limitation','slightly_limited','very_limited','completely_immobile']);
  ensureEnum(req.nutrition, 'n', ['excellent','adequate','probably_inadequate','very_poor']);
  return { braden: req.braden_score };
}

function funcs() { return { vital_signs_full, neuro_assess, pain_assessment, fall_risk, pressure_injury_risk }; }
module.exports = { funcs, ValidationError };