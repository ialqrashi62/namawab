// filepath: tier117_credentialing_619_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function privilege_request(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.privilege_id, 'pid');
  ensureStr(req.user_id, 'uid');
  ensureStr(req.privileges_requested, 'pr');
  ensureBool(req.training_completed, 'tc');
  ensureNum(req.references_count, 'rc');
  ensureBool(req.board_certified, 'bc');
  ensureEnum(req.status, 'st', ['pending','approved','denied','conditional','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.privilege_id };
}
function privilege_renewal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.renewal_id, 'rid');
  ensureStr(req.user_id, 'uid');
  ensureStr(req.last_renewal_date, 'lrd');
  ensureStr(req.due_date, 'dd');
  ensureNum(req.cme_hours_earned, 'che');
  ensureNum(req.cme_required, 'cr');
  ensureEnum(req.renewal_status, 'rs', ['pending','approved','expired','denied','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.renewal_id };
}
function peer_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.review_id, 'rid');
  ensureStr(req.physician_id, 'phi');
  ensureNum(req.cases_reviewed, 'crd');
  ensureNum(req.cases_with_issues, 'cwi');
  ensureStr(req.reviewer, 'rev');
  ensureStr(req.recommendations, 'rec');
  ensureEnum(req.outcome, 'out', ['completed','pending','escalated','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.review_id };
}
function license_verification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.verification_id, 'vid');
  ensureStr(req.license_number, 'ln');
  ensureStr(req.state, 'st');
  ensureStr(req.expiration_date, 'ed');
  ensureBool(req.dea_active, 'da');
  ensureStr(req.verified_date, 'vd');
  ensureStr(req.provider, 'pr');
  return { vid: req.verification_id };
}
function credentialing_renewal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.renewal_id, 'rid');
  ensureStr(req.practitioner_id, 'pi');
  ensureEnum(req.credentialing_type, 'ct', ['md','np','pa','rn','crna','other','unknown']);
  ensureStr(req.expiration_date, 'ed');
  ensureBool(req.malpractice_insurance_active, 'mia');
  ensureBool(req.peer_review_complete, 'prc');
  ensureStr(req.provider, 'pr');
  return { rid: req.renewal_id };
}

function funcs() { return { privilege_request, privilege_renewal, peer_review, license_verification, credentialing_renewal }; }
module.exports = { funcs, ValidationError };