'use strict';
// TIER4_HEMONC_EXT-106: Anticoagulation reversal + management
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACCP_Anticoag_2018', 'ASH_Anticoag_2022', 'NCS_ICH_2015'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function warfarin_management(req) {
  ensureNumber(req.inr, 'inr');
  ensureNumber(req.target_inr, 'target_inr');
  ensureBool(req.bleeding_major, 'bleeding_major');
  ensureBool(req.bleeding_minor, 'bleeding_minor');
  ensureBool(req.surgery_needed, 'surgery_needed');

  let intervention;
  if (req.bleeding_major) intervention = 'four_factor_pcc_plus_vitamin_k_10mg_iv';
  else if (req.bleeding_minor) intervention = 'vitamin_k_5_10mg_oral_or_iv';
  else if (req.inr > 9 && !req.bleeding_minor) intervention = 'hold_warfarin_vitamin_k_5mg_oral';
  else if (req.inr > req.target_inr + 1) intervention = 'hold_warfarin_or_low_dose_vitamin_k';
  else if (req.surgery_needed && req.inr > req.target_inr) intervention = 'low_dose_vitamin_k_or_fresh_plasma';
  else intervention = 'adjust_warfarin_dose_per_protocol';
  return {
    inr: req.inr,
    target_inr: req.target_inr,
    intervention,
    bridging: req.surgery_needed ? 'consider_lmwh_bridging_if_high_thrombotic_risk' : 'no_bridging',
    citations: CITATIONS,
  };
}

function doac_reversal(req) {
  ensureStr(req.doac, 'doac'); // apixaban | rivaroxaban | dabigatran | edoxaban
  ensureBool(req.bleeding_life_threatening, 'bleeding_life_threatening');
  ensureBool(req.surgery_emergent, 'surgery_emergent');
  ensureNumber(req.last_dose_hours, 'last_dose_hours');
  ensureNumber(req.creatinine, 'creatinine');

  let reversal;
  if (req.bleeding_life_threatening || req.surgery_emergent) {
    reversal = req.doac === 'dabigatran' ? 'idarucizumab_5g_iv' :
      'andexanet_alpha_load_then_maintenance_or_4factor_pcc_50u_per_kg';
  } else if (req.last_dose_hours >= 24 || req.creatinine >= 5) {
    reversal = 'supportive_care_only_doac_cleared';
  } else {
    reversal = 'consider_holding_and_supportive';
  }
  return {
    doac: req.doac,
    reversal,
    supportive: ['iv_fluids', 'transfusion_prbc_plt_ffp_as_needed'],
    monitoring: 'q1_2h_bleeding_assessment_labs',
    citations: CITATIONS,
  };
}

module.exports = { warfarin_management, doac_reversal, CITATIONS, ValidationError };