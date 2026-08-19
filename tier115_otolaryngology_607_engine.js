// filepath: tier115_otolaryngology_607_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sinus_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['chronic_sinusitis','polyps','tumor','trauma','other','unknown']);
  ensureEnum(req.approach, 'app', ['endoscopic','open','combined','other','unknown']);
  ensureStr(req.extent, 'ext');
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.outcome, 'out', ['successful','partial','failed','complications','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function hearing_aid(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.fitting_id, 'fid');
  ensureEnum(req.hearing_aid_type, 'hat', ['bte','ite','cic','ric','other','unknown']);
  ensureEnum(req.ear, 'er', ['left','right','bilateral','other','unknown']);
  ensureStr(req.fitting_date, 'fd');
  ensureNum(req.aided_threshold, 'at');
  ensureNum(req.satisfaction, 'sat');
  ensureStr(req.provider, 'pr');
  return { fid: req.fitting_id };
}
function cochlear_implant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.ear, 'er', ['left','right','bilateral','other','unknown']);
  ensureStr(req.implant_type, 'it');
  ensureNum(req.activation_weeks, 'aw');
  ensureEnum(req.outcomes, 'out', ['improved','stable','declined','other','unknown']);
  ensureEnum(req.rehabilitation, 'reh', ['active','declined','planned','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function tonsillectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['recurrent_tonsillitis','obstruction','abscess','sleep_apnea','malignancy','other','unknown']);
  ensureEnum(req.technique, 'tech', ['cold','coblation','laser','bipolar','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.blood_loss_ml, 'blm');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function thyroidectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.type, 'tp', ['total','near_total','partial','completion','other','unknown']);
  ensureStr(req.extent, 'ext');
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.blood_loss_ml, 'blm');
  ensureEnum(req.outcome, 'out', ['successful','complications','failed','other','unknown']);
  ensureBool(req.calcium_normal, 'cn');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { sinus_surgery, hearing_aid, cochlear_implant, tonsillectomy, thyroidectomy }; }
module.exports = { funcs, ValidationError };