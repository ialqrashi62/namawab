// filepath: tier152_pcs_718_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function norwood(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureNum(req.age_days, 'ad');
  ensureNum(req.weight_kg, 'wk');
  ensureEnum(req.diagnosis, 'dx', ['HLHS','HLHS_variant','critical_AS','single_ventricle','other','NA']);
  ensureEnum(req.modification, 'mo', ['norwood_classic','norwood_right_vent_to_pa_conduit','norwood_modified','dks_norwood','hybrid_stage1','other','NA']);
  ensureNum(req.cpb_min, 'cp');
  ensureNum(req.cross_clamp_min, 'cc');
  ensureNum(req.dhca_min, 'dh');
  ensureNum(req.circulatory_arrest_min, 'ca');
  ensureNum(req.ebl_ml, 'eb');
  ensureEnum(req.shunt, 'sh', ['BT_3.5','BT_4','BT_5','RVPA_conduit','other','NA']);
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { no_id: `nor_${Date.now()}`, case_id: req.case_id, dx: req.diagnosis };
}
function glenn(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureNum(req.age_months, 'am');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.preop_saturation_pct, 'ps');
  ensureNum(req.cpb_min, 'cp');
  ensureNum(req.cross_clamp_min, 'cc');
  ensureEnum(req.type, 'tp', ['bidirectional_G','hemifontan','kawashima','other','NA']);
  ensureBool(req.fenestration, 'fn');
  ensureBool(req.azygos_ligation, 'al');
  ensureNum(req.ebl_ml, 'eb');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { gl_id: `gle_${Date.now()}`, case_id: req.case_id, type: req.type };
}
function fontan(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.weight_kg, 'wk');
  ensureEnum(req.type, 'tp', ['lateral_tunnel','extracardiac','fenestrated','non_fenestrated','intra_atrial','NA']);
  ensureNum(req.conduit_size_mm, 'cs');
  ensureNum(req.cpb_min, 'cp');
  ensureNum(req.cross_clamp_min, 'cc');
  ensureBool(req.fenestration, 'fn');
  ensureNum(req.fenestration_size_mm, 'fs');
  ensureNum(req.preop_saturation_pct, 'ps');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { fn_id: `fon_${Date.now()}`, case_id: req.case_id, type: req.type };
}
function arterial_switch(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureNum(req.age_days, 'ad');
  ensureNum(req.weight_kg, 'wk');
  ensureEnum(req.diagnosis, 'dx', ['simple_TGA','TGA_VSD','TGA_VSD_coarct','TGA_arch_obstruction','other','NA']);
  ensureNum(req.cpb_min, 'cp');
  ensureNum(req.cross_clamp_min, 'cc');
  ensureNum(req.dhca_min, 'dh');
  ensureBool(req.lef_atrial_coronary_reimplant, 'la');
  ensureBool(req.lecompte_maneuver, 'le');
  ensureNum(req.ebl_ml, 'eb');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { as_id: `ars_${Date.now()}`, case_id: req.case_id, dx: req.diagnosis };
}
function tetralogy_repair(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureEnum(req.anatomy, 'an', ['TOF','TOF_APV','TOF_PA','TOF_AVSD','TOF_absent_pv','other','NA']);
  ensureNum(req.age_months, 'am');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.cpb_min, 'cp');
  ensureNum(req.cross_clamp_min, 'cc');
  ensureEnum(req.rvot_repair, 'ro', ['transannular_patch','valve_sparing','RV_to_PA_conduit','muscle_resection','infundibulectomy','other','NA']);
  ensureNum(req.ebl_ml, 'eb');
  ensureEnum(req.residual, 'rs', ['none','mild_PI','moderate_PI','severe_PI','VSD','both','NA']);
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { tr_id: `tor_${Date.now()}`, case_id: req.case_id, anatomy: req.anatomy };
}

function funcs() { return { norwood, glenn, fontan, arterial_switch, tetralogy_repair }; }
module.exports = { funcs, ValidationError };