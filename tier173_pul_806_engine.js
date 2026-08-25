// filepath: tier173_pul_806_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function asthma_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.control, 'co', ['controlled','partially','uncontrolled','NA']);
  ensureNum(req.act_score, 'ac'); ensureNum(req.fev1_pct, 'f1');
  ensureNum(req.fe_no_ppb, 'fn'); ensureNum(req.exacerbations_30d, 'ex');
  ensureEnum(req.gina_step, 'gs', ['step_1','step_2','step_3','step_4','step_5','NA']);
  ensureNum(req.inhaler_adherence, 'ia'); ensureEnum(req.disposition, 'di', ['continue','step_up','step_down','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { ae_id: `ae_${Date.now()}`, patient_id: req.patient_id, ctrl: req.control, gs: req.gina_step };
}

function copd_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.gold_stage, 'gs', ['I','II','III','IV','NA']);
  ensureNum(req.fev1_pct, 'f1'); ensureNum(req.exacerbations_30d, 'ex');
  ensureNum(req.mmrc_dyspnea, 'mm'); ensureNum(req.cat_score, 'cs');
  ensureEnum(req.treatment, 'tr', ['LAMA','LABA','LABA_LAMA','ICS_LABA','triple','NA']);
  ensureNum(req.smoker_pack_yrs, 'sp'); ensureEnum(req.disposition, 'di', ['continue','add','switch','NA']);
  ensureStr(req.provider, 'pr');
  return { ce_id: `ce_${Date.now()}`, patient_id: req.patient_id, gold: req.gold_stage, tr: req.treatment };
}

function sleep_study(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.bmi, 'bm'); ensureNum(req.ahi, 'ah');
  ensureNum(req.oxygen_min_pct, 'ox'); ensureNum(req.epworth_score, 'es');
  ensureEnum(req.severity, 'sv', ['normal','mild','moderate','severe','NA']);
  ensureBool(req.position_dependent, 'pd'); ensureNum(req.supine_ahi, 'sa');
  ensureEnum(req.disposition, 'di', ['none','PAP','oral_appliance','surgery','NA']);
  ensureStr(req.provider, 'pr');
  return { ss_id: `ss_${Date.now()}`, patient_id: req.patient_id, ahi: req.ahi, sv: req.severity };
}

function tb_screening(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.test, 'te', ['TST','IGRA','NA']);
  ensureNum(req.tst_mm, 'tm'); ensureEnum(req.igra_result, 'ir', ['positive','negative','indeterminate','NA']);
  ensureBool(req.bcg_history, 'bh'); ensureBool(req.symptoms, 'sx');
  ensureNum(req.sputum_count, 'sc'); ensureBool(req.cxr_done, 'cd');
  ensureEnum(req.disposition, 'di', ['negative','latent','active','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { ts_id: `ts_${Date.now()}`, patient_id: req.patient_id, test: req.test, disp: req.disposition };
}

function home_oxygen(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.pao2, 'po');
  ensureNum(req.sao2_rest, 'sr'); ensureNum(req.sao2_walk, 'sw');
  ensureEnum(req.liters_needed, 'ln', ['0','1','2','3','4','5','NA']);
  ensureBool(req.continuous, 'co'); ensureNum(req.days_on_oxygen, 'do');
  ensureEnum(req.disposition, 'di', ['continue','adjust','discontinue','NA']);
  ensureStr(req.provider, 'pr');
  return { ho_id: `ho_${Date.now()}`, patient_id: req.patient_id, l: req.liters_needed, disp: req.disposition };
}

function funcs() { return { asthma_eval, copd_eval, sleep_study, tb_screening, home_oxygen }; }
module.exports = { funcs, ValidationError };