// filepath: tier136_str_693_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stroke_alert(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.last_known_well_min, 'lk');
  ensureNum(req.nihss, 'ns');
  ensureNum(req.aspires, 'as');
  ensureBool(req.lvo_suspected, 'lv');
  ensureNum(req.door_to_ct_min, 'dc');
  ensureNum(req.door_to_needle_min, 'dn');
  ensureStr(req.provider, 'pr');
  return { stroke_id: `stk_${Date.now()}`, patient_id: req.patient_id, lkw: req.last_known_well_min, nihss: req.nihss, lvo: req.lvo_suspected };
}
function tpa_admin(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.stroke_id, 'si');
  ensureNum(req.dose_mg, 'ds');
  ensureNum(req.weight_kg, 'wk');
  ensureEnum(req.outcome, 'oc', ['administered','declined','contraindicated','cancelled','complications']);
  ensureStr(req.provider, 'pr');
  ensureBool(req.bleeding_complication, 'bc');
  return { tpa_id: `tpa_${Date.now()}`, patient_id: req.patient_id, dose: req.dose_mg, outcome: req.outcome };
}
function thrombectomy_proc(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.stroke_id, 'si');
  ensureNum(req.door_to_puncture_min, 'dp');
  ensureNum(req.tici_reperfusion, 'tr');
  ensureEnum(req.technique, 'tc', ['stent_retriever','aspiration','combined','angioplasty','stenting']);
  ensureStr(req.provider, 'pr');
  ensureBool(req.post_mrs, 'pm');
  return { thromb_id: `ths_${Date.now()}`, patient_id: req.patient_id, door_to_puncture: req.door_to_puncture_min, tici: req.tici_reperfusion };
}
function icp_monitor(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.method, 'mt', ['EVD','bolt','parenchymal','subdural','non_invasive']);
  ensureNum(req.icp_mmhg, 'ip');
  ensureNum(req.cpp_mmhg, 'cp');
  ensureBool(req.treatment_initiated, 'ti');
  ensureStr(req.provider, 'pr');
  ensureStr(req.tier, 'tr');
  return { icp_id: `icp_${Date.now()}`, patient_id: req.patient_id, method: req.method, icp: req.icp_mmhg, cpp: req.cpp_mmhg };
}
function recovery_milestone(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.day_post_stroke, 'dp');
  ensureEnum(req.disposition, 'dp2', ['ICU','stroke_unit','floor','rehab','home','LTAC','hospice','deceased']);
  ensureNum(req.mrs, 'mr');
  ensureNum(req.barthel, 'ba');
  ensureBool(req.dysphagia_screened, 'ds');
  ensureStr(req.provider, 'pr');
  return { mil_id: `mrs_${Date.now()}`, patient_id: req.patient_id, day: req.day_post_stroke, mrs: req.mrs, barthel: req.barthel };
}

function funcs() { return { stroke_alert, tpa_admin, thrombectomy_proc, icp_monitor, recovery_milestone }; }
module.exports = { funcs, ValidationError };
