// filepath: tier106_disaster_557_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function incident_command(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.incident_id, 'iid');
  ensureBool(req.command_structure_activated, 'csa');
  ensureNum(req.personnel_count, 'pc');
  ensureNum(req.communication_channels, 'cc');
  ensureNum(req.response_minutes, 'rm');
  ensureEnum(req.status, 'st', ['active','contained','resolved','escalated','de_escalated','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { iid: req.incident_id };
}
function triage_disaster(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.triage_id, 'tid');
  ensureStr(req.incident_id, 'iid');
  ensureEnum(req.tag_color, 'tc', ['red','yellow','green','black','other','unknown']);
  ensureNum(req.victim_count, 'vc');
  ensureEnum(req.category, 'cat', ['mass_casualty','single_victim','multiple_patients','other','unknown']);
  ensureEnum(req.treatment_zone, 'tz', ['primary','secondary','triage','decontamination','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.triage_id };
}
function resource_surge(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surge_id, 'sid');
  ensureEnum(req.resource_type, 'rt', ['bed','staff','ventilator','medication','supply','other','unknown']);
  ensureNum(req.additional_units, 'au');
  ensureNum(req.staff_called_in, 'sci');
  ensureNum(req.supplies_days, 'sd');
  ensureNum(req.hospital_capacity_pct, 'hcp');
  ensureStr(req.provider, 'pr');
  return { sid: req.surge_id };
}
function decontamination(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.decon_id, 'did');
  ensureEnum(req.contamination_type, 'ct', ['chemical','biological','radiological','mixed','none','other','unknown']);
  ensureNum(req.victims_processed, 'vp');
  ensureNum(req.decon_minutes, 'dm');
  ensureEnum(req.efficacy, 'eff', ['complete','partial','failed','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.decon_id };
}
function evacuation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureEnum(req.zone, 'zn', ['1','3','4','5','other','unknown']);
  ensureNum(req.evacuees, 'ev');
  ensureStr(req.destination, 'dest');
  ensureNum(req.transport_minutes, 'tm');
  ensureNum(req.special_needs_count, 'snc');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}

function funcs() { return { incident_command, triage_disaster, resource_surge, decontamination, evacuation }; }
module.exports = { funcs, ValidationError };