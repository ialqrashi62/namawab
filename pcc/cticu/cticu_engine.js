/**
 * pcc/cticu/cticu_engine.js — PCC #11: Cardiothoracic ICU
 * 10 deterministic functions for post-cardiac-surgery care.
 *
 * Compliance: STS · EACTS · AATS · AHA/ACC.
 * Audience: Cardiac intensivist / perfusionist / CT surgeon.
 */
'use strict';

function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f) / f; }

/**
 * 1. ChestTubeOutput — post-op bleeding threshold.
 * @param {{ hourlyOutput: number[], consecutiveHours: number }} input
 * @returns {{ total: number, severity: 'minimal'|'mild'|'moderate'|'severe', takebackIndicated: boolean }}
 */
function ChestTubeOutput({ hourlyOutput, consecutiveHours }) {
  const total = hourlyOutput.reduce((s, n) => s + n, 0);
  const max = Math.max(...hourlyOutput, 0);
  const consecutive = consecutiveHours;
  const severity = total > 1500 || max > 400 ? 'severe' :
                   total > 1000 || max > 250 ? 'moderate' :
                   total > 500 ? 'mild' : 'minimal';
  return {
    total,
    severity,
    takebackIndicated: severity === 'severe' || (severity === 'moderate' && consecutive >= 2),
  };
}

/**
 * 2. PostCPBHemodynamics — vasoactive titration after cardiopulmonary bypass.
 * @param {{ map: number, cvp: number, cardiacIndex: number, svr: number, hr: number }} input
 * @returns {{ state: 'warm_dry'|'warm_wet'|'cold_dry'|'cold_wet', action: 'volume'|'vasodilator'|'inotrope'|'vasopressor'|'combined' }}
 */
function PostCPBHemodynamics({ map, cvp, cardiacIndex, svr, hr }) {
  const warm = cardiacIndex >= 2.2;
  const wet = cvp >= 12;
  if (warm && !wet) return { state: 'warm_dry', action: 'observation' };
  if (warm && wet) return { state: 'warm_wet', action: 'vasodilator' };
  if (!warm && !wet) return { state: 'cold_dry', action: 'volume' };
  return { state: 'cold_wet', action: 'combined' };
}

/**
 * 3. PacemakerWires — temporary epicardial pacing.
 * @param {{ mode: 'AAI'|'VVI'|'DDD', rate: number, capture: boolean, thresholdMA: number }} input
 * @returns {{ status: 'functional'|'failure_to_capture'|'undersensing'|'normal', nextStep: string }}
 */
function PacemakerWires({ mode, rate, capture, thresholdMA }) {
  if (!capture) return { status: 'failure_to_capture', nextStep: 'increase_output_to_2x_threshold' };
  if (thresholdMA > 5) return { status: 'normal', nextStep: 'consider_rewire_if_persistent' };
  if (rate < 60) return { status: 'undersensing', nextStep: 'check_sensing_threshold' };
  return { status: 'functional', nextStep: 'continue_current_settings' };
}

/**
 * 4. IABPCounterpulsation — intra-aortic balloon pump timing.
 * @param {{ inflationTime: 'early'|'correct'|'late', deflationTime: 'early'|'correct'|'late' }} input
 * @returns {{ timingQuality: 'optimal'|'suboptimal'|'poor', adjustment: string }}
 */
function IABPCounterpulsation({ inflationTime, deflationTime }) {
  if (inflationTime === 'correct' && deflationTime === 'correct') {
    return { timingQuality: 'optimal', adjustment: 'no_change' };
  }
  if (inflationTime === 'late' || deflationTime === 'early') {
    return { timingQuality: 'poor', adjustment: 'decrease_balloon_volume' };
  }
  if (inflationTime === 'early' || deflationTime === 'late') {
    return { timingQuality: 'poor', adjustment: 'increase_balloon_volume' };
  }
  return { timingQuality: 'suboptimal', adjustment: 'reassess_within_2_hours' };
}

/**
 * 5. PostOpAtrialFibrillation — rate & rhythm control.
 * @param {{ rateBpm: number, hemodynamicsStable: boolean, durationHours: number, chadsVasc: number }} input
 * @returns {{ controlStrategy: 'rhythm'|'rate'|'observation', agent: string, anticoagulation: 'yes'|'no' }}
 */
function PostOpAtrialFibrillation({ rateBpm, hemodynamicsStable, durationHours, chadsVasc }) {
  if (!hemodynamicsStable) return { controlStrategy: 'rhythm', agent: 'amiodarone', anticoagulation: chadsVasc >= 2 ? 'yes' : 'no' };
  if (rateBpm >= 130) return { controlStrategy: 'rate', agent: 'metoprolol', anticoagulation: chadsVasc >= 2 ? 'yes' : 'no' };
  if (durationHours >= 24) return { controlStrategy: 'rhythm', agent: 'amiodarone', anticoagulation: chadsVasc >= 2 ? 'yes' : 'no' };
  return { controlStrategy: 'observation', agent: 'none', anticoagulation: 'no' };
}

