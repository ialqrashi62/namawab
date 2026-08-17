// filepath: tier40_ophthalmology_ext_233_glaucoma_engine.js
// TIER40_OPHTHALMOLOGY-233: Glaucoma
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function glaucoma_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.iop_right, 'iop_r');
  ensureNumber(req.iop_left, 'iop_l');
  ensureNumber(req.cup_disc_ratio_right, 'cdr');
  ensureEnum(req.visual_field, 'vf', ['normal','mild_defect_superior','mild_defect_inferior','moderate_defect','severe_defect','not_done','other']);
  ensureEnum(req.angle, 'angle', ['open','narrow','closed','closed_attack','unknown','other']);
  ensureBool(req.family_history, 'fhx');
  let status;
  if (req.angle === 'closed_attack') status = 'angle_closure_emergency_laser_peripheral';
  else if (req.angle === 'narrow' && req.iop_right >= 30) status = 'narrow_angle_iop_high_yag_laser';
  else if (req.iop_right >= 24 && req.cup_disc_ratio_right >= 0.6) status = 'glaucoma_suspicion_oct_repeat_field';
  else if (req.family_history && req.iop_right >= 22) status = 'family_history_elevated_iop_screen';
  else status = 'glaucoma_screening_review';
  return { status, ang: req.angle };
}

function glaucoma_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.diagnosis, 'dx', ['poag','ntg','pacg','secondary','juvenile','congenital','suspect','other']);
  ensureEnum(req.current_drug, 'drug', ['prostaglandin','beta_blocker','alpha_agonist','carbonic_anhydrase','rho_kinase','combination','latanoprost','timolol','dorzolamide','brimonidine','none','other']);
  ensureEnum(req.compliance, 'adh', ['excellent','good','suboptimal','poor','unknown']);
  ensureEnum(req.side_effects, 'se', ['none','redness','stinging','dry_eye','lash_growth','conjunctival_hyperemia','systemic','other']);
  ensureNumber(req.target_iop, 'target');
  let status;
  if (req.side_effects !== 'none') status = 'side_effect_review_drug_change';
  else if (req.compliance === 'poor') status = 'poor_compliance_education_review';
  else if (req.current_drug === 'none' && req.diagnosis !== 'suspect') status = 'glaucoma_no_treatment_initiate';
  else status = 'glaucoma_treatment_maintain';
  return { status, d: req.drug };
}

function glaucoma_progression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.md_slope, 'slope');
  ensureBool(req.vfl_fast, 'fast');
  ensureBool(req.oct_rnfl_thinning, 'oct');
  ensureNumber(req.follow_up_months, 'fup');
  ensureEnum(req.progression, 'prog', ['stable','slow','moderate','rapid','unknown','other']);
  let status;
  if (req.progression === 'rapid' && req.md_slope < -1) status = 'rapid_progression_escalate_trabeculectomy';
  else if (req.vfl_fast) status = 'fast_vfl_lowering_target_iop';
  else if (req.oct_rnfl_thinning && req.progression === 'slow') status = 'rnfl_thinning_monitor_review';
  else if (req.progression === 'stable') status = 'glaucoma_stable_continue';
  else status = 'progression_review';
  return { status, slope: req.md_slope };
}

function glaucoma_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['trabeculectomy','tube_shunt','migs','iStent','hydrus','goniotomy','cyclophoto','cyclocryo','deep_sclerectomy','other']);
  ensureEnum(req.indication, 'ind', ['uncontrolled_iop','progression_on_max_meds','intolerance_to_meds','patient_choice','failed_prior_surgery','angle_closure','other']);
  ensureNumber(req.pre_iop, 'pre');
  ensureNumber(req.post_iop_target, 'target');
  ensureEnum(req.complications, 'comp', ['none','hyphema','hypotony','bleb_leak','infection','choroidal_detachment','other']);
  let status;
  if (req.complications === 'infection') status = 'post_op_endophthalmitis_urgent';
  else if (req.complications === 'hypotony') status = 'hypotony_review_bleb_revision';
  else if (req.post_iop_target >= 18) status = 'post_op_iop_target_too_high_lower';
  else if (req.pre_iop >= 30 && req.type === 'trabeculectomy') status = 'trabeculectomy_high_iop_appropriate';
  else status = 'glaucoma_surgery_review';
  return { status, t: req.type };
}

function iop_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.last_iop, 'iop');
  ensureNumber(req.fluctuation, 'fluc');
  ensureBool(req.diurnal_curve_done, 'diurnal');
  ensureEnum(req.compliance, 'adh', ['excellent','good','suboptimal','poor','unknown']);
  ensureBool(req.next_review_3_months, 'fup');
  let status;
  if (req.fluctuation >= 6) status = 'high_fluctuation_diurnal_curve_repeat';
  else if (req.last_iop >= 25) status = 'iop_elevated_review';
  else if (req.diurnal_curve_done === false && req.fluctuation >= 4) status = 'diurnal_curve_recommended';
  else if (req.compliance === 'suboptimal' || req.compliance === 'poor') status = 'compliance_review';
  else status = 'iop_monitoring_appropriate';
  return { status, iop: req.last_iop };
}

function funcs() { return { glaucoma_diagnosis, glaucoma_treatment, glaucoma_progression, glaucoma_surgery, iop_monitoring }; }
module.exports = { funcs, ValidationError };