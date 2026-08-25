// filepath: tier166_vis_778_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function visual_acuity(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.left_eye_va, 'le');
  ensureNum(req.right_eye_va, 're'); ensureNum(req.both_eye_va, 'be');
  ensureEnum(req.correction, 'co', ['unaided','corrected','contact','NA']);
  ensureNum(req.glasses_prescription, 'gp'); ensureBool(req.refraction_done, 'rd');
  ensureEnum(req.disposition, 'di', ['normal','referral','new_glasses','change','NA']);
  ensureStr(req.provider, 'pr');
  return { va_id: `va_${Date.now()}`, patient_id: req.patient_id, od: req.right_eye_va, os: req.left_eye_va };
}

function refraction(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.sphere_od, 'so');
  ensureNum(req.cylinder_od, 'co'); ensureNum(req.axis_od, 'ao');
  ensureNum(req.sphere_os, 'ss'); ensureNum(req.cylinder_os, 'cs');
  ensureNum(req.axis_os, 'as'); ensureNum(req.add_od, 'ao2');
  ensureNum(req.add_os, 'as2'); ensureEnum(req.disposition, 'di', ['glasses','contacts','monitor','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { rf_id: `rf_${Date.now()}`, patient_id: req.patient_id, sphere: req.sphere_od, cyl: req.cylinder_od };
}

function ophthalmic_exam(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.exam_type, 'et', ['slit_lamp','fundoscopy','tonometry','visual_field','oct','fluorescein','NA']);
  ensureNum(req.iop_od, 'io'); ensureNum(req.iop_os, 'is');
  ensureEnum(req.cup_disc_ratio, 'cd', ['normal','borderline','enlarged','NA']);
  ensureBool(req.cataract, 'ca'); ensureBool(req.glaucoma, 'gl');
  ensureBool(req.macula_normal, 'mn'); ensureEnum(req.disposition, 'di', ['normal','follow_up','treatment','refer','NA']);
  ensureStr(req.provider, 'pr');
  return { oe_id: `oe_${Date.now()}`, patient_id: req.patient_id, iop: req.iop_od, cup: req.cup_disc_ratio };
}

function retinal_screening(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureBool(req.diabetic, 'db');
  ensureEnum(req.grade, 'gr', ['none','mild','moderate','severe','proliferative','NA']);
  ensureBool(req.macula_edema, 'me'); ensureNum(req.screening_count, 'sc');
  ensureBool(req.image_quality_ok, 'iq'); ensureEnum(req.method, 'mt', ['fundus_photo','oct','dilated_exam','NA']);
  ensureEnum(req.disposition, 'di', ['normal','follow_up','treatment','urgent','NA']);
  ensureStr(req.provider, 'pr');
  return { rs_id: `rs_${Date.now()}`, patient_id: req.patient_id, grade: req.grade, diab: req.diabetic };
}

function pediatric_vision(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.test_method, 'tm', ['Snellen','LEA','HOTV','fixation','preferential_looking','NA']);
  ensureNum(req.va_od, 'vo'); ensureNum(req.va_os, 'vs');
  ensureBool(req.amblyopia, 'am'); ensureBool(req.strabismus, 'st');
  ensureNum(req.stereoacuity, 'sa'); ensureEnum(req.referral, 're', ['none','glasses','patch','surgery','monitor','NA']);
  ensureStr(req.provider, 'pr');
  return { pv_id: `pv_${Date.now()}`, patient_id: req.patient_id, va: req.va_od, ref: req.referral };
}

function funcs() { return { visual_acuity, refraction, ophthalmic_exam, retinal_screening, pediatric_vision }; }
module.exports = { funcs, ValidationError };