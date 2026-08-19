// filepath: tier111_neuro_diagnostic_589_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function eeg(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.modality, 'mod', ['routine','sleep_deprived','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.electrode_count, 'ec');
  ensureEnum(req.interpretation, 'int', ['normal','abnormal','epileptiform','focal_slowing','diffuse_slowing','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function eeg_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.monitor_id, 'mid');
  ensureNum(req.duration_hours, 'dh');
  ensureNum(req.events_detected, 'ed');
  ensureEnum(req.event_type, 'et', ['seizure','spike','slowing','artifacts','other','unknown','none']);
  ensureStr(req.localization, 'loc');
  ensureEnum(req.intervention, 'int', ['medication_change','no_change','referral','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { mid: req.monitor_id };
}
function emg_ncs(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureStr(req.nerve, 'nrv');
  ensureEnum(req.amplitude, 'amp', ['normal','decreased','absent','increased','other','unknown']);
  ensureEnum(req.latency, 'lat', ['normal','prolonged','shortened','absent','other','unknown']);
  ensureEnum(req.findings, 'fd', ['normal','neuropathy','carpal_tunnel','myopathy','radiculopathy','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function evoked_potentials(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.modality, 'mod', ['visual_evoked','somatosensory_evoked','brainstem_evoked','motor_evoked','other','unknown']);
  ensureEnum(req.response, 'resp', ['normal','abnormal','absent','other','unknown']);
  ensureNum(req.amplitude_uv, 'au');
  ensureNum(req.latency_ms, 'lm');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function lumbar_puncture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['meningitis','encephalitis','ms','bleed','other','unknown']);
  ensureNum(req.opening_pressure_cm, 'opc');
  ensureNum(req.closing_pressure_cm, 'cpc');
  ensureEnum(req.crystall_color, 'cc', ['clear','cloudy','xanthochromic','bloody','other','unknown']);
  ensureNum(req.cells_count, 'clc');
  ensureNum(req.glucose_mg_dl, 'gmd');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { eeg, eeg_monitoring, emg_ncs, evoked_potentials, lumbar_puncture }; }
module.exports = { funcs, ValidationError };