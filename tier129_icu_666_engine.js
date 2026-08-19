// filepath: tier129_icu_666_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function vent_settings(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.vent_id, 'vid');
  ensureNum(req.mode, 'mode');
  ensureNum(req.peep, 'peep');
  ensureNum(req.fio2, 'fio2');
  ensureNum(req.tidal_volume, 'tv');
  ensureStr(req.provider, 'pr');
  return { vid: req.vent_id };
}
function sedation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.sed_id, 'sid');
  ensureNum(req.rass_score, 'rs');
  ensureNum(req.bis, 'bis');
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mg_kg_hr, 'dm');
  ensureStr(req.provider, 'pr');
  return { sid: req.sed_id };
}
function vasopressor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.vp_id, 'vid');
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mcg_kg_min, 'dm');
  ensureNum(req.map_target, 'mt');
  ensureStr(req.provider, 'pr');
  return { vid: req.vp_id };
}
function fluid_balance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.fb_id, 'fid');
  ensureNum(req.intake_24h_ml, 'i24');
  ensureNum(req.output_24h_ml, 'o24');
  ensureNum(req.balance_24h_ml, 'b24');
  ensureNum(req.weight_kg, 'wt');
  ensureStr(req.provider, 'pr');
  return { fid: req.fb_id };
}
function icu_consult(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.consult_id, 'cid');
  ensureStr(req.intensivist_id, 'iid');
  ensureNum(req.aps2_score, 'aps');
  ensureNum(req.sofa_score, 'sofa');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  return { cid: req.consult_id };
}

function funcs() { return { vent_settings, sedation, vasopressor, fluid_balance, icu_consult }; }
module.exports = { funcs, ValidationError };