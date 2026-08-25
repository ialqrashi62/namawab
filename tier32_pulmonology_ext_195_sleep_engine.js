// filepath: tier32_pulmonology_ext_195_sleep_engine.js
// TIER32_PULMONOLOGY-195: Sleep medicine
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function sleep_study(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.study_type, 'type', ['home_sleep_apnea_test','in_lab_polysomnography','split_night','mslt','mwt','other']);
  ensureNumber(req.ahi, 'ahi');
  ensureNumber(req.odi, 'odi');
  ensureNumber(req.spo2_nadir, 'spo2_min');
  ensureNumber(req.sleep_efficiency_pct, 'eff');
  ensureEnum(req.study_quality, 'qual', ['excellent','adequate','poor','redo_needed','other']);
  let status;
  if (req.study_quality === 'poor' || req.study_quality === 'redo_needed') status = 'study_quality_poor_repeat';
  else if (req.spo2_nadir < 80) status = 'severe_desaturation_review';
  else if (req.sleep_efficiency_pct < 60) status = 'low_sleep_efficiency_review_protocol';
  else status = 'sleep_study_adequate';
  return { status, ahi: req.ahi };
}

function osa_severity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.ahi, 'ahi');
  ensureEnum(req.osa_severity, 'sev', ['normal','mild','moderate','severe','other']);
  ensureEnum(req.symptoms, 'sym', ['none','daytime_sleepiness','snoring','witnessed_apnea','morning_headache','multiple','other']);
  ensureEnum(req.comorbidities, 'comorb', ['none','hypertension','atrial_fibrillation','heart_failure','stroke','multiple','other']);
  ensureBool(req.cpap_prescribed, 'cpap');
  let status;
  if (req.osa_severity === 'severe' && !req.cpap_prescribed) status = 'severe_osa_cpap_indicated';
  else if (req.ahi >= 15 && req.comorbidities === 'hypertension' && !req.cpap_prescribed) status = 'moderate_osa_with_htn_cpap_recommended';
  else if (req.cpap_prescribed && req.ahi >= 15) status = 'osa_cpap_prescribed';
  else if (req.osa_severity === 'mild') status = 'mild_osa_lifestyle_review';
  else status = 'osa_severity_appropriate';
  return { status, sev: req.osa_severity };
}

function cpap_titration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.titration_type, 'type', ['in_lab','auto_titrating','manual','other']);
  ensureNumber(req.optimal_pressure_cm_h2o, 'press');
  ensureNumber(req.ahi_on_pressure, 'ahi_on');
  ensureNumber(req.leak_l_per_min, 'leak');
  ensureEnum(req.mask_fit, 'mask', ['excellent','good','fair','poor','other']);
  ensureEnum(req.adherence_predicted, 'adh', ['excellent','good','suboptimal','poor']);
  let status;
  if (req.ahi_on_pressure >= 5) status = 'cpap_ahi_suboptimal_re_titrate';
  else if (req.leak_l_per_min > 24) status = 'excessive_leak_mask_review';
  else if (req.mask_fit === 'poor') status = 'poor_mask_fit_reassess';
  else if (req.adherence_predicted === 'poor') status = 'predicted_poor_adherence_intervention';
  else status = 'cpap_titration_optimal';
  return { status, p: req.optimal_pressure_cm_h2o };
}

function sleep_hygiene(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.sleep_hours, 'hrs');
  ensureBool(req.bedtime_consistent, 'consistent');
  ensureBool(req.caffeine_after_noon, 'caffeine');
  ensureBool(req.exercise_regularly, 'exercise');
  ensureNumber(req.screen_time_bed, 'screen');
  let status;
  if (req.sleep_hours < 5) status = 'severe_sleep_deprivation_address';
  else if (!req.bedtime_consistent && req.caffeine_after_noon) status = 'poor_sleep_hygiene_education';
  else if (req.screen_time_bed > 60) status = 'screen_time_excessive_reduce';
  else if (req.sleep_hours >= 7 && req.exercise_regularly) status = 'sleep_hygiene_optimal';
  else status = 'sleep_hygiene_review';
  return { status, hrs: req.sleep_hours };
}

function sleep_medication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.medication, 'med', ['melatonin','z-drug','diphenhydramine','trazodone','suvorexant','none','other']);
  ensureNumber(req.dose, 'dose');
  ensureBool(req.chronic_use, 'chronic');
  ensureBool(req.fall_risk, 'fall_risk');
  ensureBool(req.next_review_2_weeks, 'review');
  let status;
  if (req.chronic_use && req.fall_risk) status = 'chronic_z_drug_fall_risk_review_alternative';
  else if (req.medication === 'diphenhydramine' && req.chronic_use) status = 'diphenhydramine_chronic_anticholinergic_risk';
  else if (req.dose > 0 && !req.next_review_2_weeks) status = 'sleep_med_review_2_weeks';
  else status = 'sleep_medication_appropriate';
  return { status, med: req.medication };
}

function funcs() { return { sleep_study, osa_severity, cpap_titration, sleep_hygiene, sleep_medication }; }
module.exports = { funcs, ValidationError };