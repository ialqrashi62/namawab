// filepath: tier50_cardiology_ext_283_card_failure_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function heart_failure_hfpef(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ef_percent, 'ef');
  ensureNum(req.nyha_class, 'nyha');
  ensureNum(req.bnp, 'bnp');
  ensureEnum(req.diastolic_dysfunction, 'dd', ['none','grade_1','grade_2','grade_3','indeterminate']);
  ensureBool(req.htn, 'htn');
  ensureBool(req.diabetes, 'dm');
  ensureStr(req.therapy, 'tx');
  return { ef: req.ef_percent, bnp: req.bnp, therapy: req.therapy };
}
function heart_failure_hfref(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ef_percent, 'ef');
  ensureNum(req.nyha_class, 'nyha');
  ensureNum(req.bnp, 'bnp');
  ensureNum(req.ldl, 'ldl');
  ensureNum(req.on_target_dose, 'otd');
  ensureStr(req.device, 'dev');
  ensureEnum(req.prognosis, 'prog', ['good','moderate','poor','end_stage']);
  return { ef: req.ef_percent, prognosis: req.prognosis };
}
function cardiomyopathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['dilated','hypertrophic','restrictive','arrhythmogenic','takotsubo','peripartum']);
  ensureNum(req.ef_percent, 'ef');
  ensureStr(req.etiology, 'eti');
  ensureBool(req.family_history, 'fh');
  ensureStr(req.genetic_testing, 'gt');
  ensureStr(req.device, 'dev');
  return { type: req.type, ef: req.ef_percent };
}
function acute_decompensated_hf(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.presenting_bp, 'bp');
  ensureNum(req.weight_gain_kg, 'wg');
  ensureNum(req.creatinine, 'cr');
  ensureStr(req.iv_diuretic_bolus, 'bolus');
  ensureEnum(req.response, 'resp', ['adequate_diuresis','inadequate','resistant','ultrafiltration_required']);
  ensureStr(req.monitoring, 'mon');
  return { bp: req.presenting_bp, response: req.response };
}
function advanced_heart_failure(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.nyha_class, 'nyha');
  ensureBool(req.on_inotropes, 'ino');
  ensureBool(req.renal_function_worsening, 'rfw');
  ensureNum(req.intermacs, 'im');
  ensureStr(req.evaluation_for_lvad_or_transplant, 'eval');
  return { nyha: req.nyha_class, intermacs: req.intermacs };
}

function funcs() { return { heart_failure_hfpef, heart_failure_hfref, cardiomyopathy, acute_decompensated_hf, advanced_heart_failure }; }
module.exports = { funcs, ValidationError };