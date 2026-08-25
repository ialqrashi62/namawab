// filepath: tier90_genetics_lab_477_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function karyotype(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureStr(req.indications, 'ind');
  ensureNum(req.band_resolution, 'br');
  ensureBool(req.fluorescence_in_situ, 'fish');
  ensureBool(req.confirmatory_fish, 'cf');
  ensureEnum(req.result, 'res', ['normal','abnormal','variant','inconclusive','pending','other','unknown']);
  ensureNum(req.abnormalities_found, 'af');
  ensureNum(req.turnaround_days, 'ta');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function microarray(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureEnum(req.platform, 'pl', ['snP','cgh','array_cgh','oligo','other','unknown']);
  ensureNum(req.probes_analyzed, 'pa');
  ensureNum(req.cnvs_detected, 'cnv');
  ensureNum(req.pathogenic_cnvs, 'pc');
  ensureNum(req.vus_cnvs, 'vus');
  ensureNum(req.benign_cnvs, 'ben');
  ensureBool(req.confirmation_needed, 'con');
  ensureEnum(req.report_classification, 'rc', ['normal','pathogenic','vus','likely_pathogenic','likely_benign','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function variant_interpretation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.gene, 'gene');
  ensureStr(req.transcript, 'tr');
  ensureStr(req.hgvs_c, 'c');
  ensureStr(req.hgvs_p, 'p');
  ensureEnum(req.classification, 'cls', ['pathogenic','likely_pathogenic','vus','likely_benign','benign','other','unknown']);
  ensureNum(req.evidence_strength, 'es');
  ensureBool(req.ACMG_criteria_met, 'acmg');
  ensureBool(req.functional_studies, 'fs');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function fish_test(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureStr(req.probe, 'probe');
  ensureEnum(req.tissue_type, 'tt', ['blood','bone_marrow','amniocyte','fibroblast','tumor','other','unknown']);
  ensureNum(req.cells_analyzed, 'ca');
  ensureNum(req.abnormal_cells_pct, 'abp');
  ensureEnum(req.result, 'res', ['positive','negative','inconclusive','pending','other','unknown']);
  ensureBool(req.confirmatory_required, 'cr');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function methylation_test(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureEnum(req.disorder, 'dis', ['prader_willi','angelman','beckwith_wiedemann','russell_silver','fragile_x','other','unknown']);
  ensureNum(req.methylation_index, 'mi');
  ensureNum(req.locus_tested, 'lt');
  ensureEnum(req.result, 'res', ['normal','abnormal','mosaic','inconclusive','pending','other','unknown']);
  ensureNum(req.confirmation_method, 'cm');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}

function funcs() { return { karyotype, microarray, variant_interpretation, fish_test, methylation_test }; }
module.exports = { funcs, ValidationError };
