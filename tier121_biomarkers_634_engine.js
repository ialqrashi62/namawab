// filepath: tier121_biomarkers_634_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tumor_marker(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.marker_id, 'mid');
  ensureStr(req.marker, 'marker');
  ensureNum(req.value_ng_ml, 'vn');
  ensureStr(req.reference_range, 'rr');
  ensureEnum(req.trending, 'tr', ['rising','falling','stable','unknown']);
  ensureStr(req.provider, 'pr');
  return { mid: req.marker_id };
}
function cardiac_biomarker(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.marker_id, 'mid');
  ensureStr(req.marker, 'marker');
  ensureNum(req.value_ng_ml, 'vn');
  ensureStr(req.time_point, 'tp');
  ensureEnum(req.interpretation, 'it', ['normal','mild_elevation','moderate_elevation','severe_elevation','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { mid: req.marker_id };
}
function inflammatory_marker(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.marker_id, 'mid');
  ensureStr(req.marker, 'marker');
  ensureNum(req.value_mg_l, 'vml');
  ensureEnum(req.severity, 'sev', ['normal','mild','moderate','severe','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { mid: req.marker_id };
}
function infectious_marker(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.marker_id, 'mid');
  ensureStr(req.marker, 'marker');
  ensureNum(req.value_ng_ml, 'vn');
  ensureEnum(req.interpretation, 'it', ['viral_likely','bacterial_likely','indeterminate','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { mid: req.marker_id };
}
function allergy_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureNum(req.allergen_count, 'ac');
  ensureNum(req.positive_count, 'pc');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}

function funcs() { return { tumor_marker, cardiac_biomarker, inflammatory_marker, infectious_marker, allergy_panel }; }
module.exports = { funcs, ValidationError };