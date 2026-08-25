// filepath: tier45_icu_ext_258_icu_vent_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ards(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.pao2_fio2, 'pf');
  ensureNum(req.fio2, 'fio2');
  ensureNum(req.peep, 'peep');
  ensureNum(req.tidal_volume, 'tv');
  ensureBool(req.prone_positioning, 'prone');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe']);
  ensureEnum(req.mortality_risk, 'mr', ['low','moderate','high','very_high']);
  return { severity: req.severity, mortality_risk: req.mortality_risk };
}
function weaning_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.rsbi, 'rsbi');
  ensureNum(req.oxygen_sat, 'spo2');
  ensureNum(req.fio2, 'fio2');
  ensureNum(req.peep, 'peep');
  ensureEnum(req.mental_status, 'ms', ['alert_responsive','confused','obtunded','comatose']);
  ensureEnum(req.trial_outcome, 'to', ['pass_extubate','fail_reintubate','wean_continue']);
  return { rsbi: req.rsbi, outcome: req.trial_outcome };
}
function prone_ventilation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.pao2_fio2, 'pf');
  ensureNum(req.duration_hours, 'dur');
  ensureEnum(req.response, 'resp', ['improvement','stable','worsening']);
  ensureStr(req.complications, 'comp');
  ensureBool(req.sessions_planned, 'planned');
  return { response: req.response, sessions: req.sessions_planned };
}
function ecmo_evaluation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age, 'age');
  ensureStr(req.comorbidities, 'comp');
  ensureNum(req.pao2_fio2, 'pf');
  ensureBool(req.rescue_therapy, 'rescue');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.outcome, 'out', ['candidate_yes','candidate_no','declined','contraindicated']);
  return { candidate: req.outcome, indication: req.indication };
}
function ventilator_associated_pneumonia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.cpis_score, 'cpis');
  ensureStr(req.secretions, 'sec');
  ensureStr(req.culture, 'cx');
  ensureStr(req.antibiotics, 'abx');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening']);
  return { cpis: req.cpis_score, response: req.response };
}

function funcs() { return { ards, weaning_protocol, prone_ventilation, ecmo_evaluation, ventilator_associated_pneumonia }; }
module.exports = { funcs, ValidationError };