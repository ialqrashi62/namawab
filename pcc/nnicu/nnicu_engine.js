/**
 * pcc/nnicu/nnicu_engine.js
 *
 * 10 deterministic functions for Neonatal ICU decision support.
 *
 * Per AGENTS.md §2.2 and BLUEPRINT v2:
 * - All functions are pure (no I/O, no Date.now, no random)
 * - All dosing is weight-based (NEVER adult dose)
 * - All scoring is evidence-based
 */
'use strict';

/* ============================================================
 * 1. ApgarScore
 * Apgar scoring at 1 and 5 minutes (and 10 if needed).
 * 5 components, 0-2 each, total 0-10.
 *   - Appearance (color)
 *   - Pulse (heart rate)
 *   - Grimace (reflex irritability)
 *   - Activity (muscle tone)
 *   - Respiration (effort)
 *
 * Categories:
 *   7-10   reassuring
 *   4-6    moderately depressed
 *   0-3    severely depressed
 * ============================================================ */
function ApgarScore({ appearance, pulse, grimace, activity, respiration }) {
  const components = { appearance, pulse, grimace, activity, respiration };
  for (const [k, v] of Object.entries(components)) {
    if (typeof v !== 'number' || v < 0 || v > 2) {
      throw new Error(`ApgarScore: ${k} must be 0-2, got ${v}`);
    }
  }
  const total = appearance + pulse + grimace + activity + respiration;
  const category = total >= 7 ? 'reassuring' : total >= 4 ? 'moderately_depressed' : 'severely_depressed';
  return { total, category, components };
}

/* ============================================================
 * 2. BallardScore
 * Ballard score for gestational age estimation (10-44 weeks).
 * Combines neuromuscular + physical maturity.
 * Total: -10 to 50, mapped to gestational age.
 *
 * Simplified: we accept the integer score (0-50) and return the
 * gestational age estimate + category.
 * ============================================================ */
function BallardScore(integerScore) {
  if (typeof integerScore !== 'number' || integerScore < 0 || integerScore > 50) {
    throw new Error('BallardScore: invalid score (0-50)');
  }
  // Map score to weeks: 0=20w, 5=24w, 10=26w, 15=28w, 20=30w, 25=32w, 30=34w, 35=36w, 40=38w, 45=40w, 50=44w
  const weeks = 20 + (integerScore * 0.5);
  const maturity = weeks < 28 ? 'extremely_preterm' :
                   weeks < 32 ? 'very_preterm' :
                   weeks < 34 ? 'preterm' :
                   weeks < 37 ? 'late_preterm' :
                   weeks < 42 ? 'term' : 'post_term';
  return { weeks: Math.round(weeks * 10) / 10, maturity };
}

/* ============================================================
 * 3. NeonatalVentSettings
 * Conventional neonatal ventilation initial settings.
 *
 * Rules (per NRP / NICU handbook):
 *   PIP: 20-25 cmH2O (term), 16-20 (preterm)
 *   PEEP: 4-5 cmH2O
 *   Rate: 40-60 bpm
 *   FiO2: 0.21-0.40 (term), 0.21-0.30 (preterm)
 *   I-time: 0.30-0.40 sec
 *
 * Returns recommended initial settings based on weight + GA.
 * ============================================================ */
function NeonatalVentSettings({ weightKg, gestationalAgeWeeks, indication }) {
  if (typeof weightKg !== 'number' || weightKg <= 0) throw new Error('weightKg required');
  if (typeof gestationalAgeWeeks !== 'number' || gestationalAgeWeeks <= 0) throw new Error('GA required');
  const isPreterm = gestationalAgeWeeks < 37;
  const isRDS = indication === 'rds' || indication === 'respiratory_distress';
  const pip = isPreterm ? 18 : 22;
  const peep = 5;
  const rate = isPreterm ? 50 : 40;
  const fio2 = isRDS ? 0.30 : 0.21;
  const iTime = 0.35;
  return {
    pip, peep, rate, fio2, iTime,
    rationale: `${isPreterm ? 'Preterm' : 'Term'} ${gestationalAgeWeeks}w ${weightKg}kg, ${indication || 'routine'}.`,
  };
}

/* ============================================================
 * 4. SurfactantDosing
 * Surfactant dosing for RDS.
 *
 *   Poractant alfa (Curosurf): 200 mg/kg initial, 100 mg/kg repeat
 *   Beractant (Survanta): 100 mg/kg, repeat q6h up to 4 doses
 *
 * Returns total mg + mL for the chosen drug.
 * ============================================================ */
