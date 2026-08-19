// filepath: tier158_mif_746_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function recurrent_loss(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.losses_count, 'lc');
  ensureNum(req.gestational_age_max, 'ga');
  ensureEnum(req.cause, 'ca', ['unexplained','genetic_parental','anatomic','endocrine','immune','APS','thrombophilia','infection','environmental','idiopathic','other','NA']);
  ensureNum(req.karyotype_count, 'kc');
  ensureBool(req.aps_workup, 'aw');
  ensureBool(req.thrombophilia_workup, 'tw');
  ensureNum(req.tsh, 'ts');
  ensureNum(req.prolactin, 'pr');
  ensureNum(req.amh, 'am');
  ensureBool(req.anatomic_eval, 'ae');
  ensureEnum(req.treatment, 'tr', ['none','aspirin','heparin','IVIG','progesterone','HMG','prednisone','IVIG_pred','combination','other','NA']);
  ensureStr(req.provider, 'pr');
  return { rl_id: `rcl_${Date.now()}`, patient_id: req.patient_id, losses: req.losses_count };
}
function preconception(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureNum(req.bmi, 'bm');
  ensureNum(req.folic_acid_mcg, 'fa');
  ensureBool(req.preconception_counsel, 'pc');
  ensureNum(req.immunizations_current, 'ic');
  ensureNum(req.medications_reviewed, 'mr');
  ensureEnum(req.meds_teratogenic, 'mt', ['none','isotretinoin','warfarin','valproate','methotrexate','ACEI','ARB','statin','SSRI','lithium','other','combination','NA']);
  ensureNum(req.hba1c, 'h1');
  ensureNum(req.tsh, 'ts');
  ensureBool(req.partner_screened, 'ps');
  ensureStr(req.provider, 'pr');
  return { pc_id: `pcc_${Date.now()}`, patient_id: req.patient_id };
}
function early_preg(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.ga_days, 'gd');
  ensureNum(req.beta_hcg, 'bh');
  ensureNum(req.progesterone, 'pr');
  ensureEnum(req.location, 'lc', ['intrauterine','ectopic_unknown','tubal','cervical','heterotopic','pue','NA']);
  ensureBool(req.heartbeat_seen, 'hs');
  ensureNum(req.crl_mm, 'cr');
  ensureNum(req.gestational_sac_mm, 'gs');
  ensureNum(req.yolk_sac_mm, 'ys');
  ensureEnum(req.bleeding, 'bl', ['none','spotting','light','moderate','heavy','hemorrhagic','NA']);
  ensureEnum(req.pain, 'pn', ['none','mild','moderate','severe','cramping','one_sided','NA']);
  ensureNum(req.subsequent_beta_hcg_48h, 'sb');
  ensureStr(req.provider, 'pr');
  return { ep_id: `epy_${Date.now()}`, patient_id: req.patient_id };
}
function ectopic(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.ga_days, 'gd');
  ensureNum(req.beta_hcg, 'bh');
  ensureEnum(req.location, 'lc', ['tubal_ampullary','tubal_isthmic','interstitial','cervical','abdominal','ovarian','cesarean_scar','heterotopic','NA','unknown']);
  ensureNum(req.mass_size_mm, 'ms');
  ensureBool(req.fetal_heart_activity, 'fh');
  ensureBool(req.ruptured, 'rp');
  ensureNum(req.hemoperitoneum_ml, 'hp');
  ensureNum(req.hemoglobin, 'hg');
  ensureEnum(req.management, 'mg', ['expectant','medical_mtx','medical_mtx_second','surgical_salp','surgical_salp_ostomy','surgical_laparotomy','combination','NA','other']);
  ensureNum(req.mtx_dose_mg, 'md');
  ensureNum(req.day_below_5_pct, 'db');
  ensureStr(req.provider, 'pr');
  return { et_id: `ect_${Date.now()}`, patient_id: req.patient_id, management: req.management };
}
function pregnancy_loss(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.ga_days, 'gd');
  ensureEnum(req.type, 'tp', ['threatened','inevitable','incomplete','complete','missed','septic','recurrent','chemical','NA','other']);
  ensureNum(req.bleeding_score, 'bs');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.hemoglobin, 'hg');
  ensureBool(req.hemodynamically_stable, 'hs');
  ensureEnum(req.management, 'mg', ['expectant','medical_misoprostol','medical_mtx','surgical_D&C','manual_evacuation','combination','NA','other']);
  ensureNum(req.tissue_passed_days, 'tp');
  ensureNum(req.followup_beta_hcg, 'fb');
  ensureNum(req.followup_days, 'fd');
  ensureStr(req.provider, 'pr');
  return { pl_id: `pls_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}

function funcs() { return { recurrent_loss, preconception, early_preg, ectopic, pregnancy_loss }; }
module.exports = { funcs, ValidationError };