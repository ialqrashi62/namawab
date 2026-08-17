// filepath: tier53_oncology_ext_298_onc_breast_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function early_breast_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureStr(req.histology, 'histo');
  ensureEnum(req.grade, 'gr', ['grade_1','grade_2','grade_3','grade_x']);
  ensureEnum(req.er, 'er', ['positive','negative','low_positive']);
  ensureEnum(req.pr, 'pr', ['positive','negative','low_positive']);
  ensureEnum(req.her2, 'her2', ['positive','negative','equivocal','low_positive']);
  ensureStr(req.treatment, 'tx');
  ensureStr(req.response, 'resp');
  return { stage: req.stage, treatment: req.treatment };
}
function advanced_breast_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureStr(req.site_metastasis, 'sm');
  ensureNum(req.line, 'line');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['complete_response','partial_response','stable_disease','progression','mixed']);
  return { line: req.line, response: req.response };
}
function dcis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.grade, 'gr', ['low','intermediate','high']);
  ensureNum(req.size_mm, 'sz');
  ensureStr(req.margins, 'mg');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['planned','complete','progression','recurrence']);
  return { grade: req.grade, margins: req.margins };
}
function her2_pos_breast(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.her2_ihc, 'ihc');
  ensureNum(req.fish_ratio, 'fish');
  ensureStr(req.regimen, 'reg');
  ensureNum(req.cycles_planned, 'cy');
  ensureNum(req.cardiac_ejection_fraction, 'cef');
  ensureStr(req.response, 'resp');
  return { fish: req.fish_ratio, ef: req.cardiac_ejection_fraction };
}
function triple_neg_breast(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.brca_status, 'brca');
  ensureStr(req.regimen, 'reg');
  ensureNum(req.cycles_completed, 'cc');
  ensureEnum(req.response, 'resp', ['complete_response','partial_response','stable_disease','progression','pathologic_complete_response']);
  ensureNum(req.follow_up, 'fu');
  return { brca: req.brca_status, response: req.response };
}

function funcs() { return { early_breast_cancer, advanced_breast_cancer, dcis, her2_pos_breast, triple_neg_breast }; }
module.exports = { funcs, ValidationError };