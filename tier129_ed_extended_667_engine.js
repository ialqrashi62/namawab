// filepath: tier129_ed_extended_667_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.triage_id, 'tid');
  ensureEnum(req.esi_level, 'esi', ['1','2','3','4','5','other','unknown']);
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.acuity, 'acu', ['low','medium','high','critical','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.triage_id };
}
function trauma_assess(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.t_id, 'tid');
  ensureEnum(req.mechanism, 'mech', ['mvc','fall','penetrating','blunt','burn','other','unknown']);
  ensureNum(req.gcs, 'gcs');
  ensureNum(req.iss, 'iss');
  ensureBool(req.fast_done, 'fd');
  ensureStr(req.provider, 'pr');
  return { tid: req.t_id };
}
function sepsis_bundle(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.sb_id, 'sid');
  ensureNum(req.lactate, 'lact');
  ensureBool(req.blood_culture_drawn, 'bcd');
  ensureBool(req.antibiotics_within_1h, 'ab1');
  ensureNum(req.fluid_ml, 'fm');
  ensureStr(req.provider, 'pr');
  return { sid: req.sb_id };
}
function stroke_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.sp_id, 'sid');
  ensureNum(req.last_known_well, 'lkw');
  ensureNum(req.nihss_score, 'ns');
  ensureBool(req.tpa_eligible, 'tpa');
  ensureBool(req.thrombectomy, 'th');
  ensureStr(req.provider, 'pr');
  return { sid: req.sp_id };
}
function ami_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ami_id, 'aid');
  ensureNum(req.door_to_balloon_min, 'dtb');
  ensureBool(req.pci_performed, 'pci');
  ensureNum(req.troponin_max, 'tm');
  ensureStr(req.disposition, 'disp');
  ensureStr(req.provider, 'pr');
  return { aid: req.ami_id };
}

function funcs() { return { triage, trauma_assess, sepsis_bundle, stroke_protocol, ami_protocol }; }
module.exports = { funcs, ValidationError };