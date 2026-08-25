// filepath: tier91_geriatric_assessment_478_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function comprehensive_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.adl_score, 'adl');
  ensureNum(req.iadl_score, 'iadl');
  ensureNum(req.mmse_score, 'mmse');
  ensureNum(req.moca_score, 'moca');
  ensureNum(req.gait_speed, 'gs');
  ensureNum(req.grip_strength, 'grip');
  ensureNum(req.weight_loss_kg, 'wl');
  ensureEnum(req.frailty_status, 'fs', ['robust','pre_frail','frail','severely_frail','unknown','other']);
  ensureBool(req.multimorbidity, 'mm');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function adl_iadl(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.bathing, 'bath');
  ensureNum(req.dressing, 'dress');
  ensureNum(req.toileting, 'toil');
  ensureNum(req.transferring, 'trans');
  ensureNum(req.continence, 'cont');
  ensureNum(req.feeding, 'feed');
  ensureNum(req.shopping, 'shop');
  ensureNum(req.cooking, 'cook');
  ensureNum(req.housekeeping, 'house');
  ensureNum(req.medication_management, 'meds');
  ensureNum(req.finances, 'fin');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cognitive_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.test_type, 'tt', ['mmse','moca','mini_cog','ace','addenbrooke','other','unknown']);
  ensureNum(req.orientation_score, 'os');
  ensureNum(req.registration_score, 'rs');
  ensureNum(req.attention_score, 'as');
  ensureNum(req.recall_score, 'rcl');
  ensureNum(req.language_score, 'ls');
  ensureNum(req.visuospatial_score, 'vs');
  ensureNum(req.total_score, 'tot');
  ensureNum(req.education_years, 'edu');
  ensureEnum(req.impression, 'imp', ['normal','mci','dementia','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function functional_status(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.tug_seconds, 'tug');
  ensureNum(req.sppb_score, 'sppb');
  ensureNum(req.gait_speed_mps, 'gs');
  ensureNum(req.balance_score, 'bs');
  ensureNum(req.chair_stands, 'cs');
  ensureNum(req.six_min_walk, '6mw');
  ensureBool(req.walking_aid_used, 'aid');
  ensureBool(req.fear_of_falling, 'fof');
  ensureNum(req.falls_last_year, 'fly');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function social_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.living_situation, 'ls', ['alone','spouse','family','nursing_home','assisted_living','other','unknown']);
  ensureNum(req.social_isolation_score, 'sis');
  ensureBool(req.caregiver_present, 'cp');
  ensureNum(req.caregiver_burden, 'cb');
  ensureNum(req.financial_concerns, 'fc');
  ensureBool(req.elder_abuse_suspected, 'eas');
  ensureBool(req.advance_directive, 'ad');
  ensureBool(req.health_proxy, 'hp');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { comprehensive_assessment, adl_iadl, cognitive_screening, functional_status, social_assessment }; }
module.exports = { funcs, ValidationError };
