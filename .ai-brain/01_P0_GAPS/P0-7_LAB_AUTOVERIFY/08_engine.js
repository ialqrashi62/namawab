/**
 * Lab Autoverify — Engine
 */

'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { LOINC: 'LOINC 2.77', CBAHI: 'CBAHI Lab Standards' };

function autoverifyRules(input) {
  const { test_loinc, value, unit, reference_low, reference_high, critical_low, critical_high, delta_pct } = input;
  let status = 'verified';
  let flags = [];

  if (value < critical_low || value > critical_high) { status = 'critical'; flags.push('CRITICAL_VALUE'); }
  else if (value < reference_low || value > reference_high) { status = 'abnormal'; flags.push('OUT_OF_RANGE'); }
  if (delta_pct && Math.abs(delta_pct) > 50) { status = 'review_required'; flags.push('DELTA_CHECK_FAIL'); }

  return { test_loinc, status, flags, value, unit, reference_low, reference_high };
}

function criticalValueAlert(input) {
  const { test_loinc, value, critical_low, critical_high, patient_id, ordering_provider } = input;
  const is_critical = value < critical_low || value > critical_high;
  return {
    is_critical,
    alert_level: is_critical ? 'CRITICAL' : 'NORMAL',
    patient_id,
    ordering_provider,
    action_required: is_critical ? 'NOTIFY_PROVIDER_WITHIN_30_MIN' : 'ROUTINE',
    timestamp: new Date().toISOString(),
    citation: CITATIONS.CBAHI,
  };
}

function deltaCheck(input) {
  const { current_value, previous_value, threshold_pct } = input;
  if (previous_value === 0) return { delta_pct: 0, flagged: false };
  const delta_pct = ((current_value - previous_value) / previous_value) * 100;
  return { delta_pct: Math.round(delta_pct * 100) / 100, flagged: Math.abs(delta_pct) > threshold_pct };
}

function reflexTesting(input) {
  const { primary_test_loinc, primary_value, reflex_rules } = input;
  const triggered = (reflex_rules || []).filter(r => r.trigger_condition(primary_value));
  return { primary_test: primary_test_loinc, primary_value, reflex_tests_triggered: triggered.map(t => t.test_loinc) };
}

function qcStatusCheck(input) {
  const { qc_values, mean, sd, westgard_rules } = input;
  const violations = (westgard_rules || ['1_3s', '2_2s', 'R_4s']).filter(rule => {
    if (rule === '1_3s') return qc_values.some(v => Math.abs(v - mean) > 3 * sd);
    if (rule === '2_2s') return qc_values.filter(v => Math.abs(v - mean) > 2 * sd).length >= 2;
    if (rule === 'R_4s') return Math.max(...qc_values) - Math.min(...qc_values) > 4 * sd;
    return false;
  });
  return { violations, qc_pass: violations.length === 0, citation: CITATIONS.CBAHI };
}

module.exports = {
  autoverifyRules, criticalValueAlert, deltaCheck, reflexTesting, qcStatusCheck,
  CITATIONS, ValidationError,
};