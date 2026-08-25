// filepath: tier50_cardiology_ext_285_card_valve_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function aortic_stenosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','critical']);
  ensureNum(req.mean_gradient_mmhg, 'mg');
  ensureNum(req.valve_area_cm2, 'va');
  ensureNum(req.ef_percent, 'ef');
  ensureEnum(req.symptoms, 'sx', ['asymptomatic','symptomatic']);
  ensureStr(req.intervention, 'int');
  return { severity: req.severity, intervention: req.intervention };
}
function mitral_regurg(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','massive']);
  ensureEnum(req.etiology, 'eti', ['degenerative','functional','rheumatic','endocarditis','congenital','acute']);
  ensureNum(req.ef_percent, 'ef');
  ensureNum(req.lvesd_mm, 'lvesd');
  ensureEnum(req.symptoms, 'sx', ['asymptomatic','symptomatic']);
  ensureStr(req.intervention, 'int');
  return { severity: req.severity, intervention: req.intervention };
}
function tricuspid_regurg(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','massive','torrential']);
  ensureEnum(req.etiology, 'eti', ['functional_annular_dilation','leaflet_prolapse','trauma','endocarditis','catheter_induced','rheumatic']);
  ensureStr(req.symptoms, 'sx');
  ensureStr(req.intervention, 'int');
  return { severity: req.severity };
}
function pulmonary_stenosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','critical']);
  ensureNum(req.peak_gradient_mmhg, 'pg');
  ensureNum(req.valve_area_cm2, 'va');
  ensureEnum(req.symptoms, 'sx', ['asymptomatic','symptomatic']);
  ensureStr(req.intervention, 'int');
  return { severity: req.severity };
}
function prosthetic_valve(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.valve_type, 'vt', ['mechanical_bileaflet','mechanical_tilting_disc','bioprosthetic_sutureless','bioprosthetic_porcine','bioprosthetic_pericardial']);
  ensureStr(req.position, 'pos');
  ensureStr(req.anticoagulation, 'ac');
  ensureStr(req.complications, 'comp');
  ensureNum(req.follow_up, 'fu');
  return { valve_type: req.valve_type, position: req.position };
}

function funcs() { return { aortic_stenosis, mitral_regurg, tricuspid_regurg, pulmonary_stenosis, prosthetic_valve }; }
module.exports = { funcs, ValidationError };