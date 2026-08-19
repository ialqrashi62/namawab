// filepath: tier111_electrophysiology_587_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ablation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.type, 'tp', ['rf','cryo','pulsed_field','microwave','other','unknown']);
  ensureStr(req.target_arrhythmia, 'ta');
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.fluoro_time_min, 'ftm');
  ensureNum(req.complications, 'comp');
  ensureEnum(req.outcome, 'out', ['success','partial_success','failure','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function device_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.device_id, 'did');
  ensureEnum(req.device_type, 'dt', ['pacemaker','icd','crt_d','crt_p','loop_recorder','other','unknown']);
  ensureNum(req.battery_voltage, 'bv');
  ensureNum(req.atrial_threshold, 'at');
  ensureNum(req.ventricular_threshold, 'vt');
  ensureEnum(req.lead_impedance, 'li', ['normal','high','low','fracture','other','unknown']);
  ensureNum(req.events_detected, 'ed');
  ensureStr(req.provider, 'pr');
  return { did: req.device_id };
}
function afib_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureEnum(req.type, 'tp', ['paroxysmal','persistent','permanent','lone','valvular','other','unknown']);
  ensureNum(req.duration_hours, 'dur');
  ensureNum(req.heart_rate, 'hr');
  ensureEnum(req.treatment, 'tx', ['cardioversion','rate_control','rhythm_control','ablation','anticoagulation','other','unknown']);
  ensureNum(req.cha2ds2_vasc, 'cv');
  ensureBool(req.anticoagulation_initiated, 'ai');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function syncope_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workup_id, 'wid');
  ensureStr(req.event_date, 'ed');
  ensureBool(req.prodrome, 'pro');
  ensureNum(req.tilt_table_positive, 'ttp');
  ensureEnum(req.diagnosis, 'dx', ['vasovagal','orthostatic','cardiac','neurologic','unknown','other','none']);
  ensureEnum(req.recommendation, 'rec', ['lifestyle','medication','pacer','monitoring','other','unknown','none']);
  ensureNum(req.recurrence, 'rec');
  ensureStr(req.provider, 'pr');
  return { wid: req.workup_id };
}
function icd_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.followup_id, 'fid');
  ensureNum(req.weeks_post_implant, 'wpi');
  ensureNum(req.shocks_delivered, 'shd');
  ensureNum(req.appropriate_shocks, 'aps');
  ensureNum(req.inappropriate_shocks, 'ias');
  ensureNum(req.battery_remaining_pct, 'brp');
  ensureEnum(req.status, 'st', ['stable','monitor','replace','recall','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { fid: req.followup_id };
}

function funcs() { return { ablation, device_check, afib_management, syncope_workup, icd_followup }; }
module.exports = { funcs, ValidationError };