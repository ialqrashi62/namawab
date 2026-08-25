// filepath: tier118_social_services_622_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function psychosocial_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.social_worker_id, 'sw');
  ensureStr(req.living_situation, 'ls');
  ensureEnum(req.support_system, 'ss', ['strong','moderate','weak','none','unknown']);
  ensureBool(req.safety_concern, 'sc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function discharge_planning_social(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'plid');
  ensureEnum(req.discharge_destination, 'dd', ['home','home_health','rehab','snf','ltach','shelter','family','other','unknown']);
  ensureBool(req.services_arranged, 'sa');
  ensureNum(req.follow_up_visits_planned, 'fvp');
  ensureStr(req.provider, 'pr');
  return { plid: req.plan_id };
}
function abuse_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.screening_id, 'sid');
  ensureEnum(req.abuse_type, 'at', ['physical','emotional','sexual','neglect','financial','none','other','unknown']);
  ensureBool(req.reported_to_authorities, 'ra');
  ensureStr(req.safety_plan, 'sp');
  ensureStr(req.provider, 'pr');
  return { sid: req.screening_id };
}
function financial_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.counseling_id, 'cid');
  ensureEnum(req.counseling_type, 'ct', ['insurance','charity_care','payment_plan','medicaid','medicare','other','unknown']);
  ensureBool(req.application_submitted, 'as2');
  ensureNum(req.estimated_savings_dollars, 'esd');
  ensureStr(req.provider, 'pr');
  return { cid: req.counseling_id };
}
function community_resource(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.resource_id, 'rid');
  ensureStr(req.resource_type, 'rt');
  ensureStr(req.agency_name, 'an');
  ensureBool(req.contact_made, 'cm');
  ensureStr(req.provider, 'pr');
  return { rid: req.resource_id };
}

function funcs() { return { psychosocial_assessment, discharge_planning_social, abuse_screening, financial_counseling, community_resource }; }
module.exports = { funcs, ValidationError };