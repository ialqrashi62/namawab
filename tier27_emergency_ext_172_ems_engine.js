// filepath: tier27_emergency_ext_172_ems_engine.js
// TIER27_EMERGENCY-172: EMS, dispatch, hand-off, telemetry
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function dispatch(req) {
  ensureStr(req.dispatch_id, 'dispatch_id');
  ensureEnum(req.priority, 'priority', ['echo_life_threat','delta_emergent','charlie_urgent','bravo_urgent','alpha_non_emergent','omega_non_urgent','other']);
  ensureNumber(req.response_time_min, 'response');
  ensureEnum(req.unit, 'unit', ['als','bls','ccta','air_medical','ground_als','specialty','other']);
  ensureBool(req.first_responder, 'fr');
  ensureBool(req.trauma_center_diversion, 'diversion');
  let status;
  if (req.priority === 'echo_life_threat' && req.response_time_min > 8) status = 'echo_response_over_8min_review';
  else if (req.diversion) status = 'diversion_documented_alternate_destination';
  else status = 'dispatch_appropriate';
  return { status, priority: req.priority };
}

function handoff(req) {
  ensureStr(req.handoff_id, 'handoff_id');
  ensureBool(req.sbar_used, 'sbar');
  ensureStr(req.chief_complaint, 'cc');
  ensureBool(req.allergies_communicated, 'allergies');
  ensureBool(req.medications_communicated, 'meds');
  ensureBool(req.code_status_communicated, 'code');
  ensureBool(req.vitals_communicated, 'vitals');
  let status;
  if (!req.sbar_used) status = 'sbar_required_handoff';
  else if (!req.allergies_communicated || !req.medications_communicated) status = 'allergies_and_meds_required';
  else if (!req.code_status_communicated) status = 'code_status_communicated_required';
  else status = 'handoff_complete';
  return { status, sbar: req.sbar_used };
}

function telemetry(req) {
  ensureStr(req.session_id, 'session_id');
  ensureBool(req.ecg_transmitted, 'ecg');
  ensureNumber(req.distance_km, 'distance');
  ensureBool(req.med_consult, 'consult');
  ensureBool(req.activation, 'activation');
  ensureBool(req.hospital_prenotified, 'prenotified');
  let status;
  if (req.ecg_transmitted && !req.med_consult) status = 'ecg_transmitted_no_consult_review';
  else if (req.activation && !req.hospital_prenotified) status = 'activation_no_prenotification';
  else status = 'telemetry_appropriate';
  return { status, ecg: req.ecg_transmitted };
}

function transport_mode(req) {
  ensureStr(req.transport_id, 'transport_id');
  ensureEnum(req.mode, 'mode', ['ground_bls','ground_als','air_medical_rotor','air_medical_fixed','critical_care_transport','specialty_pediatric','other']);
  ensureNumber(req.distance_km, 'distance');
  ensureEnum(req.acuity, 'acuity', ['routine','urgent','critical','other']);
  ensureBool(req.ventilator_required, 'vent');
  ensureBool(req.iv_required, 'iv');
  let status;
  if (req.distance_km > 100 && req.mode === 'ground_bls' && req.acuity === 'critical') status = 'critical_long_ground_review_air';
  else if (req.ventilator_required && req.mode !== 'ground_als' && req.mode !== 'air_medical_rotor' && req.mode !== 'air_medical_fixed') status = 'vent_required_als_or_air';
  else status = 'transport_appropriate';
  return { status, mode: req.mode };
}

function documentation_ems(req) {
  ensureStr(req.run_id, 'run_id');
  ensureBool(req.vitals_recorded, 'vitals');
  ensureBool(req.interventions_recorded, 'interventions');
  ensureBool(req.timeline_documented, 'timeline');
  ensureBool(req.signature_obtained, 'signature');
  ensureBool(req.handoff_signed, 'handoff');
  let status;
  if (!req.vitals_recorded) status = 'vitals_required_ems_record';
  else if (!req.timeline_documented) status = 'timeline_required_review';
  else if (!req.handoff_signed) status = 'ed_handoff_signature_required';
  else status = 'documentation_complete';
  return { status, run: req.run_id };
}

const CITATIONS = { NHTSA_EMS_2024: 'NHTSA EMS 2024', IAED_2024: 'IAED Dispatch 2024' };

function funcs() { return { dispatch, handoff, telemetry, transport_mode, documentation_ems }; }
module.exports = { funcs, CITATIONS, ValidationError };