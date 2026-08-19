// filepath: tier85_pain_ext_449_pain_chronic_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chronic_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.pain_type, 'pt', ['nociceptive','neuropathic','mixed','inflammatory','functional','unknown']);
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.duration_months, 'dur');
  ensureStr(req.location, 'loc');
  ensureNum(req.oswestry_index, 'oi');
  ensureNum(req.brief_pain_inventory, 'bpi');
  ensureBool(req.work_disability, 'wd');
  ensureEnum(req.treatment_plan, 'tp', ['monitoring','physical_therapy','medication','injection','nerve_block','surgery','psychology','combination','observation','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function opioid_chronic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.daily_mme, 'mme');
  ensureEnum(req.opioid_type, 'ot', ['morphine','oxycodone','fentanyl','methadone','buprenorphine','hydromorphone','tramadol','codeine','other','unknown']);
  ensureNum(req.daily_dose_mg, 'mg');
  ensureBool(req.compliance, 'comp');
  ensureBool(req.urine_drug_screen, 'uds');
  ensureBool(req.pdmp_checked, 'pdmp');
  ensureEnum(req.taper_plan, 'tp', ['gradual','rapid','rotate_bupe','continue','refer','other']);
  ensureBool(req.naloxone_prescribed, 'np');
  ensureStr(req.function_status, 'fs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function pain_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.chief_complaint, 'cc');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.duration_months, 'dur');
  ensureStr(req.imaging_findings, 'imf');
  ensureNum(req.peg_score, 'peg');
  ensureEnum(req.referral, 'ref', ['none','pain_clinic','spine','rheum','neuro','psych','surgery','other']);
  ensureBool(req.multimodal_approach, 'mma');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function neuropathic_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.diagnosis, 'dx', ['diabetic_peripheral','post_herpetic','central_post_stroke','sciatica','crps','trigeminal','failed_back_surgery','other','unknown']);
  ensureNum(req.douleur_neuropathic_score, 'dns');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.allodynia_present, 'ap');
  ensureEnum(req.first_line, 'fl', ['gabapentin','pregabalin','duloxetine','venlafaxine','tricyclic','topical_lidocaine','topical_capsaicin','combination','other']);
  ensureBool(req.responded_to_first, 'rfi');
  ensureEnum(req.second_line, 'sl', ['gabapentin','pregabalin','duloxetine','venlafaxine','tricyclic','topical_lidocaine','topical_capsaicin','combination','other','none']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function interventional_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.procedure_type, 'pt', ['epidural','facet_injection','nerve_block','rfa','spinal_cord_stim','intrathecal_pump','kyphoplasty','sacroiliac','other']);
  ensureStr(req.target_level, 'tl');
  ensureStr(req.indication, 'ind');
  ensureBool(req.imaging_guidance, 'ig');
  ensureBool(req.sedation, 'sed');
  ensureNum(req.operative_time_min, 'otm');
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','nerve_injury','dural_puncture','headache','other']);
  ensureNum(req.pain_reduction_pct, 'prp');
  ensureNum(req.duration_weeks, 'dw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { chronic_pain, opioid_chronic, pain_clinic, neuropathic_pain, interventional_pain }; }
module.exports = { funcs, ValidationError };