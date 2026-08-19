// filepath: tier106_trauma_center_556_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function trauma_team_activation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.activation_id, 'aid');
  ensureNum(req.level, 'lvl');
  ensureEnum(req.trauma_type, 'tt', ['blunt','penetrating','burn','mixed','other','unknown']);
  ensureNum(req.team_size, 'ts');
  ensureNum(req.response_min, 'rm');
  ensureStr(req.activation_time, 'at');
  ensureStr(req.provider, 'pr');
  return { aid: req.activation_id };
}
function massive_transfusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.protocol_id, 'pid');
  ensureEnum(req.activation, 'act', ['massive','standard','none','other','unknown']);
  ensureNum(req.units_packed_rbc, 'upr');
  ensureNum(req.plasma_units, 'pu');
  ensureNum(req.platelet_units, 'plu');
  ensureEnum(req.ratio, 'rt', ['1:1:1','2:1:1','1:1','1:2','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.protocol_id };
}
function damage_control_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.procedure, 'proc', ['laparotomy','thoracotomy','craniotomy','orthopedic','vascular','other','unknown']);
  ensureNum(req.time_minutes, 'tm');
  ensureNum(req.blood_loss_ml, 'blm');
  ensureBool(req.icu_admission, 'ia');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function icu_admission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.admission_id, 'aid');
  ensureStr(req.mechanism, 'mech');
  ensureNum(req.injury_severity_score, 'iss');
  ensureNum(req.ventilator_days, 'vd');
  ensureNum(req.complications, 'comp');
  ensureEnum(req.outcome, 'out', ['survived','died','transferred','ltach','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.admission_id };
}
function rehab_referral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureEnum(req.referral_type, 'rt', ['physical_therapy','occupational','speech','rehab','other','unknown']);
  ensureNum(req.days_to_rehab, 'dtr');
  ensureNum(req.functional_independence_measure, 'fim');
  ensureEnum(req.discharge_destination, 'dd', ['home','home_health','snf','rehab','ltach','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.referral_id };
}

function funcs() { return { trauma_team_activation, massive_transfusion, damage_control_surgery, icu_admission, rehab_referral }; }
module.exports = { funcs, ValidationError };