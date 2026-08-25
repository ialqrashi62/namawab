// filepath: tier101_peds_picu_529_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function picu_admission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.admission_id, 'aid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.weight_kg, 'wk');
  ensureStr(req.diagnosis, 'dx');
  ensureNum(req.oxygen_requirement, 'or');
  ensureNum(req.icu_days, 'icd');
  ensureEnum(req.severity, 'sev', ['critical','severe','moderate','mild','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.admission_id };
}
function peds_septic_shock(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.capillary_refill, 'cr');
  ensureNum(req.lactate, 'lac');
  ensureNum(req.fluid_resuscitation_ml_kg, 'fr');
  ensureBool(req.vasopressors, 'vp');
  ensureNum(req.antibiotic_time_min, 'at');
  ensureStr(req.source, 'src');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function status_asthmaticus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.respiratory_rate, 'rr');
  ensureNum(req.oxygen_saturation, 'os');
  ensureNum(req.peak_expiratory_flow, 'pef');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening','unknown','other','none']);
  ensureEnum(req.treatment, 'tx', ['observation','inhaler','systemic_steroid','magnesium','heliox','mechanical','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function dka_pediatric(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.blood_glucose, 'bg');
  ensureNum(req.ph, 'ph');
  ensureNum(req.bicarbonate, 'hco3');
  ensureNum(req.ketones, 'ket');
  ensureNum(req.fluid_resuscitation_pct, 'frp');
  ensureEnum(req.treatment, 'tx', ['observation','insulin','fluids','electrolyte','combination','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function status_epilepticus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.age_years, 'ay');
  ensureEnum(req.seizure_type, 'st', ['generalized','focal','absence','myoclonic','tonic_clonic','unknown','other']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.benzodiazepine_dose, 'bzd');
  ensureNum(req.phenytoin_load, 'phl');
  ensureEnum(req.imaging, 'img', ['ct','mri','eeg','none','other','unknown']);
  ensureEnum(req.etiology, 'et', ['febrile','structural','metabolic','genetic','idiopathic','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}

function funcs() { return { picu_admission, peds_septic_shock, status_asthmaticus, dka_pediatric, status_epilepticus }; }
module.exports = { funcs, ValidationError };
