// filepath: tier97_neph_vascular_510_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function renovascular(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.blood_pressure, 'bp');
  ensureNum(req.kidney_size_asymmetry, 'ksa');
  ensureEnum(req.imaging, 'img', ['duplex','cta','mra','angiography','other','unknown']);
  ensureNum(req.renal_artery_stenosis, 'ras');
  ensureEnum(req.side, 'sd', ['unilateral','bilateral','left','right','unknown','other']);
  ensureEnum(req.treatment, 'tx', ['monitoring','revascularization','medical','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function htn_renal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.blood_pressure_sys, 'bps');
  ensureNum(req.blood_pressure_dia, 'bpd');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.albuminuria, 'au');
  ensureNum(req.aldosterone, 'a');
  ensureNum(req.renin, 'r');
  ensureNum(req.aldosterone_renin_ratio, 'arr');
  ensureEnum(req.treatment, 'tx', ['ace_inhibitor','arb','ccb','thiazide','combination','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cardiorenal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ef, 'ef');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.bnp, 'bnp');
  ensureNum(req.urine_output, 'uo');
  ensureNum(req.diuretic_dose, 'dd');
  ensureEnum(req.club_stage, 'cs', ['warm_dry','warm_wet','cold_dry','cold_wet','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function hepatorenal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.bilirubin, 'bil');
  ensureNum(req.inr, 'inr');
  ensureNum(req.urine_sodium, 'usn');
  ensureNum(req.fena, 'fena');
  ensureBool(req.ascites, 'asc');
  ensureNum(req.meld_score, 'meld');
  ensureEnum(req.diagnosis, 'dx', ['type_1_hrs','type_2_hrs','atn_overlap','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function obstructive_uropathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.side, 'sd', ['unilateral','bilateral','left','right','unknown','other']);
  ensureNum(req.hydronephrosis_grade, 'hg');
  ensureEnum(req.cause, 'cau', ['stone','tumor','stricture','bph','neurogenic','congenital','other','unknown','none']);
  ensureNum(req.post_void_residual, 'pvr');
  ensureNum(req.creatinine, 'cr');
  ensureStr(req.relief_method, 'rm');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { renovascular, htn_renal, cardiorenal, hepatorenal, obstructive_uropathy }; }
module.exports = { funcs, ValidationError };

