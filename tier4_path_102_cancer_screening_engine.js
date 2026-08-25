'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  uspstf: 'US Preventive Services Task Force. Cancer Screening Recommendations 2020',
  acs: 'American Cancer Society. Cancer Screening Guidelines 2020'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function cervicalScreening(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const hpv_status = ensureEnum(input.hpv_status, ['negative','positive_16','positive_18','positive_other','unknown'], 'hpv_status');
  const cytology = ensureEnum(input.cytology, ['normal','ascus','lsil','hsil','asc_h','agc','unsatisfactory'], 'cytology');
  let interval;
  if (age < 21) { interval = 'no_screening'; }
  else if (age >= 30 && hpv_status === 'negative') { interval = 'co_test_5yr'; }
  else if (age >= 30 && hpv_status === 'positive_16' && cytology === 'normal') { interval = 'colposcopy'; }
  else if (age >= 30 && hpv_status === 'positive_other' && cytology === 'normal') { interval = 'co_test_1yr'; }
  else if (age >= 21 && age < 30 && cytology === 'normal') { interval = 'cytology_3yr'; }
  else { interval = 'colposcopy_or_repeat'; }
  return { age, hpv_status, cytology, interval, citations:['uspstf'] };
}

function breastCancerScreening(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const family_history = !!input.family_history;
  const brca_carrier = !!input.brca_carrier;
  const previous_biopsy_atypia = !!input.previous_biopsy_atypia;
  const recommendation = [];
  if (brca_carrier) { recommendation.push('mri_mammogram_annual_25'); }
  else if (family_history && age >= 40) { recommendation.push('mammogram_annual'); }
  else if (age >= 50 && age <= 74) { recommendation.push('mammogram_2yr'); }
  else if (age >= 40 && age <= 49) { recommendation.push('shared_decision_making'); }
  else { recommendation.push('no_routine_screening'); }
  if (previous_biopsy_atypia) { recommendation.push('consider_supplemental_mri'); }
  return { age, family_history, brca_carrier, previous_biopsy_atypia, recommendation, citations:['acs'] };
}

module.exports = { cervicalScreening, breastCancerScreening, CITATIONS, ValidationError };
