// filepath: tier139_claim_667_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function claim_submit(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.payer_id, 'pi');
  ensureStr(req.provider_id, 'pri');
  ensureEnum(req.claim_type, 'ct', ['professional','institutional','pharmacy','dental','vision','mental_health','DME','ambulance','lab','radiology']);
  ensureNum(req.amount_billed, 'ab');
  ensureEnum(req.urgency, 'ur', ['routine','urgent','emergent','retroactive']);
  ensureStr(req.diagnosis_codes, 'dc');
  ensureStr(req.procedure_codes, 'pc');
  ensureStr(req.provider, 'pr');
  return { cl_id: `cl_${Date.now()}`, patient_id: req.patient_id, type: req.claim_type, amount: req.amount_billed };
}
function claim_adjudicate(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.claim_id, 'ci');
  ensureEnum(req.adjudication, 'ad', ['auto_approve','approve_partial','pend_review','deny','reject','appeal','appeal_approved','appeal_denied','resubmit','wait']);
  ensureNum(req.amount_approved, 'aa');
  ensureNum(req.amount_patient_resp, 'ap');
  ensureStr(req.reason_codes, 'rc');
  ensureNum(req.processing_time_hr, 'pt');
  ensureStr(req.provider, 'pr');
  return { aj_id: `aj_${Date.now()}`, claim_id: req.claim_id, adjudication: req.adjudication, approved: req.amount_approved };
}
function fraud_score(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.claim_id, 'ci');
  ensureNum(req.fraud_score, 'fs');
  ensureEnum(req.risk_tier, 'rt', ['low','moderate','high','severe']);
  ensureStr(req.red_flags, 'rf');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.historical_match, 'hm');
  ensureStr(req.provider, 'pr');
  return { fr_id: `fr_${Date.now()}`, claim_id: req.claim_id, fraud_score: req.fraud_score, risk: req.risk_tier };
}
function denial_appeal(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.claim_id, 'ci');
  ensureEnum(req.appeal_level, 'al', ['L1_peer','L2_medical_director','L3_external_reviewer','L4_admin_law_judge','L5_court','amber','independent']);
  ensureStr(req.appeal_reason, 'ar');
  ensureNum(req.days_to_submit, 'ds');
  ensureStr(req.supporting_docs, 'sd');
  ensureEnum(req.status, 'st', ['draft','submitted','under_review','approved','denied','withdrawn','overturned']);
  ensureStr(req.provider, 'pr');
  return { da_id: `da_${Date.now()}`, claim_id: req.claim_id, level: req.appeal_level, status: req.status };
}
function remittance(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.claim_id, 'ci');
  ensureEnum(req.era_eob, 'er', ['ERA_electronic','EOB_paper','ACH','check','wire','pending','pending_835','pending_837']);
  ensureNum(req.amount_paid, 'ap');
  ensureNum(req.amount_adjustment, 'aa');
  ensureNum(req.patient_responsibility, 'pr');
  ensureStr(req.provider, 'pr');
  ensureStr(req.posted_at, 'pa');
  ensureStr(req.era_path, 'ep');
  return { rm_id: `rm_${Date.now()}`, claim_id: req.claim_id, amount_paid: req.amount_paid, era: req.era_eob };
}

function funcs() { return { claim_submit, claim_adjudicate, fraud_score, denial_appeal, remittance }; }
module.exports = { funcs, ValidationError };
