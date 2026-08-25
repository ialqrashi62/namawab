// filepath: tier17_portal_ext_118_records_engine.js
// TIER17_PORTAL_EXT-118: Patient portal records access (lab/rad/visit/summary)
'use strict';

const CITATIONS = ['ONC_CCDS_2024','HIPAA_RTB_2024','HL7_FHIR_USCORE_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function portal_lab_results(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.test_class, 'test_class', ['cbc','bmp','cmp','lipid','tsh','hba1c','urinalysis','microbiology','pathology','covid','imaging_blood','other']);
  ensureBool(req.abnormal_flag, 'abnormal_flag');
  ensureEnum(req.critical_value, 'critical_value', ['none','critical_high','critical_low','panic_value','life_threatening','other']);
  ensureBool(req.provider_review_required, 'provider_review_required');
  ensureNumber(req.release_delay_hours, 'release_delay_hours');
  ensureEnum(req.release_status, 'release_status', ['immediate','delayed_24h','delayed_72h','provider_hold','patient_requested_hold','released','other']);

  let status;
  if (req.critical_value !== 'none' && req.release_status === 'immediate') status = 'critical_value_immediate_release_review';
  else if (!req.provider_review_required && req.abnormal_flag) status = 'abnormal_provider_review_required';
  else if (req.release_status === 'provider_hold') status = 'provider_hold_not_released';
  else status = 'lab_results_released';
  return { status, test: req.test_class };
}

function portal_radiology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.study_type, 'study_type', ['xray','ct','mri','ultrasound','mammogram','nuclear','fluoroscopy','interventional','pet','other']);
  ensureBool(req.report_signed, 'report_signed');
  ensureBool(req.report_final, 'report_final');
  ensureEnum(req.release_status, 'release_status', ['immediate','delayed_provider_review','patient_requested_delay','released','redacted','other']);
  ensureBool(req.sensitive_finding, 'sensitive_finding');
  ensureBool(req.addendum_present, 'addendum_present');

  let status;
  if (!req.report_final) status = 'report_preliminary_hold';
  else if (!req.report_signed) status = 'report_unsigned_hold';
  else if (req.sensitive_finding && req.release_status === 'immediate') status = 'sensitive_finding_provider_review_first';
  else if (req.addendum_present && req.release_status === 'released') status = 'addendum_present_re_release_required';
  else status = 'radiology_released';
  return { status, study: req.study_type };
}

function portal_visit_summary(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.encounter_id, 'encounter_id');
  ensureBool(req.ccda_generated, 'ccda_generated');
  ensureBool(req.ccda_signed, 'ccda_signed');
  ensureNumber(req.visit_lag_days, 'visit_lag_days');
  ensureEnum(req.visit_type, 'visit_type', ['inpatient','ed','outpatient','telehealth','observation','procedure','other']);
  ensureBool(req.patient_education_attached, 'education_attached');

  let status;
  if (!req.ccda_generated) status = 'ccda_generation_required';
  else if (!req.ccda_signed) status = 'ccda_signing_required';
  else if (req.visit_lag_days > 1 && req.visit_type !== 'outpatient') status = 'visit_lag_over_24h_inpatient_ed';
  else if (!req.patient_education_attached) status = 'education_attached_required';
  else status = 'visit_summary_released';
  return { status, type: req.visit_type };
}

function portal_medications(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.list_type, 'list_type', ['active','historical','discontinued','all','other']);
  ensureBool(req.reconciled_with_provider, 'reconciled_with_provider');
  ensureBool(req.prescriber_verified, 'prescriber_verified');
  ensureBool(req.dose_verified, 'dose_verified');
  ensureNumber(req.medication_count, 'medication_count');

  let status;
  if (!req.prescriber_verified && req.list_type === 'active') status = 'active_meds_prescriber_verify_required';
  else if (!req.dose_verified) status = 'dose_verification_required';
  else if (!req.reconciled_with_provider) status = 'med_reconciliation_review';
  else status = 'medications_released';
  return { status, list: req.list_type };
}

function portal_immunization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.vaccine_status, 'vaccine_status', ['current','overdue','due_soon','declined','medical_exemption','religious_exemption','unknown','other']);
  ensureBool(req.forecast_generated, 'forecast_generated');
  ensureNumber(req.days_until_next_due, 'days_until_next_due');
  ensureEnum(req.vaccine_class, 'vaccine_class', ['covid','flu','mmr','tdap','hpv','hep_b','varicella','pneumococcal','shingles','other']);

  let status;
  if (req.vaccine_status === 'overdue') status = 'overdue_schedule_review';
  else if (req.vaccine_status === 'due_soon' && req.days_until_next_due < 30) status = 'due_in_30_days_remind';
  else if (!req.forecast_generated) status = 'forecast_generation_required';
  else status = 'immunization_released';
  return { status, status_name: req.vaccine_status };
}

function funcs() { return { portal_lab_results, portal_radiology, portal_visit_summary, portal_medications, portal_immunization }; }
module.exports = { funcs, CITATIONS, ValidationError };