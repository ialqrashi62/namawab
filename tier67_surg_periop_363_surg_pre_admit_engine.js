// filepath: tier67_surg_periop_363_surg_pre_admit_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pre_admission_testing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.scheduled_date, 'sd');
  ensureStr(req.labs_ordered, 'lo');
  ensureBool(req.ekg_ordered, 'eo');
  ensureEnum(req.imaging_reviewed, 'ir', ['none','chest_xray','ekg_only','other','mri','ct','ultrasound','cath']);
  ensureBool(req.cleared, 'cl');
  ensureStr(req.cleared_by, 'cb');
  return { case_id: req.case_id };
}
function anesthesia_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureNum(req.asa_class, 'ac');
  ensureStr(req.airway, 'aw');
  ensureEnum(req.cardiac_risk, 'cr', ['low','intermediate','high','very_high','prohibitive','unknown']);
  ensureEnum(req.renal_function, 'rf', ['normal','mild_impairment','moderate_impairment','severe_impairment','esrd','dialysis','unknown']);
  ensureEnum(req.anesthesia_plan, 'ap', ['general','regional','local','monitored_anesthesia_care','epidural','spinal','combined','awake','sedation','other']);
  ensureStr(req.anesthesiologist, 'anes');
  ensureBool(req.consent_obtained, 'co');
  return { asa: req.asa_class };
}
function pre_op_orders(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureEnum(req.npo_status, 'npo', ['npo_midnight','npo_clear_2h','npo_clear_6h','npo_solid_8h','npo_feed_4h','npo_modified','regular','clear_liquids','aspirated','other']);
  ensureStr(req.pre_op_meds, 'pm');
  ensureEnum(req.vte_prophylaxis, 'vp', ['heparin_5000','heparin_7500','enoxaparin_40','enoxaparin_30','sequential','none','aspirin','mechanical_only','patient_on_chronic_anticoag','other']);
  ensureEnum(req.skin_prep, 'sp', ['chlorhexidine','povidone_iodine','alcohol_based','combination','none','tecar','sterile_drapes','clipping','depilatory','razor_preferred']);
  ensureEnum(req.antibiotic_timing, 'at', ['within_60_min','within_120_min','redosing','none','not_required','patient_on_window','late_overridden','discretion']);
  ensureStr(req.ordered_by, 'ob');
  return { npo: req.npo_status };
}
function pre_op_education(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureStr(req.education_topics, 'et');
  ensureEnum(req.language, 'lang', ['english','arabic','french','urdu','hindi','spanish','other']);
  ensureEnum(req.method, 'method', ['in_person','video','telephone','leaflet','combo','in_person_video','web_portal','pamphlet','mobile_app','simulator','other']);
  ensureEnum(req.patient_consent, 'pc', ['verbal','written','electronic','implied','not_obtained','witness_signed','patient_refused','patient_incapacitated','other']);
  ensureBool(req.questions_answered, 'qa');
  ensureEnum(req.literacy_level, 'll', ['pre_k','k_2','grade_3_5','grade_6_8','grade_9_12','college','professional','other']);
  return { topics: req.education_topics };
}
function pre_admission_clearance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureEnum(req.clearance_status, 'cs', ['cleared','conditionally_cleared','not_cleared','deferred','patient_decline','pending','cancelled','rescheduling_required']);
  ensureEnum(req.cardiac_clearance, 'cc', ['low_risk','intermediate_risk','high_risk','further_workup','prohibited','cleared_with_restrictions','not_applicable','clearance_required','cleared']);
  ensureEnum(req.pulm_clearance, 'pc', ['baseline','mild_impairment','moderate_impairment','severe_impairment','further_workup','cleared_with_restrictions','not_applicable','cleared','clearance_required']);
  ensureEnum(req.endocrine_clearance, 'ec', ['well_controlled','suboptimal','uncontrolled','further_workup','cleared_with_restrictions','not_applicable','cleared','diabetic_protocol','steroid_stress']);
  ensureEnum(req.hematology_clearance, 'hc', ['normal','abnormal','further_workup','anticoag_review','cleared_with_restrictions','not_applicable','cleared','dvt_prophylaxis_required']);
  ensureStr(req.finalized_by, 'fb');
  return { status: req.clearance_status };
}

function funcs() { return { pre_admission_testing, anesthesia_eval, pre_op_orders, pre_op_education, pre_admission_clearance }; }
module.exports = { funcs, ValidationError };