// filepath: tier97_neph_dialysis_511_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hemodialysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.pre_weight_kg, 'pw');
  ensureNum(req.post_weight_kg, 'pwk');
  ensureNum(req.uf_removed_ml, 'ufr');
  ensureNum(req.duration_hours, 'dur');
  ensureNum(req.blood_flow_rate, 'bfr');
  ensureNum(req.dialysate_flow, 'df');
  ensureNum(req.urea_reduction_ratio, 'urr');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function peritoneal_dialysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.modality, 'mod', ['capd','apd','dapd','other','unknown']);
  ensureNum(req.fill_volume_ml, 'fv');
  ensureNum(req.dwell_time_hours, 'dt');
  ensureNum(req.exchanges_per_day, 'epd');
  ensureNum(req.ultrafiltration_ml, 'uf');
  ensureNum(req.creatinine_clearance, 'cc');
  ensureBool(req.peritonitis, 'peri');
  ensureNum(req.dwell_glucose_pd, 'dgp');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function vascular_access(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.access_type, 'at', ['avfistula','avgraft','tunneled_catheter','non_tunneled_catheter','peritoneal_catheter','other','unknown','none']);
  ensureNum(req.access_age_months, 'anm');
  ensureEnum(req.location, 'loc', ['left_arm','right_arm','left_leg','right_leg','chest','abdomen','other','unknown']);
  ensureNum(req.fistula_flow_ml_min, 'ffm');
  ensureBool(req.maturation_assessment, 'ma');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function anemia_ckd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.hemoglobin, 'hgb');
  ensureNum(req.ferritin, 'fer');
  ensureNum(req.tsat, 'tsat');
  ensureNum(req.retic, 'ret');
  ensureBool(req.esa_use, 'esa');
  ensureNum(req.esa_dose, 'ed');
  ensureNum(req.iron_replacement, 'ir');
  ensureEnum(req.target_hgb, 'th', ['10_11','11_12','individualized','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function mineral_bone_ckd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.calcium, 'ca');
  ensureNum(req.phosphate, 'ph');
  ensureNum(req.pth, 'pth');
  ensureNum(req.vitamin_d, 'vitd');
  ensureNum(req.fgf23, 'fgf');
  ensureEnum(req.ckd_mbd, 'mbd', ['low_turnover','high_turnover','mixed','normal','other','unknown','none']);
  ensureBool(req.phosphate_binder, 'pb');
  ensureNum(req.calcimimetic, 'cmm');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { hemodialysis, peritoneal_dialysis, vascular_access, anemia_ckd, mineral_bone_ckd }; }
module.exports = { funcs, ValidationError };

