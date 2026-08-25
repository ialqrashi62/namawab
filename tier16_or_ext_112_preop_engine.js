// filepath: tier16_or_ext_112_preop_engine.js
// TIER16_OR_EXT-112: Preoperative assessment (H&P, ASA, NPO, anticoag)
'use strict';

const CITATIONS = ['ACCM_2014','ESC_2022','ASA_2020','AAGBI_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function preop_history(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_years, 'age_years');
  ensureEnum(req.asa_class, 'asa_class', ['asa_1','asa_2','asa_3','asa_4','asa_5','asa_6','emergency_e','other']);
  ensureBool(req.allergies_reviewed, 'allergies_reviewed');
  ensureBool(req.meds_reviewed, 'meds_reviewed');
  ensureBool(req.cardiac_clearance_obtained, 'cardiac_clearance_obtained');
  ensureBool(req.airway_assessed, 'airway_assessed');

  let status;
  if (req.asa_class === 'asa_5' || req.asa_class === 'asa_6') status = 'moribund_or_brain_dead_review_goal';
  else if (!req.allergies_reviewed) status = 'allergies_required_preop_block';
  else if (!req.meds_reviewed) status = 'medications_review_required_anticoag_check';
  else if (!req.airway_assessed) status = 'airway_assessment_required';
  else if (!req.cardiac_clearance_obtained && req.asa_class !== 'asa_1') status = 'cardiac_clearance_recommended';
  else status = 'history_complete';
  return { status, asa: req.asa_class };
}

function preop_npo(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.last_solids_when, 'last_solids_when', ['less_than_2h','2_to_6h','6_to_8h','over_8h','unknown','npo_since_admission','not_applicable','other']);
  ensureEnum(req.last_liquids_when, 'last_liquids_when', ['less_than_1h','1_to_2h','2_to_4h','over_4h','unknown','npo_since_admission','not_applicable','other']);
  ensureEnum(req.gastric_emptying, 'gastric_emptying', ['normal','delayed_gastroparesis','delayed_diabetes','delayed_opioid','delayed_trauma','emergency_unfasted','full_stomach','not_applicable','other']);
  ensureEnum(req.aspiration_risk, 'aspiration_risk', ['low','moderate','high','very_high','not_applicable','other']);

  let status;
  if (req.aspiration_risk === 'very_high') status = 'very_high_rsu_consider_delay_or_rsi';
  else if (req.gastric_emptying === 'emergency_unfasted') status = 'emergency_full_stomach_rsi';
  else if (req.last_solids_when === 'less_than_2h') status = 'solids_under_2h_delay_or_rsi';
  else if (req.aspiration_risk === 'high' && req.last_liquids_when === 'less_than_1h') status = 'high_risk_clear_liquids_under_1h';
  else status = 'npo_status_acceptable';
  return { status, risk: req.aspiration_risk };
}

function preop_anticoag(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.anticoag_type, 'anticoag_type', ['none','warfarin','doac_apixaban','doac_rivaroxaban','doac_dabigatran','lwmh','heparin','antiplatelet_aspirin','antiplatelet_plavix','dual_antiplatelet','other']);
  ensureNumber(req.last_dose_hours, 'last_dose_hours');
  ensureEnum(req.surgery_bleed_risk, 'surgery_bleed_risk', ['low','moderate','high','very_high_cns','unknown','other']);
  ensureNumber(req.creatinine_mg_dl, 'creatinine_mg_dl');
  ensureNumber(req.inr, 'inr');
  ensureBool(req.bridging_required, 'bridging_required');

  let status;
  if (req.surgery_bleed_risk === 'very_high_cns' && req.anticoag_type !== 'none') status = 'cns_high_risk_hold_24h_or_reversal';
  else if (req.anticoag_type === 'warfarin' && req.inr >= 1.5) status = 'inr_high_reverse_or_bridge';
  else if (req.anticoag_type === 'doac_dabigatran' && req.creatinine_mg_dl > 2) status = 'dabi_renal_impairment_idarucizumab_available';
  else if (req.anticoag_type === 'doac_apixaban' && req.last_dose_hours < 24 && req.surgery_bleed_risk !== 'low') status = 'apixaban_under_24h_high_risk_delay';
  else if (req.bridging_required) status = 'bridging_per_protocol';
  else status = 'anticoag_status_acceptable';
  return { status, anticoag: req.anticoag_type };
}

function preop_labs(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.cbc_required, 'cbc_required');
  ensureBool(req.cbc_obtained, 'cbc_obtained');
  ensureNumber(req.hemoglobin_g_dl, 'hemoglobin_g_dl');
  ensureNumber(req.platelet_count, 'platelet_count');
  ensureBool(req.bmp_obtained, 'bmp_obtained');
  ensureNumber(req.potassium_mmol_l, 'potassium_mmol_l');
  ensureNumber(req.sodium_mmol_l, 'sodium_mmol_l');
  ensureBool(req.coags_obtained, 'coags_obtained');

  let status;
  if (!req.cbc_obtained && req.cbc_required) status = 'cbc_required_missing';
  else if (req.hemoglobin_g_dl < 7) status = 'transfuse_preop_hgb_under_7';
  else if (req.hemoglobin_g_dl < 10 && req.surgery_bleed_risk !== 'low') status = 'low_hgb_review_transfuse_or_delay';
  else if (req.platelet_count < 50000) status = 'plt_under_50k_transfuse_or_delay';
  else if (req.potassium_mmol_l > 5.5 || req.potassium_mmol_l < 3.0) status = 'k_out_of_range_correct';
  else status = 'labs_acceptable';
  return { status, hgb: req.hemoglobin_g_dl };
}

function preop_clearance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cardiac_status, 'cardiac_status', ['no_history','low_risk_active','high_risk_active','recent_mi_under_30d','unstable','not_assessed','other']);
  ensureBool(req.ekg_obtained, 'ekg_obtained');
  ensureNumber(req.mets_score, 'mets_score');
  ensureBool(req.pulmonary_clearance_required, 'pulmonary_clearance_required');
  ensureBool(req.consent_signed, 'consent_signed');
  ensureBool(req.site_marked, 'site_marked');

  let status;
  if (req.cardiac_status === 'unstable') status = 'cardiac_unstable_delay_elective';
  else if (req.cardiac_status === 'recent_mi_under_30d') status = 'mi_under_30d_delay_if_possible';
  else if (req.mets_score < 4 && req.cardiac_status !== 'no_history') status = 'low_mets_stress_test_review';
  else if (!req.consent_signed) status = 'consent_required';
  else if (!req.site_marked) status = 'site_marking_required_jcaho';
  else status = 'clearance_complete';
  return { status, mets: req.mets_score };
}

function funcs() { return { preop_history, preop_npo, preop_anticoag, preop_labs, preop_clearance }; }
module.exports = { funcs, CITATIONS, ValidationError };