// filepath: tier119_bed_management_624_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function bed_assignment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assignment_id, 'aid');
  ensureStr(req.bed_id, 'bid');
  ensureEnum(req.unit, 'unit', ['icu','er','med_surg','ob','peds','psych','nicu','other','unknown']);
  ensureEnum(req.acuity, 'acu', ['low','medium','high','critical','other','unknown']);
  ensureBool(req.isolation_required, 'ir');
  ensureStr(req.provider, 'pr');
  return { aid: req.assignment_id };
}
function bed_transfer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.transfer_id, 'tid');
  ensureStr(req.from_bed, 'fb');
  ensureStr(req.to_bed, 'tb');
  ensureStr(req.reason, 'rsn');
  ensureNum(req.transfer_time_min, 'ttm');
  ensureStr(req.provider, 'pr');
  return { tid: req.transfer_id };
}
function bed_cleaning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cleaning_id, 'cid');
  ensureStr(req.bed_id, 'bid');
  ensureEnum(req.cleaning_type, 'ct', ['terminal','standard','isolation','spill','other','unknown']);
  ensureBool(req.ready_for_admission, 'rfa');
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { cid: req.cleaning_id };
}
function bed_status_update(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.status_id, 'sid');
  ensureStr(req.bed_id, 'bid');
  ensureEnum(req.status, 'st', ['occupied','available','dirty','cleaning','out_of_service','reserved','other','unknown']);
  ensureStr(req.updated_by, 'ub');
  ensureStr(req.provider, 'pr');
  return { sid: req.status_id };
}
function capacity_dashboard(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.snapshot_id, 'snid');
  ensureStr(req.unit, 'unit');
  ensureNum(req.total_beds, 'tb');
  ensureNum(req.occupied_beds, 'ob');
  ensureNum(req.available_beds, 'ab');
  ensureStr(req.provider, 'pr');
  return { snid: req.snapshot_id };
}

function funcs() { return { bed_assignment, bed_transfer, bed_cleaning, bed_status_update, capacity_dashboard }; }
module.exports = { funcs, ValidationError };