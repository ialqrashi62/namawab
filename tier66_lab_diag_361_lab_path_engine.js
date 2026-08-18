// filepath: tier66_lab_diag_361_lab_path_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function biopsy_specimen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen_id, 'sid');
  ensureEnum(req.tissue_type, 'tt', ['prostate','breast','colon','skin','lymph_node','thyroid','lung','liver','kidney','bone','bone_marrow','endometrial','cervical','brain','stomach','esophagus','pancreas','lymph','other']);
  ensureNum(req.particles, 'part');
  ensureStr(req.gross_description, 'gd');
  ensureEnum(req.container_type, 'ct', ['cassette','cup','jar','bag','vial','block','slide','flask','container','other']);
  ensureBool(req.consented_for_banking, 'cfb');
  ensureStr(req.pathologist, 'path');
  return { tissue: req.tissue_type };
}
function cytology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen_id, 'sid');
  ensureEnum(req.cyto_type, 'ct', ['pap_smear','fnc_thyroid','fnc_breast','body_fluid','urine','sputum','csf','bronchial_wash','gastric','oral','other']);
  ensureEnum(req.sample_quality, 'sq', ['adequate','inadequate','borderline','satisfactory','satisfactory_but_limited','unsatisfactory']);
  ensureEnum(req.abnormal_cells, 'ac', ['none','atypical','low_grade_sil','high_grade_sil','squamous_carcinoma','glandular_abnormal','malignant','suspicious','malignant_cells_present','other']);
  ensureStr(req.result, 'res');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.pathologist, 'path');
  return { result: req.result };
}
function histology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen_id, 'sid');
  ensureStr(req.tissue, 'tiss');
  ensureStr(req.stains_used, 'su');
  ensureStr(req.diagnosis, 'dx');
  ensureEnum(req.differentiation, 'diff', ['well','moderately','poorly','undifferentiated','not_applicable','cannot_assess']);
  ensureBool(req.lymphovascular_invasion, 'lvi');
  ensureBool(req.stage_relevant, 'sr');
  ensureStr(req.pathologist, 'path');
  return { diagnosis: req.diagnosis };
}
function immunostain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen_id, 'sid');
  ensureStr(req.stain, 'st');
  ensureEnum(req.score, 'score', ['0','1_plus','2_plus','3_plus','negative','weak_positive','moderate_positive','strong_positive','not_interpretable','positive','negative_internal','positive_internal']);
  ensureBool(req.positive, 'pos');
  ensureEnum(req.intensity, 'int', ['weak','moderate','strong','focal','diffuse','absent','1_plus','2_plus','3_plus','variable','not_applicable']);
  ensureNum(req.percentage_cells, 'pc');
  ensureEnum(req.control_stain, 'cs', ['adequate','inadequate','absent','faded','mixed','optimal','suboptimal','not_applicable']);
  ensureStr(req.clinical_relevance, 'cr');
  return { stain: req.stain };
}
function molecular_path(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen_id, 'sid');
  ensureStr(req.test, 'test');
  ensureStr(req.mutations, 'mut');
  ensureEnum(req.platform, 'plat', ['NGS','PCR','RFLP','Sanger','QS','HPSP','IHC','fish','array_cgh','mass_spec','ddPCR','allele_specific_pcr','other']);
  ensureEnum(req.result, 'res', ['positive','negative','mutation_detected','no_mutation','variant_of_uncertain_significance','wild_type','inconclusive','pending','failed','other']);
  ensureNum(req.allele_frequency_pct, 'af');
  ensureStr(req.relevance, 'rel');
  return { test: req.test };
}

function funcs() { return { biopsy_specimen, cytology, histology, immunostain, molecular_path }; }
module.exports = { funcs, ValidationError };