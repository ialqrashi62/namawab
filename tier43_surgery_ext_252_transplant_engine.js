// filepath: tier43_surgery_ext_252_transplant_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function renal_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.donor_type, 'don', ['deceased','living_related','living_unrelated','paired_exchange']);
  ensureStr(req.recipient_blood_group, 'bg');
  ensureEnum(req.crossmatch, 'cm', ['negative','positive','flow_negative']);
  ensureNum(req.cold_ischemia_hours, 'cis');
  ensureStr(req.induction, 'ind');
  return { donor_type: req.donor_type, crossmatch: req.crossmatch };
}
function liver_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.meld_score, 'meld');
  ensureEnum(req.donor_type, 'don', ['deceased','living_donor','split','domino']);
  ensureNum(req.cold_ischemia_hours, 'cis');
  ensureNum(req.blood_loss, 'bl');
  ensureStr(req.follow_up, 'fu');
  return { meld: req.meld_score, donor_type: req.donor_type };
}
function heart_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.donor_age, 'age');
  ensureEnum(req.crossmatch, 'cm', ['negative','positive','flow_negative']);
  ensureNum(req.ischemic_time_min, 'ischemia');
  ensureStr(req.induction, 'induct');
  return { donor_age: req.donor_age, ischemic_time: req.ischemic_time_min };
}
function lung_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['single','double','heart_lung']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.donor_age, 'age');
  ensureNum(req.ischemic_time_min, 'ischemia');
  ensureStr(req.induction, 'induct');
  return { type: req.type, donor_age: req.donor_age };
}
function pancreas_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.simultaneous_kidney, 'spk');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.drainage, 'dr', ['enteric','bladder','duct_injection','duct_occlusion']);
  ensureStr(req.immunosuppression, 'imm');
  return { simultaneous_kidney: req.simultaneous_kidney, drainage: req.drainage };
}

function funcs() { return { renal_transplant, liver_transplant, heart_transplant, lung_transplant, pancreas_transplant }; }
module.exports = { funcs, ValidationError };