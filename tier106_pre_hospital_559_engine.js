// filepath: tier106_pre_hospital_559_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ems_dispatch(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dispatch_id, 'did');
  ensureNum(req.priority, 'pr');
  ensureStr(req.unit_id, 'uid');
  ensureNum(req.response_min, 'rm');
  ensureNum(req.transport_min, 'tm');
  ensureNum(req.on_scene_min, 'osm');
  ensureStr(req.provider, 'pr');
  return { did: req.dispatch_id };
}
function field_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.triage_id, 'tid');
  ensureEnum(req.protocol, 'prt', ['cdc_field','salt','start','other','unknown']);
  ensureEnum(req.acuity, 'acu', ['red','yellow','green','black','other','unknown']);
  ensureNum(req.vital_signs_score, 'vss');
  ensureNum(req.interventions_count, 'ic');
  ensureEnum(req.transport_decision, 'td', ['emergent','urgent','routine','scene_treatment','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.triage_id };
}
function transport_decision(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.decision_id, 'did');
  ensureNum(req.distance_km, 'dk');
  ensureNum(req.traffic_min, 'tm');
  ensureEnum(req.weather, 'wt', ['clear','rain','snow','fog','storm','other','unknown']);
  ensureEnum(req.air_vs_ground, 'avg', ['air','ground','either','other','unknown']);
  ensureStr(req.justification, 'jst');
  ensureStr(req.provider, 'pr');
  return { did: req.decision_id };
}
function pre_hospital_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.care_id, 'cid');
  ensureBool(req.iv_access, 'iv');
  ensureNum(req.medications_given, 'mg');
  ensureEnum(req.airway_management, 'am', ['bvm','intubation','supraglottic','cricothyrotomy','none','other','unknown']);
  ensureBool(req.cardiac_monitor, 'cm');
  ensureNum(req.interventions_count, 'ic');
  ensureStr(req.provider, 'pr');
  return { cid: req.care_id };
}
function handover(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.handover_id, 'hid');
  ensureBool(req.ems_to_ed, 'ete');
  ensureNum(req.verbal_report_min, 'vrm');
  ensureBool(req.documentation_complete, 'dc');
  ensureBool(req.vitals_communicated, 'vc');
  ensureNum(req.time_to_provider, 'ttp');
  ensureStr(req.provider, 'pr');
  return { hid: req.handover_id };
}

function funcs() { return { ems_dispatch, field_triage, transport_decision, pre_hospital_care, handover }; }
module.exports = { funcs, ValidationError };