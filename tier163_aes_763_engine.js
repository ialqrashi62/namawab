// filepath: tier163_aes_763_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pilot_medical(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.cert_class, 'cc', ['1st','2nd','3rd','recreational','instructor','NA']);
  ensureNum(req.flight_hours, 'fh'); ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.hr, 'hr'); ensureNum(req.bmi, 'bm');
  ensureEnum(req.cardiovascular, 'cv', ['normal','abnormal','pending','NA']);
  ensureBool(req.electrocardiogram, 'ec'); ensureEnum(req.vision, 'vs', ['20_20','corrected','uncorrected','NA']);
  ensureEnum(req.disposition, 'di', ['issued','deferred','denied','NA']);
  ensureStr(req.provider, 'pr');
  return { pm_id: `pm_${Date.now()}`, patient_id: req.patient_id, cert: req.cert_class, disp: req.disposition };
}

function decompression_sick(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.depth_max_m, 'dm'); ensureNum(req.bottom_time_min, 'bt');
  ensureNum(req.ascent_rate_m_min, 'ar'); ensureNum(req.surface_interval_min, 'si');
  ensureEnum(req.symptom, 'sy', ['joint','skin','neurologic','inner_ear','pulmonary','other','NA']);
  ensureNum(req.symptom_onset_min, 'so'); ensureBool(req.recurrent, 'rc');
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','NA']);
  ensureBool(req.treatment, 'tr'); ensureStr(req.provider, 'pr');
  return { ds_id: `ds_${Date.now()}`, patient_id: req.patient_id, severity: req.severity, treatment: req.treatment };
}

function gas_toxicity(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.gas_type, 'gt', ['oxygen','CO2','CO','nitrogen','hydrogen_sulfide','methane','other','NA']);
  ensureNum(req.exposure_ppm, 'ep'); ensureNum(req.exposure_duration_min, 'ed');
  ensureBool(req.symptoms, 'sx'); ensureEnum(req.symptom_type, 'st', ['neuro','pulmonary','cardiovascular','GI','other','NA']);
  ensureNum(req.examination_level, 'el'); ensureEnum(req.outcome, 'ot', ['none','subclinical','clinical','NA']);
  ensureNum(req.treatment_lag_min, 'tl'); ensureStr(req.provider, 'pr');
  return { gt_id: `gt_${Date.now()}`, patient_id: req.patient_id, gas: req.gas_type, outcome: req.outcome };
}

function barotrauma(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.location, 'lo', ['middle_ear','inner_ear','sinus','lung','GI','dental','other','NA']);
  ensureNum(req.depth_at_injury_m, 'di'); ensureNum(req.ascent_rate_m_min, 'ar');
  ensureNum(req.pain_score, 'ps'); ensureBool(req.perforation, 'pr');
  ensureEnum(req.grade, 'gd', ['1','2','3','4','5','NA']);
  ensureNum(req.hearing_change_dB, 'hc'); ensureEnum(req.treatment, 'tr', ['conservative','decongestant','ablation','surgery','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { bt_id: `bt_${Date.now()}`, patient_id: req.patient_id, location: req.location, grade: req.grade };
}

function hypoxia_aviation(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.altitude_ft, 'af'); ensureNum(req.cabin_pressure_inHg, 'cp');
  ensureNum(req.spo2, 'sp'); ensureNum(req.symptom_onset_min, 'so');
  ensureEnum(req.symptom, 'sy', ['none','mild','moderate','severe','LOC','NA']);
  ensureNum(req.oxygen_duration_min, 'od'); ensureBool(req.full_recovery, 'fr');
  ensureEnum(req.disposition, 'di', ['continue','ground','diversion','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { ha_id: `ha_${Date.now()}`, patient_id: req.patient_id, altitude: req.altitude_ft, sym: req.symptom };
}

function funcs() { return { pilot_medical, decompression_sick, gas_toxicity, barotrauma, hypoxia_aviation }; }
module.exports = { funcs, ValidationError };