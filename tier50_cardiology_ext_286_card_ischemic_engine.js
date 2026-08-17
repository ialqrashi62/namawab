// filepath: tier50_cardiology_ext_286_card_ischemic_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stemi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.pain_to_door_min, 'ptd');
  ensureEnum(req.culprit_artery, 'ca', ['lad','rca','lcx','left_main','ramus','graft']);
  ensureNum(req.door_to_balloon_min, 'dtb');
  ensureNum(req.ef_percent_post, 'ef');
  ensureStr(req.outcome, 'out');
  ensureStr(req.discharge_meds, 'med');
  return { culprit: req.culprit_artery, ef_post: req.ef_percent_post };
}
function nstemi_acs(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.troponin_peak, 'tro');
  ensureEnum(req.culprit_artery, 'ca', ['lad','rca','lcx','left_main','ramus','graft']);
  ensureStr(req.strategy, 'str');
  ensureStr(req.intervention, 'int');
  ensureNum(req.risk_score_grace, 'grace');
  return { troponin: req.troponin_peak, grace: req.risk_score_grace };
}
function unstable_angina(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.troponin, 'tro', ['negative','indeterminate','pending']);
  ensureStr(req.ecg_changes, 'ecg');
  ensureEnum(req.culprit_artery, 'ca', ['lad','rca','lcx','left_main','ramus','non_obstructive']);
  ensureStr(req.strategy, 'str');
  ensureStr(req.stress_test, 'st');
  return { ecg: req.ecg_changes };
}
function stable_angina(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.symptoms, 'sx');
  ensureNum(req.functional_class, 'fc');
  ensureStr(req.stress_test, 'st');
  ensureStr(req.intervention, 'int');
  ensureBool(req.ccta_planned, 'ccta');
  return { fc: req.functional_class };
}
function prinzmetal_angina(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trigger, 'trig');
  ensureStr(req.ecg_during_pain, 'ecg');
  ensureStr(req.coronary_angiography, 'cx');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['complete_resolution','partial','recurrent']);
  return { trigger: req.trigger, response: req.response };
}

function funcs() { return { stemi, nstemi_acs, unstable_angina, stable_angina, prinzmetal_angina }; }
module.exports = { funcs, ValidationError };