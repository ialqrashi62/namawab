// filepath: tier142_sm_678_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function preparticipation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.sport, 'sp', ['football','soccer','basketball','baseball','tennis','gym','running','swimming','cycling','boxing','MMA','gymnastics','ice_hockey','skiing','wrestling','cricket','rugby','other']);
  ensureEnum(req.clearance, 'cl', ['cleared','cleared_with_restrictions','not_cleared','referred','deferred','pending']);
  ensureStr(req.fitness_level, 'fl');
  ensureNum(req.max_hr, 'mh');
  ensureStr(req.provider, 'pr');
  return { pp_id: `pp_${Date.now()}`, patient_id: req.patient_id, sport: req.sport, clearance: req.clearance };
}
function injury_assess(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.injury_id, 'ii');
  ensureEnum(req.body_part, 'bp', ['head','neck','shoulder','elbow','wrist','hand','back','hip','thigh','knee','shin','ankle','foot','chest','abdomen']);
  ensureEnum(req.type, 'tp', ['sprain','strain','fracture','dislocation','concussion','laceration','contusion','spasm','tendonitis','sprain_ligament','meniscus','ACL','MCL','Rotator_cuff','labrum','stress_fx','other']);
  ensureEnum(req.severity, 'sv', ['1_mild','2_moderate','3_severe','4_complete','unknown']);
  ensureEnum(req.mechanism, 'mc', ['acute','overuse','contact','non_contact','gradual','unknown']);
  ensureStr(req.ret_plan, 'rp');
  ensureStr(req.provider, 'pr');
  return { ia_id: `ia_${Date.now()}`, injury_id: req.injury_id, body_part: req.body_part, severity: req.severity };
}
function concussion(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.scat5_score, 'sc');
  ensureNum(req.imPact_score, 'im');
  ensureEnum(req.grade, 'gd', ['0_none','1_mild','2_moderate','3_severe','4_very_severe']);
  ensureNum(req.symptoms_count, 'sy');
  ensureBool(req.lose_consciousness, 'lc');
  ensureNum(req.days_since_injury, 'ds');
  ensureEnum(req.return_to_play, 'rp', ['day','next_day','week','2_weeks','month','season','retired','never','unknown']);
  ensureStr(req.provider, 'pr');
  return { con_id: `con_${Date.now()}`, patient_id: req.patient_id, scat5: req.scat5_score, grade: req.grade };
}
function rehab(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.program_id, 'pi');
  ensureEnum(req.phase, 'ph', ['acute','subacute','strengthening','proprioception','return_to_sport','maintenance','pre_hab']);
  ensureNum(req.sessions_completed, 'sc');
  ensureNum(req.sessions_planned, 'sp');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.range_motion_pct, 'ro');
  ensureStr(req.exercise, 'ex');
  ensureStr(req.provider, 'pr');
  return { rh_id: `rh_${Date.now()}`, patient_id: req.patient_id, phase: req.phase, completed: req.sessions_completed };
}
function performance(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.sport, 'sp');
  ensureNum(req.vo2_max, 'vo');
  ensureNum(req.body_fat_pct, 'bf');
  ensureNum(req.muscle_mass_kg, 'mm');
  ensureNum(req.grip_strength_kg, 'gs');
  ensureNum(req.vertical_jump_cm, 'vj');
  ensureNum(req.sprint_40m_sec, 's4');
  ensureStr(req.provider, 'pr');
  return { pr_id: `pr_${Date.now()}`, patient_id: req.patient_id, vo2_max: req.vo2_max, vertical_jump: req.vertical_jump_cm };
}

function funcs() { return { preparticipation, injury_assess, concussion, rehab, performance }; }
module.exports = { funcs, ValidationError };
