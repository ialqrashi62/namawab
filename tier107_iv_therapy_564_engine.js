// filepath: tier107_iv_therapy_564_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function iv_insertion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.insertion_id, 'iid');
  ensureEnum(req.site, 'st', ['r_forearm','l_forearm','r_hand','l_hand','antecubital','wrist','other','unknown']);
  ensureNum(req.gauge, 'gg');
  ensureNum(req.attempts, 'att');
  ensureBool(req.success, 'succ');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { iid: req.insertion_id };
}
function iv_maintenance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.maintenance_id, 'mid');
  ensureStr(req.line_id, 'lid');
  ensureEnum(req.site_assessment, 'sa', ['clean','redness','drainage','infiltrated','phlebitis','other','unknown']);
  ensureBool(req.dressing_change, 'dc');
  ensureBool(req.tubing_change, 'tc');
  ensureBool(req.lumen_patent, 'lp');
  ensureStr(req.provider, 'pr');
  return { mid: req.maintenance_id };
}
function central_line(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.placement_id, 'pid');
  ensureEnum(req.line_type, 'lt', ['picc','central','tunneled','implanted_port','peripheral','other','unknown']);
  ensureEnum(req.site, 'st', ['basilic','cephalic','brachial','femoral','subclavian','jugular','other','unknown']);
  ensureEnum(req.verification, 'vf', ['tip_echo','tip_xray','tip_ekg','fluoro','other','unknown','none']);
  ensureNum(req.complications, 'comp');
  ensureBool(req.first_use, 'fu');
  ensureStr(req.provider, 'pr');
  return { pid: req.placement_id };
}
function phlebotomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.draw_id, 'did');
  ensureEnum(req.site, 'st', ['antecubital','wrist','hand','foot','other','unknown']);
  ensureNum(req.tubes_collected, 'tc');
  ensureNum(req.attempts, 'att');
  ensureEnum(req.patient_comfort, 'pc', ['tolerated','minimal_discomfort','moderate_pain','severe_pain','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.draw_id };
}
function infusion_reaction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reaction_id, 'rid');
  ensureStr(req.medication, 'med');
  ensureEnum(req.reaction_type, 'rt', ['red_man','anaphylaxis','febrile','rigors','hypotension','other','unknown']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening','fatal','other','unknown']);
  ensureEnum(req.intervention, 'int', ['stop_infusion','slow_infusion','premedicate','epinephrine','other','unknown']);
  ensureEnum(req.outcome, 'out', ['resolved','ongoing','transferred','expired','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.reaction_id };
}

function funcs() { return { iv_insertion, iv_maintenance, central_line, phlebotomy, infusion_reaction }; }
module.exports = { funcs, ValidationError };