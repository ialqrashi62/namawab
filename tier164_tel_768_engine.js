// filepath: tier164_tel_768_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function remote_consult(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.platform, 'pl', ['zoom','teams','webex','phone','other','NA']);
  ensureNum(req.duration_min, 'du'); ensureEnum(req.presenting_complaint, 'pc', ['sore_throat','fever','cough','rash','pain','other','NA']);
  ensureEnum(req.physical_exam, 'pe', ['limited','moderate','comprehensive','NA']);
  ensureEnum(req.differential, 'di', ['viral','bacterial','allergic','idiopathic','other','NA']);
  ensureEnum(req.diagnosis, 'dx', ['viral_pharyngitis','strep','allergic_rhinitis','urticaria','musculoskeletal','other','NA']);
  ensureEnum(req.treatment, 'tr', ['none','supportive','antibiotic','topical','referral','NA']);
  ensureNum(req.follow_up_days, 'fu'); ensureNum(req.patient_satisfaction, 'ps');
  ensureStr(req.provider, 'pr');
  return { rc_id: `rc_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, sat: req.patient_satisfaction };
}

function telehealth_followup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.condition, 'co', ['HTN','DM','CHF','COPD','depression','other','NA']);
  ensureNum(req.bp_baseline, 'bb'); ensureNum(req.bp_current, 'bc');
  ensureNum(req.medication_changes, 'mc'); ensureNum(req.adherence_pct, 'ad');
  ensureNum(req.days_since_last, 'dl'); ensureEnum(req.outcome, 'ot', ['improved','stable','worsened','NA']);
  ensureNum(req.next_visit_days, 'nv'); ensureStr(req.provider, 'pr');
  return { tf_id: `tf_${Date.now()}`, patient_id: req.patient_id, bp_drop: req.bp_baseline - req.bp_current, outcome: req.outcome };
}

function e_prescription(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.drug, 'dr', ['amoxicillin','lisinopril','metformin','aspirin','albuterol','other','NA']);
  ensureNum(req.dose, 'ds'); ensureEnum(req.frequency, 'fq', ['qd','bid','tid','qid','prn','NA']);
  ensureNum(req.duration_days, 'du'); ensureNum(req.refills, 'rf');
  ensureEnum(req.pharmacy_selected, 'ps', ['local','chain','mail_order','NA']);
  ensureBool(req.drug_interaction, 'di'); ensureBool(req.sent, 'sn');
  ensureStr(req.provider, 'pr');
  return { ep_id: `ep_${Date.now()}`, patient_id: req.patient_id, drug: req.drug, refills: req.refills };
}

function store_forward(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.image_type, 'it', ['derm','fundus','radiology','pathology','wound','other','NA']);
  ensureNum(req.image_count, 'ic'); ensureStr(req.attached_text, 'at');
  ensureEnum(req.specialty, 'sp', ['derm','opthal','radiology','pathology','other','NA']);
  ensureNum(req.response_hr, 'rh'); ensureEnum(req.diagnosis, 'dx', ['contact_dermatitis','nevus','ARMD','fracture','benign','other','NA']);
  ensureEnum(req.treatment, 'tr', ['none','topical_steroid','referral','biopsy','observation','NA']);
  ensureStr(req.provider, 'pr');
  return { sf_id: `sf_${Date.now()}`, patient_id: req.patient_id, type: req.image_type, dx: req.diagnosis };
}

function virtual_triage(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.chief_complaint, 'cc', ['chest_pain','shortness_breath','abdominal_pain','headache','fever','other','NA']);
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','NA']);
  ensureNum(req.risk_score, 'rs'); ensureNum(req.sys_bp, 'sb');
  ensureNum(req.dia_bp, 'db'); ensureNum(req.spo2, 'sp');
  ensureEnum(req.disposition, 'di', ['home','urgent_refer','ED','specialist','NA']);
  ensureNum(req.timeframe_min, 'tf'); ensureStr(req.provider, 'pr');
  return { vt_id: `vt_${Date.now()}`, patient_id: req.patient_id, severity: req.severity, disp: req.disposition };
}

function funcs() { return { remote_consult, telehealth_followup, e_prescription, store_forward, virtual_triage }; }
module.exports = { funcs, ValidationError };