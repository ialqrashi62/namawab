// filepath: tier30_hematology_ext_185_stem_cell_engine.js
// TIER30_HEMATOLOGY-185: Stem cell collection and transplant
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function mobilization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.regimen, 'regimen', ['plerixafor_only','gcsf_only','chemo_mobilization','chemo_plerixafor','other']);
  ensureNumber(req.cd34_target, 'cd34_target');
  ensureNumber(req.cd34_collected, 'cd34_collected');
  ensureNumber(req.collection_day, 'day');
  ensureBool(req.chemo_mobilization, 'chemo');
  let status;
  if (req.cd34_collected < req.cd34_target) status = 'mobilization_inadequate_plerixafor_repeat';
  else if (req.cd34_collected >= req.cd34_target * 1.5) status = 'mobilization_excellent_proceed';
  else status = 'mobilization_target_achieved';
  return { status, yield: req.cd34_collected };
}

function collection(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.cd34_count, 'cd34');
  ensureNumber(req.product_volume, 'vol_ml');
  ensureNumber(req.viability_pct, 'viability');
  ensureNumber(req.target_yield, 'target');
  ensureNumber(req.collected_yield, 'collected');
  let status;
  if (req.viability_pct < 80) status = 'low_viability_quality_review';
  else if (req.collected_yield >= req.target_yield) status = 'collection_target_achieved_proceed_to_processing';
  else status = 'collection_below_target_repeat_session';
  return { status, yield: req.collected_yield };
}

function processing(req) {
  ensureStr(req.product_id, 'product_id');
  ensureEnum(req.processing_method, 'method', ['volume_reduction','red_cell_depletion','plasma_reduction','cd34_selection','t_cell_depletion','other']);
  ensureNumber(req.cd34_count, 'cd34');
  ensureNumber(req.cell_viability_pct, 'viability');
  ensureBool(req.red_cell_depletion, 'rcd');
  ensureBool(req.plasma_reduction, 'prd');
  let status;
  if (req.cell_viability_pct < 70) status = 'low_post_processing_viability_quality_review';
  else if (req.cell_viability_pct >= 80 && req.cd34_count > 0) status = 'processing_completed_proceed_to_cryo';
  else status = 'processing_completed';
  return { status, viable: req.cell_viability_pct };
}

function cryopreservation(req) {
  ensureStr(req.product_id, 'product_id');
  ensureEnum(req.cryoprotectant, 'cryo', ['dmso_5','dmso_10','dmso_7_5','other']);
  ensureEnum(req.freeze_method, 'freeze', ['controlled_rate','uncontrolled_vapor','uncontrolled_mr_freeze','other']);
  ensureNumber(req.storage_temp, 'temp');
  ensureNumber(req.cell_viability_post, 'viab_post');
  ensureNumber(req.thaw_recovery_pct, 'thaw_rec');
  let status;
  if (req.storage_temp > -150) status = 'storage_temp_warm_review';
  else if (req.thaw_recovery_pct < 70) status = 'low_thaw_recovery_quality_review';
  else if (req.cell_viability_post < 75) status = 'low_post_freeze_viability_review';
  else status = 'cryopreservation_successful';
  return { status, recovery: req.thaw_recovery_pct };
}

function engraftment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.transplant_id, 'transplant_id');
  ensureNumber(req.neutrophil_engraftment_day, 'neut_day');
  ensureNumber(req.platelet_engraftment_day, 'plt_day');
  ensureNumber(req.chimerism_pct, 'chimerism');
  ensureEnum(req.gvhd_grade, 'gvhd', ['none','grade_1','grade_2','grade_3','grade_4','chronic_mild','chronic_moderate','chronic_severe','other']);
  let status;
  if (req.gvhd_grade === 'grade_3' || req.gvhd_grade === 'grade_4') status = 'severe_agvhd_urgent_treatment';
  else if (req.neutrophil_engraftment_day > 21) status = 'delayed_neutrophil_engraftment_review';
  else if (req.chimerism_pct < 50) status = 'low_chimerism_graft_failure_risk';
  else if (req.gvhd_grade === 'none' && req.neutrophil_engraftment_day <= 14) status = 'engraftment_successful';
  else status = 'engraftment_stable';
  return { status, chimerism: req.chimerism_pct };
}

function funcs() { return { mobilization, collection, processing, cryopreservation, engraftment }; }
module.exports = { funcs, ValidationError };