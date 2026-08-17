// filepath: tier31_nephrology_ext_188_ckd_engine.js
// TIER31_NEPHROLOGY-188: CKD staging & progression
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ckd_stage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.acr, 'acr');
  ensureEnum(req.ckd_cause, 'cause', ['diabetic','hypertensive','glomerular','tubulointerstitial','polycystic','obstructive','drug_induced','unknown','other']);
  ensureBool(req.kidney_stones, 'stones');
  ensureBool(req.fhx_polycystic, 'fhx');
  let g_stage, a_stage;
  if (req.egfr >= 90) g_stage = 'g1';
  else if (req.egfr >= 60) g_stage = 'g2';
  else if (req.egfr >= 45) g_stage = 'g3a';
  else if (req.egfr >= 30) g_stage = 'g3b';
  else if (req.egfr >= 15) g_stage = 'g4';
  else g_stage = 'g5';
  if (req.acr < 30) a_stage = 'a1';
  else if (req.acr < 300) a_stage = 'a2';
  else a_stage = 'a3';
  let status;
  if (req.egfr < 15) status = 'g5_advanced_dialysis_planning';
  else if (req.egfr < 30) status = 'g4_advanced_prepare_esrd';
  else if (req.fhx_polycystic && req.egfr < 45) status = 'adpkd_referral_genetic';
  else status = 'ckd_stage_classified';
  return { status, g_stage, a_stage, cause: req.ckd_cause };
}

function proteinuria(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.upcr, 'upcr');
  ensureNumber(req.albumin_mg, 'alb');
  ensureEnum(req.proteinuria_grade, 'prot_grade', ['a1','a2','a3','normal','mild','moderate','heavy','nephrotic','other']);
  ensureEnum(req.gfr_category, 'gfr_cat', ['g1','g2','g3a','g3b','g4','g5','other']);
  ensureEnum(req.monitoring, 'mon', ['monthly','3_month','6_month','annual','none']);
  let status;
  if (req.upcr > 3500) status = 'nephrotic_range_consider_biopsy';
  else if (req.upcr > 1000 && req.gfr_category === 'g3a') status = 'heavy_proteinuria_aggressive_raas';
  else if (req.upcr < 300 && req.gfr_category === 'g3b') status = 'low_proteinuria_monitor';
  else status = 'proteinuria_appropriate_monitoring';
  return { status, upcr: req.upcr };
}

function anemia_ckd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.tsat, 'tsat');
  ensureNumber(req.ferritin, 'ferr');
  ensureBool(req.esa_use, 'esa');
  ensureNumber(req.target_hgb, 'target');
  let status;
  if (req.hgb < 8) status = 'severe_anemia_transfusion_consider';
  else if (req.hgb < 10 && req.tsat < 20) status = 'iron_deficient_iv_iron_first';
  else if (req.esa_use && req.hgb >= 12) status = 'hgb_above_target_reduce_esa';
  else if (req.hgb >= req.target_hgb) status = 'anemia_at_target';
  else status = 'anemia_manage_optimize_esa';
  return { status, hgb: req.hgb };
}

function mineral_bone(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.calcium, 'ca');
  ensureNumber(req.phosphorus, 'phos');
  ensureNumber(req.pth, 'pth');
  ensureNumber(req.vitamin_d, 'vit_d');
  ensureEnum(req.bone_density, 'bmd', ['normal','osteopenia','osteoporosis','severe','unknown']);
  let status;
  if (req.pth > 800) status = 'severe_hyperparathyroidism_consider_parathyroidectomy';
  else if (req.phosphorus > 6.5) status = 'severe_hyperphosphatemia_dialysis_review';
  else if (req.calcium > 10.5) status = 'hypercalcemia_review_ca_binder';
  else if (req.bone_density === 'osteoporosis') status = 'osteoporosis_treat_bone_protection';
  else status = 'ckd_mbd_appropriate';
  return { status, pth: req.pth };
}

function ckd_progression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.egfr_baseline, 'egfr_base');
  ensureNumber(req.egfr_current, 'egfr_curr');
  ensureNumber(req.slope, 'slope');
  ensureNumber(req.follow_up_years, 'years');
  ensureEnum(req.progression_risk, 'risk', ['low','moderate','high','rapid']);
  let status;
  if (req.slope < -5) status = 'rapid_progression_refer_nephrology';
  else if (req.slope < -2 && req.progression_risk === 'high') status = 'high_progression_treat_aggressively';
  else if (req.slope >= -1) status = 'stable_egfr_continue';
  else status = 'ckd_progression_monitored';
  return { status, slope: req.slope };
}

function funcs() { return { ckd_stage, proteinuria, anemia_ckd, mineral_bone, ckd_progression }; }
module.exports = { funcs, ValidationError };