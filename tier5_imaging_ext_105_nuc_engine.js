// filepath: tier5_imaging_ext_105_nuc_engine.js
// TIER5_IMAGING_EXT-105: Nuclear medicine (PET, SPECT, bone, thyroid, parathyroid, sentinel node)
'use strict';

const CITATIONS = [
  'SNMMI_Procedure_Standard_2023',
  'EANM_Oncology_PET_2022',
  'ATA_Thyroid_Nodule_2015',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function pet_oncology(req) {
  ensureStr(req.tracer, 'tracer');
  ensureEnum(req.tracer, 'tracer', ['fdg','psma_dotatate','fluciclovine','fes_estradiol','fapi']);
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['initial_staging','restaging','treatment_response','recurrence_suspicion','surveillance']);
  ensureNumber(req.suv_max, 'suv_max');
  ensureBool(req.fasting_blood_glucose_below_200, 'fasting_blood_glucose_below_200');
  ensureBool(req.recent_chemotherapy_within_4_weeks, 'recent_chemotherapy_within_4_weeks');

  let interpretation;
  if (req.fasting_blood_glucose_below_200 === false) interpretation = 'high_glucose_then_re_scan_with_strict_fasting';
  else if (req.suv_max >= 4 && req.recent_chemotherapy_within_4_weeks === false) interpretation = 'continue_with_review_for_active_disease';
  else if (req.suv_max >= 4) interpretation = 'consider_treatment_related_inflammation_then_continue';
  else if (req.suv_max < 2) interpretation = 'continue_with_low_suspicion';
  else interpretation = 'continue_with_imaging_review';
  return { interpretation };
}

function spect_cardiac(req) {
  ensureStr(req.protocol, 'protocol');
  ensureEnum(req.protocol, 'protocol', ['stress_rest','rest_only','gated_equilibrium','first_pass','myocardial_perfusion_imaging']);
  ensureNumber(req.stress_ef_pct, 'stress_ef_pct');
  ensureNumber(req.rest_ef_pct, 'rest_ef_pct');
  ensureBool(req.ischemia_detected, 'ischemia_detected');
  ensureBool(req.st_depression_present, 'st_depression_present');

  let impression;
  if (req.ischemia_detected && req.st_depression_present && req.stress_ef_pct - req.rest_ef_pct >= 5) impression = 'ischemia_with_drop_in_ef_then_consider_cath';
  else if (req.ischemia_detected) impression = 'ischemia_then_continue_with_stress_imaging_review';
  else if (req.stress_ef_pct < 40) impression = 'reduced_ef_then_continue_with_medical_therapy';
  else impression = 'continue_with_no_ischemia_review';
  return { impression };
}

function bone_scan(req) {
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['cancer_staging','metastases_workup','prosthesis_loosening','occult_fracture','sports_medicine','paget_disease']);
  ensureBool(req.multiple_focal_uptake, 'multiple_focal_uptake');
  ensureBool(req.superscan_pattern, 'superscan_pattern');
  ensureBool(req.symmetrical_distribution, 'symmetrical_distribution');

  let impression;
  if (req.superscan_pattern) impression = 'superscan_then_continue_with_diffuse_metastatic_disease';
  else if (req.multiple_focal_uptake && req.indication === 'cancer_staging') impression = 'continue_with_metastatic_disease_review';
  else if (req.symmetrical_distribution) impression = 'continue_with_no_focal_pathology';
  else impression = 'continue_with_imaging_review';
  return { impression };
}

function thyroid_scan(req) {
  ensureNumber(req.tsh_miu_l, 'tsh_miu_l');
  ensureStr(req.finding, 'finding');
  ensureEnum(req.finding, 'finding', ['hyperfunctioning_hot','hypofunctioning_cold','normal_uniform','diffusely_increased','diffusely_decreased']);
  ensureNumber(req.thyroid_uptake_pct_24h, 'thyroid_uptake_pct_24h');

  let impression;
  if (req.finding === 'hypofunctioning_cold') impression = 'cold_nodule_then_consider_fna';
  else if (req.finding === 'hyperfunctioning_hot' && req.tsh_miu_l < 0.1) impression = 'toxic_then_continue_treatment_review';
  else if (req.finding === 'diffusely_increased' && req.thyroid_uptake_pct_24h > 50) impression = 'continue_with_graves_disease_review';
  else if (req.finding === 'diffusely_decreased') impression = 'continue_with_subacute_thyroiditis_review';
  else impression = 'continue_with_imaging_review';
  return { impression };
}

function parathyroid_scan(req) {
  ensureNumber(req.calcium_mg_dl, 'calcium_mg_dl');
  ensureNumber(req.pth_pg_ml, 'pth_pg_ml');
  ensureBool(req.single_adenoma_suspected, 'single_adenoma_suspected');
  ensureBool(req.dual_adenoma_suspected, 'dual_adenoma_suspected');
  ensureBool(req.four_gland_hyperplasia_suspected, 'four_gland_hyperplasia_suspected');

  let impression;
  if (req.single_adenoma_suspected) impression = 'single_adenoma_then_continue_with_minimally_invasive_surgery';
  else if (req.dual_adenoma_suspected) impression = 'dual_adenoma_then_continue_with_focused_review';
  else if (req.four_gland_hyperplasia_suspected) impression = 'four_gland_then_continue_with_total_review';
  else if (req.calcium_mg_dl >= 11 && req.pth_pg_ml >= 100) impression = 'continue_with_imaging_review';
  else impression = 'continue_with_biochemical_review';
  return { impression };
}

function sentinel_node(req) {
  ensureStr(req.cancer_type, 'cancer_type');
  ensureEnum(req.cancer_type, 'cancer_type', ['breast','melanoma','vulvar','penile','head_neck_scc']);
  ensureBool(req.lymphoscintigraphy_done, 'lymphoscintigraphy_done');
  ensureNumber(req.lymph_nodes_identified, 'lymph_nodes_identified');
  ensureBool(req.dual_technique_with_blue_dye, 'dual_technique_with_blue_dye');

  let impression;
  if (!req.lymphoscintigraphy_done) impression = 'lymphoscintigraphy_then_continue_with_surgical_planning';
  else if (req.lymph_nodes_identified === 0) impression = 'no_nodes_then_continue_with_completion_dissection_review';
  else if (req.dual_technique_with_blue_dye) impression = 'dual_then_continue_with_surgical_pathology';
  else impression = 'continue_with_imaging_review';
  return { impression };
}

function funcs() { return { pet_oncology, spect_cardiac, bone_scan, thyroid_scan, parathyroid_scan, sentinel_node }; }
module.exports = { funcs, CITATIONS, ValidationError };
