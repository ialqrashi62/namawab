// filepath: tier43_surgery_ext_250_vascular_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function aaa_repair(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['infrarenal','juxtarenal','suprarenal','thoracic','thoracoabdominal']);
  ensureEnum(req.approach, 'ap', ['endovascular','open','hybrid']);
  ensureNum(req.size_cm, 'sz');
  ensureNum(req.op_time_min, 'op');
  ensureBool(req.contrast_used, 'contrast');
  ensureNum(req.length_of_stay_days, 'los');
  return { type: req.type, approach: req.approach, size: req.size_cm };
}
function carotid_endarterectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.symptomatic, 'sx');
  ensureNum(req.stenosis_pct, 'sten');
  ensureBool(req.shunt_used, 'shunt');
  ensureNum(req.op_time_min, 'op');
  return { symptomatic: req.symptomatic, stenosis: req.stenosis_pct };
}
function bypass_graft(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.type, 'typ');
  ensureStr(req.graft, 'graft');
  ensureStr(req.indication, 'ind');
  ensureNum(req.op_time_min, 'op');
  ensureEnum(req.patency, 'pat', ['good','fair','poor','occluded']);
  return { type: req.type, graft: req.graft, patency: req.patency };
}
function varicose_vein(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.approach, 'ap', ['open_stripping','endovenous_laser','radiofrequency_ablation','foam_sclerotherapy','mechanochemical']);
  ensureStr(req.vein, 'vein');
  ensureNum(req.op_time_min, 'op');
  ensureNum(req.follow_up, 'fu');
  return { approach: req.approach, vein: req.vein };
}
function emoblization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.artery, 'art');
  ensureEnum(req.material, 'mat', ['coils','particles','gelfoam','glue','onyx','plugs']);
  ensureBool(req.success, 'succ');
  return { indication: req.indication, artery: req.artery, success: req.success };
}

function funcs() { return { aaa_repair, carotid_endarterectomy, bypass_graft, varicose_vein, emoblization }; }
module.exports = { funcs, ValidationError };