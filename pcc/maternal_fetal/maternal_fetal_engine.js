'use strict';
// Maternal-Fetal Medicine Engine: 10 pure deterministic functions
// Compliance: ACOG, SMFM, RCOG, NICE, ISSHP, WHO, USPSTF

function PretermBirthRisk({ priorPreterm, cervicalLength, multipleGestation, priorConeBiopsy, smoking, uterineAnomaly, currentSymptoms, fibronectinResult, gestationalAge }) {
  let risk = 0;
  if (priorPreterm) risk += 4;
  if (cervicalLength && cervicalLength < 25) risk += 3;
  if (multipleGestation) risk += 2;
  if (priorConeBiopsy) risk += 2;
  if (smoking) risk += 1;
  if (uterineAnomaly) risk += 2;
  if (currentSymptoms && currentSymptoms === 'contractions') risk += 1;
  if (fibronectinResult === 'positive') risk += 3;
  if (gestationalAge < 32 && cervicalLength < 25) risk += 2;
  let category;
  if (risk >= 7) category = 'high-risk-preterm-immediate-intervention';
  else if (risk >= 4) category = 'moderate-risk-preterm-progesterone-cerclage';
  else if (risk >= 1) category = 'low-risk-preterm-monitoring';
  else category = 'no-preterm-risk';
  let treatment;
  if (category === 'high-risk-preterm-immediate-intervention') treatment = 'magnesium-sulfate-corticosteroids-tocolysis-consider-hospitalization';
  else if (category === 'moderate-risk-preterm-progesterone-cerclage') treatment = 'vaginal-progesterone-cerclage-consider';
  else if (category === 'low-risk-preterm-monitoring') treatment = 'increased-monitoring-progesterone-if-prior-preterm';
  else treatment = 'routine-prenatal-care';
  return { riskScore: risk, category, treatment };
}

function PreeclampsiaSeverity({ systolic, diastolic, proteinuria, edema, hyperreflexia, epigastricPain, platelets, ast, alt, creatinine, ldh, symptoms, gestationalAge }) {
  let isPreeclampsia = (systolic >= 140 || diastolic >= 90) && gestationalAge >= 20;
  let severeFeatures = false;
  if (systolic >= 160 || diastolic >= 110) severeFeatures = true;
  if (proteinuria && proteinuria >= 5) severeFeatures = true;
  if (hyperreflexia) severeFeatures = true;
  if (epigastricPain) severeFeatures = true;
  if (platelets < 100000) severeFeatures = true;
  if (ast >= 70 || alt >= 70) severeFeatures = true;
  if (creatinine >= 1.1) severeFeatures = true;
  if (ldh >= 600) severeFeatures = true;
  let category;
  if (!isPreeclampsia) category = 'no-preeclampsia';
  else if (severeFeatures) category = 'preeclampsia-with-severe-features';
  else if (symptoms && symptoms.length > 0) category = 'preeclampsia-with-severe-features';
  else category = 'preeclampsia-without-severe-features';
  let treatment;
  if (category === 'preeclampsia-with-severe-features' && gestationalAge >= 34) treatment = 'deliver-magnesium-sulfate';
  else if (category === 'preeclampsia-with-severe-features' && gestationalAge < 34) treatment = 'corticosteroids-consider-expectant-vs-delivery-magnesium';
  else if (category === 'preeclampsia-without-severe-features' && gestationalAge >= 37) treatment = 'deliver';
  else if (category === 'preeclampsia-without-severe-features') treatment = 'expectant-management-aspirin-close-monitoring';
  else if (systolic >= 140 || diastolic >= 90) treatment = 'gestational-hypertension-monitor';
  else treatment = 'routine-care';
  return { category, severeFeatures, treatment };
}

function HELLP({ platelets, ast, alt, ldh, hemolysis, schistocytes, bilirubin, creatinine, hypertension, symptoms }) {
  let hemolysisScore = (schistocytes ? 1 : 0) + (bilirubin >= 1.2 ? 1 : 0) + (ldh >= 600 ? 1 : 0);
  let liverScore = (ast >= 70 ? 1 : 0) + (alt >= 70 ? 1 : 0);
  let plateletScore = (platelets < 100000 ? 1 : 0);
  let category;
  if (hemolysisScore >= 1 && liverScore >= 1 && plateletScore >= 1) category = 'HELLP-syndrome-complete';
  else if (hemolysisScore + liverScore + plateletScore >= 2) category = 'HELLP-partial';
  else if (platelets < 150000 && hypertension) category = 'mild-HELLP-spectrum';
  else category = 'no-HELLP';
  let treatment;
  if (category === 'HELLP-syndrome-complete') treatment = 'urgent-delivery-magnesium-sulfate';
  else if (category === 'HELLP-partial') treatment = 'urgent-evaluation-magnesium-steroids-deliver-or-expectant';
  else if (category === 'mild-HELLP-spectrum') treatment = 'close-monitoring-magnesium-if-deliver-imminent';
  else treatment = 'monitor';
  return { category, hemolysisScore, liverScore, plateletScore, treatment };
}

