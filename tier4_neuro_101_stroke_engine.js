'use strict';
// TIER4_NEURO-101 Stroke
const CITATIONS = [
  { id: 'AHA-2024', source: 'AHA/ASA Acute Ischemic Stroke Guidelines', year: 2024 },
  { id: 'ESO-2024', source: 'European Stroke Organisation', year: 2024 }
];
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = 'VALIDATION_FAILED';
  }
}
function ensureNumber(obj, key, min, max) {
  const v = obj[key];
  if (v === undefined || v === null) throw new ValidationError(`${key} required`, key);
  const n = Number(v);
  if (Number.isNaN(n)) throw new ValidationError(`${key} not numeric`, key);
  if (min !== undefined && n < min) throw new ValidationError(`${key} < ${min}`, key);
  if (max !== undefined && n > max) throw new ValidationError(`${key} > ${max}`, key);
  return n;
}
function ensureEnum(obj, key, allowed) {
  const v = obj[key];
  if (!allowed.includes(v)) throw new ValidationError(`${key} must be one of ${allowed.join(',')}`, key);
  return v;
}
function acuteStrokeTriage(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const lkw_min = ensureNumber(input, 'last_known_well_min', 0, 2880);
  const nihss = ensureNumber(input, 'nihss', 0, 42);
  const ct_negative = input.ct_hyperdensity_absence === true;
  const ct_angio_lvo = input.ct_angio_lvo === true;
  const inr = ensureNumber(input, 'inr', 0, 10);
  const platelet = ensureNumber(input, 'platelet_count', 0, 1000);
  const tb_sugar = ensureNumber(input, 'glucose_mg_dl', 0, 800);
  const systolic = ensureNumber(input, 'sbp', 0, 300);
  const diastolic = ensureNumber(input, 'dbp', 0, 200);
  const eligible_ivt = lkw_min <= 270 && ct_negative && inr < 1.7 && platelet >= 100000 && tb_sugar >= 50 && systolic < 185 && diastolic < 110;
  const eligible_thrombectomy = lkw_min <= 1440 && ct_angio_lvo && nihss >= 6;
  const therapy = {
    iv_alteplase: eligible_ivt ? 'altplase_0_9mg_kg_10_percent_bolus_60_min' : 'not_indicated',
    tenecteplase: eligible_ivt ? 'tenecteplase_0_25mg_kg_bolus_alternative' : 'not_indicated',
    thrombectomy: eligible_thrombectomy ? 'refer_angiosuite_immediate' : 'consider_extended_window',
    bp_target: 'sbp_below_185_dbp_below_110_thrombolysis_then_below_185_x24h',
    antithrombotic: 'aspirin_24h_post_thrombolysis_or_immediately_if_no_ivt'
  };
  return {
    module: 'tier4_neuro_101_triage',
    patient_id: patientId,
    lkw_min,
    nihss,
    eligible_ivt,
    eligible_thrombectomy,
    therapy,
    monitoring: 'q15min_neuro_until_24h_then_q1h',
    citations: CITATIONS
  };
}
function strokeEtiology(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const etiology = ensureEnum(input, 'etiology', ['large_artery_atherosclerosis', 'cardioembolic', 'small_vessel', 'cryptogenic', 'other']);
  const afib = input.afib_known === true;
  const iph = ensureEnum(input, 'imaging_finding', ['small_subcortical', 'cortical_branch', 'large_territory', 'lacunar', 'hemorrhagic', 'normal']);
  const therapy = {
    large_artery: 'antiplatelet_high_intensity_statin_then_endarterectomy_if_stenosable',
    cardioembolic: 'anticoagulation_noac_preferred_distinct',
    small_vessel: 'antiplatelet_bp_control',
    cryptogenic: 'ambulatory_event_monitor_3y_pfo_closure_if_pfo',
    secondary_prevention: 'lifestyle_statin_bp_glycemic_unified'
  };
  return {
    module: 'tier4_neuro_101_etiology',
    patient_id: patientId,
    etiology,
    afib,
    imaging_finding: iph,
    therapy: therapy[etiology],
    citations: CITATIONS
  };
}
function intracerebralHemorrhage(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ich_volume_ml = ensureNumber(input, 'ich_volume_ml', 0, 200);
  const systolic = ensureNumber(input, 'sbp', 0, 300);
  const gcs = ensureNumber(input, 'gcs', 3, 15);
  const warfarin = input.on_warfarin === true;
  const doac = input.on_doac === true;
  const inr = ensureNumber(input, 'inr', 0, 10);
  const surgery = ich_volume_ml > 30 && gcs <= 8;
  const reversal = warfarin ? '4_factor_pcc_plus_vitamin_k_10mg_iv' : (doac ? 'andexanet_alpha_factor_xa_inhibitor_reversal' : 'none');
  return {
    module: 'tier4_neuro_101_ich',
    patient_id: patientId,
    ich_volume_ml,
    systolic,
    gcs,
    warfarin,
    doac,
    inr,
    bp_target: 'sbp_120_to_140_24h_interval',
    reversal,
    surgery_indicated: surgery,
    monitoring: 'nevo_q1h_then_q4h',
    citations: CITATIONS
  };
}
function tiaWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const abc2 = ensureNumber(input, 'abc2_score', 0, 7);
  const imaging = ensureEnum(input, 'workup', ['mri_dwi', 'ct_perfusion', 'ct_only', 'no_imaging']);
  const afib = input.afib_detected === true;
  const stenosis = ensureNumber(input, 'carotid_stenosis_pct', 0, 100);
  const high_risk = abc2 >= 4 || stenosis >= 50 || afib;
  const therapy = {
    duration_dual: high_risk ? '21d' : '21d_short',
    antithrombotic: 'aspirin_or_clopidogrel',
    statin: 'high_intensity_statin',
    bp: 'bp_target_then_review',
    endarterectomy: stenosis >= 70 ? 'consider_within_2_weeks' : 'monitor'
  };
  return {
    module: 'tier4_neuro_101_tia',
    patient_id: patientId,
    abc2_score: abc2,
    imaging,
    afib,
    carotid_stenosis_pct: stenosis,
    high_risk,
    therapy,
    citations: CITATIONS
  };
}
module.exports = {
  acuteStrokeTriage,
  strokeEtiology,
  intracerebralHemorrhage,
  tiaWorkup,
  CITATIONS,
  ValidationError
};
