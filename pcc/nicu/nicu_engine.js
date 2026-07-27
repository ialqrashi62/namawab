/**
 * pcc/nicu/nicu_engine.js — PCC #12: Neurocritical ICU
 * 10 deterministic functions for neuro-emergencies.
 *
 * Note: file is `nicu_engine.js` to avoid collision with the existing
 * `nnicu` (neonatal) module. This module is for adult neurocritical
 * care (stroke, TBI, status epilepticus, brain death).
 *
 * Compliance: NCS · AHA/ASA · BTF · AAN brain death criteria.
 */
'use strict';

function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f) / f; }

/**
 * 1. NIHStrokeScale — abbreviated NIHSS.
 * @param {{ consciousness: 0|1|2|3, gaze: 0|1|2, visual: 0|1|2|3, facial: 0|1|2|3, motorArm: 0|1|2|3|4, motorLeg: 0|1|2|3|4, ataxia: 0|1|2, sensory: 0|1|2, language: 0|1|2|3, dysarthria: 0|1|2, extinction: 0|1|2 }} input
 * @returns {{ total: number, severity: 'minor'|'moderate'|'moderate_severe'|'severe' }}
 */
function NIHStrokeScale(input) {
  const total = input.consciousness + input.gaze + input.visual + input.facial +
    input.motorArm + input.motorLeg + input.ataxia + input.sensory +
    input.language + input.dysarthria + input.extinction;
  let severity = 'minor';
  if (total >= 21) severity = 'severe';
  else if (total >= 16) severity = 'moderate_severe';
  else if (total >= 5) severity = 'moderate';
  return { total, severity };
}

/**
 * 2. tPACandidate — IV thrombolysis eligibility.
 * @param {{ nihss: number, age: number, lastKnownWell: number, systolicBP: number, diastolicBP: number, INR: number, glucose: number, recentSurgery: boolean, recentStroke: boolean, bleeding: boolean }} input
 * @returns {{ eligible: boolean, reasons: string[] }}
 */
function tPACandidate({ nihss, age, lastKnownWell, systolicBP, diastolicBP, INR, glucose, recentSurgery, recentStroke, bleeding }) {
  const reasons = [];
  if (nihss < 6 && nihss > 0) reasons.push('low_NIHSS_benefit_uncertain');
  if (lastKnownWell > 4.5) reasons.push('beyond_4.5h_window');
  if (age > 80 && lastKnownWell > 3) reasons.push('age_over_80_outside_3h');
  if (systolicBP > 185 || diastolicBP > 110) reasons.push('BP_above_limit');
  if (INR > 1.7) reasons.push('coagulopathy');
  if (glucose < 50 || glucose > 400) reasons.push('glucose_out_of_range');
  if (recentSurgery) reasons.push('recent_surgery_14d');
  if (recentStroke) reasons.push('recent_stroke_3mo');
  if (bleeding) reasons.push('active_bleeding');
  return { eligible: reasons.length === 0, reasons };
}

/**
 * 3. ThrombectomyCandidate — large vessel occlusion assessment.
 * @param {{ nihss: number, hasLVOImaging: boolean, lastKnownWell: number, preStrokeMRS: number, age: number }} input
 * @returns {{ candidate: boolean, category: 'definite'|'probable'|'consider'|'not_candidate' }}
 */
function ThrombectomyCandidate({ nihss, hasLVOImaging, lastKnownWell, preStrokeMRS, age }) {
  if (preStrokeMRS > 2 || age > 100) return { candidate: false, category: 'not_candidate' };
  if (hasLVOImaging && nihss >= 6 && lastKnownWell <= 24) return { candidate: true, category: 'definite' };
  if (hasLVOImaging && nihss >= 6 && lastKnownWell <= 6) return { candidate: true, category: 'definite' };
  if (nihss >= 10) return { candidate: true, category: 'probable' };
  if (nihss >= 6) return { candidate: true, category: 'consider' };
  return { candidate: false, category: 'not_candidate' };
}

/**
 * 4. StatusEpilepticusManagement — treatment ladder.
 * @param {{ seizureDurationMin: number, abortiveDose: number, etiology: string }} input
 * @returns {{ phase: 'stabilization'|'initial_therapy'|'second_therapy'|'third_therapy'|'refractory', interventions: string[] }}
 */
