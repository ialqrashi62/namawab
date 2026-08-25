// filepath: tier24_transplant_ext_154_donor_engine.js
// TIER24_TRANSPLANT-154: Donor evaluation, DBD/DCD, allocation
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function donor_type(req) {
  ensureStr(req.donor_id, 'donor_id');
  ensureEnum(req.donor_type, 'donor_type', ['dbd','dcd','living_related','living_unrelated','paired_exchange','directed_donation','anonymous','other']);
  ensureBool(req.brain_death_confirmed, 'brain_death');
  ensureNumber(req.age, 'age');
  ensureStr(req.cause_of_death, 'cause_of_death');
  ensureBool(req.malignancy_history, 'malignancy');
  ensureNumber(req.serum_creatinine, 'cr');
  let status;
  if (req.donor_type === 'dcd' && req.age > 60) status = 'dcd_extended_criteria_review';
  else if (req.serum_creatinine > 2.5 && (req.donor_type === 'dbd' || req.donor_type === 'dcd')) status = 'elevated_donor_cr_kidney_quality';
  else if (req.malignancy_history) status = 'malignancy_history_onco_clearance';
  else status = 'donor_acceptable_for_allocation';
  return { status, type: req.donor_type };
}

function donor_screening(req) {
  ensureStr(req.donor_id, 'donor_id');
  ensureBool(req.hiv_neg, 'hiv');
  ensureBool(req.hbv_neg, 'hbv');
  ensureBool(req.hcv_neg, 'hcv');
  ensureBool(req.htlv_neg, 'htlv');
  ensureBool(req.syphilis_neg, 'syphilis');
  ensureBool(req.toxoplasmosis_neg, 'toxo');
  ensureBool(req.ebv_known, 'ebv');
  ensureBool(req.cmv_known, 'cmv');
  let status;
  if (!req.hiv_neg || !req.hbv_neg) status = 'viral_positive_transmission_risk';
  else if (!req.hcv_neg) status = 'hcv_positive_consider_natk';
  else if (!req.htlv_neg) status = 'htlv_positive_high_risk';
  else status = 'donor_serology_clear';
  return { status, screened: 'complete' };
}

function allocation(req) {
  ensureStr(req.donor_id, 'donor_id');
  ensureEnum(req.organ, 'organ', ['kidney','liver','heart','lung','pancreas','intestinal','multivisceral','heart_lung','kidney_pancreas','other']);
  ensureEnum(req.allocation_type, 'allocation_type', ['standard','extended_criteria','high_kdpi','high_risk_donor','vca','pediatric_priority','national','regional','local','other']);
  ensureNumber(req.distance_miles, 'distance');
  ensureNumber(req.cold_ischemia_target_h, 'target');
  ensureEnum(req.allocation_score, 'allocation_score', ['meld','meld_na','lasonde','laslond','cpra','lvas','casp','ecmo_bridge','other']);
  let status;
  if (req.distance_miles > 500 && req.cold_ischemia_target_h < 12) status = 'logistics_risk_long_distance';
  else if (req.allocation_type === 'extended_criteria' && req.organ !== 'kidney') status = 'ecda_applicable_to_kidney_only';
  else status = 'allocation_appropriate';
  return { status, organ: req.organ };
}

function preservation(req) {
  ensureStr(req.donor_id, 'donor_id');
  ensureNumber(req.cold_ischemia_h, 'cold_h');
  ensureEnum(req.preservation_method, 'preservation_method', ['static_cold_storage','machine_perfusion_hypothermic','machine_perfusion_normothermic','normothermic_regional_perfusion','other']);
  ensureNumber(req.organ_temperature_c, 'temp');
  ensureBool(req.organ_pumped, 'pumped');
  ensureNumber(req.pump_time_h, 'pump_time');
  let status;
  if (req.cold_ischemia_h > 30 && req.organ === 'heart') status = 'heart_over_30h_reject';
  else if (req.cold_ischemia_h > 36 && req.organ === 'kidney') status = 'kidney_over_36h_reduced_outcome';
  else if (req.organ_temperature_c > 8) status = 'temperature_breach_warm_ischemia';
  else status = 'preservation_adequate';
  return { status, cold_h: req.cold_ischemia_h };
}

function procurement(req) {
  ensureStr(req.donor_id, 'donor_id');
  ensureBool(req.cross_clamp_confirmed, 'cross_clamp');
  ensureNumber(req.operative_time_min, 'op_time');
  ensureNumber(req.blood_loss_ml, 'blood_loss');
  ensureBool(req.all_organs_procured, 'all_organs');
  ensureEnum(req.complication, 'complication', ['none','hemodynamic_instability','vascular_injury','organ_injury','unsalvageable','other']);
  let status;
  if (!req.cross_clamp_confirmed) status = 'cross_clamp_not_confirmed_documented';
  else if (req.blood_loss_ml > 3000) status = 'massive_loss_review';
  else if (req.complication === 'unsalvageable') status = 'organ_unsalvageable_recovery_stopped';
  else status = 'procurement_successful';
  return { status, complication: req.complication };
}

const CITATIONS = { OPTN_2024: 'OPTN 2024', AST_2024: 'AST Donor 2024' };

function funcs() { return { donor_type, donor_screening, allocation, preservation, procurement }; }
module.exports = { funcs, CITATIONS, ValidationError };