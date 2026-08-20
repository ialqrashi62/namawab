// filepath: tier174_pal_815_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function palliative_visit(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.karnofsky, 'ka');
  ensureNum(req.pain_score, 'ps'); ensureNum(req.opioid_mme, 'om');
  ensureBool(req.hospice_appropriate, 'ha'); ensureNum(req.family_meeting_count, 'fm');
  ensureStr(req.goals_of_care, 'gc'); ensureStr(req.provider, 'pr');
  return { pv_id: `pv_${Date.now()}`, patient_id: req.patient_id, ka: req.karnofsky, gc: req.goals_of_care };
}

function pain_pump(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.opioid, 'op', ['morphine','hydromorphone','fentanyl','bupivacaine','combination','NA']);
  ensureNum(req.dose_mg_day, 'dd'); ensureEnum(req.route, 'ro', ['intrathecal','epidural','subcutaneous','NA']);
  ensureNum(req.bolus_per_day, 'bd'); ensureNum(req.refill_days, 'rd');
  ensureEnum(req.complication, 'co', ['none','infection','catheter_dislodged','overdose','underdose','NA']);
  ensureStr(req.provider, 'pr');
  return { pp_id: `pp_${Date.now()}`, patient_id: req.patient_id, op: req.opioid, dd: req.dose_mg_day };
}

function spiritual_care(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.religion, 'rl', ['Muslim','Christian','Jewish','Hindu','Buddhist','None','Other','NA']);
  ensureBool(req.requests_spiritual, 'rs'); ensureBool(req.chaplain_visit, 'cv');
  ensureBool(req.family_present, 'fp'); ensureNum(req.distress_score, 'ds');
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { sc_id: `sc_${Date.now()}`, patient_id: req.patient_id, rl: req.religion, ds: req.distress_score };
}

function family_meeting(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.attendees_count, 'ac');
  ensureNum(req.duration_min, 'du'); ensureEnum(req.decision_made, 'dm', ['aggressive','comfort_focus','trial','withdraw','NA']);
  ensureBool(req.conflict_resolved, 'cr'); ensureBool(req.goals_documented, 'gd');
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { fm_id: `fm_${Date.now()}`, patient_id: req.patient_id, dm: req.decision_made, ac: req.attendees_count };
}

function death_review(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.setting, 'se', ['home','hospital','hospice','LTC','NA']);
  ensureBool(req.family_present, 'fp'); ensureBool(req.symptoms_controlled, 'sc');
  ensureNum(req.family_satisfaction, 'fs'); ensureNum(req.morphine_in_last_24h, 'ml');
  ensureBool(req.bereavement_followup, 'bf'); ensureStr(req.provider, 'pr');
  return { dr_id: `dr_${Date.now()}`, patient_id: req.patient_id, setting: req.setting, fs: req.family_satisfaction };
}

function funcs() { return { palliative_visit, pain_pump, spiritual_care, family_meeting, death_review }; }
module.exports = { funcs, ValidationError };