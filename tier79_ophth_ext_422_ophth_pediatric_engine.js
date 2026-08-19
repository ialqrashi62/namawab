// filepath: tier79_ophth_ext_422_ophth_pediatric_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pediatric_exam(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.laterality, 'lat', ['right','left','bilateral','unknown']);
  ensureStr(req.va_method, 'vam');
  ensureStr(req.va_result, 'var');
  ensureNum(req.cycloplegic_refraction_sph, 'crs');
  ensureEnum(req.alignment, 'align', ['orthotropia','esotropia','exotropia','hypertropia','hypotropia','intermittent','unknown','other']);
  ensureStr(req.red_reflex, 'rr');
  ensureStr(req.parent_concerns, 'pc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function amblyopia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.laterality, 'lat', ['right','left','bilateral','unknown']);
  ensureNum(req.va_affected, 'vaa');
  ensureNum(req.va_unaffected, 'vau');
  ensureEnum(req.treatment, 'tx', ['patching','atropine_penalization','glasses','optical_penalty','combination','observation','other','unknown']);
  ensureNum(req.patch_hours_per_day, 'phd');
  ensureNum(req.compliance_pct, 'comp');
  ensureStr(req.barriers, 'bar');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function strabismus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.type, 't', ['esotropia','exotropia','hypertropia','hypotropia','intermittent','pattern','other','unknown']);
  ensureNum(req.angle_prism_diopter, 'apd');
  ensureNum(req.age_onset_years, 'aoy');
  ensureEnum(req.management, 'mg', ['observation','glasses','patching','botox','surgery','combination','other','unknown']);
  ensureBool(req.surgery_planned, 'splan');
  ensureNum(req.surgical_target_diopter, 'std');
  ensureStr(req.binocular_function, 'bf');
  ensureStr(req.stereoacuity, 'st');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function retinopathy_prematurity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.birth_weight_grams, 'bwg');
  ensureNum(req.age_at_exam_weeks, 'aaw');
  ensureEnum(req.stage, 'stage', ['none','stage_1','stage_2','stage_3','stage_4a','stage_4b','stage_5','unknown','other']);
  ensureEnum(req.zone, 'zone', ['zone_1','zone_2','zone_3','unknown']);
  ensureEnum(req.plus_disease, 'pd', ['absent','pre_plus','plus','unknown']);
  ensureBool(req.treatment_required, 'trq');
  ensureBool(req.anti_vegf_given, 'avg');
  ensureBool(req.laser_done, 'ld');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function pediatric_cataract(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.laterality, 'lat', ['right','left','bilateral','unknown']);
  ensureEnum(req.cataract_type, 'ct', ['congenital','developmental','traumatic','secondary','posterior_polar','lamellar','unknown','other']);
  ensureBool(req.surgery_indicated, 'si');
  ensureNum(req.surgery_age_months, 'sam');
  ensureBool(req.ioL_planned, 'ipl');
  ensureBool(req.contact_lens_cl, 'clc');
  ensureEnum(req.patching_required, 'par', ['none','unilateral','bilateral','unknown','other']);
  ensureStr(req.genetic_testing, 'gt');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { pediatric_exam, amblyopia, strabismus, retinopathy_prematurity, pediatric_cataract }; }
module.exports = { funcs, ValidationError };