// filepath: tier165_gen_771_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function variant_interpret(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.gene, 'ge'); ensureStr(req.variant, 'vr');
  ensureEnum(req.classification, 'cl', ['pathogenic','likely_pathogenic','vus','likely_benign','benign','NA']);
  ensureNum(req.acmg_score, 'as'); ensureBool(req.clinvar_pathogenic, 'cp');
  ensureNum(req.allele_freq, 'af'); ensureNum(req.coverage, 'cv');
  ensureEnum(req.zygosity, 'zy', ['homo','het','compound','x_linked','NA']);
  ensureEnum(req.inheritance, 'in', ['AD','AR','X_linked','maternal','paternal','de_novo','NA']);
  ensureEnum(req.actionable, 'ac', ['none','medication','family','surveillance','NA']);
  ensureStr(req.provider, 'pr');
  return { vi_id: `vi_${Date.now()}`, patient_id: req.patient_id, gene: req.gene, classification: req.classification };
}

function pharmacogenomics(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureStr(req.gene, 'ge');
  ensureEnum(req.metabolizer, 'mt', ['ultra_rapid','rapid','normal','intermediate','poor','NA']);
  ensureStr(req.drug, 'dr'); ensureNum(req.standard_dose_mg, 'sd');
  ensureNum(req.adjusted_dose_mg, 'ad'); ensureEnum(req.action, 'ac', ['no_change','reduce','increase','alternate','NA']);
  ensureNum(req.adverse_risk_score, 'ar'); ensureNum(req.benefit_score, 'bs');
  ensureStr(req.provider, 'pr');
  return { pg_id: `pg_${Date.now()}`, patient_id: req.patient_id, gene: req.gene, drug: req.drug, action: req.action };
}

function rare_disease(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.disease, 'ds', ['Huntington','Marfan','CF','DMD','Ehlers_Danlos','PKU','Tay_Sachs','other','NA']);
  ensureNum(req.diagnostic_journey_years, 'dj'); ensureNum(req.physicians_consulted, 'pc');
  ensureNum(req.genetic_tests, 'gt'); ensureEnum(req.diagnosis_method, 'dm', ['clinical','family','genetic','combination','NA']);
  ensureNum(req.variants_found, 'vf'); ensureBool(req.family_cascade, 'fc');
  ensureNum(req.treatment_options, 'to'); ensureStr(req.provider, 'pr');
  return { rd_id: `rd_${Date.now()}`, patient_id: req.patient_id, disease: req.disease, journey: req.diagnostic_journey_years };
}

function family_cascade(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.proband_variant, 'pv'); ensureEnum(req.disease, 'ds', ['BRCA','Lynch','Huntington','Marfan','CF','other','NA']);
  ensureNum(req.first_degree_count, 'fd'); ensureNum(req.first_degree_tested, 'ft');
  ensureNum(req.second_degree_count, 'sd'); ensureNum(req.second_degree_tested, 'st');
  ensureNum(req.carriers_identified, 'ci'); ensureNum(req.affected_identified, 'ai');
  ensureNum(req.counseling_sessions, 'cs'); ensureStr(req.provider, 'pr');
  return { fc_id: `fc_${Date.now()}`, patient_id: req.patient_id, variant: req.proband_variant, carriers: req.carriers_identified };
}

function gen_result_report(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.panel, 'pl', ['WGS','WES','targeted','pharmacogene','carrier','NA']);
  ensureNum(req.variants_total, 'vt'); ensureNum(req.variants_pathogenic, 'vp');
  ensureNum(req.variants_recessive, 'vr'); ensureNum(req.variants_drug, 'vd');
  ensureNum(req.report_pages, 'rp'); ensureNum(req.delivery_days, 'dd');
  ensureEnum(req.complexity, 'cx', ['simple','moderate','complex','NA']);
  ensureStr(req.provider, 'pr');
  return { gr_id: `gr_${Date.now()}`, patient_id: req.patient_id, panel: req.panel, path: req.variants_pathogenic };
}

function funcs() { return { variant_interpret, pharmacogenomics, rare_disease, family_cascade, gen_result_report }; }
module.exports = { funcs, ValidationError };