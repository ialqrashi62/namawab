// filepath: tier59_telemedicine_332_tele_admin_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tele_consent_obtained(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.consent_type, 'ct', ['verbal_tele_health','written_tele_health','email_acknowledgment','chatbot_consent','implied_tele_health']);
  ensureStr(req.consent_law_reference, 'clr');
  ensureBool(req.documented_in_chart, 'dic');
  ensureBool(req.patient_copy_emailed, 'pce');
  ensureBool(req.witness, 'wit');
  ensureEnum(req.language, 'lang', ['arabic','english','urdu','hindi','french','spanish','other']);
  return { consent_type: req.consent_type };
}
function platform_audit_log(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.platform, 'pl', ['zoom_healthcare','doxy_me','teladoc','simplepractice','institutional_platform','teams','webex']);
  ensureStr(req.session_start, 'ss');
  ensureStr(req.session_end, 'se');
  ensureNum(req.participants_count, 'pc');
  ensureBool(req.recording, 'rec');
  ensureEnum(req.encryption, 'enc', ['aes_128','aes_256','tls_1_2','tls_1_3','end_to_end','not_encrypted']);
  ensureNum(req.log_retention_years, 'lry');
  return { platform: req.platform };
}
function encounter_documentation_tele(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.encounter_id, 'eid');
  ensureStr(req.provider, 'prov');
  ensureNum(req.duration_min, 'dur');
  ensureBool(req.documentation_complete, 'dc');
  ensureBool(req.submitted_to_ehr, 'ste');
  ensureBool(req.coding_reviewed, 'cr');
  ensureBool(req.patient_summary_emailed, 'pse');
  return { encounter: req.encounter_id };
}
function billing_tele_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cpt_code, 'cpt', ['99211','99212','99213','99214','99215','99421','99422','99423','G2010','G2012']);
  ensureStr(req.modifier, 'mod');
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.place_of_service, 'pos', ['02','10','11','22','99']);
  ensureBool(req.insurance_billed, 'ib');
  ensureBool(req.copay_collected, 'cc');
  ensureEnum(req.claim_status, 'cs', ['drafted','submitted','accepted','denied','paid','partially_paid','appealed']);
  return { cpt: req.cpt_code };
}
function patient_satisfaction_tele(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.survey_score, 'ss');
  ensureNum(req.nps_score, 'nps');
  ensureBool(req.would_recommend, 'wr');
  ensureStr(req.comments, 'comments');
  ensureNum(req.audio_video_quality, 'avq');
  ensureBool(req.follow_up_satisfaction_planned, 'fusp');
  return { survey: req.survey_score };
}

function funcs() { return { tele_consent_obtained, platform_audit_log, encounter_documentation_tele, billing_tele_visit, patient_satisfaction_tele }; }
module.exports = { funcs, ValidationError };