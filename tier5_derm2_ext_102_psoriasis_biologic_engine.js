// filepath: tier5_derm2_ext_102_psoriasis_biologic_engine.js
// TIER5_DERM2_EXT-102: Psoriasis biologics selection, PASI, screening, switch, monitoring
'use strict';

const CITATIONS = [
  'AAD_Psoriasis_Guideline_2019',
  'PASI_Consensus_2017',
  'AAD_NPF_Biologics_2020',
  'Bachelez_Safety_IL23_2021',
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

function pasi_calc(req) {
  const areas = ['head','trunk','upper_limbs','lower_limbs'];
  const items = ['erythema','induration','desquamation'];
  for (const a of areas) for (const i of items) {
    const v = req[`${a}_${i}`];
    if (!Number.isInteger(v) || v < 0 || v > 4) throw new ValidationError(`${a}_${i} 0..4`, `${a}_${i}`);
  }
  const area_score = [];
  for (const a of areas) {
    if (!Number.isInteger(req[`${a}_area`]) || req[`${a}_area`] < 0 || req[`${a}_area`] > 6) throw new ValidationError(`${a}_area 0..6`, `${a}_area`);
    area_score.push({ name: a, area: req[`${a}_area`] });
  }

  const weights = { head: 0.1, trunk: 0.3, upper_limbs: 0.2, lower_limbs: 0.4 };
  let total = 0;
  for (const a of area_score) {
    const score = (a.area / 6) * (req[`${a.name}_erythema`] + req[`${a.name}_induration`] + req[`${a.name}_desquamation`]);
    total += score * weights[a.name];
  }
  let severity;
  if (total <= 5) severity = 'mild_pasi';
  else if (total <= 10) severity = 'moderate_pasi';
  else if (total <= 20) severity = 'severe_pasi';
  else severity = 'very_severe_pasi';

  return { pasi_total: Math.round(total * 10) / 10, severity, citation: CITATIONS[1] };
}

function biologic_selection(req) {
  ensureNumber(req.pasi, 'pasi');
  ensureBool(req.psoriatic_arthritis, 'psoriatic_arthritis');
  ensureBool(req.tnf_alpha_inhibitor_naive, 'tnf_alpha_inhibitor_naive');
  ensureBool(req.crohn_or_ulcerative_colitis, 'crohn_or_ulcerative_colitis');
  ensureNumber(req.screening_tb_quantiFERON_positive, 'screening_tb_quantiFERON_positive'); // 0..1
  ensureNumber(req.screening_hepatitis_b_positive, 'screening_hepatitis_b_positive');

  if (req.screening_tb_quantiFERON_positive || req.screening_hepatitis_b_positive) {
    return {
      selection: 'hold_for_tb_or_hepatitis_evaluation_start_topical_then_systemic_review',
      citation: CITATIONS[0],
    };
  }
  if (req.pasi >= 12 && req.psoriatic_arthritis) return { selection: 'TNF_inhibitor_adalimumab_or_etancercept_or_IL17_ixekizumab_or_IL23_risankizumab', citation: CITATIONS[0] };
  if (req.pasi >= 12 && req.crohn_or_ulcerative_colitis) return { selection: 'ustekinumab_IL12_23_ibd_friendly_or_tnf_inhibitor' };
  if (req.pasi >= 12 && req.tnf_alpha_inhibitor_naive) return { selection: 'IL23_p19_risankizumab_guselkumab_or_tildrakizumab_or_IL17_uch_as_first_choice_due_to_speed' };
  if (req.pasi >= 12) return { selection: 'consider_secondary_failure_then_assess_antibody_levels' };
  return { selection: 'topical_or_PUVA_or_apremilast' };
}

function biologic_screening(req) {
  ensureNumber(req.ppd_or_quantiFERON_titer, 'ppd_or_quantiFERON_titer');
  ensureNumber(req.hbsag_hbcab_total, 'hbsag_hbcab_total');
  ensureBool(req.chronic_concurrent_infection, 'chronic_concurrent_infection');
  ensureNumber(req.nyha_functional_class, 'nyha_functional_class'); // 0..4

  if (req.hbsag_hbcab_total === 1) return { verdict: 'high_risk_biologic_hbv_reactivation_consult_hepatology_start_anti_viral' };
  if (req.ppd_or_quantiFERON_titer === 1 || req.nyha_functional_class >= 3) return { verdict: 'caution_consult_specialty_before_biologic_initiation' };
  if (req.chronic_concurrent_infection) return { verdict: 'biologic_relative_contra_clear_infection_first' };
  return { verdict: 'biologic_eligible' };
}

function switch_biologic(req) {
  ensureStr(req.current_biologic, 'current_biologic');
  ensureEnum(req.current_biologic, 'current_biologic', ['adalimumab','etanercept','inflximab','ustekinumab','secukinumab','ixekizumab','brodalumab','risankizumab','guselkumab','tildrakizumab','apremilast']);
  ensureNumber(req.weeks_to_loss_of_response, 'weeks_to_loss_of_response');
  ensureNumber(req.baseline_pasi, 'baseline_pasi');
  ensureNumber(req.current_pasi, 'current_pasi');

  const pasi_delta = req.current_pasi - req.baseline_pasi;
  let recommendation;
  if (pasi_delta >= req.baseline_pasi * 0.5 && req.weeks_to_loss_of_response > 16) recommendation = 'switch_within_class_or_to_different_class';
  else if (req.weeks_to_loss_of_response <= 12) recommendation = 'verify_adherence_then_add_methotrexate_or_switch';
  else if (pasi_delta <= 0) recommendation = 'continue_then_assess_in_8_weeks';
  else recommendation = 'continue_assessment_then_review';

  const alternative_options = {
    'adalimumab': 'ustekinumab_or_IL17',
    'etanercept': 'IL17_or_IL23',
    'inflximab': 'ustekinumab_or_risankizumab',
    'ustekinumab': 'IL17_or_IL23',
    'secukinumab': 'IL23',
    'ixekizumab': 'IL23',
    'brodalumab': 'IL23',
    'risankizumab': 'IL17',
    'guselkumab': 'IL17',
    'tildrakizumab': 'IL17',
    'apremilast': 'biologic_if_no_response',
  };
  return { current_biologic: req.current_biologic, recommendation, alternative_options: alternative_options[req.current_biologic] };
}

function monitoring(req) {
  ensureNumber(req.weeks_on_biologic, 'weeks_on_biologic');
  ensureNumber(req.current_pasi, 'current_pasi');
  ensureNumber(req.tuberculosis_quantiFERON_re, 'tuberculosis_quantiFERON_re');
  ensureNumber(req.alt, 'alt');
  ensureBool(req.infection_any, 'infection_any');

  let recommendation;
  if (req.infection_any || req.alt >= 100) recommendation = 'hold_dose_consult_specialty';
  else if (req.tuberculosis_quantiFERON_re) recommendation = 'hold_dose_pursue_tb_treatment';
  else if (req.current_pasi < 1.0) recommendation = 'maintenance_reassess_every_6_months';
  else if (req.current_pasi > 5) recommendation = 'consider_step_up_add_or_switch';
  else recommendation = 'maintain_assessment_every_3_months';
  return { weeks_on_biologic: req.weeks_on_biologic, recommendation, current_pasi: req.current_pasi };
}

function funcs() {
  return { pasi_calc, biologic_selection, biologic_screening, switch_biologic, monitoring };
}

module.exports = { funcs, CITATIONS, ValidationError };
