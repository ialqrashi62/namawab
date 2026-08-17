// filepath: tier45_icu_ext_262_icu_renal_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function aki_icu(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.kdigo_stage, 'kdigo');
  ensureNum(req.creatinine, 'cr');
  ensureStr(req.urine_output, 'uo');
  ensureStr(req.etiology, 'eti');
  ensureStr(req.intervention, 'int');
  return { kdigo: req.kdigo_stage, cr: req.creatinine };
}
function crrt(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.mode, 'mode', ['cvvh','cvvhd','cvvhdf','scuf','plasmx','hemoperf']);
  ensureNum(req.blood_flow, 'bf');
  ensureStr(req.replacement, 'rep');
  ensureEnum(req.anticoagulation, 'ac', ['citrate','heparin','none','argatroban','bivalirudin']);
  ensureNum(req.duration_hours, 'dur');
  return { mode: req.mode, anticoagulation: req.anticoagulation };
}
function fluid_resuscitation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.crystalloid, 'cry', ['saline','lactated_ringers','balanced','albumin','plasma']);
  ensureNum(req.volume_l, 'vol');
  ensureEnum(req.response, 'resp', ['improving_map','no_response','partial_response']);
  ensureStr(req.monitoring, 'mon');
  ensureEnum(req.overload_risk, 'ol', ['low','moderate','high']);
  return { volume: req.volume_l, response: req.response };
}
function electrolyte_emergency(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.electrolyte, 'el', ['potassium','sodium','calcium','magnesium','phosphate','glucose']);
  ensureNum(req.value, 'val');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening']);
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['correcting','stable','worsening']);
  return { electrolyte: req.electrolyte, severity: req.severity };
}
function acid_base(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ph, 'ph');
  ensureNum(req.pco2, 'pco2');
  ensureNum(req.hco3, 'hco3');
  ensureNum(req.anion_gap, 'ag');
  ensureStr(req.disturbance, 'dist');
  ensureStr(req.treatment, 'tx');
  return { ph: req.ph, disturbance: req.disturbance };
}

function funcs() { return { aki_icu, crrt, fluid_resuscitation, electrolyte_emergency, acid_base }; }
module.exports = { funcs, ValidationError };