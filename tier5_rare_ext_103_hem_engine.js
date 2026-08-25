// filepath: tier5_rare_ext_103_hem_engine.js
// TIER5_RARE_EXT-103: Rare hem (sickle, thalassemia, ITP, TTP, vWD)
'use strict';

const CITATIONS = [
  'ASH_Sickle_Cell_2020',
  'THALASSA_Transfusion_2021',
  'ASH_ITP_2019',
  'ISTH_TTP_2017',
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
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function sickle_assess(req) {
  ensureStr(req.genotype, 'genotype');
  ensureEnum(req.genotype, 'genotype', ['ss','sb0','sb_plus','sc','sheterozygous']);
  ensureNumber(req.hb, 'hb');
  ensureNumber(req.hbf_percent, 'hbf_percent');
  ensureNumber(req.pain_crises_last_12m, 'pain_crises_last_12m');
  ensureBool(req.hydroxyurea, 'hydroxyurea');

  let tier;
  let action;
  if (req.genotype === 'ss' || req.genotype === 'sb0') {
    tier = 'high_severity_use_hydroxyurea_or_chronic_transfusion';
    action = req.hydroxyurea ? 'continue_hydroxyurea_aim_hbf_30_percent' : 'start_hydroxyurea_with_dose_15mg_kg_target_30mg_kg';
  } else if (req.genotype === 'sb_plus') {
    tier = 'moderate_hydroxyurea_or_occasional_transfusion';
    action = 'continue_hydroxyurea_consider_voxeletor_or_crizanlizumab_if_vaso_occlusive_crisises_persist';
  } else if (req.genotype === 'sc') {
    tier = 'low_to_moderate_manage_symptomatically';
    action = 'watch_educate_continue_folate_imaging_if_arthropathy_or_retinopathy';
  } else {
    tier = 'carrier_sickle_cell_trait';
    action = 'genetic_counseling_no_treatment_required';
  }
  return {
    genotype: req.genotype,
    severity_tier: tier,
    action,
    hbf_percent: req.hbf_percent,
    pain_crises_last_12m: req.pain_crises_last_12m,
    citations: CITATIONS,
  };
}

function thalassemia(req) {
  ensureStr(req.genotype, 'genotype');
  ensureEnum(req.genotype, 'genotype', ['beta_major','beta_intermedia','beta_minor','alpha_trait','hemh_constant_bart','hemh_constat_2X_gene_del']);
  ensureNumber(req.hb_pre_transfusion, 'hb_pre_transfusion');
  ensureNumber(req.ferritin, 'ferritin');
  ensureNumber(req.age_years, 'age_years');

  let transfusion_strategy;
  let chelation;
  if (req.genotype === 'beta_major') {
    transfusion_strategy = 'chronic_transfusion_target_pre_Hb_9_10_g_dL_every_2_to_4_weeks';
    chelation = req.ferritin >= 1000 ? 'intensive_iron_chelation_through_subq_deferasirox_or_similar_target_ferritin_500_to_1500' : 'monitor_iron_only';
  } else if (req.genotype === 'beta_intermedia') {
    transfusion_strategy = 'intermittent_transfusion_plus_hydroxyurea_to_boost_hbf';
    chelation = req.ferritin >= 800 ? 'consider_chelation_maintain_ferritin_in_target' : 'monitor_only';
  } else if (req.genotype === 'beta_minor') {
    transfusion_strategy = 'no_transfusion_required';
    chelation = 'not_needed';
  } else if (req.genotype === 'alpha_trait') {
    transfusion_strategy = 'no_transfusion_needed';
    chelation = 'not_needed';
  } else {
    transfusion_strategy = 'consider_chronic_transfusion_and_chelation_for_manage_hemoglobin_h_disease';
    chelation = 'monitor_iron_overload_if_chronic_transfusion_required';
  }
  return {
    genotype: req.genotype,
    transfusion_strategy,
    chelation,
    baseline_hb_pre: req.hb_pre_transfusion,
    current_ferritin: req.ferritin,
    citations: CITATIONS,
  };
}

function itp_management(req) {
  ensureNumber(req.platelet_count, 'platelet_count');
  ensureNumber(req.bleeding_grade_watanabe, 'bleeding_grade_watanabe'); // 0..4
  ensureBool(req.infrequent_bleeding, 'infrequent_bleeding');
  ensureBool(req.chronic_over_one_year, 'chronic_over_one_year');
  ensureNumber(req.first_line_response, 'first_line_response'); // 0..2

  let action;
  if (req.platelet_count < 20000 || req.bleeding_grade_watanabe >= 2) action = 'urgent_immunosuppression_ivig_dexamethasone';
  else if (req.platelet_count >= 20000 && req.platelet_count < 30000 && req.bleeding_grade_watanabe === 1) action = 'treat_with_ivig_dexamethasone';
  else if (req.bleeding_grade_watanabe === 0 && req.platelet_count >= 30000) action = 'observation_only_avoid_nsaids';
  else if (req.chronic_over_one_year) action = 'thrombopoietin_receptor_agonist_eltrombopag_or_rituximab_if_relapse_after_steroid';
  else action = 'repeat_first_line_then_consider_tpo_ra_or_rituximab';

  return {
    platelet_count: req.platelet_count,
    bleeding_grade: req.bleeding_grade_watanabe,
    chronic: req.chronic_over_one_year,
    action,
    citation: CITATIONS[2],
  };
}

function ttp_screen(req) {
  ensureNumber(req.platelet_count, 'platelet_count');
  ensureNumber(req.schistocyte_pct, 'schistocyte_pct');
  ensureNumber(req.schistocyte_pct_threshold, 'schistocyte_pct_threshold');
  ensureNumber(req.adams_diff_score, 'adams_diff_score');
  ensureNumber(req.bilirubin, 'bilirubin');
  ensureNumber(req.adamts13_activity, 'adamts13_activity');
  if (req.adamts13_activity < 0 || req.adamts13_activity > 100) throw new ValidationError('adamts13 0..100', 'adamts13_activity');

  let verdict;
  if (req.adamts13_activity < 10 && req.schistocyte_pct >= req.schistocyte_pct_threshold) verdict = 'definitive_TTP_begin_plasma_exchange_rituximab_caplacizumab';
  else if (req.adamts13_activity < 20) verdict = 'TTP_highly_likely_start_empirical_pEx_r';
  else if (req.adamts13_activity < 30 && req.schistocyte_pct < req.schistocyte_pct_threshold) verdict = 'TTP_less_likely_consider_other_TMA_differential_HUS_DIC';
  else verdict = 'TTP_unlikely_differential_review_recheck_24h';

  return {
    adamts13_activity: req.adamts13_activity,
    schistocyte_pct: req.schistocyte_pct,
    adams_score: req.adams_diff_score,
    bilirubin: req.bilirubin,
    verdict,
    citation: CITATIONS[3],
  };
}

function von_willebrand(req) {
  ensureNumber(req.vwf_ag, 'vwf_ag');
  ensureNumber(req.ristocetin_cofactor, 'ristocetin_cofactor');
  ensureNumber(req.fviii, 'fviii');
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['1','2a','2b','2m','2n','3','platelet']);

  let diagnosis;
  if (req.type === '1') diagnosis = 'vWD_type1_partial_quantitative_deficiency';
  else if (req.type === '2a') diagnosis = 'vWD_qualitative_dynamic_dysfunction_decreased_VWF_GPIb_binding';
  else if (req.type === '2b') diagnosis = 'vWD_qualitative_affinity_mutation_increased_binding';
  else if (req.type === '2m') diagnosis = 'vWD_qualitative_defect_collagen_binding';
  else if (req.type === '2n') diagnosis = 'vWD_qualitative_FVIII_binding_defect';
  else if (req.type === '3') diagnosis = 'vWD_severe_total_deficiency';
  else diagnosis = 'vWD_like_disorder_with_platelet_or_other_defect';

  return { type: req.type, diagnosis, vwf_ag: req.vwf_ag, ristocetin_pct: req.ristocetin_cofactor, fviii: req.fviii };
}

function funcs() {
  return { sickle_assess, thalassemia, itp_management, ttp_screen, von_willebrand };
}

module.exports = { funcs, CITATIONS, ValidationError };
