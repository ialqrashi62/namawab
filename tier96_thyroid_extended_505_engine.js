// filepath: tier96_thyroid_extended_505_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function thyroid_nodule(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.nodule_size_cm, 'ns');
  ensureEnum(req.tirads, 'tir', ['1','2','3','4a','4b','4c','5','unknown','other']);
  ensureNum(req.tsh, 'tsh');
  ensureNum(req.tsh_normalized, 'tn');
  ensureBool(req.fna_done, 'fd');
  ensureEnum(req.fna_result, 'fr', ['benign','malignant','suspicious','atypia','inadequate','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function thyroid_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.cancer_type, 'ct', ['papillary','follicular','medullary','anaplastic','lymphoma','other','unknown']);
  ensureNum(req.tumor_size_cm, 'ts');
  ensureNum(req.nodes_involved, 'ni');
  ensureNum(req.distant_metastasis, 'dm');
  ensureEnum(req.tnm_stage, 'tn', ['I','II','III','IVa','IVb','IVc','unknown','other']);
  ensureEnum(req.treatment, 'tx', ['surgery','rai','suppressive_therapy','chemo','targeted','combination','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function thyroid_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.surgery_type, 'st', ['lobectomy','total_thyroidectomy','completion','neck_dissection','other','unknown']);
  ensureNum(req.glands_removed, 'gr');
  ensureNum(req.hospital_days, 'hd');
  ensureNum(req.complications, 'comp');
  ensureEnum(req.recurrent_laryngeal, 'rln', ['intact','injured_temporary','injured_permanent','other','unknown']);
  ensureNum(req.path_size_cm, 'ps');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function rai_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.therapy_id, 'tid');
  ensureNum(req.dose_mci, 'dm');
  ensureNum(req.pre_tsh, 'ptsh');
  ensureNum(req.pre_tg, 'ptg');
  ensureNum(req.post_tg_6mo, 'ptg6');
  ensureNum(req.dry_eye_severity, 'des');
  ensureNum(req.sialadenitis, 'sia');
  ensureStr(req.provider, 'pr');
  return { tid: req.therapy_id };
}
function thyroid_eye(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.cas_score, 'cas');
  ensureNum(req.proptosis_mm, 'pp');
  ensureBool(req.optical_neuropathy, 'on');
  ensureNum(req.diplopia, 'dp');
  ensureBool(req.smoking, 'sm');
  ensureBool(req.iv_steroid, 'ivs');
  ensureBool(req.orbital_decompression, 'od');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { thyroid_nodule, thyroid_cancer, thyroid_surgery, rai_therapy, thyroid_eye }; }
module.exports = { funcs, ValidationError };
