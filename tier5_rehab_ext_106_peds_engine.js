// filepath: tier5_rehab_ext_106_peds_engine.js
// TIER5_REHAB_EXT-106: Pediatric rehab (GMFCS, GM, CP, neurodev, dystonia)
'use strict';

const CITATIONS = [
  'GMFCS_ERS_Palisano_2008',
  'Prechtl_GM_Assessment_1997',
  'SCPE_Hagberg_2002',
  'Bayley_III_Neurodev_2006',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureInt(v, f, lo, hi) {
  if (!Number.isInteger(v) || v < lo || v > hi) throw new ValidationError(`${f} must be integer in [${lo}..${hi}]`, f);
}

function gmfs_classification(req) {
  ensureNumber(req.age_years, 'age_years');
  ensureStr(req.gmfs_level, 'gmfs_level');
  ensureEnum(req.gmfs_level, 'gmfs_level', ['I','II','III','IV','V']);
  if (req.age_years < 0 || req.age_years > 18) throw new ValidationError('age 0..18', 'age_years');
  const map = {
    I: 'walks_independently_limited_advanced_skills',
    II: 'walks_independently_with_limitations_outdoor_walking',
    III: 'walks_using_HH_A_device_outdoor',
    IV: 'self_mobility_with_limitations_may_use_power_mobility',
    V: 'transported_in_manual_wheelchair',
  };
  return { gmfs_level: req.gmfs_level, age_years: req.age_years, descriptor: map[req.gmfs_level], citations: CITATIONS };
}

function gm_evaluation(req) {
  ensureInt(req.age_corrected_weeks, 'age_corrected_weeks', 36, 60);
  const items = ['head_control','arms_symmetry','leg_symmetry','disappearance_of_extensor','adduction_of_thumb','heel_touch','arched_back','extended_elbow'];
  for (const i of items) {
    if (typeof req[i] !== 'number' || req[i] < 0 || req[i] > 3) throw new ValidationError(`${i} 0..3`, i);
  }
  const total = items.reduce((s, i) => s + req[i], 0);
  let interpretation;
  if (total <= 5) interpretation = 'normal_reassure';
  else if (total <= 10) interpretation = 'slightly_abnormal_consider_repeat_3m';
  else if (total <= 14) interpretation = 'abnormal_refer_early_intervention';
  else interpretation = 'definitely_abnormal_neurodevelopmental_followup';
  return { total_score: total, interpretation, citations: CITATIONS };
}

function cp_classification(req) {
  ensureStr(req.subtype, 'subtype');
  ensureEnum(req.subtype, 'subtype', ['spastic_unilateral','spastic_bilateral','dyskinetic','ataxic','mixed']);
  ensureStr(req.topography, 'topography');
  ensureEnum(req.topography, 'topography', ['hemiplegia','diplegia','triplegia','quadriplegia','monoplegia']);

  let approach;
  if (req.subtype === 'spastic_unilateral' && req.topography === 'hemiplegia') approach = 'Modified_Constraint_Induced_Movement_Therapy_mCIMT';
  else if (req.subtype === 'spastic_bilateral' && req.topography === 'diplegia') approach = 'GMFM_66_goals_intensity_24hrs_active_program';
  else if (req.subtype === 'spastic_bilateral' && req.topography === 'quadriplegia') approach = '24h_postural_management_seating_stretching_oral_motor';
  else if (req.subtype === 'dyskinetic') approach = 'decrease_dystonia_develop_fine_motor_oral_motor';
  else if (req.subtype === 'ataxic') approach = 'balance_coordination_and_ataxia_management';
  else approach = 'mixed_pattern_custom_program';
  return { subtype: req.subtype, topography: req.topography, approach, citations: CITATIONS };
}

function neuro_dev_screening(req) {
  ensureNumber(req.age_months, 'age_months');
  ensureStr(req.domain, 'domain');
  ensureEnum(req.domain, 'domain', ['cognitive','language','motor','social_emotional','adaptive']);
  ensureNumber(req.standard_score, 'standard_score');
  if (req.age_months < 1 || req.age_months > 84) throw new ValidationError('age_months 1..84', 'age_months');

  let category;
  if (req.standard_score >= 85) category = 'within_normal_range';
  else if (req.standard_score >= 70) category = 'mild_delay_or_at_risk_monitor';
  else if (req.standard_score >= 55) category = 'moderate_delay_intervention';
  else category = 'severe_delay_comprehensive_intervention';
  return {
    age_months: req.age_months,
    domain: req.domain,
    standard_score: req.standard_score,
    category,
    citations: CITATIONS,
  };
}

function dystonia_class(req) {
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['primary','secondary_focal','generalized_drug_induced','task_specific','heredo_dopa_responsive']);
  ensureStr(req.distribution, 'distribution');
  ensureEnum(req.distribution, 'distribution', ['focal','segmental','hemidystonia','generalized','multifocal']);
  ensureNumber(req.temporal_pattern, 'temporal_pattern'); // 0 constant, 1 action, 2 nocturnal

  let approach;
  if (req.type === 'task_specific' || req.distribution === 'focal') approach = 'botulinum_toxin_and_task_oriented_training';
  else if (req.type === 'heredo_dopa_responsive') approach = 'trial_of_L_dopa_then_classify';
  else if (req.distribution === 'generalized') approach = 'DBS_candidate_multimodal_oral_therapy';
  else if (req.type === 'secondary_focal') approach = 'botulinum_toxin_aided_stretching';
  else approach = 'multimodal_oral_therapy_and_pt';
  return { type: req.type, distribution: req.distribution, approach, citations: CITATIONS };
}

function funcs() {
  return { gmfs_classification, gm_evaluation, cp_classification, neuro_dev_screening, dystonia_class };
}

module.exports = { funcs, CITATIONS, ValidationError };