function GestationalDiabetes({ fastingGlucose, oneHourGCT, threeHourOGTT_F, threeHourOGTT_1, threeHourOGTT_2, threeHourOGTT_3, priorGDM, bmi, age, familyHistory }) {
  let screening;
  if (oneHourGCT >= 200) screening = 'GDM-implied-by-GCT-200';
  else if (oneHourGCT >= 140) screening = 'GCT-abnormal-needs-OGTT';
  else if (oneHourGCT < 140) screening = 'GCT-normal';
  else screening = 'GCT-not-done';
  let ogtt;
  const abnCount = (threeHourOGTT_F >= 95 ? 1 : 0) + (threeHourOGTT_1 >= 180 ? 1 : 0) + (threeHourOGTT_2 >= 155 ? 1 : 0) + (threeHourOGTT_3 >= 140 ? 1 : 0);
  if (abnCount >= 2) ogtt = 'GDM-carpenter-coustan-criteria-met';
  else if (abnCount === 1) ogtt = 'impaired-glucose-tolerance';
  else if (abnCount === 0 && threeHourOGTT_F) ogtt = 'no-GDM';
  else ogtt = 'OGTT-pending';
  let treatment;
  if (ogtt === 'GDM-carpenter-coustan-criteria-met' || screening === 'GDM-implied-by-GCT-200') treatment = 'medical-nutrition-therapy-self-monitoring-fetal-surveillance-consider-metformin-or-insulin';
  else if (ogtt === 'impaired-glucose-tolerance') treatment = 'early-GDM-therapy-recheck-3rd-trimester';
  else if (screening === 'GCT-normal') treatment = 'no-GDM-routine-care';
  else treatment = 'await-OGTT';
  if (priorGDM) treatment += '-recurrent-risk';
  return { screening, ogtt, treatment };
}

function FetalGrowthRestriction({ estimatedFetalWeight, abdominalCircumference, umbilicalArteryDoppler, middleCerebralArteryDoppler, ductusVenosus, biophysicalProfile, amnioticFluidIndex, gestationalAge }) {
  let category;
  if (estimatedFetalWeight < 3) category = 'severe-FGR-3rd-percentile';
  else if (estimatedFetalWeight < 10) category = 'FGR-less-than-10th-percentile';
  else if (abdominalCircumference < 5) category = 'abdominal-FGR';
  else if (umbilicalArteryDoppler === 'absent-end-diastolic') category = 'umbilical-ARED-flow';
  else if (umbilicalArteryDoppler === 'reversed-end-diastolic') category = 'umbilical-RED-flow';
  else category = 'small-for-gestational-age-or-no-FGR';
  let plan;
  if (category === 'severe-FGR-3rd-percentile' && gestationalAge >= 37) plan = 'deliver';
  else if (category === 'umbilical-RED-flow') plan = 'immediate-delivery-if-viable-steroids';
  else if (category === 'umbilical-ARED-flow') plan = 'frequent-monitoring-consider-delivery-34-37w';
  else if (category === 'FGR-less-than-10th-percentile') plan = 'serial-growth-and-doppler-1-2-week';
  else plan = 'routine-monitoring';
  if (ductusVenosus === 'abnormal') plan += '-DV-abnormal-delivery';
  if (biophysicalProfile && biophysicalProfile < 6) plan += '-BPP-low-delivery';
  return { category, plan };
}

function PreeclampsiaFirstTrimester({ meanArterialPressure, pappA, pIGF, plGF, riskFactors, priorPreeclampsia, bmi, chronicHypertension, diabetes }) {
  let risk = 0;
  if (meanArterialPressure >= 90) risk += 2;
  if (pappA < 0.5) risk += 1;
  if (pIGF < 0.5) risk += 1;
  if (plGF < 0.5) risk += 1;
  if (priorPreeclampsia) risk += 3;
  if (chronicHypertension) risk += 2;
  if (diabetes) risk += 1;
  if (bmi >= 30) risk += 1;
  let category;
  if (risk >= 7) category = 'high-risk-consider-aspirin-150mg';
  else if (risk >= 4) category = 'moderate-risk-aspirin-81-150mg';
  else if (risk >= 1) category = 'low-risk-routine-care';
  else category = 'very-low-risk';
  let treatment;
  if (category === 'high-risk-consider-aspirin-150mg' || category === 'moderate-risk-aspirin-81-150mg') treatment = 'low-dose-aspirin-start-before-16w-continue-36w';
  else treatment = 'no-aspirin-needed';
  return { riskScore: risk, category, treatment };
}

