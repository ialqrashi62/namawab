// filepath: tier31_nephrology_ext_192_renal_nutrition_engine.js
// TIER31_NEPHROLOGY-192: Renal nutrition
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function renal_dietitian(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.diet_referral, 'referral');
  ensureNumber(req.protein_g_per_kg, 'prot');
  ensureNumber(req.sodium_g, 'na');
  ensureNumber(req.potassium_mg, 'k');
  ensureNumber(req.phosphorus_mg, 'phos');
  let status;
  if (req.egfr < 15 && !req.diet_referral) status = 'advanced_ckd_dietitian_refer_urgent';
  else if (req.protein_g_per_kg > 1.2 && req.egfr < 30) status = 'protein_excess_reduce_intake';
  else if (req.sodium_g > 2.5) status = 'sodium_above_target_reduce';
  else if (req.potassium_mg > 2500) status = 'potassium_high_review';
  else status = 'renal_diet_appropriate';
  return { status, egfr: req.egfr };
}

function potassium_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.potassium, 'k');
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.dietary_k_reviewed, 'k_diet');
  ensureBool(req.patiromer_started, 'patiromer');
  ensureBool(req.emergency_dialysis, 'emerg_d');
  let status;
  if (req.k >= 6.5 && !req.emergency_dialysis) status = 'severe_hyperkalemia_urgent_dialysis';
  else if (req.k >= 6 && req.k < 6.5 && !req.patiromer_started) status = 'high_k_patiromer_initiate';
  else if (req.k < 5) status = 'k_within_normal_range';
  else status = 'k_management_review';
  return { status, k: req.potassium };
}

function phosphorus_binding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.phosphorus, 'phos');
  ensureNumber(req.calcium, 'ca');
  ensureEnum(req.binder_type, 'binder', ['calcium_acetate','calcium_carbonate','sevelamer','lanthanum','ferric_citrate','combination','none']);
  ensureNumber(req.pill_count, 'pills');
  ensureBool(req.phosphate_target_5_5, 'target_ok');
  let status;
  if (req.phos > 6.5 && req.binder_type === 'none') status = 'severe_hyperphosphatemia_initiate_binder';
  else if (req.calcium > 10.5 && req.binder_type.includes('calcium')) status = 'hypercalcemia_switch_non_calcium_binder';
  else if (req.phos >= 5.5 && !req.phosphate_target_5_5) status = 'above_target_intensify_binder';
  else if (req.phos < 5.5) status = 'phosphorus_in_target';
  else status = 'phosphorus_binding_appropriate';
  return { status, phos: req.phosphorus };
}

function dialysis_diet_adequacy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.kt_v, 'ktv');
  ensureNumber(req.albumin, 'alb');
  ensureNumber(req.dietary_protein_intake, 'dpi');
  ensureNumber(req.fluid_intake_ml, 'fluid');
  ensureBool(req.dietitian_visit_monthly, 'visit');
  let status;
  if (req.kt_v < 1.2) status = 'inadequate_dialysis_ktv_review';
  else if (req.albumin < 3.0) status = 'malnutrition_albumin_low_review';
  else if (req.dpi < 1.0) status = 'protein_intake_low_dietitian_review';
  else if (req.fluid_intake_ml > 1500) status = 'excess_fluid_intake_review';
  else if (!req.dietitian_visit_monthly) status = 'dietitian_visit_establish_monthly';
  else status = 'dialysis_diet_adequacy_appropriate';
  return { status, ktv: req.kt_v };
}

function fluid_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.fluid_removal_target, 'target');
  ensureNumber(req.dry_weight, 'dw');
  ensureNumber(req.current_weight, 'cw');
  ensureNumber(req.interdialytic_weight_gain, 'idwg');
  ensureNumber(req.bp_pre, 'bp');
  ensureEnum(req.fluid_adherence, 'adh', ['excellent','good','suboptimal','poor']);
  let status;
  if (req.bp_pre >= 180) status = 'high_pre_bp_ultrafiltration_review';
  else if (req.interdialytic_weight_gain > 5) status = 'excessive_idwg_review_adherence';
  else if (req.fluid_adherence === 'poor') status = 'fluid_adherence_poor_education';
  else if (req.current_weight - req.dry_weight > 3) status = 'above_dry_weight_review';
  else status = 'fluid_management_appropriate';
  return { status, idwg: req.interdialytic_weight_gain };
}

function funcs() { return { renal_dietitian, potassium_management, phosphorus_binding, dialysis_diet_adequacy, fluid_management }; }
module.exports = { funcs, ValidationError };