// filepath: tier168_reh_783_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function rehab_assessment(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.diagnosis, 'dx', ['stroke','TBI','SCI','amputation','fracture','joint_replacement','other','NA']);
  ensureNum(req.admission_fim, 'af'); ensureNum(req.current_fim, 'cf');
  ensureEnum(req.mobility, 'mo', ['independent','wheelchair','bedbound','walker','cane','NA']);
  ensureEnum(req.cognitive, 'co', ['intact','mild_impairment','moderate','severe','NA']);
  ensureNum(req.goals_count, 'gc'); ensureNum(req.days_in_program, 'di');
  ensureEnum(req.disposition, 'dp', ['continue','discharge','transfer','NA']);
  ensureStr(req.provider, 'pr');
  return { ra_id: `ra_${Date.now()}`, patient_id: req.patient_id, fim_gain: req.current_fim - req.admission_fim };
}

function rehab_goals(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.goal_type, 'gt', ['mobility','ADL','communication','cognition','community','NA']);
  ensureNum(req.target_date, 'td'); ensureNum(req.progress_pct, 'pp');
  ensureEnum(req.barriers, 'ba', ['none','fatigue','pain','cognitive','social','multiple','NA']);
  ensureEnum(req.support, 'su', ['family','none','paid','combination','NA']);
  ensureBool(req.modified, 'mo'); ensureNum(req.score, 'sc');
  ensureStr(req.provider, 'pr');
  return { rg_id: `rg_${Date.now()}`, patient_id: req.patient_id, goal: req.goal_type, prog: req.progress_pct };
}

function functional_progress(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.fim_baseline, 'fb');
  ensureNum(req.fim_current, 'fc'); ensureNum(req.fim_gain, 'fg');
  ensureNum(req.mobility_score, 'ms'); ensureNum(req.adl_score, 'as');
  ensureNum(req.balance_score, 'bs'); ensureNum(req.days, 'dy');
  ensureStr(req.provider, 'pr');
  return { fp_id: `fp_${Date.now()}`, patient_id: req.patient_id, fim: req.fim_current, days: req.days };
}

function discharge_planning(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.destination, 'de', ['home','SNF','rehab','acute','home_health','NA']);
  ensureEnum(req.caregiver, 'cg', ['spouse','family','paid','none','combination','NA']);
  ensureNum(req.equipment_count, 'ec'); ensureBool(req.home_mod, 'hm');
  ensureNum(req.followup_appointments, 'fa'); ensureNum(req.barriers_resolved, 'br');
  ensureEnum(req.disposition, 'di', ['home','SNF','rehab','transfer','NA']);
  ensureStr(req.provider, 'pr');
  return { dp_id: `dp_${Date.now()}`, patient_id: req.patient_id, dest: req.destination, eq: req.equipment_count };
}

function adaptive_equipment(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.equipment_type, 'et', ['wheelchair','walker','cane','prosthetic','orthotic','communication','NA']);
  ensureNum(req.trial_days, 'td'); ensureNum(req.satisfaction, 'sa');
  ensureEnum(req.comfort, 'co', ['excellent','good','fair','poor','NA']);
  ensureNum(req.training_hours, 'th'); ensureNum(req.followup_days, 'fd');
  ensureStr(req.provider, 'pr');
  return { ae_id: `ae_${Date.now()}`, patient_id: req.patient_id, type: req.equipment_type, sat: req.satisfaction };
}

function funcs() { return { rehab_assessment, rehab_goals, functional_progress, discharge_planning, adaptive_equipment }; }
module.exports = { funcs, ValidationError };