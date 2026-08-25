// filepath: tier117_workflow_615_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function handoff_sbar(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.handoff_id, 'hid');
  ensureStr(req.sender, 'snd');
  ensureStr(req.receiver, 'rcv');
  ensureEnum(req.sbar_format, 'sf', ['standard','short','long','other','unknown']);
  ensureStr(req.situation, 'sit');
  ensureStr(req.background, 'bg');
  ensureStr(req.assessment, 'assess');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.completeness_score, 'cs');
  ensureStr(req.provider, 'pr');
  return { hid: req.handoff_id };
}
function protocol_activation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.protocol_id, 'pid');
  ensureStr(req.protocol_name, 'pn');
  ensureStr(req.trigger_criteria, 'tc');
  ensureStr(req.activation_time, 'at');
  ensureStr(req.activated_by, 'ab');
  ensureNum(req.steps_completed, 'scp');
  ensureNum(req.total_steps, 'ts');
  ensureStr(req.provider, 'pr');
  return { pid: req.protocol_id };
}
function order_set(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.order_set_id, 'oid');
  ensureStr(req.specialty, 'sp');
  ensureNum(req.orders_count, 'oc');
  ensureBool(req.allergies_checked, 'ac');
  ensureNum(req.providers_involved, 'pi');
  ensureNum(req.estimated_cost_dollars, 'ecd');
  ensureStr(req.provider, 'pr');
  return { oid: req.order_set_id };
}
function rounding_list(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.rounding_id, 'rid');
  ensureStr(req.unit, 'unit');
  ensureNum(req.patient_count, 'pc');
  ensureNum(req.issues_discussed, 'id');
  ensureNum(req.actions_taken, 'at');
  ensureNum(req.discharge_plans, 'dp');
  ensureStr(req.provider, 'pr');
  return { rid: req.rounding_id };
}
function discharge_checklist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.checklist_id, 'cid');
  ensureNum(req.completed_items, 'ci');
  ensureNum(req.total_items, 'ti');
  ensureNum(req.pending_items, 'pi');
  ensureNum(req.complications_predicted, 'cp');
  ensureEnum(req.discharge_disposition, 'dd', ['home','home_health','rehab','snf','ltach','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.checklist_id };
}

function funcs() { return { handoff_sbar, protocol_activation, order_set, rounding_list, discharge_checklist }; }
module.exports = { funcs, ValidationError };