// filepath: tier54_emergency_ext_304_er_cardio_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function acs_emergent(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.presentation, 'pres', ['stemi_anterior','stemi_inferior','stemi_lateral','nstemi','unstable_angina']);
  ensureNum(req.door_to_balloon_min, 'dtb');
  ensureStr(req.culprit, 'cul');
  ensureNum(req.ef_percent_post, 'ef');
  ensureStr(req.outcome, 'out');
  ensureStr(req.arrhythmia_complication, 'arr');
  return { presentation: req.presentation };
}
function arrhythmia_emergent(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.rhythm, 'rh', ['vt_unstable','vfib','svt_unstable','afib_rvr_unstable','polymorphic_vt','torsades']);
  ensureNum(req.rate, 'rate');
  ensureStr(req.hemodynamic, 'hd');
  ensureStr(req.intervention, 'int');
  ensureBool(req.success, 'succ');
  ensureStr(req.follow_up, 'fu');
  return { rhythm: req.rhythm };
}
function aortic_dissection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['stanford_a','stanford_b','debakey_1','debakey_2','debakey_3','intramural_hematoma','penetrating_ulcer']);
  ensureStr(req.site, 'site');
  ensureStr(req.ct_angio, 'cx');
  ensureStr(req.surgery, 'surg');
  ensureStr(req.complications, 'comp');
  ensureEnum(req.mortality_risk, 'mr', ['low','moderate','high','very_high']);
  return { type: req.type };
}
function pericarditis_tamponade(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.etiology, 'eti');
  ensureStr(req.pericardiocentesis, 'pc');
  ensureNum(req.fluid_volume_ml, 'fv');
  ensureBool(req.hemodynamics_restored, 'hr');
  ensureStr(req.follow_up, 'fu');
  return { fluid: req.fluid_volume_ml };
}
function pe_massive(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.risk_class, 'rc', ['massive','submassive','intermediate_low_risk','low_risk']);
  ensureStr(req.thrombolysis, 'tl');
  ensureStr(req.surgical_embolectomy, 'se');
  ensureBool(req.icu_admission, 'icu');
  ensureStr(req.outcome, 'out');
  return { risk: req.risk_class };
}

function funcs() { return { acs_emergent, arrhythmia_emergent, aortic_dissection, pericarditis_tamponade, pe_massive }; }
module.exports = { funcs, ValidationError };