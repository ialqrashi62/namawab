// filepath: tier149_nep_708_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ckd_progression(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.egfr_baseline, 'eb');
  ensureNum(req.egfr_current, 'ec');
  ensureNum(req.slope, 'sl');
  ensureNum(req.alb_creat_ratio, 'ar');
  ensureEnum(req.progression_risk, 'pr', ['low','moderate','high','very_high','unknown']);
  ensureBool(req.rapid_decline, 'rd');
  ensureNum(req.kfre_2yr_pct, 'kf');
  ensureNum(req.kfre_5yr_pct, 'kf2');
  ensureStr(req.provider, 'pr');
  return { cp_id: `ckp_${Date.now()}`, patient_id: req.patient_id, egfr: req.egfr_current, slope: req.slope };
}
function dialysis_access(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.access_type, 'at', ['AVF','AVG','tunneled_catheter','non_tunneled_catheter','PD_catheter','HeRO_graft','other']);
  ensureNum(req.access_age_months, 'aa');
  ensureNum(req.flow_rate_ml_min, 'fr');
  ensureBool(req.thrill, 'th');
  ensureBool(req.bruit, 'br');
  ensureNum(req.vein_diameter_mm, 'vd');
  ensureNum(req.artery_diameter_mm, 'ad');
  ensureEnum(req.maturation, 'mt', ['mature','immature','failing','failed','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { da_id: `dxa_${Date.now()}`, patient_id: req.patient_id, access: req.access_type };
}
function transplant_eval(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.evaluation_status, 'es', ['referral','workup','listed','active','suspended','deferred','rejected','transplanted','re_listed','NA','unknown']);
  ensureNum(req.waitlist_days, 'wd');
  ensureNum(req.cpra_pct, 'cp');
  ensureBool(req.desensitization, 'de');
  ensureNum(req.cold_ischemia_hr, 'ci');
  ensureNum(req.donor_age, 'da');
  ensureBool(req.ECD, 'ec');
  ensureNum(req.kdpi_pct, 'kd');
  ensureStr(req.provider, 'pr');
  return { te_id: `txv_${Date.now()}`, patient_id: req.patient_id, status: req.evaluation_status };
}
function renal_replacement(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.modality, 'mo', ['in_center_HD','home_HD','PD_CAPD','PD_APD','SLED','CVVH','CVVHD','CVVHDF','SCUF','plasmapheresis','hemoperfusion','MARS','other']);
  ensureNum(req.bun_pre, 'bp');
  ensureNum(req.bun_post, 'po');
  ensureNum(req.urr_pct, 'ur');
  ensureNum(req.kt_v, 'kv');
  ensureNum(req.ultrafiltration_ml, 'uf');
  ensureNum(req.duration_hr, 'du');
  ensureNum(req.sessions_per_week, 'sw');
  ensureNum(req.access_pressure, 'ap');
  ensureStr(req.provider, 'pr');
  return { rr_id: `rrt_${Date.now()}`, patient_id: req.patient_id, modality: req.modality };
}
function acid_base(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.ph, 'ph');
  ensureNum(req.pco2, 'pc');
  ensureNum(req.hco3, 'hc');
  ensureNum(req.base_excess, 'be');
  ensureNum(req.lactate, 'la');
  ensureNum(req.anion_gap, 'ag');
  ensureNum(req.delta_gap, 'dg');
  ensureEnum(req.disorder, 'di', ['normal','met_acidosis','met_alkalosis','resp_acidosis','resp_alkalosis','mixed','unknown']);
  ensureStr(req.provider, 'pr');
  return { ab_id: `abg_${Date.now()}`, patient_id: req.patient_id, ph: req.ph };
}

function funcs() { return { ckd_progression, dialysis_access, transplant_eval, renal_replacement, acid_base }; }
module.exports = { funcs, ValidationError };