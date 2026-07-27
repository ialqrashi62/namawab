/**
 * pcc/bicu/bicu_engine.js
 *
 * 10 deterministic functions for Burn ICU decision support.
 */
'use strict';

/* ============================================================
 * 1. ParklandFormula
 * Parkland formula: 4 mL × kg × %TBSA
 * Half in first 8 hours from burn, half in next 16 hours.
 *
 * Returns mL per period + total + choice of crystalloid.
 * ============================================================ */
function ParklandFormula({ weightKg, tbsaPct, hoursSinceBurn }) {
  if (typeof weightKg !== 'number' || weightKg <= 0) throw new Error('weightKg required');
  if (typeof tbsaPct !== 'number' || tbsaPct < 0 || tbsaPct > 100) throw new Error('tbsaPct 0-100 required');
  const total24h = 4 * weightKg * tbsaPct;
  const first8h = total24h / 2;
  const next16h = total24h / 2;
  return {
    total24hMl: Math.round(total24h),
    first8hMl: Math.round(first8h),
    next16hMl: Math.round(next16h),
    rateFirst8hMlPerHour: Math.round(first8h / Math.max(1, Math.min(8, hoursSinceBurn || 8))),
    crystalloid: 'lactated_ringers',
    rationale: 'Parkland: 4 mL × kg × %TBSA, half in first 8h, half in next 16h. Lactated Ringers.',
  };
}

/* ============================================================
 * 2. TBSACalculation
 * Total body surface area burned (Rule of 9s for adults,
 * Lund-Browder for pediatrics - simplified here).
 *
 * Inputs: each region % from 0-100.
 *   head, chest, abdomen, back, armL, armR, legL, legR, perineum
 * ============================================================ */
function TBSACalculation({ head, chest, abdomen, back, armL, armR, legL, legR, perineum }) {
  const total = (head || 0) + (chest || 0) + (abdomen || 0) + (back || 0) +
    (armL || 0) + (armR || 0) + (legL || 0) + (legR || 0) + (perineum || 0);
  if (total > 100) throw new Error('TBSA total > 100%');
  const severity = total >= 30 ? 'major' : total >= 10 ? 'moderate' : total > 0 ? 'minor' : 'none';
  return { tbsaPct: Math.round(total * 10) / 10, severity, requiresTransfer: total >= 30 || severity === 'major' };
}

/* ============================================================
 * 3. InhalationInjurySeverity
 * Inhalation injury severity assessment.
 * Inputs: sootInAirway, stridor, hoarseness, bronchoscopyGrade, coLevel.
 * bronchoscopyGrade: 0-3 (0=none, 1=mild, 2=moderate, 3=severe)
 *
 * Returns severity + intubation recommendation.
 * ============================================================ */
function InhalationInjurySeverity({ sootInAirway, stridor, hoarseness, bronchoscopyGrade, coLevel }) {
  let severity;
  if (bronchoscopyGrade === 3 || coLevel > 25) severity = 'severe';
  else if (bronchoscopyGrade === 2 || stridor) severity = 'moderate';
  else if (bronchoscopyGrade === 1 || sootInAirway || hoarseness) severity = 'mild';
  else severity = 'none';
  const intubate = severity === 'severe' || stridor || coLevel > 25;
  return { severity, intubate, humidifiedO2: severity !== 'none', bronchoscopy: severity !== 'none' };
}

/* ============================================================
 * 4. EscharotomyIndication
 * Escharotomy indication for circumferential full-thickness burn.
 * Inputs: circumferential, location, compartmentSyndrome.
 * Locations: 'extremity', 'chest', 'abdomen'
 *
 * Returns whether escharotomy indicated.
 * ============================================================ */
function EscharotomyIndication({ circumferential, location, compartmentSyndrome, distalPulses, delayedCapillaryRefill }) {
  if (!circumferential) return { indicated: false, reason: 'not_circumferential' };
  const pulseCompromise = !distalPulses || delayedCapillaryRefill;
  const chestRestriction = location === 'chest' && compartmentSyndrome;
  const abdomenCompartment = location === 'abdomen' && compartmentSyndrome;
  if (chestRestriction || abdomenCompartment || pulseCompromise) {
    return {
      indicated: true,
      location,
      technique: location === 'chest' ? 'mid_axillary_lines_anteriorly' :
                 location === 'abdomen' ? 'mid_axillary_to_anterior_axillary' :
                 'medial_and_lateral_longitudinal',
      urgency: 'emergent',
    };
  }
  return { indicated: false, reason: 'no_compromise_yet' };
}

/* ============================================================
 * 5. BurnSepsisDiagnosis
 * Burn sepsis diagnosis (ABA criteria - simplified).
 * Inputs: temperatureC, hr, rr, wbc, bandemiaPct, refractoryHypotension,
 *          oliguria, hyperglycemia, mentalStatusChange.
 *
 * Threshold: >=3 of 6 triggers + documented infection.
 * ============================================================ */
