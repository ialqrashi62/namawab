# OBG-001 — Engine Module (Pure JS)

```javascript
// namaweb/obg_engine.js
'use strict';

function calculateEDD(lmpDate) {
  const lmp = new Date(lmpDate);
  const edd = new Date(lmp);
  edd.setDate(edd.getDate() + 280); // 40 weeks
  return edd;
}

function calculateGestationalAge(lmpDate, currentDate = new Date()) {
  const lmp = new Date(lmpDate);
  const diffMs = currentDate - lmp;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  return { weeks, days, totalDays: diffDays, completed: `${weeks}+${days}` };
}

function classifyPreeclampsia(bp, proteinuria, symptoms, labs) {
  const systolic = bp.systolic;
  const diastolic = bp.diastolic;
  const protein = proteinuria;
  const hasSevereBP = systolic >= 160 || diastolic >= 110;
  const hasMildBP = systolic >= 140 || diastolic >= 90;
  const hasProtein = protein && protein !== 'NIL' && protein !== 'TRACE';
  const hasSevereSymptoms = symptoms && (symptoms.includes('severe_headache') || symptoms.includes('visual_disturbance') || symptoms.includes('epigastric_pain'));
  const hasLabSevere = labs && (labs.platelets < 100000 || labs.ast > 70 || labs.creatinine > 1.1);

  if (symptoms && symptoms.includes('seizure')) return 'ECLAMPSIA';
  if (symptoms && (symptoms.includes('hemolysis') || labs.platelets < 100000 || labs.ast > 70)) {
    return 'HELLP';
  }
  if ((hasSevereBP || hasSevereSymptoms || hasLabSevere) && hasProtein) return 'SEVERE_PREECLAMPSIA';
  if (hasMildBP && hasProtein) return 'PREECLAMPSIA';
  if (hasMildBP && !hasProtein) return 'GESTATIONAL_HYPERTENSION';
  return 'NORMAL';
}

function classifyGDM(testType, values) {
  if (testType === 'OGTT_75G') {
    // IADPSG / ADA criteria
    if (values.fasting >= 92) return 'GDM';
    if (values.oneHour >= 180) return 'GDM';
    if (values.twoHour >= 153) return 'GDM';
    return 'NORMAL';
  }
  if (testType === 'OGTT_100G') {
    // Carpenter-Coustan
    if (values.fasting >= 95) return 'GDM';
    if (values.oneHour >= 180) return 'GDM';
    if (values.twoHour >= 155) return 'GDM';
    if (values.threeHour >= 140) return 'GDM';
    return 'NORMAL';
  }
  if (testType === 'OGTT_50G') {
    // Screening: if >=140, do diagnostic 100G
    if (values.oneHour >= 200) return 'GDM';
    if (values.oneHour >= 140) return 'SCREEN_POSITIVE';
    return 'NORMAL';
  }
  return 'UNKNOWN';
}

function calculateApgar(score) {
  // Apgar at 1, 5, 10 min: 0-2 per category, total 0-10
  // Heart rate, Respiratory effort, Muscle tone, Reflex irritability, Color
  return {
    oneMin: score.oneMin,
    fiveMin: score.fiveMin,
    tenMin: score.tenMin || null,
    interpretation: {
      oneMin: score.oneMin >= 7 ? 'REASSURING' : score.oneMin >= 4 ? 'MODERATELY_DEPRESSED' : 'SEVERELY_DEPRESSED',
      fiveMin: score.fiveMin >= 7 ? 'REASSURING' : score.fiveMin >= 4 ? 'MODERATELY_DEPRESSED' : 'SEVERELY_DEPRESSED'
    }
  };
}

function calculateBishopScore(cervix) {
  // Cervical favorability for induction
  // Dilation, Effacement, Station, Position, Consistency
  let score = 0;
  const sub = {};
  if (cervix.dilation >= 4) sub.dilation = 2;
  else if (cervix.dilation >= 2) sub.dilation = 1;
  else sub.dilation = 0;
  score += sub.dilation;

  if (cervix.effacement >= 80) sub.effacement = 2;
  else if (cervix.effacement >= 60) sub.effacement = 1;
  else if (cervix.effacement >= 40) sub.effacement = 0;
  else sub.effacement = -1;
  score += sub.effacement;

  if (cervix.station <= -1) sub.station = 2;
  else if (cervix.station === 0) sub.station = 1;
  else if (cervix.station === -1) sub.station = 0;
  else sub.station = -1;
  score += sub.station;

  if (cervix.position === 'anterior') sub.position = 2;
  else if (cervix.position === 'mid') sub.position = 1;
  else sub.position = 0;
  score += sub.position;

  if (cervix.consistency === 'soft') sub.consistency = 2;
  else if (cervix.consistency === 'medium') sub.consistency = 1;
  else sub.consistency = 0;
  score += sub.consistency;

  return { total: score, subscores: sub, favorable: score >= 6 };
}

function calculateASPRERisk(input) {
  // ASPRE trial: preeclampsia prevention with low-dose aspirin
  // High risk if: prior PE, chronic HTN, diabetes, BMI>35, etc.
  let score = 0;
  if (input.pregnancyHistory === 'MULTIPAROUS_WITH_PE') score += 2;
  if (input.chronicHypertension) score += 2;
  if (input.preExistingDiabetes) score += 2;
  if (input.bmi >= 35) score += 1;
  if (input.familyHistory) score += 1;
  if (input.age >= 40 || input.age <= 18) score += 1;
  if (input.assistedReproduction) score += 1;
  if (input.meanArterialPressure >= 90) score += 2;
  if (input.previousGdm) score += 1;
  if (input.ethnicity === 'black') score += 1;
  if (input.uteroplacentalHistory) score += 1;
  return {
    score,
    highRisk: score >= 3,
    asaIndicated: score >= 1,
    asaDose: score >= 3 ? '150mg nightly from 12-36 weeks' : '81-100mg nightly (consider)'
  };
}

function calculateBloodLoss(delivery) {
  // Postpartum hemorrhage risk + quantitative blood loss
  const riskFactors = [];
  if (delivery.multiple) riskFactors.push('Multiple gestation');
  if (delivery.prolongedLabor) riskFactors.push('Prolonged labor');
  if (delivery.previousPph) riskFactors.push('Previous PPH');
  if (delivery.placentaPrevia) riskFactors.push('Placenta previa');
  if (delivery.placentaAccreta) riskFactors.push('Placenta accreta');
  if (delivery.macrosomia) riskFactors.push('Macrosomia');
  if (delivery.coagulopathy) riskFactors.push('Coagulopathy');

  return {
    estimated: delivery.estimatedBloodLossMl,
    isPph: delivery.estimatedBloodLossMl >= 500 || (delivery.cesarean && delivery.estimatedBloodLossMl >= 1000),
    isSeverePph: delivery.estimatedBloodLossMl >= 1000,
    riskFactors
  };
}

function calculateGTPAL(pregnancy) {
  // G (Gravida), T (Term), P (Preterm), A (Abortion), L (Living)
  return {
    G: pregnancy.gravida,
    T: pregnancy.termDeliveries || 0,
    P: pregnancy.pretermDeliveries || 0,
    A: pregnancy.abortions,
    L: pregnancy.living,
    notation: `G${pregnancy.gravida}T${pregnancy.termDeliveries || 0}P${pregnancy.pretermDeliveries || 0}A${pregnancy.abortions}L${pregnancy.living}`
  };
}

function calculateAnomalyScan(findings) {
  // First trimester screen + anatomy scan
  // NT measurement, nuchal translucency
  if (findings.nuchalTranslucency < 3.5) return { risk: 'LOW' };
  if (findings.nuchalTranslucency < 4.5) return { risk: 'INTERMEDIATE' };
  return { risk: 'HIGH' };
}

function calculatePregnancyRisk(pregnancy) {
  let risk = 'LOW';
  const factors = [];

  if (pregnancy.age >= 35) { risk = 'MODERATE'; factors.push('Advanced maternal age'); }
  if (pregnancy.age >= 40) { risk = 'HIGH'; factors.push('AMA ≥40'); }
  if (pregnancy.age < 18) { risk = 'MODERATE'; factors.push('Young maternal age'); }
  if (pregnancy.bmi >= 35) { risk = 'HIGH'; factors.push('BMI ≥35'); }
  if (pregnancy.previousPph) { risk = 'MODERATE'; factors.push('Previous PPH'); }
  if (pregnancy.previousCesarean) { factors.push('Previous C-section'); }
  if (pregnancy.multipleGestation) { risk = 'HIGH'; factors.push('Multiple gestation'); }
  if (pregnancy.preExistingDiabetes) { risk = 'MODERATE'; factors.push('Pre-existing diabetes'); }
  if (pregnancy.chronicHypertension) { risk = 'MODERATE'; factors.push('Chronic HTN'); }
  if (pregnancy.ivfPregnancy) { factors.push('IVF pregnancy'); }
  if (pregnancy.previousPreEclampsia) { risk = 'HIGH'; factors.push('Previous pre-eclampsia'); }

  return { risk, factors, count: factors.length };
}

function classifyFetalHeartRate(trace) {
  // Category I (normal), II (indeterminate), III (abnormal)
  if (trace.baseline >= 110 && trace.baseline <= 160 && trace.variability >= 6 && !trace.decelerations) {
    return { category: 'I', action: 'CONTINUE_MONITORING' };
  }
  if (trace.absentVariability && trace.repetitiveLateDecels || trace.bradycardia) {
    return { category: 'III', action: 'INTERVENTION_REQUIRED' };
  }
  return { category: 'II', action: 'EVALUATE_AND_REASSESS' };
}

function assessNewbornResuscitation(apgar) {
  if (apgar.fiveMin >= 7) return { need: 'NONE' };
  if (apgar.fiveMin >= 4) return { need: 'STIMULATION_AND_O2' };
  if (apgar.fiveMin >= 0) return { need: 'PPV_THEN_CHEST_COMPRESSIONS' };
  return { need: 'FULL_RESUSCITATION' };
}

module.exports = {
  calculateEDD, calculateGestationalAge, classifyPreeclampsia, classifyGDM,
  calculateApgar, calculateBishopScore, calculateASPRERisk, calculateBloodLoss,
  calculateGTPAL, calculateAnomalyScan, calculatePregnancyRisk, classifyFetalHeartRate,
  assessNewbornResuscitation
};
```

## Test Cases (will be in 01_unit_tests.md)
- EDD: LMP 2024-01-01 → 280 days = 2024-10-07
- Gestational age: LMP 2024-01-01, today 2024-04-01 → 13+0
- Preeclampsia: BP 165/115, protein 2+, headache → SEVERE_PREECLAMPSIA
- GDM 75G: fasting 95, 1h 180, 2h 155 → GDM
- Apgar: HR 0, RR 0, tone 0, reflex 0, color 0 → 0
- Apgar: HR 2, RR 2, tone 2, reflex 2, color 2 → 10
- Bishop: dilation 4, effacement 80, station 0, anterior, soft → 9 (favorable)
- ASPRE: prior PE, chronic HTN, BMI 35 → score 5, high risk
- Blood loss: SVD 600 mL → PPH
- GTPAL: G3 T1 P0 A1 L1 → "G3T1P0A1L1"
- FHR: baseline 140, variability 8, no decels → Category I
- Resuscitation: Apgar 5min 5 → stimulation + O2
