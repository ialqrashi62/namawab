// filepath: tier150_end_710_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function dm_assess(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['T1DM','T2DM','GDM','LADA','MODY','secondary','other','unknown']);
  ensureNum(req.hba1c_pct, 'h1');
  ensureNum(req.fbg_mg_dl, 'fb');
  ensureNum(req.bg_postprandial_mg_dl, 'bg');
  ensureNum(req.cgm_tir_pct, 'cg');
  ensureNum(req.cgm_tar_pct, 'ca');
  ensureNum(req.cgm_tbr_pct, 'cb');
  ensureNum(req.cgm_gmi, 'gm');
  ensureNum(req.cgm_cv, 'cv');
  ensureStr(req.provider, 'pr');
  return { dm_id: `dma_${Date.now()}`, patient_id: req.patient_id, type: req.type, hba1c: req.hba1c_pct };
}
function dm_comp(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.retinopathy, 're', ['none','mild_NPDR','moderate_NPDR','severe_NPDR','PDR','macular_edema','treated','unknown','NA']);
  ensureEnum(req.neuropathy, 'ne', ['none','peripheral','autonomic','gastroparesis','mononeuropathy','unknown','NA']);
  ensureNum(req.egfr, 'eg');
  ensureNum(req.uacr, 'ua');
  ensureEnum(req.nephropathy, 'np', ['none','microalbuminuria','macroalbuminuria','CKD','unknown','NA']);
  ensureBool(req.foot_ulcer, 'fu');
  ensureBool(req.amputation_history, 'ah');
  ensureNum(req.abi, 'ab');
  ensureNum(req.mnsi, 'mn');
  ensureStr(req.provider, 'pr');
  return { dc_id: `dmc_${Date.now()}`, patient_id: req.patient_id, egfr: req.egfr };
}
function thyroid(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.diagnosis, 'dx', ['euthyroid','subclinical_hypo','overt_hypo','subclinical_hyper','overt_hyper','Hashimoto','Grave','postpartum','thyroiditis','goiter','nodule','cancer','unknown','NA']);
  ensureNum(req.tsh, 'ts');
  ensureNum(req.ft4, 'f4');
  ensureNum(req.ft3, 'f3');
  ensureEnum(req.tpo_ab, 'ta', ['negative','positive_low','positive_high','NA','unknown']);
  ensureEnum(req.tsi, 'si', ['negative','positive_low','positive_high','NA','unknown']);
  ensureEnum(req.treatment, 'tr', ['none','levothyroxine','methimazole','PTU','beta_blocker','radioiodine','surgery','observation','other']);
  ensureNum(req.dose_mcg, 'ds');
  ensureStr(req.provider, 'pr');
  return { th_id: `thr_${Date.now()}`, patient_id: req.patient_id, tsh: req.tsh };
}
function adrenal(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.disorder, 'di', ['Cushing','Addison','Conn','pheochromocytoma','adrenal_incidentaloma','adrenal_ca','CAH','secondary_adrenal_insufficiency','other','unknown','NA']);
  ensureNum(req.cortisol_am, 'co');
  ensureNum(req.acth, 'ac');
  ensureNum(req.aldo, 'al');
  ensureNum(req.renin, 're');
  ensureNum(req.aldo_renin_ratio, 'ar');
  ensureNum(req.dheas, 'dh');
  ensureNum(req.metanephrine, 'me');
  ensureNum(req.normetanephrine, 'nm');
  ensureStr(req.provider, 'pr');
  return { ad_id: `adr_${Date.now()}`, patient_id: req.patient_id, disorder: req.disorder };
}
function bone(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.disorder, 'di', ['osteoporosis','osteopenia','Paget','hyperparathyroidism','hypoparathyroidism','renal_osteodystrophy','osteomalacia','fracture','other','unknown','NA']);
  ensureNum(req.bmd_lumbar_tscore, 'bl');
  ensureNum(req.bmd_hip_tscore, 'bh');
  ensureNum(req.bmd_femur_tscore, 'bf');
  ensureNum(req.ca, 'ca');
  ensureNum(req.po4, 'po');
  ensureNum(req.pth, 'pt');
  ensureNum(req.vit_d_25oh, 'vd');
  ensureEnum(req.treatment, 'tr', ['none','bisphosphonate','denosumab','teriparatide','abaloparatide','romosozumab','raloxifene','HRT','calcium','vit_D','other']);
  ensureStr(req.provider, 'pr');
  return { bn_id: `bne_${Date.now()}`, patient_id: req.patient_id, disorder: req.disorder };
}

function funcs() { return { dm_assess, dm_comp, thyroid, adrenal, bone }; }
module.exports = { funcs, ValidationError };