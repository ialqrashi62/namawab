// filepath: tier32_pulmonology_ext_193_copd_engine.js
// TIER32_PULMONOLOGY-193: COPD
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function copd_staging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.fev1_pct, 'fev1');
  ensureNumber(req.fvc_pct, 'fvc');
  ensureNumber(req.smoking_pack_years, 'pack_yrs');
  ensureEnum(req.symptoms, 'symptoms', ['none','chronic_cough','chronic_cough_dyspnea','severe_dyspnea','other']);
  ensureNumber(req.exacerbations_per_year, 'exa');
  let stage;
  if (req.fev1_pct >= 80) stage = 'gold_1_mild';
  else if (req.fev1_pct >= 50) stage = 'gold_2_moderate';
  else if (req.fev1_pct >= 30) stage = 'gold_3_severe';
  else stage = 'gold_4_very_severe';
  let status;
  if (req.exacerbations_per_year >= 2 && stage === 'gold_3_severe') status = 'gold_d_frequent_exacerbations_high_risk';
  else if (req.exacerbations_per_year >= 2) status = 'gold_d_frequent_exacerbations';
  else if (stage === 'gold_4_very_severe') status = 'gold_4_refer_lung_transplant';
  else status = 'copd_staging_classified';
  return { status, stage };
}

function exacerbation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.copd_severity, 'sev', ['gold_a','gold_b','gold_c','gold_d','other']);
  ensureEnum(req.exacerbation_type, 'type', ['mild','moderate','severe','very_severe','other']);
  ensureEnum(req.trigger, 'trigger', ['infection','environmental','medication','unknown','other']);
  ensureNumber(req.spo2, 'spo2');
  ensureNumber(req.ph, 'ph');
  ensureEnum(req.treated_with, 'rx', ['steroids_only','antibiotics_only','steroids_antibiotics','supportive','invasive_vent','other']);
  let status;
  if (req.exacerbation_type === 'very_severe' && req.spo2 < 85) status = 'severe_exacerbation_icu_candidate';
  else if (req.ph < 7.30) status = 'acidemic_exacerbation_consider_niv';
  else if (req.spo2 < 88 && req.exacerbation_type === 'severe') status = 'severe_hypoxemia_oxygen_review';
  else if (req.treated_with === 'steroids_antibiotics') status = 'exacerbation_standard_treatment';
  else status = 'exacerbation_appropriate';
  return { status, type: req.exacerbation_type };
}

function oxygen_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.spo2_rest, 'spo2_r');
  ensureNumber(req.spo2_exercise, 'spo2_e');
  ensureBool(req.ltot_indicated, 'ltot');
  ensureNumber(req.oxygen_flow_l_min, 'flow');
  ensureNumber(req.oxygen_duration_h, 'duration');
  let status;
  if (req.spo2_rest < 88 && req.ltot_indicated && req.oxygen_duration_h < 15) status = 'ltot_duration_inadequate_extend';
  else if (req.spo2_rest < 88 && !req.ltot_indicated) status = 'ltot_indicated_initiate';
  else if (req.spo2_exercise < 88 && req.oxygen_flow_l_min < 2) status = 'ambulatory_oxygen_recommend';
  else if (req.spo2_rest >= 88 && req.oxygen_duration_h >= 15) status = 'ltot_appropriate';
  else status = 'oxygen_therapy_review';
  return { status, dur: req.oxygen_duration_h };
}

function pulmonary_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.program_enrolled, 'enrolled');
  ensureNumber(req.sessions_completed, 'sessions');
  ensureNumber(req.walk_distance_m, 'distance');
  ensureNumber(req.dyspnea_score, 'dyspnea');
  ensureEnum(req.adherence, 'adh', ['excellent','good','suboptimal','poor']);
  let status;
  if (!req.program_enrolled) status = 'refer_pulmonary_rehab';
  else if (req.adherence === 'poor' && req.sessions_completed < 12) status = 'rehab_adherence_poor_engagement';
  else if (req.walk_distance_m >= 350 && req.dyspnea_score <= 5) status = 'rehab_response_favorable';
  else if (req.sessions_completed < 12) status = 'rehab_in_progress_continue';
  else status = 'rehab_completed_review_outcomes';
  return { status, d: req.walk_distance_m };
}

function smoking_cessation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.cigarettes_per_day, 'cigs');
  ensureNumber(req.years_smoking, 'yrs');
  ensureBool(req.nicotine_replacement, 'nrt');
  ensureBool(req.varenicline_started, 'var');
  ensureEnum(req.cessation_attempt, 'att', ['active','planning','declined','not_ready','other']);
  let status;
  if (req.cigarettes_per_day >= 20 && req.cessation_attempt === 'active' && !req.nicotine_replacement) status = 'high_dependence_nrt_initiate';
  else if (req.years_smoking >= 30 && req.cigarettes_per_day >= 15 && !req.varenicline_started) status = 'heavy_smoker_varenicline_consider';
  else if (req.cessation_attempt === 'declined') status = 'declined_motivational_interview';
  else if (req.nicotine_replacement && req.cessation_attempt === 'active') status = 'cessation_active_follow_up';
  else status = 'cessation_appropriate';
  return { status, cigs: req.cigarettes_per_day };
}

function funcs() { return { copd_staging, exacerbation, oxygen_therapy, pulmonary_rehab, smoking_cessation }; }
module.exports = { funcs, ValidationError };