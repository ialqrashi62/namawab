// filepath: tier11_rad_ext_101_nuclear_engine.js
// TIER11_RAD_EXT-101: Nuclear medicine (dose, uptake, protocol, scan interpretation)
'use strict';

const CITATIONS = ['SNMMI_2024','EANM_DOSAGE_2024','ACR_NUCLEAR_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function nuc_dose_calc(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureEnum(req.radiopharmaceutical, 'radiopharmaceutical', ['fdg','tc99m_mdp','tc99m_dmsa','tc99m_dtpa','tl201','i131_mibg','ga68_dotatate','ga68_psma','lu177_dotatate','lu177_psma','y90','ra223','in111_octreoscan','i131_therapy','ra223_therapy','other']);
  ensureEnum(req.procedure, 'procedure', ['pet_whole_body','pet_brain','pet_myeloma','bone_scan','renal_scan','lung_vq','myocardial_perfusion','parathyroid','thyroid_scan','muga','sentinel_node','therapy_hi','therapy_mid','therapy_low','dosimetry']);
  ensureNumber(req.dose_mbq, 'dose_mbq');
  ensureBool(req.pregnancy_check, 'pregnancy_check');
  ensureBool(req.breastfeeding_check, 'breastfeeding_check');

  let dose_status;
  if (!req.pregnancy_check && req.patient_gender?.startsWith('f')) dose_status = 'pregnancy_check_required_for_female_of_reproductive_age';
  else if (req.radiopharmaceutical.startsWith('i131') && !req.breastfeeding_check) dose_status = 'breastfeeding_check_required';
  else if (req.dose_mbq <= 0) dose_status = 'invalid_dose_must_be_positive';
  else if (req.weight_kg < 10) dose_status = 'pediatric_weight_below_normal_review_pediatric_protocol';
  else dose_status = 'dose_appropriate_for_protocol';
  return { dose_status, radiopharmaceutical: req.radiopharmaceutical, dose: req.dose_mbq };
}

function nuc_uptake(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.organ, 'organ', ['thyroid','liver','spleen','bone','kidney','heart','brain','lung','lymph_node','soft_tissue','adrenal','pancreas','other']);
  ensureEnum(req.uptake_pattern, 'uptake_pattern', ['normal_uniform','normal_physiologic','focally_increased','diffusely_increased','focally_decreased','diffusely_decreased','absent','heterogeneous','mismatched','non_diagnostic','cold_nodule','hot_nodule']);
  ensureNumber(req.suv_max, 'suv_max');
  ensureBool(req.has_attenuation_correction, 'has_attenuation_correction');

  let uptake_interpretation;
  if (req.uptake_pattern === 'normal_uniform') uptake_interpretation = 'normal_uptake_no_action';
  else if (req.uptake_pattern.includes('hot_nodule')) uptake_interpretation = 'hot_nodule_evaluate_for_functional_adenoma';
  else if (req.uptake_pattern.includes('cold_nodule')) uptake_interpretation = 'cold_nodule_evaluate_for_malignancy';
  else if (req.uptake_pattern.includes('focally_increased')) uptake_interpretation = 'focal_increase_review_with_anatomy_corr';
  else if (req.uptake_pattern.includes('diffusely_increased')) uptake_interpretation = 'diffuse_increase_pattern_review_metabolic';
  else if (!req.has_attenuation_correction && req.suv_max > 0) uptake_interpretation = 'no_attenuation_correction_suv_caveat';
  else uptake_interpretation = 'requires_careful_review';
  return { uptake_interpretation, pattern: req.uptake_pattern, suv: req.suv_max };
}

function nuc_protocol(req) {
  ensureStr(req.protocol_id, 'protocol_id');
  ensureEnum(req.procedure, 'procedure', ['pet_whole_body','pet_brain','bone_scan','myocardial_perfusion','lung_vq','renal_dtpa','parathyroid','muga','therapy_hi','dosimetry']);
  ensureEnum(req.uptake_min_minutes, ' uptake_minutes', ['15','30','45','60','90','120','180','240','360','24_hours','48_hours','72_hours']);
  ensureNumber(req.flow_rate, 'flow_rate');
  ensureEnum(req.acquisition_mode, 'acquisition_mode', ['2d','3d','list_mode','dynamic','gated','whole_body','spot','spect','spect_ct','pet_ct','pet_mr']);

  let protocol_status;
  if (req.procedure === 'pet_whole_body' && req.acquisition_mode !== '3d' && req.acquisition_mode !== 'list_mode') protocol_status = 'pet_3d_or_list_required_for_whole_body';
  else if (req.flow_rate < 1 && req.procedure.includes('perfusion')) protocol_status = 'flow_rate_too_low_review_protocol';
  else protocol_status = 'protocol_appropriate';
  return { protocol_status, acquisition: req.acquisition_mode };
}

function nuc_interpret(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.diagnosis_band, 'diagnosis_band', ['normal','probably_normal','equivocal','probably_abnormal','definitely_abnormal','non_diagnostic','follow_recommended']);
  ensureNumber(req.findings_count, 'findings_count');
  ensureBool(req.comparison_with_prior, 'comparison_with_prior');
  ensureBool(req.comparison_with_other_modality, 'comparison_with_other_modality');
  ensureNumber(req.confidence_score, 'confidence_score');

  let interp_status;
  if (req.diagnosis_band === 'non_diagnostic') interp_status = 'non_diagnostic_recommend_repeat';
  else if (req.findings_count === 0 && req.diagnosis_band.includes('abnormal')) interp_status = 'abnormal_no_findings_inconsistent';
  else if (!req.comparison_with_prior && req.diagnosis_band === 'equivocal') interp_status = 'equivocal_comparison_recommended';
  else if (req.confidence_score < 60) interp_status = 'low_confidence_consider_expert_review';
  else interp_status = 'interpretation_complete';
  return { interp_status, band: req.diagnosis_band, findings: req.findings_count };
}

function nuc_therapy_safety(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.therapy, 'therapy', ['i131_hyperthyroid','i131_thyroid_cancer','lu177_dotatate','lu177_psma','y90_sirt','ra223','y90_radiation_synovectomy','other']);
  ensureNumber(req.dose_gbq, 'dose_gbq');
  ensureBool(req.pregnancy_test, 'pregnancy_test');
  ensureBool(req.contraception_counseled, 'contraception_counseled');
  ensureBool(req.radiation_safety_briefing, 'radiation_safety_briefing');

  let safety_status;
  if (!req.pregnancy_test && req.therapy.includes('i131')) safety_status = 'pregnancy_test_blocking_i131';
  else if (!req.contraception_counseled && req.dose_gbq >= 1) safety_status = 'contraception_counseling_required_post_therapy';
  else if (!req.radiation_safety_briefing) safety_status = 'radiation_safety_briefing_blocking_discharge';
  else if (req.dose_gbq >= 30) safety_status = 'high_dose_inpatient_or_hotel_observation_required';
  else safety_status = 'therapy_safe_to_proceed';
  return { safety_status, therapy: req.therapy, dose: req.dose_gbq };
}

function funcs() { return { nuc_dose_calc, nuc_uptake, nuc_protocol, nuc_interpret, nuc_therapy_safety }; }
module.exports = { funcs, CITATIONS, ValidationError };