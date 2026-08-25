// filepath: tier89_oncology_radiation_469_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function radiation_planning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureEnum(req.intent, 'int', ['curative','palliative','adjuvant','neoadjuvant','salvage','prophylactic','definitive','other','unknown']);
  ensureEnum(req.site, 'site', ['brain','head_neck','breast','lung','esophagus','rectum','prostate','cervix','endometrium','bladder','sarcoma','lymphoma','skin','bone','other','unknown']);
  ensureEnum(req.technique, 'te', ['3d_crt','imrt','vmat','sbrt','srs','proton','brachytherapy','electron','other','unknown']);
  ensureNum(req.total_dose_gy, 'td');
  ensureNum(req.fractions, 'fx');
  ensureNum(req.dose_per_fraction_gy, 'df');
  ensureNum(req.treatment_days, 'tday');
  ensureBool(req.image_guided, 'ig');
  ensureBool(req.gating_used, 'gat');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function dose_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.planned_dose_gy, 'pd');
  ensureNum(req.delivered_dose_gy, 'dd');
  ensureNum(req.session_number, 'sn');
  ensureBool(req.fractions_completed, 'fc');
  ensureBool(req.treatment_interrupted, 'ti');
  ensureNum(req.interruption_days, 'iday');
  ensureEnum(req.interruption_reason, 'ir', ['machine','patient_illness','toxicity','public_holiday','weather','staff','other','unknown','none']);
  ensureNum(req.cumulative_dose_gy, 'cd');
  ensureNum(req.dvh_max, 'dmax');
  ensureNum(req.dvh_mean, 'dmn');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function site_specific(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.site, 'site');
  ensureNum(req.gtv_volume_cc, 'gtv');
  ensureNum(req.ctv_volume_cc, 'ctv');
  ensureNum(req.ptv_volume_cc, 'ptv');
  ensureNum(req.oar_dose_limit_gy, 'oar');
  ensureBool(req.constraints_met, 'cm');
  ensureNum(req.conformity_index, 'ci');
  ensureNum(req.homogeneity_index, 'hi');
  ensureEnum(req.boost_status, 'bs', ['none','simultaneous_integrated','sequential','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function radiation_toxicity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.acute_toxicity, 'at', ['dermatitis','mucositis','esophagitis','proctitis','cystitis','pneumonitis','nausea','fatigue','other','none','unknown']);
  ensureEnum(req.ctcae_grade, 'cg', ['0','1','2','3','4','unknown']);
  ensureNum(req.late_effects_score, 'le');
  ensureBool(req.hospitalization, 'hosp');
  ensureNum(req.steroid_use_days, 'std');
  ensureBool(req.treatment_held, 'th');
  ensureNum(req.days_held, 'dh');
  ensureNum(req.recovery_weeks, 'rec');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function brachytherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'prid');
  ensureEnum(req.type, 'tp', ['intracavitary','interstitial','intraluminal','surface','combination','other','unknown']);
  ensureStr(req.anatomical_site, 'as');
  ensureNum(req.total_dose_gy, 'td');
  ensureNum(req.fractions, 'fx');
  ensureNum(req.dose_rate, 'dr');
  ensureEnum(req.applicator, 'app', ['tandem_ring','tandem_ovoids','cylinder','needles','catheter','other','unknown']);
  ensureNum(req.hospital_stay_days, 'hsd');
  ensureBool(req.anesthesia_used, 'au');
  ensureEnum(req.complications, 'comp', ['none','bleeding','infection','perforation','fistula','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { prid: req.procedure_id };
}

function funcs() { return { radiation_planning, dose_tracking, site_specific, radiation_toxicity, brachytherapy }; }
module.exports = { funcs, ValidationError };
