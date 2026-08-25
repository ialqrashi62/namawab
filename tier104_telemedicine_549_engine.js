// filepath: tier104_telemedicine_549_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tele_consult(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.consult_id, 'cid');
  ensureStr(req.provider, 'pv');
  ensureEnum(req.type, 'tp', ['primary_care','specialty','urgent_care','second_opinion','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.bandwidth_mbps, 'bw');
  ensureNum(req.audio_quality, 'aq');
  ensureNum(req.video_quality, 'vq');
  ensureBool(req.completed, 'comp');
  ensureStr(req.provider, 'pr');
  return { cid: req.consult_id };
}
function remote_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.device_type, 'dt', ['bp_cuff','glucose_meter','pulse_ox','weight_scale','ecg','other','unknown']);
  ensureNum(req.readings_count, 'rc');
  ensureNum(req.alert_triggered, 'at');
  ensureEnum(req.intervention, 'int', ['none','dose_adjustment','medication_change','er_referral','urgent_visit','other','unknown']);
  ensureNum(req.compliance_pct, 'cp');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function store_and_forward(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureEnum(req.modality, 'mod', ['dermatology_photo','radiology_image','ekg','echo','pathology_slide','retinal_photo','other','unknown']);
  ensureStr(req.referring_physician, 'rp');
  ensureStr(req.consultant, 'cons');
  ensureNum(req.response_hours, 'rh');
  ensureEnum(req.outcome, 'out', ['benign','malignant','urgent_finding','recommend_biopsy','recommend_treatment','inconclusive','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.case_id };
}
function virtual_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.triage_id, 'tid');
  ensureStr(req.symptoms, 'sym');
  ensureEnum(req.priority, 'pr', ['low','medium','high','urgent','emergent','other','unknown']);
  ensureEnum(req.recommendation, 'rec', ['self_care','primary_care','urgent_care','er','call_911','tele_consult','other','unknown']);
  ensureNum(req.wait_min, 'wm');
  ensureEnum(req.outcome, 'out', ['resolved','escalated','follow_up','admitted','discharged','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { tid: req.triage_id };
}
function tele_icu(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureStr(req.hospital, 'hosp');
  ensureStr(req.physician, 'phy');
  ensureNum(req.patients_monitored, 'pm');
  ensureNum(req.alerts, 'alerts');
  ensureNum(req.intervention_rate, 'ir');
  ensureNum(req.length_of_stay_reduction, 'losr');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}

function funcs() { return { tele_consult, remote_monitoring, store_and_forward, virtual_triage, tele_icu }; }
module.exports = { funcs, ValidationError };
