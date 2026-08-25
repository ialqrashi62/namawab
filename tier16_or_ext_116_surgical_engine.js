// filepath: tier16_or_ext_116_surgical_engine.js
// TIER16_OR_EXT-116: Surgical specialty scoring (NSQIP, SSI, VTE, opioid)
'use strict';

const CITATIONS = ['ACS_NSQIP_2024','CDC_SSI_2024','CHEST_VTE_2022'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function surgical_nsqip(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.cpt_class, 'cpt_class', ['low_risk_superficial','low_risk_endoscopic','moderate_lap','moderate_open','high_colorectal','high_esophagectomy','high_pancreatectomy','high_hepatic','cardiac','craniotomy','spinal_fusion','other']);
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.bmi, 'bmi');
  ensureEnum(req.asa_class, 'asa_class', ['asa_1','asa_2','asa_3','asa_4','asa_5','emergency_e','other']);
  ensureBool(req.preop_sepsis, 'preop_sepsis');
  ensureNumber(req.albumin_preop, 'albumin_preop');
  ensureNumber(req.cr_preop, 'cr_preop');

  let status;
  if (req.albumin_preop < 3.0) status = 'low_albumin_high_mortality_risk';
  else if (req.asa_class === 'asa_5' || req.asa_class === 'emergency_e') status = 'highest_nsqip_risk_review_benefits';
  else if (req.bmi >= 40) status = 'bmi_40_plus_wound_review';
  else if (req.cr_preop >= 2) status = 'renal_insufficiency_high_risk';
  else if (req.preop_sepsis) status = 'sepsis_preop_high_risk';
  else status = 'nsqip_risk_acceptable';
  return { status, asa: req.asa_class };
}

function surgical_ssi(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.wound_class, 'wound_class', ['clean','clean_contaminated','contaminated','dirty_infected','other']);
  ensureBool(req.preop_chlorhexidine, 'preop_chlorhexidine');
  ensureBool(req.temperature_above_36_pacu, 'temp_36_pacu');
  ensureBool(req.glycemic_below_200_pacu, 'glycemic_200_pacu');
  ensureBool(req.normothermia_intraop, 'normothermia_intraop');
  ensureNumber(req.duration_hours, 'duration_hours');
  ensureNumber(req.prophylactic_antibiotic_min, 'prophylactic_antibiotic_min');

  let status;
  if (req.wound_class === 'dirty_infected') status = 'dirty_infected_high_ssi_review';
  else if (!req.preop_chlorhexidine) status = 'preop_chlorhexidine_required';
  else if (!req.temperature_above_36_pacu) status = 'temp_under_36_ssi_risk_warming';
  else if (!req.glycemic_below_200_pacu) status = 'glucose_over_200_ssi_risk';
  else if (req.duration_hours > 4) status = 'over_4h_re_dose_antibiotic';
  else status = 'ssi_bundle_complete';
  return { status, class: req.wound_class };
}

function surgical_vte(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.vte_risk, 'vte_risk', ['very_low','low','moderate','high','very_high_caprini_5_plus','highest_caprini_8_plus','other']);
  ensureBool(req.chemoprophylaxis_ordered, 'chemo_ordered');
  ensureBool(req.mechanical_prophylaxis_ordered, 'mech_ordered');
  ensureBool(req.early_ambulation_planned, 'ambulation_planned');
  ensureNumber(req.immobility_hours_postop, 'immobility_hours');
  ensureBool(req.bled_within_30d, 'bled_recent');
  ensureNumber(req.creatinine_mg_dl, 'creatinine_mg_dl');

  let status;
  if (req.vte_risk === 'highest_caprini_8_plus' && !req.chemo_ordered) status = 'highest_risk_no_chemo_add';
  else if (req.bled_within_30d && req.chemo_ordered) status = 'recent_bleed_chemo_review_risk_benefit';
  else if (!req.mech_ordered) status = 'mechanical_prophylaxis_required';
  else if (req.immobility_hours > 24) status = 'over_24h_immobile_ambulate';
  else if (req.creatinine_mg_dl >= 2 && req.chemo_ordered) status = 'renal_dose_chemo_adjust';
  else status = 'vte_prophylaxis_appropriate';
  return { status, risk: req.vte_risk };
}

function surgical_opioid(req) {
  ensureStr(req.case_id, 'case_id');
  ensureNumber(req.mme_intraop, 'mme_intraop');
  ensureNumber(req.mme_first_24h_postop, 'mme_24h');
  ensureNumber(req.mme_total_prescribed_discharge, 'mme_discharge');
  ensureBool(req.multimodal_used, 'multimodal');
  ensureEnum(req.pain_plan, 'pain_plan', ['opioid_main','multimodal_primary','non_opioid_main','transitioning_weaning','other']);
  ensureBool(req.persistent_opioid_90d_expected, 'chronic_opioid_likely');

  let status;
  if (req.mme_24h > 100 && !req.multimodal) status = 'high_mme_24h_no_multimodal_add';
  else if (req.mme_discharge > 200 && req.chronic_opioid_likely) status = 'chronic_high_discharge_wean';
  else if (req.pain_plan === 'opioid_main' && !req.multimodal) status = 'opioid_main_no_multimodal_change';
  else if (req.mme_24h < 30 && req.multimodal) status = 'excellent_low_opioid_multimodal';
  else status = 'opioid_plan_appropriate';
  return { status, mme: req.mme_24h };
}

function surgical_enhanced_recovery(req) {
  ensureStr(req.case_id, 'case_id');
  ensureBool(req.eras_protocol_used, 'eras_used');
  ensureBool(req.preop_carb_loading, 'preop_carbs');
  ensureBool(req.intraop_fluid_optimization, 'fluid_optimization');
  ensureBool(req.early_mobilization, 'early_mob');
  ensureBool(req.opioid_sparing, 'opioid_sparing');
  ensureBool(req.discharge_criteria_documented, 'discharge_criteria');
  ensureNumber(req.los_days_actual, 'los_actual');
  ensureNumber(req.los_target, 'los_target');

  let status;
  if (!req.eras_used) status = 'eras_protocol_not_used';
  else if (!req.early_mob) status = 'early_mobilization_required_eras';
  else if (!req.opioid_sparing) status = 'opioid_sparing_required_eras';
  else if (req.los_actual > req.los_target * 1.5) status = 'los_50pct_over_target';
  else if (!req.discharge_criteria) status = 'discharge_criteria_documented';
  else status = 'eras_compliant';
  return { status, los: req.los_actual };
}

function funcs() { return { surgical_nsqip, surgical_ssi, surgical_vte, surgical_opioid, surgical_enhanced_recovery }; }
module.exports = { funcs, CITATIONS, ValidationError };