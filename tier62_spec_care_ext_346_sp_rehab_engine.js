// filepath: tier62_spec_care_ext_346_sp_rehab_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pt_evaluation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reason, 'reason');
  ensureStr(req.rom, 'rom');
  ensureStr(req.strength, 'strength');
  ensureStr(req.gait, 'gait');
  ensureStr(req.balance, 'bal');
  ensureNum(req.pain_score, 'ps');
  ensureStr(req.goals, 'goals');
  ensureStr(req.plan, 'plan');
  return { reason: req.reason };
}
function ot_evaluation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reason, 'reason');
  ensureNum(req.adl_score, 'as');
  ensureStr(req.fine_motor, 'fm');
  ensureStr(req.sensory, 'sens');
  ensureStr(req.cognitive_screen, 'cs');
  ensureStr(req.goals, 'goals');
  ensureStr(req.plan, 'plan');
  return { reason: req.reason };
}
function speech_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reason, 'reason');
  ensureEnum(req.swallow_screen, 'ssc', ['passed','failed','inconclusive','not_done','refused']);
  ensureStr(req.modified_barium_swallow, 'mbs');
  ensureStr(req.language, 'lang');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.plan, 'plan');
  return { reason: req.reason };
}
function rehab_progress_note(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.week_number, 'wn');
  ensureStr(req.goals_progress, 'gp');
  ensureStr(req.barriers, 'bar');
  ensureStr(req.next_week_plan, 'nwp');
  ensureEnum(req.patient_engagement, 'pe', ['low','moderate','high','declining','variable']);
  ensureNum(req.discharge_estimated, 'de');
  return { week: req.week_number };
}
function rehab_discharge(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.discharge_reason, 'dr');
  ensureStr(req.functional_improvement, 'fi');
  ensureStr(req.home_program, 'hp');
  ensureBool(req.follow_up_pcp, 'fup');
  ensureStr(req.equipment_ordered, 'eo');
  ensureNum(req.patient_satisfaction, 'ps');
  return { reason: req.discharge_reason };
}

function funcs() { return { pt_evaluation, ot_evaluation, speech_eval, rehab_progress_note, rehab_discharge }; }
module.exports = { funcs, ValidationError };