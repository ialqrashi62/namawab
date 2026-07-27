'use strict';
// Cardiology Engine: 10 pure deterministic functions
// Compliance: ACC/AHA, ESC, NCDR, HRS, NICE, ISHLT

function TIMIScore({ age, riskFactors, priorCoronary, aspirin, severeAngina, stDeviation, cardiacMarkers }) {
  let score = 0;
  if (age >= 65) score += 2; else if (age >= 55) score += 1;
  const rf = riskFactors || 0;
  if (rf >= 3) score += 2; else if (rf >= 1) score += 1;
  if (priorCoronary) score += 1;
  if (aspirin) score += 1;
  if (severeAngina) score += 1;
  if (stDeviation) score += 1;
  if (cardiacMarkers) score += 1;
  let risk;
  if (score >= 5) risk = 'high';
  else if (score >= 3) risk = 'moderate';
  else risk = 'low';
  const event14d = score >= 5 ? 0.408 : score >= 3 ? 0.133 : score >= 1 ? 0.046 : 0.008;
  return { score, risk, event14dPct: Math.round(event14d * 1000) / 10, action: risk === 'high' ? 'invasive strategy' : 'workup' };
}

function HEARTScore({ history, ecg, age, riskFactors, troponin }) {
  let score = 0;
  if (history === 'highly-suspicious') score += 2;
  else if (history === 'moderately-suspicious') score += 1;
  if (ecg === 'significant') score += 2;
  else if (ecg === 'non-specific') score += 1;
  if (age >= 65) score += 2; else if (age >= 45) score += 1;
  const rf = riskFactors || 0;
  if (rf >= 3) score += 2; else if (rf >= 1) score += 1;
  if (troponin >= 3) score += 2;
  else if (troponin >= 1) score += 1;
  let risk;
  if (score >= 7) risk = 'high';
  else if (score >= 4) risk = 'moderate';
  else if (score >= 1) risk = 'low';
  else risk = 'very-low';
  return { score, risk, mace6wkPct: score >= 7 ? 50 : score >= 4 ? 16 : score >= 1 ? 2.5 : 0.5 };
}

function CHA2DS2VASc({ chf, htn, age, diabetes, stroke, vascular, sex }) {
  let score = 0;
  if (chf) score += 1;
  if (htn) score += 1;
  if (age >= 75) score += 2;
  else if (age >= 65) score += 1;
  if (diabetes) score += 1;
  if (stroke) score += 2;
  if (vascular) score += 1;
  if (sex === 'female') score += 1;
  let plan;
  if (score === 0) plan = 'no anticoagulation';
  else if (score === 1 && sex === 'female') plan = 'no anticoagulation';
  else if (score === 1) plan = 'consider anticoagulation';
  else plan = 'anticoagulation indicated';
  return { score, plan, hasStrokeRisk: score >= 2 };
}

function HASBLED({ htn, renalDisease, liverDisease, stroke, bleeding, inr, age, drugs, alcohol }) {
  let score = 0;
  if (htn) score += 1;
  if (renalDisease) score += 1;
  if (liverDisease) score += 1;
  if (stroke) score += 1;
  if (bleeding) score += 1;
  if (inr === 'unstable') score += 1;
  if (age >= 65) score += 1;
  if (drugs) score += 1;
  if (alcohol) score += 1;
  let risk;
  if (score >= 3) risk = 'high-bleed-risk';
  else risk = 'low-bleed-risk';
  return { score, risk, bleedEventsPer100PtYr: score >= 3 ? 8.7 : score >= 1 ? 2.0 : 1.0 };
}

function GraceScore({ age, hr, sbp, killip, creatinine, stDeviation, cardiacArrest, biomarkers }) {
  let score = 0;
  if (age >= 80) score += 100; else if (age >= 70) score += 75; else if (age >= 60) score += 50; else if (age >= 50) score += 25;
  if (hr >= 200) score += 46; else if (hr >= 150) score += 37; else if (hr >= 110) score += 26; else if (hr >= 90) score += 13;
  if (sbp < 80) score += 78; else if (sbp < 100) score += 53; else if (sbp < 120) score += 30; else if (sbp < 140) score += 18;
  score += killip * 30;
  if (creatinine >= 4) score += 50; else if (creatinine >= 2) score += 28; else if (creatinine >= 1.5) score += 14;
  if (stDeviation) score += 28;
  if (cardiacArrest) score += 43;
  if (biomarkers) score += 14;
  let risk;
  if (score >= 140) risk = 'high';
  else if (score >= 109) risk = 'moderate';
  else risk = 'low';
  return { score, risk, mortalityInHospitalPct: score >= 200 ? 8 : score >= 140 ? 3 : score >= 109 ? 1.3 : 0.4 };
}

