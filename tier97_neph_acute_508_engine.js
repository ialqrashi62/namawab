// filepath: tier97_neph_acute_508_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function aki_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.baseline_creatinine, 'bcr');
  ensureNum(req.bun, 'bun');
  ensureEnum(req.aki_stage, 'as', ['1','2','3','unknown','other','none']);
  ensureEnum(req.aki_type, 'at', ['pre_renal','intrinsic','post_renal','unknown','other','none']);
  ensureNum(req.urine_output_ml_hr, 'uoh');
  ensureNum(req.fena, 'fena');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function dialysis_initiation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.modality, 'mod', ['hemodialysis','peritoneal','crrt','slow_low_efficiency','other','unknown']);
  ensureNum(req.access_type, 'at');
  ensureNum(req.frequency_per_week, 'fpw');
  ensureNum(req.duration_hours, 'dur');
  ensureNum(req.uf_goal_ml, 'ufg');
  ensureNum(req.dry_weight_kg, 'dw');
  ensureNum(req.kt_v, 'ktv');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function ckd_staging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.urine_albumin, 'ua');
  ensureNum(req.creatinine, 'cr');
  ensureEnum(req.ckd_stage, 'cs', ['1','2','3a','3b','4','5','unknown','other','none']);
  ensureEnum(req.albuminuria_category, 'ac', ['a1','a2','a3','unknown','other']);
  ensureNum(req.progression_rate, 'pr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function electrolyte_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.sodium, 'na');
  ensureNum(req.potassium, 'k');
  ensureNum(req.chloride, 'cl');
  ensureNum(req.bicarbonate, 'hco3');
  ensureNum(req.magnesium, 'mg');
  ensureNum(req.calcium, 'ca');
  ensureNum(req.phosphate, 'ph');
  ensureBool(req.dialysis_required, 'dr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function acid_base(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ph, 'ph');
  ensureNum(req.pco2, 'pco2');
  ensureNum(req.bicarbonate, 'hco3');
  ensureNum(req.anion_gap, 'ag');
  ensureNum(req.lactate, 'lac');
  ensureNum(req.base_excess, 'be');
  ensureEnum(req.primary_disorder, 'pd', ['respiratory_acidosis','respiratory_alkalosis','metabolic_acidosis','metabolic_alkalosis','mixed','normal','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { aki_diagnosis, dialysis_initiation, ckd_staging, electrolyte_management, acid_base }; }
module.exports = { funcs, ValidationError };

