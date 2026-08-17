// filepath: tier53_oncology_ext_299_onc_lung_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function nsclc_early(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureEnum(req.histology, 'histo', ['adenocarcinoma','squamous_cell','large_cell','adenosquamous','sarcomatoid']);
  ensureStr(req.egfr, 'egfr');
  ensureStr(req.alk, 'alk');
  ensureStr(req.surgery, 'surg');
  ensureStr(req.adjuvant_chemo, 'ac');
  ensureNum(req.follow_up_years, 'fu');
  return { stage: req.stage, histology: req.histology };
}
function nsclc_advanced(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureStr(req.mutations, 'mut');
  ensureNum(req.line, 'line');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['complete_response','partial_response','stable_disease','progression','mixed']);
  ensureStr(req.monitoring, 'mon');
  return { mutations: req.mutations, line: req.line };
}
function sclc_limited(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stage, 'stage', ['limited','limited_extensive']);
  ensureNum(req.ps, 'ps');
  ensureStr(req.treatment, 'tx');
  ensureNum(req.cycles, 'cy');
  ensureEnum(req.response, 'resp', ['complete_response','partial_response','stable_disease','progression']);
  ensureStr(req.prophylactic_cranial_radiation, 'pcr');
  return { stage: req.stage, cycles: req.cycles };
}
function sclc_extensive(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureNum(req.ps, 'ps');
  ensureNum(req.line, 'line');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['complete_response','partial_response','stable_disease','progression','mixed_response']);
  return { stage: req.stage, response: req.response };
}
function mesothelioma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['pleural','peritoneal','pericardial','tunica_vaginalis']);
  ensureStr(req.histology, 'histo');
  ensureStr(req.stage, 'stage');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['complete_response','partial_response','stable','progression']);
  return { type: req.type };
}

function funcs() { return { nsclc_early, nsclc_advanced, sclc_limited, sclc_extensive, mesothelioma }; }
module.exports = { funcs, ValidationError };