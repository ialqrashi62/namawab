# MICU — Engine Module (Pure JS)

```javascript
// namaweb/micu_engine.js
// Medical ICU pure functions (no I/O, deterministic)

'use strict';

const SOFA_PARAMS = ['pao2_fio2', 'platelets', 'bilirubin', 'map_vasopressor', 'gcs', 'creatinine'];
const APACHE_II_PARAMS = ['temperature', 'map', 'heart_rate', 'respiratory_rate', 'pao2', 'ph', 'sodium', 'potassium', 'creatinine', 'hematocrit', 'wbc', 'gcs', 'age', 'chronic_health'];

function calculateSOFA(vitals) {
  let score = 0;
  const subscores = {};

  // Respiratory: PaO2/FiO2
  if (vitals.pao2_fio2 !== undefined) {
    if (vitals.pao2_fio2 >= 400) subscores.resp = 0;
    else if (vitals.pao2_fio2 >= 300) subscores.resp = 1;
    else if (vitals.pao2_fio2 >= 200) subscores.resp = 2;
    else if (vitals.pao2_fio2 >= 100) subscores.resp = 3;
    else subscores.resp = 4;
    score += subscores.resp;
  }

  // Coagulation: platelets
  if (vitals.platelets !== undefined) {
    if (vitals.platelets >= 150) subscores.coag = 0;
    else if (vitals.platelets >= 100) subscores.coag = 1;
    else if (vitals.platelets >= 50) subscores.coag = 2;
    else if (vitals.platelets >= 20) subscores.coag = 3;
    else subscores.coag = 4;
    score += subscores.coag;
  }

  // Liver: bilirubin
  if (vitals.bilirubin !== undefined) {
    if (vitals.bilirubin < 1.2) subscores.liver = 0;
    else if (vitals.bilirubin < 2.0) subscores.liver = 1;
    else if (vitals.bilirubin < 6.0) subscores.liver = 2;
    else if (vitals.bilirubin < 12.0) subscores.liver = 3;
    else subscores.liver = 4;
    score += subscores.liver;
  }

  // Cardiovascular: MAP + vasopressor
  if (vitals.map !== undefined) {
    let cv = 0;
    if (vitals.map < 70) cv = 1;
    if (vitals.dopamine_le_5 || vitals.dobutamine_any) cv = 2;
    if (vitals.dopamine_gt_5 || vitals.epinephrine_le_03 || vitals.norepinephrine_le_03) cv = 3;
    if (vitals.dopamine_gt_15 || vitals.epinephrine_gt_03 || vitals.norepinephrine_gt_03) cv = 4;
    subscores.cv = cv;
    score += cv;
  }

  // CNS: GCS
  if (vitals.gcs !== undefined) {
    if (vitals.gcs >= 15) subscores.cns = 0;
    else if (vitals.gcs >= 13) subscores.cns = 1;
    else if (vitals.gcs >= 10) subscores.cns = 2;
    else if (vitals.gcs >= 6) subscores.cns = 3;
    else subscores.cns = 4;
    score += subscores.cns;
  }

  // Renal: creatinine (or UOP)
  if (vitals.creatinine !== undefined) {
    if (vitals.creatinine < 1.2) subscores.renal = 0;
    else if (vitals.creatinine < 2.0) subscores.renal = 1;
    else if (vitals.creatinine < 3.5) subscores.renal = 2;
    else if (vitals.creatinine < 5.0) subscores.renal = 3;
    else subscores.renal = 4;
    score += subscores.renal;
  }

  return { total: score, subscores, mortality: estimateSofaMortality(score) };
}

function estimateSofaMortality(sofaScore) {
  // SOFA mortality (Vincent 1998)
  if (sofaScore <= 1) return 0.5;
  if (sofaScore <= 3) return 5;
  if (sofaScore <= 5) return 15;
  if (sofaScore <= 7) return 30;
  if (sofaScore <= 9) return 50;
  if (sofaScore <= 11) return 65;
  if (sofaScore <= 13) return 80;
  return 90;
}

function calculateAPACHE_II(params) {
  let score = 0;

  // Temperature
  if (params.temperature >= 41 || params.temperature < 30) score += 4;
  else if (params.temperature >= 39 || params.temperature < 32) score += 3;
  else if ((params.temperature >= 38.5 && params.temperature < 39) || (params.temperature >= 34 && params.temperature < 36)) score += 1;
  else if (params.temperature >= 36 && params.temperature < 38.5) score += 0;

  // MAP
  if (params.map >= 160 || params.map < 50) score += 4;
  else if (params.map >= 130 || params.map < 70) score += 2;
  else if (params.map >= 110 || params.map < 80) score += 0;

  // Heart rate
  if (params.heart_rate >= 180 || params.heart_rate < 40) score += 4;
  else if ((params.heart_rate >= 140 && params.heart_rate < 180) || (params.heart_rate >= 55 && params.heart_rate < 70)) score += 2;
  else if (params.heart_rate >= 70 && params.heart_rate < 110) score += 0;

  // Respiratory rate
  if (params.respiratory_rate >= 50 || params.respiratory_rate < 6) score += 4;
  else if (params.respiratory_rate >= 35) score += 3;
  else if (params.respiratory_rate >= 25 || params.respiratory_rate < 12) score += 1;
  else if (params.respiratory_rate >= 12 && params.respiratory_rate < 25) score += 0;

  // Oxygenation
  if (params.fio2 >= 0.5 && params.pao2 < 200) score += 4;
  else if (params.fio2 >= 0.5 && params.pao2 >= 200) score += 3;
  else if (params.fio2 < 0.5 && params.pao2 < 70) score += 2;
  else score += 0;

  // pH
  if (params.ph >= 7.7 || params.ph < 7.15) score += 4;
  else if ((params.ph >= 7.6 && params.ph < 7.7) || (params.ph >= 7.15 && params.ph < 7.25)) score += 3;
  else if (params.ph >= 7.5 && params.ph < 7.6) score += 1;
  else if (params.ph >= 7.33 && params.ph < 7.5) score += 0;

  // Sodium
  if (params.sodium >= 180 || params.sodium < 110) score += 4;
  else if ((params.sodium >= 160 && params.sodium < 180) || (params.sodium >= 111 && params.sodium < 120)) score += 3;
  else if ((params.sodium >= 155 && params.sodium < 160) || (params.sodium >= 120 && params.sodium < 130)) score += 2;
  else if (params.sodium >= 150 && params.sodium < 155) score += 1;
  else if (params.sodium >= 130 && params.sodium < 150) score += 0;

  // Potassium
  if (params.potassium >= 7 || params.potassium < 2.5) score += 4;
  else if (params.potassium >= 6) score += 3;
  else if ((params.potassium >= 5.5 && params.potassium < 6) || params.potassium < 3) score += 1;
  else if (params.potassium >= 3.5 && params.potassium < 5.5) score += 0;

  // Creatinine (double if ARF)
  let crScore = 0;
  if (params.creatinine >= 3.5) crScore = 4;
  else if (params.creatinine >= 2 && params.creatinine < 3.5) crScore = 3;
  else if (params.creatinine >= 1.5 && params.creatinine < 2) crScore = 2;
  else if (params.creatinine < 0.6) crScore = 2;
  else crScore = 0;
  if (params.acute_renal_failure) crScore *= 2;
  score += crScore;

  // Hematocrit
  if (params.hematocrit >= 60 || params.hematocrit < 20) score += 4;
  else if ((params.hematocrit >= 50 && params.hematocrit < 60) || (params.hematocrit >= 20 && params.hematocrit < 30)) score += 2;
  else if (params.hematocrit >= 46 && params.hematocrit < 50) score += 1;
  else if (params.hematocrit >= 30 && params.hematocrit < 46) score += 0;

  // WBC
  if (params.wbc >= 40 || params.wbc < 1) score += 4;
  else if ((params.wbc >= 20 && params.wbc < 40) || (params.wbc >= 1 && params.wbc < 3)) score += 2;
  else if (params.wbc >= 15 && params.wbc < 20) score += 1;
  else if (params.wbc >= 3 && params.wbc < 15) score += 0;

  // GCS
  score += (15 - params.gcs);

  // Age
  if (params.age >= 75) score += 6;
  else if (params.age >= 65) score += 5;
  else if (params.age >= 55) score += 3;
  else if (params.age >= 45) score += 2;
  else if (params.age < 45) score += 0;

  // Chronic health
  if (params.chronic_health === 'severe') score += 5;
  else if (params.chronic_health === 'moderate') score += 2;
  else score += 0;

  return { total: score, mortality: estimateApacheMortality(score, params.chronic_health) };
}

function estimateApacheMortality(score, chronic) {
  // APACHE II mortality (Knaus 1985)
  const base = score + (chronic === 'severe' ? 5 : 0);
  if (base < 10) return 5;
  if (base < 15) return 15;
  if (base < 20) return 25;
  if (base < 25) return 40;
  if (base < 30) return 55;
  if (base < 35) return 70;
  return 85;
}

function calculateGCS(eye, verbal, motor) {
  if (eye < 1 || eye > 4) throw new Error('Eye component must be 1-4');
  if (verbal < 1 || verbal > 5) throw new Error('Verbal component must be 1-5');
  if (motor < 1 || motor > 6) throw new Error('Motor component must be 1-6');
  return { total: eye + verbal + motor, components: { eye, verbal, motor } };
}

function calculateCAM_ICU(assessment) {
  // 4 features, positive if features 1+2 AND (3 OR 4)
  const feature1 = assessment.alteredMentalStatus || assessment.mentalStatusChange;
  const feature2 = assessment.inattention;
  const feature3 = assessment.alteredConsciousness;
  const feature4 = assessment.disorganizedThinking;
  const positive = (feature1 && feature2) && (feature3 || feature4);
  return { positive, features: { feature1, feature2, feature3, feature4 } };
}

function calculateRSBI(respiratoryRate, tidalVolume) {
  if (tidalVolume <= 0) return Infinity;
  return { rsbi: respiratoryRate / tidalVolume, passes: (respiratoryRate / tidalVolume) < 105 };
}

function calculateQSOFA(vitals) {
  let score = 0;
  if (vitals.respiratoryRate >= 22) score += 1;
  if (vitals.systolicBp <= 100) score += 1;
  if (vitals.gcs < 15) score += 1;
  return { total: score, highRisk: score >= 2 };
}

function checkSepsisBundle(bundleSteps) {
  const now = Date.now();
  const issues = [];
  let complianceStatus = 'COMPLIANT';

  if (!bundleSteps.lactate_drawn_at) {
    issues.push('Lactate not drawn');
    complianceStatus = 'MISSED';
  } else if ((now - bundleSteps.lactate_drawn_at) > 3600000) {
    issues.push('Lactate >1h');
    complianceStatus = 'DELAYED';
  }

  if (!bundleSteps.cultures_drawn_at) issues.push('Cultures not drawn');

  if (!bundleSteps.abx_started_at) {
    issues.push('Antibiotics not started');
    complianceStatus = 'MISSED';
  } else if ((now - bundleSteps.abx_started_at) > 3600000) {
    issues.push('ABX delayed >1h');
    complianceStatus = 'DELAYED';
  }

  if (bundleSteps.fluid_volume_ml < 30) issues.push('Insufficient fluid (need 30 mL/kg)');

  if (bundleSteps.vasopressor_required && !bundleSteps.vasopressor_started_at) {
    issues.push('Vasopressor not started despite hypotension');
    complianceStatus = 'DELAYED';
  }

  const totalTime = bundleSteps.bundle_completed_at - bundleSteps.bundle_started_at;
  return { complianceStatus, issues, totalMinutes: totalTime / 60000 };
}

function titrateVasoactiveDose(currentDose, currentMap, targetMap = 65) {
  if (currentMap < targetMap - 5) {
    return { action: 'INCREASE', newDose: currentDose * 1.25, reason: 'MAP below target' };
  } else if (currentMap > targetMap + 10) {
    return { action: 'DECREASE', newDose: currentDose * 0.75, reason: 'MAP above target' };
  } else {
    return { action: 'HOLD', newDose: currentDose, reason: 'MAP at target' };
  }
}

function assessVentWeaning(admission) {
  const criteria = {
    causeResolved: admission.respiratoryFailureResolved,
    noVasopressor: !admission.onVasopressor,
    oxygenation: admission.pfRatio >= 200 && admission.peep <= 8 && admission.fio2 <= 0.5,
    mentalStatus: admission.gcs >= 13,
    cough: admission.coughReflex,
    rsbi: admission.rsbi < 105
  };
  const ready = Object.values(criteria).every(c => c === true);
  return { ready, criteria };
}

module.exports = {
  calculateSOFA, calculateAPACHE_II, calculateGCS, calculateCAM_ICU,
  calculateRSBI, calculateQSOFA, checkSepsisBundle, titrateVasoactiveDose,
  assessVentWeaning, estimateSofaMortality, estimateApacheMortality
};
```

## Test Cases
- SOFA normal → 0
- SOFA max → 24
- APACHE II mid (50yo, no chronic, MAP 70, HR 90, RR 16) → ~10
- GCS 1+1+1 → 3
- GCS 4+5+6 → 15
- qSOFA RR 24, SBP 95, GCS 14 → 2 (high risk)
- RSBI f=20, Vt=0.4 → 50 (passes)
- RSBI f=30, Vt=0.2 → 150 (fails)
- Vasopressor titration: current 5 mcg/min, MAP 60 → increase to 6.25
- Vent weaning: P/F 250, PEEP 5, FiO2 0.4, GCS 14, RSBI 80 → ready
