// filepath: tier121_genomics_633_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function genetic_test(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureStr(req.panel, 'pn');
  ensureEnum(req.method, 'meth', ['ngs','sanger','microarray','pcr','other','unknown']);
  ensureNum(req.turn_around_days, 'tad');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function variant_interpretation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.var_id, 'vid');
  ensureStr(req.gene, 'gene');
  ensureStr(req.variant, 'var');
  ensureEnum(req.pathogenicity, 'pg', ['pathogenic','likely_pathogenic','vus','likely_benign','benign','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { vid: req.var_id };
}
function pharmacogenomics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pgx_id, 'pid');
  ensureStr(req.gene, 'gene');
  ensureStr(req.diplotype, 'dp');
  ensureEnum(req.phenotype, 'ph', ['poor_metabolizer','intermediate','normal','rapid','ultra_rapid','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.pgx_id };
}
function hereditary_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureStr(req.panel, 'pn');
  ensureNum(req.genes_tested, 'gt');
  ensureBool(req.positive, 'pos');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function prenatal_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.screen_id, 'sid');
  ensureEnum(req.test, 'tst', ['nips','quad','cf_dna','other','unknown']);
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureBool(req.high_risk, 'hr');
  ensureStr(req.provider, 'pr');
  return { sid: req.screen_id };
}

function funcs() { return { genetic_test, variant_interpretation, pharmacogenomics, hereditary_cancer, prenatal_screening }; }
module.exports = { funcs, ValidationError };