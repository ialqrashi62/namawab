// filepath: tier45_icu_ext_259_icu_sepsis_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function septic_shock(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.lactate, 'lac');
  ensureNum(req.map, 'map');
  ensureNum(req.fluid_bolus_l, 'fluid');
  ensureBool(req.norepinephrine, 'ne');
  ensureStr(req.source, 'src');
  ensureEnum(req.mortality, 'mort', ['low','moderate','high','very_high']);
  return { status: req.norepinephrine ? 'shock' : 'pre_shock', mortality: req.mortality };
}
function severe_sepsis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.lactate, 'lac');
  ensureNum(req.wbc, 'wbc');
  ensureStr(req.organ_dysfunction, 'organ');
  ensureStr(req.source, 'src');
  ensureStr(req.antibiotics, 'abx');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening']);
  return { response: req.response, source: req.source };
}
function multidrug_resistant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.organism, 'org');
  ensureStr(req.resistance_pattern, 'res');
  ensureStr(req.antibiotics, 'abx');
  ensureEnum(req.de_escalation, 'de', ['planned','active','not_possible','completed']);
  ensureEnum(req.isolation, 'iso', ['standard','contact','droplet','airborne']);
  return { organism: req.organism, isolation: req.isolation };
}
function fungal_sepsis_icu(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.organism, 'org');
  ensureNum(req.galactomannan, 'gal');
  ensureBool(req.echinocandin, 'ech');
  ensureStr(req.source, 'src');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening']);
  return { organism: req.organism, response: req.response };
}
function catheter_sepsis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.line_type, 'line', ['central','peripheral','midline','picc','arterial']);
  ensureNum(req.days_in_place, 'days');
  ensureStr(req.organism, 'org');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['clearing','stable','persistent']);
  return { line_type: req.line_type, response: req.response };
}

function funcs() { return { septic_shock, severe_sepsis, multidrug_resistant, fungal_sepsis_icu, catheter_sepsis }; }
module.exports = { funcs, ValidationError };