function StatusEpilepticusManagement({ seizureDurationMin, abortiveDose, etiology }) {
  const interventions = [];
  let phase;
  if (seizureDurationMin < 5) { phase = 'stabilization'; interventions.push('ABCs_glucose_iv_access'); }
  else if (seizureDurationMin < 20) { phase = 'initial_therapy'; interventions.push('benzodiazepine_iv'); }
  else if (seizureDurationMin < 40) { phase = 'second_therapy'; interventions.push('fosphenytoin_or_levetiracetam'); }
  else if (seizureDurationMin < 60) { phase = 'third_therapy'; interventions.push('continuous_eeg'); interventions.push('additional_ase'); }
  else { phase = 'refractory'; interventions.push('anesthetic_drip_midazolam_propofol'); }
  if (etiology !== 'unknown') interventions.push(`treat_etiology_${etiology}`);
  return { phase, interventions };
}

/**
 * 5. BrainHerniationSyndrome — clinical recognition.
 * @param {{ pupils: 'equal_reactive'|'one_blown'|'both_blown'|'pinpoint', posture: 'normal'|'decorticate'|'decerebrate'|'flaccid', bradycardia: boolean, hypertension: boolean, irregularRespirations: boolean }} input
 * @returns {{ syndrome: 'none'|'uncal'|'central'|'tonsillar'|'cushing', mortalityRisk: 'low'|'high'|'imminent' }}
 */
function BrainHerniationSyndrome({ pupils, posture, bradycardia, hypertension, irregularRespirations }) {
  const cushing = bradycardia && hypertension && irregularRespirations;
  if (pupils === 'one_blown' && posture === 'decorticate') return { syndrome: 'uncal', mortalityRisk: 'high' };
  if (pupils === 'both_blown' && posture === 'decerebrate') return { syndrome: 'central', mortalityRisk: 'imminent' };
  if (pupils === 'pinpoint' && posture === 'decerebrate') return { syndrome: 'tonsillar', mortalityRisk: 'imminent' };
  if (cushing) return { syndrome: 'cushing', mortalityRisk: 'high' };
  return { syndrome: 'none', mortalityRisk: 'low' };
}

/**
 * 6. BrainDeathExam — AAN prerequisites + clinical criteria.
 * @param {{ comaKnownCause: boolean, neuroImagingExplainsComa: boolean, noSedatives: boolean, noMetabolicDerangement: boolean, hypothermia: boolean, normotension: boolean, apneaTestPositive: boolean, allBrainstemReflexesAbsent: boolean }} input
 * @returns {{ canDeclare: boolean, missingCriteria: string[] }}
 */
function BrainDeathExam(input) {
  const missing = [];
  if (!input.comaKnownCause) missing.push('cause_unknown');
  if (!input.neuroImagingExplainsComa) missing.push('imaging_does_not_explain');
  if (!input.noSedatives) missing.push('sedative_present');
  if (!input.noMetabolicDerangement) missing.push('metabolic_derangement');
  if (input.hypothermia) missing.push('hypothermia');
  if (!input.normotension) missing.push('hypotension');
  if (!input.allBrainstemReflexesAbsent) missing.push('brainstem_reflexes_present');
  if (!input.apneaTestPositive) missing.push('apnea_test_incomplete');
  return { canDeclare: missing.length === 0, missingCriteria: missing };
}

/**
 * 7. DCIProphylaxis — delayed cerebral ischemia after SAH.
 * @param {{ daysAfterSAH: number, nimodipineOrdered: boolean, systolicBP: number, symptomaticDCI: boolean, nicardipineDrip: boolean }} input
 * @returns {{ prophylaxisAdequate: boolean, suggestedActions: string[] }}
 */
function DCIProphylaxis({ daysAfterSAH, nimodipineOrdered, systolicBP, symptomaticDCI, nicardipineDrip }) {
  const actions = [];
  let adequate = true;
  if (!nimodipineOrdered) { adequate = false; actions.push('start_nimodipine_60mg_q4h'); }
  if (daysAfterSAH >= 4 && daysAfterSAH <= 14 && systolicBP > 160) {
    if (!nicardipineDrip) { adequate = false; actions.push('nicardipine_drip_target_SBP_140-160'); }
  }
  if (symptomaticDCI) { adequate = false; actions.push('induce_hypertension_with_phenylephrine'); actions.push('consider_euvolemia'); }
  return { prophylaxisAdequate: adequate, suggestedActions: actions };
}

