// filepath: tier172_car_805_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cardiac_rehab(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.diagnosis, 'dx', ['post_MI','post_CABG','post_PCI','HF','stable_angina','NA']);
  ensureNum(req.sessions, 'sn'); ensureNum(req.mets_achieved, 'ma');
  ensureNum(req.bp_baseline, 'bb'); ensureNum(req.bp_current, 'bc');
  ensureNum(req.hr_baseline, 'hb'); ensureNum(req.hr_current, 'hc');
  ensureNum(req.adherence_pct, 'ad'); ensureEnum(req.disposition, 'di', ['continue','graduate','discontinue','NA']);
  ensureStr(req.provider, 'pr');
  return { cr_id: `cr_${Date.now()}`, patient_id: req.patient_id, mets: req.mets_achieved, disp: req.disposition };
}

function heart_failure(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.nyha_class, 'nc', ['I','II','III','IV','NA']);
  ensureNum(req.lvef_pct, 'lv'); ensureNum(req.ntprobnp, 'np');
  ensureEnum(req.treatment, 'tr', ['none','BB','ACEI','ARB','ARNI','SGLT2','MRA','combination','NA']);
  ensureNum(req.fluid_intake_l, 'fi'); ensureNum(req.weight_kg, 'wk');
  ensureNum(req.weight_change_kg, 'wc'); ensureEnum(req.disposition, 'di', ['home','ED','admit','NA']);
  ensureStr(req.provider, 'pr');
  return { hf_id: `hf_${Date.now()}`, patient_id: req.patient_id, nyha: req.nyha_class, lvef: req.lvef_pct };
}

function arrhythmia(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['AF','AFL','SVT','VT','VF','bradycardia','NA']);
  ensureNum(req.duration_min, 'du'); ensureNum(req.hr, 'hr');
  ensureNum(req.bp_systolic, 'bs'); ensureNum(req.spo2, 'sp');
  ensureBool(req.symptoms, 'sx'); ensureEnum(req.treatment, 'tr', ['observation','medication','cardioversion','ablation','pacemaker','NA']);
  ensureNum(req.recurrence_count, 'rc'); ensureStr(req.provider, 'pr');
  return { ar_id: `ar_${Date.now()}`, patient_id: req.patient_id, type: req.type, treatment: req.treatment };
}

function pci(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.access, 'ac', ['radial','femoral','NA']);
  ensureNum(req.lesions_count, 'lc'); ensureNum(req.stents_count, 'sc');
  ensureNum(req.door_to_balloon_min, 'db'); ensureEnum(req.timi_flow, 'tf', ['0','1','2','3','NA']);
  ensureBool(req.complication, 'co'); ensureEnum(req.complication_type, 'ct', ['none','dissection','perforation','thrombosis','access','NA']);
  ensureNum(req.hospital_days, 'hd'); ensureStr(req.provider, 'pr');
  return { pc_id: `pc_${Date.now()}`, patient_id: req.patient_id, access: req.access, stents: req.stents_count };
}

function valve_surgery(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['AVR','MVR','TVR','repair','TAVR','NA']);
  ensureEnum(req.approach, 'ap', ['open','minimally_invasive','TAVR','NA']);
  ensureNum(req.duration_min, 'du'); ensureNum(req.cpb_time_min, 'cp');
  ensureBool(req.complication, 'co'); ensureNum(req.hospital_days, 'hd');
  ensureEnum(req.disposition, 'di', ['home','rehab','ICU','NA']);
  ensureStr(req.provider, 'pr');
  return { vs_id: `vs_${Date.now()}`, patient_id: req.patient_id, type: req.type, ap: req.approach };
}

function funcs() { return { cardiac_rehab, heart_failure, arrhythmia, pci, valve_surgery }; }
module.exports = { funcs, ValidationError };