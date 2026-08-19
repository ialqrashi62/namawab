// filepath: tier111_dialysis_588_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hd_session(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.modality, 'mod', ['hemodialysis','hemodiafiltration','hemofiltration','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.blood_flow, 'bf');
  ensureNum(req.dialysate_flow, 'df');
  ensureNum(req.uf_volume, 'ufv');
  ensureNum(req.adequacy_ktv, 'ktv');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function peritoneal_dialysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.modality, 'mod', ['capd','apd','ccpd','intermittent','other','unknown']);
  ensureNum(req.dwell_time_hr, 'dth');
  ensureNum(req.exchange_volume_ml, 'evm');
  ensureNum(req.dialysate_dextrose, 'dd');
  ensureNum(req.ultrafiltration_ml, 'ufm');
  ensureEnum(req.exit_site, 'es', ['clean','red','drainage','infected','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function dialysis_access(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.access_id, 'aid');
  ensureEnum(req.access_type, 'at', ['av_fistula','av_graft','tunneled_catheter','non_tunneled_catheter','pd_catheter','other','unknown']);
  ensureEnum(req.location, 'loc', ['radial','brachial','femoral','subclavian','jugular','abdomen','other','unknown']);
  ensureStr(req.creation_date, 'cd');
  ensureEnum(req.function, 'fn', ['mature','maturing','immature','failing','failed','other','unknown']);
  ensureNum(req.flow_ml_min, 'fm');
  ensureStr(req.provider, 'pr');
  return { aid: req.access_id };
}
function anemia_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.management_id, 'mid');
  ensureNum(req.hgb_g_dl, 'hgb');
  ensureNum(req.tsat_pct, 'tsat');
  ensureNum(req.ferritin_ng_ml, 'fer');
  ensureBool(req.epo_trial, 'epo');
  ensureNum(req.epo_dose_units, 'edu');
  ensureNum(req.iron_dose_mg, 'idm');
  ensureEnum(req.response, 'resp', ['complete','partial','no_response','escalation','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { mid: req.management_id };
}
function bone_mineral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.bone_id, 'bid');
  ensureNum(req.calcium_mg_dl, 'ca');
  ensureNum(req.phosphorus_mg_dl, 'ph');
  ensureNum(req.pth_pg_ml, 'pth');
  ensureNum(req.vitamin_d_25, 'vd');
  ensureNum(req.cinacalcet_dose, 'cnc');
  ensureNum(req.sevelamer_dose, 'svl');
  ensureEnum(req.fracture_risk, 'fr', ['low','moderate','high','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { bid: req.bone_id };
}

function funcs() { return { hd_session, peritoneal_dialysis, dialysis_access, anemia_management, bone_mineral }; }
module.exports = { funcs, ValidationError };