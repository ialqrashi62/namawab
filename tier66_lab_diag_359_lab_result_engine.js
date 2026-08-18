// filepath: tier66_lab_diag_359_lab_result_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function result_entry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_code, 'tc');
  ensureStr(req.result_id, 'rid');
  ensureStr(req.value, 'val');
  ensureStr(req.unit, 'unit');
  ensureStr(req.reference_range, 'rr');
  ensureEnum(req.abnormal_flag, 'af', ['normal','low','high','critical_low','critical_high','abnormal','positive','negative','inconclusive','pending']);
  ensureStr(req.technician, 'tech');
  ensureStr(req.test_performed_at, 'tpa');
  return { test: req.test_code };
}
function critical_result(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_code, 'tc');
  ensureStr(req.value, 'val');
  ensureStr(req.unit, 'unit');
  ensureEnum(req.critical_level, 'cl', ['low','high','critical_low','critical_high','panic_value']);
  ensureStr(req.notified_provider, 'np');
  ensureStr(req.notification_time, 'nt');
  ensureBool(req.read_back_done, 'rbd');
  ensureStr(req.action_taken, 'at');
  return { critical_level: req.critical_level };
}
function result_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.result_id, 'rid');
  ensureStr(req.reviewed_by, 'rev');
  ensureStr(req.reviewed_at, 'ra');
  ensureStr(req.comments, 'comm');
  ensureBool(req.sign_off, 'so');
  ensureNum(req.revision_count, 'rc');
  ensureEnum(req.report_status, 'rs', ['preliminary','final','corrected','amended','cancelled','pending_review','reviewed','signed_off']);
  return { status: req.report_status };
}
function result_correction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.result_id, 'rid');
  ensureStr(req.original_value, 'ov');
  ensureStr(req.corrected_value, 'cv');
  ensureEnum(req.correction_reason, 'rsn', ['transcription_error','instrument_error','sample_condition','reagent_issue','clinical_correction','patient_mismatch','time_correction','mislabel','otherm','lab_procedure']);
  ensureStr(req.corrected_by, 'cb');
  ensureStr(req.corrected_at, 'ca');
  ensureBool(req.amended_report, 'ar');
  return { correction: req.correction_reason };
}
function result_release(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.result_id, 'rid');
  ensureStr(req.released_by, 'rb');
  ensureStr(req.released_at, 'ra');
  ensureStr(req.released_to, 'rt');
  ensureEnum(req.method, 'method', ['lab_ehr','printed','fax','phone','portal','secure_email','hand_delivery','lab_pickup','released_to_patient']);
  ensureBool(req.patient_notified, 'pn');
  ensureEnum(req.report_status, 'rs', ['preliminary','final','corrected','amended','cancelled','pending_review','reviewed','signed_off','final_released','final_released_to_patient','final_released_to_provider']);
  return { status: req.report_status };
}

function funcs() { return { result_entry, critical_result, result_review, result_correction, result_release }; }
module.exports = { funcs, ValidationError };