// filepath: tier102_surg_oncology_534_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cancer_staging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.cancer_type, 'ct');
  ensureNum(req.t_stage, 'ts');
  ensureNum(req.n_stage, 'ns');
  ensureNum(req.m_stage, 'ms');
  ensureEnum(req.tnm_stage, 'tn', ['0','I','IA','IB','II','IIA','IIB','III','IIIA','IIIB','IIIC','IV','IVA','IVB','IVC','unknown','other','none']);
  ensureEnum(req.resectability, 'res', ['resectable','borderline','unresectable','metastatic','other','unknown']);
  ensureEnum(req.treatment, 'tx', ['surgery','chemo','radiation','combination','palliative','observation','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function tumor_resection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.tumor_size_cm, 'tsc');
  ensureEnum(req.margins, 'mg', ['negative','close','positive','pending','other','unknown']);
  ensureNum(req.lymph_nodes_resected, 'lnr');
  ensureNum(req.lymph_nodes_positive, 'lnp');
  ensureNum(req.complications, 'comp');
  ensureNum(req.hospital_days, 'hd');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function lymph_node_dissection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.lymph_node_count, 'lnc');
  ensureNum(req.positive_count, 'pc');
  ensureBool(req.sentinel_node, 'sn');
  ensureBool(req.completion, 'comp');
  ensureNum(req.complications, 'comp2');
  ensureEnum(req.pathology, 'path', ['negative','metastases','micrometastases','isolated_tumor_cells','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function recurrent_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.recurrence_site, 'rs');
  ensureNum(req.time_to_recurrence_months, 'ttr');
  ensureEnum(req.resectability, 'res', ['resectable','borderline','unresectable','other','unknown']);
  ensureEnum(req.treatment, 'tx', ['resection','chemo','radiation','targeted','immunotherapy','combination','palliative','other','unknown','none']);
  ensureEnum(req.prognosis, 'prog', ['excellent','good','fair','poor','guarded','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function palliative_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.indication, 'ind');
  ensureStr(req.procedure, 'proc');
  ensureNum(req.complications, 'comp');
  ensureNum(req.hospital_days, 'hd');
  ensureBool(req.symptom_relief, 'sr');
  ensureNum(req.quality_of_life_score, 'qol');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { cancer_staging, tumor_resection, lymph_node_dissection, recurrent_cancer, palliative_surgery }; }
module.exports = { funcs, ValidationError };
