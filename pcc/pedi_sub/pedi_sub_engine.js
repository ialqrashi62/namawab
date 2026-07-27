'use strict';
// Pediatric Sub-Specialties Engine: 10 pure deterministic functions
// Compliance: AAP, AHA (Pedi), KDIGO, ESC (Pedi), IPNA, NASPGHAN

function PediatricGCS({ eyeOpening, verbalResponse, motorResponse, age }) {
  let score = 0;
  if (age >= 1) {
    if (eyeOpening === 4) score += 4;
    else if (eyeOpening === 3) score += 3;
    else if (eyeOpening === 2) score += 2;
    else if (eyeOpening === 1) score += 1;
  } else {
    if (eyeOpening === 4) score += 4;
    else if (eyeOpening === 3) score += 3;
  }
  if (age >= 5) {
    if (verbalResponse === 5) score += 5;
    else if (verbalResponse === 4) score += 4;
    else if (verbalResponse === 3) score += 3;
    else if (verbalResponse === 2) score += 2;
    else if (verbalResponse === 1) score += 1;
  } else if (age >= 2) {
    if (verbalResponse === 5) score += 5;
    else if (verbalResponse === 4) score += 4;
    else if (verbalResponse === 3) score += 3;
    else if (verbalResponse === 2) score += 2;
  } else {
    if (verbalResponse === 5) score += 5;
    else if (verbalResponse === 3) score += 3;
  }
  if (motorResponse === 6) score += 6;
  else if (motorResponse === 5) score += 5;
  else if (motorResponse === 4) score += 4;
  else if (motorResponse === 3) score += 3;
  else if (motorResponse === 2) score += 2;
  else if (motorResponse === 1) score += 1;
  let severity;
  if (score <= 8) severity = 'severe-head-injury';
  else if (score <= 12) severity = 'moderate-head-injury';
  else severity = 'mild-head-injury';
  return { gcsTotal: score, severity };
}

function PediatricBacterialMeningitis({ age, fever, neckStiffness, alteredMentalStatus, seizures, fontanelle, csfWbc, csfProtein, csfGlucose, bloodCulture, priorAntibiotics }) {
  let risk = 0;
  if (fever) risk += 1;
  if (neckStiffness) risk += 2;
  if (alteredMentalStatus) risk += 2;
  if (seizures) risk += 1;
  if (fontanelle === 'bulging') risk += 2;
  if (csfWbc >= 1000) risk += 3;
  if (csfProtein >= 100) risk += 2;
  if (csfGlucose < 40) risk += 2;
  let diagnosis;
  if (risk >= 8) diagnosis = 'bacterial-meningitis';
  else if (risk >= 4) diagnosis = 'possible-bacterial-meningitis';
  else diagnosis = 'viral-meningitis-likely';
  let treatment;
  if (diagnosis === 'bacterial-meningitis') treatment = 'empirical-vancomycin-ceftriaxone-dexamethasone';
  else if (diagnosis === 'possible-bacterial-meningitis') treatment = 'empirical-antibiotics-await-csf';
  else treatment = 'supportive';
  return { risk, diagnosis, treatment };
}

function PediatricAsthmaSeverity({ respiratoryRate, oxygenSaturation, accessoryMuscle, wheeze, abilityToSpeak, mentalStatus, peakFlow }) {
  let severity = 0;
  if (respiratoryRate >= 50 && !accessoryMuscle) severity += 1;
  if (respiratoryRate >= 70) severity += 2;
  if (oxygenSaturation < 92) severity += 2;
  if (accessoryMuscle) severity += 1;
  if (wheeze === 'silent') severity += 2;
  else if (wheeze === 'loud') severity += 1;
  if (abilityToSpeak === 'words') severity += 1;
  if (abilityToSpeak === 'unable') severity += 2;
  if (mentalStatus === 'agitated') severity += 1;
  if (mentalStatus === 'drowsy') severity += 2;
  if (peakFlow && peakFlow < 33) severity += 2;
  let classification;
  if (severity >= 6) classification = 'severe-exacerbation';
  else if (severity >= 3) classification = 'moderate-exacerbation';
  else classification = 'mild-exacerbation';
  let treatment;
  if (classification === 'severe-exacerbation') treatment = 'continuous-b2-agonist-IV-steroids-Mg';
  else if (classification === 'moderate-exacerbation') treatment = 'SABA-MDI-spacer-oral-steroids';
  else treatment = 'SABA-MDI-spacer-only';
  return { severity, classification, treatment };
}

