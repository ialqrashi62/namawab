// filepath: tier15_icu_ext_109_renal_engine.js
// TIER15_ICU_EXT-109: ICU renal replacement therapy (RRT) & AKI
'use strict';

const CITATIONS = ['KDIGO_AKI_2024','ADQI_RRT_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function icu_aki_stage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.creatinine_baseline, 'creatinine_baseline');
  ensureNumber(req.creatinine_current, 'creatinine_current');
  ensureNumber(req.urine_output_ml_per_kg_h, 'urine_output_ml_per_kg_h');
  ensureNumber(req.urine_output_6h_total_ml, 'urine_output_6h_total_ml');
  ensureNumber(req.hours_since_baseline, 'hours_since_baseline');
  ensureEnum(req.aki_stage, 'aki_stage', ['no_aki','stage_1','stage_2','stage_3','on_rrt','recovering','unknown','other']);

  let status;
  const ratio = req.creatinine_current / req.creatinine_baseline;
  if (req.aki_stage === 'on_rrt') status = 'on_rrt_replace_kdigo';
  else if (ratio >= 3) status = 'stage_3_severe_aki';
  else if (ratio >= 2) status = 'stage_2_aki';
  else if (ratio >= 1.5) status = 'stage_1_aki';
  else if (req.urine_output_ml_per_kg_h < 0.3 && req.hours_since_baseline >= 24) status = 'oliguria_24h_stage_3';
  else if (req.urine_output_ml_per_kg_h < 0.5 && req.hours_since_baseline >= 6) status = 'oliguria_6h_stage_2';
  else status = 'no_aki_renal_review';
  return { status, ratio: Math.round(ratio * 100) / 100 };
}

function icu_rrt_indication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.rrt_indication, 'rrt_indication', ['no_indication','a_hyperkalemia','b_acidosis','c_fluid_overload','d_uremia','e_drug_toxicity','f_sepsis_modality','g_combination','not_yet','other']);
  ensureNumber(req.potassium_mmol_l, 'potassium_mmol_l');
  ensureNumber(req.ph, 'ph');
  ensureNumber(req.bicarbonate_mmol_l, 'bicarbonate_mmol_l');
  ensureNumber(req.fluid_overload_pct, 'fluid_overload_pct');
  ensureNumber(req.urea_mg_dl, 'urea_mg_dl');
  ensureEnum(req.urgency, 'urgency', ['emergent','urgent','elective','not_required','other']);

  let status;
  if (req.urgency === 'emergent' || req.potassium_mmol_l >= 6.5 || req.ph < 7.1) status = 'emergent_rrt_initiate_within_3h';
  else if (req.fluid_overload_pct >= 10) status = 'fluid_overload_10pct_initiate';
  else if (req.urea_mg_dl >= 100) status = 'uremic_initiate';
  else if (req.urgency === 'elective') status = 'elective_rrt_plan';
  else if (req.rrt_indication === 'no_indication') status = 'no_rrt_indication';
  else status = 'rrt_review';
  return { status, urgency: req.urgency };
}

function icu_rrt_prescription(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.rrt_mode, 'rrt_mode', ['cvvh','cvvhd','cvvhdf','sled','iHD','peritoneal','slow_low_efficiency','other']);
  ensureNumber(req.blood_flow_ml_per_min, 'blood_flow_ml_per_min');
  ensureNumber(req.dialysate_flow_ml_per_h, 'dialysate_flow_ml_per_h');
  ensureNumber(req.replacement_flow_ml_per_h, 'replacement_flow_ml_per_h');
  ensureNumber(req.net_uf_ml_per_h, 'net_uf_ml_per_h');
  ensureEnum(req.anticoagulation, 'anticoagulation', ['none','heparin','citrate','prostacyclin','argatroban','bivalirudin','lwmh','other']);
  ensureNumber(req.target_dose_ml_kg_h, 'target_dose_ml_kg_h');

  let status;
  if (req.target_dose_ml_kg_h < 20 || req.target_dose_ml_kg_h > 35) status = 'dose_outside_20_35_range';
  else if (req.rrt_mode === 'cvvh' && req.blood_flow_ml_per_min < 100) status = 'blood_flow_too_low';
  else if (req.anticoagulation === 'none' && req.target_dose_ml_kg_h >= 25) status = 'no_anticoag_with_high_dose_clotting_risk';
  else status = 'rrt_prescription_appropriate';
  return { status, mode: req.rrt_mode };
}

function icu_electrolyte(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.sodium_mmol_l, 'sodium_mmol_l');
  ensureNumber(req.potassium_mmol_l, 'potassium_mmol_l');
  ensureNumber(req.calcium_mg_dl, 'calcium_mg_dl');
  ensureNumber(req.magnesium_mg_dl, 'magnesium_mg_dl');
  ensureNumber(req.phosphate_mg_dl, 'phosphate_mg_dl');
  ensureNumber(req.delta_sodium_24h, 'delta_sodium_24h');
  ensureEnum(req.urgency, 'urgency', ['emergent','urgent','routine','not_required','other']);

  let status;
  if (req.potassium_mmol_l >= 6.5) status = 'hyperkalemia_emergent_treat';
  else if (req.sodium_mmol_l >= 160 || req.sodium_mmol_l <= 120) status = 'severe_sodium_disorder_emergent';
  else if (Math.abs(req.delta_sodium_24h) > 12) status = 'rapid_sodium_shift_osmotic_risk';
  else if (req.calcium_mg_dl < 6.5 || req.calcium_mg_dl > 14) status = 'severe_calcium_disorder';
  else if (req.magnesium_mg_dl < 1.0) status = 'severe_hypomagnesemia';
  else if (req.phosphate_mg_dl < 1.0) status = 'severe_hypophosphatemia_rrt_related';
  else status = 'electrolytes_acceptable';
  return { status, sodium: req.sodium_mmol_l };
}

function icu_fluid_balance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.intake_24h_ml, 'intake_24h_ml');
  ensureNumber(req.output_24h_ml, 'output_24h_ml');
  ensureNumber(req.cumulative_balance_ml, 'cumulative_balance_ml');
  ensureNumber(req.weight_admission_kg, 'weight_admission_kg');
  ensureNumber(req.weight_current_kg, 'weight_current_kg');
  ensureBool(req.mech_vent, 'mech_vent');
  ensureBool(req.ards, 'ards');

  const fluid_overload_pct = ((req.weight_current_kg - req.weight_admission_kg) / req.weight_admission_kg) * 100;
  let status;
  if (req.ards && fluid_overload_pct >= 5) status = 'ards_with_5pct_overload_dry';
  else if (req.mech_vent && fluid_overload_pct >= 10) status = 'mech_vent_overloaded_diurese';
  else if (fluid_overload_pct >= 20) status = 'severe_overload_rrt_uf';
  else if (fluid_overload_pct >= 10) status = 'overloaded_diurese_or_rrt';
  else if (req.intake_24h_ml - req.output_24h_ml < -500) status = 'negative_balance_review_euvolemia';
  else status = 'fluid_balance_acceptable';
  return { status, fluid_overload_pct: Math.round(fluid_overload_pct * 10) / 10 };
}

function funcs() { return { icu_aki_stage, icu_rrt_indication, icu_rrt_prescription, icu_electrolyte, icu_fluid_balance }; }
module.exports = { funcs, CITATIONS, ValidationError };