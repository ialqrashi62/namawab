// filepath: tier158_and_744_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function semen(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.abstinence_days, 'ad');
  ensureNum(req.volume_ml, 'vl');
  ensureNum(req.ph, 'ph');
  ensureNum(req.concentration_m_ml, 'cn');
  ensureNum(req.motility_pct, 'mt');
  ensureNum(req.progressive_motility_pct, 'pm');
  ensureNum(req.morphology_strict_pct, 'mo');
  ensureNum(req.total_count, 'tc');
  ensureNum(req.total_motile_count, 'tm');
  ensureNum(req.morphology_who_pct, 'mw');
  ensureEnum(req.interpretation, 'in', ['normozoospermia','oligozoospermia','asthenozoospermia','teratozoospermia','oligoasthenoterato','azoospermia','aspermia','cryptozoospermia','leukospermia','NA','other']);
  ensureStr(req.provider, 'pr');
  return { sm_id: `sma_${Date.now()}`, patient_id: req.patient_id, count: req.total_count };
}
function testosterone(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureNum(req.total_t_ng_dl, 'tt');
  ensureNum(req.free_t_pg_ml, 'ft');
  ensureNum(req.shbg_nmol_l, 'sh');
  ensureNum(req.lh, 'lh');
  ensureNum(req.fsh, 'fs');
  ensureNum(req.prolactin, 'pr');
  ensureNum(req.estradiol, 'es');
  ensureEnum(req.diagnosis, 'dx', ['eugonadal','primary_hypogonadism','secondary_hypogonadism','mixed','age_related','compensated','hypergonadotropic','hypogonadotropic','NA','unknown']);
  ensureBool(req.trt_started, 'ts');
  ensureEnum(req.trt_route, 'tr', ['none','gel','IM','patch','pellet','nasal','buccal','oral','combination','NA']);
  ensureStr(req.provider, 'pr');
  return { tr_id: `tsx_${Date.now()}`, patient_id: req.patient_id, t: req.total_t_ng_dl };
}
function ed(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureNum(req.iief_ef_score, 'ie');
  ensureEnum(req.severity, 'sv', ['none','mild','mild_moderate','moderate','severe','NA','unknown']);
  ensureEnum(req.cause, 'ca', ['organic','psychogenic','mixed','medication','other','NA','unknown']);
  ensureBool(req.cardiovascular_risk, 'cr');
  ensureEnum(req.treatment, 'tr', ['none','PDE5i','PGE1','testosterone','vacuum','implant','injection','combination','psychotherapy','other','NA']);
  ensureNum(req.attempts_per_month, 'ap');
  ensureBool(req.partner_involvement, 'pi');
  ensureStr(req.provider, 'pr');
  return { ed_id: `edx_${Date.now()}`, patient_id: req.patient_id, severity: req.severity };
}
function infertility_male(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.duration_months, 'du');
  ensureEnum(req.cause, 'ca', ['varicocele','obstructive','genetic_Klinefelter','genetic_Y_del','CBAVD','cryptorchidism','testicular_failure','hypogonadotropic','iatrogenic','medication','lifestyle','idiopathic','other','NA','unknown']);
  ensureNum(req.testis_volume_left_ml, 'tv');
  ensureNum(req.testis_volume_right_ml, 'tv2');
  ensureBool(req.varicocele_present, 'vp');
  ensureEnum(req.varicocele_grade, 'vg', ['none','I','II','III','NA']);
  ensureNum(req.fsh, 'fs');
  ensureNum(req.total_t, 'tt');
  ensureNum(req.karyotype, 'ka');
  ensureBool(req.y_chrom_microdeletion, 'ym');
  ensureStr(req.provider, 'pr');
  return { im_id: `min_${Date.now()}`, patient_id: req.patient_id, cause: req.cause };
}
function fertility_preservation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.indic, 'in', ['cancer_pre_Tx','elective','transitioning','delayed_parenthood','military','medical_other','NA']);
  ensureNum(req.pre_treatment_sperm_count, 'ps');
  ensureNum(req.straws_stored, 'ss');
  ensureNum(req.vials_stored, 'vs');
  ensureNum(req.cost_usd, 'ct');
  ensureEnum(req.method, 'me', ['sperm_freeze','testis_freeze','ovarian_tissue','oocyte_freeze','embryo_freeze','NA','other']);
  ensureNum(req.storage_years_planned, 'sy');
  ensureBool(req.cancer_type, 'ct2');
  ensureStr(req.provider, 'pr');
  return { fp_id: `fpr_${Date.now()}`, patient_id: req.patient_id, age: req.age };
}

function funcs() { return { semen, testosterone, ed, infertility_male, fertility_preservation }; }
module.exports = { funcs, ValidationError };