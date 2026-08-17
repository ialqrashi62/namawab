// filepath: tier22_wound_ext_143_assessment_engine.js
// TIER22_WOUND_EXT-143: Wound assessment (etiology, location, type)
'use strict';

const CITATIONS = ['WUWHS_2024','NPUAP_2024','CMS_WOUND_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function wound_assess_type(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.etiology, 'etiology', ['pressure_injury','venous_insufficiency','arterial_insufficiency','neuropathic_diabetic','surgical_post_op','traumatic','burn','radiation','malignant_wound','mixed','unknown','other']);
  ensureEnum(req.location, 'location', ['sacrum','coccyx','heel','trochanter_hip','ischium','ankle','knee','calf','thigh','buttock','back','elbow','shoulder','occiput','ear','abdomen','chest','groin','forearm','hand','foot','multiple','other']);
  ensureBool(req.reassessment_documented, 'reassessment');
  ensureNumber(req.days_since_onset, 'days_onset');

  let status;
  if (req.etiology === 'unknown') status = 'etiology_unknown_workup_required';
  else if (req.etiology === 'mixed') status = 'mixed_etiology_review_components';
  else if (req.days_onset > 90 && req.etiology === 'pressure_injury') status = 'chronic_pressure_review_offloading';
  else status = 'wound_typed';
  return { status, etiology: req.etiology };
}

function wound_pain(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureNumber(req.pain_score, 'pain_score');
  ensureEnum(req.pain_type, 'pain_type', ['nociceptive','neuropathic','mixed','procedure_related','none','other']);
  ensureBool(req.pain_assessed_dressing_change, 'pain_dressing');
  ensureBool(req.premedication_given, 'premed');
  ensureEnum(req.pain_plan, 'pain_plan', ['none','prn_oral','around_the_clock','multimodal','topical','regional','palliative','other']);

  let status;
  if (req.pain_score >= 7 && req.pain_plan === 'none') status = 'severe_pain_no_plan_add_multimodal';
  else if (req.pain_type === 'neuropathic' && req.pain_plan !== 'multimodal') status = 'neuropathic_pain_requires_multimodal_gabapentin';
  else if (req.pain_dressing && !req.premed) status = 'pain_at_dressing_change_premed_required';
  else status = 'pain_assessed';
  return { status, score: req.pain_score };
}

function wound_vascular(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.abi, 'abi');
  ensureEnum(req.arterial_assessment, 'arterial_assessment', ['normal','mild_disease','moderate_disease','severe_disease','critical_limb_ischemia','non_compressible','not_performed','other']);
  ensureBool(req.dorsalis_pedis_palpable, 'dp_palpable');
  ensureBool(req.posterior_tibial_palpable, 'pt_palpable');
  ensureEnum(req.venous_assessment, 'venous_assessment', ['normal','mild_insufficiency','moderate_insufficiency','severe_insufficiency','not_assessed','other']);

  let status;
  if (req.arterial_assessment === 'critical_limb_ischemia') status = 'cli_immediate_vascular_consult';
  else if (req.abi < 0.5) status = 'abi_under_0_5_severe_ischemia';
  else if (req.abi > 1.4) status = 'abi_over_1_4_non_compressible_calcification';
  else if (!req.dorsalis_pedis_palpable && !req.posterior_tibial_palpable) status = 'no_pulses_vascular_workup';
  else if (req.venous_assessment === 'severe_insufficiency') status = 'severe_venous_insufficiency_compression_indicated';
  else status = 'vascular_appropriate';
  return { status, abi: req.abi };
}

function wound_infection(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureBool(req.local_infection_signs, 'local_signs');
  ensureBool(req.systemic_infection_signs, 'systemic_signs');
  ensureBool(req.biofilm_suspected, 'biofilm_suspected');
  ensureBool(req.culture_taken, 'culture_taken');
  ensureEnum(req.culture_result, 'culture_result', ['pending','negative','mrsa','vre','psa','ecoli','strep_pyogenes','mixed','polymicrobial','not_collected','other']);

  let status;
  if (req.systemic_infection_signs) status = 'systemic_infection_blood_culture_abx_empiric';
  else if (req.biofilm_suspected) status = 'biofilm_suspected_debridement_then_culture';
  else if (req.local_infection_signs && !req.culture_taken) status = 'local_signs_culture_required_before_abx';
  else if (req.culture_result === 'mrsa') status = 'mrsa_isolation_contact_targeted_abx';
  else status = 'infection_assessed';
  return { status, culture: req.culture_result };
}

function wound_nutritional(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.albumin, 'albumin');
  ensureNumber(req.prealbumin, 'prealbumin');
  ensureNumber(req.bmi, 'bmi');
  ensureEnum(req.nutritional_status, 'nutritional_status', ['well_nourished','at_risk','mild_moderate_malnutrition','severe_malnutrition','unknown','other']);
  ensureNumber(req.protein_intake_g_per_kg, 'protein_intake');

  let status;
  if (req.albumin < 2.5) status = 'albumin_under_2_5_severe_malnutrition';
  else if (req.prealbumin < 15) status = 'prealbumin_under_15_acute_malnutrition';
  else if (req.protein_intake < 1.2) status = 'protein_under_1_2_increase_to_1_5';
  else if (req.nutritional_status === 'severe_malnutrition') status = 'severe_malnutrition_dietician_immediately';
  else status = 'nutritional_assessed';
  return { status, alb: req.albumin };
}

function funcs() { return { wound_assess_type, wound_pain, wound_vascular, wound_infection, wound_nutritional }; }
module.exports = { funcs, CITATIONS, ValidationError };
