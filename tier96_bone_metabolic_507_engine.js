// filepath: tier96_bone_metabolic_507_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function osteoporosis_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.frax_score, 'frs');
  ensureNum(req.t_score_lumbar, 'tsl');
  ensureNum(req.t_score_hip, 'tsh');
  ensureNum(req.t_score_femoral_neck, 'tsfn');
  ensureBool(req.prior_fracture, 'pf');
  ensureNum(req.vitamin_d, 'vitd');
  ensureEnum(req.risk_category, 'rc', ['low','moderate','high','very_high','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function osteoporosis_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureEnum(req.bisphosphonate, 'bp', ['alendronate','risedronate','ibandronate','zoledronate','none','other','unknown']);
  ensureNum(req.duration_months, 'dur');
  ensureEnum(req.denosumab, 'den', ['on','off','pending','other','unknown','none']);
  ensureEnum(req.teriparatide, 'tpa', ['on','off','pending','other','unknown','none']);
  ensureNum(req.bmd_change, 'bmc');
  ensureNum(req.fracture_reduction, 'fr');
  ensureBool(req.atypical_fracture, 'af');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function hyperparathyroidism(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.calcium, 'ca');
  ensureNum(req.ionized_calcium, 'ica');
  ensureNum(req.pth, 'pth');
  ensureNum(req.vitamin_d, 'vitd');
  ensureNum(req.urine_calcium, 'uca');
  ensureNum(req.kidney_stones, 'ks');
  ensureNum(req.bone_disease, 'bd');
  ensureEnum(req.treatment, 'tx', ['surgery','medical','monitoring','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function pagets(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.alkaline_phosphatase, 'alp');
  ensureStr(req.bones_involved, 'bi');
  ensureNum(req.skeletal_burden, 'sb');
  ensureBool(req.pain, 'pain');
  ensureBool(req.fracture, 'fx');
  ensureNum(req.bisphosphonate_response, 'br');
  ensureNum(req.zoledronic_acid, 'za');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function vitamin_d(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.vitamin_d_25, 'vitd25');
  ensureNum(req.vitamin_d_1_25, 'vitd125');
  ensureNum(req.parathyroid_hormone, 'pth');
  ensureNum(req.calcium, 'ca');
  ensureNum(req.phosphate, 'ph');
  ensureEnum(req.severity, 'sev', ['sufficiency','insufficiency','deficiency','severe_deficiency','toxicity','other','unknown']);
  ensureNum(req.replacement_iu, 'rep');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { osteoporosis_screening, osteoporosis_treatment, hyperparathyroidism, pagets, vitamin_d }; }
module.exports = { funcs, ValidationError };
