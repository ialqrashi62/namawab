// filepath: tier87_neph_ext_460_neph_nephrology_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hypertension_renal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.bp_systolic, 'bps');
  ensureNum(req.bp_diastolic, 'bpd');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.renin, 'ren');
  ensureNum(req.aldosterone, 'aldo');
  ensureBool(req.secondary_cause_evaluated, 'sce');
  ensureNum(req.renin_target, 'rt');
  ensureStr(req.current_meds, 'cm');
  ensureEnum(req.secondary_htn_ruleout, 'shro', ['yes','no','partial','pending','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function proteinuria_hematuria(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.proteinuria_g_day, 'pgd');
  ensureNum(req.urine_acr, 'acr');
  ensureBool(req.hematuria_present, 'hp');
  ensureBool(req.rbc_casts_present, 'rcp');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.egfr, 'egfr');
  ensureEnum(req.blood_dipstick, 'bd', ['neg','trace','1plus','2plus','3plus','unknown','other']);
  ensureEnum(req.protein_dipstick, 'pd', ['neg','trace','1plus','2plus','3plus','4plus','unknown','other']);
  ensureNum(req.proteinuria_creatinine_ratio, 'pcr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function renal_stones(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.type_of_stone, 'tos', ['calcium_oxalate','calcium_phosphate','uric_acid','struvite','cystine','mixed','unknown','other']);
  ensureBool(req.recurrent_stones, 'rs');
  ensureNum(req.fluid_intake_l, 'fil');
  ensureStr(req.family_history, 'fh');
  ensureStr(req.stone_type_2, 'st2');
  ensureNum(req.stones_per_year, 'spy');
  ensureNum(req.passed_count, 'pc');
  ensureEnum(req.imaging, 'img', ['none','xray','ct','us','mri','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function renal_cyst(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.cyst_classification, 'cc', ['bosniak_1','bosniak_2','bosniak_2f','bosniak_3','bosniak_4','simple','complex','unknown']);
  ensureEnum(req.complexity, 'cx', ['simple','complex','hemorrhagic','calcified','septated','multilocular','unknown']);
  ensureNum(req.size_mm, 'sz');
  ensureEnum(req.follow_up, 'fu', ['no_followup','annual','biannual','shorter','surgery_planned','other']);
  ensureBool(req.asymmetry, 'asy');
  ensureBool(req.intervention_needed, 'in');
  ensureEnum(req.risk_strat, 'rs', ['low','moderate','high','very_high','unknown']);
  ensureEnum(req.recommendation, 'rec', ['observe','follow_up','biopsy','surgery','referral','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function proteinuric_disease(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.proteinuria_g_day, 'pgd');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.serum_albumin, 'salm');
  ensureEnum(req.edema_severity, 'es', ['none','mild','moderate','severe','anasarca','unknown']);
  ensureBool(req.statin_start, 'ss');
  ensureBool(req.acei_started, 'acs');
  ensureBool(req.diuretic, 'di');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { hypertension_renal, proteinuria_hematuria, renal_stones, renal_cyst, proteinuric_disease }; }
module.exports = { funcs, ValidationError };