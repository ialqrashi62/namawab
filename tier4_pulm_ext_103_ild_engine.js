'use strict';
// TIER4_PULM_EXT-103: ILD pattern recognition + workup
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ATS_ERS_ILD_2018', 'ATS_ERS_ILD_2022'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function pattern(req) {
  ensureBool(req.dyspnea, 'dyspnea');
  ensureBool(req.dry_cough, 'dry_cough');
  ensureBool(req.clubbing, 'clubbing');
  ensureNumber(req.age, 'age');
  ensureBool(req.smoker, 'smoker');
  ensureBool(req.asbestos_exposure, 'asbestos_exposure');
  ensureBool(req.bird_exposure, 'bird_exposure');
  ensureBool(req.drug_chemo_exposure, 'drug_chemo_exposure');
  ensureBool(req.autoimmune, 'autoimmune');
  ensureStr(req.hrct_pattern, 'hrct_pattern'); // uip | nsip | hp | dadr | consolidative | ground_glass_only | normal

  let differential = [];
  if (req.hrct_pattern === 'uip') differential.push('ipf_or_pneumoconiosis_or_connective_tissue_or_drug');
  else if (req.hrct_pattern === 'nsip') differential.push('connective_tissue_or_drug_or_idiopathic_nsip');
  else if (req.hrct_pattern === 'hp') differential.push('hypersensitivity_pneumonitis');
  else if (req.hrct_pattern === 'dadr') differential.push('diffuse_alveolar_damage_ards');
  else if (req.hrct_pattern === 'consolidative') differential.push('organizing_pneumonia_or_infection_or_malignancy');
  else if (req.hrct_pattern === 'ground_glass_only') differential.push('hypersensitivity_nsip_or_resolving_infection_or_early_disease');
  if (req.bird_exposure && req.hrct_pattern === 'hp') differential.unshift('bird_fancier_lung');
  if (req.asbestos_exposure) differential.push('asbestosis');
  if (req.drug_chemo_exposure) differential.push('drug_induced_ild');
  if (req.autoimmune) differential.push('connective_tissue_disease_associated');
  return {
    hrct_pattern: req.hrct_pattern,
    differential,
    severity_clues: { dyspnea: req.dyspnea, dry_cough: req.dry_cough, clubbing: req.clubbing, smoker: req.smoker, age: req.age },
    citations: CITATIONS,
  };
}

function workup(req) {
  ensureBool(req.known_autoimmune, 'known_autoimmune');
  ensureBool(req.immunocompromised, 'immunocompromised');
  ensureNumber(req.age, 'age');
  ensureBool(req.unexplained_ae, 'unexplained_ae');

  const base = ['hrct_chest', 'pft_with_dlco', 'autoimmune_serology_anca_anti_jo_anti_scl_anti_ccp', 'echocardiogram', '6_minute_walk_test'];
  const advanced = req.age >= 65 || req.unexplained_ae || req.immunocompromised ?
    [...base, 'bronchoscopy_with_bal_and_tbbx', 'surgical_lung_biopsy_evaluation'] : base;
  const multidisciplinary = 'mdt_discussion_required_if_fibrotic_or_progressive';
  return {
    base_workup: base,
    advanced_workup: advanced,
    multidisciplinary,
    monitoring: ['pft_q3_6_months', 'hrct_q12_months_or_if_change'],
    citations: CITATIONS,
  };
}

module.exports = { pattern, workup, CITATIONS, ValidationError };