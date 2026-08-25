// filepath: tier26_oncology_ext_163_tumor_engine.js
// TIER26_ONCOLOGY-163: Tumor board, staging (TNM, AJCC), MDT
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function tnm_stage(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.t, 't', ['tx','t0','t1','t1a','t1b','t1c','t2','t2a','t2b','t3','t3a','t3b','t4','t4a','t4b','tis','other']);
  ensureEnum(req.n, 'n', ['nx','n0','n1','n1a','n1b','n1c','n2','n2a','n2b','n3','n3a','n3b','n3c','other']);
  ensureEnum(req.m, 'm', ['m0','m1','m1a','m1b','m1c','m1d','other']);
  ensureEnum(req.ajcc_stage, 'ajcc_stage', ['0','i','ia','ia1','ia2','ia3','ib','ib1','ib2','ic','ii','iia','iib','iic','iii','iiia','iiib','iiic','iva','ivb','ivc','occult','unknown','other']);
  ensureStr(req.primary_site, 'primary_site');
  ensureStr(req.histology, 'histology');
  let status;
  if (req.ajcc_stage === 'ivc' || req.m === 'm1d') status = 'metastatic_stage_iv_palliative_review';
  else if (req.ajcc_stage === '0' || req.ajcc_stage === 'i') status = 'early_stage_curative_treatment';
  else if (req.ajcc_stage === 'iii' || req.ajcc_stage === 'iiib') status = 'locally_advanced_multimodal_review';
  else status = 'stage_appropriate_refer_mdt';
  return { status, stage: req.ajcc_stage };
}

function tumor_board(req) {
  ensureStr(req.meeting_id, 'meeting_id');
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.presenter, 'presenter', ['surgical_oncology','medical_oncology','radiation_oncology','pathology','radiology','gp','resident','student','other']);
  ensureEnum(req.decision, 'decision', ['continue_workup','resect','chemo','radiation','chemoradiation','targeted_therapy','immunotherapy','palliative','surveillance','refer_higher_center','other']);
  ensureBool(req.consensus, 'consensus');
  ensureNumber(req.attendees, 'attendees');
  let status;
  if (req.attendees < 5) status = 'low_attendance_review_quorum';
  else if (!req.consensus) status = 'no_consensus_re_review_next_meeting';
  else status = 'tumor_board_decision_made';
  return { status, decision: req.decision };
}

function molecular(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.biomarker, 'biomarker', ['egfr','alk','ros1','braf','kras','nras','her2','brca1','brca2','pd_l1','msi_high','tmb_high','ntrk','fgfr','other']);
  ensureEnum(req.result, 'result', ['positive','negative','mutated','wild_type','amplified','low','intermediate','high','unknown','other']);
  ensureBool(req.actionable, 'actionable');
  ensureEnum(req.targeted_therapy, 'targeted_therapy', ['osimertinib','alectinib','crizotinib','dabrafenib_trametinib','trastuzumab','olaparib','pembrolizumab','larotrectinib','erdafitinib','none','other']);
  ensureBool(req.fish_confirmed, 'fish');
  let status;
  if (req.actionable && req.targeted_therapy === 'none') status = 'actionable_no_therapy_assigned';
  else if (req.biomarker === 'alk' && req.result === 'positive' && !req.fish_confirmed) status = 'alk_positive_fish_confirm_required';
  else if (req.biomarker === 'her2' && req.result === 'positive') status = 'her2_positive_trastuzumab_recommended';
  else status = 'molecular_reported';
  return { status, biomarker: req.biomarker };
}

function ecog(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.ecog_score, 'ecog_score', ['0','1','2','3','4','5','unknown','other']);
  ensureBool(req.comorbidities, 'comorbidities');
  ensureEnum(req.treatment_intent, 'treatment_intent', ['curative','palliative','surveillance','unknown','other']);
  ensureNumber(req.weight_loss_pct_6m, 'weight_loss');
  ensureBool(req.functional_decline, 'decline');
  let status;
  if (req.ecog_score === '3' && req.treatment_intent === 'curative') status = 'ecog_3_curative_review_capacity';
  else if (req.ecog_score === '4' || req.ecog_score === '5') status = 'ecog_4_or_5_best_supportive_care';
  else if (req.weight_loss_pct_6m > 10) status = 'cachexia_review_nutrition';
  else status = 'ecog_assessed';
  return { status, ecog: req.ecog_score };
}

function mdt_coordination(req) {
  ensureStr(req.case_id, 'case_id');
  ensureBool(req.path_reviewed, 'path');
  ensureBool(req.imaging_reviewed, 'imaging');
  ensureEnum(req.primary_specialty, 'primary_specialty', ['surgical','medical','radiation','palliative','gp','unknown','other']);
  ensureEnum(req.timeline, 'timeline', ['within_2_weeks','within_4_weeks','within_8_weeks','routine','expedited','other']);
  ensureBool(req.care_plan_documented, 'plan_doc');
  let status;
  if (!req.path_reviewed || !req.imaging_reviewed) status = 'workup_incomplete_review_pending';
  else if (!req.care_plan_documented) status = 'care_plan_documentation_required';
  else if (req.timeline === 'expedited' && !req.path_reviewed) status = 'expedited_review_pending_pathology';
  else status = 'mdt_coordination_appropriate';
  return { status, specialty: req.primary_specialty };
}

const CITATIONS = { AJCC_8TH_2024: 'AJCC 8th Edition 2024', NCCN_2024: 'NCCN 2024' };

function funcs() { return { tnm_stage, tumor_board, molecular, ecog, mdt_coordination }; }
module.exports = { funcs, CITATIONS, ValidationError };