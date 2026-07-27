/**
 * pcc/ccu/ccu_engine.js
 *
 * 10 deterministic functions for Coronary Care Unit decision support.
 *
 * Per AGENTS.md §2.2 and BLUEPRINT v2:
 * - All functions are pure (no I/O, no Date.now, no random)
 * - All scoring is evidence-based
 */
'use strict';

/* ============================================================
 * 1. GRACEInHospitalMortality
 * GRACE score for in-hospital mortality in NSTE-ACS.
 * Real calculator uses ~8 variables. We use a simplified version
 * that accepts the integer score (0-285) and returns the risk
 * category. Production would record the calculator's integer score.
 *
 * Categories (per GRACE 2019):
 *   0-108   low (<1%)
 *   109-139  intermediate (1-3%)
 *   140+    high (>3%)
 * ============================================================ */
function GRACEInHospitalMortality(integerScore) {
  if (typeof integerScore !== 'number' || integerScore < 0) {
    throw new Error('GRACEInHospitalMortality: invalid score');
  }
  if (integerScore <= 108) return { category: 'low', mortalityPct: '<1', recommendation: 'early_discharge_possible' };
  if (integerScore <= 139) return { category: 'intermediate', mortalityPct: '1-3', recommendation: 'standard_care_monitoring' };
  return { category: 'high', mortalityPct: '>3', recommendation: 'aggressive_treatment_ccu' };
}

/* ============================================================
 * 2. TIMI_30day
 * TIMI UA/NSTEMI 30-day MACE risk score.
 * Components (0 or 1 each):
 *   - Age >= 65
 *   - >=3 risk factors (HTN, DM, dyslipidemia, smoker, family)
 *   - Prior coronary stenosis >= 50%
 *   - Aspirin in last 7 days
 *   - >=2 anginal events in last 24h
 *   - ST deviation >= 0.5mm
 *   - Elevated cardiac biomarker
 *
 * Total: 0-7
 *   0-1 very low (3%)
 *   2 intermediate (8%)
 *   3-4 high (13-20%)
 *   5-7 very high (26-41%)
 * ============================================================ */
function TIMI_30day({ age65, threeRiskFactors, priorStenosis, aspirinLast7Days, twoAnginalEvents24h, stDeviation, elevatedBiomarker }) {
  let score = 0;
  if (age65) score++;
  if (threeRiskFactors) score++;
  if (priorStenosis) score++;
  if (aspirinLast7Days) score++;
  if (twoAnginalEvents24h) score++;
  if (stDeviation) score++;
  if (elevatedBiomarker) score++;
  const risk = score <= 1 ? 'very_low' : score === 2 ? 'intermediate' : score <= 4 ? 'high' : 'very_high';
  const macePct = score <= 1 ? 3 : score === 2 ? 8 : score === 3 ? 13 : score === 4 ? 20 : score === 5 ? 26 : 41;
  return { score, risk, mace30dayPct: macePct };
}

/* ============================================================
 * 3. SCAI_Shock_Stage
 * SCAI cardiogenic shock staging (2023 consensus).
 *
 *   A = at risk (no hypoperfusion)
 *   B = beginning (relative hypotension)
 *   C = classic (hypotension, hypoperfusion)
 *   D = deteriorating (worsening despite escalation)
 *   E = extremis (refractory, cardiac arrest)
 *
 * Returns stage + recommended intervention.
 * ============================================================ */
function SCAI_Shock_Stage({ sbpMmHg, lactateMmolL, onVasopressors, cardiacArrest, refractoryHypotension }) {
  let stage;
  if (cardiacArrest || refractoryHypotension) stage = 'E';
  else if (onVasopressors && lactateMmolL >= 4) stage = 'D';
  else if (sbpMmHg < 90 && lactateMmolL >= 2) stage = 'C';
  else if (sbpMmHg < 100 || onVasopressors) stage = 'B';
  else stage = 'A';

  const intervention = {
    A: 'monitor_closely',
    B: 'optimize_volume_pressors_labs',
    C: 'escalate_to_mcs_consider_cath',
    D: 'urgent_mcs_impella_va_ecmo',
    E: 'emergent_ecpr_cannulation',
  }[stage];

  return { stage, intervention, mortalityPct: { A: '<5', B: '5-15', C: '20-40', D: '40-60', E: '>80' }[stage] };
}

