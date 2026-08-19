// filepath: tier141_vox_676_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function voice_command(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.user_id, 'uid');
  ensureStr(req.audio_id, 'aid');
  ensureStr(req.transcript, 'tr');
  ensureEnum(req.intent, 'in', ['order_entry','note_edit','lab_review','med_admin','patient_call','schedule','lookup','navigation','dictation','assistant','command','other']);
  ensureNum(req.confidence, 'cf');
  ensureStr(req.extracted, 'ex');
  ensureStr(req.provider, 'pr');
  return { vc_id: `vc_${Date.now()}`, user_id: req.user_id, intent: req.intent, transcript: req.transcript };
}
function wake_word(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.device_id, 'did');
  ensureStr(req.wake_word, 'ww');
  ensureEnum(req.response, 'rs', ['silence','idle','ready','listening','action','error']);
  ensureNum(req.far_field_snr, 'sn');
  ensureBool(req.false_trigger, 'ft');
  ensureStr(req.context, 'cx');
  ensureStr(req.provider, 'pr');
  return { ww_id: `ww_${Date.now()}`, device_id: req.device_id, wake_word: req.wake_word, response: req.response };
}
function dictation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.user_id, 'uid');
  ensureStr(req.session_id, 'si');
  ensureStr(req.text, 'tx');
  ensureNum(req.duration_sec, 'ds');
  ensureNum(req.word_count, 'wc');
  ensureEnum(req.format, 'fm', ['SOAP','H&P','progress','procedure','consult','discharge','referral','patient_letter','nursing','radiology','pathology','custom']);
  ensureStr(req.provider, 'pr');
  return { dc_id: `dc_${Date.now()}`, session_id: req.session_id, format: req.format, word_count: req.word_count };
}
function biometric_voice(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.user_id, 'uid');
  ensureStr(req.audio_id, 'aid');
  ensureNum(req.confidence, 'cf');
  ensureEnum(req.verdict, 'vd', ['match','close_match','no_match','fraud','spoof','enrollment']);
  ensureStr(req.speaker_id, 'si');
  ensureStr(req.text, 'tx');
  ensureStr(req.provider, 'pr');
  return { bv_id: `bv_${Date.now()}`, user_id: req.user_id, verdict: req.verdict, confidence: req.confidence };
}
function ambient_listen(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.session_id, 'si');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.provider_id, 'pri');
  ensureNum(req.duration_sec, 'ds');
  ensureNum(req.speaker_count, 'sc');
  ensureStr(req.transcript, 'tr');
  ensureStr(req.structured_note, 'sn');
  ensureStr(req.provider, 'pr');
  return { al_id: `al_${Date.now()}`, session_id: req.session_id, provider: req.provider_id, duration: req.duration_sec };
}

function funcs() { return { voice_command, wake_word, dictation, biometric_voice, ambient_listen }; }
module.exports = { funcs, ValidationError };