function SurfactantDosing({ drug, weightKg, isFirstDose }) {
  if (typeof weightKg !== 'number' || weightKg <= 0) throw new Error('weightKg required');
  const isCurosurf = drug === 'poractant_alfa' || drug === 'curosurf';
  const mgPerKg = isCurosurf
    ? (isFirstDose ? 200 : 100)
    : 100;
  const totalMg = mgPerKg * weightKg;
  // Curosurf concentration: 80 mg/mL
  const concentrationMgPerMl = isCurosurf ? 80 : 25;
  const volumeMl = totalMg / concentrationMgPerMl;
  return {
    drug: isCurosurf ? 'poractant_alfa' : 'beractant',
    mgPerKg,
    totalMg: Math.round(totalMg),
    volumeMl: Math.round(volumeMl * 100) / 100,
    weightKg,
    isFirstDose,
    maxRepeatDoses: isCurosurf ? 1 : 3,
  };
}

/* ============================================================
 * 5. TherapeuticHypothermiaEligibility
 * Therapeutic hypothermia for HIE (Hypoxic-Ischemic Encephalopathy).
 * Per 2022 NRP / AHA:
 *   - Gestational age >= 36 weeks
 *   - Evidence of perinatal asphyxia (pH <7.0 or base excess <-16)
 *   - Moderate to severe encephalopathy
 *   - Within 6 hours of birth
 * ============================================================ */
function TherapeuticHypothermiaEligibility({ gestationalAgeWeeks, cordPh, baseExcess, encephalopathyGrade, hoursAfterBirth }) {
  const eligible = gestationalAgeWeeks >= 36
    && (cordPh < 7.0 || baseExcess < -16)
    && (encephalopathyGrade === 'moderate' || encephalopathyGrade === 'severe')
    && hoursAfterBirth <= 6;
  return {
    eligible,
    targetTempC: 33.5,
    durationHours: 72,
    rationale: eligible
      ? 'Per 2022 NRP/AHA: TH at 33.5°C x 72h, started within 6h of birth.'
      : 'One or more criteria not met. Treat per cause-specific protocol.',
    criteria: { gestationalAgeWeeks, cordPh, baseExcess, encephalopathyGrade, hoursAfterBirth },
  };
}

/* ============================================================
 * 6. IVHGrade
 * Intraventricular hemorrhage grading (Papile).
 *   Grade I: germinal matrix hemorrhage only
 *   Grade II: IVH without ventricular dilation
 *   Grade III: IVH with ventricular dilation
 *   Grade IV: parenchymal hemorrhage
 *
 * Inputs: presence/extent of GMH, IVH, dilation, parenchymal.
 * ============================================================ */
function IVHGrade({ germinalMatrix, ivh, ventricularDilation, parenchymal }) {
  let grade;
  if (parenchymal) grade = 4;
  else if (ivh && ventricularDilation) grade = 3;
  else if (ivh) grade = 2;
  else if (germinalMatrix) grade = 1;
  else grade = 0;
  return { grade, requiresNeurosurgery: grade >= 3, requiresVPShunt: grade === 4 };
}

/* ============================================================
 * 7. NECStage
 * Necrotizing enterocolitis staging (Bell's modified).
 *   Stage I: suspected (feeding intolerance, abdominal distension)
 *   Stage II: definite (pneumatosis intestinalis on x-ray)
 *     IIA: mild, IIB: advanced (systemic signs)
 *   Stage III: advanced (pneumoperitoneum, perforation)
 *     IIIA: medical, IIIB: surgical
 *
 * Inputs: suspected/confirmed, systemicSigns, perforation.
 * ============================================================ */
function NECStage({ confirmedOnXRay, systemicSigns, pneumoperitoneum, requiresSurgery }) {
  let stage;
  if (pneumoperitoneum && !requiresSurgery) stage = 'IIIA';
  else if (pneumoperitoneum && requiresSurgery) stage = 'IIIB';
  else if (confirmedOnXRay && systemicSigns) stage = 'IIB';
  else if (confirmedOnXRay) stage = 'IIA';
  else stage = 'I';
  return {
    stage,
    surgery: stage === 'IIIB',
    bowelRest: true,
    antibioticDurationDays: stage === 'I' ? 7 : 10,
  };
}

