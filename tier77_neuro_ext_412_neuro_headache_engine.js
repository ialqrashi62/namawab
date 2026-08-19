// filepath: tier77_neuro_ext_412_neuro_headache_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function headache_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.headache_days_month, 'hdm');
  ensureBool(req.migraine_aura, 'ma');
  ensureStr(req.triggers, 'trig');
  ensureStr(req.family_history, 'fh');
  ensureNum(req.disability_score, 'ds');
  ensureStr(req.medications, 'meds');
  ensureStr(req.red_flags, 'rfs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function migraine_prevention(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'mid');
  ensureEnum(req.prevent_med, 'pm', ['topiramate','propranolol','amitriptyline','cgrp_inhibitor','cgrp_receptor_antagonist','onabotulinumtoxina','nurtec','aimovig','ajovy','emgality','other','unknown']);
  ensureNum(req.target_dose, 'td');
  ensureNum(req.days_per_month_on_treatment, 'dpm');
  ensureNum(req.disability_score, 'ds');
  ensureBool(req.started, 'st');
  ensureBool(req.tolerated, 'tol');
  ensureStr(req.insurance_approval, 'ia');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { mid: req.medication_id };
}
function cluster_headache(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.episode_duration_min, 'edm');
  ensureNum(req.episodes_per_day, 'epd');
  ensureBool(req.oxygen_therapy, 'ot');
  ensureNum(req.oxygen_flow_lpm, 'ofl');
  ensureBool(req.sumitriptan_used, 'su');
  ensureBool(req.verapamil_started, 'vs');
  ensureNum(req.verapamil_dose, 'vd');
  ensureStr(req.galcanezumab_started, 'gs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function medication_overuse(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.overuse_med, 'om', ['ibuprofen','sumatriptan','codeine','tramadol','acetaminophen','nsaid','caffeine_combo','ergotamine','other','unknown']);
  ensureNum(req.overuse_days, 'od');
  ensureNum(req.overuse_count, 'oc');
  ensureNum(req.disability_score, 'ds');
  ensureBool(req.withdrawal_planned, 'wp');
  ensureBool(req.bridge_therapy_started, 'bts');
  ensureStr(req.started_date, 'sd');
  ensureStr(req.patient_education, 'pe');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function botox_for_migraine(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.botox_units, 'bu');
  ensureNum(req.botox_sites, 'bs');
  ensureNum(req.headache_days_month, 'hdm');
  ensureBool(req.trial_period_complete, 'tpc');
  ensureBool(req.insurance_approved, 'ia');
  ensureBool(req.responded, 'res');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}

function funcs() { return { headache_initial, migraine_prevention, cluster_headache, medication_overuse, botox_for_migraine }; }
module.exports = { funcs, ValidationError };