// filepath: tier89_oncology_support_471_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function palliative_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.performance_status, 'ps', ['0','1','2','3','4','unknown']);
  ensureNum(req.pain_score, 'pain');
  ensureNum(req.symptom_burden_score, 'sbs');
  ensureNum(req.fatigue_score, 'fat');
  ensureNum(req.dyspnea_score, 'dys');
  ensureNum(req.nausea_score, 'nau');
  ensureNum(req.appetite_score, 'app');
  ensureNum(req.sleep_score, 'sleep');
  ensureEnum(req.spiritual_assessment, 'sa', ['done','declined','pending','not_applicable','other','unknown']);
  ensureEnum(req.advance_directive, 'ad', ['complete','in_progress','pending','none','decline','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function pain_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.pain_score, 'pain');
  ensureStr(req.pain_locations, 'pl');
  ensureEnum(req.pain_type, 'pt', ['nociceptive','neuropathic','mixed','other','unknown']);
  ensureEnum(req.current_opioid, 'co', ['none','morphine','oxycodone','fentanyl','methadone','hydromorphone','buprenorphine','tramadol','codeine','other','unknown']);
  ensureNum(req.opioid_dose_mg_equiv, 'ode');
  ensureBool(req.breakthrough_doses, 'btd');
  ensureNum(req.breakthrough_count_24h, 'btc');
  ensureBool(req.constipation_prophylaxis, 'cp');
  ensureBool(req.adjuvant_gabapentinoid, 'ag');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function psychosocial_support(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.distress_score, 'dist');
  ensureNum(req.anxiety_score, 'anx');
  ensureNum(req.depression_score, 'dep');
  ensureBool(req.social_work_consult, 'sw');
  ensureBool(req.psychiatry_consult, 'psy');
  ensureBool(req.counseling_referral, 'cr');
  ensureBool(req.support_group, 'sg');
  ensureBool(req.financial_counseling, 'fc');
  ensureNum(req.caregiver_burden_score, 'cbs');
  ensureEnum(req.coping_style, 'cst', ['active','avoidant','accepting','religious','denial','mixed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function goals_of_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.discussion_id, 'did');
  ensureEnum(req.code_status, 'cs', ['full','dnr','dnr_dni','and','limited','other','unknown']);
  ensureEnum(req.goals, 'gl', ['cure','prolong_life','comfort','functional','cognition','family_time','legacy','other','unknown']);
  ensureBool(req.family_meeting, 'fm');
  ensureNum(req.participants, 'par');
  ensureBool(req.ethics_consult, 'ec');
  ensureBool(req.hospice_eligible, 'he');
  ensureBool(req.hospice_enrolled, 'enr');
  ensureEnum(req.care_setting, 'cset', ['home','hospital','hospice','facility','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.discussion_id };
}
function nutrition_support(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.weight_kg, 'wt');
  ensureNum(req.weight_change_6mo_pct, 'wc');
  ensureNum(req.bmi, 'bmi');
  ensureEnum(req.appetite, 'app', ['normal','decreased','anorexia','other','unknown']);
  ensureEnum(req.diet, 'diet', ['regular','soft','pureed','liquid','tube_feeding','tpn','other','unknown']);
  ensureNum(req.protein_intake_g, 'pi');
  ensureNum(req.calorie_intake_kcal, 'ci');
  ensureBool(req.dietitian_consult, 'dc');
  ensureBool(req.peg_tube, 'peg');
  ensureBool(req.supplements, 'sup');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { palliative_care, pain_management, psychosocial_support, goals_of_care, nutrition_support }; }
module.exports = { funcs, ValidationError };
