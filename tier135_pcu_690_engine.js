// filepath: tier135_pcu_690_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function picu_admission(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.weight_kg, 'wk');
  ensureEnum(req.admission_type, 'at', ['medical','surgical','trauma','cardiac','neuro','respiratory','post_op']);
  ensureNum(req.prism_score, 'ps');
  ensureStr(req.diagnosis, 'dx');
  return { adm_id: `picu_${Date.now()}`, patient_id: req.patient_id, age: req.age_years, admission: req.admission_type, prism: req.prism_score };
}
function vent_mgmt(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.mode, 'md', ['CMV','SIMV','PRVC','PSV','HFOV','NIV','CPAP','BiPAP','HFNC']);
  ensureNum(req.tidal_volume_ml, 'tv');
  ensureNum(req.peep, 'pp');
  ensureNum(req.fio2, 'fi');
  ensureNum(req.rate, 'rt');
  ensureStr(req.provider, 'pr');
  return { vent_id: `vnt_${Date.now()}`, patient_id: req.patient_id, mode: req.mode, tv: req.tidal_volume_ml, peep: req.peep };
}
function sedation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.drug, 'dr', ['midazolam','fentanyl','propofol','dexmedetomidine','ketamine','morphine','lorazepam']);
  ensureNum(req.dose_mcg_kg_min, 'ds');
  ensureNum(req.sedation_score, 'ss');
  ensureNum(req.target_sedation_score, 'ts');
  ensureStr(req.provider, 'pr');
  return { sed_id: `sed_${Date.now()}`, patient_id: req.patient_id, drug: req.drug, dose: req.dose_mcg_kg_min, score: req.sedation_score };
}
function ecmo(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.mode, 'md', ['VA','VV','VAV','VVA']);
  ensureStr(req.indication, 'in');
  ensureNum(req.flow_l_min, 'fl');
  ensureEnum(req.cannulation, 'cn', ['central','femoral','jugular','cervical','transthoracic']);
  ensureStr(req.provider, 'pr');
  return { ecmo_id: `ecmo_${Date.now()}`, patient_id: req.patient_id, mode: req.mode, flow: req.flow_l_min };
}
function code_event(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['asystole','PEA','VF','VT','respiratory','rapid_response','anaphylaxis','fire']);
  ensureNum(req.duration_min, 'dm');
  ensureBool(req.rosc_achieved, 'ra');
  ensureStr(req.outcome, 'oc');
  ensureStr(req.provider, 'pr');
  return { code_id: `cde_${Date.now()}`, patient_id: req.patient_id, type: req.type, duration: req.duration_min, rosc: req.rosc_achieved };
}

function funcs() { return { picu_admission, vent_mgmt, sedation, ecmo, code_event }; }
module.exports = { funcs, ValidationError };
