// filepath: tier50_cardiology_ext_287_card_cong_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function atrial_septal_defect(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['secundum','primum','sinus_venosus','coronary_sinus']);
  ensureNum(req.size_mm, 'sz');
  ensureNum(req.qp_qs_ratio, 'qp');
  ensureBool(req.rv_dilation, 'rv');
  ensureEnum(req.closure, 'cl', ['observation','transcatheter_occluder_planned','surgical_repair_planned','contraindicated']);
  return { type: req.type, closure: req.closure };
}
function ventricular_septal_defect(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['perimembranous','muscular','inlet','outlet','supracristal']);
  ensureNum(req.size_mm, 'sz');
  ensureNum(req.qp_qs_ratio, 'qp');
  ensureEnum(req.closure, 'cl', ['observation','transcatheter_occluder','surgical_repair','contraindicated','spontaneous_closure']);
  return { type: req.type, closure: req.closure };
}
function patent_ductus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.size_mm, 'sz');
  ensureEnum(req.type, 'typ', ['silent','small','moderate','large']);
  ensureEnum(req.closure, 'cl', ['observation','transcatheter_occluder_successful','surgical_ligation_planned','medical_indomethacin_ibuprofen']);
  ensureStr(req.complications, 'comp');
  return { type: req.type, closure: req.closure };
}
function coarctation_aorta(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.gradient_mmhg, 'gr');
  ensureEnum(req.location, 'loc', ['juxtaductal','preductal','postductal','abdominal']);
  ensureStr(req.treatment, 'tx');
  ensureStr(req.complications, 'comp');
  ensureNum(req.follow_up_imaging, 'fu');
  return { location: req.location };
}
function tetralogy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.age_at_repair, 'ar');
  ensureStr(req.surgical_repair, 'sr');
  ensureEnum(req.current_pvr, 'pvr', ['none','mild','moderate','severe']);
  ensureStr(req.follow_up, 'fu');
  ensureStr(req.residual_lesions, 'rl');
  return { current_pvr: req.current_pvr };
}

function funcs() { return { atrial_septal_defect, ventricular_septal_defect, patent_ductus, coarctation_aorta, tetralogy }; }
module.exports = { funcs, ValidationError };