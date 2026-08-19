// filepath: tier113_fertility_598_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function fertility_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workup_id, 'wid');
  ensureNum(req.age, 'age');
  ensureNum(req.cycle_length_days, 'cld');
  ensureEnum(req.semen_analysis, 'sa', ['normal','abnormal','pending','not_done','other','unknown']);
  ensureEnum(req.tubal_patency, 'tp', ['patent','blocked','partial','pending','not_tested','other','unknown']);
  ensureEnum(req.ovulation, 'ov', ['confirmed','absent','irregular','pending','other','unknown']);
  ensureEnum(req.diagnosis, 'dx', ['unexplained','male_factor','tubal','ovulatory','endometriosis','combined','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { wid: req.workup_id };
}
function ovulation_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.tracking_id, 'tid');
  ensureEnum(req.cycle, 'cy', ['natural','medicated','triggered','other','unknown']);
  ensureNum(req.ovulation_day, 'od');
  ensureBool(req.lh_surge, 'lhs');
  ensureEnum(req.timing, 'tim', ['optimal','acceptable','missed','other','unknown']);
  ensureBool(req.intercourse_recommended, 'ir');
  ensureStr(req.provider, 'pr');
  return { tid: req.tracking_id };
}
function iui_cycle(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureEnum(req.cycle, 'cy', ['iui','natural','medicated','other','unknown']);
  ensureNum(req.sperm_count_million, 'scm');
  ensureNum(req.motility_pct, 'mp');
  ensureEnum(req.wash_method, 'wm', ['density_gradient','swim_up','simple','other','unknown','none']);
  ensureEnum(req.outcome, 'out', ['completed','cancelled','scheduled','failed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.cycle_id };
}
function embryo_transfer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.transfer_id, 'tid');
  ensureEnum(req.cycle, 'cy', ['fresh','fet','other','unknown']);
  ensureNum(req.embryos_transferred, 'et');
  ensureEnum(req.stage, 'st', ['cleavage','morula','blastocyst','other','unknown']);
  ensureEnum(req.quality, 'ql', ['poor','fair','good','excellent','other','unknown']);
  ensureEnum(req.outcome, 'out', ['completed','cancelled','scheduled','failed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.transfer_id };
}
function fertility_outcome(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.outcome_id, 'oid');
  ensureEnum(req.cycle, 'cy', ['iui','ivf','natural','other','unknown']);
  ensureEnum(req.outcome, 'out', ['pregnant','not_pregnant','biochemical','ectopic','miscarriage','other','unknown']);
  ensureNum(req.beta_hcg, 'bh');
  ensureEnum(req.ultrasound, 'us', ['scheduled','completed','not_done','other','unknown','none']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  return { oid: req.outcome_id };
}

function funcs() { return { fertility_workup, ovulation_tracking, iui_cycle, embryo_transfer, fertility_outcome }; }
module.exports = { funcs, ValidationError };