// filepath: tier112_immunization_592_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function vaccination_schedule(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.schedule_id, 'sid');
  ensureNum(req.age_months, 'am');
  ensureNum(req.vaccines_due, 'vd');
  ensureNum(req.vaccines_given, 'vg');
  ensureEnum(req.schedule_status, 'ss', ['on_track','behind','up_to_date','overdue','complete','other','unknown']);
  ensureStr(req.next_visit, 'nv');
  ensureStr(req.provider, 'pr');
  return { sid: req.schedule_id };
}
function vaccine_administration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.administration_id, 'aid');
  ensureStr(req.vaccine, 'vac');
  ensureStr(req.lot_number, 'ln');
  ensureEnum(req.site, 'st', ['deltoid','anterolateral_thigh','gluteal','oral','nasal','other','unknown']);
  ensureNum(req.dose_number, 'dn');
  ensureNum(req.reactions, 'rxn');
  ensureStr(req.provider, 'pr');
  return { aid: req.administration_id };
}
function contraindication_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.screening_id, 'sid');
  ensureStr(req.vaccine, 'vac');
  ensureBool(req.contraindication, 'ci');
  ensureStr(req.reason, 'rsn');
  ensureBool(req.alternatives_offered, 'ao');
  ensureStr(req.deferred_to, 'dt');
  ensureStr(req.provider, 'pr');
  return { sid: req.screening_id };
}
function titer_checking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.titer_id, 'tid');
  ensureStr(req.vaccine, 'vac');
  ensureNum(req.titer_level, 'tl');
  ensureBool(req.protective, 'prt');
  ensureBool(req.booster_recommended, 'br');
  ensureNum(req.next_check_years, 'ncy');
  ensureStr(req.provider, 'pr');
  return { tid: req.titer_id };
}
function travel_vaccination(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.travel_id, 'tid');
  ensureStr(req.destination, 'dest');
  ensureNum(req.vaccines_recommended, 'vr');
  ensureNum(req.vaccines_given, 'vg');
  ensureBool(req.booster_required, 'br');
  ensureBool(req.malaria_prophylaxis, 'mp');
  ensureStr(req.provider, 'pr');
  return { tid: req.travel_id };
}

function funcs() { return { vaccination_schedule, vaccine_administration, contraindication_screening, titer_checking, travel_vaccination }; }
module.exports = { funcs, ValidationError };