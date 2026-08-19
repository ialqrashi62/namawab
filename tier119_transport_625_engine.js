// filepath: tier119_transport_625_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function transport_request(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.request_id, 'rid');
  ensureEnum(req.transport_type, 'tt', ['wheelchair','stretcher','ambulatory','bed','other','unknown']);
  ensureStr(req.from_location, 'fl');
  ensureStr(req.to_location, 'tl');
  ensureEnum(req.priority, 'pri', ['routine','urgent','stat','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.request_id };
}
function transport_completion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.completion_id, 'cid');
  ensureStr(req.request_id, 'rid');
  ensureStr(req.transporter_id, 'trid');
  ensureNum(req.duration_min, 'dm');
  ensureBool(req.complications, 'cmp');
  ensureStr(req.provider, 'pr');
  return { cid: req.completion_id };
}
function courier_service(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.courier_id, 'cid');
  ensureEnum(req.item_type, 'it', ['lab_specimen','blood_product','medication','document','equipment','other','unknown']);
  ensureStr(req.from_location, 'fl');
  ensureStr(req.to_location, 'tl');
  ensureNum(req.delivery_time_min, 'dtm');
  ensureStr(req.provider, 'pr');
  return { cid: req.courier_id };
}
function equipment_transport(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.transport_id, 'tid');
  ensureStr(req.equipment_type, 'et');
  ensureStr(req.from_unit, 'fu');
  ensureStr(req.to_unit, 'tu');
  ensureBool(req.sanitized, 'sz');
  ensureStr(req.provider, 'pr');
  return { tid: req.transport_id };
}
function transport_dispatch(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dispatch_id, 'did');
  ensureStr(req.dispatcher_id, 'did2');
  ensureNum(req.requests_queued, 'rq');
  ensureNum(req.transporters_available, 'ta');
  ensureStr(req.provider, 'pr');
  return { did: req.dispatch_id };
}

function funcs() { return { transport_request, transport_completion, courier_service, equipment_transport, transport_dispatch }; }
module.exports = { funcs, ValidationError };