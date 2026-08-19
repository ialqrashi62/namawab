// filepath: tier141_sup_674_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function inventory(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.item_id, 'ii');
  ensureStr(req.sku, 'sk');
  ensureStr(req.name, 'nm');
  ensureEnum(req.category, 'ct', ['medication','devices','consumables','implants','reagents','PPE','cleaning','food','linen','office','other']);
  ensureNum(req.quantity, 'qt');
  ensureNum(req.par_level, 'pl');
  ensureNum(req.reorder_point, 'rp');
  ensureNum(req.unit_cost, 'uc');
  ensureStr(req.provider, 'pr');
  return { inv_id: `inv_${Date.now()}`, item_id: req.item_id, sku: req.sku, quantity: req.quantity, below_par: req.quantity < req.par_level };
}
function purchase_order(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.po_id, 'pi');
  ensureStr(req.vendor_id, 'vi');
  ensureNum(req.total_amount, 'ta');
  ensureEnum(req.status, 'st', ['draft','pending_approval','approved','sent','partially_received','received','closed','cancelled','invoiced','paid']);
  ensureNum(req.line_count, 'lc');
  ensureStr(req.requestor, 'rq');
  ensureStr(req.approver, 'ap');
  ensureStr(req.provider, 'pr');
  return { po_id: `po_${Date.now()}`, po_id: req.po_id, vendor: req.vendor_id, status: req.status, total: req.total_amount };
}
function shortage(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.item_id, 'ii');
  ensureEnum(req.severity, 'sv', ['info','warning','critical','catastrophic']);
  ensureNum(req.days_until_stockout, 'ds');
  ensureStr(req.alternatives, 'al');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.burn_rate_per_day, 'br');
  ensureStr(req.provider, 'pr');
  return { sh_id: `sh_${Date.now()}`, item_id: req.item_id, severity: req.severity, days_until_stockout: req.days_until_stockout };
}
function recall(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.recall_id, 'ri');
  ensureStr(req.item_id, 'ii');
  ensureEnum(req.class, 'cl', ['I_critical','II_moderate','III_low']);
  ensureStr(req.reason, 'rs');
  ensureNum(req.units_affected, 'ua');
  ensureNum(req.units_recovered, 'ur');
  ensureStr(req.notifying_body, 'nb');
  ensureStr(req.provider, 'pr');
  return { rc_id: `rc_${Date.now()}`, recall_id: req.recall_id, item_id: req.item_id, class: req.class, units_recovered: req.units_recovered };
}
function cost_analysis(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.item_id, 'ii');
  ensureNum(req.purchase_cost, 'pc');
  ensureNum(req.usage_count, 'uc');
  ensureNum(req.waste_count, 'wc');
  ensureNum(req.waste_pct, 'wp');
  ensureNum(req.outcome_score, 'os');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  return { ca_id: `ca_${Date.now()}`, item_id: req.item_id, usage: req.usage_count, waste_pct: req.waste_pct };
}

function funcs() { return { inventory, purchase_order, shortage, recall, cost_analysis }; }
module.exports = { funcs, ValidationError };
