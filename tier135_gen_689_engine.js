// filepath: tier135_gen_689_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function genetic_test(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.panel, 'pn', ['BRCA','CGH','WES','WGS','carrier','pharmacogenomic','newborn','prenatal','cancer','cardio','neuro','custom']);
  ensureEnum(req.specimen, 'sp', ['blood','saliva','buccal','amniotic','CVS','tissue']);
  ensureStr(req.indications, 'in');
  ensureStr(req.provider, 'pr');
  return { test_id: `gen_${Date.now()}`, patient_id: req.patient_id, panel: req.panel, specimen: req.specimen };
}
function variant_call(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.test_id, 'tid2');
  ensureStr(req.gene, 'gn');
  ensureStr(req.variant, 'vr');
  ensureEnum(req.classification, 'cl', ['pathogenic','likely_pathogenic','VUS','likely_benign','benign']);
  ensureEnum(req.zygosity, 'zg', ['heterozygous','homozygous','hemizygous','compound_het']);
  ensureStr(req.clinical_significance, 'cs');
  return { variant_id: `var_${Date.now()}`, test_id: req.test_id, gene: req.gene, classification: req.classification };
}
function counseling(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.test_id, 'tid3');
  ensureStr(req.counselor, 'gc');
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.results_discussion, 'rd');
  ensureStr(req.recommendations, 'rc');
  return { counsel_id: `gc_${Date.now()}`, patient_id: req.patient_id, test_id: req.test_id, counselor: req.counselor };
}
function family_history(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.relative, 'rl');
  ensureEnum(req.relationship, 'rs', ['mother','father','sister','brother','daughter','son','grandparent','aunt','uncle','cousin']);
  ensureStr(req.condition, 'cn');
  ensureNum(req.age_onset, 'ao');
  ensureBool(req.dna_confirmed, 'dc');
  return { fh_id: `fh_${Date.now()}`, patient_id: req.patient_id, relative: req.relative, condition: req.condition, confirmed: req.dna_confirmed };
}
function risk_calc(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.variant, 'vr');
  ensureEnum(req.condition, 'cn', ['breast_cancer','ovarian_cancer','colon_cancer','Huntington','brca','cardio','LDX','thalassemia']);
  ensureNum(req.lifetime_risk_pct, 'lr');
  ensureNum(req.relative_risk, 'rr');
  ensureStr(req.screening_rec, 'sr');
  return { risk_id: `rsk_${Date.now()}`, patient_id: req.patient_id, condition: req.condition, lifetime: req.lifetime_risk_pct };
}

function funcs() { return { genetic_test, variant_call, counseling, family_history, risk_calc }; }
module.exports = { funcs, ValidationError };
