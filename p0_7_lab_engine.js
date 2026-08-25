/**
 * P0-7 Lab Autoverify Engine
 */
'use strict';

const CITATIONS = { LOINC: 'LOINC 2.77', CBAHI: 'CBAHI Lab Standards' };

function autoverifyRules(input) {
  const { test_loinc, value, reference_low, reference_high, critical_low, critical_high } = input;
  let status = 'verified';
  const flags = [];
  if (value < critical_low || value > critical_high) { status = 'critical'; flags.push('CRITICAL_VALUE'); }
  else if (value < reference_low || value > reference_high) { status = 'abnormal'; flags.push('OUT_OF_RANGE'); }
  return { test_loinc, status, flags, value };
}

function criticalValueAlert(input) {
  const { test_loinc, value, critical_low, critical_high, patient_id } = input;
  const is_critical = value < critical_low || value > critical_high;
  return { is_critical, alert_level: is_critical ? 'CRITICAL' : 'NORMAL', patient_id, action_required: is_critical ? 'NOTIFY_PROVIDER' : 'ROUTINE', citation: CITATIONS.CBAHI };
}

function deltaCheck(input) {
  const { current_value, previous_value, threshold_pct } = input;
  if (previous_value === 0) return { delta_pct: 0, flagged: false };
  const delta_pct = ((current_value - previous_value) / previous_value) * 100;
  return { delta_pct: Math.round(delta_pct * 100) / 100, flagged: Math.abs(delta_pct) > threshold_pct };
}

function reflexTesting(input) {
  const { reflex_rules } = input;
  return { triggered: (reflex_rules || []).length, tests: (reflex_rules || []).map(r => r.test_loinc) };
}

function qcStatusCheck(input) {
  const { qc_values, mean, sd } = input;
  const violations = (qc_values || []).filter(v => Math.abs(v - mean) > 2 * sd).length > 0;
  return { violations, qc_pass: !violations };
}

module.exports = { autoverifyRules, criticalValueAlert, deltaCheck, reflexTesting, qcStatusCheck, CITATIONS };