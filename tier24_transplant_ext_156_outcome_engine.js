// filepath: tier24_transplant_ext_156_outcome_engine.js
// TIER24_TRANSPLANT-156: Post-transplant outcomes, graft survival, complications
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function graft_function(req) {
  ensureStr(req.recipient_id, 'recipient_id');
  ensureEnum(req.organ, 'organ', ['kidney','liver','heart','lung','pancreas','intestinal','multivisceral','heart_lung','kidney_pancreas','other']);
  ensureNumber(req.days_post_tx, 'days_post_tx');
  ensureNumber(req.creatinine_post_tx, 'cr');
  ensureNumber(req.egfr_post_tx, 'egfr');
  ensureBool(req.dialysis_needed_post_tx, 'dialysis');
  ensureBool(req.primary_nonfunction, 'pgnf');
  let status;
  if (req.primary_nonfunction) status = 'primary_nonfunction_relist';
  else if (req.dialysis_needed_post_tx && req.days_post_tx > 30) status = 'dgf_prolonged_biopsy';
  else if (req.dialysis_needed_post_tx && req.days_post_tx <= 30) status = 'dgf_expected_resolve';
  else if (req.egfr_post_tx < 30 && req.days_post_tx > 90) status = 'low_egfr_chronic_review';
  else status = 'graft_functioning';
  return { status, organ: req.organ };
}

function infection_post(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.organ, 'organ', ['kidney','liver','heart','lung','pancreas','intestinal','multivisceral','heart_lung','kidney_pancreas','other']);
  ensureNumber(req.days_post_tx, 'days_post_tx');
  ensureEnum(req.infection_type, 'infection_type', ['bacterial','viral_cmv','viral_bk','viral_ebv','viral_others','fungal','pjp','mycobacterial','other']);
  ensureNumber(req.wbc, 'wbc');
  ensureBool(req.hospitalized, 'hosp');
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','life_threatening','other']);
  let status;
  if (req.severity === 'life_threatening') status = 'life_threatening_icu_admit';
  else if (req.infection_type === 'pjp' && !req.hospitalized) status = 'pjp_dx_admit_iv';
  else if (req.infection_type === 'viral_cmv' && req.days_post_tx > 365) status = 'late_cmv_review_prophylaxis';
  else status = 'infection_managed';
  return { status, type: req.infection_type };
}

function malignancy_post(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.malignancy_type, 'malignancy_type', ['ptld','skin_scc','skin_bcc','skin_melanoma','kaposi','lung','breast','colon','prostate','cervical','renal_cell','lymphoma','leukemia','other']);
  ensureNumber(req.days_post_tx, 'days_post_tx');
  ensureBool(req.immunosuppression_reduced, 'im_red');
  ensureEnum(req.stage, 'stage', ['in_situ','local','regional','distant','unknown','other']);
  ensureBool(req.refer_oncology, 'oncology');
  let status;
  if (req.malignancy_type === 'ptld' && req.stage === 'distant') status = 'ptld_metastatic_reduce_immuno_rituximab';
  else if (req.malignancy_type === 'skin_scc' && !req.refer_oncology) status = 'scc_oncology_referral';
  else if (req.days_post_tx < 365) status = 'early_malignancy_urgent_review';
  else status = 'malignancy_managed';
  return { status, type: req.malignancy_type };
}

function cv_complication(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.event_type, 'event_type', ['mi','stroke','tia','pe','dvt','afib_new','heart_failure','cardiac_arrest','cardiovascular_death','other']);
  ensureNumber(req.days_post_tx, 'days_post_tx');
  ensureNumber(req.lvef, 'lvef');
  ensureBool(req.statins_given, 'statins');
  ensureBool(req.anticoagulated, 'anticoag');
  let status;
  if (req.event_type === 'cardiac_arrest' || req.event_type === 'cardiovascular_death') status = 'cardiac_arrest_acls_review';
  else if (req.event_type === 'afib_new' && !req.anticoagulated) status = 'new_afib_anticoag_review';
  else if (!req.statins_given && req.days_post_tx > 90) status = 'statin_recommended_tx_recipients';
  else status = 'cv_event_managed';
  return { status, event: req.event_type };
}

function renal_function(req) {
  ensureStr(req.recipient_id, 'recipient_id');
  ensureNumber(req.days_post_tx, 'days_post_tx');
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.proteinuria_g, 'protein');
  ensureNumber(req.bun, 'bun');
  ensureBool(req.biopsy_needed, 'biopsy');
  let status;
  if (req.egfr < 30) status = 'egfr_low_biopsy_review';
  else if (req.proteinuria_g > 1) status = 'significant_proteinuria_biopsy_review';
  else if (req.biopsy_needed && req.days_post_tx > 90) status = 'rapid_egfr_drop_urgent_review';
  else status = 'renal_function_stable';
  return { status, egfr: req.egfr };
}

const CITATIONS = { OPTN_OUTCOMES_2024: 'OPTN Outcomes 2024', AST_OUTCOMES_2024: 'AST Outcomes 2024' };

function funcs() { return { graft_function, infection_post, malignancy_post, cv_complication, renal_function }; }
module.exports = { funcs, CITATIONS, ValidationError };