// filepath: tier94_pulm_function_493_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function spirometry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureNum(req.fev1, 'fev1');
  ensureNum(req.fev1_pred, 'fev1p');
  ensureNum(req.fvc, 'fvc');
  ensureNum(req.fvc_pred, 'fvcp');
  ensureNum(req.fev1_fvc, 'ffc');
  ensureNum(req.peak_flow, 'pf');
  ensureNum(req.bronchodilator_response, 'bdr');
  ensureEnum(req.pattern, 'pat', ['normal','obstructive','restrictive','mixed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function lung_volumes(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureNum(req.tlc, 'tlc');
  ensureNum(req.tlc_pred, 'tlcp');
  ensureNum(req.rv, 'rv');
  ensureNum(req.rv_pred, 'rvp');
  ensureNum(req.frc, 'frc');
  ensureNum(req.frc_pred, 'frcp');
  ensureNum(req.rv_tlc, 'rvt');
  ensureEnum(req.pattern, 'pat', ['normal','hyperinflation','restriction','mixed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function dlco(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureNum(req.dlco, 'dlco');
  ensureNum(req.dlco_pred, 'dlcop');
  ensureNum(req.kco, 'kco');
  ensureNum(req.kco_pred, 'kcop');
  ensureEnum(req.severity, 'sev', ['normal','mild','moderate','severe','very_severe','unknown','other']);
  ensureEnum(req.cause, 'cau', ['emphysema','interstitial','pulmonary_vascular','anemia','smoking','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function six_min_walk(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureNum(req.distance_meters, 'dm');
  ensureNum(req.baseline_spo2, 'bso2');
  ensureNum(req.nadir_spo2, 'nsp');
  ensureNum(req.distance_pred, 'dp');
  ensureBool(req.desaturation, 'des');
  ensureBool(req.stopped_early, 'se');
  ensureNum(req.dyspnea_borg, 'db');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function mip_mep(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureNum(req.mip_cmH2o, 'mip');
  ensureNum(req.mip_normal, 'min');
  ensureNum(req.mep_cmH2o, 'mep');
  ensureNum(req.mep_normal, 'men');
  ensureNum(req.sniff_test, 'st');
  ensureNum(req.cough_pressure, 'cp');
  ensureEnum(req.weakness_pattern, 'wp', ['diaphragm','intercostals','combined','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}

function funcs() { return { spirometry, lung_volumes, dlco, six_min_walk, mip_mep }; }
module.exports = { funcs, ValidationError };
