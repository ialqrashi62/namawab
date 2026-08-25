// filepath: tier173_ped_810_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function neonatal_screenal(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_days, 'ad'); ensureBool(req.screening_complete, 'sc');
  ensureBool(req.heel_stick_done, 'hs'); ensureEnum(req.hearing_test, 'ht', ['pass','refer','incomplete','NA']);
  ensureEnum(req.metabolic_results, 'mr', ['normal','abnormal','pending','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { ns_id: `ns_${Date.now()}`, patient_id: req.patient_id, age: req.age_days, mr: req.metabolic_results };
}

function feeding_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am'); ensureBool(req.breastfeeding, 'br');
  ensureBool(req.formula_topup, 'ft'); ensureNum(req.latch_score, 'ls');
  ensureNum(req.weight_gain_kg, 'wg'); ensureBool(req.mother_diet_ok, 'md');
  ensureBool(req.lactation_consult, 'lc'); ensureNum(req.followup_days, 'fd');
  ensureStr(req.provider, 'pr');
  return { fe_id: `fe_${Date.now()}`, patient_id: req.patient_id, ls: req.latch_score, wg: req.weight_gain_kg };
}

function growth_failure(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am'); ensureNum(req.weight_kg, 'wk');
  ensureNum(req.height_cm, 'hc'); ensureNum(req.weight_z, 'wz');
  ensureNum(req.height_z, 'hz'); ensureNum(req.caloric_intake_kcal, 'ci');
  ensureBool(req.organic_cause, 'oc'); ensureEnum(req.intervention, 'in', ['supplementation','feeding_tube','workup','refer','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { gf_id: `gf_${Date.now()}`, patient_id: req.patient_id, wz: req.weight_z, in: req.intervention };
}

function childhood_vaccine(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am'); ensureNum(req.vaccines_given, 'vg');
  ensureNum(req.vaccines_due, 'vd'); ensureNum(req.missing, 'mi');
  ensureBool(req.contraindication, 'ci'); ensureBool(req.ae, 'ae');
  ensureBool(req.parent_consent, 'pc'); ensureNum(req.next_visit_days, 'nv');
  ensureStr(req.provider, 'pr');
  return { cv_id: `cv_${Date.now()}`, patient_id: req.patient_id, vg: req.vaccines_given, vd: req.vaccines_due };
}

function autism_screen(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am'); ensureNum(req.mchat_score, 'ms');
  ensureBool(req.social_concerns, 'sc'); ensureBool(req.language_concerns, 'lc');
  ensureBool(req.behavioral_concerns, 'bc'); ensureBool(req.referral_made, 'rm');
  ensureEnum(req.intervention, 'in', ['none','monitoring','early_start','ABA','speech','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { as_id: `as_${Date.now()}`, patient_id: req.patient_id, ms: req.mchat_score, in: req.intervention };
}

function funcs() { return { neonatal_screenal, feeding_eval, growth_failure, childhood_vaccine, autism_screen }; }
module.exports = { funcs, ValidationError };