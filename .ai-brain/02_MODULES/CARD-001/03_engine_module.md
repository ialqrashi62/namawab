# CARD-001 — Engine Module (Pure JS)

```javascript
// namaweb/card_engine.js
'use strict';

function calculateTIMI(patient) {
  // TIMI Risk Score for NSTEMI
  let score = 0;
  if (patient.age >= 65) score += 1;
  if (patient.atLeast3RiskFactors) score += 1;  // HTN, DM, dyslipidemia, smoker, family
  if (patient.priorCoronaryStenosis50) score += 1;
  if (patient.aspirinLast7Days) score += 1;
  if (patient.severeAnginaLast24h) score += 1;
  if (patient.stDeviation) score += 1;
  if (patient.elevatedCardiacBiomarker) score += 1;
  return {
    score,
    riskLevel: score <= 1 ? 'LOW' : score <= 3 ? 'MODERATE' : 'HIGH',
    allCauseMortality14Days: score * 1.4 // approximation
  };
}

function calculateGRACE(patient) {
  // GRACE Score (in-hospital mortality)
  // Age, HR, SBP, Cr, Killip, cardiac arrest, ST deviation, biomarker
  let score = 0;
  if (patient.age < 30) score += 0;
  else if (patient.age < 40) score += 8;
  else if (patient.age < 50) score += 16;
  else if (patient.age < 60) score += 23;
  else if (patient.age < 70) score += 30;
  else if (patient.age < 80) score += 36;
  else score += 44;
  if (patient.heartRate < 50) score += 0;
  else if (patient.heartRate < 70) score += 3;
  else if (patient.heartRate < 90) score += 9;
  else if (patient.heartRate < 110) score += 14;
  else if (patient.heartRate < 150) score += 23;
  else score += 28;
  if (patient.systolicBp < 80) score += 24;
  else if (patient.systolicBp < 100) score += 22;
  else if (patient.systolicBp < 120) score += 18;
  else if (patient.systolicBp < 140) score += 14;
  else if (patient.systolicBp < 160) score += 10;
  else if (patient.systolicBp < 200) score += 4;
  else score += 0;
  if (patient.creatinine < 0.4) score += 1;
  else if (patient.creatinine < 0.8) score += 3;
  else if (patient.creatinine < 1.2) score += 5;
  else if (patient.creatinine < 1.6) score += 7;
  else if (patient.creatinine < 2.0) score += 9;
  else if (patient.creatinine < 4.0) score += 15;
  else score += 20;
  if (patient.killipClass === 1) score += 0;
  else if (patient.killipClass === 2) score += 20;
  else if (patient.killipClass === 3) score += 39;
  else if (patient.killipClass === 4) score += 59;
  if (patient.cardiacArrest) score += 43;
  if (patient.stDeviation) score += 17;
  if (patient.elevatedCardiacBiomarker) score += 13;
  return {
    score,
    riskLevel: score < 109 ? 'LOW' : score < 140 ? 'INTERMEDIATE' : 'HIGH',
    mortality: score < 109 ? '<1%' : score < 140 ? '1-3%' : '>3%'
  };
}

function calculateHEARTScore(patient) {
  // HEART Score for chest pain
  let score = 0;
  // History
  if (patient.history === 'SLIGHTLY_SUSPICIOUS') score += 0;
  else if (patient.history === 'MODERATELY_SUSPICIOUS') score += 1;
  else if (patient.history === 'HIGHLY_SUSPICIOUS') score += 2;
  // ECG
  if (patient.ecg === 'NORMAL') score += 0;
  else if (patient.ecg === 'NONSPECIFIC_REPOLARIZATION') score += 1;
  else if (patient.ecg === 'SIGNIFICANT_ST_DEPRESSION') score += 2;
  // Age
  if (patient.age < 45) score += 0;
  else if (patient.age < 65) score += 1;
  else score += 2;
  // Risk factors
  if (patient.riskFactors) score += 2;
  // Troponin
  if (patient.troponin <= normal) score += 0;
  else if (patient.troponin > normal && patient.troponin < 3 * normal) score += 1;
  else score += 2;
  return {
    score,
    riskLevel: score <= 3 ? 'LOW' : score <= 6 ? 'MODERATE' : 'HIGH',
    recommendation: score <= 3 ? 'Discharge with follow-up' : score <= 6 ? 'Admit for observation' : 'Early invasive strategy'
  };
}

function calculateCHA2DS2VASc(patient) {
  // CHA2DS2-VASc Score for AF stroke risk
  let score = 0;
  if (patient.chf) score += 1;                                  // C - CHF
  if (patient.hypertension) score += 1;                         // H - HTN
  if (patient.age >= 75) score += 2;                            // A2 - age ≥75
  else if (patient.age >= 65) score += 1;                       // A - age 65-74
  if (patient.diabetes) score += 1;                             // D - DM
  if (patient.stroke) score += 2;                               // S2 - stroke/TIA
  if (patient.vascularDisease) score += 1;                      // V - vascular
  if (patient.sex === 'F') score += 1;                          // Sc - sex (female)
  return {
    score,
    recommendation: patient.sex === 'M' && score === 0 ? 'No anticoag' :
                   patient.sex === 'M' && score === 1 ? 'Consider anticoag' :
                   patient.sex === 'F' && score <= 1 ? 'No anticoag' :
                   patient.sex === 'F' && score === 2 ? 'Consider anticoag' :
                   'Anticoagulation indicated'
  };
}

function calculateHASBLED(patient) {
  // HAS-BLED Score for bleeding risk on anticoag
  let score = 0;
  if (patient.hypertension) score += 1;                         // H - HTN
  if (patient.abnormalRenalFunction) score += 1;                 // A - abnormal renal
  if (patient.abnormalLiverFunction) score += 1;                // A - abnormal liver
  if (patient.stroke) score += 1;                               // S - stroke
  if (patient.bleeding) score += 1;                             // B - bleeding
  if (patient.labileINR) score += 1;                            // L - labile INR
  if (patient.elderly > 65) score += 1;                         // E - elderly
  if (patient.drugs) score += 1;                                // D - drugs (NSAID, antiplatelet)
  if (patient.alcohol) score += 1;                              // D - alcohol
  return {
    score,
    riskLevel: score <= 2 ? 'LOW' : 'HIGH',
    recommendation: 'Modify risk factors, more frequent monitoring'
  };
}

function calculateKillipClass(patient) {
  // Killip Class for HF in MI
  if (!patient.rales && !patient.s3) return { class: 1, mortality: '6%' };
  if (patient.rales < half) return { class: 2, mortality: '17%' };
  if (patient.rales >= half || pulmonaryEdema) return { class: 3, mortality: '38%' };
  if (patient.cardioGenicShock) return { class: 4, mortality: '81%' };
  return { class: null };
}

function classifyEcgStemi(ecg) {
  // STEMI criteria: ST elevation ≥1mm in 2+ contiguous leads
  // V2-V3: ≥2mm (men) ≥1.5mm (women)
  // Other leads: ≥1mm
  const contiguousLeads = [
    ['V1', 'V2', 'V3'],  // anteroseptal
    ['V3', 'V4', 'V5'],  // anterior
    ['V4', 'V5', 'V6'],  // lateral
    ['I', 'aVL'],         // high lateral
    ['II', 'III', 'aVF']  // inferior
  ];
  if (!ecg.stElevation) return { isStemi: false };
  for (const group of contiguousLeads) {
    const elevatedInGroup = group.filter(lead => ecg.stElevation[lead]).length;
    if (elevatedInGroup >= 2) {
      return { isStemi: true, location: groupName(group) };
    }
  }
  return { isStemi: false };
}

function groupName(leads) {
  if (leads.includes('V1') || leads.includes('V2')) return 'Anteroseptal';
  if (leads.includes('V3') || leads.includes('V4')) return 'Anterior';
  if (leads.includes('V5') || leads.includes('V6')) return 'Lateral';
  if (leads.includes('I') || leads.includes('aVL')) return 'High Lateral';
  if (leads.includes('II') || leads.includes('III')) return 'Inferior';
  return 'Unknown';
}

function classifyNYHA(patient) {
  // NYHA Functional Classification for HF
  if (!patient.symptomsAtRest && !patient.symptomsWithActivity) return { class: 1, description: 'No limitation' };
  if (!patient.symptomsAtRest && patient.symptomsWithActivity) return { class: 2, description: 'Slight limitation' };
  if (patient.symptomsAtRest === false && patient.markedSymptoms) return { class: 3, description: 'Marked limitation' };
  if (patient.symptomsAtRest) return { class: 4, description: 'Symptoms at rest' };
  return { class: null };
}

module.exports = {
  calculateTIMI, calculateGRACE, calculateHEARTScore,
  calculateCHA2DS2VASc, calculateHASBLED, calculateKillipClass,
  classifyEcgStemi, classifyNYHA
};
```
