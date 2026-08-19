// filepath: tier136_card_692_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cath_lab(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['diagnostic','PCI','TAVR','MitraClip','Watchman','PFO','ASD','septal_ablation','biopsy','IABP','Impella']);
  ensureEnum(req.access, 'ac', ['radial','femoral','brachial','ulnar']);
  ensureNum(req.contrast_ml, 'cm');
  ensureNum(req.fluoro_dose_gy, 'fd');
  ensureNum(req.door_to_balloon_min, 'db');
  ensureStr(req.provider, 'pr');
  return { cath_id: `cat_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure, access: req.access, contrast: req.contrast_ml };
}
function stress_test(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'ty', ['exercise','pharmacologic','echo','nuclear','CT_FFR','MRI']);
  ensureNum(req.max_hr, 'mh');
  ensureNum(req.hr_recovery, 'hr');
  ensureBool(req.st_changes, 'sc');
  ensureEnum(req.result, 'rs', ['negative','positive','equivocal','indeterminate','risk_test_incomplete']);
  ensureStr(req.provider, 'pr');
  return { stress_id: `str_${Date.now()}`, patient_id: req.patient_id, type: req.type, max_hr: req.max_hr, result: req.result };
}
function echo_study(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'ty', ['TTE','TEE','stress','3D','contrast','fetal']);
  ensureNum(req.lvef, 'lv');
  ensureNum(req.lvidd, 'ld');
  ensureNum(req.tapse, 'tp');
  ensureEnum(req.valve_disease, 'vd', ['none','AS','AR','MS','MR','TS','TR','mixed','prosthetic','mixed_native']);
  ensureStr(req.provider, 'pr');
  return { echo_id: `ech_${Date.now()}`, patient_id: req.patient_id, type: req.type, lvef: req.lvef, valve: req.valve_disease };
}
function device_check(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.device_type, 'dt', ['pacemaker','ICD','CRT_D','CRT_P','ILR','SICD','leadless_pacemaker','subcutaneous_ICD']);
  ensureNum(req.battery_pct, 'bp');
  ensureNum(req.leads_impedance, 'li');
  ensureBool(req.shocks_delivered, 'sd');
  ensureStr(req.provider, 'pr');
  ensureStr(req.episode_summary, 'es');
  return { dev_id: `dvc_${Date.now()}`, patient_id: req.patient_id, device: req.device_type, battery: req.battery_pct };
}
function ablation_ep(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.target, 'tg', ['AF','AFL','AVNRT','AVRT','PVC','VT','SVT','WPW','atrial_tachy','ventricular_tachy']);
  ensureEnum(req.energy, 'eg', ['RF','cryo','pulsed_field','laser','microwave']);
  ensureNum(req.procedure_duration_min, 'pd');
  ensureBool(req.acute_success, 'as');
  ensureStr(req.provider, 'pr');
  return { abl_id: `abp_${Date.now()}`, patient_id: req.patient_id, target: req.target, energy: req.energy, success: req.acute_success };
}

function funcs() { return { cath_lab, stress_test, echo_study, device_check, ablation_ep }; }
module.exports = { funcs, ValidationError };
