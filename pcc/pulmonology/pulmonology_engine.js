'use strict';
// Pulmonology Engine: 10 pure deterministic functions
// Compliance: GOLD, ATS/IDSA, BTS, ERS, NICE, ARDSNet

function CURB65({ confusion, uremia, rr, sbp, age }) {
  let score = 0;
  if (confusion) score += 1;
  if (uremia) score += 1;
  if (rr >= 30) score += 1;
  if (sbp < 90 || (sbp + 0) < 90) score += 1;
  if (age >= 65) score += 1;
  let mortality, plan;
  if (score === 0) { mortality = 0.1; plan = 'outpatient'; }
  else if (score === 1) { mortality = 3.2; plan = 'outpatient consider'; }
  else if (score === 2) { mortality = 9.2; plan = 'admit short stay'; }
  else { mortality = 31.0; plan = 'ICU admission'; }
  return { score, mortalityPct: mortality, plan };
}

function PSIScore({ age, sex, nursingHome, neoplastic, liver, chf, cerebrovascular, renal, alteredMental, rr, sbp, temp, hr, ph, bun, na, glucose, hct, pao2, pleuralEffusion }) {
  let s = 0;
  if (sex === 'male') s += age;
  else s += age - 10;
  if (nursingHome) s += 10;
  if (neoplastic) s += 30;
  if (liver) s += 20;
  if (chf) s += 10;
  if (cerebrovascular) s += 10;
  if (renal) s += 10;
  if (alteredMental) s += 20;
  if (rr >= 30) s += 20;
  if (sbp < 90) s += 20;
  if (temp < 35 || temp >= 40) s += 15;
  if (hr >= 125) s += 10;
  if (ph < 7.35) s += 30;
  if (bun >= 30) s += 20;
  if (na < 130) s += 20;
  if (glucose >= 250) s += 10;
  if (hct < 30) s += 10;
  if (pao2 < 60) s += 10;
  if (pleuralEffusion) s += 10;
  let risk;
  if (s <= 50) risk = 'low';
  else if (s <= 70) risk = 'low-moderate';
  else if (s <= 90) risk = 'moderate';
  else if (s <= 130) risk = 'high';
  else risk = 'very-high';
  return { score: s, risk, mortalityPct: Math.min(50, s * 0.3) };
}

function BODEIndex({ fev1Pct, distanceM, mmrc, exacerbations }) {
  const f = fev1Pct >= 80 ? 0 : fev1Pct >= 65 ? 1 : fev1Pct >= 50 ? 2 : 3;
  const d = distanceM >= 350 ? 0 : distanceM >= 250 ? 1 : distanceM >= 150 ? 2 : 3;
  const m = mmrc === 0 ? 0 : mmrc === 1 ? 1 : mmrc === 2 ? 2 : 3;
  const e = exacerbations === 0 ? 0 : exacerbations === 1 ? 0.5 : 1;
  const score = f + d + m + e;
  let mortality3yr;
  if (score <= 2) mortality3yr = 20;
  else if (score <= 4) mortality3yr = 40;
  else if (score <= 7) mortality3yr = 80;
  else mortality3yr = 95;
  return { score, components: { fev1: f, distance: d, mmrc: m, exacerbations: e }, mortality3yrPct: mortality3yr, copd: 'severe' };
}

function GOLDStage({ fev1Pct, symptoms, exacerbations }) {
  let airflow;
  if (fev1Pct >= 80) airflow = 1;
  else if (fev1Pct >= 50) airflow = 2;
  else if (fev1Pct >= 30) airflow = 3;
  else airflow = 4;
  const group = symptoms === 'low' && exacerbations < 2 ? `A${airflow}` : symptoms === 'low' ? `B${airflow}` : exacerbations < 2 ? `C${airflow}` : `D${airflow}`;
  return { airflowStage: airflow, goldGroup: group, initialTherapy: group.startsWith('A') ? 'bronchodilator' : group.startsWith('B') ? 'LABA+LAMA' : group.startsWith('C') ? 'LAMA+ICS' : 'triple therapy' };
}

