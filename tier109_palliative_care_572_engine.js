// filepath: tier109_palliative_care_572_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function palliative_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.prognosis, 'prg', ['limited','months','years','uncertain','other','unknown']);
  ensureNum(req.karnofsky, 'kf');
  ensureNum(req.comorbidities, 'cm');
  ensureNum(req.symptom_burden, 'sb');
  ensureStr(req.goals_of_care, 'goc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function symptom_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.management_id, 'mid');
  ensureStr(req.symptoms, 'sym');
  ensureStr(req.interventions, 'intv');
  ensureEnum(req.response, 'resp', ['complete','partial','stable','worsening','other','unknown']);
  ensureBool(req.family_meeting, 'fm');
  ensureNum(req.days_to_improvement, 'dti');
  ensureStr(req.provider, 'pr');
  return { mid: req.management_id };
}
function goals_of_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.goals_id, 'gid');
  ensureStr(req.discussion, 'disc');
  ensureEnum(req.code_status, 'cs', ['full_code','dnr','dnr_dni','cmo','limited','other','unknown']);
  ensureNum(req.family_present, 'fp');
  ensureStr(req.decisions, 'dec');
  ensureStr(req.provider, 'pr');
  return { gid: req.goals_id };
}
function hospice_referral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureNum(req.prognosis_months, 'pm');
  ensureNum(req.karnofsky, 'kf');
  ensureBool(req.hospice_eligible, 'he');
  ensureEnum(req.disposition, 'disp', ['home_hospice','inpatient_hospice','respite','none','other','unknown']);
  ensureNum(req.family_agreement, 'fa');
  ensureStr(req.provider, 'pr');
  return { rid: req.referral_id };
}
function bereavement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.bereavement_id, 'bid');
  ensureStr(req.family_member, 'fm');
  ensureNum(req.time_to_bereavement_weeks, 'ttbw');
  ensureBool(req.support_offered, 'so');
  ensureEnum(req.referral, 'ref', ['support_group','counseling','spiritual_care','social_work','none','other','unknown']);
  ensureEnum(req.response, 'resp', ['accepted','declined','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { bid: req.bereavement_id };
}

function funcs() { return { palliative_assessment, symptom_management, goals_of_care, hospice_referral, bereavement }; }
module.exports = { funcs, ValidationError };