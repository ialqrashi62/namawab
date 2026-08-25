// filepath: tier134_beh_685_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function screening(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.screen_type, 'st', ['PHQ9','GAD7','AUDIT','DAST','PCL5','EPDS','MDQ','Columbia','other']);
  ensureNum(req.score, 'sc');
  ensureEnum(req.severity, 'sv', ['minimal','mild','moderate','moderately_severe','severe']);
  ensureStr(req.recommendation, 'rec');
  return { screen_id: `scr_${Date.now()}`, patient_id: req.patient_id, type: req.screen_type, score: req.score, severity: req.severity };
}
function counseling(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.modality, 'md', ['CBT','DBT','ACT','EMDR','MI','family','group','individual']);
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.therapist, 'th');
  ensureStr(req.progress, 'pr');
  return { session_id: `cou_${Date.now()}`, patient_id: req.patient_id, modality: req.modality, duration: req.duration_min, therapist: req.therapist };
}
function crisis(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['suicidal_ideation','self_harm','psychosis','panic','aggression','other']);
  ensureEnum(req.severity, 'sv', ['low','moderate','high','imminent']);
  ensureStr(req.intervention, 'iv');
  ensureStr(req.disposition, 'dp');
  return { crisis_id: `crs_${Date.now()}`, patient_id: req.patient_id, type: req.type, severity: req.severity, intervention: req.intervention };
}
function substance(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.substance, 'sb', ['alcohol','opioid','stimulant','cannabis','benzodiazepine','nicotine','polysubstance','other']);
  ensureEnum(req.use_pattern, 'up', ['experimental','social','regular','heavy','dependent']);
  ensureStr(req.treatment_plan, 'tp');
  ensureBool(req.medicated_assisted, 'mat');
  return { substance_id: `sub_${Date.now()}`, patient_id: req.patient_id, substance: req.substance, pattern: req.use_pattern, mat: req.medicated_assisted };
}
function therapy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['individual','group','family','couples','intensive_outpatient','residential']);
  ensureNum(req.sessions_attended, 'sa');
  ensureNum(req.sessions_planned, 'sp');
  ensureEnum(req.progress, 'pg', ['regression','no_change','slow','expected','accelerated','graduated']);
  return { therapy_id: `thr_${Date.now()}`, patient_id: req.patient_id, type: req.type, attended: req.sessions_attended, planned: req.sessions_planned };
}

function funcs() { return { screening, counseling, crisis, substance, therapy }; }
module.exports = { funcs, ValidationError };