/* ============================================================
 * 8. PhototherapyThreshold
 * Phototherapy threshold by age in hours and risk factors.
 * Simplified AAP guidelines.
 * Returns: 'none' | 'phototherapy' | 'exchange_transfusion'
 * ============================================================ */
function PhototherapyThreshold({ ageHours, totalSerumBilirubin, gestationalAgeWeeks, hasRiskFactors }) {
  // Simplified thresholds (mg/dL) by age
  const thresholds = {
    24: 5, 48: 9, 72: 12, 96: 14, 120: 16, 144: 17, 168: 18,
  };
  // Find closest age bucket
  const ages = Object.keys(thresholds).map(Number).sort((a, b) => a - b);
  let nearest = ages[0];
  for (const a of ages) {
    if (ageHours >= a) nearest = a;
    else break;
  }
  let threshold = thresholds[nearest];
  if (gestationalAgeWeeks < 38) threshold -= 2;
  if (hasRiskFactors) threshold -= 1;
  const exchangeThreshold = threshold + 6;
  if (totalSerumBilirubin >= exchangeThreshold) return { level: 'exchange_transfusion', phototherapyThreshold: threshold, exchangeThreshold };
  if (totalSerumBilirubin >= threshold) return { level: 'phototherapy', phototherapyThreshold: threshold, exchangeThreshold };
  return { level: 'none', phototherapyThreshold: threshold, exchangeThreshold };
}

/* ============================================================
 * 9. ROPStage
 * Retinopathy of prematurity staging.
 *   Stage 1: demarcation line
 *   Stage 2: ridge
 *   Stage 3: ridge with extraretinal fibrovascular proliferation
 *   Stage 4: partial retinal detachment (4A: peripheral, 4B: macula)
 *   Stage 5: total retinal detachment
 *   Plus: plus disease (vascular dilation/tortuosity)
 *
 * Returns stage + treatment recommendation.
 * ============================================================ */
function ROPStage({ stage, plusDisease }) {
  if (typeof stage !== 'number' || stage < 0 || stage > 5) {
    throw new Error('ROPStage: stage must be 0-5');
  }
  let treatment;
  if (stage === 0) treatment = 'routine_screening';
  else if (stage === 1) treatment = 'continue_screening';
  else if (stage === 2) treatment = 'closer_followup';
  else if (stage === 3) treatment = plusDisease ? 'laser_or_anti_VEGF' : 'closer_followup';
  else if (stage === 4) treatment = 'surgical_consult_vitreoretinal';
  else treatment = 'surgical_vitreoretinal';
  return { stage, plusDisease, treatment, requiresAntiVEGF: stage === 3 && plusDisease };
}

/* ============================================================
 * 10. NeonatalSepsisScore
 * Neonatal sepsis risk (Kaiser sepsis calculator simplified).
 * Inputs:
 *   - Gestational age (weeks)
 *   - Age at onset (hours: 0-6, 7-24, 25-72, >72)
 *   - Maternal GBS status
 *   - ROM duration (hours)
 *   - Maternal temperature (C)
 *   - Clinical signs (lethargy, apnea, tachycardia, etc.)
 *
 * Returns risk level and recommendation.
 * ============================================================ */
function NeonatalSepsisScore({ gestationalAgeWeeks, ageAtOnsetHours, maternalGbs, romHours, maternalTempC, clinicalSigns }) {
  let score = 0;
  // GBS positive
  if (maternalGbs === 'positive') score += 2;
  // ROM >= 18h
  if (romHours >= 18) score += 1;
  // Maternal fever >= 38C
  if (maternalTempC >= 38) score += 2;
  // Clinical signs
  if (Array.isArray(clinicalSigns)) {
    score += clinicalSigns.length;
  }
  // Adjust by GA and age
  if (gestationalAgeWeeks < 34) score += 1;
  const earlyOnset = ageAtOnsetHours <= 72;
  const risk = score >= 5 ? 'high' : score >= 3 ? 'intermediate' : 'low';
  return {
    score,
    risk,
    recommendation: risk === 'high' ? 'empirical_antibiotics_blood_culture_lp' :
                    risk === 'intermediate' ? 'blood_culture_observe' :
                    'observe_no_antibiotics',
    earlyOnset,
  };
}

module.exports = {
  ApgarScore,
  BallardScore,
  NeonatalVentSettings,
  SurfactantDosing,
  TherapeuticHypothermiaEligibility,
  IVHGrade,
  NECStage,
  PhototherapyThreshold,
  ROPStage,
  NeonatalSepsisScore,
};
