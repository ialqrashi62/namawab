// filepath: tier26_oncology_ext_166_palliative_engine.js
// TIER26_ONCOLOGY-166: Palliative care, pain, end-of-life
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function pain_assess(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.pain_score, 'pain');
  ensureEnum(req.pain_type, 'pain_type', ['nociceptive_somatic','nociceptive_visceral','neuropathic','mixed','incident','breakthrough','other']);
  ensureBool(req.opioid_required, 'opioid');
  ensureNumber(req.morphine_equivalent_daily, 'med');
  ensureEnum(req.side_effects, 'side_effects', ['none','constipation','nausea','sedation','respiratory_depression','pruritus','other']);
  let status;
  if (req.pain_score >= 7 && req.med < 30) status = 'severe_pain_opioid_optimization_required';
  else if (req.side_effects === 'respiratory_depression') status = 'respiratory_depression_reversal_consider';
  else if (req.pain_type === 'neuropathic' && req.med === 0) status = 'neuropathic_add_gabapentin_or_duloxetine';
  else status = 'pain_managed';
  return { status, score: req.pain_score };
}

function hospice(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.days_prognosis, 'days');
  ensureBool(req.eligible, 'eligible');
  ensureEnum(req.disease_trajectory, 'disease_trajectory', ['stable','declining','rapid_decline','dying','unknown','other']);
  ensureBool(req.consent, 'consent');
  ensureBool(req.advanced_directive, 'ad');
  let status;
  if (req.days_prognosis < 14) status = 'imminent_end_of_life_comfort_measures';
  else if (req.days_prognosis < 180 && req.eligible && req.consent) status = 'hospice_eligible_refer';
  else if (!req.advanced_directive) status = 'advanced_directive_discussion_required';
  else status = 'hospice_status_reviewed';
  return { status, prognosis: req.days_prognosis };
}

function symptoms(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.symptom, 'symptom', ['pain','fatigue','dyspnea','nausea','constipation','delirium','anxiety','depression','insomnia','anorexia','cachexia','edema','other']);
  ensureNumber(req.severity, 'severity');
  ensureBool(req.distressing, 'distressing');
  ensureEnum(req.treatment, 'treatment', ['none','pharmacologic','non_pharmacologic','combination','palliative_radiation','palliative_surgery','other']);
  ensureBool(req.family_aware, 'family');
  let status;
  if (req.distressing && req.treatment === 'none') status = 'distressing_no_treatment_intervene';
  else if (req.symptom === 'dyspnea' && req.severity >= 7) status = 'severe_dyspnea_opioid_or_benzodiazepine';
  else if (!req.family_aware && req.severity >= 7) status = 'family_education_required_severe_symptom';
  else status = 'symptom_managed';
  return { status, symptom: req.symptom };
}

function goals_care(req) {
  ensureStr(req.discussion_id, 'discussion_id');
  ensureEnum(req.code_status, 'code_status', ['full_code','dnr','dnr_dni','dnar','and','limited','comfort_only','unknown','other']);
  ensureBool(req.proxy_identified, 'proxy');
  ensureEnum(req.goal, 'goal', ['cure','life_prolong','maintain_function','comfort','combined','other']);
  ensureBool(req.discussion_documented, 'doc');
  ensureBool(req.family_present, 'family');
  let status;
  if (!req.discussion_documented) status = 'goals_discussion_documentation_required';
  else if (req.code_status === 'full_code' && req.goal === 'comfort') status = 'full_code_comfort_goal_review_alignment';
  else if (!req.proxy_identified) status = 'health_care_proxy_required';
  else status = 'goals_care_documented';
  return { status, code: req.code_status };
}

function bereavement(req) {
  ensureStr(req.family_id, 'family_id');
  ensureNumber(req.days_since_death, 'days');
  ensureBool(req.bereavement_services_offered, 'services');
  ensureEnum(req.loss_type, 'loss_type', ['expected','sudden','traumatic','perinatal','child','spouse','parent','sibling','other']);
  ensureBool(req.followup_call_done, 'call');
  ensureBool(req.referral_made, 'refer');
  let status;
  if (req.loss_type === 'traumatic' && !req.referral_made) status = 'traumatic_loss_professional_referral';
  else if (req.days_since_death < 14 && !req.followup_call_done) status = 'initial_bereavement_call_required';
  else if (req.days_since_death > 365 && !req.referral_made) status = 'prolonged_grief_assessment_referral';
  else status = 'bereavement_supported';
  return { status, days: req.days_since_death };
}

const CITATIONS = { NCCN_PALLIATIVE_2024: 'NCCN Palliative 2024', AAHPM_2024: 'AAHPM 2024' };

function funcs() { return { pain_assess, hospice, symptoms, goals_care, bereavement }; }
module.exports = { funcs, CITATIONS, ValidationError };