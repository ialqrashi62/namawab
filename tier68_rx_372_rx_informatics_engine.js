// filepath: tier68_rx_372_rx_informatics_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function smart_pump_library(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pump_id, 'pid');
  ensureStr(req.library_version, 'lv');
  ensureStr(req.drug_entry, 'de');
  ensureBool(req.library_entry_reviewed, 'ler');
  ensureBool(req.hard_limit_correct, 'hlc');
  ensureBool(req.soft_limit_correct, 'slc');
  ensureBool(req.libraries_up_to_date, 'lud');
  ensureStr(req.review_due, 'rd');
  ensureStr(req.updated_by, 'ub');
  return { pump: req.pump_id };
}
function drug_shortage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.shortage_id, 'sid');
  ensureStr(req.drug, 'drug');
  ensureNum(req.current_supply_days, 'csd');
  ensureStr(req.alternative, 'alt');
  ensureBool(req.substitution_approved, 'sa');
  ensureStr(req.requested_by, 'rb');
  ensureBool(req.alternate_strength_available, 'asa');
  ensureStr(req.expected_resupply, 'er');
  ensureEnum(req.impact, 'imp', ['low','moderate','high','critical','no_impact','resolved','other']);
  return { drug: req.drug };
}
function recalls(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.recall_id, 'rid');
  ensureStr(req.drug, 'drug');
  ensureStr(req.lot_number, 'ln');
  ensureStr(req.manufacturer, 'mfr');
  ensureEnum(req.recall_class, 'rc', ['class_I','class_II','class_III','class_I_serious','class_II_med','class_III_minor','other']);
  ensureEnum(req.action_taken, 'at', ['remove_from_stock','quarantine','return_to_vendor','notify_patients','recall_completed','investigation','replace','discard','other']);
  ensureNum(req.patients_affected, 'pa');
  ensureBool(req.patient_notifications_sent, 'pns');
  ensureStr(req.fda_link, 'fda');
  ensureBool(req.audit_complete, 'ac');
  return { recall: req.recall_id };
}
function clinical_decision_alerts(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureEnum(req.trigger, 'trig', ['drug_allergy','drug_interaction','duplicate_therapy','dose_check','renal_dose','hepatic_dose','drug_pregnancy','drug_lactation','drug_age','polypharmacy','high_risk_med','other']);
  ensureEnum(req.severity, 'sev', ['low','moderate','major','contraindicated','life_threatening','critical','fatal','other']);
  ensureEnum(req.override_reason, 'or', ['clinical_justified','patient_already_on','provider_acknowledged','dose_appropriate','risk_benefit','no_alternative','other','not_applicable','no_action_required']);
  ensureBool(req.provider_acknowledged, 'pa');
  ensureEnum(req.audit_log, 'al', ['complete','partial','incomplete','pending','other']);
  ensureNum(req.alert_fatigue_score, 'afs');
  ensureBool(req.system_updated, 'su');
  ensureBool(req.follow_up_required, 'fur');
  return { alert: req.alert_id };
}
function drug_information_query(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.query_id, 'qid');
  ensureStr(req.question, 'q');
  ensureStr(req.response_summary, 'rs');
  ensureStr(req.references, 'refs');
  ensureStr(req.responder, 'rsp');
  ensureStr(req.query_time, 'qt');
  ensureEnum(req.response_grade, 'rg', ['brief','standard','comprehensive','excellent','unanswered','inadequate','pending','other']);
  ensureBool(req.shareable, 'sh');
  return { q: req.question };
}

function funcs() { return { smart_pump_library, drug_shortage, recalls, clinical_decision_alerts, drug_information_query }; }
module.exports = { funcs, ValidationError };