function BurnSepsisDiagnosis({ temperatureC, hr, rr, wbc, bandemiaPct, refractoryHypotension, oliguria, hyperglycemia, mentalStatusChange, hasDocumentedInfection }) {
  if (!hasDocumentedInfection) return { sepsis: false, reason: 'no_documented_infection' };
  const triggers = [
    temperatureC > 39 || temperatureC < 36.5, // T > 39 or < 36.5
    hr > 110,                                  // Progressive tachycardia
    rr > 25,                                   // Tachypnea
    wbc > 12 || wbc < 4,                       // Leukocytosis/leukopenia
    bandemiaPct > 10,                          // Left shift
    refractoryHypotension,                     // Refractory hypotension
    oliguria,                                  // Oliguria
    hyperglycemia,                             // Hyperglycemia
    mentalStatusChange,                        // Mental status
  ];
  const count = triggers.filter(Boolean).length;
  return {
    sepsis: count >= 3,
    triggersPresent: count,
    triggersTotal: triggers.length,
  };
}

/* ============================================================
 * 6. FluidResuscitationAdjustment
 * Adjust fluid resuscitation rate based on urine output.
 * Target UOP: 30-50 mL/hr adults, 0.5-1 mL/kg/hr children.
 * ============================================================ */
function FluidResuscitationAdjustment({ currentRateMlPerHour, currentUopMlPerHour, weightKg, isPediatric }) {
  const targetUopLow = isPediatric ? 0.5 * weightKg : 30;
  const targetUopHigh = isPediatric ? 1.0 * weightKg : 50;
  let action;
  let newRate = currentRateMlPerHour;
  if (currentUopMlPerHour < targetUopLow) {
    newRate = Math.round(currentRateMlPerHour * 1.2);
    action = 'increase_rate_20pct';
  } else if (currentUopMlPerHour > targetUopHigh) {
    newRate = Math.round(currentRateMlPerHour * 0.8);
    action = 'decrease_rate_20pct';
  } else {
    action = 'maintain_rate';
  }
  return {
    currentUopMlPerHour,
    targetLow: targetUopLow,
    targetHigh: targetUopHigh,
    currentRate: currentRateMlPerHour,
    newRate,
    action,
  };
}

/* ============================================================
 * 7. NutritionalNeeds
 * Caloric needs for burn patient.
 * Curreri junior for adults: 25 kcal/kg + 40 kcal/%TBSA
 * Galveston for pediatrics simplified.
 * ============================================================ */
function NutritionalNeeds({ weightKg, tbsaPct, ageYears }) {
  if (ageYears < 12) {
    // Galveston simplified
    const bmr = (ageYears < 1) ? 55 : (ageYears < 6) ? 45 : 35;
    const total = (bmr * weightKg) + (1500 * tbsaPct);
    return { kcalPerDay: Math.round(total), proteinGramsPerDay: Math.round(total * 0.04), formula: 'galveston_simplified' };
  }
  const curreri = (25 * weightKg) + (40 * tbsaPct);
  return { kcalPerDay: Math.round(curreri), proteinGramsPerDay: Math.round(curreri * 0.025), formula: 'curreri_junior' };
}

/* ============================================================
 * 8. ScarAssessment
 * Vancouver Scar Scale (VSS) for healed burns.
 * 4 components 0-5 each, total 0-15.
 *   pigmentation, vascularity, pliability, height
 * ============================================================ */
function ScarAssessment({ pigmentation, vascularity, pliability, height }) {
  const total = pigmentation + vascularity + pliability + height;
  const category = total <= 5 ? 'normal' : total <= 8 ? 'mild' : total <= 11 ? 'moderate' : 'severe';
  return {
    total, category,
    treatments: total > 5 ? ['silicone_gel', 'pressure_garment', 'massage'] : ['observation'],
  };
}

/* ============================================================
 * 9. BurnMortalityScore
 * Baux score: age + %TBSA
 * Modern: Baux + inhalation injury (+17 if present)
 * Mortality:
 *   <60: low
 *   60-100: moderate
 *   100-140: high
 *   >140: very high
 * ============================================================ */
function BurnMortalityScore({ ageYears, tbsaPct, inhalationInjury }) {
  let score = ageYears + tbsaPct;
  if (inhalationInjury) score += 17;
  const mortality = score < 60 ? 'low' : score < 100 ? 'moderate' : score < 140 ? 'high' : 'very_high';
  return {
    score, inhalationAdjusted: !!inhalationInjury,
    mortalityRisk: mortality,
    mortalityPct: score < 60 ? '<10' : score < 100 ? '10-30' : score < 140 ? '30-60' : '>60',
  };
}

/* ============================================================
 * 10. BauxScore
 * Same as BurnMortalityScore but classic Baux without inhalation.
 * (Baux = age + %TBSA, original 1961)
 * ============================================================ */
function BauxScore({ ageYears, tbsaPct }) {
  const score = ageYears + tbsaPct;
  return {
    score,
    mortalityRisk: score < 50 ? 'low' : score < 80 ? 'moderate' : score < 100 ? 'high' : 'very_high',
  };
}

module.exports = {
  ParklandFormula,
  TBSACalculation,
  InhalationInjurySeverity,
  EscharotomyIndication,
  BurnSepsisDiagnosis,
  FluidResuscitationAdjustment,
  NutritionalNeeds,
  ScarAssessment,
  BurnMortalityScore,
  BauxScore,
};
