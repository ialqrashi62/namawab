// filepath: tier126_anesthesia_653_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function preop_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.preop_id, 'pid');
  ensureEnum(req.asa_class, 'asa', ['1','2','3','4','5','6','other','unknown']);
  ensureEnum(req.fast_status, 'fst', ['cleared','not_clear','npo_unknown','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.preop_id };
}
function anesthesia_induction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.induction_id, 'iid');
  ensureEnum(req.airway, 'aw', ['normal','difficult','emergency','other','unknown']);
  ensureStr(req.agent, 'agt');
  ensureEnum(req.laryngoscopy, 'lsk', ['grade_1','grade_2','grade_3','grade_4','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { iid: req.induction_id };
}
function intraop_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.intraop_id, 'iid');
  ensureBool(req.vital_signs_stable, 'vss');
  ensureNum(req.blood_loss_ml, 'bl');
  ensureNum(req.urine_output_ml, 'uo');
  ensureStr(req.provider, 'pr');
  return { iid: req.intraop_id };
}
function emergence(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.emergence_id, 'eid');
  ensureEnum(req.extubation, 'ext', ['successful','delayed','reintubated','other','unknown']);
  ensureNum(req.pain_score, 'ps');
  ensureStr(req.provider, 'pr');
  return { eid: req.emergence_id };
}
function regional_block(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.regional_id, 'rid');
  ensureEnum(req.block_type, 'bt', ['spinal','epidural','brachial','femoral','axillary','other','unknown']);
  ensureStr(req.level, 'lvl');
  ensureBool(req.complications, 'cmp');
  ensureStr(req.provider, 'pr');
  return { rid: req.regional_id };
}

function funcs() { return { preop_assessment, anesthesia_induction, intraop_monitoring, emergence, regional_block }; }
module.exports = { funcs, ValidationError };