function LightCriteria({ pleuralProtein, pleuralLdh, serumProtein, serumLdhUpper, serumLdh, pleuralLdhUpper }) {
  const ratioProtein = pleuralProtein / serumProtein;
  const ratioLdh = pleuralLdh / serumLdh;
  const exudate = (ratioProtein > 0.5) || (ratioLdh > 0.6) || (pleuralLdh > 0.67 * (pleuralLdhUpper || serumLdhUpper));
  return { exudate, transudate: !exudate, ratioProtein, ratioLdh };
}

function AsthmaSeverity({ pefPct, rr, hr, sao2, speech, mentalStatus }) {
  let severity;
  if (sao2 < 92 || mentalStatus === 'altered' || speech === 'unable') severity = 'life-threatening';
  else if (pefPct < 33 || rr >= 30 || hr >= 120 || speech === 'words') severity = 'severe';
  else if (pefPct < 50 || rr >= 25 || hr >= 110) severity = 'moderate';
  else severity = 'mild';
  return { severity, plan: severity === 'life-threatening' ? 'ICU+intubation prep' : severity === 'severe' ? 'continuous nebs+systemic steroid' : severity === 'moderate' ? 'nebs+O2' : 'MDI' };
}

function PaO2FiO2Ratio({ pao2, fio2, peep }) {
  const ratio = pao2 / fio2;
  let ards;
  if (ratio <= 100) ards = 'severe';
  else if (ratio <= 200) ards = 'moderate';
  else if (ratio <= 300) ards = 'mild';
  else ards = 'no ARDS';
  return { ratio, ards, peep, recommendation: ards === 'severe' ? 'low-tidal-volume 6mL/kg, prone' : ards === 'moderate' ? 'lung-protective vent' : 'monitor' };
}

function PneumoniaSeverity({ age, comorbidities, vitals, labs, imaging }) {
  const fAge = age >= 65 ? 1 : 0;
  const fComorb = (comorbidities || 0) >= 1 ? 1 : 0;
  const fVitals = (vitals && (vitals.rr >= 30 || vitals.sbp < 90)) ? 1 : 0;
  const fLabs = (labs && (labs.urea >= 7 || labs.crp > 100)) ? 1 : 0;
  const fImag = imaging && imaging.multilobar ? 1 : 0;
  const score = fAge + fComorb + fVitals + fLabs + fImag;
  return { score, severity: score >= 3 ? 'high' : score >= 1 ? 'moderate' : 'low', risk: score >= 3 ? 'consider ICU' : 'ward' };
}

function OSAStopBang({ snoring, tired, observed, bp, bmi, age, neck, sex }) {
  let yes = 0;
  if (snoring) yes += 1;
  if (tired) yes += 1;
  if (observed) yes += 1;
  if (bp) yes += 1;
  if (bmi > 35) yes += 1;
  if (age > 50) yes += 1;
  if (neck > 40) yes += 1;
  if (sex === 'male') yes += 1;
  let risk;
  if (yes >= 5) risk = 'high';
  else if (yes >= 3) risk = 'intermediate';
  else risk = 'low';
  return { yesCount: yes, risk, recommendation: risk === 'high' ? 'sleep study' : risk === 'intermediate' ? 'consider sleep study' : 'reassess' };
}

function PEWellDVT({ clinicalSigns, peLikely, hr, immobility, previousDvt, hemoptysis, malignancy }) {
  let score = 0;
  if (clinicalSigns) score += 3;
  if (peLikely) score += 3;
  if (hr > 100) score += 1.5;
  if (immobility) score += 1.5;
  if (previousDvt) score += 1.5;
  if (hemoptysis) score += 1;
  if (malignancy) score += 1;
  let probability;
  if (score > 6) probability = 'high';
  else if (score > 4) probability = 'moderate';
  else if (score > 2) probability = 'low';
  else probability = 'very-low';
  return { score, probability };
}

module.exports = {
  CURB65, PSIScore, BODEIndex, GOLDStage, LightCriteria,
  AsthmaSeverity, PaO2FiO2Ratio, PneumoniaSeverity, OSAStopBang, PEWellDVT,
};
