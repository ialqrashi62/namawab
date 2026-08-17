// filepath: tier48_laboratory_ext_273_lab_heme_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function complete_blood_count(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.wbc, 'wbc');
  ensureNum(req.hgb, 'hgb');
  ensureNum(req.hct, 'hct');
  ensureNum(req.plt, 'plt');
  ensureNum(req.mcv, 'mcv');
  ensureNum(req.rdw, 'rdw');
  ensureStr(req.interpretation, 'intp');
  return { wbc: req.wbc, hgb: req.hgb, plt: req.plt };
}
function coagulation_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.pt, 'pt');
  ensureNum(req.ptt, 'ptt');
  ensureNum(req.innr, 'innr');
  ensureNum(req.fibrinogen, 'fib');
  ensureNum(req.bleeding_time, 'bt');
  ensureStr(req.interpretation, 'intp');
  return { pt: req.pt, ptt: req.ptt, innr: req.innr };
}
function d_dimer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.d_dimer, 'dd');
  ensureStr(req.unit, 'u');
  ensureStr(req.clinical_context, 'cc');
  ensureBool(req.age_adjusted, 'aa');
  ensureStr(req.result, 'res');
  return { d_dimer: req.d_dimer, result: req.result };
}
function fibrinogen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.fibrinogen, 'fib');
  ensureStr(req.clinical_context, 'cc');
  ensureStr(req.trend, 'trend');
  ensureStr(req.interpretation, 'intp');
  return { fibrinogen: req.fibrinogen };
}
function blood_smear(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.findings, 'find');
  ensureBool(req.schistocytes, 'sch');
  ensureBool(req.target_cells, 'tc');
  ensureStr(req.interpretation, 'intp');
  return { findings: req.findings };
}

function funcs() { return { complete_blood_count, coagulation_panel, d_dimer, fibrinogen, blood_smear }; }
module.exports = { funcs, ValidationError };