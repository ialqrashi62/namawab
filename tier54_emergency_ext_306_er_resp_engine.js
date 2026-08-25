// filepath: tier54_emergency_ext_306_er_resp_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function respiratory_failure_emergent(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['hypercapnic','hypoxic','mixed','peri_intubation']);
  ensureNum(req.ph, 'ph');
  ensureNum(req.pco2, 'pco2');
  ensureNum(req.oxygen_sat, 'spo2');
  ensureStr(req.intervention, 'int');
  ensureBool(req.success, 'succ');
  ensureEnum(req.intubation, 'int2', ['performed','planned','contraindicated','not_needed']);
  ensureStr(req.cause, 'cause');
  return { type: req.type, ph: req.ph };
}
function asthma_exacerbation_severe(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.peak_flow_pct, 'pf');
  ensureNum(req.oxygen_sat, 'spo2');
  ensureBool(req.silent_chest, 'sc');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','intubation_needed']);
  return { peak_flow: req.peak_flow_pct };
}
function pneumothorax_tension(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.side, 'sd', ['left','right','bilateral']);
  ensureStr(req.clinical_signs, 'cs');
  ensureStr(req.intervention, 'int');
  ensureEnum(req.response, 'resp', ['hemodynamics_stabilized','ongoing','worsening']);
  return { side: req.side };
}
function pulmonary_embola_massive(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.echocardiogram, 'echo');
  ensureNum(req.troponin, 'tro');
  ensureNum(req.bnp, 'bnp');
  ensureStr(req.intervention, 'int');
  ensureEnum(req.response, 'resp', ['hemodynamics_improving','stable','worsening','arrest']);
  return { troponin: req.troponin };
}
function hemoptysis_massive(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.volume_ml, 'vol');
  ensureStr(req.source, 'src');
  ensureStr(req.airway_management, 'am');
  ensureStr(req.intervention, 'int');
  ensureEnum(req.status, 'stat', ['stabilized','ongoing','worsening']);
  return { volume: req.volume_ml };
}

function funcs() { return { respiratory_failure_emergent, asthma_exacerbation_severe, pneumothorax_tension, pulmonary_embola_massive, hemoptysis_massive }; }
module.exports = { funcs, ValidationError };