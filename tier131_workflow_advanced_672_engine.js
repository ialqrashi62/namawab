// filepath: tier131_workflow_advanced_672_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function care_pathway(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.path_id, 'pid');
  ensureStr(req.pathway_name, 'pn');
  ensureNum(req.steps_completed, 'sc');
  ensureNum(req.total_steps, 'ts');
  ensureStr(req.provider, 'pr');
  return { pid: req.path_id };
}
function task_assignment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.task_id, 'tid');
  ensureStr(req.assignee_id, 'aid');
  ensureEnum(req.priority, 'pri', ['low','medium','high','urgent','other','unknown']);
  ensureStr(req.due_date, 'dd');
  ensureStr(req.provider, 'pr');
  return { tid: req.task_id };
}
function escalation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.esc_id, 'eid');
  ensureEnum(req.from_role, 'fr', ['rn','md','charge','supervisor','other','unknown']);
  ensureEnum(req.to_role, 'tr', ['rn','md','charge','supervisor','admin','other','unknown']);
  ensureStr(req.reason, 'rs');
  ensureStr(req.provider, 'pr');
  return { eid: req.esc_id };
}
function handoff(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.handoff_id, 'hid');
  ensureStr(req.from_provider, 'fp');
  ensureStr(req.to_provider, 'tp');
  ensureEnum(req.format, 'fmt', ['sbar','i_pass_the_baton','verbal','written','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { hid: req.handoff_id };
}
function discharge_summary(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ds_id, 'did');
  ensureNum(req.length_of_stay_days, 'los');
  ensureStr(req.primary_dx, 'pdx');
  ensureNum(req.followup_appointments, 'fua');
  ensureStr(req.provider, 'pr');
  return { did: req.ds_id };
}

function funcs() { return { care_pathway, task_assignment, escalation, handoff, discharge_summary }; }
module.exports = { funcs, ValidationError };