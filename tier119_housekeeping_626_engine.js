// filepath: tier119_housekeeping_626_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function room_cleaning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.task_id, 'tid');
  ensureStr(req.room_id, 'rid');
  ensureEnum(req.cleaning_type, 'ct', ['daily','terminal','discharge','isolation','spill','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureBool(req.inspector_verified, 'iv');
  ensureStr(req.provider, 'pr');
  return { tid: req.task_id };
}
function linen_request(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.request_id, 'rid');
  ensureEnum(req.linen_type, 'lt', ['sheets','towels','gowns','blankets','pillowcases','other','unknown']);
  ensureNum(req.quantity, 'qty');
  ensureStr(req.unit, 'unit');
  ensureStr(req.provider, 'pr');
  return { rid: req.request_id };
}
function waste_disposal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.disposal_id, 'did');
  ensureEnum(req.waste_type, 'wt', ['regular','biohazard','sharps','pharmaceutical','chemotherapy','other','unknown']);
  ensureNum(req.weight_kg, 'wk');
  ensureStr(req.disposal_location, 'dl');
  ensureStr(req.provider, 'pr');
  return { did: req.disposal_id };
}
function pest_control(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.service_id, 'sid');
  ensureStr(req.location, 'loc');
  ensureEnum(req.pest_type, 'pt', ['insects','rodents','other','unknown']);
  ensureNum(req.treatment_area_sqft, 'tas');
  ensureStr(req.provider, 'pr');
  return { sid: req.service_id };
}
function maintenance_request(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.request_id, 'rid');
  ensureStr(req.location, 'loc');
  ensureEnum(req.issue_type, 'it', ['plumbing','electrical','hvac','equipment','structural','other','unknown']);
  ensureEnum(req.priority, 'pri', ['low','medium','high','urgent','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.request_id };
}

function funcs() { return { room_cleaning, linen_request, waste_disposal, pest_control, maintenance_request }; }
module.exports = { funcs, ValidationError };