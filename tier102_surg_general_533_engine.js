// filepath: tier102_surg_general_533_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hernia_repair(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.hernia_type, 'ht', ['inguinal','umbilical','incisional','femoral','hiatal','other','unknown']);
  ensureEnum(req.approach, 'app', ['open','laparoscopic','robotic','other','unknown']);
  ensureBool(req.mesh_used, 'mu');
  ensureNum(req.complications, 'comp');
  ensureNum(req.hospital_days, 'hd');
  ensureNum(req.recurrence_risk, 'rr');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function cholecystectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.approach, 'app', ['open','laparoscopic','robotic','other','unknown']);
  ensureEnum(req.cholecystitis_severity, 'cs', ['none','mild','moderate','severe','gangrenous','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureNum(req.hospital_days, 'hd');
  ensureBool(req.conversion_to_open, 'cto');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function appendectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.approach, 'app', ['open','laparoscopic','other','unknown']);
  ensureBool(req.perforation, 'perf');
  ensureNum(req.complications, 'comp');
  ensureNum(req.hospital_days, 'hd');
  ensureNum(req.antibiotic_days, 'ad');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function bowel_resection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.resection_type, 'rt', ['right_hemicolectomy','left_hemicolectomy','sigmoidectomy','low_anterior','small_bowel_resection','other','unknown']);
  ensureEnum(req.anastomosis, 'an', ['side_to_side','end_to_end','end_to_side','ileostomy','colostomy','other','unknown','none']);
  ensureNum(req.complications, 'comp');
  ensureNum(req.hospital_days, 'hd');
  ensureNum(req.lymph_nodes_resected, 'lnr');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function soft_tissue(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.tumor_type, 'tt', ['lipoma','sebaceous_cyst','fibroma','sarcoma','other','unknown']);
  ensureNum(req.size_cm, 'sc');
  ensureEnum(req.approach, 'app', ['excisional','incisional','wide_resection','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureEnum(req.pathology, 'path', ['benign','malignant','atypical','pending','other','unknown']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { hernia_repair, cholecystectomy, appendectomy, bowel_resection, soft_tissue }; }
module.exports = { funcs, ValidationError };
