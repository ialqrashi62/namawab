// filepath: tier70_img_diag_380_img_admin_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function image_ordering(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.order_id, 'oid');
  ensureStr(req.study, 'study');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.priority, 'pri', ['routine','urgent','stat','emergent','scheduled','follow_up','today','asap','urgent_inpatient','other']);
  ensureStr(req.clinical_question, 'cq');
  ensureBool(req.insurance_auth_required, 'iar');
  ensureBool(req.insurance_obtained, 'io');
  ensureStr(req.ordering_provider, 'op');
  ensureBool(req.appropriate_use_criteria_met, 'aucm');
  return { order: req.order_id };
}
function scheduling_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.schedule_id, 'sid');
  ensureStr(req.appointment_time, 'at');
  ensureEnum(req.modality, 'mod', ['ct','mri','xray','ultrasound','mammo','flouro','nuclear_med','pet_ct','dexa','interventional','echo','angio','other']);
  ensureStr(req.prep_instructions, 'pi');
  ensureBool(req.reminder_sent, 'rs');
  ensureEnum(req.arrival_status, 'as', ['on_time','late','early','no_show','cancelled','rescheduled','arrived','no_show_rescheduled','left_before_complete','left_ama']);
  ensureStr(req.tech_id, 'tid');
  ensureStr(req.patient_id_field, 'pif');
  ensureBool(req.cancelled, 'canc');
  return { schedule: req.schedule_id };
}
function image_archive(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.archive_status, 'as', ['archived','pending','failed','retrieving','purged','deleted','migrated','archived_offline','in_archival_process','remotely_stored','other']);
  ensureEnum(req.archive_system, 'sys', ['PACS','VNA','DICOM','cloud_archive','vendor_archive','hybrid','centera','other']);
  ensureNum(req.retention_years, 'ry');
  ensureEnum(req.storage_tier, 'tier', ['hot','warm','cold','archive','deep_archive','nearline','offline','cloud','other']);
  ensureBool(req.migrated_to_cloud, 'mc');
  ensureBool(req.dicom_compliant, 'dc');
  ensureBool(req.purged, 'purged');
  ensureEnum(req.compliance_check, 'cc', ['passed','failed','pending','remediation','partial','other']);
  return { study: req.study_id };
}
function image_share(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureStr(req.shared_with, 'sw');
  ensureEnum(req.share_method, 'sm', ['secure_email','cd_burn','external_network','direct_dicom','life_image','ambra','pacs_link','uploaded_to_external','shared_drive','ftp','other']);
  ensureBool(req.recipient_verified, 'rv');
  ensureBool(req.consent_obtained, 'co');
  ensureBool(req.hipaa_compliant, 'hc');
  ensureBool(req.sharing_logged, 'sl');
  ensureNum(req.access_limit_days, 'ald');
  ensureEnum(req.audit_trail, 'at', ['complete','partial','incomplete','pending','remediation','failed','other']);
  return { shared_with: req.shared_with };
}
function image_quality_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.quality_issues, 'qi', ['none','motion','misorientation','wrong_kvp','wrong_ma','wrong_positioning','artifact','truncation','collision','underexposure','overexposure','other','multiple_issues']);
  ensureBool(req.repeat_required, 'rr');
  ensureNum(req.artifact_score, 'as');
  ensureBool(req.quality_reviewed, 'qr');
  ensureStr(req.reviewer, 'rev');
  ensureEnum(req.action_taken, 'at', ['none','repeat','rescan','supplemental','defer_to_interpretation','refer_quality_team','discontinued','other']);
  ensureBool(req.audit_trail_complete, 'atc');
  ensureNum(req.quality_score, 'qs');
  return { qi: req.quality_issues };
}

function funcs() { return { image_ordering, scheduling_imaging, image_archive, image_share, image_quality_check }; }
module.exports = { funcs, ValidationError };