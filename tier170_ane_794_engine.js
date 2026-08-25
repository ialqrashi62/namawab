// filepath: tier170_ane_794_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function preanesthesia(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.asa_class, 'ac', ['I','II','III','IV','V','E','NA']);
  ensureNum(req.mallampati, 'mp'); ensureEnum(req.airway, 'aw', ['easy','difficult','predictable_difficult','NA']);
  ensureNum(req.fasting_hours, 'fh'); ensureBool(req.consent, 'cn');
  ensureBool(req.premedication, 'pm'); ensureEnum(req.history, 'hi', ['none','mild','moderate','severe','NA']);
  ensureStr(req.provider, 'pr');
  return { pn_id: `pn_${Date.now()}`, patient_id: req.patient_id, asa: req.asa_class, airway: req.airway };
}

function intraop(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.duration_min, 'du'); ensureEnum(req.type, 'ty', ['general','spinal','epidural','regional','sedation','NA']);
  ensureNum(req.bp_avg, 'ba'); ensureNum(req.hr_avg, 'ha');
  ensureNum(req.spo2_min, 'sp'); ensureNum(req.ebl_ml, 'eb');
  ensureEnum(req.complication, 'co', ['none','hypotension','arrhythmia','desat','difficult_airway','other','NA']);
  ensureNum(req.surgical_time, 'st'); ensureEnum(req.disposition, 'di', ['PACU','ICU','floor','home','NA']);
  ensureStr(req.provider, 'pr');
  return { in_id: `in_${Date.now()}`, patient_id: req.patient_id, type: req.type, dur: req.duration_min };
}

function airway(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.technique, 'te', ['fiberoptic','video','awake','standard','NA']);
  ensureNum(req.attempt_count, 'ac'); ensureEnum(req.grade, 'gr', ['I','II','IIIA','IIIB','IV','NA']);
  ensureBool(req.success, 'su'); ensureNum(req.spo2_min, 'sp');
  ensureEnum(req.complication, 'co', ['none','trauma','bleeding','hypoxia','NA']);
  ensureNum(req.duration_sec, 'du'); ensureStr(req.provider, 'pr');
  return { aw_id: `aw_${Date.now()}`, patient_id: req.patient_id, grade: req.grade, success: req.success };
}

function regional(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'ty', ['spinal','epidural','combined','peripheral_nerve','NA']);
  ensureNum(req.needle_attempts, 'na'); ensureBool(req.success, 'su');
  ensureNum(req.local_anesthetic_mg, 'la'); ensureEnum(req.complication, 'co', ['none','failure','hematoma','nerve','hypotension','NA']);
  ensureNum(req.onset_min, 'om'); ensureNum(req.duration_hr, 'du');
  ensureStr(req.provider, 'pr');
  return { rg_id: `rg_${Date.now()}`, patient_id: req.patient_id, type: req.type, success: req.success };
}

function pacu(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.aldrete_score, 'as'); ensureNum(req.pain_score, 'ps');
  ensureNum(req.bp_systolic, 'bs'); ensureNum(req.spo2, 'sp');
  ensureEnum(req.pain_mgmt, 'pm', ['none','IV','PO','regional','NA']);
  ensureEnum(req.nausea, 'na', ['none','mild','moderate','severe','NA']);
  ensureNum(req.minutes_in_pacu, 'mp'); ensureEnum(req.disposition, 'di', ['home','floor','ICU','extended','NA']);
  ensureStr(req.provider, 'pr');
  return { pa_id: `pa_${Date.now()}`, patient_id: req.patient_id, aldrete: req.aldrete_score, disp: req.disposition };
}

function funcs() { return { preanesthesia, intraop, airway, regional, pacu }; }
module.exports = { funcs, ValidationError };