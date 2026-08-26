// tier325_bcma_1505_engine.js — Barcode Medication Administration (5 Rights)
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function t325_e1_five_rights_check(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.scan_patient_id, 'sp'); ensureStr(req.expected_patient_id, 'ep');
  ensureStr(req.scan_drug_code, 'sd'); ensureStr(req.expected_drug_code, 'ed');
  ensureBool(req.dose_within_order, 'do'); ensureEnum(req.route, 'ro', req.allowed_routes || ['oral','IV','IM','SC','topical']);
  const violations = [];
  if (req.scan_patient_id !== req.expected_patient_id) violations.push('RIGHT_PATIENT');
  if (req.scan_drug_code !== req.expected_drug_code) violations.push('RIGHT_DRUG');
  if (!req.dose_within_order) violations.push('RIGHT_DOSE');
  if ((req.allowed_routes || []).length && !req.allowed_routes.includes(req.route)) violations.push('RIGHT_ROUTE');
  return { verdict: violations.length ? 'BLOCKED' : 'PASS', violations, checked_at: new Date().toISOString(), guidance: violations.length ? 'do_not_administer — resolve violations or document supervised override' : 'proceed with administration documentation' };
}

function t325_e2_override_log(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.ticket_ref, 'tr');
  ensureEnum(req.violation, 'vi', ['RIGHT_PATIENT','RIGHT_DRUG','RIGHT_DOSE','RIGHT_ROUTE','RIGHT_TIME']);
  ensureStr(req.supervisor_id, 'sv'); ensureStr(req.reason, 'rs');
  return { override_id: `bcma_ovr_${Date.now()}`, violation: req.violation, supervisor_id: req.supervisor_id, reason: req.reason, audit: 'reported_to_pharmacy_safety' };
}

function t325_e3_mar_administration_record(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid'); ensureStr(req.drug_code, 'dc');
  ensureStr(req.administered_by, 'by'); ensureBool(req.bcma_passed, 'bp');
  if (!req.bp && !req.override_id) throw new ValidationError('override_id required when bcma failed', 'override_id');
  return { mar_id: `mar_${Date.now()}`, bcma_passed: req.bp, override_id: req.override_id || null, recorded_at: new Date().toISOString() };
}

function funcs() { return { t325_e1_five_rights_check, t325_e2_override_log, t325_e3_mar_administration_record }; }
module.exports = { funcs, ValidationError };