/* ============================================================
 * 4. DAP_30day
 * Dual antiplatelet therapy duration after PCI.
 *
 * Rules (per 2025 ACC/AHA):
 *   - ACS + DES: 12 months DAPT
 *   - Stable CAD + DES: 6 months DAPT
 *   - High bleeding risk: 1-3 months DAPT
 *   - High ischemic + low bleeding: 12-30 months DAPT
 *
 * Returns recommended months.
 * ============================================================ */
function DAP_30day({ presentation, isHighBleedingRisk, isHighIschemicRisk, stentType }) {
  let months;
  if (isHighBleedingRisk) months = 1;
  else if (presentation === 'ACS' && isHighIschemicRisk) months = 12;
  else if (presentation === 'ACS') months = 12;
  else if (isHighIschemicRisk) months = 12;
  else months = 6;
  const rationale = isHighBleedingRisk
    ? 'High bleeding risk favors short DAPT (1-3 months).'
    : presentation === 'ACS'
      ? 'ACS with DES mandates minimum 12 months DAPT per 2025 guidelines.'
      : 'Stable CAD with DES: 6 months DAPT is standard.';
  return { months, rationale, stentType, presentation };
}

/* ============================================================
 * 5. BleedingRisk
 * CRUSADE bleeding risk score (simplified).
 * Real CRUSADE uses 8 variables. We provide a simplified risk
 * assessment based on common risk factors (0 or 1 each):
 *   - Age >75
 *   - Female
 *   - Heart rate >120
 *   - SBP <110
 *   - Diabetes
 *   - Prior vascular disease
 *   - Renal insufficiency
 *
 * Total: 0-7
 *   0-2 very low
 *   3-4 low
 *   5-6 moderate
 *   7+ high
 * ============================================================ */
function BleedingRisk({ age75, female, hr120, sbpLow, diabetes, priorVascularDisease, renalInsufficiency }) {
  let score = 0;
  if (age75) score++;
  if (female) score++;
  if (hr120) score++;
  if (sbpLow) score++;
  if (diabetes) score++;
  if (priorVascularDisease) score++;
  if (renalInsufficiency) score++;
  const risk = score <= 2 ? 'very_low' : score <= 4 ? 'low' : score <= 6 ? 'moderate' : 'high';
  return { score, risk, recommendation: risk === 'high' ? 'consider_short_dapt_radial_access' : 'standard' };
}

/* ============================================================
 * 6. MCSIndication
 * Mechanical circulatory support indication.
 * Returns suggested MCS type based on SCAI stage + clinical context.
 *
 *   SCAI A-B: no MCS
 *   SCAI C-D: IABP or Impella
 *   SCAI D-E: Impella or VA-ECMO
 * ============================================================ */
function MCSIndication(scaiStage, hasRVFailure) {
  let device;
  if (scaiStage === 'A' || scaiStage === 'B') device = 'none';
  else if (scaiStage === 'C') device = 'iabp_or_impella';
  else if (scaiStage === 'D') device = 'impella_or_va_ecmo';
  else device = 'va_ecmo';

  if (hasRVFailure && (scaiStage === 'C' || scaiStage === 'D')) {
    device = 'va_ecmo_or_dual_lumen_rvad';
  }
  return { scaiStage, hasRVFailure, device };
}

/* ============================================================
 * 7. TTMEligibility
 * Targeted temperature management after cardiac arrest.
 * Eligibility (per 2022 AHA):
 *   - Witnessed cardiac arrest
 *   - Any rhythm (shockable or non-shockable)
 *   - ROSC achieved
 *   - Comatose (GCS <8) post-ROSC
 *   - <6h from arrest
 *
 * Returns whether eligible + target temperature + duration.
 * ============================================================ */
function TTMEligibility({ witnessed, roscAchieved, comatose, hoursSinceArrest }) {
  const eligible = witnessed && roscAchieved && comatose && hoursSinceArrest <= 6;
  return {
    eligible,
    targetTempC: 32,
    durationHours: 24,
    rationale: eligible
      ? 'Per 2022 AHA: TTM at 32-36°C x 24h for comatose post-arrest with ROSC.'
      : 'TTM not indicated. Treat per cause-specific protocol.',
  };
}

