# SURG-001 — Engine Module (Pure JS)

```javascript
// namaweb/surg_engine.js
'use strict';

function classifyASA(classInput) {
  // ASA Physical Status Classification
  if (classInput === '1') return { class: 1, mortality: '0.06-0.08%' };
  if (classInput === '2') return { class: 2, mortality: '0.27%' };
  if (classInput === '3') return { class: 3, mortality: '1.8%' };
  if (classInput === '4') return { class: 4, mortality: '7.8%' };
  if (classInput === '5') return { class: 5, mortality: '9.4%' };
  if (classInput === '6') return { class: 6, mortality: 'high' };
  return { class: null };
}

function calculateRCRI(patient) {
  // Revised Cardiac Risk Index
  let score = 0;
  if (patient.highRiskSurgery) score += 1;
  if (patient.historyOfIshemicHeartDisease) score += 1;
  if (patient.historyOfCHF) score += 1;
  if (patient.historyOfCerebrovascularDisease) score += 1;
  if (patient.diabetesOnInsulin) score += 1;
  if (patient.preopCrGreaterThan2) score += 1;
  return {
    score,
    riskLevel: score === 0 ? 'LOW' : score <= 1 ? 'MODERATE' : score <= 2 ? 'HIGH' : 'VERY_HIGH',
    majorCardiacComplication: score * 0.7
  };
}

function calculateARISCAT(patient) {
  // Assess Respiratory Risk in Surgical Patients in Catalonia
  let score = 0;
  // Age
  if (patient.age >= 50 && patient.age < 80) score += 1;
  else if (patient.age >= 80) score += 3;
  // Preop SpO2
  if (patient.preopSpo2 >= 96) score += 0;
  else if (patient.preopSpo2 >= 91 && patient.preopSpo2 <= 95) score += 8;
  else if (patient.preopSpo2 <= 90) score += 24;
  // Respiratory infection last month
  if (patient.respiratoryInfection) score += 17;
  // Preop anemia
  if (patient.preopHbLessThan10) score += 11;
  // Surgical site
  if (patient.surgicalSite === 'UPPER_ABDOMINAL') score += 4;
  else if (patient.surgicalSite === 'INTRATHORACIC') score += 11;
  // Duration
  if (patient.durationHours >= 2 && patient.durationHours < 3) score += 4;
  else if (patient.durationHours >= 3) score += 10;
  // Emergency
  if (patient.urgency === 'EMERGENCY') score += 8;
  return {
    score,
    riskLevel: score < 26 ? 'LOW' : score < 44 ? 'MODERATE' : 'HIGH',
    pneumoniaRisk: `${(score * 0.15).toFixed(1)}%`
  };
}

function classifyClavienDindo(grade) {
  if (grade === 1) return { description: 'Any deviation from normal postop, no therapy', examples: 'Antiemetics, antipyretics, diuretics, electrolytes' };
  if (grade === 2) return { description: 'Requiring pharmacologic treatment', examples: 'Antibiotics, blood transfusion, TPN' };
  if (grade === 3) return { description: 'Requiring surgical, endoscopic, or radiologic intervention', examples: 'OR, reintubation, IR drain' };
  if (grade === '3a') return { description: 'Not under GA', examples: 'IR drain, endoscopy' };
  if (grade === '3b') return { description: 'Under GA', examples: 'Re-operation' };
  if (grade === 4) return { description: 'Life-threatening complication requiring ICU', examples: 'MI, respiratory failure, sepsis' };
  if (grade === '4a') return { description: 'Single organ dysfunction', examples: 'Dialysis, ventilation' };
  if (grade === '4b') return { description: 'Multiorgan dysfunction', examples: 'MODS' };
  if (grade === 5) return { description: 'Death', examples: '' };
  return { description: 'Unknown' };
}

function calculateAPACHE_II_Surgical(patient) {
  // For surgical ICU admission
  // Similar to medical APACHE II but with surgical modifier
  const apache = require('./micu_engine').calculateAPACHE_II(patient);
  return apache;
}

function calculateERASChecklist(patient, procedure) {
  const items = [];
  if (procedure.major) {
    items.push('Preop counseling');
    items.push('Carbohydrate loading 2h before');
    items.push('No prolonged fasting');
    items.push('No bowel prep (unless specific)');
    items.push('Antibiotic prophylaxis');
    items.push('VTE prophylaxis');
    items.push('Normothermia');
    items.push('Multimodal analgesia (no opioid if possible)');
    items.push('No NG tube');
    items.push('No drains if possible');
    items.push('Early mobilization');
    items.push('Early feeding');
  }
  return { items, compliant: items.length >= 10 };
}

function checkAntibioticTiming(procedure) {
  if (!procedure.antibioticGiven) {
    return { compliant: false, issue: 'Antibiotic not given' };
  }
  const incisionTime = new Date(procedure.startedAt);
  const antibioticTime = new Date(procedure.antibioticTime);
  const diffMinutes = (incisionTime - antibioticTime) / (1000 * 60);
  if (diffMinutes > 60) {
    return { compliant: false, issue: `Antibiotic given ${diffMinutes.toFixed(0)} min before incision (>60 min)` };
  }
  return { compliant: true, minutesBefore: diffMinutes };
}

function classifyWoundClass(surgicalField) {
  // CDC Wound Classification
  if (surgicalField === 'CLEAN') return { class: 'CLEAN', infectionRate: '1-5%' };
  if (surgicalField === 'CLEAN_CONTAMINATED') return { class: 'CLEAN_CONTAMINATED', infectionRate: '2-9%' };
  if (surgicalField === 'CONTAMINATED') return { class: 'CONTAMINATED', infectionRate: '5-15%' };
  if (surgicalField === 'DIRTY') return { class: 'DIRTY', infectionRate: '>30%' };
  return { class: 'UNKNOWN' };
}

module.exports = {
  classifyASA, calculateRCRI, calculateARISCAT, classifyClavienDindo,
  calculateERASChecklist, checkAntibioticTiming, classifyWoundClass
};
```
