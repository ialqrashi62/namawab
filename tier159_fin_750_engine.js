// filepath: tier159_fin_750_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function billing(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.encounter_id, 'ei');
  ensureNum(req.total_charge, 'tc');
  ensureNum(req.insurance_payment, 'ip');
  ensureNum(req.patient_payment, 'pp');
  ensureNum(req.writeoff_amount, 'wa');
  ensureNum(req.balance, 'bl');
  ensureEnum(req.status, 'st', ['draft','submitted','partial_paid','paid','denied','appeal','written_off','collections','NA']);
  ensureNum(req.cpt_count, 'cc');
  ensureNum(req.icd_count, 'ic');
  ensureNum(req.modifier_count, 'mc');
  ensureBool(req.coding_complete, 'cd');
  ensureStr(req.provider, 'pr');
  return { bl_id: `bil_${Date.now()}`, patient_id: req.patient_id, total: req.total_charge };
}
function insurance_claim(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.claim_id, 'ci');
  ensureStr(req.payer, 'py');
  ensureStr(req.policy_id, 'pi');
  ensureNum(req.charge_amount, 'ca');
  ensureNum(req.paid_amount, 'pa');
  ensureNum(req.patient_responsibility, 'pr');
  ensureEnum(req.status, 'st', ['pending','submitted','acknowledged','in_review','approved','partial_paid','denied','appealed','paid','closed','NA']);
  ensureNum(req.denial_count, 'dc');
  ensureStr(req.denial_reason, 'dr');
  ensureNum(req.days_to_pay, 'dp');
  ensureStr(req.provider, 'pr');
  return { ic_id: `icm_${Date.now()}`, claim_id: req.claim_id, status: req.status };
}
function denial(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.claim_id, 'ci');
  ensureEnum(req.reason, 'rs', ['medical_necessity','coverage_terminated','prior_auth','coding_error','duplicate','timely_filing','coordination_of_benefits','out_of_network','experimental','other','NA']);
  ensureNum(req.amount_denied, 'ad');
  ensureBool(req.appealed, 'ap');
  ensureEnum(req.appeal_outcome, 'ao', ['pending','upheld','overturned','partial','NA','other']);
  ensureNum(req.appeal_days, 'ad2');
  ensureNum(req.recovered_amount, 'ra');
  ensureStr(req.provider, 'pr');
  return { dn_id: `dny_${Date.now()}`, claim_id: req.claim_id, reason: req.reason };
}
function ar_followup(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.account_id, 'ai');
  ensureNum(req.days_in_ar, 'da');
  ensureNum(req.balance, 'bl');
  ensureNum(req.last_payment_days, 'lp');
  ensureNum(req.last_contact_days, 'lc');
  ensureEnum(req.status, 'st', ['current','31_60','61_90','91_120','over_120','paid','collections','written_off','NA']);
  ensureEnum(req.next_action, 'na', ['none','statement','phone_call','email','letter','collections','legal','write_off','NA']);
  ensureNum(req.calls_count, 'cc');
  ensureNum(req.payments_count, 'pc');
  ensureStr(req.provider, 'pr');
  return { ar_id: `arf_${Date.now()}`, account_id: req.account_id, days: req.days_in_ar };
}
function revenue(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureNum(req.month, 'mo');
  ensureNum(req.year, 'yr');
  ensureEnum(req.service_line, 'sl', ['inpatient','outpatient','ED','OR','imaging','lab','pharmacy','PT','OT','SLP','dialysis','cardiac_rehab','other','NA']);
  ensureNum(req.gross_revenue, 'gr');
  ensureNum(req.net_revenue, 'nr');
  ensureNum(req.contribution_margin, 'cm');
  ensureNum(req.charges_count, 'cc');
  ensureNum(req.collections_count, 'cl');
  ensureNum(req.denial_rate_pct, 'dr');
  ensureStr(req.provider, 'pr');
  return { rv_id: `rve_${Date.now()}`, service: req.service_line };
}

function funcs() { return { billing, insurance_claim, denial, ar_followup, revenue }; }
module.exports = { funcs, ValidationError };