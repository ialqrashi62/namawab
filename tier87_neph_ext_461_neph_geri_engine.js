// filepath: tier87_neph_ext_461_neph_geri_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function geri_neph(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureEnum(req.functional_status, 'fs', ['robust','pre_frail','frail','severely_frail','unknown','other']);
  ensureStr(req.comorbidities, 'cm');
  ensureEnum(req.gdmt_recommendations, 'gdmt', ['age_appropriate','life_expectancy_relevant','decline_dialysis','supportive_care','combination','other']);
  ensureNum(req.polypharmacy_count, 'ppc');
  ensureBool(req.decision_shared, 'ds');
  ensureStr(req.priorities, 'pr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function elderly_ckd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.proteinuria, 'prot');
  ensureEnum(req.frailty_score, 'fs', ['robust','pre_frail','frail','severely_frail','unknown','other']);
  ensureEnum(req.cognitive_status, 'cs', ['normal','mild_impairment','mci','moderate_dementia','severe_dementia','unknown']);
  ensureNum(req.polypharmacy_count, 'ppc');
  ensureEnum(req.dietary_changes, 'dc', ['none','mild','moderate','strict','pd','special_needs','other','unknown']);
  ensureEnum(req.prognosis, 'prog', ['good','guarded','poor','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function gentiurian_dialysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureEnum(req.dialysis_modality, 'dm', ['hd','pd','palliative','none','unknown']);
  ensureNum(req.frequency, 'fq');
  ensureNum(req.session_hours, 'sh');
  ensureStr(req.symptoms, 'sy');
  ensureEnum(req.target_dry_weight, 'tdw', ['individualized','standard','flexible','unknown','other']);
  ensureNum(req.quality_of_life_score, 'qol');
  ensureBool(req.advance_directive, 'ad');
  ensureStr(req.life_expectancy_estimate, 'lee');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function nephro_epidemic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.study_design, 'sd', ['rct','cohort','case_control','cross_sectional','retrospective_cohort','meta_analysis','other']);
  ensureNum(req.sample_size, 'ss');
  ensureStr(req.prevalence, 'prev');
  ensureStr(req.incidence, 'inc');
  ensureStr(req.cfr, 'cfr');
  ensureStr(req.risk_factors, 'rf');
  ensureStr(req.biomarkers, 'bm');
  ensureStr(req.population, 'pop');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function nephro_global(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.region, 'reg', ['low_middle_income','high_income','sub_saharan','south_asia','latin_america','europe','north_america','other','unknown']);
  ensureEnum(req.kidney_disease_burden, 'kdb', ['low','moderate','high','very_high','unknown']);
  ensureNum(req.access_to_dialysis, 'ad');
  ensureStr(req.pollution_exposure, 'pe');
  ensureEnum(req.primary_etiology, 'pe2', ['infection_dka','htn','diabetes','pkd','inherited','glomerulonephritis','other','unknown']);
  ensureStr(req.awareness_score, 'asc');
  ensureEnum(req.research_priority, 'rp', ['diabetes_htn','ckd_awareness','kidney_replacement','transplantation','other','combination']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { geri_neph, elderly_ckd, gentiurian_dialysis, nephro_epidemic, nephro_global }; }
module.exports = { funcs, ValidationError };