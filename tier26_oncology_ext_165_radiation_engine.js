// filepath: tier26_oncology_ext_165_radiation_engine.js
// TIER26_ONCOLOGY-165: Radiation oncology, planning, dosimetry
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function radiation_dose(req) {
  ensureStr(req.plan_id, 'plan_id');
  ensureEnum(req.modality, 'modality', ['3d_conformal','imrt','vmat','tomotherapy','stereotactic_radio','srs','sbrt','brachytherapy_high_dose','brachytherapy_low_dose','proton','electron','other']);
  ensureNumber(req.total_dose_gy, 'dose');
  ensureNumber(req.fractions, 'fxs');
  ensureNumber(req.dose_per_fraction_gy, 'dpf');
  ensureStr(req.target_volume, 'target');
  ensureBool(req.image_guidance, 'igrt');
  let status;
  if (req.dose_per_fraction_gy > 8 && req.modality !== 'sbrt' && req.modality !== 'srs') status = 'large_dose_per_fraction_review_protocol';
  else if (req.total_dose_gy > 80) status = 'high_total_dose_review_normal_tissue_tolerance';
  else if (req.modality === 'sbrt' && req.fractions > 8) status = 'sbrt_few_fractions_review';
  else if (!req.image_guidance) status = 'igrt_recommended_for_conformal';
  else status = 'dose_appropriate';
  return { status, total: req.total_dose_gy };
}

function organs_at_risk(req) {
  ensureStr(req.plan_id, 'plan_id');
  ensureStr(req.oar_name, 'oar');
  ensureNumber(req.max_dose_gy, 'max');
  ensureNumber(req.mean_dose_gy, 'mean');
  ensureNumber(req.volume_above_threshold_pct, 'v');
  ensureEnum(req.constraint_met, 'constraint_met', ['met','exceeded_minor','exceeded_major','exceeded_critical','unknown','other']);
  ensureBool(req.action_required, 'action');
  let status;
  if (req.constraint_met === 'exceeded_critical') status = 'critical_exceedance_plan_revision';
  else if (req.constraint_met === 'exceeded_major' && !req.action_required) status = 'major_exceedance_action_required';
  else status = 'oar_constraint_reviewed';
  return { status, oar: req.oar_name };
}

function simulation(req) {
  ensureStr(req.sim_id, 'sim_id');
  ensureEnum(req.position, 'position', ['supine','prone','decubitus_lateral','decubitus_right','sitting','other']);
  ensureEnum(req.immobilization, 'immobilization', ['none','thermoplastic_mask','vacuum_bag','body_fix','alpha_cradle','breast_board','belly_board','head_frame','other']);
  ensureBool(req.ct_simulation, 'ct_sim');
  ensureBool(req.mri_simulation, 'mri_sim');
  ensureBool(req.four_d_ct_done, '4dct');
  ensureNumber(req.slice_thickness_mm, 'slice');
  let status;
  if (!req.ct_simulation) status = 'ct_simulation_required';
  else if (req.slice_thickness_mm > 3) status = 'slice_too_thick_review_target_motion';
  else if (req.modality === 'sbrt' && !req.four_d_ct_done) status = 'sbrt_4dct_required_for_motion';
  else status = 'simulation_appropriate';
  return { status, sim: req.sim_id };
}

function brachy(req) {
  ensureStr(req.plan_id, 'plan_id');
  ensureEnum(req.brachy_type, 'brachy_type', ['intracavitary','interstitial','intraluminal','surface_mold','hdr','ldr','pdr','eye_plaque','other']);
  ensureNumber(req.dose_gy, 'dose');
  ensureNumber(req.dose_rate_cgy_per_h, 'rate');
  ensureNumber(req.treatment_time_h, 'time');
  ensureBool(req.image_guidance, 'us_mri');
  let status;
  if (req.brachy_type === 'eye_plaque' && req.dose_gy > 100) status = 'eye_plaque_dose_high_review_complications';
  else if (req.dose_rate_cgy_per_h > 1200) status = 'very_high_dose_rate_review_normal_tissue';
  else if (!req.image_guidance) status = 'image_guided_brachy_recommended';
  else status = 'brachy_plan_appropriate';
  return { status, type: req.brachy_type };
}

function followup_radiation(req) {
  ensureStr(req.followup_id, 'followup_id');
  ensureNumber(req.days_post_rt, 'days');
  ensureEnum(req.skin_toxicity, 'skin_toxicity', ['none','grade_1','grade_2','grade_3','grade_4','unknown','other']);
  ensureEnum(req.mucositis, 'mucositis', ['none','grade_1','grade_2','grade_3','grade_4','unknown','other']);
  ensureEnum(req.dysphagia, 'dysphagia', ['none','liquid','soft','npo','unknown','other']);
  ensureBool(req.pneumonitis_suspected, 'pneumonitis');
  let status;
  if (req.mucositis === 'grade_4' || req.skin_toxicity === 'grade_4') status = 'grade_4_toxicity_inpatient_review';
  else if (req.pneumonitis_suspected) status = 'pneumonitis_steroid_review';
  else if (req.dysphagia === 'npo') status = 'npo_supplementary_feeding_review';
  else status = 'followup_appropriate';
  return { status, days: req.days_post_rt };
}

const CITATIONS = { ASTRO_2024: 'ASTRO 2024', ICRU_2024: 'ICRU 2024', ABS_2024: 'ABS 2024' };

function funcs() { return { radiation_dose, organs_at_risk, simulation, brachy, followup_radiation }; }
module.exports = { funcs, CITATIONS, ValidationError };