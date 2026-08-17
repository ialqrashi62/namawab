// filepath: tier26_oncology_ext_167_survivor_engine.js
// TIER26_ONCOLOGY-167: Survivorship, late effects, surveillance
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function surveillance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cancer_type, 'cancer_type', ['breast','colorectal','lung','prostate','lymphoma','leukemia','melanoma','thyroid','kidney','bladder','ovarian','cervical','endometrial','pancreatic','gastric','liver','sarcoma','head_neck','brain','other']);
  ensureNumber(req.days_since_treatment, 'days');
  ensureEnum(req.imaging_freq, 'imaging_freq', ['every_3_months','every_6_months','annually','every_2_years','as_needed','discharged','other']);
  ensureEnum(req.tumor_markers, 'tumor_markers', ['cea','ca_125','ca_19_9','psa','afp','hcg','ldh','thyroglobulin','calcitonin','none','other']);
  ensureBool(req.recurrence_suspected, 'recurrence');
  let status;
  if (req.recurrence_suspected) status = 'recurrence_suspected_imaging_biopsy';
  else if (req.imaging_freq === 'discharged') status = 'discharged_from_surveillance_review_indications';
  else status = 'surveillance_appropriate';
  return { status, cancer: req.cancer_type };
}

function late_effects(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.years_since_treatment, 'years');
  ensureEnum(req.late_effect, 'late_effect', ['cardiotoxicity','secondary_malignancy','neuropathy','cognitive_decline','fatigue','infertility','lymphedema','osteoporosis','renal_dysfunction','pulmonary_fibrosis','endocrine','sexual_dysfunction','psychosocial','other']);
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','life_threatening','other']);
  ensureEnum(req.treatment_history, 'treatment_history', ['surgery','chemotherapy','radiation','immunotherapy','targeted_therapy','transplant','combination','other']);
  ensureBool(req.followup_specialty, 'specialty');
  let status;
  if (req.severity === 'life_threatening') status = 'life_threatening_late_effect_urgent_review';
  else if (req.late_effect === 'cardiotoxicity' && !req.followup_specialty) status = 'cardiotoxicity_cardiology_required';
  else if (req.late_effect === 'secondary_malignancy') status = 'secondary_malignancy_workup_required';
  else status = 'late_effect_monitored';
  return { status, effect: req.late_effect };
}

function survivorship_care(req) {
  ensureStr(req.plan_id, 'plan_id');
  ensureNumber(req.years_since_treatment, 'years');
  ensureBool(req.treatment_summary_completed, 'summary');
  ensureBool(req.survivorship_care_plan, 'scp');
  ensureEnum(req.lifestyle, 'lifestyle', ['adequate','needs_improvement','active','inactive','unknown','other']);
  ensureBool(req.psychological_support, 'psych');
  let status;
  if (!req.treatment_summary_completed) status = 'treatment_summary_required';
  else if (!req.survivorship_care_plan) status = 'survivorship_care_plan_required';
  else if (req.lifestyle === 'inactive') status = 'physical_activity_counseling';
  else if (!req.psychological_support) status = 'psychological_support_referral';
  else status = 'survivorship_care_appropriate';
  return { status, scp: req.survivorship_care_plan };
}

function cardio_oncology(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.anthracycline_exposure, 'anthracycline', ['doxorubicin','epirubicin','idarubicin','daunorubicin','mitoxantrone','none','other']);
  ensureNumber(req.cumulative_dose_mg_m2, 'cum_dose');
  ensureNumber(req.lvef, 'lvef');
  ensureEnum(req.heart_failure_stage, 'hf_stage', ['a_at_risk','b_pre_hf','c_symptomatic','d_advanced','none','other']);
  ensureBool(req.bnp_elevated, 'bnp');
  let status;
  if (req.lvef < 50 && req.heart_failure_stage === 'c_symptomatic') status = 'cardiotoxicity_hf_treat_refer';
  else if (req.cumulative_dose_mg_m2 > 450 && req.lvef < 50) status = 'high_dose_low_lvef_urgent_cardiology';
  else if (req.bnp_elevated && req.lvef < 55) status = 'bnp_elevated_lvef_mild_decline_monitor';
  else status = 'cardio_oncology_reviewed';
  return { status, lvef: req.lvef };
}

function fertility(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.gender, 'gender', ['male','female','other','unknown','other']);
  ensureEnum(req.fertility_status, 'fertility_status', ['preserved','preservation_planned','declined','post_treatment_infertile','post_treatment_fertile','desires_pregnancy','desires_sperm_bank','not_applicable','other']);
  ensureBool(req.sperm_bank_offered, 'sperm_bank');
  ensureBool(req.egg_freeze_offered, 'egg_freeze');
  ensureEnum(req.reproductive_counseling, 'reproductive_counseling', ['done','pending','declined','not_applicable','other']);
  let status;
  if (req.gender === 'male' && req.fertility_status === 'desires_sperm_bank' && !req.sperm_bank_offered) status = 'sperm_bank_offer_required';
  else if (req.gender === 'female' && req.fertility_status === 'desires_pregnancy' && !req.egg_freeze_offered) status = 'egg_freeze_or_fertility_preservation_offer';
  else status = 'fertility_counseling_reviewed';
  return { status, gender: req.gender };
}

const CITATIONS = { NCCN_SURVIVORSHIP_2024: 'NCCN Survivorship 2024', ASCO_CARDIO_2024: 'ASCO Cardio-Onc 2024' };

function funcs() { return { surveillance, late_effects, survivorship_care, cardio_oncology, fertility }; }
module.exports = { funcs, CITATIONS, ValidationError };