/**
 * 8. LumbarPunctureSafety — adult LP risk assessment.
 * @param {{ plateletCount: number, INR: number, antiplateletDrug: boolean, anticoagulant: boolean, papilledema: boolean, focalNeuroDeficit: boolean, immunocompromised: boolean, recentSeizure: boolean }} input
 * @returns {{ safe: boolean, contraindication: string[], needsImagingFirst: boolean }}
 */
function LumbarPunctureSafety({ plateletCount, INR, antiplateletDrug, anticoagulant, papilledema, focalNeuroDeficit, immunocompromised, recentSeizure }) {
  const contra = [];
  let needsImaging = false;
  if (plateletCount < 50) contra.push('thrombocytopenia_severe');
  if (INR > 1.5) contra.push('coagulopathy');
  if (anticoagulant) contra.push('anticoagulant_drug');
  if (papilledema) { contra.push('papilledema'); needsImaging = true; }
  if (focalNeuroDeficit) { needsImaging = true; }
  if (recentSeizure) needsImaging = true;
  if (immunocompromised) needsImaging = false;
  return { safe: contra.length === 0, contraindication: contra, needsImagingFirst: needsImaging };
}

/**
 * 9. TargetedTemperatureManagement — post-cardiac-arrest cooling.
 * @param {{ arrestRhythm: 'shockable'|'non_shockable', downtime: number, rosC: boolean, initialRhythm: string, hoursSinceROSC: number }} input
 * @returns {{ ttMIndicated: boolean, targetTempC: number, durationHours: number, contraindication: string[] }}
 */
function TargetedTemperatureManagement({ arrestRhythm, downtime, rosC, initialRhythm, hoursSinceROSC }) {
  const contra = [];
  if (!rosC) return { ttMIndicated: false, targetTempC: 0, durationHours: 0, contraindication: ['no_ROSC'] };
  if (downtime > 60) contra.push('prolonged_downtime_relative');
  if (hoursSinceROSC > 12) contra.push('outside_window');
  return {
    ttMIndicated: contra.length === 0,
    targetTempC: 33,
    durationHours: 24,
    contraindication: contra,
  };
}

/**
 * 10. NeuroPrognosticationPostArrest — multi-modal outcome prediction.
 * @param {{ pupillaryReflexAt72h: 'present'|'absent', cornealReflexAt72h: 'present'|'absent', nseAt48h: number, s100bAt48h: number, burstSuppression: boolean, myoclonusEarly: boolean }} input
 * @returns {{ poorOutcome: boolean, confidence: 'low'|'moderate'|'high', recommendedTiming: '72h'|'7d'|'extended' }}
 */
function NeuroPrognosticationPostArrest({ pupillaryReflexAt72h, cornealReflexAt72h, nseAt48h, s100bAt48h, burstSuppression, myoclonusEarly }) {
  let score = 0;
  if (pupillaryReflexAt72h === 'absent') score += 3;
  if (cornealReflexAt72h === 'absent') score += 3;
  if (nseAt48h > 90) score += 2;
  if (s100bAt48h > 0.5) score += 2;
  if (burstSuppression) score += 2;
  if (myoclonusEarly) score += 1;
  const poorOutcome = score >= 5;
  const confidence = score >= 8 ? 'high' : score >= 6 ? 'moderate' : 'low';
  const recommendedTiming = confidence === 'high' ? '72h' : confidence === 'moderate' ? '7d' : 'extended';
  return { poorOutcome, confidence, recommendedTiming };
}

module.exports = {
  NIHStrokeScale, tPACandidate, ThrombectomyCandidate,
  StatusEpilepticusManagement, BrainHerniationSyndrome, BrainDeathExam,
  DCIProphylaxis, LumbarPunctureSafety,
  TargetedTemperatureManagement, NeuroPrognosticationPostArrest,
};
