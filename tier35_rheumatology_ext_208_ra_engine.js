// filepath: tier35_rheumatology_ext_208_ra_engine.js
// TIER35_RHEUMATOLOGY-208: Rheumatoid arthritis
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ra_classification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.duration_weeks, 'dur');
  ensureBool(req.symmetric, 'sym');
  ensureBool(req.mcp_involved, 'mcp');
  ensureEnum(req.rheumatoid_factor, 'rf', ['positive','negative','not_done','weak_positive']);
  ensureEnum(req.anti_ccp, 'ccp', ['positive','negative','not_done','weak_positive']);
  ensureBool(req.erosions_present, 'er');
  let status;
  if (req.anti_ccp === 'positive' && req.erosions_present) status = 'definite_ra_aggressive_treat';
  else if (req.duration_weeks >= 6 && req.symmetric && req.mcp_involved) status = 'ra_classified_2010_criteria';
  else if (req.duration_weeks < 6) status = 'insufficient_duration_reassess';
  else status = 'ra_classification_review';
  return { status, score: req.duration_weeks };
}

function ra_disease_activity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.das28, 'das');
  ensureNumber(req.cdai, 'cdai');
  ensureNumber(req.sdai, 'sdai');
  ensureNumber(req.patient_global, 'pg');
  ensureNumber(req.swollen_joints, 'sj');
  ensureNumber(req.tender_joints, 'tj');
  let status;
  if (req.das28 > 5.1) status = 'high_disease_activity_escalate_treatment';
  else if (req.das28 >= 3.2 && req.das28 <= 5.1) status = 'moderate_activity_optimize_treatment';
  else if (req.das28 >= 2.6 && req.das28 < 3.2) status = 'low_activity_maintain';
  else if (req.das28 < 2.6) status = 'remission_maintain_continue';
  else status = 'ra_activity_review';
  return { status, das: req.das28 };
}

function ra_dmards(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.mtx_dose, 'mtx');
  ensureBool(req.leflunomide, 'lef');
  ensureBool(req.hydroxychloroquine, 'hcq');
  ensureBool(req.monitoring_complete, 'mon');
  ensureNumber(req.alt, 'alt');
  ensureNumber(req.anc, 'anc');
  let status;
  if (req.alt >= 100) status = 'mtx_hepatotoxicity_hold_review';
  else if (req.anc < 1.5) status = 'mtx_neutropenia_hold';
  else if (!req.monitoring_complete) status = 'monitoring_incomplete_labs_due';
  else if (req.mtx_dose >= 15 && req.hydroxychloroquine) status = 'mtx_hcq_combination_appropriate';
  else status = 'dmards_review_appropriate';
  return { status, mtx: req.mtx_dose };
}

function ra_biologic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.biologic, 'bio', ['etanercept','adalimumab','infliximab','rituximab','abatacept','tocilizumab','sarilumab','other']);
  ensureNumber(req.duration_months, 'dur');
  ensureEnum(req.response, 'resp', ['excellent','good','partial','poor','intolerant','unknown']);
  ensureBool(req.screening_tb_done, 'tb');
  ensureBool(req.infection_signs, 'inf');
  let status;
  if (req.infection_signs) status = 'infection_hold_biologic_evaluate';
  else if (!req.screening_tb_done) status = 'tb_screening_required_before_biologic';
  else if (req.response === 'poor' && req.duration_months >= 6) status = 'biologic_failure_switch';
  else if (req.response === 'excellent' || req.response === 'good') status = 'biologic_response_favorable';
  else status = 'biologic_review_appropriate';
  return { status, bio: req.biologic };
}

function ra_joint_protection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.hand_ot_referred, 'ot');
  ensureBool(req.splint_use, 'splint');
  ensureBool(req.exercise_program, 'ex');
  ensureBool(req.work_modification, 'work');
  ensureBool(req.joint_surgery_planned, 'sx');
  let status;
  if (req.joint_surgery_planned) status = 'joint_surgery_pre_op_optimize';
  else if (!req.hand_ot_referred && req.splint_use) status = 'ot_refer_for_hand_education';
  else if (!req.exercise_program) status = 'exercise_program_initiate';
  else if (req.hand_ot_referred && req.splint_use && req.exercise_program && req.work_modification) status = 'joint_protection_comprehensive';
  else status = 'joint_protection_review';
  return { status, ot: req.hand_ot_referred };
}

function funcs() { return { ra_classification, ra_disease_activity, ra_dmards, ra_biologic, ra_joint_protection }; }
module.exports = { funcs, ValidationError };