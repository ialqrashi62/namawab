// filepath: tier169_cad_790_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chest_pain_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.character, 'ch', ['pressure','sharp','burning','stabbing','ache','other','NA']);
  ensureNum(req.onset_min, 'om'); ensureNum(req.radiation, 'ra');
  ensureBool(req.associated_diaphoresis, 'ad'); ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.hr, 'hr'); ensureNum(req.troponin, 'tr');
  ensureEnum(req.ecg, 'ec', ['normal','st_elev','st_depress','t_inv','other_abnormal','NA']);
  ensureEnum(req.disposition, 'di', ['discharge','observation','admit','cath_lab','NA']);
  ensureStr(req.provider, 'pr');
  return { cp_id: `cp_${Date.now()}`, patient_id: req.patient_id, troponin: req.troponin, ecg: req.ecg };
}

function stemi(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.culprit_vessel, 'cv', ['LAD','RCA','LCX','LM','other','NA']);
  ensureNum(req.door_to_balloon_min, 'db'); ensureNum(req.door_to_ekg_min, 'de');
  ensureNum(req.door_to_cath_min, 'dc'); ensureNum(req.killip_class, 'kc');
  ensureNum(req.lvef_pct, 'lv'); ensureEnum(req.disposition, 'di', ['CCU','floor','OR_cabg','death','NA']);
  ensureStr(req.provider, 'pr');
  return { st_id: `st_${Date.now()}`, patient_id: req.patient_id, vessel: req.culprit_vessel, lvef: req.lvef_pct };
}

function stroke_alert(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.nihss_score, 'ns');
  ensureNum(req.door_to_ct_min, 'dc'); ensureNum(req.door_to_needle_min, 'dn');
  ensureNum(req.door_to_groin_min, 'dg'); ensureEnum(req.diagnosis, 'dx', ['ischemic','hemorrhagic','TIA','mimic','NA']);
  ensureNum(req.door_in_time, 'di'); ensureEnum(req.disposition, 'di2', ['stroke_unit','ICU','floor','discharge','NA']);
  ensureStr(req.provider, 'pr');
  return { sa_id: `sa_${Date.now()}`, patient_id: req.patient_id, nihss: req.nihss_score, dx: req.diagnosis };
}

function sepsis(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.temp_c, 'tc');
  ensureNum(req.hr, 'hr'); ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.rr, 'rr'); ensureNum(req.wbc, 'wb');
  ensureNum(req.lactate, 'la'); ensureNum(req.qsofa_score, 'qs');
  ensureNum(req.door_to_abx_min, 'da'); ensureEnum(req.severity, 'sv', ['mild','moderate','severe','septic_shock','NA']);
  ensureStr(req.provider, 'pr');
  return { sp_id: `sp_${Date.now()}`, patient_id: req.patient_id, lactate: req.lactate, sev: req.severity };
}

function code_blue(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.rhythm, 'rh', ['Vfib','VTach','Asystole','PEA','Bradycardia','Other','NA']);
  ensureNum(req.door_time_min, 'dt'); ensureNum(req.epi_doses, 'ed');
  ensureNum(req.cpr_duration_min, 'cd'); ensureNum(req.time_to_rosc, 'tr');
  ensureEnum(req.outcome, 'ot', ['ROSC','ongoing_CPR','death','NA']);
  ensureBool(req.targeted_temp, 'tt'); ensureEnum(req.disposition, 'di', ['ICU','CCU','floor','morgue','NA']);
  ensureStr(req.provider, 'pr');
  return { cb_id: `cb_${Date.now()}`, patient_id: req.patient_id, rhythm: req.rhythm, outcome: req.outcome };
}

function funcs() { return { chest_pain_eval, stemi, stroke_alert, sepsis, code_blue }; }
module.exports = { funcs, ValidationError };