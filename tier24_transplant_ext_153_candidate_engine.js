// filepath: tier24_transplant_ext_153_candidate_engine.js
// TIER24_TRANSPLANT-153: Transplant candidate evaluation
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function candidate_eligibility(req) {
  ensureStr(req.candidate_id, 'candidate_id');
  ensureEnum(req.organ, 'organ', ['kidney','liver','heart','lung','pancreas','intestinal','multivisceral','heart_lung','kidney_pancreas','other']);
  ensureNumber(req.age, 'age');
  ensureBool(req.malignancy_history, 'malignancy');
  ensureBool(req.active_infection, 'infection');
  ensureBool(req.substance_use, 'substance');
  ensureNumber(req.bmi, 'bmi');
  ensureBool(req.compliance_history, 'compliance');
  ensureEnum(req.blood_type, 'blood_type', ['A','B','AB','O','unknown','other']);
  let status;
  if (req.age < 18) status = 'pediatric_refer_pediatric_team';
  else if (req.age > 75) status = 'over_75_review_individual';
  else if (req.active_infection) status = 'active_infection_defer_until_resolved';
  else if (req.malignancy_history) status = 'malignancy_history_oncology_clearance';
  else if (req.bmi > 40) status = 'severe_obesity_weight_loss_first';
  else if (!req.compliance_history) status = 'compliance_concern_psych_clearance';
  else status = 'candidate_meets_basic_eligibility';
  return { status, organ: req.organ };
}

function candidate_workup(req) {
  ensureStr(req.candidate_id, 'candidate_id');
  ensureBool(req.echo_done, 'echo');
  ensureNumber(req.lvef, 'lvef');
  ensureBool(req.pulmonary_tests_done, 'pulm');
  ensureNumber(req.fev1_pct, 'fev1');
  ensureBool(req.cardiac_clearance, 'cardiac');
  ensureBool(req.infectious_clearance, 'infectious');
  ensureBool(req.psychosocial_done, 'psychosocial');
  ensureBool(req.financial_counseling, 'financial');
  let status;
  if (!req.echo_done || !req.pulmonary_tests_done) status = 'workup_incomplete_cardio_pulm_pending';
  else if (req.lvef < 35) status = 'low_lvef_cardiac_contraindication';
  else if (req.fev1_pct < 40) status = 'low_fev1_pulmonary_contraindication';
  else if (!req.psychosocial_done) status = 'psychosocial_pending';
  else if (!req.financial_counseling) status = 'financial_clearance_pending';
  else status = 'workup_complete_ready_for_listing';
  return { status, lvef: req.lvef };
}

function crossmatch(req) {
  ensureStr(req.donor_id, 'donor_id');
  ensureStr(req.recipient_id, 'recipient_id');
  ensureEnum(req.crossmatch_result, 'crossmatch_result', ['negative_t_cell','negative_b_cell','positive_t_cell','positive_b_cell','flow_negative','flow_positive','cdc_negative','cdc_positive','unknown','other']);
  ensureNumber(req.donor_age, 'donor_age');
  ensureNumber(req.cold_ischemia_hours, 'cold');
  ensureEnum(req.hla_mismatch_count, 'hla_mismatch', ['0','1','2','3','4','5','6','unknown','other']);
  ensureBool(req.donation_after_circulatory_death, 'dcd');
  let status;
  if (req.crossmatch_result === 'positive_t_cell' || req.crossmatch_result === 'cdc_positive') status = 'positive_crossmatch_avoid_transplant';
  else if (req.cold_ischemia_hours > 36) status = 'prolonged_cold_ischemia_increased_risk';
  else if (req.hla_mismatch_count === '6') status = 'high_mismatch_increased_rejection_risk';
  else status = 'crossmatch_acceptable_proceed';
  return { status, cm: req.crossmatch_result };
}

function pra(req) {
  ensureStr(req.candidate_id, 'candidate_id');
  ensureNumber(req.pra_class1_pct, 'pra1');
  ensureNumber(req.pra_class2_pct, 'pra2');
  ensureBool(req.undetectable_donors, 'undetectable');
  ensureNumber(req.previous_transplants, 'prev_tx');
  ensureNumber(req.blood_transfusions, 'tx_units');
  let status;
  const max_pra = Math.max(req.pra_class1_pct, req.pra_class2_pct);
  if (max_pra > 80) status = 'highly_sensitized_kidney_paired_donation';
  else if (max_pra > 50) status = 'sensitized_review_unacceptable_antigens';
  else if (req.previous_transplants > 2) status = 're_transplant_immunologic_review';
  else status = 'pra_acceptable';
  return { status, max_pra };
}

function waiting_list(req) {
  ensureStr(req.candidate_id, 'candidate_id');
  ensureNumber(req.meld_score, 'meld');
  ensureNumber(req.waiting_days, 'days');
  ensureEnum(req.status, 'status', ['active','inactive','on_hold','transplanted','removed_died','removed_too_sick','removed_other','unknown','other']);
  ensureEnum(req.priority, 'priority', ['routine','priority_1a','priority_1b','priority_2','status_1a','status_1b','status_2','meld_35_plus','meld_25_34','meld_15_24','other']);
  ensureBool(req.expedited_review, 'expedited');
  let status;
  if (req.meld_score >= 35 && req.priority !== 'priority_1a') status = 'meld_35_reconsider_priority';
  else if (req.meld_score < 15) status = 'low_meld_review_inactive';
  else if (req.waiting_days > 365 && req.meld_score < 20) status = 'long_wait_review_status';
  else status = 'waiting_list_status_reviewed';
  return { status, meld: req.meld_score };
}

const CITATIONS = { OPTN_2024: 'OPTN/UNOS 2024', KDIGO_TX_2024: 'KDIGO Transplant 2024' };

function funcs() { return { candidate_eligibility, candidate_workup, crossmatch, pra, waiting_list }; }
module.exports = { funcs, CITATIONS, ValidationError };