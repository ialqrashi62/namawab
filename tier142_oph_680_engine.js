// filepath: tier142_oph_680_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function refraction(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.od_sph, 'os');
  ensureNum(req.od_cyl, 'oc');
  ensureNum(req.od_axis, 'oa');
  ensureNum(req.os_sph, 'ss');
  ensureNum(req.os_cyl, 'sc');
  ensureNum(req.os_axis, 'sa');
  ensureNum(req.add_od, 'ao');
  ensureNum(req.add_os, 'as');
  ensureStr(req.va_od, 'vo');
  ensureStr(req.va_os, 'vs');
  ensureStr(req.provider, 'pr');
  return { rx_id: `rx_${Date.now()}`, patient_id: req.patient_id, od_sph: req.od_sph, os_sph: req.os_sph };
}
function cataract(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.od_axis, 'oa');
  ensureNum(req.os_axis, 'sa');
  ensureEnum(req.lens_type, 'lt', ['monofocal','toric','multifocal','EDOF','light_adjustable','accommodating','phakic','piggyback']);
  ensureNum(req.lens_power_od, 'lo');
  ensureNum(req.lens_power_os, 'ls');
  ensureEnum(req.complications, 'cm', ['none','PCR','zonular_dialysis','vitreous_loss','IOL_drop','endophthalmitis','CME','other']);
  ensureStr(req.va_od_post_op, 'vo');
  ensureStr(req.va_os_post_op, 'vs');
  ensureStr(req.surgeon, 'sg');
  return { ct_id: `ct_${Date.now()}`, patient_id: req.patient_id, lens_type: req.lens_type, va_od_post: req.va_od_post_op };
}
function retina(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.diagnosis, 'dx', ['AMD_wet','AMD_dry','DR_advanced','DME','retinal_detachment','macular_hole','ERM','CRVO','BRVO','ROP','other']);
  ensureEnum(req.treatment, 'tr', ['observation','intravitreal_anti_VEGF','intravitreal_steroid','laser','vitrectomy','scleral_buckle','pneumatic_retinopexy','cryotherapy','PDT','combination']);
  ensureNum(req.cmt_um, 'cu');
  ensureStr(req.bcva, 'bc');
  ensureEnum(req.eye, 'ey', ['OD','OS','OU']);
  ensureStr(req.provider, 'pr');
  return { rt_id: `rt_${Date.now()}`, patient_id: req.patient_id, diagnosis: req.diagnosis, treatment: req.treatment };
}
function glaucoma(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.iop_od, 'io');
  ensureNum(req.iop_os, 'is');
  ensureNum(req.cct, 'ct');
  ensureEnum(req.stage, 'st', ['suspect','mild','moderate','severe','end_stage','controlled','uncontrolled','normal_tension','secondary','congenital']);
  ensureNum(req.cdr_od, 'co');
  ensureNum(req.cdr_os, 'cs');
  ensureEnum(req.medication, 'md', ['prostaglandin','beta_blocker','alpha_agonist','carbonic_anhydrase','combination','none','other']);
  ensureStr(req.provider, 'pr');
  return { gl_id: `gl_${Date.now()}`, patient_id: req.patient_id, iop_od: req.iop_od, stage: req.stage };
}
function lasik(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.surgery_type, 'st', ['LASIK','PRK','SMILE','ICL','RLE','CK','crosslinking','intac_ring','KAMRA','custom']);
  ensureNum(req.od_pre_sph, 'os');
  ensureNum(req.os_pre_sph, 'ss');
  ensureNum(req.od_pre_cyl, 'oc');
  ensureNum(req.os_pre_cyl, 'sc');
  ensureNum(req.cct_pre, 'ct');
  ensureStr(req.laser_system, 'ls');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.va_od_post_op, 'vo');
  ensureStr(req.va_os_post_op, 'vs');
  return { lk_id: `lk_${Date.now()}`, patient_id: req.patient_id, surgery_type: req.surgery_type, va_od_post: req.va_od_post_op };
}

function funcs() { return { refraction, cataract, retina, glaucoma, lasik }; }
module.exports = { funcs, ValidationError };
