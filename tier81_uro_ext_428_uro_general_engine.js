// filepath: tier81_uro_ext_428_uro_general_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function uro_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.complaint, 'c', ['hematuria','dysuria','frequency','urgency','incontinence','retention','flank_pain','scrotal_pain','erectile_dysfunction','other']);
  ensureNum(req.duration_months, 'dur');
  ensureStr(req.exam_findings, 'ef');
  ensureBool(req.smoking_history, 'sh');
  ensureStr(req.occupation, 'occ');
  ensureStr(req.medications, 'meds');
  ensureStr(req.impression, 'imp');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function hematuria_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.hematuria_type, 'ht', ['gross','microscopic','unknown','other']);
  ensureBool(req.painless, 'pn');
  ensureBool(req.clot_passage, 'cp');
  ensureBool(req.smoking_history, 'sh');
  ensureNum(req.number_evaluation, 'ne');
  ensureBool(req.urinalysis, 'ua');
  ensureBool(req.ct_urogram, 'ctu');
  ensureBool(req.cystoscopy, 'cy');
  ensureStr(req.findings, 'find');
  ensureStr(req.diagnosis, 'dx');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function incontinence(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.type, 't', ['stress','urge','mixed','overflow','functional','total','other','unknown']);
  ensureNum(req.episodes_per_week, 'epw');
  ensureStr(req.pad_count, 'pc');
  ensureStr(req.fluid_intake, 'fi');
  ensureBool(req.pelvic_floor_therapy, 'pft');
  ensureBool(req.medications_started, 'ms');
  ensureStr(req.medication_name, 'mn');
  ensureBool(req.surgical_consult, 'sc');
  ensureStr(req.treatment, 'tx');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function urodynamics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.capacity, 'cap');
  ensureNum(req.compliance, 'comp');
  ensureNum(req.max_flow_rate, 'mfr');
  ensureNum(req.residual_volume, 'rv');
  ensureBool(req.detrusor_overactivity, 'do');
  ensureBool(req.stress_incontinence, 'si');
  ensureStr(req.impression, 'imp');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.study_id };
}
function prostate_benign(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.psa, 'psa');
  ensureNum(req.prostate_volume, 'pv');
  ensureNum(req.ipss_score, 'ips');
  ensureNum(req.qmax, 'qmx');
  ensureNum(req.residual_volume, 'rv');
  ensureEnum(req.medication, 'med', ['alfuzosin','tamsulosin','silodosin','finasteride','dutasteride','tadalafil','combination','none','other','unknown']);
  ensureBool(req.surgical_consult, 'sc');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { uro_clinic, hematuria_workup, incontinence, urodynamics, prostate_benign }; }
module.exports = { funcs, ValidationError };