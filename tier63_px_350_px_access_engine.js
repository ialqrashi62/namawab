// filepath: tier63_px_350_px_access_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function patient_self_registration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.registration_method, 'rm', ['mobile_app','web','phone','in_person','kiosk','ipad','paper']);
  ensureEnum(req.identity_verified, 'iv', ['passport','national_id','drivers_license','insurance_card','biometric','photo_selfie','two_factor']);
  ensureBool(req.email_verified, 'ev');
  ensureBool(req.phone_verified, 'pv');
  ensureBool(req.address_verified, 'av');
  ensureBool(req.insurance_card_uploaded, 'icu');
  ensureBool(req.consent_signed, 'cs');
  ensureNum(req.completion_time_min, 'ctm');
  return { method: req.registration_method };
}
function patient_portal_access(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.access_method, 'am', ['web','mobile_app','phone','kiosk','tablet','voice_assistant']);
  ensureNum(req.login_count_30d, 'lc30');
  ensureBool(req.mfa_enabled, 'me');
  ensureStr(req.last_login, 'll');
  ensureStr(req.permissions_granted, 'pg');
  ensureEnum(req.privacy_settings, 'ps', ['strict','moderate','open','custom','default']);
  ensureEnum(req.accessibility_features, 'af', ['large_text','screen_reader','high_contrast','voice_navigation','none','multiple']);
  return { method: req.access_method };
}
function patient_mobile_app(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.app_version, 'av');
  ensureEnum(req.os, 'os', ['ios','android','harmonyos','windows','macos','web']);
  ensureStr(req.device, 'dev');
  ensureBool(req.push_notifications_enabled, 'pne');
  ensureBool(req.biometric_login, 'bl');
  ensureStr(req.features_used, 'fu');
  ensureNum(req.app_rating, 'ar');
  ensureNum(req.app_crashes, 'ac');
  return { version: req.app_version };
}
function patient_waitlist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specialty, 'spec');
  ensureEnum(req.priority, 'pri', ['routine','urgent','expedited','urgent_cancer','pediatric','work_injury']);
  ensureStr(req.added_date, 'ad');
  ensureNum(req.days_waiting, 'dw');
  ensureNum(req.offered_appointment, 'oa');
  ensureStr(req.declined_reason, 'dr');
  ensureEnum(req.status, 'st', ['actively_waiting','offered_accepted','offered_declined','removed','seen','completed','died_left']);
  ensureStr(req.estimated_offer, 'eo');
  return { priority: req.priority };
}
function patient_referral_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'ri');
  ensureStr(req.specialty, 'spec');
  ensureStr(req.referral_date, 'rd');
  ensureBool(req.specialist_accepted, 'sa');
  ensureStr(req.appointment_date, 'apd');
  ensureBool(req.visit_completed, 'vc');
  ensureNum(req.visit_satisfaction, 'vs');
  ensureBool(req.closed, 'closed');
  return { referral: req.referral_id };
}

function funcs() { return { patient_self_registration, patient_portal_access, patient_mobile_app, patient_waitlist, patient_referral_tracking }; }
module.exports = { funcs, ValidationError };