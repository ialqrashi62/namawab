// filepath: tier159_inv_749_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function inventory(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.item_id, 'ii');
  ensureEnum(req.category, 'ct', ['medication','supply','equipment','device','implant','consumable','reagent','other','NA']);
  ensureStr(req.sku, 'sk');
  ensureStr(req.name, 'nm');
  ensureNum(req.quantity, 'qt');
  ensureNum(req.reorder_level, 'rl');
  ensureNum(req.reorder_quantity, 'rq');
  ensureNum(req.cost_per_unit, 'cu');
  ensureStr(req.unit, 'un');
  ensureNum(req.expiration_date, 'ed');
  ensureNum(req.last_restock_days, 'lr');
  ensureStr(req.location, 'lc');
  ensureStr(req.provider, 'pr');
  return { iv_id: `ivn_${Date.now()}`, item_id: req.item_id, category: req.category };
}
function purchase_order(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.po_id, 'pi');
  ensureStr(req.vendor, 'vd');
  ensureNum(req.total_amount, 'ta');
  ensureEnum(req.status, 'st', ['draft','submitted','approved','partial','received','closed','cancelled','NA']);
  ensureNum(req.line_items, 'li');
  ensureNum(req.order_date, 'od');
  ensureNum(req.expected_date, 'ed');
  ensureNum(req.actual_date, 'ad');
  ensureBool(req.invoice_match, 'im');
  ensureBool(req.approval_required, 'ar');
  ensureNum(req.lead_time_days, 'lt');
  ensureStr(req.provider, 'pr');
  return { po_id: `po_${Date.now()}`, po_id2: req.po_id, status: req.status };
}
function par_level(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.ward, 'wd');
  ensureNum(req.usage_per_day, 'up');
  ensureNum(req.lead_time_days, 'lt');
  ensureNum(req.safety_stock, 'ss');
  ensureNum(req.reorder_point, 'rp');
  ensureNum(req.usage_variance_pct, 'uv');
  ensureNum(req.stockouts_30d, 'st');
  ensureNum(req.overstock_cost, 'oc');
  ensureEnum(req.method, 'me', ['min_max','EOQ','just_in_time','two_bin','Kanban','par','perpetual','periodic','NA']);
  ensureStr(req.provider, 'pr');
  return { pl_id: `plv_${Date.now()}`, ward: req.ward };
}
function recall(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.recall_id, 'ri');
  ensureStr(req.item_id, 'ii');
  ensureStr(req.lot_number, 'ln');
  ensureEnum(req.severity, 'sv', ['class_I_life_threatening','class_II_moderate','class_III_low','advisory','NA','other']);
  ensureStr(req.reason, 'rs');
  ensureNum(req.affected_quantity, 'aq');
  ensureNum(req.recovered_quantity, 'rq');
  ensureBool(req.notified_fda, 'nf');
  ensureBool(req.notified_patients, 'np');
  ensureNum(req.days_to_complete, 'dc');
  ensureStr(req.provider, 'pr');
  return { rc_id: `rcl_${Date.now()}`, recall_id: req.recall_id, severity: req.severity };
}
function equipment(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.equipment_id, 'ei');
  ensureEnum(req.type, 'tp', ['pump','ventilator','monitor','defibrillator','X_ray','CT','MRI','ultrasound','scope','laser','robot','sterilizer','refrigerator','freezer','centrifuge','microscope','analyser','other','NA']);
  ensureStr(req.manufacturer, 'mf');
  ensureStr(req.model, 'mo');
  ensureStr(req.serial, 'sn');
  ensureNum(req.install_date, 'id');
  ensureNum(req.last_pm, 'lp');
  ensureNum(req.next_pm, 'np');
  ensureEnum(req.status, 'st', ['active','out_of_service','maintenance','recalled','retired','loaner','NA']);
  ensureNum(req.usage_hours, 'uh');
  ensureStr(req.provider, 'pr');
  return { eq_id: `eqp_${Date.now()}`, equipment_id: req.equipment_id, type: req.type };
}

function funcs() { return { inventory, purchase_order, par_level, recall, equipment }; }
module.exports = { funcs, ValidationError };