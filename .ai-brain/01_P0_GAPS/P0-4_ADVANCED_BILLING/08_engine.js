/**
 * Advanced Billing — Engine
 */

'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = {
  NPHIES_2024: 'NPHIES Claim Standards 2024',
  ZATCA_2024: 'ZATCA Phase 2 e-Invoicing',
  SFDA_2024: 'SFDA Drug Codes',
};

/**
 * NPHIES Claim Generation
 */
function nphiesClaim(input) {
  const { patient_id, payer_id, encounter_type, services, diagnosis_codes } = input;
  if (!patient_id || !payer_id || !services || services.length === 0) {
    throw new ValidationError('INVALID', 'patient_id, payer_id, services required');
  }
  const claim_id = `CLM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const total_amount = services.reduce((sum, s) => sum + (s.amount || 0), 0);
  return {
    claim_id,
    status: 'submitted',
    total_amount,
    services_count: services.length,
    encounter_type,
    diagnosis_codes,
    submitted_at: new Date().toISOString(),
    citation: CITATIONS.NPHIES_2024,
  };
}

/**
 * ZATCA Invoice (Phase 2)
 */
function zatcaInvoice(input) {
  const { invoice_lines, buyer_vat_number, seller_vat_number, invoice_type, total } = input;
  const subtotal = invoice_lines.reduce((sum, l) => sum + (l.amount || 0), 0);
  const vat_amount = subtotal * 0.15;
  const grand_total = subtotal + vat_amount;
  const invoice_hash = `HASH-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  return {
    invoice_id: `INV-${Date.now()}`,
    invoice_hash,
    invoice_type,
    subtotal: Math.round(subtotal * 100) / 100,
    vat_amount: Math.round(vat_amount * 100) / 100,
    grand_total: Math.round(grand_total * 100) / 100,
    buyer_vat_number,
    seller_vat_number,
    phase: 2,
    formatted_qr: `ZATCA|${invoice_hash}`,
    citation: CITATIONS.ZATCA_2024,
  };
}

/**
 * SFDA Drug Code Mapping
 */
function sfdaDrugCodeMapping(input) {
  const { drug_name, strength, dosage_form, manufacturer } = input;
  return {
    sfda_code: `SFDA-${Date.now().toString(36).toUpperCase()}`,
    drug_name,
    strength,
    dosage_form,
    manufacturer,
    registered: true,
    registration_date: new Date().toISOString(),
    citation: CITATIONS.SFDA_2024,
  };
}

/**
 * Insurance Pre-Auth
 */
function insurancePreAuth(input) {
  const { member_id, payer_id, service_type, diagnosis, estimated_amount, urgency } = input;
  const auth_id = `AUTH-${Date.now()}`;
  const auto_approved = estimated_amount < 1000 && urgency !== 'emergency';
  return {
    auth_id,
    status: auto_approved ? 'auto_approved' : 'pending_review',
    member_id,
    payer_id,
    service_type,
    diagnosis,
    estimated_amount,
    decision_time_hours: auto_approved ? 0 : urgency === 'emergency' ? 1 : 24,
    citation: CITATIONS.NPHIES_2024,
  };
}

/**
 * VAT Calculation (15%)
 */
function vatCalculation(input) {
  const { amount, exempt } = input;
  if (exempt) return { amount, vat: 0, total: amount, rate: 0 };
  const vat = amount * 0.15;
  return {
    amount: Math.round(amount * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    total: Math.round((amount + vat) * 100) / 100,
    rate: 0.15,
    citation: CITATIONS.ZATCA_2024,
  };
}

/**
 * Denied Claims Management
 */
function deniedClaimsReconsideration(input) {
  const { denial_code, denial_reason, original_claim_id, additional_evidence } = input;
  const valid_denials = {
    'CO-29': 'Time limit expired',
    'CO-97': 'Service bundled',
    'CO-50': 'Not deemed medical necessity',
    'CO-16': 'Missing/invalid information',
    'CO-11': 'Diagnosis inconsistent',
  };
  const can_appeal = denial_code in valid_denials && additional_evidence;
  return {
    appeal_id: `APL-${Date.now()}`,
    original_claim_id,
    denial_code,
    denial_reason,
    can_appeal,
    next_step: can_appeal ? 'Submit appeal with additional documentation' : 'Contact payer',
    citation: CITATIONS.NPHIES_2024,
  };
}

/**
 * Payment Reconciliation
 */
function paymentReconciliation(input) {
  const { billed_amount, paid_amount, adjustments, write_offs } = input;
  const variance = billed_amount - paid_amount - (adjustments || 0) - (write_offs || 0);
  let status = 'reconciled';
  if (Math.abs(variance) > 0.01) status = 'variance';
  return {
    billed_amount,
    paid_amount,
    adjustments: adjustments || 0,
    write_offs: write_offs || 0,
    variance: Math.round(variance * 100) / 100,
    status,
    citation: CITATIONS.NPHIES_2024,
  };
}

/**
 * Bundle Code (NPHIES)
 */
function nphiesBundle(input) {
  const { bundle_type, services } = input;
  const bundles = {
    'Maternity': { coverage_pct: 100, max_amount: 50000 },
    'Cardiology': { coverage_pct: 80, max_amount: 100000 },
    'Oncology': { coverage_pct: 100, max_amount: 500000 },
    'Dialysis': { coverage_pct: 100, max_amount: 80000 },
    'ER': { coverage_pct: 100, max_amount: 5000 },
  };
  return {
    bundle_type,
    coverage: bundles[bundle_type] || { coverage_pct: 0, max_amount: 0 },
    citation: CITATIONS.NPHIES_2024,
  };
}

/**
 * Patient Self-Pay Estimate
 */
function selfPayEstimate(input) {
  const { services, insurance_coverage_pct } = input;
  const total = services.reduce((s, srv) => s + (srv.amount || 0), 0);
  const covered = total * (insurance_coverage_pct / 100);
  const patient_owes = total - covered;
  return {
    total: Math.round(total * 100) / 100,
    insurance_covers: Math.round(covered * 100) / 100,
    patient_owes: Math.round(patient_owes * 100) / 100,
    citation: CITATIONS.NPHIES_2024,
  };
}

/**
 * Refund Processing
 */
function refundProcessing(input) {
  const { original_invoice_id, refund_amount, reason, refund_method } = input;
  return {
    refund_id: `RFD-${Date.now()}`,
    original_invoice_id,
    refund_amount,
    reason,
    refund_method,
    status: 'initiated',
    estimated_days: refund_method === 'cash' ? 0 : 7,
    citation: CITATIONS.ZATCA_2024,
  };
}

module.exports = {
  nphiesClaim, zatcaInvoice, sfdaDrugCodeMapping, insurancePreAuth,
  vatCalculation, deniedClaimsReconsideration, paymentReconciliation,
  nphiesBundle, selfPayEstimate, refundProcessing,
  CITATIONS, ValidationError,
};
