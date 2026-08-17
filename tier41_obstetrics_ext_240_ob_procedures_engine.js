// filepath: tier41_obstetrics_ext_240_ob_procedures_engine.js
// TIER41_OB-240: OB procedures
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function amniocentesis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureEnum(req.indication, 'ind', ['advanced_maternal_age','abnormal_screen','previous_anomaly','patient_choice','twins','isoimmunization','other']);
  ensureEnum(req.fluid_color, 'color', ['clear','bloody','meconium','brown','none','other']);
  ensureEnum(req.karyotype, 'k', ['normal','trisomy_21','trisomy_18','trisomy_13','monosomy_x','other_anomaly','pending','failed','other']);
  ensureEnum(req.complications, 'comp', ['none','spotting','leakage','infection','fetal_loss','rhes_isoimmunization','other']);
  let status;
  if (req.complications === 'fetal_loss') status = 'amniocentesis_loss_urgent_review';
  else if (req.complications === 'leakage') status = 'amnio_leakage_prom_review';
  else if (req.karyotype === 'trisomy_21') status = 'trisomy_21_counseling_options';
  else if (req.fluid_color === 'bloody' && req.karyotype === 'pending') status = 'bloody_fluid_repeat_review';
  else if (req.karyotype === 'normal') status = 'normal_karyotype_reassure';
  else status = 'amnio_review';
  return { status, k: req.karyotype };
}

function cvs(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureEnum(req.placental_location, 'loc', ['anterior','posterior','fundal','lateral','previa','unknown','other']);
  ensureEnum(req.sample_quality, 'qual', ['adequate','inadequate','insufficient','pending','other']);
  ensureEnum(req.karyotype, 'k', ['normal','trisomy_21','trisomy_18','trisomy_13','monosomy_x','other_anomaly','pending','failed','other']);
  ensureEnum(req.complications, 'comp', ['none','spotting','fetal_loss','limb_reduction','rhes_isoimmunization','other']);
  let status;
  if (req.complications === 'fetal_loss') status = 'cvs_loss_counsel';
  else if (req.complications === 'limb_reduction') status = 'cvs_limb_reduction_review';
  else if (req.karyotype === 'trisomy_21') status = 'trisomy_21_counseling_options';
  else if (req.sample_quality === 'inadequate') status = 'inadequate_sample_repeat_amniocentesis';
  else if (req.karyotype === 'normal') status = 'normal_karyotype_reassure';
  else status = 'cvs_review';
  return { status, k: req.karyotype };
}

function cerclage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureEnum(req.type, 'type', ['mcDonald','shirodkar','transabdominal','none','other']);
  ensureNumber(req.prior_loss, 'loss');
  ensureNumber(req.cervical_length_mm, 'cl');
  ensureBool(req.placement_successful, 'succ');
  let status;
  if (req.gestational_age_weeks >= 24 && req.placement_successful) status = 'late_cerclage_outcomes_guarded';
  else if (req.cervical_length_mm < 10 && req.type === 'mcDonald') status = 'short_cx_physical_exam_indicated_history_indicated';
  else if (req.prior_loss >= 3 && req.placement_successful) status = 'history_indicated_cerclage_placed';
  else if (req.prior_loss === 1 && req.placement_successful && req.gestational_age_weeks < 16) status = 'history_indicated_single_loss_reasonable';
  else status = 'cerclage_review';
  return { status, t: req.type };
}

function version(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureEnum(req.presentation, 'pres', ['cephalic','breech','transverse','oblique','other']);
  ensureEnum(req.version_type, 'type', ['external_cephalic','internal_podalic','none','other']);
  ensureBool(req.success, 'succ');
  ensureEnum(req.fhr_post, 'fhr', ['reassuring','non_reassuring','absent','other']);
  let status;
  if (req.success && req.presentation === 'breech' && req.fhr_post === 'reassuring') status = 'ecv_successful_monitor';
  else if (req.success === false && req.fhr_post === 'non_reassuring') status = 'ecv_failed_non_reassuring_urgent_delivery';
  else if (req.success === false && req.presentation === 'breech') status = 'ecv_failed_breech_delivery_planning';
  else if (req.fhr_post === 'absent') status = 'fetal_bradycardia_post_ecv_resuscitate';
  else status = 'version_review';
  return { status, v: req.version_type };
}

function induction_labor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureNumber(req.bishop_score, 'bishop');
  ensureEnum(req.method, 'method', ['misoprostol','oxytocin','mechanical_foley','membrane_rupture','misoprostol_then_oxytocin','combination','observation','other']);
  ensureEnum(req.response, 'resp', ['progressing','favorable','unfavorable','failed','pending','other']);
  ensureEnum(req.fhr, 'fhr', ['reassuring','non_reassuring','absent','other']);
  let status;
  if (req.bishop_score < 6 && req.method === 'oxytocin') status = 'low_bishop_cervical_ripening_first';
  else if (req.response === 'failed' && req.bishop_score < 6) status = 'failed_induction_cervical_ripening_repeat';
  else if (req.fhr === 'non_reassuring' && req.method === 'misoprostol') status = 'non_reassuring_fhr_tachysystole_review';
  else if (req.response === 'progressing' && req.bishop_score >= 6) status = 'induction_progressing_continue';
  else status = 'induction_review';
  return { status, m: req.method };
}

function funcs() { return { amniocentesis, cvs, cerclage, version, induction_labor }; }
module.exports = { funcs, ValidationError };