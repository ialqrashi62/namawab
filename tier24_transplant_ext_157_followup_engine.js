// filepath: tier24_transplant_ext_157_followup_engine.js
// TIER24_TRANSPLANT-157: Long-term follow-up, surveillance, return to OR
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function surveillance(req) {
  ensureStr(req.recipient_id, 'recipient_id');
  ensureNumber(req.days_post_tx, 'days_post_tx');
  ensureBool(req.bk_virus_qpcr_done, 'bk');
  ensureBool(req.cmv_qpcr_done, 'cmv');
  ensureBool(req.donor_specific_antibody_done, 'dsa');
  ensureBool(req.protocol_biopsy_done, 'biopsy');
  ensureEnum(req.compliance, 'compliance', ['excellent','good','fair','poor','nonadherent','unknown','other']);
  let status;
  if (req.days_post_tx > 90 && !req.bk_virus_qpcr_done) status = 'bk_surveillance_missing';
  else if (req.days_post_tx > 365 && !req.donor_specific_antibody_done) status = 'dsa_annual_missing';
  else if (req.compliance === 'nonadherent') status = 'nonadherence_refer_counseling';
  else status = 'surveillance_appropriate';
  return { status, compliance: req.compliance };
}

function return_to_or(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.reason, 'reason', ['vascular_complication','ureteral_complication','lymphocele','wound_dehiscence','bowel_obstruction','bleeding','graft_thrombosis','biopsy','relist','other']);
  ensureNumber(req.days_post_tx, 'days_post_tx');
  ensureBool(req.urgent, 'urgent');
  ensureBool(req.graft_salvaged, 'salvaged');
  ensureBool(req.graft_lost, 'lost');
  let status;
  if (req.urgent && (req.reason === 'graft_thrombosis' || req.reason === 'bleeding')) status = 'urgent_return_or_evacuate_hematoma_or_thrombectomy';
  else if (req.graft_lost) status = 'graft_lost_relist_or_dialysis';
  else if (!req.graft_salvaged && req.urgent) status = 'urgent_no_salvage_transplant_failed';
  else status = 'return_or_appropriate';
  return { status, reason: req.reason };
}

function retransplant(req) {
  ensureStr(req.candidate_id, 'candidate_id');
  ensureNumber(req.previous_transplants, 'prev');
  ensureNumber(req.days_graft_lost, 'days_lost');
  ensureNumber(req.days_since_relisting, 'relist_days');
  ensureEnum(req.reason_prev_failure, 'reason_prev_failure', ['rejection_chronic','rejection_acute','infection_graft_loss','vascular_thrombosis','recurrent_disease','ptld','noncompliance','unknown','other']);
  ensureBool(req.immunology_workup_redone, 'imm_redone');
  let status;
  if (req.previous_transplants > 3) status = 'over_3_tx_review_individual';
  else if (req.days_since_relisting < 30) status = 'recent_relist_cooling_period';
  else if (!req.immunology_workup_redone) status = 'imm_redone_required';
  else status = 'retransplant_evaluation_appropriate';
  return { status, prev: req.previous_transplants };
}

function life_quality(req) {
  ensureStr(req.recipient_id, 'recipient_id');
  ensureNumber(req.months_post_tx, 'months');
  ensureNumber(req.karnofsky_score, 'karnofsky');
  ensureBool(req.returned_to_work, 'work');
  ensureBool(req.exercise_tolerance, 'exercise');
  ensureNumber(req.satisfaction_score, 'satisfaction');
  let status;
  if (req.karnofsky_score < 70) status = 'low_karnofsky_rehab_refer';
  else if (!req.exercise_tolerance) status = 'low_exercise_review_deconditioning';
  else if (req.satisfaction_score < 5) status = 'low_satisfaction_counseling';
  else status = 'life_quality_good';
  return { status, karnofsky: req.karnofsky_score };
}

function transition_care(req) {
  ensureStr(req.recipient_id, 'recipient_id');
  ensureNumber(req.age, 'age');
  ensureBool(req.adolescent, 'adolescent');
  ensureBool(req.adult_care_takeover, 'adult_care');
  ensureBool(req.insurance_active, 'insurance');
  ensureNumber(req.days_since_last_visit, 'days_since_visit');
  let status;
  if (req.adolescent && !req.adult_care_takeover) status = 'pediatric_to_adult_transition_planning';
  else if (!req.insurance_active) status = 'insurance_lapsed_social_work';
  else if (req.days_since_last_visit > 90) status = 'lapse_in_care_outreach';
  else status = 'transition_care_appropriate';
  return { status, age: req.age };
}

const CITATIONS = { AST_FOLLOWUP_2024: 'AST Long-term Follow-up 2024', IPITA_2024: 'IPITA 2024' };

function funcs() { return { surveillance, return_to_or, retransplant, life_quality, transition_care }; }
module.exports = { funcs, CITATIONS, ValidationError };