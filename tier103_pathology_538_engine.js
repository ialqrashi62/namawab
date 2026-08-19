// filepath: tier103_pathology_538_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function histology_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.tissue_type, 'tt', ['breast','colon','lung','lymph_node','skin','bone','prostate','thyroid','other','unknown']);
  ensureEnum(req.diagnosis, 'dx', ['benign','malignant','atypical','inflammatory','normal','pending','other','unknown']);
  ensureNum(req.grade, 'gr');
  ensureEnum(req.stage, 'st', ['0','I','II','III','IV','unknown','other','none']);
  ensureEnum(req.immunohistochemistry, 'ihc', ['positive','negative','pending','done','not_done','other','unknown']);
  ensureEnum(req.recommendation, 'rec', ['surgical','medical','followup','referral','observation','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function cytology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.specimen_type, 'st', ['fluid','fnc','urine','sputum','cerebrospinal','pleural','ascitic','other','unknown']);
  ensureBool(req.atypia, 'aty');
  ensureBool(req.malignancy_suspicious, 'ms');
  ensureEnum(req.adequacy, 'adq', ['adequate','inadequate','satisfactory','unsatisfactory','other','unknown']);
  ensureEnum(req.recommendation, 'rec', ['followup','biopsy','surgical','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function frozen_section(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.intraoperative_finding, 'io', ['benign','malignant','atypical','inconclusive','other','unknown']);
  ensureEnum(req.permanent_section, 'ps', ['benign','malignant','atypical','pending','other','unknown']);
  ensureBool(req.discrepancy, 'dis');
  ensureNum(req.turnaround_min, 'ta');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function molecular_path(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureEnum(req.test_type, 'tt', ['pcr','fish','ngs','microarray','karyotype','other','unknown']);
  ensureNum(req.genes_tested, 'gt');
  ensureNum(req.mutations_found, 'mf');
  ensureNum(req.tumor_fraction, 'tfrac');
  ensureEnum(req.interpretation, 'int', ['actionable','non_actionable','vus','negative','pending','other','unknown']);
  ensureEnum(req.treatment_target, 'tt', ['identified','not_identified','pending','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function autopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureEnum(req.autopsy_type, 'at', ['full','limited','brain','spinal','medical_exam','other','unknown']);
  ensureStr(req.cause_of_death, 'cod');
  ensureStr(req.contributing, 'cont');
  ensureBool(req.clinical_correction, 'cc');
  ensureBool(req.consent, 'con');
  ensureNum(req.turnaround_days, 'tad');
  ensureStr(req.provider, 'pr');
  return { rid: req.report_id };
}

function funcs() { return { histology_review, cytology, frozen_section, molecular_path, autopsy }; }
module.exports = { funcs, ValidationError };
