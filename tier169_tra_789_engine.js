// filepath: tier169_tra_789_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function trauma_call(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.mechanism, 'me', ['MVC','GSW','stab','fall','burn','blast','other','NA']);
  ensureNum(req.gcs, 'gc'); ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.hr, 'hr'); ensureNum(req.rr, 'rr');
  ensureNum(req.spo2, 'sp'); ensureEnum(req.activation, 'ac', ['trauma_team','stroke_team','code_blue','massive_transfusion','NA']);
  ensureNum(req.response_min, 'rm'); ensureEnum(req.disposition, 'di', ['OR','ICU','floor','discharge','morgue','NA']);
  ensureStr(req.provider, 'pr');
  return { tc_id: `tc_${Date.now()}`, patient_id: req.patient_id, mech: req.mechanism, disp: req.disposition };
}

function massive_transfusion(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.hr, 'hr'); ensureNum(req.blood_loss_ml, 'bl');
  ensureNum(req.prbc_units, 'pu'); ensureNum(req.ffp_units, 'fu');
  ensureNum(req.platelet_units, 'pl'); ensureNum(req.cryo_units, 'cu');
  ensureNum(req.hgb_post, 'hp'); ensureEnum(req.outcome, 'ot', ['hemostasis','ongoing_bleeding','death','NA']);
  ensureStr(req.provider, 'pr');
  return { mt_id: `mt_${Date.now()}`, patient_id: req.patient_id, prbc: req.prbc_units, ffp: req.ffp_units };
}

function trauma_imaging(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.modality, 'mo', ['FAST','CT_head','CT_body','angio','plain_film','MRI','NA']);
  ensureBool(req.finding, 'fi'); ensureEnum(req.finding_type, 'ft', ['none','free_fluid','fracture','hemorrhage','organ_injury','mass','NA']);
  ensureNum(req.dose_msv, 'ds'); ensureNum(req.door_to_scan_min, 'ds2');
  ensureEnum(req.disposition, 'di', ['OR','angio','ICU','floor','discharge','NA']);
  ensureStr(req.provider, 'pr');
  return { ti_id: `ti_${Date.now()}`, patient_id: req.patient_id, mod: 'mo', finding: req.finding };
}

function injury_severity(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.iss, 'is');
  ensureNum(req.ais_head, 'ah'); ensureNum(req.ais_face, 'af');
  ensureNum(req.ais_chest, 'ac'); ensureNum(req.ais_abdomen, 'aad');
  ensureNum(req.ais_extremity, 'ae'); ensureNum(req.ais_external, 'ax');
  ensureEnum(req.triss, 'ts', ['low','moderate','high','NA']);
  ensureStr(req.provider, 'pr');
  return { is_id: `is_${Date.now()}`, patient_id: req.patient_id, iss: req.iss, triss: req.triss };
}

function trauma_outcome(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.length_of_stay, 'ls');
  ensureNum(req.icu_days, 'id'); ensureNum(req.vent_days, 'vd');
  ensureEnum(req.complication, 'co', ['none','DVT','PE','ARDS','MOF','infection','other','NA']);
  ensureNum(req.gos_score, 'gs'); ensureEnum(req.discharge_status, 'ds', ['home','rehab','LTC','hospice','death','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { to_id: `to_${Date.now()}`, patient_id: req.patient_id, gos: req.gos_score, disp: req.discharge_status };
}

function funcs() { return { trauma_call, massive_transfusion, trauma_imaging, injury_severity, trauma_outcome }; }
module.exports = { funcs, ValidationError };