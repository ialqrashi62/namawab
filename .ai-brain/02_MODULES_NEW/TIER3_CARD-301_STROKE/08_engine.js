/**
 * Stroke Center — Engine
 * NamaMedical TIER3_CARD-301_STROKE
 * Pure functions for stroke clinical scoring.
 */

'use strict';

class ValidationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
  }
}

const CITATIONS = {
  AHA_ASA_2019: 'AHA/ASA 2019 Guidelines for Early Management of Patients with Acute Ischemic Stroke',
  AHA_ASA_2021: 'AHA/ASA 2021 Guidelines for the Management of Spontaneous Intracerebral Hemorrhage',
  ESO_2021: 'European Stroke Organisation (ESO) Guidelines',
  MOH_2024: 'Saudi MoH Stroke Program 2024 Update',
};

/**
 * NIHSS (National Institutes of Health Stroke Scale) — 0-42
 * Components: 11 items, total 0-42
 */
function nihssScore(input) {
  const items = [
    'consciousness', 'gaze', 'visual_fields', 'facial_palsy',
    'motor_arm_left', 'motor_arm_right', 'motor_leg_left', 'motor_leg_right',
    'limb_ataxia', 'sensory', 'language', 'dysarthria', 'extinction'
  ];
  let total = 0;
  for (const k of items) {
    const v = input[k];
    if (v === undefined || v === null) {
      throw new ValidationError('MISSING', `Missing NIHSS item: ${k}`);
    }
    if (v < 0 || v > 4) {
      throw new ValidationError('OUT_OF_RANGE', `Invalid score for ${k}: ${v}`);
    }
    total += v;
  }
  let severity = 'minor';
  if (total >= 21) severity = 'severe';
  else if (total >= 16) severity = 'moderate_severe';
  else if (total >= 6) severity = 'moderate';
  return {
    score: total,
    severity,
    citation: CITATIONS.AHA_ASA_2019,
    recommendation: severity === 'severe' ? 'Urgent neuro-IR consultation for thrombectomy consideration' : 'Standard stroke pathway',
  };
}

/**
 * ASPECTS (Alberta Stroke Program Early CT Score) — 0-10
 */
function aspectsScore(input) {
  const regions = ['caudate', 'lentiform', 'internal_capsule', 'insular_ribbon',
                   'mca_m1', 'mca_m2', 'mca_m3', 'mca_m4', 'mca_m5', 'mca_m6'];
  let total = 10;
  const affected = [];
  for (const r of regions) {
    if (input[r] === 1) {
      total -= 1;
      affected.push(r);
    }
  }
  let prognosis = 'favorable';
  if (total <= 5) prognosis = 'poor_eligible_excluded';
  else if (total <= 7) prognosis = 'borderline';
  return {
    score: total,
    affected_regions: affected,
    prognosis,
    citation: CITATIONS.AHA_ASA_2019,
  };
}

/**
 * Modified Rankin Scale (mRS) — 0-6 (functional outcome)
 */
function mrsScore(input) {
  const valid = [0, 1, 2, 3, 4, 5, 6];
  const score = parseInt(input.score);
  if (!valid.includes(score)) {
    throw new ValidationError('INVALID', `mRS must be 0-6, got: ${score}`);
  }
  const descriptions = {
    0: 'No symptoms',
    1: 'No significant disability',
    2: 'Slight disability — independent in ADL',
    3: 'Moderate disability — requires some help',
    4: 'Moderately severe disability — unable to walk without assistance',
    5: 'Severe disability — bedridden, incontinent',
    6: 'Dead',
  };
  return {
    score,
    description: descriptions[score],
    favorable_outcome: score <= 2,
    citation: CITATIONS.AHA_ASA_2019,
  };
}

/**
 * ICH Score (Hemphill 2001) — 0-6 mortality
 */
