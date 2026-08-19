// filepath: tier84_psych_ext_445_psych_mood_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function depression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.phq9_score, 'phq');
  ensureEnum(req.severity, 'sev', ['minimal','mild','moderate','moderately_severe','severe','remission','unknown']);
  ensureBool(req.si_present, 'sip');
  ensureNum(req.symptoms_count, 'sc');
  ensureBool(req.fatigue_present, 'fp');
  ensureBool(req.sleep_disturbance, 'sd');
  ensureBool(req.appetite_change, 'ac');
  ensureBool(req.anhedonia, 'anh');
  ensureEnum(req.treatment, 'tx', ['observation','ssri','snri','combination','tca','augmentation','psychotherapy','combination','referral','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function bipolar(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.bipolar_type, 'bt', ['bipolar_i','bipolar_ii','cyclothymia','unspecified','other','unknown']);
  ensureEnum(req.current_episode, 'ce', ['manic','hypomanic','depressive','mixed','euthymic','unknown']);
  ensureNum(req.young_mania_score, 'yms');
  ensureNum(req.phq9_score, 'phq');
  ensureBool(req.psychotic_features, 'pf');
  ensureBool(req.hospitalized, 'hosp');
  ensureEnum(req.mood_stabilizer, 'ms', ['lithium','valproate','lamotrigine','carbamazepine','oxcarbazepine','topiramate','combination','none','other','unknown']);
  ensureNum(req.lithium_level, 'li');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function pms_pmdd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureNum(req.cycle_length_days, 'cld');
  ensureNum(req.symptoms_days, 'sd');
  ensureBool(req.pms_affect_function, 'paf');
  ensureBool(req.pmdd_confirmed, 'pco');
  ensureNum(req.daily_symptom_score, 'dss');
  ensureBool(req.work_impairment, 'wimp');
  ensureEnum(req.treatment, 'tx', ['lifestyle','ssri_intermittent','ssri_continuous','hormonal_ocp','gnrh_agonist','cognitive','combination','other']);
  ensureBool(req.ssri_trial, 'st');
  ensureNum(req.improvement_pct, 'ip');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function postpartum(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.postpartum_weeks, 'pw');
  ensureNum(req.epds_score, 'es');
  ensureEnum(req.severity, 'sev', ['minimal','mild','moderate','severe','unknown']);
  ensureBool(req.bonding_issues, 'bi');
  ensureBool(req.intrusive_thoughts, 'it');
  ensureBool(req.thoughts_of_harm, 'th');
  ensureBool(req.partner_support, 'ps');
  ensureEnum(req.treatment, 'tx', ['support','therapy','ssri','snri','combination','observation','referral','other']);
  ensureBool(req.breastfeeding, 'bf');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function seasonal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.sps_score, 'sps');
  ensureEnum(req.season, 'season', ['winter','summer','spring','fall','autumn','unknown','other']);
  ensureBool(req.recurrent_pattern, 'rp');
  ensureNum(req.episodes_per_year, 'epy');
  ensureNum(req.typical_duration_weeks, 'tdw');
  ensureEnum(req.treatment, 'tx', ['light_therapy','ssri','cognitive','vitamin_d','combination','observation','other']);
  ensureBool(req.light_therapy_started, 'lts');
  ensureNum(req.light_box_lux, 'lbl');
  ensureNum(req.light_duration_min, 'ldm');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { depression, bipolar, pms_pmdd, postpartum, seasonal }; }
module.exports = { funcs, ValidationError };