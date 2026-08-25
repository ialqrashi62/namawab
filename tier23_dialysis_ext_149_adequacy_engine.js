// filepath: tier23_dialysis_ext_149_adequacy_engine.js
// TIER23_DIALYSIS-149: Dialysis adequacy, Kt/V, URR
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ktv(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.pre_bun, 'pre_bun');
  ensureNumber(req.post_bun, 'post_bun');
  ensureNumber(req.dialyzer_clearance_ml_min, 'clearance');
  ensureNumber(req.treatment_time_min, 'time');
  ensureNumber(req.ultrafiltration_l, 'uf');
  ensureEnum(req.modality, 'modality', ['hemodialysis','hemodiafiltration','hemofiltration','peritoneal','slow_low_efficiency','sustained_low_efficiency','home_hd','nocturnal','other']);
  const ktv_calc = req.dialyzer_clearance_ml_min * req.treatment_time_min / Math.max(1, req.pre_bun);
  let status;
  if (req.modality === 'hemodialysis' && ktv_calc < 1.2) status = 'ktv_below_hd_target_1_2';
  else if (req.modality === 'peritoneal' && ktv_calc < 1.7) status = 'ktv_below_pd_target_1_7';
  else if (ktv_calc >= 1.4) status = 'ktv_adequate';
  else status = 'ktv_borderline_review_dialysis_prescription';
  return { status, ktv: Math.round(ktv_calc * 100) / 100 };
}

function urr(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.pre_bun, 'pre_bun');
  ensureNumber(req.post_bun, 'post_bun');
  ensureBool(req.rebound_considered, 'rebound');
  const urr_pct = ((req.pre_bun - req.post_bun) / Math.max(0.1, req.pre_bun)) * 100;
  let status;
  if (urr_pct < 65) status = 'urr_below_65_inadequate';
  else if (urr_pct >= 70) status = 'urr_adequate';
  else status = 'urr_borderline_65_70';
  return { status, urr_pct: Math.round(urr_pct * 10) / 10 };
}

function dry_weight(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.pre_weight_kg, 'pre_w');
  ensureNumber(req.post_weight_kg, 'post_w');
  ensureNumber(req.target_weight_kg, 'target');
  ensureNumber(req.ultrafiltration_l, 'uf');
  ensureBool(req.cramping_reported, 'cramping');
  ensureNumber(req.sbp_pre, 'sbp_pre');
  ensureNumber(req.sbp_post, 'sbp_post');
  let status;
  const uf_actual = req.pre_weight_kg - req.post_weight_kg;
  if (req.sbp_post < 90) status = 'post_dialysis_hypotension_reduce_uf';
  else if (req.cramping_reported && uf_actual > 0.04 * req.pre_weight_kg) status = 'cramping_excessive_uf_reassess_dw';
  else if (Math.abs(req.target_weight - req.post_weight_kg) < 0.2) status = 'dry_weight_achieved';
  else if (req.post_weight_kg > req.target_weight) status = 'under_ultrafiltration_continue';
  else status = 'dry_weight_reassess_next_session';
  return { status, uf_actual };
}

function session_freq(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.sessions_per_week, 'freq');
  ensureEnum(req.modality, 'modality', ['conventional_3xw','incremental_2xw','frequent_5xw','daily_short','nocturnal','home_pd','other']);
  ensureNumber(req.weekly_ktv, 'weekly_ktv');
  ensureNumber(req.residual_kidney_function_ml_min, 'rkf');
  let status;
  if (req.modality === 'incremental_2xw' && req.residual_kidney_function_ml_min > 5) status = 'incremental_appropriate_with_rkf';
  else if (req.modality === 'conventional_3xw' && req.weekly_ktv < 3.6) status = 'increase_frequency_or_extended';
  else if (req.residual_kidney_function_ml_min < 2) status = 'low_rkf_consider_increasing_frequency';
  else status = 'session_frequency_appropriate';
  return { status, freq: req.sessions_per_week };
}

function clearance(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.urea_clearance_ml_min, 'k');
  ensureNumber(req.treatment_time_min, 't');
  ensureNumber(req.ultrafiltration_l, 'uf');
  ensureEnum(req.dialyzer_type, 'dialyzer_type', ['low_flux','high_flux','medium_cutoff','protein_leaking','hemodiafilter','other']);
  ensureNumber(req.pre_weight_kg, 'pre_w');
  ensureNumber(req.qb_ml_min, 'qb');
  ensureNumber(req.qd_ml_min, 'qd');
  let status;
  if (req.qb_ml_min < 300 || req.qd_ml_min < 500) status = 'low_blood_or_dialysate_flow_review';
  else if (req.urea_clearance_ml_min < 200) status = 'low_clearance_check_dialyzer';
  else status = 'clearance_adequate';
  return { status, k: req.urea_clearance_ml_min };
}

const CITATIONS = { KDOQI_2024: 'KDOQI 2024 Adequacy', FISTULA_2024: 'Fistula First 2024' };

function funcs() { return { ktv, urr, dry_weight, session_freq, clearance }; }
module.exports = { funcs, CITATIONS, ValidationError };