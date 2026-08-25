// filepath: tier90_genetics_counseling_476_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pretest_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.indication, 'ind');
  ensureBool(req.family_history_review, 'fhr');
  ensureBool(req.informed_consent, 'ic');
  ensureEnum(req.test_selection, 'ts', ['single_gene','panel','wes','wgs','karyotype','microarray','other','unknown','none']);
  ensureNum(req.incidental_findings_discussed, 'ifd');
  ensureNum(req.cost_insurance_discussed, 'cid');
  ensureNum(req.duration_minutes, 'dur');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function results_disclosure(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.result_type, 'rt', ['positive_pathogenic','likely_pathogenic','vus','likely_benign','benign','negative','inconclusive','other','unknown']);
  ensureNum(req.support_person_present, 'spp');
  ensureNum(req.psychological_impact_score, 'pis');
  ensureBool(req.referrals_made, 'rm');
  ensureBool(req.follow_up_planned, 'fup');
  ensureNum(req.time_to_process, 'ttp');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function psychosocial_support(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.distress_score, 'dist');
  ensureNum(req.anxiety_score, 'anx');
  ensureNum(req.depression_score, 'dep');
  ensureBool(req.counseling_referral, 'cr');
  ensureBool(req.support_group, 'sg');
  ensureNum(req.family_communication_help, 'fch');
  ensureNum(req.coping_score, 'cs');
  ensureNum(req.quality_of_life, 'qol');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function cascade_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.gene, 'gene');
  ensureStr(req.variant, 'var');
  ensureNum(req.first_degree_relatives, 'fdr');
  ensureNum(req.relatives_tested, 'rt');
  ensureNum(req.relatives_positive, 'rp');
  ensureNum(req.relatives_negative, 'rn');
  ensureNum(req.relatives_inconclusive, 'ri');
  ensureBool(req.letter_sent, 'ls');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function reproductive_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.genetic_condition, 'gc');
  ensureBool(req.preconception_counseling, 'pc');
  ensureEnum(req.reproductive_options, 'ro', ['natural','pgd','pnd','donor_gamete','adoption','childfree','other','unknown','none']);
  ensureBool(req.partner_tested, 'pt');
  ensureNum(req.offspring_risk_pct, 'or');
  ensureNum(req.family_planning_plans, 'fpp');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}

function funcs() { return { pretest_counseling, results_disclosure, psychosocial_support, cascade_screening, reproductive_counseling }; }
module.exports = { funcs, ValidationError };
