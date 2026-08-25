// filepath: tier158_ivf_743_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function consult(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.female_age, 'fa');
  ensureNum(req.male_age, 'ma');
  ensureNum(req.infertility_years, 'iy');
  ensureEnum(req.cause, 'ca', ['male_factor','tubal','endometriosis','ovulatory','uterine','cervical','unexplained','multiple_factors','age_related','recurrent_loss','same_sex','single_parent','surrogacy','social','preservation','NA','other']);
  ensureNum(req.amh, 'am');
  ensureNum(req.fsh, 'fs');
  ensureNum(req.afc, 'af');
  ensureBool(req.tubal_patent, 'tp');
  ensureNum(req.sperm_count, 'sc');
  ensureStr(req.provider, 'pr');
  return { cn_id: `ivc_${Date.now()}`, patient_id: req.patient_id };
}
function stim(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.protocol, 'pr', ['long_lupron','short_lupron','antagonist','microflare','mini_IVF','natural','modified_natural','trigger_dual','trigger_hCG','trigger_agonist','other','NA']);
  ensureNum(req.start_day, 'sd');
  ensureNum(req.total_fsh, 'tf');
  ensureNum(req.total_hmg, 'th');
  ensureNum(req.stim_days, 'st');
  ensureNum(req.e2_day_trigger, 'e2');
  ensureNum(req.endometrial_mm, 'em');
  ensureNum(req.follicles_18, 'f18');
  ensureNum(req.follicles_14, 'f14');
  ensureEnum(req.trigger, 'tr', ['hCG','GnRH_agonist','dual','natural','NA']);
  ensureStr(req.provider, 'pr');
  return { sm_id: `stm_${Date.now()}`, patient_id: req.patient_id, protocol: req.protocol };
}
function retrieval(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.cycle_id, 'ci');
  ensureNum(req.eggs_retrieved, 'er');
  ensureNum(req.mature_eggs_MII, 'm2');
  ensureNum(req.fertilized_2pn, 'f2');
  ensureEnum(req.method, 'me', ['IVF','ICSI','split','IMSI','PICSI','natural_cycle_IVF','other','NA']);
  ensureNum(req.duration_min, 'du');
  ensureNum(req.ebl_ml, 'eb');
  ensureEnum(req.complications, 'cp', ['none','bleeding','infection','OHSS','bowel_bladder','anesthesia','other']);
  ensureNum(req.male_partner_count, 'mc');
  ensureStr(req.provider, 'pr');
  return { rt_id: `rtr_${Date.now()}`, cycle_id: req.cycle_id, eggs: req.eggs_retrieved };
}
function transfer(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.cycle_id, 'ci');
  ensureEnum(req.day, 'dy', ['day_3','day_5','day_6','day_7','frozen','NA','other']);
  ensureNum(req.embryos_available, 'ea');
  ensureNum(req.embryos_transferred, 'et');
  ensureNum(req.embryos_grade, 'eg');
  ensureEnum(req.endometrial_prep, 'ep', ['natural','HRT','mild_stim','NA','other']);
  ensureNum(req.endometrial_mm, 'em');
  ensureEnum(req.luteal_support, 'ls', ['PIO','Crinone','Endometrin','combination','NA','other']);
  ensureNum(req.beta_hcg_result, 'bh');
  ensureBool(req.clinical_pregnancy, 'cp');
  ensureStr(req.provider, 'pr');
  return { tr_id: `xfr_${Date.now()}`, cycle_id: req.cycle_id, transferred: req.embryos_transferred };
}
function outcome(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.cycle_id, 'ci');
  ensureNum(req.cycle_number, 'cn');
  ensureEnum(req.result, 're', ['negative','chemical','clinical_pregnancy','ongoing','live_birth','miscarriage','ectopic','molar','frozen_all','NA','other']);
  ensureNum(req.gestational_age_weeks, 'ga');
  ensureNum(req.heart_rate_weeks_6, 'hr');
  ensureNum(req.babies, 'bb');
  ensureEnum(req.birth_outcome, 'bo', ['term','preterm','stillbirth','miscarriage','abortion','NA']);
  ensureNum(req.birth_weight_g, 'bw');
  ensureNum(req.apgar_1, 'a1');
  ensureNum(req.apgar_5, 'a5');
  ensureStr(req.provider, 'pr');
  return { oc_id: `otc_${Date.now()}`, cycle_id: req.cycle_id, result: req.result };
}

function funcs() { return { consult, stim, retrieval, transfer, outcome }; }
module.exports = { funcs, ValidationError };