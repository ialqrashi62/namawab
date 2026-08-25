/**
 * TIER3_NEURO-304 Movement Disorders Engine
 * UPDRS Parkinson staging + tremor classification + dystonia workup + DBS candidate + ataxia
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { MDS_UPDRS: 'MDS-UPDRS 2008', AAN_PD: 'AAN Parkinson 2024', AAN_TREMOR: 'AAN Tremor 2024' };

function updrsClassification(input) {
  const { bradykinesia, rigidity, resting_tremor, postural_instability, hoehn_yahr_stage } = input;
  const cardinal = [bradykinesia, rigidity, resting_tremor, postural_instability].filter(Boolean).length;
  const pd_likely = cardinal >= 2 && bradykinesia && (resting_tremor || rigidity);
  return {
    parkinsons_diagnosed: pd_likely,
    cardinal_signs_count: cardinal,
    hoehn_yahr_stage: hoehn_yahr_stage || 1,
    hy_stage: hoehn_yahr_stage || 1,
    treatment_initiation: pd_likely ? 'consider_dopamine_agonist_OR_levodopa_based_on_age' : 'consider_secondary_parkinsonism_workup',
    citation: CITATIONS.MDS_UPDRS,
  };
}

function tremorClassification(input) {
  const { type, frequency_hz, action_context, asymmetry, family_history } = input;
  let diagnosis = 'unclassified';
  if (type === 'resting' && frequency_hz >= 4 && frequency_hz <= 6 && action_context === 'at_rest') diagnosis = 'parkinsonian_resting_tremor';
  else if (type === 'postural' && frequency_hz >= 4 && frequency_hz <= 12 && family_history) diagnosis = 'essential_tremor';
  else if (type === 'intention' && frequency_hz >= 3 && frequency_hz <= 5) diagnosis = 'cerebellar_tremor';
  else if (type === 'task_specific' && action_context === 'writing') diagnosis = 'task_specific_essential_hand_tremor';
  return { diagnosis, asymmetric: asymmetry, workup: ['thyroid_function', 'electrolytes', 'liver_function', 'MRI_brain_if_cerebellar_signs'] };
}

function dystoniaWorkup(input) {
  const { age_of_onset, body_distribution, task_specific, secondary_triggers, family_history } = input;
  let classification = 'unclassified';
  if (age_of_onset < 26 && task_specific) classification = 'early_onset_task_specific_dystonia';
  else if (body_distribution === 'generalized' && secondary_triggers) classification = 'secondary_dystonia_workup_required';
  else if (body_distribution === 'focal' && !task_specific) classification = 'adult_focal_dystonia';
  return {
    classification,
    genetic_testing: age_of_onset < 26 && family_history ? 'DYT1_AND_OTHER_GENES' : 'not_typically_recommended',
    mri_brain: secondary_triggers ? 'mri_brain_required' : 'not_required',
    botulinum_toxin_indicated: body_distribution === 'focal' || task_specific,
    deep_brain_stimulation: body_distribution === 'generalized' && age_of_onset < 50,
  };
}

function dbsCandidate(input) {
  const { diagnosis, motor_response_to_meds, cognitive_status, age, motor_complications, psychiatric_comorbidities } = input;
  let candidate = false;
  if (diagnosis === 'parkinsons' && motor_response_to_meds === 'good_response_on' && cognitive_status === 'normal' && psychiatric_comorbidities === 'none') candidate = true;
  return {
    candidate,
    target_nucleus: diagnosis === 'parkinsons' ? 'STN_or_GPi' : diagnosis === 'dystonia' ? 'GPi' : diagnosis === 'essential_tremor' ? 'VIM_thalamus' : 'not_applicable',
    contraindications: psychiatric_comorbidities === 'severe' || cognitive_status === 'dementia',
    timing: motor_complications === 'motor_fluctuations_or_dyskinesias' ? 'early_dbs_better_outcomes' : 'medication_optimization_first',
    citation: CITATIONS.AAN_PD,
  };
}

function ataxiaClassification(input) {
  const { onset_acute, family_history, cerebellar_signs, sensory_deficit, drug_history, alcohol_use } = input;
  let diagnosis = 'unclassified';
  if (onset_acute) diagnosis = 'acute_cerebellar_or_stroke';
  else if (family_history && onset_acute === false) diagnosis = 'friedreich_ataxia_or_SCA';
  else if (alcohol_use === 'heavy') diagnosis = 'alcoholic_cerebellar_degeneration';
  else if (drug_history === 'phenytoin_or_chemotherapy') diagnosis = 'toxic_cerebellar_damage';
  else if (cerebellar_signs && sensory_deficit) diagnosis = 'sensory_ataxia_peripheral_neuropathy';
  return { diagnosis, workup: ['MRI_brain', 'vitamin_B12', 'thiamine', 'thyroid', 'anti_GAD', 'genetic_panel_if_young'] };
}

module.exports = { updrsClassification, tremorClassification, dystoniaWorkup, dbsCandidate, ataxiaClassification, CITATIONS, ValidationError };