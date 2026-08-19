// filepath: tier76_endo_ext_407_endo_special_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function bone_metabolic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.vitamin_d_25, 'vd25');
  ensureNum(req.pth, 'pth');
  ensureNum(req.calcium, 'ca');
  ensureNum(req.phosphorus, 'ph');
  ensureEnum(req.renal_function, 'rf', ['normal','mild_impairment','moderate_impairment','severe_impairment','esrd','dialysis','crrt','unknown','other']);
  ensureStr(req.medications, 'med');
  ensureStr(req.risk_factors, 'rf2');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function osteoporosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.dexa_t_score, 'dts');
  ensureStr(req.fracture_history, 'fh');
  ensureStr(req.treatment, 'tx');
  ensureNum(req.frax_score_10y, 'fs10');
  ensureStr(req.recommendation, 'rec');
  ensureEnum(req.refracture_risk, 'rr', ['low','moderate','high','very_high','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function calcium_disorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.calcium_total, 'ct');
  ensureNum(req.pth, 'pth');
  ensureNum(req.vitamin_d_25, 'vd25');
  ensureNum(req['24h_urine_calcium'], '24uc');
  ensureBool(req.primary_hyperparathyroidism_evaluation, 'phpe');
  ensureBool(req.sesta_mibi_planned, 'smp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function lipid_specialist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ldl, 'ldl');
  ensureNum(req.hdl, 'hdl');
  ensureNum(req.triglycerides, 'tg');
  ensureNum(req.lp_a, 'lpa');
  ensureNum(req.apob, 'apob');
  ensureStr(req.lipid_disorders_thought, 'ldt');
  ensureBool(req.genetic_test_ordered, 'gto');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function pc_os(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.rotterdam_criteria_met, 'rcm');
  ensureBool(req.hyperandrogenism, 'ha');
  ensureBool(req.oligo_amenorrhea, 'oa');
  ensureBool(req.polycystic_ovaries_us, 'pco');
  ensureEnum(req.insulin_resistance, 'ir', ['present','absent','unknown','borderline','other']);
  ensureBool(req.metformin_started, 'ms');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { bone_metabolic, osteoporosis, calcium_disorder, lipid_specialist, pc_os }; }
module.exports = { funcs, ValidationError };