function TwinGestationManagement({ chorionicity, gestationalAge, growthDiscrepancy, ttts, selectiveFGR, twinPeakSign, cordInsertion, modeOfDelivery }) {
  let assessment;
  if (chorionicity === 'monochorionic-diamniotic') assessment = 'high-risk-MD-twins-every-2-week-surveillance';
  else if (chorionicity === 'monochorionic-monoamniotic') assessment = 'very-high-risk-MM-twins-consider-occlusion';
  else if (chorionicity === 'dichorionic-diamniotic') assessment = 'moderate-risk-DD-twins-monthly-then-biweekly';
  else assessment = 'unknown-chorionicity';
  let complication;
  if (ttts) complication = 'TTTS-stage-1-2-laser-or-amnioreduction-3-4-deliver-or-laser';
  else if (selectiveFGR) complication = 'sFGR-monitoring-consider-umbilical-coagulation';
  else if (growthDiscrepancy && growthDiscrepancy > 20) complication = 'discordance-monitoring';
  else complication = 'no-complication';
  if (twinPeakSign === 'lambda') assessment += '-dichorionic-confirmed';
  if (twinPeakSign === 'T-sign') assessment += '-monochorionic-diamniotic-confirmed';
  return { assessment, complication, chorionicity };
}

function PPHRisk({ uterineAtonyRisk, priorPPH, multipleGestation, macrosomia, chorioamnionitis, prolongedLabor, coagulationDisorder, placentaAccreta, onAnticoagulation }) {
  let risk = 0;
  if (uterineAtonyRisk) risk += 3;
  if (priorPPH) risk += 3;
  if (multipleGestation) risk += 1;
  if (macrosomia) risk += 1;
  if (chorioamnionitis) risk += 2;
  if (prolongedLabor) risk += 2;
  if (coagulationDisorder) risk += 3;
  if (placentaAccreta) risk += 3;
  if (onAnticoagulation) risk += 1;
  let category;
  if (risk >= 8) category = 'very-high-PPH';
  else if (risk >= 5) category = 'high-PPH';
  else if (risk >= 2) category = 'moderate-PPH';
  else category = 'low-PPH';
  let prophylaxis;
  if (category === 'very-high-PPH') prophylaxis = 'active-management-uterotonics-tranexamic-acid-blood-products-standby-Bakri-Belfort-suture';
  else if (category === 'high-PPH') prophylaxis = 'active-management-oxytocin-uterotonics-tranexamic-acid';
  else if (category === 'moderate-PPH') prophylaxis = 'active-management-oxytocin';
  else prophylaxis = 'standard-active-management-oxytocin';
  return { riskScore: risk, category, prophylaxis };
}

function FetalHeartRate({ baseline, variability, accelerations, decelerations, uterineContractions, maternalHR, duration }) {
  let category;
  if (baseline < 110) category = 'Category-1-bradycardia-110';
  else if (baseline > 160) category = 'Category-1-tachycardia-160';
  else if (variability === 'absent' && decelerations === 'variable-decelerations' && duration > 60) category = 'Category-2-decelerations-moderate-variability-IL';
  else if (variability === 'minimal' && decelerations === 'late-decelerations') category = 'Category-2-late-decs-min-variability';
  else if (variability === 'absent' && decelerations === 'late-decelerations') category = 'Category-3-absent-variability-late-decs';
  else if (variability === 'absent' && decelerations === 'variable-decelerations' && duration > 60) category = 'Category-3-prolonged-dec-absent-variability';
  else if (variability === 'moderate' && accelerations >= 2) category = 'Category-1-normal';
  else if (variability === 'moderate') category = 'Category-1-low-risk';
  else if (baseline < 110 || baseline > 160) category = 'Category-2-abnormal-baseline';
  else category = 'Category-1';
  let management;
  if (category.startsWith('Category-3')) management = 'immediate-resuscitation-delivery-if-no-improvement';
  else if (category.startsWith('Category-2')) management = 'intrauterine-resuscitation-reposition-IV-fluid-evaluate-cause';
  else if (category.startsWith('Category-1-normal') || category === 'Category-1') management = 'continue-monitoring';
  else management = 'continue-monitoring-correct-cause';
  return { category, management };
}

function PreeclampsiaAspirin({ highRisk, priorPreeclampsia, chronicHypertension, autoimmuneDisease, diabetes, multifetal, bmi, age, lowDoseStarted, gestationalAgeStarted }) {
  let indication = false;
  if (highRisk && (priorPreeclampsia || chronicHypertension)) indication = true;
  if (autoimmuneDisease) indication = true;
  if (multifetal) indication = true;
  if (diabetes && (chronicHypertension || priorPreeclampsia)) indication = true;
  if (bmi >= 35 && age >= 35 && (diabetes || chronicHypertension)) indication = true;
  if (priorPreeclampsia) indication = true;
  let dose;
  if (highRisk) dose = 'aspirin-150-162mg';
  else if (indication) dose = 'aspirin-81-100mg';
  else dose = 'no-aspirin';
  let startedOnTime;
  if (gestationalAgeStarted <= 16) startedOnTime = 'yes-optimal';
  else if (gestationalAgeStarted <= 20) startedOnTime = 'acceptable';
  else if (gestationalAgeStarted <= 28) startedOnTime = 'late';
  else startedOnTime = 'too-late';
  return { indication, dose, startedOnTime };
}

module.exports = {
  PretermBirthRisk, PreeclampsiaSeverity, HELLP, GestationalDiabetes, FetalGrowthRestriction,
  PreeclampsiaFirstTrimester, TwinGestationManagement, PPHRisk, FetalHeartRate, PreeclampsiaAspirin,
};
