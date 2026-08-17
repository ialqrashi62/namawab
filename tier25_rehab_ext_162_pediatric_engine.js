// filepath: tier25_rehab_ext_162_pediatric_engine.js
// TIER25_REHAB-162: Pediatric rehab (developmental milestones, CP)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function developmental(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_months, 'months');
  ensureNumber(req.motor_months, 'motor');
  ensureNumber(req.language_months, 'lang');
  ensureNumber(req.social_months, 'social');
  ensureNumber(req.cognitive_months, 'cognitive');
  ensureBool(req.regression, 'regression');
  let status;
  if (req.regression) status = 'regression_urgent_neuro_workup';
  else if (req.motor_months < req.age_months - 6) status = 'motor_delay_significant';
  else if (req.language_months < req.age_months - 6) status = 'language_delay_significant';
  else if (req.cognitive_months < req.age_months - 6) status = 'cognitive_delay_significant';
  else status = 'development_appropriate_for_age';
  return { status, age: req.age_months };
}

function gmfc(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cp_subtype, 'cp_subtype', ['spastic_diplegia','spastic_hemiplegia','spastic_quadriplegia','dyskinetic','ataxic','mixed','other']);
  ensureEnum(req.gmfcs_level, 'gmfcs_level', ['i','ii','iii','iv','v','unknown','other']);
  ensureNumber(req.age_years, 'age');
  ensureBool(req.use_assistive_device, 'device');
  let status;
  if (req.gmfcs_level === 'v') status = 'gmfcs_v_power_mobility_required';
  else if (req.gmfcs_level === 'iv' && !req.use_assistive_device) status = 'gmfcs_iv_supervised_device';
  else if (req.cp_subtype === 'dyskinetic') status = 'dyskinetic_dystonia_management_review';
  else status = 'gmfc_assessed';
  return { status, level: req.gmfcs_level };
}

function feeding_pediatric(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.feeding_method, 'feeding_method', ['oral','ng_tube','g_tube','gj_tube','tpn_only','oral_with_supplement','other']);
  ensureNumber(req.weight_kg, 'weight');
  ensureNumber(req.caloric_intake_kcal_day, 'kcal');
  ensureBool(req.aspiration_history, 'aspiration');
  ensureEnum(req.feeding_skills, 'feeding_skills', ['independent','needs_setup','needs_supervision','needs_assistance','fully_dependent','other']);
  let status;
  if (req.feeding_method === 'oral' && req.aspiration_history) status = 'oral_with_aspiration_swallow_review';
  else if (req.feeding_skills === 'fully_dependent') status = 'feeding_skills_dependent_review_ot';
  else if (req.caloric_intake_kcal_day < 800 && req.weight_kg > 10) status = 'low_caloric_intake_supplement';
  else status = 'feeding_appropriate';
  return { status, method: req.feeding_method };
}

function early_intervention(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_months, 'months');
  ensureBool(req.service_plan_exists, 'plan');
  ensureEnum(req.discipline, 'discipline', ['pt','ot','slp','vision','auditory','special_education','other']);
  ensureNumber(req.visits_per_month, 'visits');
  ensureBool(req.family_engaged, 'family');
  let status;
  if (req.age_months > 36 && !req.service_plan_exists) status = 'over_3y_review_school_transition';
  else if (req.visits_per_month < 2) status = 'low_frequency_increase_visits';
  else if (!req.family_engaged) status = 'family_engagement_required_for_progress';
  else status = 'early_intervention_appropriate';
  return { status, age: req.age_months };
}

function school_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.education_setting, 'education_setting', ['mainstream','mainstream_with_support','special_class','special_school','home_hospital','other']);
  ensureBool(req.iep_in_place, 'iep');
  ensureNumber(req.visits_per_week, 'visits');
  ensureBool(req.adaptations_in_place, 'adapt');
  ensureEnum(req.transport, 'transport', ['independent','family','school_bus','special_transport','ambulance','other']);
  let status;
  if (req.education_setting === 'mainstream' && !req.adaptations_in_place) status = 'mainstream_adaptations_required';
  else if (req.education_setting === 'mainstream_with_support' && !req.iep_in_place) status = 'iep_required_for_support';
  else if (req.transport === 'family' && req.visits_per_week > 3) status = 'family_transport_burden_review_school_bus';
  else status = 'school_rehab_appropriate';
  return { status, setting: req.education_setting };
}

const CITATIONS = { AAP_DEV_2024: 'AAP Developmental 2024', AACPDM_CP_2024: 'AACPDM CP 2024', IDEA_EI_2024: 'IDEA Part C Early Intervention 2024' };

function funcs() { return { developmental, gmfc, feeding_pediatric, early_intervention, school_rehab }; }
module.exports = { funcs, CITATIONS, ValidationError };