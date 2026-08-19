// filepath: tier138_tel_673_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function start_session(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.provider_id, 'pr');
  ensureEnum(req.session_type, 'st', ['video','audio','chat','async','store_and_forward','remote_monitor','tele_radiology','tele_pathology','tele_ICU','tele_psych']);
  ensureEnum(req.platform, 'pf', ['native','zoom','teams','webex','doxy','amwell','teladoc','epic','custom','webrtc']);
  ensureNum(req.bandwidth_kbps, 'bw');
  ensureNum(req.latency_ms, 'lt');
  ensureStr(req.device_info, 'di');
  return { ss_id: `ss_${Date.now()}`, patient_id: req.patient_id, type: req.session_type, platform: req.platform, provider: req.provider_id };
}
function record(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.ss_id, 'sid');
  ensureStr(req.recording_id, 'rid');
  ensureNum(req.duration_sec, 'ds');
  ensureEnum(req.format, 'fm', ['mp4','webm','mov','mkv','mp3','wav','m4a','encrypted','chunked_stream','HLS']);
  ensureBool(req.encrypted, 'en');
  ensureNum(req.size_mb, 'sz');
  ensureStr(req.storage_path, 'sp');
  return { rec_id: `rec_${Date.now()}`, ss_id: req.ss_id, recording_id: req.recording_id, duration: req.duration_sec };
}
function streaming(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.ss_id, 'sid');
  ensureEnum(req.protocol, 'pr', ['webrtc','RTMP','HLS','DASH','SRT','WebSocket','gRPC','MQTT','RTSP','secure_WebSocket']);
  ensureNum(req.bitrate_kbps, 'br');
  ensureNum(req.packets_total, 'pt');
  ensureNum(req.packets_lost, 'pl');
  ensureNum(req.jitter_ms, 'jt');
  ensureEnum(req.quality, 'ql', ['excellent','good','acceptable','poor','unusable']);
  return { s_id: `st_${Date.now()}`, ss_id: req.ss_id, quality: req.quality, packets_lost: req.packets_lost };
}
function vitals_stream(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.device_id, 'did');
  ensureNum(req.hr, 'hr');
  ensureNum(req.spo2, 'sp');
  ensureNum(req.systolic, 'sy');
  ensureNum(req.diastolic, 'di');
  ensureNum(req.temp, 'tp');
  ensureNum(req.respiratory_rate, 'rr');
  ensureEnum(req.priority, 'pr', ['routine','elevated','critical','urgent']);
  return { vs_id: `vs_${Date.now()}`, patient_id: req.patient_id, device: req.device_id, hr: req.hr, spo2: req.spo2 };
}
function end_session(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.ss_id, 'sid');
  ensureNum(req.duration_sec, 'ds');
  ensureNum(req.disconnect_count, 'dc');
  ensureStr(req.summary, 'sm');
  ensureBool(req.billed, 'bi');
  ensureBool(req.followup_scheduled, 'fws');
  ensureStr(req.provider, 'pr');
  return { es_id: `es_${Date.now()}`, ss_id: req.ss_id, duration: req.duration_sec, provider: req.provider };
}

function funcs() { return { start_session, record, streaming, vitals_stream, end_session }; }
module.exports = { funcs, ValidationError };
