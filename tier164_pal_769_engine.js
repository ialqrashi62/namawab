// filepath: tier164_pal_769_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pain_mgmt_pal(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.pain_type, 'pt', ['nociceptive','neuropathic','mixed','bone','visceral','NA']);
  ensureNum(req.pain_score, 'ps'); ensureNum(req.pain_duration_days, 'pd');
  ensureEnum(req.treatment, 'tr', ['none','NSAID','weak_opioid','strong_opioid','adjuvant','combination','NA']);
  ensureNum(req.morphine_equiv_mg, 'me'); ensureNum(req.improvement_pct, 'ip');
  ensureBool(req.side_effects, 'se'); ensureEnum(req.disposition, 'di', ['home','hospice','inpatient','NA']);
  ensureStr(req.provider, 'pr');
  return { pm_id: `pm_${Date.now()}`, patient_id: req.patient_id, pain: req.pain_score, me: req.morphine_equiv_mg };
}

function dyspnea(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.rr, 'rr');
  ensureNum(req.spo2, 'sp'); ensureEnum(req.cause, 'cs', ['cancer','COPD','CHF','ILD','pleural_effusion','pneumonia','NA']);
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','NA']);
  ensureBool(req.opioids_given, 'og'); ensureBool(req.oxygen_used, 'ou');
  ensureNum(req.vas_score, 'vs'); ensureEnum(req.disposition, 'di', ['home','hospice','inpatient','NA']);
  ensureStr(req.provider, 'pr');
  return { dy_id: `dy_${Date.now()}`, patient_id: req.patient_id, severity: req.severity, disp: req.disposition };
}

function delirium_pal(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['hyperactive','hypoactive','mixed','NA']);
  ensureNum(req.cam_score, 'cs'); ensureEnum(req.cause, 'ca', ['metabolic','infection','medication','pain','other','unknown','NA']);
  ensureBool(req.reversible, 'rv'); ensureEnum(req.treatment, 'tr', ['correct_cause','haloperidol','olanzapine','quetiapine','benzodiazepine','NA']);
  ensureNum(req.improvement_days, 'id'); ensureEnum(req.outcome, 'ot', ['resolved','partial','persistent','death','NA']);
  ensureStr(req.provider, 'pr');
  return { dl_id: `dl_${Date.now()}`, patient_id: req.patient_id, type: req.type, outcome: req.outcome };
}

function hospice_intake(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.diagnosis, 'dx', ['cancer','CHF','COPD','dementia','HIV','ALS','renal','NA']);
  ensureNum(req.prognosis_months, 'pm'); ensureBool(req.consent, 'cn');
  ensureBool(req.advance_directive, 'ad'); ensureEnum(req.code_status, 'cs', ['full','DNR','DNI','comfort','NA']);
  ensureEnum(req.setting, 'se', ['home','inpatient','nursing_home','combined','NA']);
  ensureNum(req.karnofsky_score, 'ks'); ensureStr(req.provider, 'pr');
  return { hi_id: `hi_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, karnofsky: req.karnofsky_score };
}

function bereavement(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.relationship, 'rs', ['spouse','child','parent','sibling','friend','other','NA']);
  ensureNum(req.time_since_death_days, 'td'); ensureNum(req.grief_score, 'gs');
  ensureEnum(req.stage, 'st', ['denial','anger','bargaining','depression','acceptance','NA']);
  ensureBool(req.professional_help, 'ph'); ensureNum(req.support_count, 'sc');
  ensureEnum(req.risk, 'rk', ['low','moderate','high','severe','NA']);
  ensureBool(req.followup_needed, 'fn'); ensureStr(req.provider, 'pr');
  return { bv_id: `bv_${Date.now()}`, patient_id: req.patient_id, stage: req.stage, risk: req.risk };
}

function funcs() { return { pain_mgmt_pal, dyspnea, delirium_pal, hospice_intake, bereavement }; }
module.exports = { funcs, ValidationError };