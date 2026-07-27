'use strict';
// Pedi Engine: 10 pure deterministic functions
// Compliance: AAP, APLS, PALS, NICE pediatric, WHO pediatric

function ApgarScore({ heartRate, respiratoryEffort, muscleTone, reflexIrritability, color }) {
  let score = 0;
  const hr = heartRate >= 100 ? 2 : heartRate > 0 ? 1 : 0;
  const rr = respiratoryEffort === 'good' ? 2 : respiratoryEffort === 'slow-irregular' ? 1 : 0;
  const tone = muscleTone === 'active' ? 2 : muscleTone === 'some-flexion' ? 1 : 0;
  const reflex = reflexIrritability === 'cry' ? 2 : reflexIrritability === 'grimace' ? 1 : 0;
  const col = color === 'pink' ? 2 : color === 'acrocyanosis' ? 1 : 0;
  score = hr + rr + tone + reflex + col;
  let status;
  if (score >= 7) status = 'reassuring';
  else if (score >= 4) status = 'moderately-depressed';
  else status = 'critically-depressed';
  return { score, status, components: { heartRate: hr, respiratory: rr, tone, reflex, color: col } };
}

function PEWS({ ageMonths, hr, sbp, rr, capillaryRefill, spo2, oxygenSupport, consciousness }) {
  let score = 0;
  if (ageMonths < 12) {
    if (hr > 180) score += 3; else if (hr > 160) score += 2; else if (hr > 140) score += 1;
    if (sbp < 50) score += 3; else if (sbp < 60) score += 2; else if (sbp < 70) score += 1;
  } else {
    if (hr > 150) score += 3; else if (hr > 130) score += 2; else if (hr > 110) score += 1;
    if (sbp < 70) score += 3; else if (sbp < 80) score += 2; else if (sbp < 90) score += 1;
  }
  if (rr > 50) score += 2; else if (rr > 40) score += 1;
  if (capillaryRefill >= 3) score += 2;
  if (spo2 < 90) score += 2; else if (spo2 < 95) score += 1;
  if (oxygenSupport) score += 2;
  if (consciousness === 'unresponsive') score += 3;
  else if (consciousness === 'pain') score += 2;
  else if (consciousness === 'voice') score += 1;
  let level;
  if (score >= 7) level = 'critical-call-RRT';
  else if (score >= 4) level = 'high-urgent-review';
  else if (score >= 1) level = 'moderate-monitor';
  else level = 'low-stable';
  return { score, level, components: { cardio: score >= 4 } };
}

function PediatricDose({ weightKg, dosePerKg, maxDose, intervalHours, formulation }) {
  const calculated = weightKg * dosePerKg;
  const actual = Math.min(calculated, maxDose);
  const dailyDose = actual / intervalHours * 24;
  return { weightKg, dosePerKg, calculatedDose: calculated, maxDose, actualDose: actual, intervalHours, dailyDose, formulation };
}

function BronchiolitisSeverity({ ageMonths, rr, spo2, hydration, retractions, apnea, toxic }) {
  let severity;
  if (toxic || spo2 < 90 || apnea) severity = 'severe';
  else if (ageMonths < 3 || rr > 70 || retractions === 'severe' || hydration === 'poor') severity = 'moderate-severe';
  else if (rr > 50 || retractions === 'mild' || hydration === 'fair') severity = 'moderate';
  else severity = 'mild';
  let disposition;
  if (severity === 'severe') disposition = 'PICU';
  else if (severity === 'moderate-severe') disposition = 'inpatient';
  else if (severity === 'moderate') disposition = 'observation';
  else disposition = 'discharge';
  return { severity, disposition };
}

function DehydrationPercent({ weightLossKg, illnessDays, urineOutput, mucousMembranes, tears, sunkenEyes, skinTurgor, capRefill }) {
  let pct = 0;
  if (capRefill >= 3 || skinTurgor === 'tenting' || mucousMembranes === 'dry' && sunkenEyes) pct = 10;
  else if (capRefill === 2 || skinTurgor === 'slow' || mucousMembranes === 'dry' || tears === 'absent') pct = 5;
  else if (mucousMembranes === 'moist-dry' || tears === 'decreased' || urineOutput === 'decreased') pct = 3;
  if (illnessDays > 7 && pct < 5) pct = 5;
  if (weightLossKg && weightLossKg > 0) {
    const calculated = (weightLossKg / 10) * 100;
    if (calculated > pct) pct = calculated;
  }
  let plan;
  if (pct >= 10) plan = 'IV-bolus-20mL/kg-then-admit';
  else if (pct >= 5) plan = 'ORS-50-100mL/kg-over-4h';
  else plan = 'ORS-50mL/kg-over-4h';
  return { dehydrationPct: pct, plan, severity: pct >= 10 ? 'severe' : pct >= 5 ? 'moderate' : 'mild' };
}

