// filepath: tier115_ophthalmology_608_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cataract_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.eye, 'ey', ['left','right','both','other','unknown']);
  ensureEnum(req.lens, 'lens', ['monofocal','multifocal','toric','edof','other','unknown']);
  ensureEnum(req.technique, 'tech', ['phaco','manual','femto','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.visual_acuity_post, 'vap');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function retinal_detachment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.eye, 'ey', ['left','right','both','other','unknown']);
  ensureEnum(req.type, 'tp', ['rhegmatogenous','tractional','exudative','other','unknown']);
  ensureEnum(req.procedure, 'proc', ['vitrectomy','scleral_buckle','pneumatic_retinopexy','combination','other','unknown']);
  ensureEnum(req.tamponade, 'tmp', ['sf6','c3f8','silicone_oil','air','none','other','unknown']);
  ensureBool(req.anatomic_success, 'ans');
  ensureNum(req.vision_improvement, 'vi');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function glaucoma_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.eye, 'ey', ['left','right','both','other','unknown']);
  ensureEnum(req.type, 'tp', ['trabeculectomy','tube_shunt','migs','cyclophotocoagulation','other','unknown']);
  ensureNum(req.target_iop, 'ti');
  ensureEnum(req.outcome, 'out', ['controlled','partial','failed','other','unknown']);
  ensureEnum(req.bleb_status, 'bs', ['functioning','encapsulated','failed','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function refractive_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.eye, 'ey', ['left','right','both','other','unknown']);
  ensureEnum(req.type, 'tp', ['lasik','prk','smile','icl','rle','other','unknown']);
  ensureNum(req.preop_refraction, 'pr');
  ensureNum(req.postop_refraction, 'por');
  ensureNum(req.visual_acuity_post, 'vap');
  ensureNum(req.satisfaction, 'sat');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function corneal_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.eye, 'ey', ['left','right','both','other','unknown']);
  ensureEnum(req.graft, 'grf', ['penetrating','lamellar','endothelial','other','unknown']);
  ensureEnum(req.indication, 'ind', ['keratoconus','edema','scarring','other','unknown']);
  ensureNum(req.donor_age, 'da');
  ensureBool(req.rejection, 'rj');
  ensureNum(req.visual_acuity_post, 'vap');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { cataract_surgery, retinal_detachment, glaucoma_surgery, refractive_surgery, corneal_transplant }; }
module.exports = { funcs, ValidationError };