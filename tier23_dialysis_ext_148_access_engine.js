// filepath: tier23_dialysis_ext_148_access_engine.js
// TIER23_DIALYSIS-148: Dialysis vascular access
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function access_avf(req) {
  ensureStr(req.avf_id, 'avf_id');
  ensureStr(req.location, 'location');
  ensureNumber(req.flow_ml_min, 'flow');
  ensureBool(req.thrill_palpable, 'thrill');
  ensureBool(req.bruit_audible, 'bruit');
  ensureEnum(req.assessment, 'assessment', ['maturation_complete','maturing','failing','thrombosed','stenosis_suspected','infection_suspected','pseudoaneurysm','aneurysm','steal_syndrome','central_stenosis','other']);
  ensureNumber(req.arterial_diameter_mm, 'art_d');
  ensureNumber(req.venous_diameter_mm, 'ven_d');
  let status;
  if (req.flow_ml_min < 400) status = 'flow_low_inadequate_fistula';
  else if (req.flow_ml_min > 2000) status = 'flow_high_cardiopulmonary_review';
  else if (!req.thrill_palpable || !req.bruit_audible) status = 'no_thrill_or_bruit_fistula_compromise';
  else if (req.venous_diameter_mm < 6) status = 'vein_too_small_wait_maturation';
  else status = 'avf_assessed_adequate';
  return { status, flow: req.flow_ml_min };
}

function access_avg(req) {
  ensureStr(req.avg_id, 'avg_id');
  ensureStr(req.location, 'location');
  ensureNumber(req.flow_ml_min, 'flow');
  ensureBool(req.thrill_palpable, 'thrill');
  ensureBool(req.bruit_audible, 'bruit');
  ensureBool(req.days_post_op, 'days_post_op');
  ensureNumber(req.days_since_cannulation, 'days_cann');
  let status;
  if (req.days_post_op < 14) status = 'too_early_to_cannulate_wait';
  else if (req.flow_ml_min < 600) status = 'flow_low_consider_fistula';
  else if (req.days_since_cannulation < 14) status = 'cannulation_too_recent_alternate_sites';
  else status = 'graft_appropriate_for_use';
  return { status, flow: req.flow_ml_min };
}

function access_catheter(req) {
  ensureStr(req.catheter_id, 'catheter_id');
  ensureEnum(req.catheter_type, 'catheter_type', ['tunneled_cuffed','non_tunneled','temporary_internal_jugular','temporary_femoral','temporary_subclavian','permacath','hecat','other']);
  ensureNumber(req.days_since_insertion, 'days');
  ensureBool(req.exit_site_clean, 'exit_site');
  ensureBool(req.fever_present, 'fever');
  ensureNumber(req.blood_flow_ml_min, 'blood_flow');
  ensureBool(req.crbsi_suspected, 'crbsi');
  let status;
  if (req.crbsi_suspected || req.fever_present) status = 'crbsi_suspected_culture_and_empiric_abx';
  else if (req.days_since_insertion > 90 && req.catheter_type === 'non_tunneled') status = 'non_tunneled_over_90d_replace';
  else if (!req.exit_site_clean) status = 'exit_site_infection_topical_abx';
  else if (req.blood_flow_ml_min < 300) status = 'low_flow_check_position_thrombolytic';
  else status = 'catheter_functional';
  return { status, days: req.days_since_insertion };
}

function access_stenosis(req) {
  ensureStr(req.access_id, 'access_id');
  ensureNumber(req.psv_ratio, 'psv');
  ensureNumber(req.residual_diameter_pct, 'residual');
  ensureEnum(req.location, 'location', ['arterial_anastomosis','venous_anastomosis','outflow_vein','central_vein','inflow_artery','graft_intrinsic','other']);
  ensureBool(req.clinical_signs, 'signs');
  ensureEnum(req.recommendation, 'recommendation', ['angioplasty','stent','thrombectomy','revision','surveillance','replacement','none','other']);
  let status;
  if (req.psv_ratio > 4) status = 'severe_stenosis_intervention';
  else if (req.psv_ratio > 2) status = 'moderate_stenosis_surveillance';
  else if (req.residual_diameter_pct < 50) status = 'significant_narrowing_intervention';
  else status = 'no_significant_stenosis';
  return { status, psv: req.psv_ratio };
}

function access_cannulation(req) {
  ensureStr(req.cannulation_id, 'cannulation_id');
  ensureEnum(req.technique, 'technique', ['rope_ladder','buttonhole','area_puncture','single_needle','other']);
  ensureBool(req.arterial_site_rotated, 'art_rot');
  ensureBool(req.venous_site_rotated, 'ven_rot');
  ensureNumber(req.needle_gauge, 'gauge');
  ensureBool(req.aneurysm_present, 'aneurysm');
  let status;
  if (req.technique === 'area_puncture' && req.aneurysm_present) status = 'area_puncture_aneurysm_switch_rope_ladder';
  else if (req.technique === 'buttonhole' && !req.arterial_site_rotated) status = 'buttonhole_no_rotation_infection_risk';
  else if (req.needle_gauge < 15 || req.needle_gauge > 17) status = 'non_standard_gauge_review_protocol';
  else status = 'cannulation_appropriate';
  return { status, technique: req.technique };
}

const CITATIONS = { KDOQI_2024: 'KDOQI 2024 Vascular Access', CDC_CRBSI_2024: 'CDC CRBSI 2024' };

function funcs() { return { access_avf, access_avg, access_catheter, access_stenosis, access_cannulation }; }
module.exports = { funcs, CITATIONS, ValidationError };