function ichScore(input) {
  const { gcs, age, ich_volume, ivh, infratentorial } = input;
  let score = 0;
  if (gcs >= 13) score += 0;
  else if (gcs >= 5) score += 1;
  else score += 2;
  if (age >= 80) score += 1;
  if (ich_volume >= 30) score += 1;
  if (ivh) score += 1;
  if (infratentorial) score += 1;
  const mortality = {
    0: 0.0, 1: 0.13, 2: 0.26, 3: 0.51, 4: 0.71, 5: 0.85, 6: 1.0,
  };
  return {
    score,
    mortality_30d: mortality[score] || null,
    citation: CITATIONS.AHA_ASA_2021,
  };
}

/**
 * Hunt-Hess Scale (SAH Grade) — 1-5
 */
function huntHess(input) {
  const grade = parseInt(input.grade);
  if (grade < 1 || grade > 5) {
    throw new ValidationError('INVALID', 'Hunt-Hess grade must be 1-5');
  }
  const descriptions = {
    1: 'Asymptomatic or mild headache',
    2: 'Moderate to severe headache, nuchal rigidity',
    3: 'Lethargy, mild focal deficit',
    4: 'Stupor, severe deficit',
    5: 'Coma, decerebrate posture',
  };
  return {
    grade,
    description: descriptions[grade],
    surgical_urgency: grade >= 3 ? 'urgent' : 'elective',
    citation: CITATIONS.AHA_ASA_2021,
  };
}

/**
 * ABCD2 Score (TIA risk) — 0-7
 */
function abcd2Score(input) {
  const { age, bp, clinical_features, duration, diabetes } = input;
  let score = 0;
  if (age >= 60) score += 1;
  if (bp_systolic = parseInt(bp) || 0, bp_systolic >= 140 || (parseInt(input.bp_diastolic) || 0) >= 90) score += 1;
  if (clinical_features === 'unilateral_weakness') score += 2;
  else if (clinical_features === 'speech_disturbance') score += 1;
  if (duration === '>=60min') score += 2;
  else if (duration === '10-59min') score += 1;
  if (diabetes) score += 1;
  let risk = 'low';
  if (score >= 6) risk = 'high';
  else if (score >= 4) risk = 'moderate';
  return {
    score,
    risk,
    stroke_2d: { low: 0.01, moderate: 0.04, high: 0.08 }[risk],
    stroke_7d: { low: 0.02, moderate: 0.06, high: 0.12 }[risk],
    citation: CITATIONS.AHA_ASA_2019,
  };
}

/**
 * CHA2DS2-VASc Score — 0-9 AF stroke risk
 */
function cha2ds2vascScore(input) {
  const { age, sex, chf, htn, stroke_prior, tia_prior, thromboembolism, vascular, diabetes } = input;
  let score = 0;
  if (age >= 75) score += 2;
  else if (age >= 65) score += 1;
  if (sex === 'female') score += 1;
  if (chf) score += 1;
  if (htn) score += 1;
  if (stroke_prior) score += 2;
  if (tia_prior) score += 1;
  if (thromboembolism) score += 1;
  if (vascular) score += 1;
  if (diabetes) score += 1;
  const anticoag_recommendation = score >= 2 ? 'recommended' : (score === 1 ? 'consider' : 'no');
  return {
    score,
    anticoag_recommendation,
    citation: CITATIONS.AHA_ASA_2019,
  };
}

/**
 * HAS-BLED Score — 0-9 bleeding risk
 */
function hasBledScore(input) {
  const { htn, renal, liver, stroke_prior, bleeding_prior, labile_inr, elderly, drugs, alcohol } = input;
  let score = 0;
  if (htn) score += 1;
  if (renal) score += 1;
  if (liver) score += 1;
  if (stroke_prior) score += 1;
  if (bleeding_prior) score += 1;
  if (labile_inr) score += 1;
  if (elderly) score += 1;
  if (drugs) score += 1;
  if (alcohol) score += 1;
  const high_bleed_risk = score >= 3;
  return {
    score,
    high_bleed_risk,
    message: high_bleed_risk ? 'Caution: high bleed risk — closer monitoring, correct modifiable risk factors' : 'Acceptable bleed risk',
    citation: CITATIONS.AHA_ASA_2019,
  };
}

