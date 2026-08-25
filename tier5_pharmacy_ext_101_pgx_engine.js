// filepath: tier5_pharmacy_ext_101_pgx_engine.js
// TIER5_PHARMACY_EXT-101: Pharmacogenomics (CYP2C19, CYP2D6, SLCO1B1, TPMT, DPYD, HLA)
'use strict';

const CITATIONS = [
  'CPIC_2018_PGx',
  'PharmGKB_Knowledge_Summary',
  'FDA_PGx_Table_2023',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }

function cyp2c19(req) {
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['clopidogrel','voriconazole','pantoprazole','lansoprazole','citalopram','escitalopram','amitriptyline','sertraline','diazepam','proguanil']);
  ensureStr(req.phenotype, 'phenotype');
  ensureEnum(req.phenotype, 'phenotype', ['um','im','nm','rm','pm']);

  let recommendation;
  if (req.phenotype === 'pm') recommendation = 'avoid_drug_or_use_alternative_with_thorough_clinical_decision';
  else if (req.phenotype === 'im') recommendation = 'review_dose_with_clinical_response_consider_titration';
  else if (req.phenotype === 'nm' && ['clopidogrel','citalopram'].includes(req.drug)) recommendation = 'standard_dose_proceed';
  else if (req.phenotype === 'rm' && req.drug === 'clopidogrel') recommendation = 'alternative';
  else if (req.phenotype === 'um' && ['citalopram','escitalopram','sertraline'].includes(req.drug)) recommendation = 'consider_dose_reduction_baseline_QT_then_dose_review';
  else recommendation = 'no_specific_change_required_but_stay_clinical_aware';
  return { gene: 'CYP2C19', drug: req.drug, phenotype: req.phenotype, recommendation };
}

function cyp2d6(req) {
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['codeine','tramadol','tamoxifen','fluoxetine','paroxetine','metoprolol','carvedilol','propafenone','haloperidol','risperidone','aripiprazole','benztropine','dextromethorphan']);
  ensureStr(req.phenotype, 'phenotype');
  ensureEnum(req.phenotype, 'phenotype', ['um','im','nm','pm','unknown']);

  let plan;
  if (['codeine','tramadol'].includes(req.drug) && (req.phenotype === 'um' || req.phenotype === 'pm')) plan = 'avoid_drug_use_alternative_analgesic';
  else if (req.phenotype === 'pm' && ['metoprolol','carvedilol','haloperidol'].includes(req.drug)) plan = 'consider_alternative_drug_with_less_cyp2d6_metabolism';
  else if (req.phenotype === 'um' && req.drug === 'tamoxifen') plan = 'consider_alternative_endocrine_therapy_due_to_active_metabolite_reduction';
  else if (req.phenotype === 'unknown') plan = 'use_default_dose_then_review_response_in_2_weeks';
  else plan = 'standard_dose_proceed';
  return { gene: 'CYP2D6', drug: req.drug, phenotype: req.phenotype, plan };
}

function slco1b1(req) {
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['simvastatin','atorvastatin','methotrexate']);
  ensureStr(req.genotype, 'genotype');
  ensureEnum(req.genotype, 'genotype', ['normal_c_normal_c','normal_c_c','c_c_c']);
  ensureNumber(req.simvastatin_dose_mg, 'simvastatin_dose_mg');

  let approach;
  if (req.drug === 'simvastatin' && req.genotype === 'c_c_c' && req.simvastatin_dose_mg >= 40) approach = 'reduce_simvastatin_dose_below_20mg_or_alternative_with_less_slco1b1_dependence';
  else if (req.drug === 'simvastatin' && req.genotype === 'normal_c_c') approach = 'max_40mg_dose';
  else if (req.drug === 'methotrexate' && req.genotype === 'c_c_c') approach = 'monitor_for_toxicity_or_reduce_dose_then_check_drug_levels';
  else approach = 'standard_dose_proceed';

  return { gene: 'SLCO1B1', drug: req.drug, genotype: req.genotype, approach };
}

function tpmt(req) {
  ensureStr(req.phenotype, 'phenotype');
  ensureEnum(req.phenotype, 'phenotype', ['normal','intermediate','poor','ultra_high']);
  ensureNumber(req.drug_starting_dose, 'drug_starting_dose');
  ensureNumber(req.body_surface_area, 'body_surface_area');

  if (req.phenotype === 'poor') return { recommendation: 'avoid_or_reduce_dose_75_to_90_percent_with_no_bone_marrow_suppression' };
  if (req.phenotype === 'intermediate') return { recommendation: 'start_at_30_to_50_percent_dose_then_monitor_cbc_frequent' };
  return { recommendation: 'standard_dose_with_cbc_monitor' };
}

function dpyd(req) {
  ensureStr(req.phenotype, 'phenotype');
  ensureEnum(req.phenotype, 'phenotype', ['normal','intermediate','poor']);
  ensureNumber(req.planned_dose, 'planned_dose');

  let recommendation;
  if (req.phenotype === 'poor') recommendation = 'avoid_fluoropyrimidines_or_alternative_chemotherapy';
  else if (req.phenotype === 'intermediate') recommendation = 'reduce_initial_dose_50_percent_with_dpd_phenotype_or_uracil_test_then_reassess';
  else recommendation = 'standard_dose';
  return { recommendation };
}

function funcs() { return { cyp2c19, cyp2d6, slco1b1, tpmt, dpyd }; }
module.exports = { funcs, CITATIONS, ValidationError };
