// filepath: tier143_uro_683_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function psa(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.psa_ng_ml, 'ps');
  ensureNum(req.psa_age_adj, 'aa');
  ensureNum(req.psa_velocity, 'pv');
  ensureNum(req.psa_density, 'pd');
  ensureEnum(req.zone, 'zn', ['transition','peripheral','central','undefined']);
  ensureNum(req.prostate_volume, 'pv2');
  ensureStr(req.provider, 'pr');
  return { ps_id: `ps_${Date.now()}`, patient_id: req.patient_id, psa: req.psa_ng_ml };
}
function uroflow(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.q_max, 'qm');
  ensureNum(req.q_avg, 'qa');
  ensureNum(req.voided_volume, 'vv');
  ensureNum(req.residual_volume, 'rv');
  ensureNum(req.flow_time, 'ft');
  ensureEnum(req.pattern, 'pt', ['normal','obstructive','intermittent','decreased','abnormal','unknown']);
  ensureStr(req.provider, 'pr');
  return { uf_id: `uf_${Date.now()}`, patient_id: req.patient_id, q_max: req.q_max, pattern: req.pattern };
}
function biopsy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.approach, 'ap', ['transrectal','transperineal','transurethral','surgical','targeted_fusion','systematic','saturated','other']);
  ensureNum(req.cores, 'co');
  ensureNum(req.positive_cores, 'pc');
  ensureEnum(req.gleason, 'gl', ['6_low','7_intermediate','8_high','9_high','10_high','other']);
  ensureEnum(req.stage, 'st', ['T1a','T1b','T1c','T2a','T2b','T2c','T3a','T3b','T4','unknown']);
  ensureStr(req.provider, 'pr');
  return { bx_id: `bx_${Date.now()}`, patient_id: req.patient_id, cores: req.cores, gleason: req.gleason };
}
function stone(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.stone_id, 'si');
  ensureNum(req.size_mm, 'sz');
  ensureStr(req.location, 'lc');
  ensureEnum(req.type, 'tp', ['calcium_oxalate','calcium_phosphate','uric_acid','struvite','cystine','mixed','unknown']);
  ensureNum(req.hounsfield, 'hu');
  ensureEnum(req.management, 'mg', ['observation','ESWL','URS','PCNL','lithotripsy','surgery','medical','other']);
  ensureStr(req.provider, 'pr');
  return { st_id: `st_${Date.now()}`, stone_id: req.stone_id, size: req.size_mm, management: req.management };
}
function urinary(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['incontinence','retention','hesitancy','urgency','nocturia','frequency','hematuria','dysuria','incomplete_emptying','other']);
  ensureNum(req.episodes_per_day, 'ed');
  ensureNum(req.pad_count, 'pc');
  ensureNum(req.ipss_score, 'is');
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe']);
  ensureStr(req.provider, 'pr');
  return { un_id: `un_${Date.now()}`, patient_id: req.patient_id, type: req.type, ipss: req.ipss_score };
}

function funcs() { return { psa, uroflow, biopsy, stone, urinary }; }
module.exports = { funcs, ValidationError };
