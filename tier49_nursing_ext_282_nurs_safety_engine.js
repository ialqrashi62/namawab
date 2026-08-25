// filepath: tier49_nursing_ext_282_nurs_safety_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function restraint_use(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'rt', ['soft_wrist','soft_ankle','vest','mittens','enclosure_bed']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.order_renewal_due, 'rn');
  ensureNum(req.monitoring_freq_hours, 'mf');
  ensureStr(req.alternatives_tried, 'alt');
  return { type: req.type };
}
function patient_identification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.two_identifiers_used, 'ti');
  ensureEnum(req.band_checked, 'bc', ['present_intact','present_torn','absent','replaced']);
  ensureStr(req.blood_band_typed, 'bb');
  ensureStr(req.verified_by, 'vb');
  return { two_id: req.two_identifiers_used };
}
function hand_hygiene(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.opportunity, 'op', ['pre_patient_contact','post_patient_contact','pre_task','post_task','gloves_off']);
  ensureEnum(req.compliance, 'c', ['compliant','partial','missed']);
  ensureEnum(req.method, 'm', ['alcohol_rub','soap_water','chlorhexidine']);
  ensureNum(req.duration_sec, 'dur');
  return { compliance: req.compliance };
}
function sbar_communication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.situation, 'sit');
  ensureStr(req.background, 'bg');
  ensureStr(req.assessment, 'ass');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.recipient, 'rec2');
  return { recipient: req.recipient };
}
function shift_handoff(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.method, 'm');
  ensureNum(req.outstanding_tasks.length, 'ot_len');
  ensureNum(req.pending_results.length, 'pr_len');
  ensureStr(req.alerts, 'alerts');
  return { tasks: req.outstanding_tasks.length };
}

function funcs() { return { restraint_use, patient_identification, hand_hygiene, sbar_communication, shift_handoff }; }
module.exports = { funcs, ValidationError };