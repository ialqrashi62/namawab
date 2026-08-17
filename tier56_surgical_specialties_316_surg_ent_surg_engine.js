// filepath: tier56_surgical_specialties_316_surg_ent_surg_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function thyroidectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.extent, 'ext', ['total','near_total','lobectomy','subtotal','completion']);
  ensureStr(req.central_neck_dissection, 'cnd');
  ensureBool(req.recurrent_laryngeal_nerve_monitoring, 'rln');
  ensureEnum(req.calcium_post_op, 'ca', ['normal','mild_hypocalcemia','moderate_hypocalcemia','severe_hypocalcemia']);
  ensureStr(req.complications, 'comp');
  return { extent: req.extent };
}
function parathyroidectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.localization, 'loc');
  ensureStr(req.exploration, 'exp');
  ensureNum(req.calcium_post_op, 'ca');
  ensureBool(req.success, 'succ');
  return { indication: req.indication };
}
function neck_dissection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.type, 'typ');
  ensureStr(req.indication, 'ind');
  ensureNum(req.lymph_nodes_positive, 'lnp');
  ensureNum(req.lymph_nodes_total, 'lnt');
  ensureStr(req.complications, 'comp');
  return { type: req.type };
}
function tonsillectomy_bleeding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.timing, 'tim');
  ensureEnum(req.severity, 'sev', ['mild_oozing','moderate_active_bleeding','severe_hemorrhage','life_threatening']);
  ensureStr(req.management, 'mgmt');
  ensureBool(req.transfusion, 'tx');
  ensureNum(req.discharge_days, 'dc');
  return { severity: req.severity };
}
function sinus_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.approach, 'app', ['functional_endoscopic','endoscopic_modified_lothrop','external_ethmoidectomy','trephine']);
  ensureStr(req.extent, 'ext');
  ensureBool(req.navigation_used, 'nav');
  ensureStr(req.complications, 'comp');
  return { indication: req.indication };
}

function funcs() { return { thyroidectomy, parathyroidectomy, neck_dissection, tonsillectomy_bleeding, sinus_surgery }; }
module.exports = { funcs, ValidationError };