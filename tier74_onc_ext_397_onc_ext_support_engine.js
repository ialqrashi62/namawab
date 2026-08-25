// filepath: tier74_onc_ext_397_onc_ext_support_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function psycho_oncology_support(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.distress_score, 'ds');
  ensureEnum(req.depression_screen, 'ds2', ['negative','positive','mild','moderate','severe','unknown','other']);
  ensureEnum(req.anxiety_screen, 'as', ['none','mild','moderate','severe','very_severe','unknown','other']);
  ensureBool(req.coping_strategy_education, 'cse');
  ensureBool(req.support_group_referred, 'sgr');
  ensureBool(req.family_therapy_available, 'fta');
  ensureNum(req.follow_up_sessions_planned, 'fusp');
  ensureStr(req.provider, 'pr');
  ensureEnum(req.risk_assessment, 'ra', ['low','moderate','high','severe','imminent','unknown','other']);
  ensureBool(req.med_consult, 'mc');
  return { session: req.session_id };
}
function spiritual_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureBool(req.spiritual_assessment_done, 'sad');
  ensureBool(req.religious_preferences_respected, 'rpr');
  ensureBool(req.chaplain_visit_required, 'cvr');
  ensureBool(req.end_of_life_discussion, 'eold');
  ensureBool(req.family_meeting_scheduled, 'fms');
  ensureBool(req.meaning_purpose_addressed, 'mpa');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_visit, 'nv');
  ensureBool(req.patient_consent, 'pc');
  return { referral: req.referral_id };
}
function financial_navigation_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureEnum(req.insurance_status, 'is', ['commercial','medicare','medicaid','uninsured','medicare_advantage','tricare','dual_eligible','employer_based','marketplace','other']);
  ensureBool(req.co_pay_assistance_applied, 'cpa');
  ensureBool(req.medicaid_review, 'mr');
  ensureStr(req.pharma_assistance_program, 'pap');
  ensureNum(req.treatment_cost_estimate, 'tce');
  ensureBool(req.transportation_assistance, 'ta');
  ensureBool(req.housing_assistance, 'ha');
  ensureNum(req.out_of_pocket_estimate, 'oope');
  ensureStr(req.provider, 'pr');
  ensureNum(req.follow_up, 'fu');
  return { referral: req.referral_id };
}
function survivorship_program(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.enrollment_id, 'eid');
  ensureEnum(req.treatment_status, 'ts', ['active_treatment','survivor','watchful_waiting','palliative','survivorship','remission','long_term_survivor','recently_completed','induction','maintenance','other']);
  ensureNum(req.years_post_treatment, 'ypt');
  ensureBool(req.psychological_support_active, 'psa');
  ensureBool(req.fitness_program_referred, 'fpr');
  ensureBool(req.nutrition_counseling_active, 'nca');
  ensureBool(req.peer_match_made, 'pmm');
  ensureBool(req.annual_survivorship_visit, 'asv');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  ensureNum(req.goals_active, 'ga');
  return { enrollment: req.enrollment_id };
}
function caregiver_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.caregiver_id, 'cid');
  ensureEnum(req.relationship, 'rel', ['spouse','partner','child','parent','sibling','friend','professional','caregiver_agency','neighbor','grandparent','other']);
  ensureNum(req.burden_score, 'bs');
  ensureEnum(req.depression_screen, 'ds', ['negative','positive','mild','moderate','severe','unknown','other']);
  ensureBool(req.caregiver_education_provided, 'cep');
  ensureBool(req.respite_care_arranged, 'rca');
  ensureBool(req.support_group_referred, 'sgr');
  ensureEnum(req.work_status_impact, 'wsi', ['none','reduced','quit','potential_quit','changed_jobs','reduced_hours','flexible_schedule','unemployed','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  ensureBool(req.crisis_plan_in_place, 'cpip');
  return { caregiver: req.caregiver_id };
}

function funcs() { return { psycho_oncology_support, spiritual_care, financial_navigation_cancer, survivorship_program, caregiver_assessment }; }
module.exports = { funcs, ValidationError };