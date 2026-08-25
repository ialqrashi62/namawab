// filepath: tier127_cardio_656_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ecg_full(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ecg_id, 'eid');
  ensureNum(req.heart_rate, 'hr');
  ensureEnum(req.rhythm, 'rh', ['sinus','afib','aflutter','svt','vt','vf','asystole','other','unknown']);
  ensureNum(req.pr_interval, 'pri');
  ensureStr(req.provider, 'pr');
  return { eid: req.ecg_id };
}
function pacemaker(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pm_id, 'pid');
  ensureEnum(req.mode, 'md', ['aai','vvi','dddr','vddr','other','unknown']);
  ensureNum(req.battery_voltage, 'bv');
  ensureNum(req.lead_impedance, 'li');
  ensureStr(req.provider, 'pr');
  return { pid: req.pm_id };
}
function icd_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.icd_id, 'iid');
  ensureNum(req.battery_voltage, 'bv');
  ensureNum(req.shocks_delivered, 'sd');
  ensureEnum(req.therapies, 'th', ['on','off','monitor_only','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { iid: req.icd_id };
}
function cardiac_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rehab_id, 'rid');
  ensureNum(req.sessions_completed, 'sc');
  ensureNum(req.mets, 'mets');
  ensureEnum(req.progress, 'prg', ['improving','stable','declining','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.rehab_id };
}
function chf_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.chf_id, 'cid');
  ensureNum(req.ef_pct, 'ef');
  ensureNum(req.ntprobnp, 'ntp');
  ensureEnum(req.nyha_class, 'nc', ['1','2','3','4','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.chf_id };
}

function funcs() { return { ecg_full, pacemaker, icd_check, cardiac_rehab, chf_followup }; }
module.exports = { funcs, ValidationError };