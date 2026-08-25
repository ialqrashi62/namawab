// filepath: tier44_pediatrics_ext_257_ped_immuno_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function primary_immunodeficiency(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureStr(req.type, 'typ');
  ensureNum(req.igg, 'igg');
  ensureBool(req.recurrent_infections, 'recur');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['improving','stable','deteriorating']);
  return { type: req.type, treatment: req.treatment };
}
function kawasaki_disease(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureNum(req.fever_days, 'fd');
  ensureNum(req.criteria_met, 'crit');
  ensureBool(req.coronary_aneurysm, 'caa');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['good','partial','poor']);
  return { criteria_met: req.criteria_met, aneurysm: req.coronary_aneurysm };
}
function juvenile_arthritis_ped(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureEnum(req.subtype, 'sub', ['polyarticular','oligoarticular','systemic','psoriatic','enthesitis_related']);
  ensureNum(req.joints_involved, 'joints');
  ensureNum(req.jadas_score, 'jadas');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['remission','improving','stable','flare']);
  return { subtype: req.subtype, jadas: req.jadas_score };
}
function vaccination_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureBool(req.schedule_up_to_date, 'utd');
  ensureNum(req.missed_vaccines.length, 'missed_len');
  ensureStr(req.plan, 'plan');
  return { up_to_date: req.schedule_up_to_date, missed_count: req.missed_vaccines.length };
}
function allergy_ped(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureStr(req.type, 'typ');
  ensureNum(req.allergens.length, 'alg_len');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','anaphylaxis']);
  ensureStr(req.treatment, 'tx');
  return { severity: req.severity, treatment: req.treatment };
}

function funcs() { return { primary_immunodeficiency, kawasaki_disease, juvenile_arthritis_ped, vaccination_review, allergy_ped }; }
module.exports = { funcs, ValidationError };