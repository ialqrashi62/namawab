// filepath: tier54_emergency_ext_305_er_neuro_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stroke_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['ischemic_left_mca','ischemic_right_mca','ischemic_basilar','ischemic_lacunar','hemorrhagic_intraparenchymal','hemorrhagic_sah']);
  ensureNum(req.nihss, 'nihss');
  ensureNum(req.door_to_ct_min, 'dtc');
  ensureNum(req.door_to_needle_min, 'dtn');
  ensureStr(req.intervention, 'int');
  ensureStr(req.complications, 'comp');
  return { nihss: req.nihss };
}
function status_epilepticus_emergent(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['convulsive','non_convulsive','focal','myoclonic','absence_status']);
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.first_line, 'fl');
  ensureStr(req.second_line, 'sl');
  ensureBool(req.intubation_required, 'it');
  ensureStr(req.response, 'resp');
  return { type: req.type };
}
function tbi_emergent(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.gcs, 'gcs');
  ensureStr(req.mechanism, 'mech');
  ensureStr(req.ct_head, 'ct');
  ensureStr(req.intervention, 'int');
  ensureBool(req.intubated, 'it');
  ensureStr(req.monitoring, 'mon');
  return { gcs: req.gcs };
}
function anion_gap_acidosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ph, 'ph');
  ensureNum(req.hco3, 'hco3');
  ensureNum(req.anion_gap, 'ag');
  ensureNum(req.lactate, 'lac');
  ensureStr(req.etiology, 'eti');
  ensureStr(req.treatment, 'tx');
  ensureStr(req.response, 'resp');
  return { ph: req.ph, anion_gap: req.anion_gap };
}
function meningitis_emergent(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.presentation, 'pres');
  ensureStr(req.lp_planned, 'lp');
  ensureStr(req.antibiotics_empiric, 'abx');
  ensureNum(req.lactic_acid, 'lac');
  ensureStr(req.response, 'resp');
  return { presentation: req.presentation };
}

function funcs() { return { stroke_alert, status_epilepticus_emergent, tbi_emergent, anion_gap_acidosis, meningitis_emergent }; }
module.exports = { funcs, ValidationError };