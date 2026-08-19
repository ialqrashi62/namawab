// filepath: tier112_pathogen_tracking_591_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function outbreak_detection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.detection_id, 'did');
  ensureStr(req.pathogen, 'pat');
  ensureNum(req.case_count, 'cc');
  ensureNum(req.expected_cases, 'ec');
  ensureBool(req.alert_triggered, 'at');
  ensureNum(req.investigations_count, 'ic');
  ensureStr(req.provider, 'pr');
  return { did: req.detection_id };
}
function whole_genome_sequencing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.wgs_id, 'wid');
  ensureNum(req.sample_count, 'sc');
  ensureStr(req.strain_type, 'st');
  ensureStr(req.spa_type, 'spa');
  ensureBool(req.transmission_cluster, 'tc');
  ensureEnum(req.control_measures, 'cm', ['implemented','pending','not_required','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { wid: req.wgs_id };
}
function contact_tracing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.contact_id, 'cid');
  ensureStr(req.exposure_date, 'ed');
  ensureNum(req.contacts_count, 'cc');
  ensureNum(req.contacts_reached, 'cr');
  ensureNum(req.tested, 'ts');
  ensureNum(req.positive, 'pos');
  ensureStr(req.provider, 'pr');
  return { cid: req.contact_id };
}
function environmental_sampling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.sampling_id, 'sid');
  ensureStr(req.location, 'loc');
  ensureBool(req.culture_positive, 'cp');
  ensureStr(req.organism, 'org');
  ensureEnum(req.intervention, 'int', ['cleaning','disinfection','remediation','terminal_clean','other','unknown','none']);
  ensureBool(req.remediation, 'rem');
  ensureStr(req.provider, 'pr');
  return { sid: req.sampling_id };
}
function line_listing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.line_list_id, 'lid');
  ensureStr(req.exposure, 'exp');
  ensureNum(req.cases_count, 'cc');
  ensureNum(req.hcw_count, 'hcwc');
  ensureNum(req.patient_count, 'pc');
  ensureStr(req.onset_period, 'op');
  ensureStr(req.provider, 'pr');
  return { lid: req.line_list_id };
}

function funcs() { return { outbreak_detection, whole_genome_sequencing, contact_tracing, environmental_sampling, line_listing }; }
module.exports = { funcs, ValidationError };