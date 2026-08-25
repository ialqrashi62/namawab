// filepath: tier14_pharm_ext_103_interaction_engine.js
// TIER14_PHARM_EXT-103: Drug interactions, allergy, dose checks
'use strict';

const CITATIONS = ['LEXICOMP_2024','DRUGBANK_2024','EPIC_INTERD_2024','MICROMEDEX_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function drug_interaction_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id_new, 'medication_id_new');
  ensureNumber(req.medication_count_current, 'medication_count_current');
  ensureNumber(req.interactions_found_count, 'interactions_found_count');
  ensureEnum(req.max_severity || req.max_maxseverity, 'max_severity', ['contraindicated','major','moderate','minor','none','unknown']);
  ensureNumber(req.major_interactions_count, 'major_interactions_count');
  ensureBool(req.alert_overridden_by_provider, 'alert_overridden_by_provider');
  ensureBool(req.recent_lab_review, 'recent_lab_review');

  let status;
  if (req.max_severity === 'contraindicated') status = 'contraindicated_blocking_overridden_or_substitute';
  else if (req.max_severity === 'major' && !req.alert_overridden_by_provider) status = 'major_interaction_provider_review_required';
  else if (req.major_interactions_count >= 3) status = 'multiple_major_review_pharmacist';
  else if (!req.recent_lab_review && req.major_interactions_count >= 1) status = 'lab_review_recommended_drug_interaction';
  else if (req.medication_count_current > 10) status = 'polypharmacy_review_required';
  else status = 'interactions_reviewed_or_none';
  return { status, max_sev: req.max_severity || req.max_maxseverity };
}

function drug_allergy_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'medication_id');
  ensureEnum(req.allergy_match_level, 'allergy_match_level', ['exact_drug','drug_class','cross_reactive','similar_class','ingredient','no_match','unknown']);
  ensureEnum(req.reaction_history_severity, 'reaction_history_severity', ['mild_rash','moderate_urticaria','severe_anaphylaxis','stevens_johnson','toxic_epidermal_necrolysis','drug_reaction_eosinophilia','other','unknown','none_documented']);
  ensureNumber(req.allergy_count_total, 'allergy_count_total');
  ensureBool(req.cross_sensitivity_checked, 'cross_sensitivity_checked');

  let status;
  if (req.allergy_match_level === 'exact_drug' && (req.reaction_history_severity === 'severe_anaphylaxis' || req.reaction_history_severity === 'stevens_johnson')) status = 'absolute_contraindication_anaphylaxis_history';
  else if (req.allergy_match_level === 'exact_drug') status = 'exact_drug_match_exblock';
  else if (req.allergy_match_level === 'drug_class') status = 'drug_class_match_review_cross_sensitivity';
  else if (!req.cross_sensitivity_checked) status = 'cross_sensitivity_check_required';
  else status = 'no_allergy_match';
  return { status, match: req.allergy_match_level };
}

function dose_range_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'medication_id');
  ensureNumber(req.dose_proposed, 'dose_proposed');
  ensureNumber(req.dose_min_per_kg, 'dose_min_per_kg');
  ensureNumber(req.dose_max_per_kg, 'dose_max_per_kg');
  ensureNumber(req.patient_weight_kg, 'patient_weight_kg');
  ensureNumber(req.patient_age_years, 'patient_age_years');
  ensureEnum(req.route, 'route', ['PO','IV','IM','SC','SL','PR','Topical','Inhaled','Ophthalmic','Otic','Nasal','Transdermal','Other']);

  const dose_min_total = req.dose_min_per_kg * req.patient_weight_kg;
  const dose_max_total = req.dose_max_per_kg * req.patient_weight_kg;
  let band;
  if (req.dose_proposed < dose_min_total) band = 'below_therapeutic_review';
  else if (req.dose_proposed > dose_max_total) band = 'above_maximum_dose_blocking';
  else if (req.dose_proposed === dose_max_total) band = 'at_max_review';
  else band = 'within_range';
  return { band, dose_min: dose_min_total, dose_max: dose_max_total };
}

function renal_dose_adjust(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.creatinine_mg_dl, 'creatinine_mg_dl');
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureEnum(req.sex, 'sex', ['male','female','other','unknown']);
  ensureNumber(req.crcl_ml_min, 'crcl_ml_min');
  ensureNumber(req.proposed_dose_mg, 'proposed_dose_mg');
  ensureEnum(req.crcl_band, 'crcl_band', ['normal','mild_30_to_60','moderate_15_to_30','severe_less_than_15','dialysis','unknown']);

  let band;
  if (req.crcl_band === 'dialysis') band = 'dialysis_dose_dialyzable_review';
  else if (req.crcl_band === 'severe_less_than_15' && req.proposed_dose_mg > 250) band = 'severe_impairment_dose_cap_50_pct';
  else if (req.crcl_band === 'moderate_15_to_30' && req.proposed_dose_mg > 500) band = 'moderate_impairment_dose_25_to_50_pct';
  else if (req.crcl_band === 'mild_30_to_60' && req.proposed_dose_mg > 750) band = 'mild_impairment_dose_review';
  else band = 'within_range';
  return { band, crcl: req.crcl_ml_min };
}

function pgx_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.gene, 'gene', ['CYP2D6','CYP2C19','CYP2C9','CYP3A4','CYP3A5','DPYD','TPMT','NUDT15','SLCO1B1','UGT1A1','HLA_B_1502','HLA_B_5701','HLA_B_5801','HLA_A_3101','other']);
  ensureEnum(req.phenotype, 'phenotype', ['poor_metabolizer','intermediate_metabolizer','normal_metabolizer','rapid_metabolizer','ultrarapid_metabolizer','indeterminate','not_tested','other']);
  ensureStr(req.medication_id, 'medication_id');
  ensureEnum(req.action_type, 'action_type', ['avoid','adjust_dose','monitor','no_action','alternative_recommended','other']);

  let status;
  if (req.phenotype === 'poor_metabolizer' && req.action_type !== 'adjust_dose' && req.action_type !== 'avoid' && req.action_type !== 'alternative_recommended') status = 'poor_metabolizer_dose_adjust_required';
  else if (req.phenotype === 'ultrarapid_metabolizer' && req.action_type === 'no_action') status = 'ultrarapid_no_action_toxic_risk';
  else if (req.phenotype === 'indeterminate' && req.action_type !== 'monitor' && req.action_type !== 'no_action') status = 'indeterminate_use_with_monitoring';
  else if (req.phenotype === 'not_tested') status = 'pgx_not_tested_consider_test';
  else status = 'pgx_action_appropriate';
  return { status, gene: req.gene };
}

function funcs() { return { drug_interaction_check, drug_allergy_check, dose_range_check, renal_dose_adjust, pgx_alert }; }
module.exports = { funcs, CITATIONS, ValidationError };