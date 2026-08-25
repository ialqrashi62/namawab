// filepath: tier5_rare_ext_102_iem_engine.js
// TIER5_RARE_EXT-102: IEM (NBS, amino acids, FAO, lysosomal, mitochondrial)
'use strict';

const CITATIONS = [
  'ACMG_NBS_2023',
  'Saudubray_IEM_Handbook_2018',
  'FDA_EMA_Lysosomal_Supplements',
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

function nbs_interpret(req) {
  ensureNumber(req.tsh, 'tsh');
  ensureNumber(req.g6pd, 'g6pd');
  ensureNumber(req.galactose, 'galactose');
  ensureNumber(req.phenylalanine, 'phenylalanine');
  ensureNumber(req.critical_threshold_phel, 'critical_threshold_phel');
  ensureNumber(req.critical_threshold_tsh, 'critical_threshold_tsh');
  ensureNumber(req.critical_threshold_g6pd, 'critical_threshold_g6pd');
  ensureNumber(req.critical_threshold_galactose, 'critical_threshold_galactose');

  const flags = [];
  if (req.phenylalanine > req.critical_threshold_phel) flags.push('phenylketonuria_possible');
  if (req.galactose > req.critical_threshold_galactose) flags.push('galactosemia_possible');
  if (req.g6pd < req.critical_threshold_g6pd) flags.push('g6pd_deficiency_possible');
  if (req.tsh > req.critical_threshold_tsh) flags.push('congenital_hypothyroidism_possible');

  return {
    flags: flags.length ? flags : ['none_within_thresholds'],
    citations: CITATIONS,
  };
}

function amino_acid_disorder(req) {
  ensureNumber(req.phe, 'phe');
  ensureNumber(req.met, 'met');
  ensureNumber(req.leu, 'leu');
  ensureNumber(req.age_years, 'age_years');
  if (req.age_years <= 0) throw new ValidationError('age_years>0', 'age_years');
  const phe_uM = req.phe / req.age_years;
  let action;
  if (req.phe > 360) action = 'PKU_classic_start_phe_restricted_diet_sap_supplements';
  else if (req.phe > 120) action = 'PKU_mild_or_hyperphe_treat_with_diet_re_evaluate_monthly';
  else action = 'observe_for_secondary_hyperphe_recheck_at_3_months';

  return { phe_umol_per_L: req.phe, action, citations: CITATIONS };
}

function fatty_acid_oxidation(req) {
  ensureNumber(req.fasting_hours, 'fasting_hours');
  ensureNumber(req.glc, 'glc');
  ensureNumber(req.fc, 'free_carnitine');
  ensureNumber(req.c0, 'c0_carnitine');
  ensureNumber(req.c8, 'c8_acylcarnitine');
  ensureNumber(req.c16_c, 'c16_carnitine');

  let diagnosis;
  if (req.c8 >= 0.5 && req.c0c8_ratio < 100) diagnosis = 'MCAD_consider_deficiency';
  else if (req.c16_c >= 1.4) diagnosis = 'CPT1_or_VLCAD_consider_deficiency';
  else if (req.fc < 15) diagnosis = 'primary_carnitine_deficiency_consider';
  else if (req.glc < 50 && req.fasting_hours >= 8) diagnosis = 'hypoketotic_hypoglycemia_screen_for_FAO_disorder';
  else diagnosis = 'no_clear_FAO_pattern_reassure_continue_obs';

  return { diagnosis, free_carnitine: req.fc, c0c8: req.c0 / req.c8, citations: CITATIONS };
}

function lysosomal_storage(req) {
  ensureStr(req.disease, 'disease');
  ensureEnum(req.disease, 'disease', ['gaucher','fabry','pompe','mps_1','mps_2','mps_4','mps_6','krabbe','npc1','cln2']);
  ensureNumber(req.dbs_activity_pct, 'dbs_activity_pct');
  ensureNumber(req.globotriaosyl, 'globotriaosyl_lyso_gb3');

  const action_map = {
    gaucher: 'enzyme_replacement_imiglucerase_or_substrate_reduction_eliglustat',
    fabry: 'enzyme_replacement_agalsidase_alpha_or_beta_add_ACEi_for_proteinuria',
    pompe: 'alglucosidase_alfa_with_immune_tolerance_protocol_if_LOPD',
    mps_1: 'enzyme_replacement_laronidase_bmt_for_severe_type',
    mps_2: 'enzyme_replacement_idursulfase',
    mps_4: 'enzyme_replacement_elosulfase_alfa',
    mps_6: 'enzyme_replacement_galsulfase',
    krabbe: 'consider_hematopoietic_stem_cell_transplant',
    npc1: 'substrate_reduction_miglustat',
    cln2: 'enzyme_replacement_cerliponase_alfa_intracerebroventricular',
  };
  return {
    disease: req.disease,
    therapy: action_map[req.disease],
    dbs_activity_pct: req.dbs_activity_pct,
    lyso_gb3_per_KH: req.globotriaosyl,
    citations: CITATIONS,
  };
}

function mitochondrial_screen(req) {
  ensureNumber(req.lactate, 'lactate');
  ensureNumber(req.pyruvate, 'pyruvate');
  ensureNumber(req.alanine, 'alanine');
  ensureNumber(req.ck, 'ck');
  ensureNumber(req.urine_orotic_acid, 'urine_orotic_acid');
  ensureBool(req.stroke_like_episodes, 'stroke_like_episodes');
  ensureBool(req.maternal_inheritance, 'maternal_inheritance');

  const ratio = req.lactate / Math.max(1, req.pyruvate);
  let classification;
  if (ratio > 20 && req.maternal_inheritance) classification = 'mitochondrial_encephalomyopathy_lactic_acidosis_stroke_consider_MELAS';
  else if (ratio > 20) classification = 'impaired_pyruvate_metabolism_review_mitochondrial_panel';
  else if (req.ck > 800) classification = 'myopathy_or_rhabdomyolysis_evaluate_CKMM_or_CPT2';
  else classification = 'no_clear_mitochondrial_sign_reassure_and_reassess_clinically';

  return {
    ratio_lactate_pyruvate: Math.round(ratio * 10) / 10,
    classification,
    mitral_inheritance: req.maternal_inheritance,
    stroke_like: req.stroke_like_episodes,
    citations: CITATIONS,
  };
}

function funcs() {
  return { nbs_interpret, amino_acid_disorder, fatty_acid_oxidation, lysosomal_storage, mitochondrial_screen };
}

module.exports = { funcs, CITATIONS, ValidationError };
