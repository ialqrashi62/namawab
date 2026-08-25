// filepath: tier5_imaging_ext_104_ir_engine.js
// TIER5_IMAGING_EXT-104: Interventional radiology (biopsy, drain, TIPS, embolization, ablation, stent)
'use strict';

const CITATIONS = [
  'SIR_Quality_Improvement_2023',
  'CIRSE_Standards_2022',
  'ACR_SIR_Percutaneous_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function biopsy(req) {
  ensureStr(req.organ, 'organ');
  ensureEnum(req.organ, 'organ', ['liver','kidney','lung','pancreas','lymph_node','thyroid','prostate','bone_soft_tissue']);
  ensureBool(req.coagulopathy_corrected, 'coagulopathy_corrected');
  ensureNumber(req.platelet_count, 'platelet_count');
  ensureNumber(req.inr_value, 'inr_value');
  ensureBool(req.core_needle, 'core_needle');
  ensureNumber(req.needle_passes, 'needle_passes');

  let safety;
  if (req.platelet_count < 50000) safety = 'low_platelets_then_consider_transfusion_or_repeat';
  else if (req.inr_value > 1.5 && !req.coagulopathy_corrected) safety = 'high_inr_then_correct_first_then_re_evaluate';
  else if (req.needle_passes > 5) safety = 'high_passes_then_review_with_ir_pathology';
  else safety = 'continue_with_imaging_review';
  return { safety };
}

function drain(req) {
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['abdominal_abscess','pleural_effusion','pericardial_effusion','liver_abscess','psoas_abscess','biliary_obstruction','renal_urinoma']);
  ensureBool(req.purulent_fluid_on_aspiration, 'purulent_fluid_on_aspiration');
  ensureNumber(req.fluid_volume_ml, 'fluid_volume_ml');
  ensureBool(req.catheter_left_in_place, 'catheter_left_in_place');
  ensureNumber(req.tract_dilation_size_fr, 'tract_dilation_size_fr');

  let decision;
  if (req.purulent_fluid_on_aspiration && req.catheter_left_in_place) decision = 'drainage_continue_then_review_with_surgery';
  else if (req.location === 'biliary_obstruction') decision = 'continue_with_biliary_drainage';
  else if (req.tract_dilation_size_fr < 8) decision = 'consider_serials_dilation_then_drain';
  else decision = 'continue_with_drain_imaging_review';
  return { decision };
}

function tips(req) {
  ensureNumber(req.meld_score, 'meld_score');
  ensureNumber(req.bilirubin_mg_dl, 'bilirubin_mg_dl');
  ensureBool(req.hepatic_encephalopathy_grade_3_plus, 'hepatic_encephalopathy_grade_3_plus');
  ensureNumber(req.ascites_volume_l, 'ascites_volume_l');
  ensureBool(req.refractory_ascites, 'refractory_ascites');
  ensureBool(req.variceal_bleed_active, 'variceal_bleed_active');

  let indication;
  if (req.variceal_bleed_active) indication = 'urgent_tips_then_continue_immediate_bleed_control';
  else if (req.refractory_ascites && req.meld_score >= 18) indication = 'tips_eligible_then_refer_hepatology';
  else if (req.hepatic_encephalopathy_grade_3_plus) indication = 'review_with_hepatology_then_continue';
  else if (req.meld_score >= 12 && req.ascites_volume_l >= 5) indication = 'continue_with_tips_evaluation';
  else indication = 'continue_with_medical_therapy';
  return { indication };
}

function embolization(req) {
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['gi_bleed','trauma_bleed','post_partum_hemorrhage','arteriovenous_malformation','hepatic_chemoembolization','uterine_fibroid','renal_angiomyolipoma']);
  ensureBool(req.active_extravasation_on_cta, 'active_extravasation_on_cta');
  ensureBool(req.hemodynamic_instability, 'hemodynamic_instability');
  ensureBool(req.coil_embolization_planned, 'coil_embolization_planned');
  ensureBool(req.particle_embolization_planned, 'particle_embolization_planned');

  let decision;
  if (req.hemodynamic_instability && req.active_extravasation_on_cta) decision = 'urgent_embolization_then_continue_immediate_review';
  else if (req.indication === 'gi_bleed' && req.coil_embolization_planned) decision = 'continue_with_targeted_embolization';
  else if (req.particle_embolization_planned) decision = 'consider_particle_size_then_continue';
  else decision = 'continue_with_embolization_review';
  return { decision };
}

function ablation(req) {
  ensureStr(req.modality, 'modality');
  ensureEnum(req.modality, 'modality', ['radiofrequency','microwave','cryoablation','irreversible_electroporation','laser_interstitial','high_intensity_focused_ultrasound']);
  ensureStr(req.target_organ, 'target_organ');
  ensureEnum(req.target_organ, 'target_organ', ['liver_tumor','kidney_tumor','lung_tumor','bone_metastasis','prostate','pancreas','thyroid','adrenal']);
  ensureNumber(req.lesion_size_cm, 'lesion_size_cm');
  ensureBool(req.critical_structure_within_1cm, 'critical_structure_within_1cm');

  let safety_plan;
  if (req.lesion_size_cm >= 5) safety_plan = 'consider_combined_modality_then_continue';
  else if (req.critical_structure_within_1cm) safety_plan = 'use_thermal_protection_then_continue';
  else safety_plan = 'continue_with_standard_ablation';
  return { safety_plan };
}

function stent(req) {
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['carotid','peripheral_arterial','biliary','ureteral','esophageal','tracheobronchial','vena_cava','aortic']);
  ensureNumber(req.stenosis_pct, 'stenosis_pct');
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.pre_stenting_angioplasty, 'pre_stenting_angioplasty');
  ensureBool(req.dual_antiplatelet_post, 'dual_antiplatelet_post');

  let action;
  if (req.stenosis_pct >= 70 && req.symptomatic) action = 'stent_then_review_dual_antiplatelet';
  else if (req.location === 'aortic' && req.dual_antiplatelet_post === false) action = 'continue_with_review_then_reconsider_antiplatelet';
  else action = 'continue_with_standard_stent_protocol';
  return { action };
}

function funcs() { return { biopsy, drain, tips, embolization, ablation, stent }; }
module.exports = { funcs, CITATIONS, ValidationError };
