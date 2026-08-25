// filepath: tier135_rob_691_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function preop(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.asa, 'sa', ['1','2','3','4','5','6']);
  ensureEnum(req.airway, 'aw', ['Mallampati1','Mallampati2','Mallampati3','Mallampati4']);
  ensureNum(req.consent_signed, 'cs');
  ensureStr(req.surgical_site, 'ss');
  ensureStr(req.planned_proc, 'pp');
  return { preop_id: `pop_${Date.now()}`, patient_id: req.patient_id, asa: req.asa, airway: req.airway, procedure: req.planned_proc };
}
function console(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.system, 'sy', ['DaVinci','Mako','Rosa','Stryker_Mako','Ion','Hugo','Versius','Senhance']);
  ensureEnum(req.procedure, 'pr', ['prostatectomy','hysterectomy','nephrectomy','partial_nephrectomy','mitral_repair','TAVR','bariatric','thoracic','spine','total_hip','total_knee']);
  ensureNum(req.dock_time_min, 'dt');
  ensureNum(req.console_time_min, 'ct');
  ensureStr(req.surgeon, 'sg');
  return { console_id: `con_${Date.now()}`, patient_id: req.patient_id, system: req.system, procedure: req.procedure, console: req.console_time_min };
}
function outcomes(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.endpoint, 'ep', ['operative_success','conversion','mortality','readmission','LOS','EBL','complication','lymph_node_yield','margin_status']);
  ensureStr(req.value, 'vl');
  ensureEnum(req.timeframe, 'tf', ['intraop','24h','7d','30d','90d','1y']);
  ensureStr(req.reporting, 'rp');
  return { out_id: `out_${Date.now()}`, patient_id: req.patient_id, endpoint: req.endpoint, value: req.value, timeframe: req.timeframe };
}
function training(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.surgeon_id, 'sid');
  ensureStr(req.system, 'sy');
  ensureEnum(req.module, 'md', ['basic','intermediate','advanced','specialty','proctoring','certification']);
  ensureNum(req.hours, 'hr');
  ensureNum(req.sim_score, 'ss');
  ensureStr(req.evaluator, 'ev');
  return { train_id: `trn_${Date.now()}`, surgeon_id: req.surgeon_id, system: req.system, module: req.module, score: req.sim_score };
}
function complication(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.clavien_dindo, 'cd', ['1','2','3a','3b','4a','4b','5']);
  ensureStr(req.event, 'ev');
  ensureEnum(req.intraop_postop, 'ip', ['intraop','postop_24h','postop_7d','postop_30d']);
  ensureStr(req.management, 'mg');
  ensureStr(req.outcome, 'oc');
  return { comp_id: `cmp_${Date.now()}`, patient_id: req.patient_id, grade: req.clavien_dindo, event: req.event };
}

function funcs() { return { preop, console, outcomes, training, complication }; }
module.exports = { funcs, ValidationError };
