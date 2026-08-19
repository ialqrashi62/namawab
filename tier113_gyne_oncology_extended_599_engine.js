// filepath: tier113_gyne_oncology_extended_599_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tumor_marker(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.marker_id, 'mid');
  ensureEnum(req.cancer_type, 'ct', ['ovarian','endometrial','cervical','vulvar','vaginal','gtn','other','unknown']);
  ensureNum(req.ca_125, 'ca');
  ensureEnum(req.he4, 'he4', ['normal','elevated','high','unknown','other','none']);
  ensureEnum(req.risk_index, 'ri', ['low','moderate','high','unknown','other']);
  ensureEnum(req.follow_up, 'fu', ['monthly','3_months','6_months','annually','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { mid: req.marker_id };
}
function genetic_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.counseling_id, 'cid');
  ensureStr(req.indication, 'ind');
  ensureStr(req.genes_tested, 'gt');
  ensureEnum(req.result, 'res', ['positive','negative','vus','pending','inconclusive','other','unknown']);
  ensureNum(req.risk_modification_pct, 'rmp');
  ensureStr(req.provider, 'pr');
  return { cid: req.counseling_id };
}
function chemotherapy_cyc(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureNum(req.cycle, 'cy');
  ensureStr(req.regimen, 'reg');
  ensureNum(req.dose_mg, 'dm');
  ensureEnum(req.premedication, 'pm', ['given','not_given','declined','other','unknown','none']);
  ensureEnum(req.toxicity, 'tx', ['none','grade_1','grade_2','grade_3','grade_4','other','unknown']);
  ensureEnum(req.next_cycle, 'nc', ['scheduled','delayed','cancelled','on_hold','completed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.cycle_id };
}
function radiation_planning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.planning_id, 'pid');
  ensureEnum(req.modality, 'mod', ['imrt','vmat','3d_crt','brachy','proton','other','unknown']);
  ensureStr(req.site, 'st');
  ensureNum(req.dose_cgy, 'dc');
  ensureNum(req.fractions, 'fr');
  ensureEnum(req.tolerance, 'tol', ['poor','fair','good','excellent','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.planning_id };
}
function palliative_care_onc(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.palliative_id, 'pid');
  ensureEnum(req.cancer_type, 'ct', ['ovarian','endometrial','cervical','vulvar','vaginal','gtn','other','unknown']);
  ensureEnum(req.stage, 'st', ['I','II','III','IV','recurrent','unknown','other']);
  ensureNum(req.karnofsky, 'kf');
  ensureStr(req.symptoms, 'sym');
  ensureEnum(req.goals, 'gl', ['curative','maintenance','palliative','comfort','other','unknown']);
  ensureBool(req.hospice_referred, 'hr');
  ensureStr(req.provider, 'pr');
  return { pid: req.palliative_id };
}

function funcs() { return { tumor_marker, genetic_counseling, chemotherapy_cyc, radiation_planning, palliative_care_onc }; }
module.exports = { funcs, ValidationError };