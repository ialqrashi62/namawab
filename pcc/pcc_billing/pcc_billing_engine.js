// P3_CF pcc_billing_engine v3.44.0
'use strict';
function Billing(input) {
  const i = input || {};
  const cpt = String(i.cpt || '');
  let plan = 'standard-billing';
  if (cpt.startsWith('99')) plan = 'EM-code';
  return { plan, cpt };
}
function Charge(input) {
  const i = input || {};
  const amt = Number(i.amt ?? 0);
  let plan = 'no-charge';
  if (amt >= 1000) plan = 'high-dollar-charge';
  else if (amt >= 100) plan = 'standard-charge';
  else if (amt > 0) plan = 'low-charge';
  return { plan, amt };
}
function Insurance(input) {
  const i = input || {};
  const type = String(i.type || '');
  let plan = 'self-pay';
  if (type === 'medicare') plan = 'medicare-claim';
  else if (type === 'medicaid') plan = 'medicaid-claim';
  else if (type === 'commercial') plan = 'commercial-claim';
  return { plan, type };
}
function Discount(input) {
  const i = input || {};
  const pct = Number(i.pct ?? 0);
  let plan = 'no-discount';
  if (pct >= 50) plan = 'charity-care';
  else if (pct >= 25) plan = 'significant-discount';
  else if (pct > 0) plan = 'minor-discount';
  return { plan, pct };
}
function Payment(input) {
  const i = input || {};
  const method = String(i.method || '');
  let plan = 'manual-recon';
  if (method === 'card') plan = 'card-payment';
  else if (method === 'cash') plan = 'cash-payment';
  else if (method === 'check') plan = 'check-payment';
  else if (method === 'ach') plan = 'ACH-payment';
  return { plan, method };
}
function Refund(input) {
  const i = input || {};
  const reason = String(i.reason || '');
  let plan = 'standard-refund';
  if (reason === 'overcharge') plan = 'overcharge-refund';
  else if (reason === 'denial') plan = 'denial-refund';
  else if (reason === 'patient-request') plan = 'patient-refund';
  return { plan, reason };
}
function Statement(input) {
  const i = input || {};
  const fy = String(i.fy || '');
  let plan = 'monthly-statement';
  if (fy === 'quarterly') plan = 'quarterly-statement';
  else if (fy === 'annual') plan = 'annual-summary';
  return { plan, fy };
}
function Denial(input) {
  const i = input || {};
  const code = String(i.code || '');
  let plan = 'appeal-denial';
  if (code === 'CO-97') plan = 'bundled-services';
  else if (code === 'CO-50') plan = 'non-covered-service';
  else if (code === 'CO-16') plan = 'claim-lacks-info';
  return { plan, code };
}
function Reclaim(input) {
  const i = input || {};
  const days = Number(i.days ?? 0);
  let plan = 'normal-flow';
  if (days >= 90) plan = 'collections';
  else if (days >= 60) plan = 'final-notice';
  else if (days >= 30) plan = 'second-notice';
  else if (days > 0) plan = 'first-notice';
  return { plan, days };
}
function Tax(input) {
  const i = input || {};
  const rate = Number(i.rate ?? 0);
  let plan = 'no-tax';
  if (rate >= 0.15) plan = 'high-tax-region';
  else if (rate >= 0.05) plan = 'standard-tax';
  else if (rate > 0) plan = 'low-tax';
  return { plan, rate };
}
module.exports = {
  Billing, Charge, Insurance, Discount, Payment, Refund, Statement, Denial, Reclaim, Tax
};
