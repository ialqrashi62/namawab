// filepath: tier149_pul_706_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pft(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.fvc_l, 'fv');
  ensureNum(req.fev1_l, 'fe');
  ensureNum(req.fev1_fvc_pct, 'ff');
  ensureNum(req.pef_l_min, 'pf');
  ensureNum(req.tlc_l, 'tl');
  ensureNum(req.rv_l, 'rv');
  ensureNum(req.dlco, 'dl');
  ensureEnum(req.pattern, 'pa', ['normal','obstructive','restrictive','mixed','NA','unknown']);
  ensureNum(req.bronchodilator_response_pct, 'br');
  ensureStr(req.provider, 'pr');
  return { pf_id: `pft_${Date.now()}`, patient_id: req.patient_id, fev1: req.fev1_l, fvc: req.fvc_l };
}
function sleep(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['home_sleep_test','attended_PG','split_night','titration','MSLT','MWT','actigraphy','other']);
  ensureNum(req.ahi, 'ah');
  ensureNum(req.odi, 'od');
  ensureNum(req.tst_min, 'ts');
  ensureNum(req.sleep_efficiency_pct, 'se');
  ensureNum(req.min_sao2, 'ms');
  ensureEnum(req.severity, 'sv', ['none','mild','moderate','severe','unknown']);
  ensureEnum(req.position, 'po', ['supine_predominant','non_supine','mixed','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { sl_id: `slp_${Date.now()}`, patient_id: req.patient_id, ahi: req.ahi, severity: req.severity };
}
function copd(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.gold_stage, 'gs', ['I_mild','II_moderate','III_severe','IV_very_severe','unknown']);
  ensureEnum(req.gold_group, 'gg', ['A_low_symp_low_risk','B_high_symp_low_risk','C_low_symp_high_risk','D_high_symp_high_risk','unknown']);
  ensureNum(req.exacerbations_per_year, 'ep');
  ensureNum(req.mmrc, 'mm');
  ensureNum(req.cat_score, 'ca');
  ensureNum(req.sao2, 'so');
  ensureNum(req.pao2, 'pa');
  ensureNum(req.paco2, 'pc');
  ensureNum(req.fev1_pct_predicted, 'fe');
  ensureStr(req.provider, 'pr');
  return { cp_id: `cpd_${Date.now()}`, patient_id: req.patient_id, gold: req.gold_stage };
}
function asthma(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.control, 'co', ['well_controlled','partly_controlled','uncontrolled','unknown']);
  ensureNum(req.act_score, 'ac');
  ensureNum(req.fev1_pct_pred, 'fe');
  ensureNum(req.feNO, 'fn');
  ensureNum(req.exacerbations_per_year, 'ep');
  ensureNum(req.ics_dose, 'id');
  ensureEnum(req.biomarker, 'bi', ['eos_low','eos_high','eosinophilic','neutrophilic','paucigranulocytic','NA','unknown']);
  ensureNum(req.blood_eos, 'be');
  ensureStr(req.provider, 'pr');
  return { as_id: `ast_${Date.now()}`, patient_id: req.patient_id, control: req.control };
}
function bronchoscopy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['BAL','brushings','biopsy','EBUS','TBNA','navigation','therapeutic_stent','therapeutic_debulking','foreign_body','brachytherapy','cryobiopsy','laser','electrocautery','stent_placement','other']);
  ensureNum(req.duration_min, 'du');
  ensureBool(req.ebl, 'eb');
  ensureEnum(req.findings, 'fi', ['normal','mass','infection','inflammation','fibrosis','airway_stenosis','foreign_body','bleeding','other']);
  ensureNum(req.biopsy_count, 'bc');
  ensureNum(req.bal_volume_ml, 'bv');
  ensureBool(req.complications, 'cp');
  ensureStr(req.provider, 'pr');
  return { br_id: `brc_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}

function funcs() { return { pft, sleep, copd, asthma, bronchoscopy }; }
module.exports = { funcs, ValidationError };