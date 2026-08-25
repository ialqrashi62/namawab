// filepath: tier5_dental_ext_103_perio_engine.js
// TIER5_DENTAL_EXT-103: Periodontics
'use strict';

const CITATIONS = [
  'AAP_Perio_Classification_2017',
  'EFP_Perio_Guidelines_2020',
  'AAP_Peri_implantitis_2023',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function gingivitis(req) {
  ensureBool(req.plaque_present, 'plaque_present');
  ensureBool(req.bleeding_on_probing, 'bleeding_on_probing');
  ensureNumber(req.pocket_depth_mm, 'pocket_depth_mm');
  ensureNumber(req.attachment_loss_mm, 'attachment_loss_mm');
  ensureBool(req.smoker, 'smoker');
  ensureBool(req.diabetic, 'diabetic');

  let stage;
  if (req.attachment_loss_mm === 0 && req.bleeding_on_probing) stage = 'gingivitis_then_continue_with_improved_OH';
  else if (req.pocket_depth_mm >= 4 && req.attachment_loss_mm === 0) stage = 'continue_with_review_then_reassess';
  else if (req.smoker || req.diabetic) stage = 'continue_with_risk_modification_review';
  else stage = 'continue_with_standard_review';
  return { stage };
}

function periodontitis_staging(req) {
  ensureNumber(req.cal_mm, 'cal_mm'); // clinical attachment loss
  ensureNumber(req.pd_mm, 'pd_mm'); // probing depth
  ensureNumber(req.bone_loss_pct, 'bone_loss_pct');
  ensureBool(req.vertical_or_horizontal_bone_loss, 'vertical_or_horizontal_bone_loss');
  ensureBool(req.tooth_loss_due_to_perio, 'tooth_loss_due_to_perio');

  let stage;
  if (req.cal_mm < 3 && req.pd_mm <= 4) stage = 'stage_1_initial';
  else if (req.cal_mm >= 3 && req.cal_mm < 5 && req.pd_mm <= 5) stage = 'stage_2_moderate';
  else if (req.cal_mm >= 5 && req.bone_loss_pct >= 50) stage = 'stage_3_severe_with_potential_tooth_loss';
  else if (req.tooth_loss_due_to_perio) stage = 'stage_4_advanced_with_tooth_loss';
  else stage = 'continue_with_review';
  return { stage };
}

function periodontitis_grading(req) {
  ensureNumber(req.bone_loss_over_5_years_pct, 'bone_loss_over_5_years_pct');
  ensureBool(req.smoker, 'smoker');
  ensureBool(req.diabetic_hba1c_above_7, 'diabetic_hba1c_above_7');

  let grade;
  if (req.bone_loss_over_5_years_pct >= 2) grade = 'grade_c_rapid_progression';
  else if (req.smoker || req.diabetic_hba1c_above_7) grade = 'grade_b_moderate_progression';
  else grade = 'grade_a_slow_progression';
  return { grade };
}

function peri_implantitis(req) {
  ensureBool(req.implant_present, 'implant_present');
  ensureNumber(req.probing_depth_mm, 'probing_depth_mm');
  ensureBool(req.bleeding_on_probing, 'bleeding_on_probing');
  ensureBool(req.purulence_present, 'purulence_present');
  ensureNumber(req.bone_loss_around_implant_mm, 'bone_loss_around_implant_mm');

  let diagnosis;
  if (!req.implant_present) diagnosis = 'no_implant_then_continue_with_review';
  else if (req.probing_depth_mm < 4 && req.bleeding_on_probing === false) diagnosis = 'continue_with_healthy_review';
  else if (req.probing_depth_mm >= 6 && req.bone_loss_around_implant_mm >= 3) diagnosis = 'peri_implantitis_then_continue_with_non_surgical_review';
  else if (req.purulence_present) diagnosis = 'peri_implantitis_then_continue_with_surgical_review';
  else diagnosis = 'peri_mucositis_then_continue_with_OH_review';
  return { diagnosis };
}

function guided_tissue_regeneration(req) {
  ensureBool(req.intraosseous_defect_present, 'intraosseous_defect_present');
  ensureStr(req.defect_morphology, 'defect_morphology');
  ensureEnum(req.defect_morphology, 'defect_morphology', ['three_wall','two_wall','one_wall','horizontal_crestal']);
  ensureBool(req.barrier_membrane_used, 'barrier_membrane_used');
  ensureBool(req.bone_graft_used, 'bone_graft_used');
  ensureBool(req.smoker, 'smoker');

  let decision;
  if (!req.intraosseous_defect_present) decision = 'no_gtr_indicated_then_continue';
  else if (req.defect_morphology === 'three_wall' && req.barrier_membrane_used) decision = 'continue_with_high_predictability_review';
  else if (req.defect_morphology === 'horizontal_crestal') decision = 'continue_with_low_predictability_review';
  else if (req.smoker) decision = 'consider_smoking_cessation_then_review';
  else decision = 'continue_with_standard_gtr_review';
  return { decision };
}

function mucogingival(req) {
  ensureNumber(req.keratinized_tissue_mm, 'keratinized_tissue_mm');
  ensureBool(req.gingival_recession_present, 'gingival_recession_present');
  ensureBool(req.dental_implant_planned, 'dental_implant_planned');
  ensureBool(req.frenum_pull, 'frenum_pull');
  ensureBool(req.graft_used, 'graft_used');

  let plan;
  if (req.keratinized_tissue_mm < 2 && req.dental_implant_planned) plan = 'continue_with_soft_tissue_graft_review';
  else if (req.gingival_recession_present && req.frenum_pull) plan = 'continue_with_frenectomy_then_graft_review';
  else if (req.keratinized_tissue_mm < 2) plan = 'continue_with_graft_review';
  else plan = 'continue_with_standard_review';
  return { plan };
}

function funcs() { return { gingivitis, periodontitis_staging, periodontitis_grading, peri_implantitis, guided_tissue_regeneration, mucogingival }; }
module.exports = { funcs, CITATIONS, ValidationError };
