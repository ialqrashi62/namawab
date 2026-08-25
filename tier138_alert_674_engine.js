// filepath: tier138_alert_674_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function smart_alert(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.alert_type, 'at', ['lab_critical','vital_abnormal','med_error','interaction','dose','allergy','sepsis','code','stroke','STEMI','PE','other']);
  ensureEnum(req.severity, 'sv', ['info','warning','urgent','critical','life_threatening']);
  ensureStr(req.message, 'ms');
  ensureStr(req.to_provider, 'tp');
  ensureStr(req.delivery_channels, 'dc');
  ensureNum(req.score, 'sc');
  ensureBool(req.acknowledged, 'ac');
  return { sa_id: `sa_${Date.now()}`, alert_id: req.alert_id, severity: req.severity, score: req.score };
}
function rule_engine(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.rule_id, 'rid');
  ensureStr(req.rule_name, 'rn');
  ensureEnum(req.trigger, 'tr', ['lab','vital','med','order','time','lab_trend','vital_trend','lab_pattern','med_pattern','context']);
  ensureStr(req.condition, 'cd');
  ensureStr(req.action, 'ac');
  ensureBool(req.active, 'ac2');
  ensureNum(req.fire_count, 'fc');
  ensureStr(req.provider, 'pr');
  return { re_id: `re_${Date.now()}`, rule_id: req.rule_id, fires: req.fire_count };
}
function suppression(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.alert_id, 'aid');
  ensureEnum(req.reason, 'rs', ['duplicate','ack_in_process','provider_snoozed','already_known','patient_optout','false_positive','resolved','criteria_not_met','escalation_chain','other']);
  ensureStr(req.suppressed_by, 'sb');
  ensureBool(req.silent, 'si');
  ensureNum(req.duration_min, 'du');
  ensureStr(req.provider, 'pr');
  return { sp_id: `sp_${Date.now()}`, alert_id: req.alert_id, reason: req.reason, suppressed_by: req.suppressed_by };
}
function escalation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.alert_id, 'aid');
  ensureEnum(req.tier_level, 'tl', ['1_nurse','2_charge','3_resident','4_attending','5_specialist','6_ICU','7_RRT','8_code_team','9_admin','10_chief']);
  ensureStr(req.escalated_to, 'et');
  ensureNum(req.escalation_time_min, 'et2');
  ensureEnum(req.reason, 'rs', ['no_ack','overdue','critical','score_high','multiple_sources','unable_to_reach','outside_scope','unusual_pattern','VIP','family_request']);
  ensureStr(req.provider, 'pr');
  ensureBool(req.resolved, 'rv');
  return { es_id: `es_${Date.now()}`, alert_id: req.alert_id, tier: req.tier_level, escalated_to: req.escalated_to };
}
function feedback(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.alert_id, 'aid');
  ensureEnum(req.feedback_type, 'ft', ['acknowledge','override','mark_useful','mark_useless','suggest_change','comment','escalate','mute','mute_all','test']);
  ensureStr(req.provider, 'pr');
  ensureBool(req.actionable, 'ac');
  ensureStr(req.reason, 'rs');
  ensureNum(req.satisfaction_score, 'ss');
  ensureStr(req.improvement_suggestion, 'is');
  return { fb_id: `fb_${Date.now()}`, alert_id: req.alert_id, feedback_type: req.feedback_type, satisfaction: req.satisfaction_score };
}

function funcs() { return { smart_alert, rule_engine, suppression, escalation, feedback }; }
module.exports = { funcs, ValidationError };
