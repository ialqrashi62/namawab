// filepath: tier55_triage_ext_311_triage_ped_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ped_assessment_triangle(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_months, 'am');
  ensureStr(req.appearance, 'app');
  ensureStr(req.work_of_breathing, 'wb');
  ensureStr(req.circulation_to_skin, 'cts');
  ensureStr(req.impression, 'imp');
  return { appearance: req.appearance };
}
function ped_color_breath_circulation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.color, 'col', ['pink','pale','mottled','cyanotic','jaundiced']);
  ensureEnum(req.breathing, 'br', ['unlabored','mild_distress','moderate_distress','severe_distress','apneic']);
  ensureEnum(req.circulation, 'circ', ['warm_pink','cool_pale','warm_pale','cool_mottled']);
  ensureNum(req.sat, 'sat');
  ensureStr(req.impression, 'imp');
  return { color: req.color };
}
function ped_illness_severity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.pews_score, 'pews');
  ensureEnum(req.work_of_breathing, 'wb', ['normal','mild','moderate','severe']);
  ensureEnum(req.severity, 'sev', ['low','low_to_moderate','moderate','high','critical']);
  ensureStr(req.disposition, 'disp');
  return { pews: req.pews_score };
}
function ped_pain_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.flacc_scale, 'flacc');
  ensureNum(req.self_report_nrs, 'nrs');
  ensureStr(req.pain_management, 'pm');
  ensureNum(req.reassess_min, 're');
  return { flacc: req.flacc_scale };
}
function ped_growth_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_months, 'am');
  ensureNum(req.weight_kg, 'w');
  ensureNum(req.height_cm, 'h');
  ensureNum(req.head_circumference_cm, 'hc');
  ensureEnum(req.growth_percentile, 'gp', ['normal','underweight','overweight','obese','short_stature','tall']);
  ensureEnum(req.nutrition, 'nut', ['appropriate','inadequate','excessive','uncertain']);
  return { weight: req.weight_kg, height: req.height_cm };
}

function funcs() { return { ped_assessment_triangle, ped_color_breath_circulation, ped_illness_severity, ped_pain_assessment, ped_growth_review }; }
module.exports = { funcs, ValidationError };