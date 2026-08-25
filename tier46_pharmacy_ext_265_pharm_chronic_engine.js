// filepath: tier46_pharmacy_ext_265_pharm_chronic_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function antihypertensive(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.bp, 'bp');
  ensureStr(req.comorbidities, 'comp');
  ensureStr(req.first_line, 'fl');
  ensureBool(req.combination_needed, 'combo');
  ensureEnum(req.adherence, 'adh', ['good','partial','poor']);
  return { bp: req.bp, first_line: req.first_line };
}
function antidiabetic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.hba1c, 'a1c');
  ensureNum(req.egfr, 'egfr');
  ensureStr(req.first_line, 'fl');
  ensureStr(req.second_line, 'sl');
  ensureStr(req.comorbidities, 'comp');
  ensureEnum(req.glycemic_target, 'gt', ['individualized','strict','lenient','very_lenient']);
  return { a1c: req.hba1c, egfr: req.egfr };
}
function statin_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ldl, 'ldl');
  ensureEnum(req.risk, 'rk', ['low','moderate','high','very_high']);
  ensureStr(req.statin, 'statin');
  ensureBool(req.intolerance, 'intol');
  ensureStr(req.monitoring, 'mon');
  return { ldl: req.ldl, statin: req.statin };
}
function anticoagulation_oral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.cha2ds2_vasc, 'chads');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.bleeding_risk, 'br', ['low','moderate','high','very_high']);
  ensureStr(req.monitoring, 'mon');
  return { drug: req.drug, chads_vasc: req.cha2ds2_vasc };
}
function asthma_controller(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.severity, 'sev', ['mild_intermittent','mild_persistent','moderate_persistent','severe_persistent']);
  ensureStr(req.controller, 'ctrl');
  ensureEnum(req.ics_dose, 'd', ['low','medium','high','none']);
  ensureEnum(req.adherence, 'adh', ['good','partial','poor']);
  ensureNum(req.follow_up, 'fu');
  return { controller: req.controller, severity: req.severity };
}

function funcs() { return { antihypertensive, antidiabetic, statin_therapy, anticoagulation_oral, asthma_controller }; }
module.exports = { funcs, ValidationError };