// filepath: tier113_ob_extended_595_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function lactation_consult(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.consult_id, 'cid');
  ensureNum(req.days_postpartum, 'dp');
  ensureEnum(req.feeding_method, 'fm', ['breast','bottle','both','pumped','formula','other','unknown']);
  ensureNum(req.feeding_frequency_hr, 'ffh');
  ensureNum(req.latching_score, 'ls');
  ensureNum(req.pain_level, 'pl');
  ensureStr(req.provider, 'pr');
  return { cid: req.consult_id };
}
function breastfeeding_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.days_postpartum, 'dp');
  ensureEnum(req.feeding_method, 'fm', ['breast','bottle','both','pumped','formula','other','unknown']);
  ensureEnum(req.milk_intake, 'mi', ['inadequate','adequate','abundant','unknown','other']);
  ensureNum(req.weight_loss_pct, 'wlp');
  ensureNum(req.feeding_count_24hr, 'fc');
  ensureNum(req.wet_diapers, 'wd');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function nipple_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.consult_id, 'cid');
  ensureNum(req.days_postpartum, 'dp');
  ensureNum(req.pain_score, 'ps');
  ensureBool(req.latching_correct, 'lc');
  ensureEnum(req.position, 'pos', ['cradle','football','side_lying','cross_cradle','other','unknown']);
  ensureEnum(req.nipple_condition, 'nc', ['intact','cracked','bleeding','blistered','infected','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.consult_id };
}
function mastitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.diagnosis_id, 'did');
  ensureNum(req.days_postpartum, 'dp');
  ensureBool(req.redness, 'rd');
  ensureBool(req.swelling, 'sw');
  ensureNum(req.fever, 'fv');
  ensureEnum(req.antibiotic, 'at', ['cephalexin','dicloxacillin','clindamycin','none','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.diagnosis_id };
}
function low_milk_supply(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.consult_id, 'cid');
  ensureNum(req.days_postpartum, 'dp');
  ensureEnum(req.feeding_method, 'fm', ['breast','bottle','both','pumped','formula','other','unknown']);
  ensureEnum(req.milk_supply, 'ms', ['low','decreasing','inadequate','other','unknown']);
  ensureEnum(req.supplementation, 'sup', ['none','formula','donor','banked','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.consult_id };
}

function funcs() { return { lactation_consult, breastfeeding_assessment, nipple_pain, mastitis, low_milk_supply }; }
module.exports = { funcs, ValidationError };