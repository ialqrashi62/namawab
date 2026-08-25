// filepath: tier5_derm2_ext_103_eczema_engine.js
// TIER5_DERM2_EXT-103: Eczema dermatitis (SCORAD, atopic severity, dupilumab, contact)
'use strict';

const CITATIONS = [
  'SCORAD_Consensus_1993',
  'AAAAI_Atopic_Derm_2023',
  'Dupilumab_LIBERTY_2022',
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

function scrorad(req) {
  ensureNumber(req.a_extent_pct, 'a_extent_pct'); // 0..100
  ensureNumber(req.b_erythema_avg, 'b_erythema_avg'); // 0..3
  ensureNumber(req.b_edema_avg, 'b_edema_avg'); // 0..3
  ensureNumber(req.b_excoriation_avg, 'b_excoriation_avg'); // 0..3
  ensureNumber(req.b_dryness_avg, 'b_dryness_avg'); // 0..3
  ensureNumber(req.c_itch_avg_pct, 'c_itch_avg_pct'); // 0..10
  ensureNumber(req.c_sleep_loss_avg_pct, 'c_sleep_loss_avg_pct');

  if (req.a_extent_pct < 0 || req.a_extent_pct > 100) throw new ValidationError('a 0..100', 'a_extent_pct');

  const a = Math.min(40, req.a_extent_pct * 0.4);
  const b = (req.b_erythema_avg + req.b_edema_avg + req.b_excoriation_avg + req.b_dryness_avg);
  const c = (req.c_itch_avg_pct + req.c_sleep_loss_avg_pct);
  const total = a + b + c;

  let severity;
  if (total < 25) severity = 'mild';
  else if (total < 50) severity = 'moderate';
  else severity = 'severe';

  return {
    scrorad: Math.round(total * 10) / 10,
    severity,
    a: Math.round(a * 10) / 10,
    b: Math.round(b * 10) / 10,
    c: Math.round(c * 10) / 10,
    citation: CITATIONS[0],
  };
}

function atopic_severity(req) {
  ensureNumber(req.iga_severity, 'iga_severity'); // 0..4
  ensureNumber(req.easi_total, 'easi_total');
  ensureNumber(req.dlqi, 'dlqi');
  ensureNumber(req.tcq, 'tcq'); // topical compliance questionnaire
  ensureStr(req.area_affected_pct, 'area_affected_pct'); // string from enum
  ensureEnum(req.area_affected_pct, 'area_affected_pct', ['minimal','partial','large','extensive']);

  if (req.iga_severity < 0 || req.iga_severity > 4) throw new ValidationError('iga_severity 0..4', 'iga_severity');

  let tier;
  let approach;
  let affected_bsa_pct = 0;
  if (req.area_affected_pct === 'minimal') affected_bsa_pct = 5;
  else if (req.area_affected_pct === 'partial') affected_bsa_pct = 20;
  else if (req.area_affected_pct === 'large') affected_bsa_pct = 50;
  else if (req.area_affected_pct === 'extensive') affected_bsa_pct = 80;
  else affected_bsa_pct = 0;
  if (affected_bsa_pct === 0) throw new ValidationError('affected_bsa must be number', 'area_affected_pct');

  if (req.iga_severity >= 3 && req.tcq >= 80) tier = 'mild_recalcitrant';
  else if (req.iga_severity >= 3) tier = 'severe_candidate_for_systemic';

  if (req.iga_severity >= 3 && req.tcq < 80) approach = 'reinforce_topical_education_recheck_in_2_weeks';
  else if (req.iga_severity >= 3) approach = 'consider_dupilumab_or_tralokinumab';
  else if (req.iga_severity >= 2) approach = 'topical_JAK_inhibitor_or_topical_pde4_or_phototherapy';
  else approach = 'topical_steroids_and_moisturizer';

  return { iga_severity: req.iga_severity, easi_total: req.easi_total, dlqi: req.dlqi, tier, approach, citation: CITATIONS[1] };
}

function dupilumab(req) {
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.iga_baseline, 'iga_baseline');
  ensureNumber(req.prior_topical_compliance_pct, 'prior_topical_compliance_pct');
  ensureBool(req.history_conjunctivitis_with_dupilumab, 'history_conjunctivitis_with_dupilumab');

  if (req.weight_kg < 0) throw new ValidationError('weight_kg>=0', 'weight_kg');

  const loading_dose_mg = req.weight_kg >= 60 ? 600 : 400;
  const maintenance_dose_mg_2weeks = req.weight_kg >= 60 ? 300 : 200;

  return {
    loading_dose_mg,
    maintenance_dose_q2w_mg: maintenance_dose_mg_2weeks,
    monitor: ['iga_easi_score','eosinophils_after_4_weeks','signs_conjunctivitis'] ,
    contraindicated_due_to_history_conjunctivitis: req.history_conjunctivitis_with_dupilumab,
    citation: CITATIONS[2],
  };
}

function contact_dermatitis(req) {
  ensureStr(req.product_category, 'product_category');
  ensureEnum(req.product_category, 'product_category', ['cosmetics','cleanser','fragrance','preservative','metal_jewelry','topical_med','rubber_or_gloves','plant_or_natural']);
  ensureNumber(req.days_since_exposure, 'days_since_exposure');
  ensureNumber(req.prior_history_atopy, 'prior_history_atopy');
  ensureBool(req.consistent_after_re_exposure, 'consistent_after_re_exposure');

  let triage;
  if (req.days_since_exposure <= 7 && req.consistent_after_re_exposure) triage = 'likely_contact_dermatitis_remove_offending_agent_then_patch_test';
  else if (req.prior_history_atopy) triage = 'atopic_hand_or_lip_dermatitis_topical_steroid_class_vii_consider_occlusive_wet_wrap';
  else triage = 'uncertain_review_differential';

  return { product_category: req.product_category, triage, citations: CITATIONS };
}

function moisturize_protocol(req) {
  ensureNumber(req.bathing_per_week, 'bathing_per_week');
  ensureNumber(req.emollient_application_per_day, 'emollient_application_per_day');
  ensureNumber(req.soap_use_per_bath, 'soap_use_per_bath');
  ensureBool(req.use_soap_in_groin_or_axilla_only, 'use_soap_in_groin_or_axilla_only');

  let score = 0;
  if (req.bathing_per_week <= 7 && req.bathing_per_week >= 4) score += 1;
  if (req.emollient_application_per_day >= 2) score += 1;
  if (req.use_soap_in_groin_or_axilla_only) score += 1;
  if (req.soap_use_per_bath <= 1) score += 1;

  return {
    score,
    adherence_score_band: score === 4 ? 'optimal_self_care' : score >= 3 ? 'good_with_room' : 'review_basics_5_minute_lecture_then_re_check',
  };
}

function funcs() {
  return { scrorad, atopic_severity, dupilumab, contact_dermatitis, moisturize_protocol };
}

module.exports = { funcs, CITATIONS, ValidationError };
