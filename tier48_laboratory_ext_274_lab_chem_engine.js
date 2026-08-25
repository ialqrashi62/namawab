// filepath: tier48_laboratory_ext_274_lab_chem_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function basic_metabolic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.sodium, 'na');
  ensureNum(req.potassium, 'k');
  ensureNum(req.chloride, 'cl');
  ensureNum(req.bicarbonate, 'hco3');
  ensureNum(req.bun, 'bun');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.glucose, 'glu');
  ensureStr(req.interpretation, 'intp');
  return { sodium: req.sodium, potassium: req.potassium };
}
function comprehensive_metabolic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.sodium, 'na');
  ensureNum(req.potassium, 'k');
  ensureNum(req.chloride, 'cl');
  ensureNum(req.bicarbonate, 'hco3');
  ensureNum(req.bun, 'bun');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.glucose, 'glu');
  ensureNum(req.albumin, 'alb');
  ensureNum(req.total_protein, 'tp');
  ensureStr(req.interpretation, 'intp');
  return { creatinine: req.creatinine };
}
function liver_function(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ast, 'ast');
  ensureNum(req.alt, 'alt');
  ensureNum(req.alp, 'alp');
  ensureNum(req.ggt, 'ggt');
  ensureNum(req.bilirubin_total, 'tbil');
  ensureNum(req.bilirubin_direct, 'dbil');
  ensureNum(req.albumin, 'alb');
  ensureStr(req.interpretation, 'intp');
  return { ast: req.ast, alt: req.alt };
}
function lipid_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.total_chol, 'tc');
  ensureNum(req.ldl, 'ldl');
  ensureNum(req.hdl, 'hdl');
  ensureNum(req.triglycerides, 'tg');
  ensureNum(req.non_hdl, 'nh');
  ensureStr(req.interpretation, 'intp');
  return { ldl: req.ldl, hdl: req.hdl };
}
function thyroid_function(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.tsh, 'tsh');
  ensureNum(req.t4_free, 't4');
  ensureNum(req.t3_free, 't3');
  ensureNum(req.anti_tpo, 'tpo');
  ensureStr(req.interpretation, 'intp');
  return { tsh: req.tsh };
}

function funcs() { return { basic_metabolic, comprehensive_metabolic, liver_function, lipid_panel, thyroid_function }; }
module.exports = { funcs, ValidationError };