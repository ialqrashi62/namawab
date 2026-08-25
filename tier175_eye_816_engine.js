// filepath: tier175_eye_816_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function glaucoma_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.iop_od, 'io');
  ensureNum(req.iop_os, 'is'); ensureEnum(req.cup_disc_ratio, 'cd', ['normal','borderline','enlarged','severe','NA']);
  ensureNum(req.field_loss_pct, 'fl'); ensureNum(req.drops_count, 'dc');
  ensureBool(req.laser_done, 'ld'); ensureEnum(req.disposition, 'di', ['continue','adjust','surgery','monitor','NA']);
  ensureStr(req.provider, 'pr');
  return { gf_id: `gf_${Date.now()}`, patient_id: req.patient_id, iop: req.iop_od, fl: req.field_loss_pct };
}

function macular_degen(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['dry','wet','NA']);
  ensureNum(req.va_od, 'vo'); ensureNum(req.va_os, 'vs');
  ensureEnum(req.oct_findings, 'oc', ['drusen','fluid','hemorrhage','atrophy','normal','NA']);
  ensureBool(req.anti_vegf_treatment, 'av'); ensureNum(req.injections_30d, 'in');
  ensureEnum(req.disposition, 'di', ['continue','observe','inject','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { md_id: `md_${Date.now()}`, patient_id: req.patient_id, type: req.type, va: req.va_od };
}

function cataract_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.eye, 'ey', ['left','right','bilateral','NA']);
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','mature','NA']);
  ensureNum(req.va_pre, 'vp'); ensureBool(req.glare_disability, 'gd');
  ensureBool(req.surgery_planned, 'sp'); ensureEnum(req.iol_type, 'it', ['monofocal','multifocal','toric','NA']);
  ensureEnum(req.disposition, 'di', ['observe','surgery_planned','surgery_done','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { ce_id: `ce_${Date.now()}`, patient_id: req.patient_id, eye: req.eye, sv: req.severity };
}

function retinal_detach(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.eye, 'ey', ['left','right','NA']);
  ensureEnum(req.type, 'ty', ['rhegmatogenous','tractional','exudative','NA']);
  ensureNum(req.macula_off_hr, 'mo'); ensureBool(req.surgery_urgency, 'su');
  ensureEnum(req.procedure, 'pr', ['observation','laser','cryo','vitrectomy','scleral_buckle','NA']);
  ensureNum(req.anesthesia_min, 'an'); ensureEnum(req.outcome, 'ot', ['attached','detached','pending','NA']);
  ensureStr(req.provider, 'pr');
  return { rd_id: `rd_${Date.now()}`, patient_id: req.patient_id, type: req.type, ot: req.outcome };
}

function pediatric_eye(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.disorder, 'di', ['ROP','strabismus','amblyopia','conjunctivitis','other','NA']);
  ensureNum(req.va_od, 'vo'); ensureNum(req.va_os, 'vs');
  ensureEnum(req.treatment, 'tr', ['observation','patch','glasses','surgery','NA']);
  ensureNum(req.followup_months, 'fu'); ensureEnum(req.disposition, 'di2', ['continue','monitor','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { pe_id: `pe_${Date.now()}`, patient_id: req.patient_id, di: req.disorder, vo: req.va_od };
}

function funcs() { return { glaucoma_follow, macular_degen, cataract_eval, retinal_detach, pediatric_eye }; }
module.exports = { funcs, ValidationError };