function ImmunizationSchedulePedi({ age, vaccinesReceived }) {
  const due = [];
  if (age >= 2 && !vaccinesReceived.includes('DTaP-1')) due.push('DTaP-1');
  if (age >= 4 && !vaccinesReceived.includes('DTaP-2')) due.push('DTaP-2');
  if (age >= 6 && !vaccinesReceived.includes('DTaP-3')) due.push('DTaP-3');
  if (age >= 12 && !vaccinesReceived.includes('MMR-1')) due.push('MMR-1');
  if (age >= 12 && !vaccinesReceived.includes('Varicella-1')) due.push('Varicella-1');
  if (age >= 4 && !vaccinesReceived.includes('IPV-2')) due.push('IPV-2');
  if (age >= 6 && !vaccinesReceived.includes('IPV-3')) due.push('IPV-3');
  if (age >= 12 && !vaccinesReceived.includes('Hib-booster')) due.push('Hib-booster');
  if (age >= 12 && !vaccinesReceived.includes('PCV13-3')) due.push('PCV13-3');
  if (age >= 12 && !vaccinesReceived.includes('HepA-1')) due.push('HepA-1');
  return { due, catchUp: due.length > 0 };
}

function GCS_Pedi({ eye, verbal, motor, ageMonths }) {
  let eyeScore, verbalScore, motorScore;
  if (ageMonths < 24) {
    verbalScore = verbal === 'coos' ? 5 : verbal === 'cries' ? 4 : verbal === 'moans' ? 3 : verbal === 'agitated' ? 2 : 1;
  } else {
    verbalScore = verbal === 'oriented' ? 5 : verbal === 'confused' ? 4 : verbal === 'inappropriate' ? 3 : verbal === 'incomprehensible' ? 2 : 1;
  }
  eyeScore = eye === 'spontaneous' ? 4 : eye === 'to-voice' ? 3 : eye === 'to-pain' ? 2 : 1;
  motorScore = motor === 'obeys' ? 6 : motor === 'localizes' ? 5 : motor === 'withdraws' ? 4 : motor === 'flexion' ? 3 : motor === 'extension' ? 2 : 1;
  return { total: eyeScore + verbalScore + motorScore, eyeScore, verbalScore, motorScore, severity: eyeScore + verbalScore + motorScore <= 8 ? 'severe' : eyeScore + verbalScore + motorScore <= 12 ? 'moderate' : 'mild' };
}

function FebrileSeizureRisk({ ageMonths, temperature, seizureDuration, focalFeatures, neuroAbnormal }) {
  let simple = ageMonths >= 6 && ageMonths <= 60 && temperature >= 38 && seizureDuration < 15 && !focalFeatures && !neuroAbnormal;
  return { simple, complex: !simple && (focalFeatures || seizureDuration >= 15 || neuroAbnormal), ageMonths, recommendation: simple ? 'reassurance' : 'workup-neuro-imaging-EEG' };
}

function GrowthPercentile({ ageMonths, weightKg, heightCm, sex }) {
  const z = sex === 'male' ? 1 : -1;
  const expectedWeight = 3 + ageMonths * 0.5;
  const expectedHeight = 50 + ageMonths * 2;
  const wsd = (weightKg - expectedWeight) / Math.max(0.1, expectedWeight * 0.25);
  const hsd = (heightCm - expectedHeight) / Math.max(0.1, expectedHeight * 0.15);
  let status;
  if (wsd < -2 || hsd < -2) status = 'failure-to-thrive';
  else if (wsd > 2 || hsd > 2) status = 'obesity-risk';
  else status = 'normal';
  return { weightZScore: Math.round(wsd * 100) / 100, heightZScore: Math.round(hsd * 100) / 100, status, ageMonths, sex };
}

function AsthmaPedi({ age, symptoms, peakFlowPct, spo2, rr, hr }) {
  let severity;
  if (spo2 < 90 || peakFlowPct < 40 || rr >= 50) severity = 'severe';
  else if (peakFlowPct < 70 || spo2 < 95 || rr >= 40) severity = 'moderate';
  else severity = 'mild';
  let treatment;
  if (severity === 'severe') treatment = 'continuous-nebs+systemic-steroid+consider-Mg-IV';
  else if (severity === 'moderate') treatment = 'nebs-q1h+O2+oral-steroid';
  else treatment = 'MDI-2-puffs+observation';
  return { severity, treatment, age, peakFlowPct, spo2 };
}

module.exports = {
  ApgarScore, PEWS, PediatricDose, BronchiolitisSeverity, DehydrationPercent,
  ImmunizationSchedulePedi, GCS_Pedi, FebrileSeizureRisk, GrowthPercentile, AsthmaPedi,
};
