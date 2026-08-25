// filepath: tier79_ophth_ext_420_ophth_cataract_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cataract_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.laterality, 'lat', ['right','left','bilateral','unknown']);
  ensureNum(req.va_pre, 'vap');
  ensureEnum(req.nuclear_grade, 'ng', ['i','ii','iii','iv','v','unknown']);
  ensureEnum(req.cortical_grade, 'cg', ['trace','mild','moderate','severe','unknown']);
  ensureEnum(req.psc_grade, 'psc', ['none','mild','moderate','severe','unknown']);
  ensureBool(req.glc_symptoms, 'glu');
  ensureBool(req.glc_visible, 'glv');
  ensureNum(req.corneal_endothelium, 'ce');
  ensureStr(req.treatment, 'tx');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function cataract_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.laterality, 'lat', ['right','left','unknown']);
  ensureEnum(req.lens_model, 'lm', ['monofocal','toric','multifocal','edof','restor','tecnis','alcon','bauch_lomb','other']);
  ensureNum(req.lens_power, 'lp');
  ensureEnum(req.anesthesia, 'an', ['topical','topical_intracameral','retrobulbar','peribulbar','general','other']);
  ensureNum(req.operative_time_min, 'otm');
  ensureEnum(req.complications, 'comp', ['none','posterior_capsule_rupture','vitreous_loss','zonular_dialysis','suprachoroidal_hemorrhage','endophthalmitis','other']);
  ensureNum(req.va_day_one, 'vao');
  ensureNum(req.hospital_stay_hours, 'hsh');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}
function pre_op_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.biometry_done, 'bd');
  ensureNum(req.al, 'al');
  ensureNum(req.keratometry_k1, 'k1');
  ensureNum(req.keratometry_k2, 'k2');
  ensureNum(req.ac_depth, 'acd');
  ensureNum(req.lens_thickness, 'lt');
  ensureNum(req.wtw, 'wtw');
  ensureEnum(req.iol_formula, 'iol', ['srkt','haigis','barrett','hollaDay','hills','other']);
  ensureBool(req.corneal_pathology, 'cp');
  ensureEnum(req.laterality, 'lat', ['right','left','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function post_op_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.laterality, 'lat', ['right','left','unknown']);
  ensureNum(req.va_current, 'vac');
  ensureNum(req.va_target, 'vat');
  ensureNum(req.iop, 'iop');
  ensureBool(req.anterior_chester_reaction, 'acr');
  ensureEnum(req.cme_status, 'cme', ['none','mild','moderate','severe','treated','unknown','other']);
  ensureBool(req.drops_compliance, 'dc');
  ensureStr(req.cystoid_status, 'css');
  ensureStr(req.complications, 'comp_str');
  ensureNum(req.postop_day, 'pod');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function yag_capsulotomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.laterality, 'lat', ['right','left','unknown']);
  ensureNum(req.va_pre, 'vap');
  ensureNum(req.va_post, 'vag');
  ensureNum(req.laser_energy_mj, 'le');
  ensureNum(req.complications_count, 'complications_count');
  ensureEnum(req.complication_type, 'ct', ['none','iot','retinal_detach','cystoid','other','unknown']);
  ensureNum(req.yag_opening_size, 'yos');
  ensureBool(req.iop_spike, 'is');
  ensureNum(req.iop_post, 'ip');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}

function funcs() { return { cataract_eval, cataract_surgery, pre_op_assessment, post_op_care, yag_capsulotomy }; }
module.exports = { funcs, ValidationError };