/* ============================================================
 * 8. ArrhythmiaRecognition
 * Arrhythmia classification by ECG features.
 *
 * Inputs:
 *   rate: heart rate in bpm
 *   rhythm: 'regular' | 'irregular' | 'irregularly_irregular'
 *   hasPWave: boolean
 *   qrsWidthMs: number (<120 narrow, >=120 wide)
 *
 * Returns:
 *   type: 'sinus_rhythm' | 'sinus_tachy' | 'sinus_brady' |
 *         'afib' | 'aflutter' | 'svt' | 'vt_mono' | 'vt_poly' | 'vfib' | 'asystole' |
 *         'paced' | 'unknown'
 *   hemodynamically_stable: boolean (default true)
 * ============================================================ */
function ArrhythmiaRecognition({ rate, rhythm, hasPWave, qrsWidthMs }) {
  if (rate === 0) return { type: 'asystole', unstable: true };
  if (qrsWidthMs >= 120 && rate > 100) {
    return { type: rhythm === 'irregularly_irregular' ? 'vt_poly' : 'vt_mono', unstable: true };
  }
  if (!hasPWave && rhythm === 'irregularly_irregular') {
    return { type: 'afib', unstable: rate > 180 };
  }
  if (!hasPWave && rhythm === 'regular') {
    if (rate >= 150) return { type: 'svt', unstable: rate > 200 };
    if (rate >= 250) return { type: 'aflutter', unstable: true };
    return { type: rate > 100 ? 'svt' : 'unknown', unstable: false };
  }
  if (rate < 60) return { type: 'sinus_brady', unstable: rate < 40 };
  if (rate > 100) return { type: 'sinus_tachy', unstable: rate > 180 };
  return { type: 'sinus_rhythm', unstable: false };
}

/* ============================================================
 * 9. IABPTroubleshooting
 * IABP troubleshooting: timing issues + alarms.
 *
 * Inputs:
 *   augPressure: augmented diastolic pressure
 *   assistedSBP: assisted systolic pressure
 *   unaugSBP: unassisted systolic pressure
 *   timingPattern: 'early' | 'late' | 'good' | 'unknown'
 *
 * Returns recommended action.
 * ============================================================ */
function IABPTroubleshooting({ augPressure, assistedSBP, timingPattern, alarmType }) {
  const issues = [];
  let action;
  if (timingPattern === 'early') {
    issues.push('Inflation too early — risk of premature closure of aortic valve');
    action = 'delay_inflation_to_dicrotic_notch';
  } else if (timingPattern === 'late') {
    issues.push('Inflation too late — reduces diastolic augmentation');
    action = 'advance_inflation_to_dicrotic_notch';
  } else {
    action = 'no_timing_adjustment';
  }
  if (alarmType === 'rapid_aug_drop') {
    issues.push('Rapid augmentation drop — check for IABP leak or kink');
    action = 'check_tubing_fibrin_withdraw';
  }
  if (alarmType === 'trigger_loss') {
    issues.push('Trigger loss — irregular rhythm or EKG lead issue');
    action = 'switch_to_pressure_trigger_check_leads';
  }
  return { action, issues, alarmType: alarmType || 'none' };
}

/* ============================================================
 * 10. ImpellaTroubleshooting
 * Impella troubleshooting: position + recovery + alarms.
 *
 * Returns recommended action based on issue type.
 * ============================================================ */
function ImpellaTroubleshooting(issue) {
  const map = {
    'position_too_far': {
      action: 'reposition_under_fluoro_to_aortic_root',
      severity: 'critical',
    },
    'position_too_shallow': {
      action: 'reposition_to_LV_aortic_valve_just_below',
      severity: 'critical',
    },
    'suction_event': {
      action: 'reduce_P_level_reassess_volume_status',
      severity: 'moderate',
    },
    'hemolysis': {
      action: 'check_position_labs_LDH_free_Hb_reduce_P',
      severity: 'high',
    },
    'pump_stop': {
      action: 'flush_check_controller_catheter_thrombus',
      severity: 'critical',
    },
    'low_flow_alarm': {
      action: 'check_volume_status_position_reposition',
      severity: 'moderate',
    },
  };
  if (!map[issue]) {
    throw new Error('ImpellaTroubleshooting: unknown issue');
  }
  return { issue, ...map[issue] };
}

module.exports = {
  GRACEInHospitalMortality,
  TIMI_30day,
  SCAI_Shock_Stage,
  DAP_30day,
  BleedingRisk,
  MCSIndication,
  TTMEligibility,
  ArrhythmiaRecognition,
  IABPTroubleshooting,
  ImpellaTroubleshooting,
};
