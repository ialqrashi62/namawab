// filepath: tier45_icu_ext_260_icu_hemodyn_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function shock_cardiogenic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ef, 'ef');
  ensureNum(req.ci, 'ci');
  ensureNum(req.pcwp, 'pcwp');
  ensureBool(req.norepinephrine, 'ne');
  ensureBool(req.vasopressin, 'vaso');
  ensureStr(req.mech_circulatory_support, 'mcs');
  ensureEnum(req.mortality, 'mort', ['low','moderate','high','very_high']);
  return { ef: req.ef, mortality: req.mortality, support: req.mech_circulatory_support };
}
function shock_distributive(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.etiology, 'eti');
  ensureNum(req.svr, 'svr');
  ensureNum(req.ci, 'ci');
  ensureBool(req.norepinephrine, 'ne');
  ensureBool(req.vasopressin, 'vaso');
  ensureStr(req.fluid_balance, 'fb');
  return { etiology: req.etiology, ci: req.ci };
}
function shock_obstructive(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.etiology, 'eti');
  ensureNum(req.cvp, 'cvp');
  ensureStr(req.intervention, 'int');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening']);
  ensureEnum(req.anticoagulation, 'ac', ['heparin_gtt','enoxaparin','none','contraindicated']);
  return { etiology: req.etiology, response: req.response };
}
function vasopressor_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.agent, 'agent');
  ensureNum(req.dose_mcg_kg_min, 'dose');
  ensureNum(req.map_target, 'map_t');
  ensureStr(req.second_agent, 'sec');
  ensureStr(req.weaning_plan, 'wp');
  return { agent: req.agent, dose: req.dose_mcg_kg_min };
}
function inotrope_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.agent, 'agent');
  ensureNum(req.dose_mcg_kg_min, 'dose');
  ensureNum(req.ef, 'ef');
  ensureStr(req.rhythm, 'rhythm');
  ensureStr(req.monitoring, 'mon');
  return { agent: req.agent, dose: req.dose_mcg_kg_min };
}

function funcs() { return { shock_cardiogenic, shock_distributive, shock_obstructive, vasopressor_management, inotrope_management }; }
module.exports = { funcs, ValidationError };