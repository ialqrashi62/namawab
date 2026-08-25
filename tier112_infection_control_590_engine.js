// filepath: tier112_infection_control_590_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hai_surveillance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surveillance_id, 'sid');
  ensureEnum(req.infection_type, 'it', ['clabsi','cauti','vap','ssi','cdi','mrsa','other','unknown']);
  ensureNum(req.cases_count, 'cc');
  ensureNum(req.patient_days, 'pd');
  ensureNum(req.rate_per_1000, 'rp1k');
  ensureNum(req.baseline_rate, 'br');
  ensureNum(req.excess_cases, 'exc');
  ensureStr(req.provider, 'pr');
  return { sid: req.surveillance_id };
}
function isolation_precautions(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.isolation_id, 'iid');
  ensureEnum(req.isolation_type, 'it', ['standard','contact','droplet','airborne','protective','other','unknown']);
  ensureStr(req.diagnosis, 'diag');
  ensureNum(req.duration_days, 'dd');
  ensureEnum(req.compliance, 'comp', ['full','partial','none','other','unknown']);
  ensureBool(req.private_room, 'pr');
  ensureStr(req.provider, 'pr');
  return { iid: req.isolation_id };
}
function catheter_bundle(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.bundle_id, 'bid');
  ensureEnum(req.catheter_type, 'ct', ['central','peripheral','midline','picc','foley','other','unknown']);
  ensureEnum(req.insertion_indications, 'ii', ['appropriate','inappropriate','uncertain','other','unknown']);
  ensureNum(req.maintenance_compliance, 'mc');
  ensureBool(req.chlorhexidine_use, 'cu');
  ensureBool(req.daily_review, 'dr');
  ensureStr(req.provider, 'pr');
  return { bid: req.bundle_id };
}
function ssi_prevention(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.prevention_id, 'pid');
  ensureStr(req.procedure, 'proc');
  ensureBool(req.antibiotic_prophylaxis, 'ap');
  ensureBool(req.glycemic_control, 'gc');
  ensureBool(req.normothermia, 'nt');
  ensureBool(req.preop_chlorhexidine, 'pch');
  ensureStr(req.provider, 'pr');
  return { pid: req.prevention_id };
}
function hand_hygiene_compliance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.compliance_id, 'cid');
  ensureStr(req.unit, 'unit');
  ensureNum(req.observations_count, 'oc');
  ensureNum(req.complies, 'cm');
  ensureNum(req.non_complies, 'nc');
  ensureNum(req.compliance_rate, 'cr');
  ensureStr(req.provider, 'pr');
  return { cid: req.compliance_id };
}

function funcs() { return { hai_surveillance, isolation_precautions, catheter_bundle, ssi_prevention, hand_hygiene_compliance }; }
module.exports = { funcs, ValidationError };