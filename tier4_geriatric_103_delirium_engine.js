'use strict';
// TIER4_GERIATRICS-103 Delirium
const CITATIONS = ['AGS_Delirium_Guidelines','CAM_Confusion_Assessment'];
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

function camAssessment(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const acute_onset = !!input.acute_onset;
  const fluctuating_course = !!input.fluctuating_course;
  const inattention = !!input.inattention;
  const altered_consciousness = ensureEnum(input.altered_consciousness || 'none', ['none','vigilant','lethargic','stupor','coma'], 'altered_consciousness');
  const disorganized_thinking = !!input.disorganized_thinking;
  const feature1 = acute_onset && fluctuating_course;
  const feature2 = inattention;
  const feature3 = altered_consciousness !== 'none';
  const feature4 = disorganized_thinking;
  let cam_positive = false;
  let subtype = null;
  if (feature1 && feature2 && (feature3 || feature4)) {
    cam_positive = true;
    if (altered_consciousness === 'vigilant' && !disorganized_thinking) subtype = 'hyperactive';
    else if (altered_consciousness === 'lethargic' && !disorganized_thinking) subtype = 'hypoactive';
    else subtype = 'mixed';
  }
  const workup = [];
  if (cam_positive) {
    workup.push('infection_screen');
    workup.push('medication_review_anticholinergic');
    workup.push('electrolytes_glucose_cbc');
    workup.push('imaging_if_indicated');
  }
  return { acute_onset, fluctuating_course, inattention, altered_consciousness, disorganized_thinking, cam_positive, subtype, workup, citations: CITATIONS };
}

function deliriumPrevention(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const pre_existing_dementia = !!input.pre_existing_dementia;
  const surgery_planned = !!input.surgery_planned;
  const icu_stay = !!input.icu_stay;
  const risk_level = age >= 75 || pre_existing_dementia || icu_stay ? 'high' : surgery_planned ? 'moderate' : 'low';
  const strategies = [
    'orient_communication_protocol',
    'early_mobilization',
    'sleep_wake_cycle_preservation',
    'vision_hearing_aids_use',
    'adequate_nutrition_hydration'
  ];
  if (risk_level === 'high') strategies.push('geriatric_consultation');
  if (surgery_planned) strategies.push('pre_habilitation_optimization');
  return { age, pre_existing_dementia, surgery_planned, icu_stay, risk_level, strategies, citations: CITATIONS };
}

module.exports = { camAssessment, deliriumPrevention, CITATIONS, ValidationError };