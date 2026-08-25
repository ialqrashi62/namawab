// filepath: tier74_onc_ext_395_onc_ext_special_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tumor_board_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.review_date, 'rd');
  ensureStr(req.presenters, 'pre');
  ensureStr(req.attendees, 'att');
  ensureBool(req.presentation_complete, 'pcomp');
  ensureStr(req.recommendation, 'rec');
  ensureBool(req.multidisciplinary_consensus, 'mc');
  ensureStr(req.follow_up_plan, 'fup');
  ensureBool(req.clinical_trial_considered, 'ctc');
  ensureStr(req.additional_imaging_needed, 'ain');
  ensureStr(req.stage_per_tnm, 'spt');
  return { case_id: req.case_id };
}
function genetic_counseling_onc(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.family_history_criteria, 'fhc');
  ensureStr(req.genes_tested, 'gt');
  ensureStr(req.test_result, 'tres');
  ensureBool(req.counseling_completed, 'cc');
  ensureStr(req.risk_recommendations, 'rrec');
  ensureBool(req.family_member_testing_offered, 'fmto');
  ensureBool(req.prevention_options_discussed, 'pod');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  ensureBool(req.psychosocial_impact_assessed, 'pia');
  return { result: req.test_result };
}
function cancer_staging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cancer_type, 'ct');
  ensureStr(req.tnm, 'tnm');
  ensureStr(req.stage_group, 'sg');
  ensureStr(req.staging_method, 'sm');
  ensureBool(req.pathology_reviewed, 'pr');
  ensureStr(req.molecular_markers_tested, 'mmt');
  ensureStr(req.biomarker_summary, 'bs');
  ensureEnum(req.stage_clinical_vs_pathological, 'scvp', ['clinical','pathological','combined','post_neoadjuvant','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureStr(req.staging_date, 'sd');
  ensureBool(req.multidisciplinary_reviewed, 'mr');
  return { stage: req.stage_group };
}
function performance_status(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.karnofsky_score, 'ks');
  ensureNum(req.ecog_score, 'es');
  ensureNum(req.pain_assessment_score, 'pas');
  ensureNum(req.weight_change_kg, 'wcg');
  ensureEnum(req.nutrition_status, 'ns', ['adequate','mild_malnutrition','moderate_malnutrition','severe_malnutrition','unknown','other']);
  ensureEnum(req.functional_limitations, 'fl', ['none','mild','moderate','severe','completely_disabled','unknown','other']);
  ensureEnum(req.ambulatory_status, 'as', ['independent','with_assist','wheelchair','bed_bound','walker','cane','other','ambulatory_with_crutches','unknown']);
  ensureBool(req.activities_of_daily_living_intact, 'adli');
  ensureStr(req.provider, 'pr');
  ensureBool(req.fit_for_chemo, 'ffc');
  ensureNum(req.next_review, 'nr');
  return { ks: req.karnofsky_score };
}
function clinical_trial_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trial_id, 'tid');
  ensureEnum(req.trial_phase, 'tp', ['phase_1','phase_2','phase_3','phase_4','phase_1_2','phase_2_3','registry','observational','other']);
  ensureStr(req.cancer_type, 'ct');
  ensureBool(req.eligibility_complete, 'ec');
  ensureStr(req.biomarker_required, 'br');
  ensureStr(req.biomarker_status, 'bs');
  ensureBool(req.consent_discussed, 'cd');
  ensureBool(req.study_visit_burden_assessed, 'svba');
  ensureStr(req.geographic_considerations, 'gc');
  ensureStr(req.provider, 'pr');
  ensureStr(req.next_step, 'ns');
  return { trial: req.trial_id };
}

function funcs() { return { tumor_board_review, genetic_counseling_onc, cancer_staging, performance_status, clinical_trial_screening }; }
module.exports = { funcs, ValidationError };