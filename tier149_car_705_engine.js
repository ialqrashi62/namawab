// filepath: tier149_car_705_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function echo(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.lvef_pct, 'le');
  ensureEnum(req.lv_function, 'lv', ['normal','mildly_depressed','moderately_depressed','severely_depressed','hyperdynamic','unknown']);
  ensureNum(req.lvidd_mm, 'ld');
  ensureNum(req.lvids_mm, 'ls');
  ensureNum(req.tapse_mm, 'ta');
  ensureEnum(req.valve_abnormalities, 'va', ['none','AS','AR','MR','MS','TR','PR','mixed','prosthetic','other']);
  ensureNum(req.ef_pasp, 'ef');
  ensureNum(req.trv, 'tv');
  ensureStr(req.provider, 'pr');
  return { ec_id: `ech_${Date.now()}`, patient_id: req.patient_id, lvef: req.lvef_pct };
}
function stress_test(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['treadmill','pharmacologic_adenosine','pharmacologic_dobutamine','pharmacologic_regadenoson','echo_stress','nuclear','CT_FRP','MRI_stress','other']);
  ensureNum(req.duration_min, 'du');
  ensureNum(req.mets, 'mt');
  ensureNum(req.max_hr, 'mh');
  ensureNum(req.pct_max_hr, 'pm');
  ensureEnum(req.result, 're', ['negative','positive','equivocal','inconclusive','high_risk','NA']);
  ensureNum(req.st_depression_mm, 'st');
  ensureBool(req.chest_pain, 'cp');
  ensureStr(req.provider, 'pr');
  return { st_id: `str_${Date.now()}`, patient_id: req.patient_id, type: req.type, result: req.result };
}
function cath(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.access, 'ac', ['radial','femoral','brachial','ulnar','other']);
  ensureNum(req.contrast_ml, 'cn');
  ensureNum(req.fluoro_min, 'fm');
  ensureNum(req.dose_mgy, 'ds');
  ensureNum(req.lad_stenosis_pct, 'ls');
  ensureNum(req.lcx_stenosis_pct, 'lc');
  ensureNum(req.rca_stenosis_pct, 'rc');
  ensureNum(req.lm_stenosis_pct, 'lm');
  ensureNum(req.ef_pct, 'ef');
  ensureNum(req.lvedp_mmhg, 'lp');
  ensureBool(req.pci_performed, 'pc');
  ensureStr(req.provider, 'pr');
  return { ca_id: `cat_${Date.now()}`, patient_id: req.patient_id, lad: req.lad_stenosis_pct };
}
function device(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.device, 'dv', ['pacemaker_dual','pacemaker_single','ICD_dual','ICD_single','CRT_D','CRT_P','ILR','subcutaneous_ICD','leadless_pacemaker','wearable_defib','other']);
  ensureEnum(req.manufacturer, 'mf', ['Medtronic','Boston_Scientific','Abbott_St_Jude','Biotronik','Sorin_LivaNova','Cameron_Health','Nanostim','other','NA']);
  ensureNum(req.battery_voltage, 'bv');
  ensureNum(req.battery_eri, 'be');
  ensureNum(req.lead_impedance_ohms, 'li');
  ensureNum(req.threshold_v, 'th');
  ensureBool(req.shock_delivered, 'sd');
  ensureNum(req.last_followup_days, 'lf');
  ensureStr(req.provider, 'pr');
  return { dv_id: `dev_${Date.now()}`, patient_id: req.patient_id, device: req.device };
}
function heart_failure(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.nyha, 'ny', ['I','II','III','IV','unknown']);
  ensureEnum(req.acc_aha_stage, 'as', ['A_at_risk','B_pre_HF','C_symptomatic','D_advanced','unknown']);
  ensureNum(req.lvef_pct, 'le');
  ensureNum(req.bnp, 'bn');
  ensureNum(req.ntprobnp, 'np');
  ensureNum(req.weight_kg, 'wt');
  ensureNum(req.daily_weight_kg, 'dw');
  ensureNum(req.fluid_intake_ml, 'fi');
  ensureEnum(req.medications, 'me', ['none','GDMT_quad','GDMT_triple','GDMT_double','inotrope','diuretic','SGLT2i','ARNI','beta_blocker','MRA','other']);
  ensureStr(req.provider, 'pr');
  return { hf_id: `htf_${Date.now()}`, patient_id: req.patient_id, nyha: req.nyha, lvef: req.lvef_pct };
}

function funcs() { return { echo, stress_test, cath, device, heart_failure }; }
module.exports = { funcs, ValidationError };