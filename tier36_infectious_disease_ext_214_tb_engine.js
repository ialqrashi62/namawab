// filepath: tier36_infectious_disease_ext_214_tb_engine.js
// TIER36_INFX-214: Tuberculosis
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function tb_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.symptoms, 'sym', ['none','chronic_cough','fever','weight_loss','night_sweats','chronic_cough_fever','multiple','other']);
  ensureEnum(req.sputum_afb, 'afb', ['positive','negative','scanty','pending','not_done','other']);
  ensureEnum(req.genexpert, 'gx', ['mtb_detected_rif_sensitive','mtb_detected_rif_resistant','mtb_not_detected','invalid','pending','not_done','other']);
  ensureBool(req.cxr_cavitary, 'cav');
  ensureBool(req.hiv_positive, 'hiv');
  let status;
  if (req.genexpert === 'mtb_detected_rif_resistant') status = 'tb_diagnosed_drr_tb_review_regimen';
  else if (req.genexpert === 'mtb_detected_rif_sensitive' && req.sputum_afb === 'positive') status = 'active_tb_confirmed_initiate_rhze';
  else if (req.genexpert === 'mtb_not_detected' && req.cxr_cavitary && req.hiv_positive) status = 'cavitary_hiv_empiric_tb_treat';
  else if (req.genexpert === 'mtb_not_detected' && req.symptoms !== 'none') status = 'tb_likely_but_unconfirmed_empiric_review';
  else status = 'tb_diagnosis_review';
  return { status, gx: req.genexpert };
}

function active_tb_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.regimen, 'reg', ['hrze','hrze_others','mdr_regimen','xdrt_regimen','other']);
  ensureNumber(req.intensive_phase, 'int_phase');
  ensureNumber(req.continuation_phase, 'cont_phase');
  ensureEnum(req.adherence, 'adh', ['excellent','good','suboptimal','poor','dot','unknown']);
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','cured','completed','failed','unknown']);
  let status;
  if (req.adherence === 'poor') status = 'tb_poor_adherence_dot_intensive';
  else if (req.response === 'worsening') status = 'tb_worsening_drr_review';
  else if (req.response === 'failed') status = 'tb_treatment_failure_review_regimen';
  else if (req.response === 'improving' && req.regimen === 'hrze') status = 'tb_standard_treatment_improving';
  else status = 'tb_treatment_review';
  return { status, r: req.response };
}

function latent_tb(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.test, 'test', ['igra_positive','igra_negative','tst_positive','tst_negative','pending','inconclusive','other']);
  ensureBool(req.cxr_normal, 'cxr');
  ensureEnum(req.symptoms, 'sym', ['none','cough','fever','weight_loss','other']);
  ensureEnum(req.prophylaxis, 'pro', ['isoniazid_6_month','isoniazid_9_month','rifampin_4_month','rifapentine_isoniazid_3_month','none','other']);
  ensureBool(req.baseline_lft, 'lft');
  let status;
  if (!req.cxr_normal) status = 'cxr_abnormal_active_tb_exclude_first';
  else if (req.test.includes('positive') && req.symptoms !== 'none') status = 'symptoms_present_exclude_active_tb';
  else if (req.prophylaxis === 'none' && req.test.includes('positive')) status = 'latent_tb_initiate_prophylaxis';
  else if (req.prophylaxis !== 'none' && !req.baseline_lft) status = 'baseline_lft_required_before_prophylaxis';
  else status = 'ltbi_review';
  return { status, t: req.test };
}

function drug_resistant_tb(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.resistance_pattern, 'pat', ['rr_tb','mdr','pre_xdr','xdr','other']);
  ensureEnum(req.genexpert, 'gx', ['mtb_detected_rif_resistant','mtb_detected_rif_sensitive','mtb_not_detected','invalid','other']);
  ensureEnum(req.hain_test, 'hain', ['inh_resistant','fluoroquinolone_resistant','injectable_resistant','all_sensitive','pending','other','not_done']);
  ensureEnum(req.regimen, 'reg', ['bedaquiline_linezolid','bedaquiline_pretomanid_linezolid','individualized','other']);
  ensureNumber(req.treatment_duration_months, 'dur');
  let status;
  if (req.resistance_pattern === 'xdr' && req.regimen !== 'individualized') status = 'xdr_tb_requires_individualized_regimen';
  else if (req.regimen.includes('bedaquiline') && req.treatment_duration_months >= 18) status = 'dr_tb_bedaquiline_regimen_complete';
  else if (req.hain_test === 'fluoroquinolone_resistant' && req.resistance_pattern === 'mdr') status = 'pre_xdr_tb_review_regimen';
  else status = 'dr_tb_review_appropriate';
  return { status, p: req.resistance_pattern };
}

function tb_contact_tracing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.index_case, 'idx', ['pulmonary','extra_pulmonary','smear_positive','smear_negative','culture_positive','other']);
  ensureEnum(req.contact_type, 'type', ['household','workplace','school','healthcare','community','multiple','other']);
  ensureNumber(req.contact_count, 'cnt');
  ensureBool(req.screening_done, 'scr');
  ensureNumber(req.latent_tb_identified, 'ltbi');
  let status;
  if (req.contact_count >= 10 && !req.screening_done) status = 'high_contact_count_priority_screening';
  else if (req.latent_tb_identified >= 3) status = 'high_ltbi_yield_expand_investigation';
  else if (req.screening_done && req.index_case === 'pulmonary' && req.contact_type === 'household') status = 'household_screening_complete';
  else status = 'contact_tracing_review';
  return { status, idx: req.index_case };
}

function funcs() { return { tb_diagnosis, active_tb_treatment, latent_tb, drug_resistant_tb, tb_contact_tracing }; }
module.exports = { funcs, ValidationError };