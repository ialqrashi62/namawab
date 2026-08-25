// filepath: tier141_ops_673_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function bed_assign(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.unit, 'un', ['ICU','CCU','NICU','PICU','ED','med_surg','peds','OB','psych','rehab','LTC','stepdown','isolation','day_surgery']);
  ensureEnum(req.bed_type, 'bt', ['standard','telemetry','negative_pressure','positive_pressure','bariatric','birthing','dialysis','seclusion','isolation','private','semi_private','ward']);
  ensureStr(req.room_id, 'ri');
  ensureNum(req.expected_los, 'el');
  ensureEnum(req.isolation, 'is', ['none','droplet','airborne','contact','enteric','chemo','radiation','reverse','protective','neutropenic']);
  ensureStr(req.provider, 'pr');
  return { ba_id: `ba_${Date.now()}`, patient_id: req.patient_id, unit: req.unit, room: req.room_id, bed_type: req.bed_type };
}
function staff_assign(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.staff_id, 'si');
  ensureStr(req.shift_id, 'shi');
  ensureEnum(req.role, 'ro', ['RN','LPN','MD','PA','NP','tech','aide','therapist','dietitian','social_worker','case_manager','translator','chaplain','unit_secretary']);
  ensureStr(req.unit, 'un');
  ensureEnum(req.shift, 'sh', ['day','evening','night','swing','weekend','oncall','prn','custom']);
  ensureNum(req.patient_ratio, 'pr');
  ensureBool(req.senior, 'sn');
  ensureStr(req.supervisor, 'sp');
  return { sa_id: `sa_${Date.now()}`, staff_id: req.staff_id, role: req.role, shift: req.shift, unit: req.unit };
}
function utilization(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.unit, 'un');
  ensureStr(req.period, 'pp');
  ensureNum(req.bed_count, 'bc');
  ensureNum(req.bed_days, 'bd');
  ensureNum(req.occupied_days, 'od');
  ensureNum(req.occupancy_pct, 'op');
  ensureNum(req.avg_los, 'al');
  ensureNum(req.turnover, 'tn');
  ensureStr(req.provider, 'pr');
  return { ut_id: `ut_${Date.now()}`, unit: req.unit, occupancy: req.occupancy_pct, avg_los: req.avg_los };
}
function housekeeping(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.task_id, 'ti');
  ensureStr(req.room_id, 'ri');
  ensureEnum(req.task_type, 'tt', ['cleaning','terminal_disinfection','UV_disinfection','deep_clean','spill_cleanup','biohazard','trash_removal','linen_change','restocking','inspection']);
  ensureEnum(req.priority, 'pr', ['low','medium','high','STAT','preventive']);
  ensureNum(req.estimated_min, 'em');
  ensureStr(req.assigned_to, 'at');
  ensureEnum(req.status, 'st', ['pending','in_progress','completed','failed','escalated','verified']);
  ensureStr(req.provider, 'pr');
  return { hs_id: `hs_${Date.now()}`, task_id: req.task_id, type: req.task_type, status: req.status };
}
function transport(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.order_id, 'oi');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['patient_transfer','specimen','equipment','medication','meal','clean_supplies','soiled_supplies','decoding','other']);
  ensureEnum(req.priority, 'pr', ['routine','urgent','STAT','emergency']);
  ensureEnum(req.mode, 'md', ['walking','wheelchair','bed','stretcher','cart','tube_system','AGV','drone','teleport']);
  ensureStr(req.from_location, 'fl');
  ensureStr(req.to_location, 'tl');
  ensureStr(req.provider, 'pr');
  return { tr_id: `tr_${Date.now()}`, order_id: req.order_id, type: req.type, mode: req.mode, status: req.status };
}

function funcs() { return { bed_assign, staff_assign, utilization, housekeeping, transport }; }
module.exports = { funcs, ValidationError };
