'use strict';
// TIER4_PAEDIATRIC-102 Immunization Schedule
const CITATIONS = ['CDC_Immunization_Schedule','AAP_Immunization_2024'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function scheduleAtAge(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_months = ensureNumber(input.age_months, 'age_months');
  const vaccines_due = [];
  const notes = [];
  if (age_months === 0) {
    vaccines_due.push('HepB_dose1');
    notes.push('given_at_birth_or_before_discharge');
  } else if (age_months === 2) vaccines_due.push('HepB_dose2','DTaP_dose1','IPV_dose1','Hib_dose1','PCV13_dose1','RV_dose1');
  else if (age_months === 4) vaccines_due.push('DTaP_dose2','IPV_dose2','Hib_dose2','PCV13_dose2','RV_dose2');
  else if (age_months === 6) vaccines_due.push('DTaP_dose3','IPV_dose3','Hib_dose3','PCV13_dose3','RV_dose3','Influenza_annual');
  else if (age_months >= 12 && age_months <= 15) vaccines_due.push('MMR_dose1','Varicella_dose1','HepA_dose1','PCV13_dose4','Hib_dose4');
  else if (age_months >= 18 && age_months <= 24) vaccines_due.push('HepA_dose2','DTaP_dose4');
  else if (age_months === 48) vaccines_due.push('MMR_dose2','Varicella_dose2','DTaP_dose5','IPV_dose4');
  else notes.push('no_vaccines_due_at_this_age_visit');
  return { age_months, vaccines_due, notes, citations: CITATIONS };
}

function catchUpSchedule(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_months = ensureNumber(input.age_months, 'age_months');
  const vaccines_received = Array.isArray(input.vaccines_received) ? input.vaccines_received : [];
  const accelerated = age_months >= 12 && age_months < 24;
  const strategy = accelerated ? 'accelerated_catch_up_minimum_intervals_4_weeks' : 'age_appropriate_completion';
  return { age_months, vaccines_received, strategy, citations: CITATIONS };
}

module.exports = { scheduleAtAge, catchUpSchedule, CITATIONS, ValidationError };