function PediatricDehydration({ weightLoss, skinTurgor, mucousMembranes, eyes, heartRate, urineOutput, mentalStatus, capillaryRefill, sunkenFontanelle }) {
  let score = 0;
  if (weightLoss >= 5 && weightLoss < 10) score += 2;
  else if (weightLoss >= 10) score += 4;
  if (skinTurgor === 'decreased') score += 2;
  if (mucousMembranes === 'dry') score += 1;
  if (eyes === 'sunken') score += 1;
  if (heartRate > 150) score += 1;
  if (urineOutput === 'decreased') score += 1;
  if (mentalStatus === 'lethargic') score += 2;
  if (capillaryRefill > 2) score += 1;
  if (sunkenFontanelle) score += 1;
  let severity;
  if (score >= 8) severity = 'severe-dehydration-bolus';
  else if (score >= 4) severity = 'moderate-dehydration-ORS';
  else severity = 'mild-dehydration-ORS';
  return { score, severity, recommendation: severity === 'severe-dehydration-bolus' ? 'bolus-20ml-kg-NSS-or-RL' : 'ORS-50-100ml-kg-4h' };
}

function PediatricAcuteNephriticSyndrome({ age, hypertension, edema, hematuria, proteinuria, oliguria, c3Low, asotTiter, recentPharyngitis, recentSkin, crp }) {
  let diagnosis;
  if (age >= 3 && hypertension && edema && hematuria && (recentPharyngitis || recentSkin) && c3Low) diagnosis = 'PSGN-definite';
  else if (hypertension && edema && hematuria && c3Low) diagnosis = 'PSGN-probable';
  else if (hematuria && proteinuria && c3Low) diagnosis = 'membranoproliferative-GN';
  else if (hematuria && hypertension) diagnosis = 'IgA-nephropathy-consider';
  else diagnosis = 'no-nephritic-syndrome';
  return { diagnosis, recommendation: diagnosis === 'PSGN-definite' ? 'supportive-salt-fluid-restriction' : 'nephrology-referral-biopsy-if-needed' };
}

function PediatricUTI({ age, fever, pyuria, nitrites, leukocyteEsterase, urineCulture, priorUTI, gender, ultrasoundFindings, voidingCystourethrogram }) {
  let diagnosis;
  if (fever && pyuria && (nitrites || leukocyteEsterase)) diagnosis = 'febrile-UTI-pyelonephritis';
  else if (pyuria && (nitrites || leukocyteEsterase)) diagnosis = 'lower-UTI-cystitis';
  else if (leukocyteEsterase) diagnosis = 'possible-UTI';
  else diagnosis = 'no-UTI';
  let treatment;
  if (diagnosis === 'febrile-UTI-pyelonephritis' && age < 2) treatment = 'IV-ceftriaxone-then-oral';
  else if (diagnosis === 'febrile-UTI-pyelonephritis') treatment = 'oral-cephalosporin-7-14-days';
  else if (diagnosis === 'lower-UTI-cystitis') treatment = 'oral-cephalosporin-or-nitro';
  else if (diagnosis === 'possible-UTI') treatment = 'urine-culture-and-empirical-treatment';
  else treatment = 'monitor';
  let investigation;
  if (age < 2 && diagnosis !== 'no-UTI') investigation = 'renal-bladder-US';
  if (ultrasoundFindings && ultrasoundFindings === 'abnormal') investigation = 'voiding-cystourethrogram-DMSA';
  if (voidingCystourethrogram && voidingCystourethrogram === 'vesicoureteral-reflux') investigation = 'long-term-prophylaxis-consider';
  return { diagnosis, treatment, investigation };
}

function PediatricCardiacFailure({ age, tachypnea, tachycardia, hepatomegaly, edema, poorWeightGain, cyanosis, cardiomegaly, gallop, decreasedPulses, congestionOnCXR }) {
  let score = 0;
  if (tachypnea) score += 1;
  if (tachycardia) score += 1;
  if (hepatomegaly) score += 2;
  if (edema) score += 2;
  if (poorWeightGain) score += 1;
  if (cyanosis) score += 2;
  if (cardiomegaly) score += 2;
  if (gallop) score += 1;
  if (decreasedPulses) score += 1;
  if (congestionOnCXR) score += 2;
  let classification;
  if (score >= 8) classification = 'Ross-Score-Class-IV-severe-heart-failure';
  else if (score >= 5) classification = 'Ross-Score-Class-III-moderate';
  else if (score >= 2) classification = 'Ross-Score-Class-II-mild';
  else classification = 'Ross-Score-Class-I-no-heart-failure';
  let treatment;
  if (classification === 'Ross-Score-Class-IV-severe-heart-failure') treatment = 'ICU-inotropes-mechanical-support';
  else if (classification === 'Ross-Score-Class-III-moderate') treatment = 'hospitalize-ACE-inhibitor-diuretic';
  else if (classification === 'Ross-Score-Class-II-mild') treatment = 'outpatient-ACE-inhibitor';
  else treatment = 'monitor';
  return { rossScore: score, classification, treatment };
}

