// filepath: tier41_obstetrics_ext_239_fetal_mon_engine.js
// TIER41_OB-239: Fetal monitoring
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function non_stress_test(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureNumber(req.duration_min, 'dur');
  ensureEnum(req.accelerations, 'acc', ['present','absent','inadequate','unknown','other']);
  ensureNumber(req.baseline_fhr, 'fhr');
  ensureEnum(req.result, 'res', ['reactive','non_reactive','reassuring','non_reassuring','inconclusive','other']);
  let status;
  if (req.result === 'non_reactive' && req.gestational_age_weeks < 32) status = 'non_reactive_preterm_repeat_bpp';
  else if (req.result === 'non_reactive' && req.gestational_age_weeks >= 32) status = 'non_reactive_term_bpp_contraction_stress';
  else if (req.accelerations === 'absent') status = 'no_acceleration_extend_test';
  else if (req.result === 'reactive') status = 'reactive_nst_reassuring';
  else status = 'nst_review';
  return { status, res: req.result };
}

function biophysical_profile(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureNumber(req.breathing, 'breath');
  ensureNumber(req.body_movement, 'bm');
  ensureNumber(req.muscle_tone, 'tone');
  ensureNumber(req.amniotic_fluid, 'af');
  ensureNumber(req.nst, 'nst');
  ensureNumber(req.total, 'total');
  let status;
  if (req.total < 4) status = 'bpp_less_4_delivery_recommendation';
  else if (req.total >= 4 && req.total < 6) status = 'bpp_4_6_repeat_in_24h';
  else if (req.total >= 8) status = 'bpp_8_reassuring';
  else if (req.amniotic_fluid < 2) status = 'low_af_amniotic_fluid_review';
  else status = 'bpp_review';
  return { status, total: req.total };
}

function amniotic_fluid_index(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.afi, 'afi');
  ensureNumber(req.gestational_age_weeks, 'ga');
  ensureBool(req.polyhydramnios, 'poly');
  ensureBool(req.oligohydramnios, 'oligo');
  ensureEnum(req.follow_up, 'fup', ['1','1_week','2_weeks','4_weeks','other']);
  let status;
  if (req.afi < 5 || req.oligohydramnios) status = 'oligohydramnios_etiology_induction';
  else if (req.afi > 24 || req.polyhydramnios) status = 'polyhydramnios_evaluate_diabetes_anomaly';
  else if (req.afi >= 8 && req.afi <= 24 && req.gestational_age_weeks < 37) status = 'normal_afi_continue_antenatal';
  else status = 'afi_review';
  return { status, afi: req.afi };
}

function doppler_ultrasound(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.umbilical_artery_s_d_ratio, 'sd');
  ensureEnum(req.ductus_venosus, 'dv', ['normal','abnormal','absent_a_wave','reversed_a_wave','not_done','other']);
  ensureEnum(req.middle_cerebral_artery, 'mca', ['normal','redistribution_low_ria','redistribution_high_ria','not_done','other']);
  ensureEnum(req.interpretation, 'interp', ['normal','increased_resistance','absent_end_diastolic','reversed_end_diastolic','brain_sparing','other']);
  ensureEnum(req.surveillance, 'surv', ['weekly','biweekly','twice_weekly','daily','delivery','other']);
  let status;
  if (req.interpretation === 'reversed_end_diastolic') status = 'reversed_end_diastolic_urgent_delivery';
  else if (req.interpretation === 'brain_sparing') status = 'brain_sparing_intensive_monitoring';
  else if (req.ductus_venosus === 'reversed_a_wave') status = 'reversed_dv_wave_term_delivery';
  else if (req.interpretation === 'increased_resistance') status = 'increased_resistance_weekly_surveillance';
  else status = 'doppler_review';
  return { status, sd: req.umbilical_artery_s_d_ratio };
}

function fetal_heart_rate(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.baseline, 'bl');
  ensureEnum(req.variability, 'var', ['absent','minimal','moderate','marked','sinusoidal','unknown','other']);
  ensureEnum(req.accelerations, 'acc', ['present','absent','inadequate','unknown','other']);
  ensureEnum(req.decelerations, 'dec', ['none','early','variable','late','prolonged','unknown','other']);
  ensureEnum(req.category, 'cat', ['category_1','category_2','category_3','other']);
  let status;
  if (req.category === 'category_3') status = 'category_3_emergent_delivery';
  else if (req.category === 'category_2' && req.variability === 'minimal') status = 'category_2_minimal_var_resuscitate';
  else if (req.category === 'category_2' && req.decelerations === 'late') status = 'category_2_late_dec_intrauterine_resus';
  else if (req.category === 'category_1') status = 'category_1_reassuring_continue';
  else status = 'fhr_review';
  return { status, cat: req.category };
}

function funcs() { return { non_stress_test, biophysical_profile, amniotic_fluid_index, doppler_ultrasound, fetal_heart_rate }; }
module.exports = { funcs, ValidationError };