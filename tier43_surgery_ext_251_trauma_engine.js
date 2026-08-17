// filepath: tier43_surgery_ext_251_trauma_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function damage_control_lap(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.packs_count, 'packs');
  ensureEnum(req.resuscitation, 'res', ['massive_transfusion','whole_blood','component_therapy','none']);
  ensureEnum(req.reoperation, 'reop', ['planned_24h','planned_48h','completed_now','none_needed']);
  ensureEnum(req.status, 'stat', ['stabilized','unstable','deteriorating','expired']);
  return { packs: req.packs_count, status: req.status };
}
function fasciotomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.compartment, 'comp', ['leg','foot','forearm','hand','thigh','buttock']);
  ensureStr(req.cause, 'cause');
  ensureEnum(req.fasciotomy_type, 'typ', ['one_incision','two_incision','three_incision','percutaneous','endoscopic']);
  ensureBool(req.delayed_closure, 'delayed');
  return { compartment: req.compartment, type: req.fasciotomy_type };
}
function thoracotomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.side, 'sd', ['left','right','bilateral','clamshell']);
  ensureNum(req.ebl, 'ebl');
  ensureEnum(req.resuscitation, 'res', ['massive_transfusion','whole_blood','component_therapy','none']);
  ensureEnum(req.status, 'stat', ['controlled','ongoing','temporary','expired']);
  return { side: req.side, status: req.status };
}
function neck_exploration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.zone, 'zone', ['zone_1','zone_2','zone_3']);
  ensureStr(req.injury_type, 'inj');
  ensureEnum(req.approach, 'ap', ['collar_incision','mcfee','thoracotomy_extension','mandibular_split']);
  ensureStr(req.findings, 'find');
  return { zone: req.zone, findings: req.findings };
}
function pelvic_packing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.fracture_type, 'fx', ['open_book','lateral_compression','vertical_shear','combined']);
  ensureEnum(req.approach, 'ap', ['suprapubic_extrapertioneal','transperitoneal','percutaneous_angio']);
  ensureNum(req.packing_count, 'packs');
  ensureBool(req.angioembolization, 'angio');
  ensureStr(req.stabilization, 'stab');
  return { fracture: req.fracture_type, packs: req.packing_count, stabilization: req.stabilization };
}

function funcs() { return { damage_control_lap, fasciotomy, thoracotomy, neck_exploration, pelvic_packing }; }
module.exports = { funcs, ValidationError };