// filepath: tier65_rev_cycle_354_rev_claim_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function claim_creation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.claim_id, 'cid');
  ensureStr(req.patient_id_field, 'pif');
  ensureStr(req.payer, 'payer');
  ensureStr(req.service_date, 'sd');
  ensureNum(req.billed_amount, 'ba');
  ensureStr(req.cpt_codes, 'cpt');
  ensureStr(req.place_of_service, 'pos');
  return { claim: req.claim_id };
}
function claim_scrubbing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.claim_id, 'cid');
  ensureStr(req.scrubbed_by, 'sb');
  ensureNum(req.errors_found, 'ef');
  ensureNum(req.warnings, 'warn');
  ensureBool(req.cpt_validated, 'cv');
  ensureBool(req.icd_validated, 'iv');
  ensureBool(req.mod_validated, 'mv');
  ensureBool(req.submit_ready, 'sr');
  return { claim: req.claim_id };
}
function claim_submission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.claim_id, 'cid');
  ensureStr(req.submitted_to, 'st');
  ensureStr(req.batch_id, 'bid');
  ensureStr(req.submitted_date, 'sd');
  ensureBool(req.accepted, 'acc');
  ensureStr(req.clearinghouse_acknowledgment, 'ca');
  ensureStr(req.tracking_id, 'tid');
  return { claim: req.claim_id };
}
function claim_status(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.claim_id, 'cid');
  ensureEnum(req.status, 'st', ['draft','submitted','accepted','paid','denied','pending','partially_paid','appealed','closed','in_progress','rejected']);
  ensureNum(req.paid_amount, 'pa');
  ensureNum(req.patient_responsibility, 'pr');
  ensureBool(req.era_received, 'era');
  ensureNum(req.dos_days_pending, 'ddp');
  ensureBool(req.follow_up_required, 'fur');
  return { status: req.status };
}
function claim_resubmission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.claim_id, 'cid');
  ensureStr(req.resubmission_id, 'rid');
  ensureEnum(req.reason, 'rsn', ['denial_modifier_incorrect','denial_medical_necessity','denial_coding','denial_timely_filing','denial_authorization','correction','information_request']);
  ensureNum(req.new_amount, 'na');
  ensureStr(req.resubmitted_date, 'rd');
  ensureStr(req.expected_decision_date, 'edd');
  ensureEnum(req.status, 'st', ['draft','submitted','under_review','approved','denied','in_progress','resubmit_required','closed']);
  return { resubmission: req.resubmission_id };
}

function funcs() { return { claim_creation, claim_scrubbing, claim_submission, claim_status, claim_resubmission }; }
module.exports = { funcs, ValidationError };