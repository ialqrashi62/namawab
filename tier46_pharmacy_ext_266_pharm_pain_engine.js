// filepath: tier46_pharmacy_ext_266_pharm_pain_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function opioid_chronic_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.morphine_equivalent_dose, 'med');
  ensureNum(req.duration_months, 'dur');
  ensureStr(req.urine_drug_screen, 'uds');
  ensureBool(req.naloxone, 'nal');
  ensureStr(req.referral, 'ref');
  return { med: req.morphine_equivalent_dose, naloxone: req.naloxone };
}
function nsaid(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.duration_weeks, 'dur');
  ensureEnum(req.gi_risk, 'gi', ['low','moderate','high']);
  ensureEnum(req.cv_risk, 'cv', ['low','moderate','high']);
  ensureStr(req.choice, 'choice');
  ensureStr(req.monitoring, 'mon');
  return { choice: req.choice, gi_risk: req.gi_risk };
}
function neuropathic_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.condition, 'cond');
  ensureStr(req.first_line, 'fl');
  ensureStr(req.second_line, 'sl');
  ensureEnum(req.response, 'resp', ['none','partial','full','intolerable']);
  ensureStr(req.adjuvant, 'adj');
  return { condition: req.condition, response: req.response };
}
function palliative_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.route, 'rt', ['oral','subcutaneous','intravenous','transdermal','rectal']);
  ensureStr(req.opioid, 'op');
  ensureBool(req.bowel_regimen, 'bowel');
  ensureStr(req.adjuvants, 'adj');
  return { pain_score: req.pain_score, route: req.route };
}
function multimodal_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery, 'surg');
  ensureStr(req.protocol, 'prot');
  ensureStr(req.components, 'comp');
  ensureStr(req.discharge_plan, 'dc');
  return { surgery: req.surgery, protocol: req.protocol };
}

function funcs() { return { opioid_chronic_pain, nsaid, neuropathic_pain, palliative_pain, multimodal_pain }; }
module.exports = { funcs, ValidationError };