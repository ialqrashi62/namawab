// filepath: tier11_rad_ext_102_interventional_engine.js
// TIER11_RAD_EXT-102: Interventional radiology (procedures, vascular access, biopsy, drain, embolization)
'use strict';

const CITATIONS = ['SIR_2024','ACR_IR_2024','CIRSE_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ir_procedure_select(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.indication, 'indication', ['biopsy_liver','biopsy_lung','biopsy_kidney','biopsy_bone','biopsy_lymph_node','biopsy_thyroid','drain_abscess','drain_pleural','drain_ascites','drain_biliary','drain_urinoma','thrombolysis_dvt','thrombolysis_arterial','tace','tare','rf_ablation','cryo_ablation','vertebroplasty','kyphoplasty','embolization_gi','embolization_uterine','embolization_trauma','angioplasty_pvd','stent_pvd','line_central','line_picc','port','dialysis_access','other']);
  ensureEnum(req.urgency, 'urgency', ['elective','urgent','emergent','stat']);
  ensureNumber(req.days_to_schedule, 'days_to_schedule');
  ensureNumber(req.coagulation_inr, 'coagulation_inr');
  ensureNumber(req.platelet_count, 'platelet_count');
  ensureBool(req.consent_signed, 'consent_signed');

  let procedure_status;
  if (!req.consent_signed) procedure_status = 'consent_required_blocking';
  else if (req.urgency === 'stat' && req.days_to_schedule > 0) procedure_status = 'stat_emergency_immediate';
  else if (req.coagulation_inr > 1.5 && req.indication.includes('biopsy')) procedure_status = 'coagulation_correct_first_biopsy_high_risk';
  else if (req.platelet_count < 50 && req.indication.includes('drain')) procedure_status = 'platelet_transfusion_first';
  else if (req.urgency === 'elective' && req.days_to_schedule > 14) procedure_status = 'elective_long_wait_expedite_review';
  else procedure_status = 'procedure_eligible_to_schedule';
  return { procedure_status, indication: req.indication, urgency: req.urgency };
}

function ir_vascular_access(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.access_type, 'access_type', ['picc','tunneled_cvc','port_a_cath','non_tunneled_cvc','dialysis_catheter','peripheral_iv_ultrasound','arterial_line','central_line_emergency','midline','other']);
  ensureEnum(req.site, 'site', ['right_ij','left_ij','right_subclavian','left_subclavian','right_femoral','left_femoral','right_cephalic','left_cephalic','right_basilic','left_basilic','right_brachial','left_brachial','right_radial','left_radial','other']);
  ensureBool(req.ultrasound_guidance, 'ultrasound_guidance');
  ensureBool(req.sterile_full_barrier, 'sterile_full_barrier');
  ensureBool(req.clr_culture_taken, 'clr_culture_taken');

  let access_status;
  if (!req.ultrasound_guidance && req.site.includes('IJ')) access_status = 'ultrasound_required_for_IJ';
  else if (!req.sterile_full_barrier) access_status = 'sterile_full_barrier_required_clabsi_risk';
  else if (req.clr_culture_taken === false) access_status = 'culture_recommended_if_removal';
  else access_status = 'access_placement_appropriate';
  return { access_status, access_type: req.access_type, site: req.site };
}

function ir_embolization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.target_vessel, 'target_vessel', ['hepatic_artery','splenic_artery','renal_artery','uterine_artery','gastric_artery','branches_pulmonary','internal_iliac','external_carotid','other']);
  ensureEnum(req.material, 'material', ['microspheres','gelfoam','coils','glue_n_bca','lipiodol','particles','plug','stent_graft','combination']);
  ensureNumber(req.dose_ml, 'dose_ml');
  ensureEnum(req.goal, 'goal', ['complete_devascularization','flow_reduction','selective_targeting','hemorrhage_control','pain_palliation','preparation_surgery','other']);
  ensureBool(req.angio_run_end, 'angio_run_end');

  let embo_status;
  if (req.goal === 'complete_devascularization' && req.material === 'gelfoam') embo_status = 'gelfoam_temporary_for_complete_use_particles_or_microspheres';
  else if (!req.angio_run_end) embo_status = 'final_angiogram_required_to_documented_devascularization';
  else if (req.dose_ml > 20) embo_status = 'large_dose_review_reflux_risk';
  else embo_status = 'embolization_appropriate';
  return { embo_status, target: req.target_vessel, material: req.material };
}

function ir_ablation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.modality, 'modality', ['rf_microwave','cryoablation','ire_nano_knife','laser','alcohol_pei','radiation_sbrt','hifu','mwa','other']);
  ensureEnum(req.target_organ, 'target_organ', ['liver','lung','bone','kidney','thyroid','breast','pancreas','prostate','lymph_node','other']);
  ensureNumber(req.tumor_size_cm, 'tumor_size_cm');
  ensureBool(req.image_fusion_used, 'image_fusion_used');
  ensureEnum(req.approach, 'approach', ['percutaneous','laparoscopic','open','endoscopic','e_us','ct_guided','us_guided','mr_guided','robot_assist','other']);

  let ablate_status;
  if (req.tumor_size_cm > 5 && req.modality === 'rf_microwave') ablate_status = 'large_tumor_review_mwa_vs_combined_treatment';
  else if (!req.image_fusion_used && req.target_organ === 'liver') ablate_status = 'image_fusion_recommended_for_liver';
  else if (req.approach === 'percutaneous' && req.target_organ === 'pancreas') ablate_status = 'pancreatic_ablation_higher_risk_review';
  else ablate_status = 'ablation_plan_appropriate';
  return { ablate_status, modality: req.modality, tumor_size: req.tumor_size_cm };
}

function ir_follow_up(req) {
  ensureStr(req.procedure_id, 'procedure_id');
  ensureNumber(req.hours_post_procedure, 'hours_post_procedure');
  ensureEnum(req.complications, 'complications', ['none','minor_bleeding','major_bleeding','pneumothorax_small','pneumothorax_large','infection','vascular_injury','organ_injury','contrast_reaction','death','other']);
  ensureBool(req.discharged, 'discharged');
  ensureNumber(req.length_of_stay_days, 'length_of_stay_days');

  let fu_status;
  if (req.complications === 'death') fu_status = 'mortality_morbidity_review_immediate';
  else if (req.complications === 'major_bleeding' || req.complications === 'vascular_injury') fu_status = 'major_complication_extended_observation';
  else if (req.complications === 'pneumothorax_large') fu_status = 'large_pneumothorax_chest_tube_required';
  else if (req.complications === 'none' && req.hours_post_procedure >= 4 && req.discharged) fu_status = 'routine_follow_up_at_clinic';
  else if (req.complications === 'none' && !req.discharged) fu_status = 'continue_observation';
  else fu_status = 'monitor_and_manage_complication';
  return { fu_status, complications: req.complications, hours: req.hours_post_procedure };
}

function funcs() { return { ir_procedure_select, ir_vascular_access, ir_embolization, ir_ablation, ir_follow_up }; }
module.exports = { funcs, CITATIONS, ValidationError };