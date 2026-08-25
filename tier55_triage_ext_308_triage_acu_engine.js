// filepath: tier55_triage_ext_308_triage_acu_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function esi_level_1(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.presentation, 'pres');
  ensureStr(req.intervention, 'int');
  ensureStr(req.triage_decision, 'td');
  ensureNum(req.time_to_provider_min, 't');
  return { triage: req.triage_decision };
}
function esi_level_2(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.presentation, 'pres');
  ensureStr(req.intervention, 'int');
  ensureStr(req.triage_decision, 'td');
  ensureNum(req.time_to_provider_min, 't');
  return { triage: req.triage_decision };
}
function esi_level_3(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.presentation, 'pres');
  ensureStr(req.intervention, 'int');
  ensureStr(req.triage_decision, 'td');
  ensureNum(req.time_to_provider_min, 't');
  return { triage: req.triage_decision };
}
function esi_level_4(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.presentation, 'pres');
  ensureStr(req.intervention, 'int');
  ensureStr(req.triage_decision, 'td');
  ensureNum(req.time_to_provider_min, 't');
  return { triage: req.triage_decision };
}
function esi_level_5(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.presentation, 'pres');
  ensureStr(req.intervention, 'int');
  ensureStr(req.triage_decision, 'td');
  ensureNum(req.time_to_provider_min, 't');
  return { triage: req.triage_decision };
}

function funcs() { return { esi_level_1, esi_level_2, esi_level_3, esi_level_4, esi_level_5 }; }
module.exports = { funcs, ValidationError };