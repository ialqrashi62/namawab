// filepath: tier23_dialysis_ext_152_dialyzer_engine.js
// TIER23_DIALYSIS-152: Dialyzer selection, reuse, dialysate
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function dialyzer_select(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.weight_kg, 'weight');
  ensureEnum(req.modality, 'modality', ['hemodialysis','hemodiafiltration','hemofiltration','isolated_uf','sled','other']);
  ensureNumber(req.k_urea_target_ml_min, 'k_target');
  ensureEnum(req.membrane, 'membrane', ['low_flux_cellulose','low_flux_synthetic','high_flux_synthetic','medium_cutoff','protein_leaking','pmma','other']);
  let status;
  if (req.modality === 'hemodiafiltration' && req.membrane !== 'high_flux_synthetic') status = 'hdf_requires_high_flux_switch';
  else if (req.weight_kg > 100 && req.membrane === 'low_flux_synthetic') status = 'large_patient_high_flux_recommended';
  else status = 'dialyzer_appropriate';
  return { status, membrane: req.membrane };
}

function reuse(req) {
  ensureStr(req.dialyzer_id, 'dialyzer_id');
  ensureNumber(req.reuse_count, 'count');
  ensureNumber(req.tcv_pct, 'tcv');
  ensureBool(req.fiber_bundle_volume_adequate, 'fibers');
  ensureEnum(req.reprocess_method, 'method', ['manual','automated_formaldehyde','automated_peracetic_acid','automated_heat','bleach','other']);
  ensureBool(req.failure_detected, 'failure');
  let status;
  if (req.tcv_pct < 80) status = 'tcv_loss_dialyzer_discarded';
  else if (req.reuse_count > 30) status = 'over_30_uses_replace';
  else if (req.failure_detected) status = 'reprocess_failure_replace';
  else status = 'dialyzer_reused_appropriate';
  return { status, count: req.reuse_count };
}

function dialysate(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.sodium_mmol_l, 'na');
  ensureNumber(req.potassium_mmol_l, 'k');
  ensureNumber(req.calcium_mmol_l, 'ca');
  ensureNumber(req.bicarbonate_mmol_l, 'hco3');
  ensureNumber(req.dextrose_mg_dl, 'dextrose');
  ensureEnum(req.temperature, 'temperature', ['35','35_5','36','36_5','37','37_5','38','other']);
  let status;
  if (req.potassium_mmol_l < 1.5) status = 'low_k_dialysate_arrhythmia_risk';
  else if (req.sodium_mmol_l < 135 || req.sodium_mmol_l > 145) status = 'sodium_abnormal_review_prescription';
  else if (req.calcium_mmol_l > 1.5) status = 'high_ca_positive_balance_review';
  else status = 'dialysate_appropriate';
  return { status, na: req.sodium_mmol_l };
}

function anticoagulation(req) {
  ensureStr(req.session_id, 'session_id');
  ensureEnum(req.anticoagulant, 'anticoagulant', ['heparin_lmw','heparin_unfractionated','argatroban','bivalirudin','citrate','epoprostenol','fondaparinux','none','other']);
  ensureNumber(req.dose_units, 'dose');
  ensureNumber(req.act_baseline, 'act_baseline');
  ensureNumber(req.act_peak, 'act_peak');
  ensureBool(req.bleeding_clotting_event, 'event');
  ensureNumber(req.session_hours, 'hours');
  let status;
  if (req.anticoagulant === 'none' && req.session_hours > 3) status = 'no_anticoag_long_session_clotting_risk';
  else if (req.bleeding_clotting_event) status = 'event_dose_adjust';
  else if (req.act_peak - req.act_baseline < 100 && req.anticoagulant === 'heparin_unfractionated') status = 'inadequate_anticoag_increase_dose';
  else status = 'anticoagulation_appropriate';
  return { status, anticoag: req.anticoagulant };
}

function water_quality(req) {
  ensureStr(req.station_id, 'station_id');
  ensureNumber(req.total_chlorine_ppm, 'chlorine');
  ensureNumber(req.aluminum_ug_l, 'al');
  ensureNumber(req.bacteria_cfu_ml, 'bacteria');
  ensureNumber(req.endotoxin_eu_ml, 'endotoxin');
  ensureBool(req.ultrapure_status, 'ultrapure');
  let status;
  if (req.total_chine_ppm > 0.1) status = 'chlorine_exceeds_aami_investigate';
  else if (req.aluminum_ug_l > 10) status = 'aluminum_exceeds_dialysis_standard';
  else if (req.endotoxin_eu_ml > 0.25) status = 'endotoxin_exceeds_standard_disinfect';
  else if (req.bacteria_cfu_ml > 100) status = 'bacteria_exceeds_action_level';
  else status = 'water_quality_meets_aami';
  return { status, chlorine: req.total_chlorine_ppm };
}

const CITATIONS = { AAMI_2024: 'AAMI RD52 Water Quality', KDOQI_DIALYZER_2024: 'KDOQI Dialyzer 2024' };

function funcs() { return { dialyzer_select, reuse, dialysate, anticoagulation, water_quality }; }
module.exports = { funcs, CITATIONS, ValidationError };