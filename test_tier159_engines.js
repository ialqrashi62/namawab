// filepath: test_tier159_engines.js
const modules = [
  { mod: 'tier159_hos_747', fns: ['bed','staffing','incident','quality_metric','risk_mgmt'] },
  { mod: 'tier159_cmp_748', fns: ['hipaa','audit','accreditation','training','license'] },
  { mod: 'tier159_inv_749', fns: ['inventory','purchase_order','par_level','recall','equipment'] },
  { mod: 'tier159_fin_750', fns: ['billing','insurance_claim','denial','ar_followup','revenue'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier159_hos_747') {
    if (fn === 'bed') return { ...base, ward: 'ICU', bed_number: 5, status: 'occupied', los_hours: 48, isolation: 'none', acuity_score: 5, admit_source: 'ER', discharge_planning: 'in_progress', attending: 'dr_a' };
    if (fn === 'staffing') return { ...base, staff_id: 's1', role: 'RN', hours_worked: 12, hours_overtime: 0, patients_assigned: 4, acuity_avg: 3, break_taken: true, lunch_taken: true, turnover_count: 1, admissions_count: 1, discharges_count: 0, incident_reported: false };
    if (fn === 'incident') return { ...base, incident_id: 'i1', type: 'patient_fall', severity: 'mild', location: 'ward', reporter: 'r1', witness: true, root_cause_analysis: true, corrective_action: true, reportable_to_state: false, followup_days: 7 };
    if (fn === 'quality_metric') return { ...base, month: 8, year: 2026, metric: 'fall_rate', numerator: 5, denominator: 1000, rate: 0.5, benchmark: 0.4, benchmark_pct_diff: 25, analysis: 'worse', action_plan: true };
    if (fn === 'risk_mgmt') return { ...base, risk_id: 'r1', category: 'clinical', severity: 'moderate', likelihood: 3, impact_score: 4, inherent_risk: 12, residual_risk: 6, response: 'mitigate', mitigation_plan: true, review_days: 30 };
  }
  if (modName === 'tier159_cmp_748') {
    if (fn === 'hipaa') return { ...base, event_id: 'e1', event_type: 'unauthorized_access', records_affected: 50, phi_involved: true, severity: 'moderate', breach_notification_required: true, notification_days: 30, hhs_reported: true, media_reported: false, fine_amount: 50000, root_cause: true };
    if (fn === 'audit') return { ...base, audit_id: 'a1', scope: 'clinical', auditor: 'external', start_date: 20260101, end_date: 20260201, findings_count: 5, major_findings: 1, minor_findings: 4, recommendations: 5, status: 'closed', followup_required: true };
    if (fn === 'accreditation') return { ...base, body: 'JCI', standard: 'JCI', cycle_year: 2026, survey_date: 20260801, status: 'accredited', findings_count: 2, requirements_improvement: 0, compliance_evidence: true, cycle_years: 3 };
    if (fn === 'training') return { ...base, staff_id: 's1', module: 'HIPAA', format: 'online', duration_min: 60, completion_date: 20260801, expiration_date: 20270801, score: 90, pass: 'pass', cert_required: true };
    if (fn === 'license') return { ...base, staff_id: 's1', license_type: 'RN', license_number: 'RN12345', issue_date: 20200101, expiration_date: 20270801, state: 'CA', status: 'active', renewal_days: 90, cee_credits: 30, cee_required: 30 };
  }
  if (modName === 'tier159_inv_749') {
    if (fn === 'inventory') return { ...base, item_id: 'i1', category: 'medication', sku: 'AMOX500', name: 'Amoxicillin', quantity: 1000, reorder_level: 200, reorder_quantity: 500, cost_per_unit: 0.5, unit: 'tablet', expiration_date: 20270301, last_restock_days: 14, location: 'main_pharmacy' };
    if (fn === 'purchase_order') return { ...base, po_id: 'po1', vendor: 'Pharma Co', total_amount: 50000, status: 'approved', line_items: 10, order_date: 20260801, expected_date: 20260815, actual_date: 0, invoice_match: false, approval_required: true, lead_time_days: 14 };
    if (fn === 'par_level') return { ...base, ward: 'ICU', usage_per_day: 50, lead_time_days: 7, safety_stock: 100, reorder_point: 250, usage_variance_pct: 15, stockouts_30d: 0, overstock_cost: 0, method: 'min_max' };
    if (fn === 'recall') return { ...base, recall_id: 'rc1', item_id: 'i1', lot_number: 'L123', severity: 'class_II_moderate', reason: 'contamination', affected_quantity: 100, recovered_quantity: 80, notified_fda: true, notified_patients: false, days_to_complete: 14 };
    if (fn === 'equipment') return { ...base, equipment_id: 'e1', type: 'ventilator', manufacturer: 'Hamilton', model: 'G5', serial: 'S12345', install_date: 20200101, last_pm: 20260801, next_pm: 20270201, status: 'active', usage_hours: 10000 };
  }
  if (modName === 'tier159_fin_750') {
    if (fn === 'billing') return { ...base, encounter_id: 'e1', total_charge: 5000, insurance_payment: 4000, patient_payment: 500, writeoff_amount: 500, balance: 0, status: 'paid', cpt_count: 5, icd_count: 3, modifier_count: 2, coding_complete: true };
    if (fn === 'insurance_claim') return { ...base, claim_id: 'c1', payer: 'Aetna', policy_id: 'p1', charge_amount: 5000, paid_amount: 4000, patient_responsibility: 500, status: 'paid', denial_count: 0, denial_reason: 'none', days_to_pay: 30 };
    if (fn === 'denial') return { ...base, claim_id: 'c1', reason: 'medical_necessity', amount_denied: 1000, appealed: true, appeal_outcome: 'overturned', appeal_days: 30, recovered_amount: 1000 };
    if (fn === 'ar_followup') return { ...base, account_id: 'a1', days_in_ar: 45, balance: 500, last_payment_days: 60, last_contact_days: 7, status: '31_60', next_action: 'phone_call', calls_count: 2, payments_count: 1 };
    if (fn === 'revenue') return { ...base, month: 8, year: 2026, service_line: 'inpatient', gross_revenue: 1000000, net_revenue: 800000, contribution_margin: 200000, charges_count: 1000, collections_count: 900, denial_rate_pct: 5 };
  }
  return base;
}
let pass = 0, fail = 0;
for (const { mod, fns } of modules) {
  const m = require(`./${mod}_engine.js`);
  const F = m.funcs();
  for (const fn of fns) {
    try {
      F[fn](makeBody(mod, fn));
      console.log(`OK ${mod}.${fn}`);
      pass++;
    } catch (e) {
      console.error(`FAIL ${mod}.${fn}: ${e.message}`);
      fail++;
    }
  }
}
console.log(`TOTALS: pass=${pass} fail=${fail}`);
process.exit(fail > 0 ? 1 : 0);