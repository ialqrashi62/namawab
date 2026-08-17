// filepath: tier43_surgery_ext_248_gi_surg_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cholecystectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.approach, 'ap', ['open','laparoscopic','robotic','single_incision']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.op_time_min, 'op');
  ensureNum(req.ebl, 'ebl');
  ensureNum(req.length_of_stay_days, 'los');
  ensureStr(req.complications, 'comp');
  return { approach: req.approach, indication: req.indication, status: req.complications === 'none' ? 'uncomplicated' : 'monitor' };
}
function appendectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.approach, 'ap', ['open','laparoscopic']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.op_time_min, 'op');
  ensureNum(req.length_of_stay_days, 'los');
  ensureStr(req.complications, 'comp');
  return { approach: req.approach, status: req.complications === 'none' ? 'uncomplicated' : 'monitor' };
}
function hernia_repair(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['inguinal','umbilical','incisional','femoral','hiatal','ventral']);
  ensureEnum(req.approach, 'ap', ['open','laparoscopic_tep','laparoscopic_tapp','robotic']);
  ensureBool(req.mesh_used, 'mesh');
  ensureNum(req.op_time_min, 'op');
  ensureNum(req.length_of_stay_days, 'los');
  return { type: req.type, approach: req.approach, mesh: req.mesh_used };
}
function colectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['right_hemicolectomy','left_hemicolectomy','sigmoid','low_anterior','total','segmental']);
  ensureStr(req.indication, 'ind');
  ensureEnum(req.approach, 'ap', ['open','laparoscopic','robotic','converted']);
  ensureNum(req.op_time_min, 'op');
  ensureNum(req.ebl, 'ebl');
  ensureNum(req.length_of_stay_days, 'los');
  return { type: req.type, approach: req.approach, ebl: req.ebl };
}
function gastric_bypass(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['roux_en_y','sleeve','duodenal_switch','band_revision']);
  ensureNum(req.bmi, 'bmi');
  ensureStr(req.comorbidities, 'comp');
  ensureNum(req.op_time_min, 'op');
  ensureNum(req.length_of_stay_days, 'los');
  return { type: req.type, bmi: req.bmi };
}

function funcs() { return { cholecystectomy, appendectomy, hernia_repair, colectomy, gastric_bypass }; }
module.exports = { funcs, ValidationError };