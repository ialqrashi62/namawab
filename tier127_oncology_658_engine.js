// filepath: tier127_oncology_658_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chemo_cycle(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureStr(req.regimen, 'rgn');
  ensureNum(req.cycle_number, 'cn');
  ensureNum(req.dose_mg, 'dm');
  ensureStr(req.provider, 'pr');
  return { cid: req.cycle_id };
}
function tumor_response(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.resp_id, 'rid');
  ensureEnum(req.recist, 'rc', ['complete_response','partial_response','stable','progression','other','unknown']);
  ensureNum(req.diameter_change_pct, 'dcp');
  ensureStr(req.provider, 'pr');
  return { rid: req.resp_id };
}
function survivorship(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surv_id, 'sid');
  ensureNum(req.years_since_dx, 'ysd');
  ensureNum(req.qol_score, 'qol');
  ensureStr(req.followup_schedule, 'fs');
  ensureStr(req.provider, 'pr');
  return { sid: req.surv_id };
}
function palliative_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pc_id, 'pid');
  ensureNum(req.symptom_burden, 'sb');
  ensureNum(req.pain_score, 'ps');
  ensureStr(req.goals_of_care, 'goc');
  ensureStr(req.provider, 'pr');
  return { pid: req.pc_id };
}
function hospice_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.hospice_id, 'hid');
  ensureNum(req.prognosis_months, 'pm');
  ensureEnum(req.eligibility, 'el', ['eligible','pending','not_eligible','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { hid: req.hospice_id };
}

function funcs() { return { chemo_cycle, tumor_response, survivorship, palliative_care, hospice_eval }; }
module.exports = { funcs, ValidationError };