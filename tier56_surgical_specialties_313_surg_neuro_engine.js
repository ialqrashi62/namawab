// filepath: tier56_surgical_specialties_313_surg_neuro_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function craniotomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.approach, 'app');
  ensureEnum(req.extent_of_resection, 'eor', ['gross_total','subtotal','partial','biopsy_only','debulking']);
  ensureBool(req.iop_monitoring, 'iop');
  ensureStr(req.complications, 'comp');
  ensureNum(req.follow_up_imaging_weeks, 'fu');
  return { indication: req.indication };
}
function spinal_fusion_neuro(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.level, 'lvl');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.approach, 'app', ['plif','tlif','alif','xlif','posterior','combined']);
  ensureStr(req.instrumentation, 'inst');
  ensureNum(req.levels_fused, 'lf');
  ensureStr(req.complications, 'comp');
  return { level: req.level };
}
function tumor_resection_brain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['glioma','meningioma','metastasis','lymphoma','pilocytic_astrocytoma','medulloblastoma']);
  ensureStr(req.location, 'loc');
  ensureEnum(req.extent, 'ext', ['gross_total','subtotal','partial','biopsy_only']);
  ensureStr(req.neuromonitoring, 'nm');
  ensureStr(req.residual, 'res');
  ensureBool(req.molecular, 'mol');
  return { type: req.type };
}
function vascular_neuro(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.condition, 'cond');
  ensureEnum(req.clipping_vs_coiling, 'cvc', ['surgical_clipping','endovascular_coiling','combined','observation','flow_diversion']);
  ensureStr(req.surgical_approach, 'app');
  ensureNum(req.temporary_clip_time_min, 'tct');
  ensureStr(req.complications, 'comp');
  return { condition: req.condition };
}
function functional_neurosurg(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.procedure, 'proc');
  ensureStr(req.target, 'tgt');
  ensureBool(req.success, 'succ');
  ensureStr(req.complications, 'comp');
  return { procedure: req.procedure };
}

function funcs() { return { craniotomy, spinal_fusion_neuro, tumor_resection_brain, vascular_neuro, functional_neurosurg }; }
module.exports = { funcs, ValidationError };