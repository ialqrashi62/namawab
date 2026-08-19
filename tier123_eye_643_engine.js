// filepath: tier123_eye_643_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function visual_acuity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.va_id, 'vid');
  ensureStr(req.od, 'od');
  ensureStr(req.os, 'os');
  ensureEnum(req.method, 'meth', ['snellen','logmar','jaeger','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { vid: req.va_id };
}
function tonometry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.tono_id, 'tid');
  ensureNum(req.od_pressure_mmHg, 'op');
  ensureNum(req.os_pressure_mmHg, 'sp');
  ensureEnum(req.method, 'meth', ['nct','iat','goldmann','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.tono_id };
}
function fundoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.fundo_id, 'fid');
  ensureNum(req.cup_disc_ratio_od, 'cr_o');
  ensureNum(req.cup_disc_ratio_os, 'cr_s');
  ensureStr(req.provider, 'pr');
  return { fid: req.fundo_id };
}
function retinal_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ret_id, 'rid');
  ensureEnum(req.eye, 'eye', ['od','os','ou','other','unknown']);
  ensureEnum(req.image_quality, 'iq', ['poor','fair','good','excellent','other','unknown']);
  ensureStr(req.finding, 'fnd');
  ensureStr(req.provider, 'pr');
  return { rid: req.ret_id };
}
function oct_scan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.oct_id, 'oid');
  ensureEnum(req.eye, 'eye', ['od','os','ou','other','unknown']);
  ensureEnum(req.scan_type, 'st', ['macular','optic_disc','rnfl','other','unknown']);
  ensureNum(req.rnfl_um, 'rnfl');
  ensureStr(req.provider, 'pr');
  return { oid: req.oct_id };
}

function funcs() { return { visual_acuity, tonometry, fundoscopy, retinal_imaging, oct_scan }; }
module.exports = { funcs, ValidationError };