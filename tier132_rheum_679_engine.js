// filepath: tier132_rheum_679_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function arthrocentesis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.arth_id, 'aid');
  ensureStr(req.joint, 'jt');
  ensureNum(req.volume_ml, 'vol');
  ensureEnum(req.appearance, 'apr', ['clear','cloudy','bloody','purulent','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.arth_id };
}
function connective_tissue(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.con_id, 'cid');
  ensureNum(req.ana, 'ana');
  ensureNum(req.dsdna, 'dsd');
  ensureEnum(req.diagnosis, 'dg', ['sle','sjogren','scleroderma','mctd','undifferentiated','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.con_id };
}
function dmards(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.med_id, 'mid');
  ensureStr(req.drug, 'drug');
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.duration_months, 'dur');
  ensureBool(req.effective, 'eff');
  ensureStr(req.provider, 'pr');
  return { mid: req.med_id };
}
function rehab_assess(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rehab_id, 'rid');
  ensureNum(req.haq_score, 'haq');
  ensureNum(req.pain_score, 'ps');
  ensureStr(req.goals, 'g');
  ensureStr(req.provider, 'pr');
  return { rid: req.rehab_id };
}
function das28(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.das_id, 'did');
  ensureNum(req.tender_joints, 'tj');
  ensureNum(req.swollen_joints, 'sj');
  ensureNum(req.esr, 'esr');
  ensureEnum(req.activity, 'act', ['remission','low','moderate','high','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.das_id };
}

function funcs() { return { arthrocentesis, connective_tissue, dmards, rehab_assess, das28 }; }
module.exports = { funcs, ValidationError };