function WellsDVT({ activeCancer, paralysis, recentImmobilization, localizedTenderness, swellingCalf, pittingEdema, collateralVeins, alternativeDx }) {
  let score = 0;
  if (activeCancer) score += 1;
  if (paralysis) score += 1;
  if (recentImmobilization) score += 1;
  if (localizedTenderness) score += 1;
  if (swellingCalf >= 3) score += 1;
  if (pittingEdema) score += 1;
  if (collateralVeins) score += 1;
  if (alternativeDx) score -= 2;
  let probability;
  if (score >= 3) probability = 'high';
  else if (score >= 1) probability = 'moderate';
  else probability = 'low';
  return { score, probability, dvtPrevalencePct: probability === 'high' ? 53 : probability === 'moderate' ? 17 : 5 };
}

function PERCRule({ age, hr, sao2, hemoptysis, unilateralLegSwelling, surgeryOrFracture, priorVte, estrogenUse, painTenderness, hemoptysisV2 }) {
  let score = 0;
  if (age >= 50) score += 1;
  if (hr >= 100) score += 1;
  if (sao2 < 95) score += 1;
  if (hemoptysis || hemoptysisV2) score += 1;
  if (unilateralLegSwelling) score += 1;
  if (surgeryOrFracture) score += 1;
  if (priorVte) score += 1;
  if (estrogenUse) score += 1;
  if (painTenderness) score += 1;
  let risk;
  if (score >= 4) risk = 'high (age>50 only score=1)';
  if (score >= 5) risk = 'high';
  else if (score >= 2) risk = 'moderate';
  else if (score >= 0) risk = score === 0 && age < 50 ? 'low (PERC negative)' : 'low';
  return { score, risk, percNegative: score === 0 && age < 50 };
}

function KillipClass({ hr, sbp, rales, jvd, shock, pulmonaryEdema, frothySputum }) {
  let klass = 1;
  if (rales) klass = 2;
  if (jvd || pulmonaryEdema || frothySputum) klass = 3;
  if (shock || (sbp < 90 && hr > 100)) klass = 4;
  const mortality = [0.05, 0.17, 0.38, 0.81];
  return { class: klass, mortalityPct: mortality[klass - 1] * 100, treatment: klass === 1 ? 'standard' : klass === 2 ? 'diuretic+O2' : klass === 3 ? 'vasodilator+diuretic' : 'inotropic+mech' };
}

function FraminghamRisk({ age, totalChol, hdl, sbp, treatedBp, smoker, diabetes, sex }) {
  let ldl = totalChol - hdl;
  if (sex === 'female') {
    let s = 0;
    if (age >= 70) s += 9; else if (age >= 60) s += 7; else if (age >= 50) s += 5; else if (age >= 40) s += 3;
    s += Math.max(0, (totalChol - 160) / 20) | 0;
    if (hdl < 40) s += 2; else if (hdl >= 60) s -= 1;
    if (smoker) s += 3;
    if (diabetes) s += 4;
    if (sbp >= 160 || treatedBp) s += 4; else if (sbp >= 140) s += 3; else if (sbp >= 120) s += 2;
    return { score: s, risk10yrPct: Math.min(30, s * 1.5), sex, ldl, framingham: 'female' };
  } else {
    let s = 0;
    if (age >= 70) s += 11; else if (age >= 60) s += 8; else if (age >= 50) s += 5; else if (age >= 40) s += 2;
    s += Math.max(0, (totalChol - 180) / 20) | 0;
    if (hdl < 40) s += 2; else if (hdl >= 60) s -= 1;
    if (smoker) s += 4;
    if (diabetes) s += 3;
    if (sbp >= 160 || treatedBp) s += 4; else if (sbp >= 140) s += 3; else if (sbp >= 120) s += 2;
    return { score: s, risk10yrPct: Math.min(30, s * 1.4), sex, ldl, framingham: 'male' };
  }
}

function NYHAClass({ symptoms, mets, cardiacHistory }) {
  let klass;
  if (symptoms === 'at-rest') klass = 4;
  else if (symptoms === 'less-than-normal') klass = 3;
  else if (symptoms === 'more-than-ordinary') klass = 2;
  else klass = 1;
  return { class: klass, mets, mortality1yrPct: klass === 1 ? 5 : klass === 2 ? 15 : klass === 3 ? 30 : 60, plan: klass >= 3 ? 'advanced HF workup' : 'GDMT' };
}

module.exports = {
  TIMIScore, HEARTScore, CHA2DS2VASc, HASBLED, GraceScore,
  WellsDVT, PERCRule, KillipClass, FraminghamRisk, NYHAClass,
};
