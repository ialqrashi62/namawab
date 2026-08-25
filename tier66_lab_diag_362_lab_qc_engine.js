// filepath: tier66_lab_diag_362_lab_qc_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function calibration_verification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.analyzer_id, 'aid');
  ensureStr(req.analyte, 'an');
  ensureNum(req.target_value, 'tv');
  ensureNum(req.measured_value, 'mv');
  ensureNum(req.tolerance_pct, 'tp');
  ensureBool(req.passing, 'pass');
  ensureStr(req.verified_by, 'vb');
  ensureEnum(req.frequency, 'freq', ['daily','weekly','biweekly','monthly','quarterly','semi_annual','annual','after_maintenance','after_calibration','on_demand','continuously','shift']);
  return { analyte: req.analyte };
}
function quality_control(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.control_id, 'cid');
  ensureEnum(req.level, 'lvl', ['low','normal','high','critical_low','critical_high','abnormal','multi_level','negative','positive','positive_low','positive_high','blank','other']);
  ensureStr(req.analyte, 'an');
  ensureStr(req.target_range, 'tr');
  ensureNum(req.measured_value, 'mv');
  ensureBool(req.in_range, 'ir');
  ensureEnum(req.levey_jennings, 'lj', ['within_1sd','within_2sd','within_3sd','outside_2sd','outside_3sd','trend','shift','violation','insufficient_data']);
  ensureStr(req.reviewed_by, 'rev');
  return { level: req.level };
}
function proficiency_testing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pt_id, 'ptid');
  ensureStr(req.challenge, 'chal');
  ensureStr(req.sample_id, 'sid');
  ensureNum(req.target_value, 'tv');
  ensureNum(req.reported_value, 'rv');
  ensureBool(req.passing, 'pass');
  ensureEnum(req.grading, 'gr', ['satisfactory','unsatisfactory','acceptable','unacceptable','conditional','pending','graded','not_graded','exemption','other']);
  ensureStr(req.submitted_by, 'sb');
  return { pt: req.pt_id };
}
function equipment_maintenance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.equipment_id, 'eid');
  ensureEnum(req.maintenance_type, 'mt', ['preventive','corrective','predictive','routine','emergency','calibration','scheduled','unscheduled','on_demand','commissioning','qualification','decommissioning']);
  ensureStr(req.date, 'date');
  ensureStr(req.technician, 'tech');
  ensureStr(req.next_due, 'nd');
  ensureStr(req.parts_replaced, 'pr');
  ensureNum(req.downtime_hours, 'dh');
  ensureEnum(req.status, 'st', ['operational','needs_repair','out_of_service','decommissioned','retired','standby','under_maintenance','qualified','not_qualified']);
  return { equipment: req.equipment_id };
}
function method_validation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.method_id, 'mid');
  ensureStr(req.method_name, 'mn');
  ensureNum(req.precision_cv_pct, 'pcv');
  ensureNum(req.accuracy_bias_pct, 'abp');
  ensureNum(req.linearity_r2, 'lr2');
  ensureStr(req.reportable_range, 'rr');
  ensureEnum(req.validation_status, 'vs', ['approved','pending','in_review','rejected','suspended','expired','completed','provisional','terminated']);
  ensureStr(req.reviewer, 'rev');
  return { method: req.method_name };
}

function funcs() { return { calibration_verification, quality_control, proficiency_testing, equipment_maintenance, method_validation }; }
module.exports = { funcs, ValidationError };