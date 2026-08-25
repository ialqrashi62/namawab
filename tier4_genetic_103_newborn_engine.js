'use strict';
// TIER4_GENETIC-103 Newborn Screening
const CITATIONS = ['HRSA_Newborn_Screening_RUSP','ACMG_NBS_2024'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function newbornScreenResult(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const condition = ensureEnum(input.condition || 'pku', ['pku','galactosemia','sickle_cell','biotinidase','congenital_hypothyroidism','caa','hearing','maple_syrup','tyrosinemia','cystic_fibrosis','scid','mps1','x_ald','pompe','gauchers'], 'condition');
  const result = ensureEnum(input.result || 'negative', ['negative','positive','borderline','specimen_unacceptable'], 'result');
  let action = 'routine';
  if (result === 'positive') action = 'urgent_diagnostic_testing_refer_to_specialty';
  else if (result === 'borderline') action = 'repeat_specimen_immediately';
  else if (result === 'specimen_unacceptable') action = 'collect_new_specimen';
  const core_conditions = ['pku','galactosemia','sickle_cell','biotinidase','congenital_hypothyroidism','caa','hearing'];
  const secondary = ['maple_syrup','tyrosinemia','cystic_fibrosis','scid','mps1','x_ald','pompe','gauchers'];
  const category = core_conditions.includes(condition) ? 'core_rusp' : secondary.includes(condition) ? 'secondary_rusp' : 'pilot';
  return { condition, category, result, action, citations: CITATIONS };
}

function newbornFollowUpPlan(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_at_result_hours = ensureNumber(input.age_at_result_hours || 0, 'age_at_result_hours');
  const positive_condition = ensureEnum(input.positive_condition || 'congenital_hypothyroidism', ['congenital_hypothyroidism','pku','sickle_cell','galactosemia','caa','scid','biotinidase','cystic_fibrosis'], 'positive_condition');
  let timeline = '24_to_72_hours';
  let specialist = 'primary_care';
  if (positive_condition === 'congenital_hypothyroidism') { timeline = 'within_24_hours'; specialist = 'pediatric_endocrinology'; }
  else if (positive_condition === 'pku') { timeline = 'within_24_hours'; specialist = 'metabolic_genetics'; }
  else if (positive_condition === 'sickle_cell') { timeline = 'within_48_hours'; specialist = 'pediatric_hematology'; }
  else if (positive_condition === 'galactosemia') { timeline = 'within_24_hours'; specialist = 'metabolic_genetics'; }
  else if (positive_condition === 'caa') { timeline = 'within_24_hours'; specialist = 'pediatric_cardiology'; }
  else if (positive_condition === 'scid') { timeline = 'within_72_hours'; specialist = 'pediatric_immunology'; }
  return { age_at_result_hours, positive_condition, timeline, specialist, citations: CITATIONS };
}

module.exports = { newbornScreenResult, newbornFollowUpPlan, CITATIONS, ValidationError };