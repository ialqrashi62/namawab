// filepath: tier160_tel_751_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function video_visit(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.provider_id, 'pi');
  ensureEnum(req.platform, 'pl', ['Zoom','Teams','WebEx','Doxy','Twilio','Vidyo','Epic_MyChart','built_in','other','NA']);
  ensureNum(req.scheduled_start, 'ss');
  ensureNum(req.actual_start, 'as');
  ensureNum(req.duration_min, 'du');
  ensureEnum(req.type, 'tp', ['acute','chronic','follow_up','med_check','urgent','specialist_consult','second_opinion','remote_monitoring','urgent_care','other','NA']);
  ensureBool(req.video_connected, 'vc');
  ensureBool(req.audio_connected, 'ac');
  ensureNum(req.connection_quality_mbps, 'cq');
  ensureNum(req.drop_events, 'de');
  ensureEnum(req.outcome, 'ot', ['completed','rescheduled','patient_no_show','provider_no_show','tech_failure','converted_to_phone','converted_to_in_person','NA','other']);
  ensureStr(req.provider, 'pr');
  return { vv_id: `vid_${Date.now()}`, patient_id: req.patient_id, duration: req.duration_min };
}
function ehr_message(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.provider_id, 'pi');
  ensureEnum(req.type, 'tp', ['question','med_renewal','lab_result','referral','test_result','appointment','billing','general','other','NA']);
  ensureNum(req.message_length, 'ml');
  ensureBool(req.attachment, 'at');
  ensureNum(req.attachments_count, 'ac');
  ensureNum(req.response_time_hr, 'rt');
  ensureEnum(req.priority, 'pr', ['low','normal','high','urgent','NA']);
  ensureBool(req.phone_followup, 'pf');
  ensureBool(req.video_followup, 'vf');
  ensureBool(req.in_person_followup, 'ip');
  ensureNum(req.words_count, 'wc');
  ensureStr(req.provider, 'pr');
  return { em_id: `ems_${Date.now()}`, patient_id: req.patient_id };
}
function patient_portal(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.logins_30d, 'l3');
  ensureNum(req.last_login_days, 'll');
  ensureNum(req.messages_30d, 'm3');
  ensureNum(req.records_viewed_30d, 'rv');
  ensureNum(req.appointments_scheduled_30d, 'as');
  ensureNum(req.prescription_requests_30d, 'pr');
  ensureNum(req.lab_results_viewed_30d, 'lv');
  ensureNum(req.bill_payments_30d, 'bp');
  ensureNum(req.questionnaire_completed, 'qc');
  ensureStr(req.provider, 'pr');
  return { pp_id: `ptp_${Date.now()}`, patient_id: req.patient_id };
}
function app_remote(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.steps, 'st');
  ensureNum(req.heart_rate_avg, 'ha');
  ensureNum(req.sleep_hours, 'sl');
  ensureNum(req.calories, 'ca');
  ensureNum(req.distance_km, 'dk');
  ensureNum(req.active_minutes, 'am');
  ensureNum(req.spo2_avg, 'sp');
  ensureNum(req.respiratory_rate, 'rr');
  ensureNum(req.stress_score, 'ss');
  ensureNum(req.stand_hours, 'sh');
  ensureNum(req.exercise_minutes, 'ex');
  ensureStr(req.provider, 'pr');
  return { ar_id: `apr_${Date.now()}`, patient_id: req.patient_id };
}
function remote_monitor(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.device_type, 'dt', ['BP_cuff','glucose_meter','pulse_ox','weight_scale','thermometer','ECG','spirometer','CPAP','cardiac_monitor','activity','glucose_CGM','insulin_pump','other','NA']);
  ensureNum(req.reading_value, 'rv');
  ensureEnum(req.measurement_unit, 'mu', ['mmHg','mg_dl','pct','kg','C','F','bpm','L_min','mV','count','hr','steps','m','cal','other','NA']);
  ensureNum(req.reading_time, 'rt');
  ensureBool(req.alert_triggered, 'at');
  ensureEnum(req.alert_type, 'al', ['none','high','low','outlier','critical','trend','missed_reading','battery','connectivity','NA','other']);
  ensureBool(req.provider_notified, 'pn');
  ensureBool(req.action_taken, 'at2');
  ensureNum(req.acknowledgement_min, 'am');
  ensureStr(req.provider, 'pr');
  return { rm_id: `rmn_${Date.now()}`, patient_id: req.patient_id, value: req.reading_value };
}

function funcs() { return { video_visit, ehr_message, patient_portal, app_remote, remote_monitor }; }
module.exports = { funcs, ValidationError };