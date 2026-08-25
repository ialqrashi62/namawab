// filepath: tier5_psych_ext_106_sud_sz_engine.js
// TIER5_PSYCH_EXT-106: SUD + schizophrenia (withdrawal, AUD, MAT, sz onset, Clozapine)
'use strict';

const CITATIONS = [
  'ASAM_Placement_2023',
  'NICE_Alcohol_Use_Disorder_2023',
  'Bushnell_AUDIT_C_2018',
  'Kane_Clozapine_2019',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function withdrawal_risk(req) {
  ensureStr(req.substance, 'substance');
  ensureEnum(req.substance, 'substance', ['alcohol','benzodiazepine','opioid','stimulant','gabaergic']);
  ensureNumber(req.last_use_hours, 'last_use_hours');
  ensureNumber(req.daily_use_grams_or_units, 'daily_use_grams_or_units');
  ensureNumber(req.ciwa_ar_score, 'ciwa_ar_score'); // alcohol specific
  ensureStr(req.hx_seizure_or_dt, 'hx_seizure_or_dt');
  ensureEnum(req.hx_seizure_or_dt, 'hx_seizure_or_dt', ['yes','no','unknown']);
  ensureNumber(req.systolic_bp, 'systolic_bp');

  let triage;
  if (req.substance === 'alcohol' && (req.ciwa_ar_score >= 10 || req.hx_seizure_or_dt === 'yes')) triage = 'inpatient_detox_indicated_benzodiazepine_protocol';
  else if (req.substance === 'opioid' && req.last_use_hours >= 12) triage = 'commence_buprenorphine_or_methadone_withdrawal_protocol';
  else if (req.substance === 'benzodiazepine' && req.daily_use_grams_or_units >= 30) triage = 'inpatient_taper_long_acting_benzodiazepine';
  else if (req.systolic_bp >= 160 || req.daily_use_grams_or_units >= 200) triage = 'consider_inpatient_if_alcohol_severe';
  else triage = 'community_withdrawal_program_daily_review';

  return { substance: req.substance, triage, last_use_hours: req.last_use_hours, ciwa_ar_score: req.ciwa_ar_score, citations: CITATIONS };
}

function audit_c(req) {
  ensureNumber(req.q1, 'q1'); ensureNumber(req.q2, 'q2'); ensureNumber(req.q3, 'q3'); ensureNumber(req.q4, 'q4'); ensureNumber(req.q5, 'q5'); ensureNumber(req.q6, 'q6');
  ensureBool(req.q7, 'q7'); ensureBool(req.q8, 'q8'); ensureBool(req.q9, 'q9'); ensureBool(req.q10, 'q10');
  for (let i = 1; i <= 6; i++) {
    const v = req[`q${i}`];
    if (!Number.isInteger(v) || v < 0 || v > 4) throw new ValidationError(`q${i} 0..4`, `q${i}`);
  }
  const total = [1,2,3,4,5,6].reduce((s,i)=>s+req[`q${i}`],0) + (req.q7|0) + (req.q8|0) + (req.q9|0) + (req.q10|0);
  let risk;
  if (total <= 7) risk = 'low_risk';
  else if (total <= 15) risk = 'harmful_or_high_risk_drinking_brief_advice';
  else risk = 'dependence_refer_for_assessment';
  return { auditc_total: total, risk, citation: CITATIONS[2] };
}

function mat_protocol(req) {
  ensureStr(req.substance, 'substance');
  ensureEnum(req.substance, 'substance', ['opioid','alcohol']);
  ensureNumber(req.daily_dose, 'daily_dose');
  ensureStr(req.therapy_type, 'therapy_type');
  ensureEnum(req.therapy_type, 'therapy_type', ['methadone','buprenorphine','naltrexone','acamprosate','disulfiram']);

  let approach;
  if (req.substance === 'opioid' && req.therapy_type === 'buprenorphine') approach = 'induction_withdrawal_test_then_up_to_16mg_per_day_then_reassess_2_4_weeks';
  else if (req.substance === 'opioid' && req.therapy_type === 'methadone') approach = 'start_30mg_daily_then_titrate_up_to_120mg_max';
  else if (req.substance === 'alcohol' && req.therapy_type === 'naltrexone') approach = 'after_3_to_7_days_of_abstinence_then_50mg_daily_then_review_4_weeks';
  else if (req.substance === 'alcohol' && req.therapy_type === 'acamprosate') approach = 'three_times_per_day_dosing_persistent_tolerance_after_weeks_1';
  else if (req.substance === 'alcohol' && req.therapy_type === 'disulfiram') approach = 'daily_or_twice_weekly_under_supervision';
  else approach = 'generalize_protocols';

  return { substance: req.substance, therapy_type: req.therapy_type, plan: approach, citations: CITATIONS };
}

function sz_onset(req) {
  ensureNumber(req.age_at_onset, 'age_at_onset');
  ensureBool(req.psychosis_symptoms, 'psychosis_symptoms');
  ensureBool(req.negative_symptoms, 'negative_symptoms');
  ensureNumber(req.duration_days, 'duration_days');
  ensureNumber(req.functioning_change_pct, 'functioning_change_pct');

  if (req.duration_days < 30 || req.functioning_change_pct < 30) {
    return { diagnosis_pattern: 'psychosis_not_yet_diagnosable_at_psychotic_disorder_CIE_WATCHED_FOR_3_TO_6_MONTHS', citation: CITATIONS[3] };
  }
  if (req.age_at_onset < 13 || req.age_at_onset > 40) return { diagnosis_pattern: 'consider_atypical_onset_red_flags_neuro_eval' };
  if (req.negative_symptoms && !req.psychosis_symptoms) return { diagnosis_pattern: 'differential_consider_schizoaffective_or_other_subtype' };
  return { diagnosis_pattern: 'likely_schizophrenia_or_spectrum_dsm5_fu', citation: CITATIONS[3] };
}

function clozapine_candidate(req) {
  ensureNumber(req.failed_atypicals, 'failed_atypicals');
  ensureBool(req.treatment_resistant, 'treatment_resistant');
  ensureNumber(req.absolute_neutrophil_count, 'absolute_neutrophil_count');
  ensureBool(req.suicide_risk_active, 'suicide_risk_active');
  ensureNumber(req.egfr, 'egfr');

  if (req.absolute_neutrophil_count < 1500 || req.egfr < 30) return { verdict: 'not_a_candidate_hematologic_or_renal_contraindication' };

  if (req.treatment_resistant || req.failed_atypicals >= 2) {
    return { verdict: 'clozapine_indicated_start_with_ANM_monitoring_per_protocol' };
  }
  if (req.suicide_risk_active) {
    return { verdict: 'clozapine_indicated_for_suicidality_per_intercept_Trial' };
  }
  return { verdict: 'continue_first_or_second_line_for_3_months_then_re_evaluate' };
}

function funcs() {
  return { withdrawal_risk, audit_c, mat_protocol, sz_onset, clozapine_candidate };
}

module.exports = { funcs, CITATIONS, ValidationError };
