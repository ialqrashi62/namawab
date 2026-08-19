// filepath: tier84_psych_ext_444_psych_anxiety_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function anxiety_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.gad7_score, 'gad');
  ensureEnum(req.severity, 'sev', ['minimal','mild','moderate','severe','unknown']);
  ensureNum(req.symptoms_count, 'sc');
  ensureNum(req.duration_months, 'dur');
  ensureBool(req.work_impairment, 'wimp');
  ensureBool(req.social_impairment, 'simp');
  ensureBool(req.sleep_disturbance, 'sd');
  ensureEnum(req.treatment, 'tx', ['observation','therapy','ssri','snri','benzo_short','combination','referral','other']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function ocd_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ybocs_score, 'ys');
  ensureNum(req.ybocs_obsessions, 'yo');
  ensureNum(req.ybocs_compulsions, 'yc');
  ensureBool(req.ego_dystonic, 'ed');
  ensureNum(req.time_spent_hours, 'tsh');
  ensureBool(req.work_impairment, 'wimp');
  ensureBool(req.erp_therapy, 'erp');
  ensureBool(req.ssri_started, 'ss');
  ensureNum(req.clomipramine_started, 'cms');
  ensureBool(req.deep_brain_stimulation, 'dbs');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function ptsd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.trauma_type, 'tt');
  ensureNum(req.pcl5_score, 'pcl');
  ensureEnum(req.duration_months, 'dur', ['lt1','1to3','3to6','6to12','gt12','unknown']);
  ensureBool(req.intrusion_symptoms, 'is');
  ensureBool(req.avoidance, 'av');
  ensureBool(req.hyperarousal, 'ha');
  ensureBool(req.dissociation, 'dis');
  ensureBool(req.combat_exposure, 'ce');
  ensureEnum(req.treatment, 'tx', ['cbt','emdr','ssri','snri','prazosin','combination','observation','other']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function panic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.episodes_per_week, 'epw');
  ensureBool(req.agoraphobia, 'ago');
  ensureNum(req.pd_ss_score, 'pds');
  ensureNum(req.episode_duration_min, 'edm');
  ensureStr(req.physical_symptoms, 'ps');
  ensureBool(req.dispatcher_visits, 'dv');
  ensureNum(req.between_episodes_anticipatory, 'bea');
  ensureEnum(req.treatment, 'tx', ['cbt','ssri','snri','benzo','combination','observation','referral','other']);
  ensureBool(req.exposure_therapy, 'et');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function social_anxiety(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.liebowitz_score, 'ls');
  ensureEnum(req.subtype, 'sub', ['generalized','performance_only','nongeneralized','specific','unknown']);
  ensureNum(req.age_onset, 'ao');
  ensureBool(req.avoidance, 'av');
  ensureBool(req.functional_impairment, 'fi');
  ensureNum(req.school_work_avoidance, 'swa');
  ensureBool(req.comorbid_depression, 'cd');
  ensureEnum(req.treatment, 'tx', ['cbt','ssri','snri','benzo','exposure','combination','observation','other']);
  ensureBool(req.exposure_therapy, 'et');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { anxiety_screen, ocd_eval, ptsd, panic, social_anxiety }; }
module.exports = { funcs, ValidationError };