/**
 * Tenecteplase Dosing — Saudi MoH 2024
 */
function tenecteplaseDose(input) {
  const weight = parseFloat(input.weight_kg);
  const age = parseInt(input.age);
  if (!weight || weight < 30 || weight > 200) {
    throw new ValidationError('INVALID_WEIGHT', `Weight must be 30-200 kg, got: ${weight}`);
  }
  const dose_mg = Math.min(weight * 0.25, 25);
  return {
    dose_mg: Math.round(dose_mg * 10) / 10,
    single_iv_bolus: true,
    administration: 'Single IV bolus over 5-10 seconds',
    renal_adjustment: age >= 75 ? 'Consider Alteplase instead' : 'None',
    citation: CITATIONS.MOH_2024,
  };
}

/**
 * Thrombolysis Eligibility Check
 */
function thrombolysisEligibility(input) {
  const { age, tlkw_minutes, nihss, ct_hemorrhage, inr, platelets, recent_surgery, recent_stroke, active_bleeding, bp_systolic, bp_diastolic } = input;
  const exclusions = [];
  if (ct_hemorrhage) exclusions.push('CT_shows_hemorrhage');
  if (tlkw_minutes > 270) exclusions.push('Outside_4.5h_window');
  if (inr > 1.7) exclusions.push('INR_above_1.7');
  if (platelets < 100000) exclusions.push('Thrombocytopenia_lt_100k');
  if (recent_surgery && parseInt(input.surgery_days_ago) < 14) exclusions.push('Recent_major_surgery_lt_14d');
  if (recent_stroke && parseInt(input.prior_stroke_days_ago) < 90) exclusions.push('Prior_stroke_lt_90d');
  if (active_bleeding) exclusions.push('Active_internal_bleeding');
  if (parseInt(bp_systolic) > 185 || parseInt(bp_diastolic) > 110) exclusions.push('BP_above_185_110');
  if (parseInt(nihss) < 4) exclusions.push('NIHSS_below_4_minor_stroke');
  if (parseInt(age) > 80) exclusions.push('Age_above_80_consider_risk');
  const eligible = exclusions.length === 0;
  return {
    eligible,
    exclusions,
    agent: eligible ? 'tenecteplase' : 'none',
    citation: CITATIONS.AHA_ASA_2019,
  };
}

/**
 * Door-to-Needle Time Compliance
 */
function doorToNeedleCompliance(input) {
  const minutes = parseInt(input.minutes);
  const compliant = minutes <= 60;
  return {
    minutes,
    compliant,
    target: 60,
    recommendation: compliant ? 'Within target' : 'Above target — review for QI opportunity',
    citation: CITATIONS.AHA_ASA_2019,
  };
}

/**
 * Secondary Prevention Bundle — 5 elements
 */
function secondaryPreventionBundle(input) {
  const { antiplatelet, statin, anticoagulation, bp_control, lifestyle } = input;
  const elements = {
    antiplatelet: !!antiplatelet,
    statin: !!statin,
    anticoagulation: !!anticoagulation,
    bp_control: !!bp_control,
    lifestyle: !!lifestyle,
  };
  const complete = Object.values(elements).every(Boolean);
  return {
    elements,
    complete,
    completeness_pct: Math.round((Object.values(elements).filter(Boolean).length / 5) * 100),
    citation: CITATIONS.AHA_ASA_2019,
  };
}

module.exports = {
  nihssScore,
  aspectsScore,
  mrsScore,
  ichScore,
  huntHess,
  abcd2Score,
  cha2ds2vascScore,
  hasBledScore,
  tenecteplaseDose,
  thrombolysisEligibility,
  doorToNeedleCompliance,
  secondaryPreventionBundle,
  CITATIONS,
  ValidationError,
};
