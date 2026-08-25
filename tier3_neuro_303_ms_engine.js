/**
 * TIER3_NEURO-303 Multiple Sclerosis Engine
 * MS phenotype + EDSS + relapse treatment + DMT selection + monitoring protocol (NEDA)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { LUBLIN_2014: 'Lublin 2014 Phenotypes', MAGNIMS: 'MAGNIMS 2016', AAN_DMT: 'AAN DMT 2024' };

function msPhenotype(input) {
  const { relapses_count, year_with_progression, brain_mri_lesions_active, spinal_mri_lesions } = input;
  const active = relapses_count >= 2 && year_with_progression === false;
  const progressive = year_with_progression === true;
  let phenotype = 'CIS_clinically_isolated_syndrome';
  if (relapses_count >= 2 && !progressive) phenotype = 'RRMS_relapsing_remitting';
  else if (active && progressive) phenotype = 'PRMS_progressive_relapsing';
  else if (progressive && relapses_count === 0) phenotype = 'PPMS_primary_progressive';
  else if (progressive && relapses_count >= 1) phenotype = 'SPMS_secondary_progressive';
  return { phenotype, active, progressive, citation: CITATIONS.LUBLIN_2014 };
}

function edssScore(input) {
  const { walk_distance_meters, assistance, pyramidal, cerebellar, brainstem, sensory, bowel_bladder, visual, cerebral, ambulation_score } = input;
  const fs = { pyramidal, cerebellar, brainstem, sensory, bowel_bladder, visual, cerebral };
  let max_fs = 0;
  for (const k of Object.keys(fs)) if (typeof fs[k] === 'number' && fs[k] > max_fs) max_fs = fs[k];
  const ambulation = ambulation_score || (walk_distance_meters >= 500 ? 0 : assistance === 'unilateral' ? 6 : assistance === 'bilateral' ? 6.5 : 7);
  const edss = max_fs >= 6 ? ambulation : max_fs + (ambulation >= 6 ? 0.5 : 0);
  return { edss: Math.round(edss * 10) / 10, functional_systems: fs, ambulation_score: ambulation, citation: CITATIONS.MAGNIMS };
}

function relapseTreatment(input) {
  const { relapse_severity, edss_change, brain_stem_involvement, relapse_in_pregnancy } = input;
  const treatment = ['methylprednisolone_1g_IV_daily_3_5_days'];
  if (relapse_severity === 'severe' && edss_change >= 2) treatment.push('consider_plasmapheresis_if_no_response');
  if (brain_stem_involvement) treatment.push('urgent_imaging_within_24h');
  if (relapse_in_pregnancy) treatment[0] = 'methylprednisolone_1g_IV_daily_5_days (safe_in_pregnancy)';
  return { treatment, steroid_alternative: relapse_in_pregnancy ? 'safe_IVMP' : 'plasma_exchange' };
}

function dmtSelection(input) {
  const { phenotype, edss, age, childbearing_age, jc_virus_positive, severity } = input;
  const efficacy = ['interferon-beta', 'glatiramer', 'teriflunomide', 'dimethyl-fumarate'];
  const high_efficacy = ['natalizumab', 'ocrelizumab', 'fingolimod', 'siponimod', 'cladribine', 'alemtuzumab'];
  let first_line = [];
  if (severity === 'highly_active') first_line = high_efficacy;
  else if (jc_virus_positive === 'positive') first_line = ['ocrelizumab'];
  else first_line = efficacy;
  if (childbearing_age === 'female') first_line = first_line.filter(d => !['fingolimod', 'teriflunomide', 'cladribine'].includes(d));
  return { first_line, escalation: ['start_efficacy_low_then_escalate_if_breakt'], induction: ['alemtuzumab_or_cladribine'], citation: CITATIONS.AAN_DMT };
}

function monitoringProtocol(input) {
  const { on_dmt } = input;
  const monitoring = {
    'interferon-beta': ['CBC_LFTs_Q3M', 'MRI_yearly', 'EDSS_6mo'],
    'glatiramer': ['MRI_yearly', 'EDSS_6mo', 'injection_site_reactions'],
    'natalizumab': ['JCV_stratification_Q6M', 'MRI_Q6M', 'PML_risk_assessment', 'liver_function'],
    'ocrelizumab': ['IgG_levels_6mo', 'CBC_6mo', 'MRI_yearly', 'vaccination_completion_pre_infusion'],
    'fingolimod': ['EKG_baseline_Q6M', 'OCT_eye_baseline', 'CBC_LFTs_Q3M', 'varicella_zoster_serology'],
  };
  return { dmt: on_dmt, monitoring: monitoring[on_dmt] || 'no_dmt_monitoring_refer_to_neurologist', neda_criteria: 'no_relapse_no_progression_no_MRI_activity' };
}

module.exports = { msPhenotype, edssScore, relapseTreatment, dmtSelection, monitoringProtocol, CITATIONS, ValidationError };