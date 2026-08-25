// filepath: tier61_ops_ext_341_ops_legal_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function contract_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.contract_id, 'ci');
  ensureEnum(req.type, 'typ', ['msa','sow','nda','dpa','bba','sla','lease','vendor_agreement','employment','consulting']);
  ensureStr(req.party, 'party');
  ensureStr(req.start_date, 'sd');
  ensureStr(req.end_date, 'ed');
  ensureStr(req.renewal_terms, 'rt');
  ensureNum(req.value, 'val');
  return { contract: req.contract_id };
}
function legal_hold(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.hold_id, 'hi');
  ensureEnum(req.scope, 'scope', ['patient_records','emails','departmental','system_wide','specific_user','custodian']);
  ensureStr(req.custodian, 'cust');
  ensureStr(req.start_date, 'sd');
  ensureEnum(req.release_date, 'rd', ['pending','released','extended','expired','cancelled']);
  ensureStr(req.matter, 'matter');
  ensureNum(req.records_count, 'rc');
  return { hold: req.hold_id };
}
function gdpr_request(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.request_id, 'ri');
  ensureEnum(req.type, 'typ', ['data_access','data_erasure','data_portability','data_rectification','restrict_processing','object_processing']);
  ensureStr(req.requester_id, 'rid');
  ensureBool(req.identity_verified, 'iv');
  ensureStr(req.due_date, 'dd');
  ensureEnum(req.status, 'st', ['received','in_progress','pending_info','completed','rejected','escalated']);
  ensureStr(req.data_categories, 'dc');
  return { request: req.request_id };
}
function incident_report(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.incident_id, 'ii');
  ensureEnum(req.severity, 'sev', ['low','moderate','high','critical','catastrophic']);
  ensureStr(req.date, 'date');
  ensureStr(req.location, 'loc');
  ensureNum(req.persons_involved, 'pi');
  ensureStr(req.root_cause, 'rc');
  ensureStr(req.corrective_action, 'ca');
  ensureBool(req.reported_to_legal, 'rl');
  return { incident: req.incident_id };
}
function insurance_claim(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.claim_id, 'ci');
  ensureEnum(req.type, 'typ', ['liability','property','malpractice','auto','workers_comp','cyber','business_interruption']);
  ensureStr(req.date_filed, 'df');
  ensureStr(req.insurer, 'ins');
  ensureNum(req.amount_requested, 'ar');
  ensureEnum(req.status, 'st', ['under_review','approved','denied','paid','partially_paid','appealed','closed']);
  ensureStr(req.adjuster, 'adj');
  return { claim: req.claim_id };
}

function funcs() { return { contract_management, legal_hold, gdpr_request, incident_report, insurance_claim }; }
module.exports = { funcs, ValidationError };