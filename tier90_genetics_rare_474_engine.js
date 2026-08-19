// filepath: tier90_genetics_rare_474_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function rare_disease_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.suspected_disease, 'sd');
  ensureNum(req.age_onset_years, 'ao');
  ensureNum(req.family_members_affected, 'fma');
  ensureBool(req.consanguinity, 'con');
  ensureEnum(req.inheritance_pattern, 'ip', ['autosomal_dominant','autosomal_recessive','x_linked','maternal','sporadic','unknown','other']);
  ensureEnum(req.genetic_test, 'gt', ['wgs','wes','panel','single_gene','mitochondrial','karyotype','microarray','none','pending','other','unknown']);
  ensureNum(req.diagnostic_odyssey_years, 'doy');
  ensureBool(req.diagnosis_confirmed, 'dc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function whole_exome(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureEnum(req.indications, 'ind', ['multiple_congenital_anomalies','neurodevelopmental','unexplained_epilepsy','metabolic','immunodeficiency','other','unknown']);
  ensureNum(req.coverage_depth, 'cov');
  ensureNum(req.variants_found, 'vf');
  ensureNum(req.pathogenic_variants, 'pv');
  ensureNum(req.vus_variants, 'vus');
  ensureBool(req.trio_sequencing, 'trio');
  ensureEnum(req.report_status, 'rs', ['preliminary','final','amended','pending','cancelled','other','unknown']);
  ensureNum(req.turnaround_days, 'ta');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function metabolic_genetics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.disorder, 'dis');
  ensureEnum(req.newborn_screening, 'nbs', ['positive','negative','pending','declined','unknown','other','none']);
  ensureNum(req.lactate, 'lac');
  ensureNum(req.ammonia, 'amm');
  ensureNum(req.amino_acids_abnormal, 'aaa');
  ensureBool(req.organic_aciduria, 'oa');
  ensureBool(req.dietary_therapy, 'dt');
  ensureBool(req.cofactor_supplementation, 'cs');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function newborn_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.screen_id, 'sid');
  ensureNum(req.birth_weight_grams, 'bw');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.disorders_screened, 'ds');
  ensureNum(req.abnormal_results, 'ar');
  ensureBool(req.confirmatory_testing, 'ct');
  ensureBool(req.follow_up_required, 'fur');
  ensureEnum(req.outcome, 'out', ['normal','carrier','affected','pending','referral','deceased','other','unknown']);
  ensureNum(req.days_to_result, 'dtr');
  ensureStr(req.provider, 'pr');
  return { sid: req.screen_id };
}
function pharmacogenomics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureEnum(req.gene_panel, 'gp', ['cyp2c19','cyp2d6','cyp3a4','tpmt','dpyd','ugt1a1','vkORC1','comprehensive','other','unknown']);
  ensureEnum(req.cpic_drug, 'cd', ['codeine','clopidogrel','warfarin','simvastatin','azathioprine','fluorouracil','tamoxifen','other','unknown','none']);
  ensureEnum(req.metabolizer_status, 'ms', ['poor','intermediate','normal','rapid','ultra_rapid','indeterminate','other','unknown']);
  ensureBool(req.dose_adjusted, 'da');
  ensureEnum(req.recommendation, 'rec', ['use_alternative','reduce_dose','increase_dose','standard_dose','no_change','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}

function funcs() { return { rare_disease_workup, whole_exome, metabolic_genetics, newborn_screening, pharmacogenomics }; }
module.exports = { funcs, ValidationError };
