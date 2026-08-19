// filepath: tier86_card_ext_455_card_imaging_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function echo_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.ef_pct, 'ef');
  ensureEnum(req.wall_motion_abnormalities, 'wma', ['normal','inferior_hypokinesia','anterior_hypokinesia','lateral_hypokinesia','multiple','akinesia','dyskinesia','other','unknown']);
  ensureEnum(req.valve_status, 'valve', ['normal','mild_mr','moderate_mr','severe_mr','mild_ar','moderate_ar','severe_ar','multi_pathology','other','unknown']);
  ensureEnum(req.pah_severity, 'pah', ['none','mild','moderate','severe','unknown']);
  ensureEnum(req.lv_function, 'lv', ['normal_lvef','hfrEF','hfmrEF','hfpef','unknown','other']);
  ensureEnum(req.diastolic_function, 'df', ['normal','grade1','grade2','grade3','indeterminate','unknown','other']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureEnum(req.recommendation, 'rec', ['annual','biannual','q3mo','monthly','sooner','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function stress_test(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.stress_type, 'st', ['exercise','pharmacologic','combined','unknown','other']);
  ensureNum(req.peak_mets, 'pm');
  ensureNum(req.peak_hr, 'ph');
  ensureNum(req.max_predicted_hr, 'mph');
  ensureEnum(req.bp_response, 'br', ['adequate','exaggerated','flat','hypotensive','hypertensive','unknown','other']);
  ensureEnum(req.ecg_changes, 'ec', ['none','st_depression_1mm','st_depression_2mm','st_elevation','t_wave_inversion','arrhythmias','ischemic_pattern','other','unknown']);
  ensureBool(req.chest_pain_reproduced, 'cpr');
  ensureEnum(req.result, 'res', ['negative','positive','equivocal','ischemic_mild','ischemic_severe','inconclusive','other','unknown']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function nuclear_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.study_type, 'st', ['spect','pet','thallium','mibi','dual_isotope','stress_only','rest_only','stress_rest','other']);
  ensureNum(req.summed_stress_score, 'sss');
  ensureNum(req.summed_rest_score, 'srs');
  ensureNum(req.ischemia_pct, 'ip');
  ensureNum(req.scar_pct, 'scar');
  ensureNum(req.ef_stress, 'efs');
  ensureNum(req.lv_volume_stress, 'lvs');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function cardiac_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.study_type, 'st', ['viability','stress_perfusion','aortography','myocarditis','pericarditis','mass','congenital','other','unknown']);
  ensureNum(req.ef_pct, 'ef');
  ensureNum(req.lvedd_mm, 'lvedd');
  ensureNum(req.scar_pct, 'scar');
  ensureBool(req.edema_present, 'edp');
  ensureNum(req.viability_pct, 'viab');
  ensureEnum(req.iron_overload, 'io', ['none','mild','moderate','severe','unknown']);
  ensureEnum(req.pericardial_effusion, 'pe', ['none','trivial','mild','moderate','severe','unknown']);
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function cardiac_ct_angio(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.study_type, 'st', ['coronary_cta','non_coronary','aortic','pulmonary','congenital','other']);
  ensureNum(req.cad_rads, 'cad');
  ensureEnum(req.stenoses_severity, 'ss', ['none','minimal','mild','moderate','severe','unknown']);
  ensureEnum(req.plaque_burden, 'pb', ['none','minimal','mild','moderate','severe','unknown']);
  ensureBool(req.high_risk_plaque, 'hrp');
  ensureNum(req.calcium_score, 'cs');
  ensureEnum(req.symptomatic_class, 'symc', ['asymptomatic','symptomatic','atypical','noncardiac','unknown']);
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { echo_followup, stress_test, nuclear_imaging, cardiac_mri, cardiac_ct_angio }; }
module.exports = { funcs, ValidationError };