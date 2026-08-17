// filepath: tier49_nursing_ext_280_nurs_wound_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function wound_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.site, 'site');
  ensureEnum(req.stage, 'stage', ['stage_1','stage_2','stage_3','stage_4','unstageable','dtpi']);
  ensureStr(req.size_cm, 'sz');
  ensureNum(req.depth_cm, 'depth');
  ensureStr(req.exudate, 'exud');
  ensureStr(req.peri_wound, 'peri');
  ensureNum(req.pain, 'pain');
  return { site: req.site, stage: req.stage };
}
function dressing_change(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.wound_type, 'wt');
  ensureStr(req.old_dressing, 'od');
  ensureStr(req.new_dressing, 'nd');
  ensureEnum(req.peri_wound_assessment, 'pwa', ['normal_healing','redness','maceration','erythema','dehiscence']);
  ensureEnum(req.frequency, 'freq', ['daily','bid','qid','prn','qod']);
  return { wound_type: req.wound_type, frequency: req.frequency };
}
function ostomy_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stoma_type, 'st', ['colostomy','ileostomy','urostomy','jejunostomy']);
  ensureEnum(req.stoma_appearance, 'sa', ['pink_moist','pale','dusky','necrotic']);
  ensureStr(req.output, 'out');
  ensureEnum(req.peristomal_skin, 'ps', ['intact','macerated','excoriated','normal']);
  ensureStr(req.pouch_change, 'pc');
  return { stoma_type: req.stoma_type };
}
function trach_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.trach_type, 'tt', ['cuffed','cuffless','fenestrated','speaking_valve']);
  ensureNum(req.cuff_pressure_cm_h2o, 'cp');
  ensureStr(req.inner_cannula_clean, 'icc');
  ensureStr(req.suction_frequency, 'sf');
  ensureStr(req.stoma_site, 'ss');
  return { trach_type: req.trach_type };
}
function suctioning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.method, 'm', ['inline_closed','open_suction','nasotracheal','oral','deep']);
  ensureNum(req.passes, 'p');
  ensureStr(req.secretion, 'sec');
  ensureStr(req.pre_post_oxygen_sat, 'spo2');
  ensureStr(req.complications, 'comp');
  return { method: req.method, passes: req.passes };
}

function funcs() { return { wound_assessment, dressing_change, ostomy_care, trach_care, suctioning }; }
module.exports = { funcs, ValidationError };