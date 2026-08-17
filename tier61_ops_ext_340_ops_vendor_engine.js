// filepath: tier61_ops_ext_340_ops_vendor_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function vendor_master(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.vendor_name, 'vn');
  ensureStr(req.tax_id, 'ti');
  ensureEnum(req.category, 'cat', ['medical_supplies','pharmaceuticals','it_services','consulting','equipment','maintenance','food_services','cleaning']);
  ensureStr(req.primary_contact, 'pc');
  ensureEnum(req.payment_terms, 'pt', ['net_15','net_30','net_45','net_60','net_90','immediate','cod','prepaid']);
  ensureEnum(req.status, 'st', ['active','pending','suspended','terminated','blacklisted']);
  ensureNum(req.evaluation_score, 'es');
  return { vendor: req.vendor_name };
}
function vendor_po(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.po_number, 'pon');
  ensureStr(req.vendor_id, 'vi');
  ensureNum(req.items_count, 'ic');
  ensureNum(req.total_amount, 'ta');
  ensureStr(req.delivery_date, 'dd');
  ensureStr(req.approver, 'app');
  ensureEnum(req.approval_status, 'as', ['draft','pending','approved','rejected','cancelled','partial']);
  return { po: req.po_number };
}
function vendor_invoice(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.invoice_no, 'inv');
  ensureStr(req.po_number, 'pon');
  ensureBool(req.matched, 'mat');
  ensureNum(req.discrepancies, 'disc');
  ensureStr(req.payment_due, 'pd');
  ensureNum(req.amount, 'amt');
  ensureEnum(req.status, 'st', ['pending_payment','paid','disputed','on_hold','cancelled','overdue']);
  return { invoice: req.invoice_no };
}
function vendor_scorecard(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.vendor_id, 'vi');
  ensureStr(req.period, 'per');
  ensureNum(req.quality, 'q');
  ensureNum(req.delivery, 'd');
  ensureNum(req.comms, 'c');
  ensureNum(req.overall, 'o');
  ensureEnum(req.action, 'act', ['renew','renegotiate','terminate','probation','continue','review']);
  return { vendor: req.vendor_id };
}
function vendor_compliance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.vendor_id, 'vi');
  ensureBool(req.license_check, 'lc');
  ensureBool(req.insurance_check, 'ic');
  ensureBool(req.sla_compliance, 'sla');
  ensureStr(req.audit_date, 'ad');
  ensureStr(req.next_review, 'nr');
  return { vendor: req.vendor_id };
}

function funcs() { return { vendor_master, vendor_po, vendor_invoice, vendor_scorecard, vendor_compliance }; }
module.exports = { funcs, ValidationError };