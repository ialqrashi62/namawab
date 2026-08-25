// tier311_gsor_1492_engine.js — General Surgery OR Scheduling
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

const ROOMS = ['OR-1','OR-2','OR-3','OR-4'];
const SLOTS = ['08:00-11:00','11:00-14:00','14:00-17:00'];

function t311_e1_or_slot_book(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.surgeon_id, 'sg'); ensureEnum(req.room, 'rm', ROOMS);
  ensureEnum(req.slot, 'sl', SLOTS); ensureStr(req.date, 'dt');
  ensureEnum(req.case_type, 'ct', ['elective','urgent','emergency']);
  const conflict = (req.booked || []).some(b => b.room === req.room && b.slot === req.slot && b.date === req.date);
  if (conflict) throw new ValidationError('OR slot already booked', 'slot');
  return { booking_id: `or_${Date.now()}`, status: 'booked', room: req.room, slot: req.slot,
    date: req.date, surgeon_id: req.surgeon_id, case_type: req.case_type };
}

function t311_e2_or_schedule_list(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.date, 'dt');
  const list = (req.booked || []).filter(b => b.date === req.date);
  return { date: req.date, total: list.length, utilization_pct: Math.round(list.length / (ROOMS.length * SLOTS.length) * 100), items: list };
}

function t311_e3_or_case_update(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.booking_id, 'bid');
  ensureEnum(req.action, 'ac', ['reschedule','cancel','complete','start']);
  return { booking_id: req.booking_id, action: req.action, updated_at: new Date().toISOString(), status: req.action === 'complete' ? 'completed' : req.action === 'cancel' ? 'cancelled' : req.action === 'start' ? 'in_progress' : 'rescheduled' };
}

function t311_e4_preop_clearance_check(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureBool(req.asa_high, 'asa');
  ensureBool(req.anticoagulated, 'antico'); ensureBool(req.fasting_ok, 'fst');
  const blockers = [];
  if (req.anticoagulated) blockers.push('hold_anticoagulant');
  if (!req.fasting_ok) blockers.push('nil_by_mouth_violation');
  return { clearance: blockers.length === 0 ? 'cleared' : 'held', blockers, checked_at: new Date().toISOString() };
}

function t311_e5_or_utilization_report(req) {
  ensureStr(req.tenant_id, 'tid'); ensureNum(req.month_booked, 'mb'); ensureNum(req.month_capacity, 'mc');
  if (req.month_capacity <= 0) throw new ValidationError('capacity must be > 0', 'mc');
  const pct = Math.round((req.month_booked / req.month_capacity) * 100);
  return { month_booked: req.month_booked, month_capacity: req.month_capacity, utilization_pct: pct, benchmark: pct >= 75 ? 'on_target' : 'under_utilized' };
}

function funcs() { return { t311_e1_or_slot_book, t311_e2_or_schedule_list, t311_e3_or_case_update, t311_e4_preop_clearance_check, t311_e5_or_utilization_report }; }
module.exports = { funcs, ValidationError };
