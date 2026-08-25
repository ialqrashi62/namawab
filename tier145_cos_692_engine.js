// filepath: tier145_cos_692_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function consultation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['rhinoplasty','blepharoplasty','facelift','liposuction','abdominoplasty','breast_augmentation','breast_reduction','breast_lift','hair_transplant','botox','filler','laser_resurfacing','chemical_peel','BBL','mommy_makeover','genital_aesthetic','bariatric','post_bariatric','body_contour','other']);
  ensureStr(req.goals, 'go');
  ensureBool(req.psych_eval, 'pe');
  ensureBool(req.medical_clearance, 'mc');
  ensureNum(req.bmi, 'bm');
  ensureNum(req.smoker, 'sm');
  ensureStr(req.provider, 'pr');
  return { co_id: `cns_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure, cleared: req.medical_clearance };
}
function surgery(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.consultation_id, 'ci');
  ensureEnum(req.anesthesia, 'an', ['local','sedation','general','regional','tumescent','combined','MAC']);
  ensureNum(req.duration_hr, 'du');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.asa, 'as');
  ensureEnum(req.complication, 'cp', ['none','bleeding','hematoma','seroma','infection','dehiscence','DVT','PE','nerve_injury','VTE','capsular_contracture','skin_loss','tissue_loss','other']);
  ensureNum(req.los_hours, 'lo');
  ensureStr(req.surgeon, 'sg');
  return { sy_id: `syr_${Date.now()}`, patient_id: req.patient_id, asa: req.asa, complication: req.complication };
}
function injectable(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.product, 'pd', ['botox','dysport','xeomin','juvederm','restylane','radiesse','sculptra','belotero','voluma','volite','kysse','other']);
  ensureEnum(req.area, 'ar', ['glabellar','forehead','crows_feet','brow','nose','lips','cheeks','chin','jaw','neck','chest','hands','under_eye','tear_trough','arms','abdomen','thigh','buttocks','other']);
  ensureNum(req.units, 'un');
  ensureNum(req.volume_ml, 'vl');
  ensureNum(req.duration_min, 'du');
  ensureNum(req.effect_months, 'em');
  ensureStr(req.provider, 'pr');
  return { ij_id: `inj_${Date.now()}`, patient_id: req.patient_id, product: req.product, area: req.area };
}
function las_skin(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.laser_type, 'lt', ['CO2','Er:YAG','Nd:YAG','Alexandrite','Diode','IPL','PDL','Fractional_non_ablative','Fractional_ablative','other']);
  ensureStr(req.indication, 'in');
  ensureEnum(req.fitzpatrick, 'fi', ['1','2','3','4','5','6','unknown']);
  ensureNum(req.fluence_j_cm2, 'fl');
  ensureNum(req.pulse_ms, 'pl');
  ensureNum(req.duration_min, 'du');
  ensureNum(req.session_number, 'sn');
  ensureStr(req.provider, 'pr');
  return { ls_id: `lsr_${Date.now()}`, patient_id: req.patient_id, laser_type: req.laser_type, ind: req.indication };
}
function complications(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.original_procedure, 'op');
  ensureNum(req.days_post, 'dp');
  ensureEnum(req.complication, 'cp', ['none','bleeding','hematoma','seroma','infection','dehiscence','skin_loss','DVT','PE','nerve_injury','capsular_contracture','asymmetry','hypoesthesia','rash','hyperesthesia','embolism','vascular_compromise','vision_loss','other']);
  ensureEnum(req.clavien_dindo, 'cd', ['1','2','3a','3b','4a','4b','5']);
  ensureStr(req.management, 'mg');
  ensureBool(req.resolved, 'rs');
  ensureStr(req.provider, 'pr');
  return { cm_id: `cmp_${Date.now()}`, patient_id: req.patient_id, complication: req.complication, clavien: req.clavien_dindo };
}

function funcs() { return { consultation, surgery, injectable, las_skin, complications }; }
module.exports = { funcs, ValidationError };
