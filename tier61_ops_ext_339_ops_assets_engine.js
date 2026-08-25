// filepath: tier61_ops_ext_339_ops_assets_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function asset_inventory(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.asset_tag, 'at');
  ensureEnum(req.category, 'cat', ['medical_equipment','it_hardware','furniture','vehicle','building','software','consumable']);
  ensureStr(req.serial, 'sn');
  ensureStr(req.location, 'loc');
  ensureEnum(req.status, 'st', ['active','in_storage','in_repair','retired','disposed','lost']);
  ensureNum(req.cost, 'cost');
  ensureEnum(req.depreciation_method, 'dm', ['straight_line','double_declining','units_of_production','macrs','none']);
  return { tag: req.asset_tag };
}
function asset_depreciation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.asset_tag, 'at');
  ensureNum(req.salvage_value, 'sv');
  ensureNum(req.useful_life_years, 'uly');
  ensureEnum(req.method, 'meth', ['straight_line','double_declining','units_of_production','macrs','none']);
  ensureNum(req.annual_dep, 'ad');
  ensureNum(req.accumulated, 'acc');
  ensureNum(req.book_value, 'bv');
  return { method: req.method };
}
function asset_disposal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.asset_tag, 'at');
  ensureEnum(req.disposal_method, 'dm', ['recycled','donated','sold','destroyed','landfill','returned_to_vendor']);
  ensureEnum(req.reason, 'rsn', ['obsolete','damaged','end_of_life','replaced','recalled','sold']);
  ensureStr(req.reason_text, 'rt');
  ensureStr(req.compliance, 'comp');
  ensureStr(req.disposal_date, 'dd');
  ensureNum(req.value_at_disposal, 'vd');
  return { method: req.disposal_method };
}
function asset_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureNum(req.assets_counted, 'ac');
  ensureNum(req.discrepancies, 'disc');
  ensureStr(req.follow_up_action, 'fua');
  ensureStr(req.auditor, 'aud');
  ensureStr(req.date, 'date');
  return { audit: req.audit_id };
}
function asset_maintenance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.asset_tag, 'at');
  ensureEnum(req.maintenance_type, 'mt', ['preventive','corrective','predictive','routine','emergency','calibration']);
  ensureStr(req.next_due, 'nd');
  ensureStr(req.technician, 'tech');
  ensureNum(req.parts_cost, 'pc');
  ensureNum(req.downtime_hours, 'dth');
  ensureBool(req.recurring, 'rec');
  return { type: req.maintenance_type };
}

function funcs() { return { asset_inventory, asset_depreciation, asset_disposal, asset_audit, asset_maintenance }; }
module.exports = { funcs, ValidationError };