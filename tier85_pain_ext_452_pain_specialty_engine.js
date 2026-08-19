// filepath: tier85_pain_ext_452_pain_specialty_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function headache_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.headache_type, 'ht', ['migraine','tension_type','cluster','medication_overuse','trigeminal_autonomic','secondary','other','unknown']);
  ensureNum(req.headache_days_month, 'hdm');
  ensureBool(req.allodynia, 'all');
  ensureBool(req.aura_present, 'aup');
  ensureStr(req.abortive_med, 'abm');
  ensureEnum(req.preventive_med, 'prm', ['none','topiramate','amitriptyline','propranolol','cgrp_monoclonal','cgrp_gepant','onabotulinumtoxina','combination','other']);
  ensureBool(req.botox_started, 'bs');
  ensureBool(req.cgrp_started, 'cgs');
  ensureNum(req.pain_score, 'ps');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function pelvic_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.pelvic_pain_type, 'ppt', ['menstrual','endometriosis','adhesion','ic_bladder','musculoskeletal','neuropathic','mixed','other','unknown']);
  ensureNum(req.pain_duration_months, 'pdm');
  ensureBool(req.depression_comorbid, 'dc');
  ensureBool(req.endometriosis_confirmed, 'ec');
  ensureBool(req.dyspareunia, 'dysp');
  ensureEnum(req.imaging, 'img', ['none','us','mri','ct','lap','other']);
  ensureEnum(req.treatment, 'tx', ['observation','nsaids','hormonal','physical_therapy','nerve_block','surgery','multimodal','referral','combination','other']);
  ensureBool(req.reproductive_referral, 'rr');
  ensureNum(req.pain_reduction_pct, 'prp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function cancer_pain_specialty(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.cancer_pain_type, 'cpt', ['nociceptive','neuropathic','bone_metastasis','visceral','mixed','other','unknown']);
  ensureStr(req.cancer_stage, 'cs');
  ensureBool(req.neuropathic_component, 'nc');
  ensureBool(req.bone_metastasis, 'bms');
  ensureBool(req.visceral_component, 'vc');
  ensureNum(req.current_mme, 'cmme');
  ensureBool(req.rotation_done, 'rd');
  ensureBool(req.nerve_block_consulted, 'nbc');
  ensureBool(req.intrathecal_pump_consulted, 'ipc');
  ensureBool(req.palliative_care_consulted, 'pcc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function pediatric_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.duration_days, 'dur');
  ensureNum(req.school_days_missed, 'sdm');
  ensureBool(req.sleep_disrupted, 'sl');
  ensureNum(req.functional_impact_score, 'fis');
  ensureBool(req.cognitive_behavioral_done, 'cbd');
  ensureBool(req.parent_coaching_done, 'pcd');
  ensureEnum(req.medication_used, 'mu', ['none','tylenol','motrin','gabapentin','tca','other']);
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','poor','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function pain_psych(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.pain_duration_years, 'pdy');
  ensureNum(req.catastrophizing_score, 'cs');
  ensureNum(req.kinesiophobia_score, 'ks');
  ensureNum(req.acceptance_score, 'as');
  ensureNum(req.depression_score, 'ds');
  ensureNum(req.anxiety_score, 'ans');
  ensureNum(req.cbt_completed, 'cb');
  ensureNum(req.sessions_remaining, 'sr');
  ensureEnum(req.plan, 'plan', ['cbt','act','cbt_then_act','mindfulness','supportive','other']);
  ensureBool(req.medication_management, 'mm');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { headache_pain, pelvic_pain, cancer_pain_specialty, pediatric_pain, pain_psych }; }
module.exports = { funcs, ValidationError };