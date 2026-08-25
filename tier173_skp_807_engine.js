// filepath: tier173_skp_807_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function knee_replace(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.side, 'si', ['left','right','bilateral','NA']);
  ensureEnum(req.approach, 'ap', ['medial_parapatellar','midvastus','subvastus','NA']);
  ensureNum(req.duration_min, 'du'); ensureNum(req.ebl_ml, 'eb');
  ensureBool(req.computer_navigation, 'cn'); ensureNum(req.implant_size, 'is');
  ensureNum(req.hospital_days, 'hd'); ensureEnum(req.disposition, 'di', ['home','rehab','SNF','NA']);
  ensureStr(req.provider, 'pr');
  return { kr_id: `kr_${Date.now()}`, patient_id: req.patient_id, side: req.side, hd: req.hospital_days };
}

function hip_replace(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.side, 'si', ['left','right','bilateral','NA']);
  ensureEnum(req.approach, 'ap', ['posterior','anterior','lateral','NA']);
  ensureNum(req.duration_min, 'du'); ensureNum(req.ebl_ml, 'eb');
  ensureEnum(req.bearing, 'be', ['ceramic','metal','polyethylene','NA']);
  ensureNum(req.hospital_days, 'hd'); ensureEnum(req.disposition, 'di', ['home','rehab','SNF','NA']);
  ensureStr(req.provider, 'pr');
  return { hr_id: `hr_${Date.now()}`, patient_id: req.patient_id, side: req.side, be: req.bearing };
}

function shoulder_replace(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.side, 'si', ['left','right','NA']);
  ensureEnum(req.type, 'ty', ['anatomic','reverse','partial','NA']);
  ensureNum(req.duration_min, 'du'); ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.glenoid_prep, 'gp'); ensureNum(req.hospital_days, 'hd');
  ensureEnum(req.disposition, 'di', ['home','rehab','NA']);
  ensureStr(req.provider, 'pr');
  return { sr_id: `sr_${Date.now()}`, patient_id: req.patient_id, type: req.type, side: req.side };
}

function sports_surgery(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.procedure, 'pr', ['ACL','PCL','meniscus','labrum','rotator_cuff','other','NA']);
  ensureNum(req.duration_min, 'du'); ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.grafts_used, 'gu'); ensureBool(req.complication, 'co');
  ensureNum(req.rehab_weeks, 'rw'); ensureEnum(req.disposition, 'di', ['home','rehab','NA']);
  ensureStr(req.provider, 'pr');
  return { ss_id: `ss_${Date.now()}`, patient_id: req.patient_id, proc: req.procedure, rw: req.rehab_weeks };
}

function spine_surgery(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.procedure, 'pr', ['ACDF','laminectomy','discectomy','fusion','kyphoplasty','scoliosis_correction','NA']);
  ensureNum(req.levels, 'lv'); ensureNum(req.duration_min, 'du');
  ensureNum(req.ebl_ml, 'eb'); ensureNum(req.complications_count, 'cc');
  ensureNum(req.hospital_days, 'hd'); ensureEnum(req.disposition, 'di', ['home','rehab','SNF','NA']);
  ensureStr(req.provider, 'pr');
  return { sp_id: `sp_${Date.now()}`, patient_id: req.patient_id, proc: req.procedure, lv: req.levels };
}

function funcs() { return { knee_replace, hip_replace, shoulder_replace, sports_surgery, spine_surgery }; }
module.exports = { funcs, ValidationError };