function PediatricDiabetesType1({ age, polyuria, polydipsia, weightLoss, dka, ketones, glucose, hba1c, antibodies, cPeptide, familyHistory }) {
  let diagnosis;
  if (age < 18 && polyuria && polydipsia && weightLoss && glucose >= 200) diagnosis = 'T1DM-definite';
  else if (age < 18 && glucose >= 200 && antibodies === 'positive') diagnosis = 'T1DM-definite';
  else if (age < 18 && polyuria && polydipsia) diagnosis = 'T1DM-probable';
  else if (age >= 18 && glucose >= 200) diagnosis = 'possible-T2DM-or-MODY';
  else diagnosis = 'no-DM';
  let treatment;
  if (dka) treatment = 'ICU-fluid-insulin-DKA-protocol';
  else if (diagnosis === 'T1DM-definite') treatment = 'basal-bolus-insulin-education-CGM';
  else if (diagnosis === 'T1DM-probable') treatment = 'confirmatory-tests-insulin-pending';
  else if (diagnosis === 'possible-T2DM-or-MODY') treatment = 'OGTT-consider-MODY-genetic';
  else treatment = 'monitor';
  return { diagnosis, treatment, hba1c, recommendation: 'pediatric-endocrinology-referral' };
}

function PediatricFebrileSeizure({ age, fever, seizureDuration, seizureType, focalFeatures, neurologicalExam, priorFebrileSeizures, familyHistory }) {
  let classification;
  if (age >= 6 && age < 60 && fever && seizureDuration < 15 && seizureType === 'generalized' && !focalFeatures) classification = 'simple-febrile-seizure';
  else if (fever && (seizureDuration >= 15 || focalFeatures || seizureType === 'focal')) classification = 'complex-febrile-seizure';
  else if (age < 1 && fever && seizureDuration >= 30) classification = 'febrile-status-epilepticus';
  else classification = 'non-febrile-seizure-evaluate';
  let treatment;
  if (classification === 'simple-febrile-seizure') treatment = 'reassurance-no-EEG-no-MRI-routine-followup';
  else if (classification === 'complex-febrile-seizure') treatment = 'EEG-MRI-pediatric-neurology-referral';
  else if (classification === 'febrile-status-epilepticus') treatment = 'admit-IV-benzo-MRI-EEG';
  else treatment = 'evaluate-non-febrile-seizure';
  return { classification, treatment };
}

function KawasakiDisease({ feverDays, conjunctivitis, mucosalChanges, extremityChanges, cervicalLymphadenopathy, coronaryChanges, bnp, albumin, alt, plt }) {
  let score = 0;
  if (feverDays >= 5) score += 1;
  if (conjunctivitis) score += 1;
  if (mucosalChanges) score += 1;
  if (extremityChanges) score += 1;
  if (cervicalLymphadenopathy) score += 1;
  if (coronaryChanges) score += 2;
  if (bnp >= 100) score += 1;
  if (albumin <= 3) score += 1;
  if (alt >= 100) score += 1;
  if (plt >= 450) score += 1;
  let diagnosis;
  if (score >= 5) diagnosis = 'Kawasaki-disease-classical';
  else if (score >= 3) diagnosis = 'Kawasaki-disease-incomplete';
  else diagnosis = 'not-Kawasaki-disease';
  let treatment;
  if (diagnosis === 'Kawasaki-disease-classical' || diagnosis === 'Kawasaki-disease-incomplete') {
    treatment = 'IVIG-2g-kg-aspirin-high-dose';
    if (coronaryChanges) treatment += '-echo-followup';
  } else treatment = 'monitor';
  return { kawasakiScore: score, diagnosis, treatment };
}

module.exports = {
  PediatricGCS, PediatricBacterialMeningitis, PediatricAsthmaSeverity, PediatricDehydration, PediatricAcuteNephriticSyndrome,
  PediatricUTI, PediatricCardiacFailure, PediatricDiabetesType1, PediatricFebrileSeizure, KawasakiDisease,
};