/**
 * 6. SwanGanzProfile — pulmonary artery catheter interpretation.
 * @param {{ cvp: number, pas: number, pad: number, pcwp: number, co: number }} input
 * @returns {{ profile: string, leftFunction: 'preserved'|'depressed', rightFunction: 'preserved'|'depressed' }}
 */
function SwanGanzProfile({ cvp, pas, pad, pcwp, co }) {
  const leftDepressed = pcwp >= 18;
  const rightDepressed = cvp >= 12;
  let profile = 'normal';
  if (leftDepressed && co < 4) profile = 'cardiogenic_shock';
  else if (leftDepressed) profile = 'left_heart_failure';
  else if (rightDepressed) profile = 'right_heart_failure';
  else if (pas >= 35) profile = 'pulmonary_hypertension';
  return {
    profile,
    leftFunction: leftDepressed ? 'depressed' : 'preserved',
    rightFunction: rightDepressed ? 'depressed' : 'preserved',
  };
}

/**
 * 7. VasoactiveScore — Vasoactive-Inotropic Score.
 * @param {{ dopamine: number, dobutamine: number, epinephrine: number, norepinephrine: number, vasopressin: number, milrinone: number }} input
 * @returns {{ vis: number, category: 'low'|'moderate'|'high'|'extreme' }}
 */
function VasoactiveScore(d) {
  const vis =
    d.dopamine + d.dobutamine +
    100 * d.epinephrine + 100 * d.norepinephrine +
    10000 * d.vasopressin + 10 * d.milrinone;
  const category = vis >= 45 ? 'extreme' : vis >= 20 ? 'high' : vis >= 5 ? 'moderate' : 'low';
  return { vis: round(vis, 1), category };
}

/**
 * 8. PostOpMI — universal definition of MI after cardiac surgery.
 * @param {{ troponinFold: number, newSTChanges: boolean, wallMotionAbnormality: boolean, chestPain: boolean, daysPostOp: number }} input
 * @returns {{ likelyMI: boolean, type: 1|2|4a|5, urgency: 'stat'|'urgent'|'routine' }}
 */
function PostOpMI({ troponinFold, newSTChanges, wallMotionAbnormality, chestPain, daysPostOp }) {
  if (daysPostOp > 1 && troponinFold >= 10 && (newSTChanges || wallMotionAbnormality)) {
    return { likelyMI: true, type: 5, urgency: 'urgent' };
  }
  if (daysPostOp <= 1 && troponinFold >= 5 && chestPain) {
    return { likelyMI: true, type: '4a', urgency: 'stat' };
  }
  if (troponinFold >= 3) return { likelyMI: true, type: 2, urgency: 'urgent' };
  return { likelyMI: false, type: 2, urgency: 'routine' };
}

/**
 * 9. Mediastinitis — deep sternal wound infection surveillance.
 * @param {{ daysPostOp: number, fever: boolean, woundDrainage: boolean, sternalInstability: boolean, leukocytosis: boolean }} input
 * @returns {{ risk: 'low'|'intermediate'|'high', imaging: 'none'|'ct'|'mri', surgicalReexplore: boolean }}
 */
function Mediastinitis({ daysPostOp, fever, woundDrainage, sternalInstability, leukocytosis }) {
  const score = (fever ? 1 : 0) + (woundDrainage ? 3 : 0) + (sternalInstability ? 3 : 0) + (leukocytosis ? 1 : 0);
  const risk = score >= 4 ? 'high' : score >= 2 ? 'intermediate' : 'low';
  return {
    risk,
    imaging: risk === 'high' ? 'ct' : 'none',
    surgicalReexplore: woundDrainage && sternalInstability,
  };
}

/**
 * 10. WeaningFromVent — post-CABG fast-track protocol.
 * @param {{ peep: number, fio2: number, tidalVolume: number, rr: number, spo2: number, mentalStatus: 'awake'|'sedated', minutesOnVent: number }} input
 * @returns {{ readyToExtubate: boolean, rsbi: number, supportLevel: 'full'|'cpap'|'tpiece'|'extubated' }}
 */
function WeaningFromVent({ peep, fio2, tidalVolume, rr, spo2, mentalStatus, minutesOnVent }) {
  const rsbi = (rr / tidalVolume) * 1000;
  const readyToExtubate = peep <= 5 && fio2 <= 0.4 && spo2 >= 92 && mentalStatus === 'awake' && rsbi < 105 && minutesOnVent >= 240;
  let supportLevel = 'full';
  if (readyToExtubate) supportLevel = 'extubated';
  else if (peep <= 5 && fio2 <= 0.5) supportLevel = 'tpiece';
  else if (peep <= 8) supportLevel = 'cpap';
  return { readyToExtubate, rsbi: round(rsbi, 1), supportLevel };
}

module.exports = {
  ChestTubeOutput, PostCPBHemodynamics, PacemakerWires, IABPCounterpulsation,
  PostOpAtrialFibrillation, SwanGanzProfile, VasoactiveScore, PostOpMI,
  Mediastinitis, WeaningFromVent,
};
