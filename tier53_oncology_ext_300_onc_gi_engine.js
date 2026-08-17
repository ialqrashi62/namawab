// filepath: tier53_oncology_ext_300_onc_gi_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function colon_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureEnum(req.sidedness, 'sd', ['left','right','transverse','rectosigmoid']);
  ensureEnum(req.microsatellite, 'ms', ['mss','msi_low','msi_high','unknown']);
  ensureEnum(req.ras, 'ras', ['wild_type','mutant_kras','mutant_nras','unknown']);
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['planned','monitoring','complete','recurrence','progression']);
  return { stage: req.stage, ms: req.microsatellite };
}
function rectal_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureEnum(req.mesorectal_fascia, 'mrf', ['clear','threatened','involved']);
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['planned','downstaged','complete','no_response','progression']);
  return { stage: req.stage };
}
function pancreatic_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stage, 'stage', ['resectable','borderline_resectable','locally_advanced','metastatic']);
  ensureStr(req.site_metastasis, 'sm');
  ensureNum(req.ca_19_9, 'ca');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['planned','partial_response','stable','progression']);
  return { stage: req.stage, ca_19_9: req.ca_19_9 };
}
function gastric_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureEnum(req.her2, 'her2', ['positive','negative','equivocal']);
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['planned','partial_response','stable','progression','complete']);
  return { stage: req.stage };
}
function esophageal_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['adenocarcinoma_ge_junction','squamous_cell','adenosquamous','neuroendocrine','small_cell']);
  ensureStr(req.stage, 'stage');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['planned','complete','partial','stable','progression']);
  return { type: req.type };
}

function funcs() { return { colon_cancer, rectal_cancer, pancreatic_cancer, gastric_cancer, esophageal_cancer }; }
module.exports = { funcs, ValidationError };