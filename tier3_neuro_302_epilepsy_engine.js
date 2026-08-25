/**
 * TIER3_NEURO-302 Epilepsy Engine
 * ILAE 2017 classification + seizure type + AED selection + status epilepticus + driving + pregnancy
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ILAE_2017: 'ILAE Classification 2017', AES: 'AES Guideline 2024', NES: 'Neurocritical Care Society Status Epilepticus 2024' };

function seizureClassification(input) {
  const { onset, awareness, motor, autonomic } = input;
  let type = 'unclassified';
  if (onset === 'focal') {
    if (awareness === 'preserved') type = 'focal_aware';
    else if (awareness === 'impaired') type = 'focal_impaired_awareness';
    if (motor === 'bilateral_tonic_clonic') type = 'focal_to_bilateral_tonic_clonic';
  } else if (onset === 'generalized') {
    if (motor === 'tonic_clonic') type = 'generalized_tonic_clonic';
    else if (motor === 'absence') type = 'absence';
    else if (motor === 'myoclonic') type = 'myoclonic';
    else if (motor === 'atonic') type = 'atonic';
  }
  if (autonomic) type += '_with_autonomic';
  return { type, citation: CITATIONS.ILAE_2017 };
}

function aedSelection(input) {
  const { seizure_type, age, gender, comorbidities, on_contraception, pregnancy } = input;
  const firstLine = {
    generalized_tonic_clonic: 'valproate (avoid if pregnancy)',
    absence: 'ethosuximide OR valproate',
    myoclonic: 'valproate',
    focal_aware: 'lamotrigine OR levetiracetam',
    focal_impaired_awareness: 'lamotrigine OR levetiracetam',
  };
  let aed = firstLine[seizure_type] || 'levetiracetam_first_line_safe';
  if (pregnancy) aed = 'levetiracetam OR lamotrigine (avoid valproate)';
  if (comorbidities === 'renal_impairment') aed = 'lamotrigine_preferred (not levetiracetam)';
  if (on_contraception && (aed === 'lamotrigine' || aed === 'valproate (avoid if pregnancy)')) aed += '_monitor_interaction';
  return { aed, monitoring: ['baseline_LFTs', 'baseline_CBC', 'drug_level_after_2_weeks'] };
}

function statusEpilepticus(input) {
  const { minutes_in_seizure, refractory } = input;
  let stage = 'not_in_status';
  if (minutes_in_seizure >= 30) stage = 'refractory_status_epilepticus';
  else if (minutes_in_seizure >= 10) stage = 'established_status_epilepticus';
  else if (minutes_in_seizure >= 5) stage = 'early_status_epilepticus';
  return {
    stage,
    treatment: stage === 'early_status_epilepticus' ? ['Benzodiazepine (IM midazolam 10mg OR IV lorazepam 4mg)', 'If persists: AED loading'] : stage === 'established_status_epilepticus' ? ['Levetiracetam 60mg/kg OR fosphenytoin 20mg/kg OR valproate 40mg/kg'] : ['anesthesia_propo OR midazolam_drip'],
    citation: CITATIONS.NES,
  };
}

function drivingRestrictions(input) {
  const { seizure_type, last_seizure_months, has_aura, country } = input;
  const unrestricted = last_seizure_months >= 6 && has_aura;
  return {
    driving_restrictions_months: country === 'SA' ? (last_seizure_months < 6 ? 6 : 0) : (last_seizure_months < 3 ? 6 : 3),
    license_eligible: last_seizure_months >= 6,
    aura_only: has_aura === true && last_seizure_months >= 3,
    citation: CITATIONS.AES,
  };
}

function pregnancyConsiderations(input) {
  const { current_aed, pregnancy, folic_acid_supplementation, aed_levels } = input;
  const high_risk = ['valproate', 'phenobarbital', 'phenytoin'].includes(current_aed);
  return {
    aed_high_teratogenic: high_risk,
    switch_to_safe: high_risk && pregnancy ? 'consider_switch_to_levetiracetam_or_lamotrigine' : 'continue_current',
    folic_acid_dose: folic_acid_supplementation || '4mg_daily_for_AED_users',
    monitoring_aed_levels: aed_levels ? 'monthly_first_trimester' : 'monitor',
    delivery_planning: 'neonatology_consult_for_AED_exposure',
    citation: CITATIONS.AES,
  };
}

module.exports = { seizureClassification, aedSelection, statusEpilepticus, drivingRestrictions, pregnancyConsiderations, CITATIONS, ValidationError };