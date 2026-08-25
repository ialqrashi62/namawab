// filepath: tier5_rare_ext_105_immuno_engine.js
// TIER5_RARE_EXT-105: Primary immunodeficiency & autoinflammatory
'use strict';

const CITATIONS = [
  'IUIS_PID_Classification_2022',
  'Jeffrey_Modell_Foundation_2019',
  'Eurofever_Autoinflammatory_Classification',
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

function pid_screen_jeffrey(req) {
  ensureNumber(req.serious_bacterial_infections, 'serious_bacterial_infections');
  ensureNumber(req.igt_titer_loss, 'igt_titer_loss');
  ensureNumber(req.cbc_lymphopenia_or_neutropenia, 'cbc_lymphopenia_or_neutropenia');
  ensureNumber(req.failure_to_thrive, 'failure_to_thrive');
  ensureNumber(req.autoimmune_disorders, 'autoimmune_disorders');
  ensureNumber(req.unusual_organsim_sepsis, 'unusual_organsim_sepsis');
  ensureNumber(req.cellular_anaemia_under_2m, 'cellular_anaemia_under_2m');
  ensureBool(req.male_severe_recurrent_lymphoid_malignancy, 'male_severe_recurrent_lymphoid_malignancy');

  if (req.serious_bacterial_infections < 0 || req.serious_bacterial_infections > 5) throw new ValidationError('ser 0..5', 'serious_bacterial_infections');

  let action;
  let total = 0;
  total += req.serious_bacterial_infections === 0 ? 0 : 2;
  total += req.cbc_lymphopenia_or_neutropenia;
  total += req.failure_to_thrive;
  total += req.autoimmune_disorders;
  total += req.unusual_organsim_sepsis;
  total += req.cellular_anaemia_under_2m;
  if (req.male_severe_recurrent_lymphoid_malignancy) total += 1;

  if (total >= 10) action = 'urgent_refer_to_immunology_within_72_hours_for_pid_workup';
  else if (total >= 5) action = 'refer_to_immunology_for_PID_workup';
  else action = 'observe_revisit_if_recurrent_infections_or_other_clues';

  return { total, action, citation: CITATIONS[1] };
}

function prodigy_classification(req) {
  ensureNumber(req.lymphocyte_count, 'lymphocyte_count');
  ensureNumber(req.cbc_at_birth_lymphocyte_absolute, 'cbc_at_birth_lymphocyte_absolute');
  ensureNumber(req.immunoglobulin_panel_value_count, 'immunoglobulin_panel_value_count');
  ensureBool(req.consanguineous_parents, 'consanguineous_parents');
  ensureBool(req.thymic_shadow_absent, 'thymic_shadow_absent');

  if (req.lymphocyte_count < 5000 && (req.consanguineous_parents || req.thymic_shadow_absent)) {
    return { prodigy_band: 'complete_compatible_with_SCID_or_complete_DiGeorge', action: 'urgent_HSCT_evaluation_counsel_immunologist', citation: CITATIONS[0] };
  }
  if (req.immunoglobulin_panel_value_count < 3) return { prodigy_band: 'humoral_component_candidate_for_b_cell_pID', action: 'consider_IVIG_and_genetic_panel' };

  if (req.lymphocyte_count < 1000) return { prodigy_band: 'cell_mediated_partial_severe_combined', action: 'urgent_hsct_evaluation_or_thymus_transplant' };

  return { prodigy_band: 'low_priority_no_clear_pID_signature', action: 'observe_revisit_if_recurrent_infections' };
}

function autoinflammatory(req) {
  ensureStr(req.syndrome, 'syndrome');
  ensureEnum(req.syndrome, 'syndrome', ['cryopyrin_associated_periodic_syndrome_caps','fmifamilial_mediterranean_fever','tumor_necrosis_factor_receptor_associated_periodic_syndrome_traps','majeed_syndrome','blau_syndrome','deficiency_of_adenosine_deaminase_d2']);
  ensureBool(req.serum_amyloid_a_during_attack, 'serum_amyloid_a_during_attack');
  ensureBool(req.recurrent_fevers_or_sterile_inflammation_3_wks_in_2_weeks, 'recurrent_fevers_or_sterile_inflammation_3_wks_in_2_weeks');
  ensureNumber(req.flares_per_year, 'flares_per_year');

  let action;
  switch (req.syndrome) {
    case 'cryopyrin_associated_periodic_syndrome_caps':
      action = 'IL1_inhibition_anakinra_canakinumab_rilonacept_start_treat_pre_amyloidosis';
      break;
    case 'fmifamilial_mediterranean_fever':
      action = 'colchicine_oral_or_probenecid_and_IL1_block_when_colchicine_failure';
      break;
    case 'tumor_necrosis_factor_receptor_associated_periodic_syndrome_traps':
      action = 'etanercept_IL1_inhibitors_anti_TNF_evaluate_alternative';
      break;
    case 'majeed_syndrome':
      action = 'IL1_blockade_anakinra_cure_with_curcumin_review_bisphosphonates';
      break;
    case 'blau_syndrome':
      action = 'immunosuppression_thalidomide_then_TNF_block_or_IL1';
      break;
    case 'deficiency_of_adenosine_deaminase_d2':
      action = 'anti_TNF_high_dose_etancercept';
      break;
  }
  return { syndrome: req.syndrome, action, flares_per_year: req.flares_per_year, citations: CITATIONS };
}

function ige_hyper(req) {
  ensureNumber(req.ige, 'ige');
  ensureNumber(req.eosinophil_count, 'eosinophil_count');
  ensureNumber(req.abscess_count_cold_sterm, 'abscess_count_cold_sterm');
  ensureBool(req.liver_involvement, 'liver_involvement');
  ensureBool(req.pneumatocele_history, 'pneumatocele_history');

  if (req.ige > 2000) throw new ValidationError('ige 0..2000', 'ige');

  const score = (req.abscess_count_cold_sterm >= 1 ? 100 : 0) + (req.eosinophil_count >= 1500 ? 50 : 0) + (req.liver_involvement ? 50 : 0) + (req.pneumatocele_history ? 100 : 0);
  let diagnosis;
  if (req.ige >= 1000 && score >= 50) diagnosis = 'cj_pcid_ige_hyper_high';
  else if (req.ige >= 500) diagnosis = 'cj_pcid_ige_hyper_low';
  else diagnosis = 'no_cj_pcid_ige_hyper';

  return { ige: req.ige, eosinophil_count: req.eosinophil_count, score, diagnosis, citation: CITATIONS[1] };
}

function complement_deficiency(req) {
  ensureBool(req.recurrent_neisserial, 'recurrent_neisserial');
  ensureBool(req.family_history_early_complement, 'family_history_early_complement');
  ensureNumber(req.ch50, 'ch50');
  ensureNumber(req.ah50, 'ah50');
  ensureBool(req.sle_like_symptoms, 'sle_like_symptoms');

  if (req.ch50 === 0 && req.recurrent_neisserial) return { diagnosis: 'C1_inhibitor_or_early_complement_deficiency_eg_terminal_complement_C5_C6_C7_C8_C9', action: 'meningococcal_vaccine_ACWY_B', citation: CITATIONS[2] };
  if (req.ch50 === 0 && req.sle_like_symptoms) return { diagnosis: 'C1q_deficiency_evaluate', action: 'monitor' };
  if (req.ch50 < 40 && req.family_history_early_complement) return { diagnosis: 'partial_deficiency_review_c3_c4_levels', action: 'vaccinate_with_meningoccal' };
  if (req.ch50 >= 40 && req.ah50 >= 30) return { diagnosis: 'normal_complement_consider_other_pID' };
  return { diagnosis: 'no_clear_deficiency', action: 'observe_followup_3_months' };
}

function funcs() {
  return { pid_screen_jeffrey, prodigy_classification, autoinflammatory, ige_hyper, complement_deficiency };
}

module.exports = { funcs, CITATIONS, ValidationError };
