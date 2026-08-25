// filepath: tier5_rehab_ext_103_speech_swallow_engine.js
// TIER5_REHAB_EXT-103: Speech/swallow (dysphagia, aphasia, trach eval)
'use strict';

const CITATIONS = [
  'ASHA_Dysphagia_Diet_Services_2019',
  'Gugging_Swallowing_Screen_2017',
  'Boston_Diagnostic_Aphasia_Exam_BDAE',
  'Bogenhausen_Dysphagia_Score_BODS',
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

function dysphagia_screen(req) {
  ensureBool(req.drooling, 'drooling');
  ensureBool(req.dysphonia, 'dysphonia');
  ensureBool(req.sialorrhea_choking_past_4w, 'sialorrhea_choking_past_4w');
  ensureBool(req.weight_loss_unintended, 'weight_loss_unintended');
  ensureBool(req.throat_clearing_post_swallow, 'throat_clearing_post_swallow');
  ensureBool(req.cough_during_swallow, 'cough_during_swallow');
  ensureBool(req.delayed_swallow_trigger, 'delayed_swallow_trigger');
  ensureBool(req.dry_oral_cavity, 'dry_oral_cavity');

  const flags = [req.drooling, req.dysphonia, req.sialorrhea_choking_past_4w, req.weight_loss_unintended, req.throat_clearing_post_swallow, req.cough_during_swallow, req.delayed_swallow_trigger, req.dry_oral_cavity];
  const positives = flags.filter(Boolean).length;

  let risk;
  if (positives === 0) risk = 'no_screen_evidence_low_risk';
  else if (positives <= 2) risk = 'mild_clinical_watch_repeat';
  else if (positives <= 4) risk = 'moderate_full_swallow_study';
  else risk = 'high_full_swallow_study_npo_until_done';

  return { positives, risk, citations: CITATIONS };
}

function aspiration_risk(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.stroke_history, 'stroke_history');
  ensureBool(req.intubation, 'intubation');
  ensureBool(req.tracheostomy, 'tracheostomy');
  ensureStr(req.consciousness, 'consciousness');
  ensureEnum(req.consciousness, 'consciousness', ['alert','lethargic','confused','sedated','unresponsive']);

  let score = 0;
  if (req.age >= 70) score += 2;
  if (req.stroke_history) score += 3;
  if (req.intubation) score += 2;
  if (req.tracheostomy) score += 3;
  if (req.consciousness === 'confused' || req.consciousness === 'lethargic') score += 2;
  if (req.consciousness === 'sedated') score += 4;

  let risk;
  if (score >= 8) risk = 'high_refer_for_instrumental_eval';
  else if (score >= 5) risk = 'moderate_clinical_swallow_eval';
  else risk = 'low_continue_oral_intake_with_supervision';
  return { aspiration_risk_score: score, risk, citations: CITATIONS };
}

function diet_dysphagia(req) {
  ensureStr(req.dysphagia_severity, 'dysphagia_severity');
  ensureEnum(req.dysphagia_severity, 'dysphagia_severity', ['mild','moderate','severe','profound']);
  ensureStr(req.tongue_control, 'tongue_control');
  ensureEnum(req.tongue_control, 'tongue_control', ['adequate','inadequate','severely_impaired']);
  ensureBool(req.thin_liquid_tolerated, 'thin_liquid_tolerated');

  let diet;
  if (req.dysphagia_severity === 'mild' && req.thin_liquid_tolerated) diet = 'regular_with_thin_liquids';
  else if (req.dysphagia_severity === 'mild' && !req.thin_liquid_tolerated) diet = 'regular_with_nectar_thick';
  else if (req.dysphagia_severity === 'moderate' && req.thin_liquid_tolerated) diet = 'soft_mechanical_soft_with_thin_liquids';
  else if (req.dysphagia_severity === 'moderate' && !req.thin_liquid_tolerated) diet = 'mechanical_soft_with_nectar_thick';
  else if (req.dysphagia_severity === 'severe' && req.thin_liquid_tolerated) diet = 'pureed_with_thin_liquids';
  else if (req.dysphagia_severity === 'severe') diet = 'pureed_with_honey_thick';
  else diet = 'npo_enteral_feeding_tube_required';

  return {
    dysphagia_severity: req.dysphagia_severity,
    diet,
    fluid_consistency: req.thin_liquid_tolerated ? 'thin' : 'thick',
    enteral_required: req.dysphagia_severity === 'profound',
    citations: CITATIONS,
  };
}

function aphasia_stage(req) {
  ensureNumber(req.fluency_words_per_min, 'fluency_words_per_min');
  ensureNumber(req.comprehension_correct_5, 'comprehension_correct_5'); // out of 5 yes/no questions
  ensureNumber(req.repetition_intact_pct, 'repetition_intact_pct');
  ensureNumber(req.naming_pct, 'naming_pct');
  if (req.comprehension_correct_5 < 0 || req.comprehension_correct_5 > 5 || !Number.isInteger(req.comprehension_correct_5)) throw new ValidationError('comprehension_correct_5 0..5', 'comprehension_correct_5');
  if (req.repetition_intact_pct < 0 || req.repetition_intact_pct > 100) throw new ValidationError('repetition 0..100', 'repetition_intact_pct');

  const classification = req.repetition_intact_pct >= 70 && req.fluency_words_per_min >= 30 && req.naming_pct >= 50 ? 'fluent_anterior_neoclassical'
    : req.repetition_intact_pct < 30 ? 'non_fluent_anterior_classic'
    : 'posterior_receptive_wernicke';
  return {
    fluency_words_per_min: req.fluency_words_per_min,
    comprehension_5: req.comprehension_correct_5,
    repetition_pct: req.repetition_intact_pct,
    naming_pct: req.naming_pct,
    classification,
    citation: CITATIONS[2],
  };
}

function trach_swallow_eval(req) {
  ensureNumber(req.trach_size, 'trach_size'); // 6..10 cuffed
  ensureBool(req.cuff_inflated, 'cuff_inflated');
  ensureBool(req.passy_muir_occlusion, 'passy_muir_occlusion');
  ensureNumber(req.expiratory_strength_ml, 'expiratory_strength_ml');
  ensureNumber(req.saturation_during_swallow, 'saturation_during_swallow');

  const desat_drop = 100 - req.saturation_during_swallow;
  let decision;
  if (req.passy_muir_occlusion && !req.cuff_inflated && desat_drop < 4) decision = 'safe_to_offer_oral_with_pm_deflated';
  else if (req.cuff_inflated) decision = 'deflate_cuff_then_reassess';
  else if (!req.passy_muir_occlusion) decision = 'consider_passy_muir_occlusion';
  else decision = 'continue_npo_dysphagia_team_review';

  return {
    trach_size: req.trach_size,
    cuff_inflated: req.cuff_inflated,
    desat_drop_pct: desat_drop,
    expiratory_strength_ml: req.expiratory_strength_ml,
    decision,
    citations: CITATIONS,
  };
}

function funcs() {
  return { dysphagia_screen, aspiration_risk, diet_dysphagia, aphasia_stage, trach_swallow_eval };
}

module.exports = { funcs, CITATIONS, ValidationError };
