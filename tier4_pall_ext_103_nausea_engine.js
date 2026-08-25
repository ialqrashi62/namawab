'use strict';
// TIER4_PALL_EXT-103 Nausea
const CITATIONS = ['NCCN_Nausea_Vomiting_Palliative','MASCC_Nausea'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function nauseaCausePathway(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const cause = ensureEnum(input.cause || 'chemo', ['chemo','opioid','metabolic_uremia_hypercalcemia','brain_metastases','bowel_obstruction','vestibular','anxiety'], 'cause');
  const first_line = {
    'chemo': '5ht3_antagonist_ondansetron_dexamethasone',
    'opioid': 'metoclopramide_or_haloperidol',
    'metabolic_uremia_hypercalcemia': 'haloperidol_or_alternative_metabolic_workup',
    'brain_metastases': 'dexamethasone_brain_imaging',
    'bowel_obstruction': 'octreotide_for_malignant_bowel_obstruction',
    'vestibular': 'meclizine_or_scopolamine',
    'anxiety': 'lorazepam_low_dose'
  }[cause];
  return { cause, first_line, citations: CITATIONS };
}

function nauseaTreatment(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const refractory = !!input.refractory;
  let escalation = 'add_second_agent_different_class';
  if (refractory) escalation = 'olanzapine_or_5ht3_plus_nk1_combination_or_sc_route';
  return { refractory, escalation, citations: CITATIONS };
}

module.exports = { nauseaCausePathway, nauseaTreatment, CITATIONS, ValidationError };