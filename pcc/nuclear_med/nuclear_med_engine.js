'use strict';

// Nuclear-Medicine PCC — 10 pure deterministic functions
// Compliance: ICRP, IAEA, SNMMI, EANM, ICRU, NCRP, ARSAC, NMTCB, NRC

const Engine = module.exports = {};

// 1) Radiation dose limits (ICRP)
Engine.RadiationDoseLimit = function (input = {}) {
  const { effectiveDoseMsv = 5, organDoseMsv = 100, pregnancy = false, occupational = false, age = 30 } = input;
  const annualLimit = occupational ? 20 : 1;
  const organLimit = organDoseMsv;
  let riskCategory;
  if (effectiveDoseMsv > 20 || organDoseMsv > 500) riskCategory = 'very-high-dose-exceeds-limits';
  else if (effectiveDoseMsv > annualLimit || organDoseMsv > 100) riskCategory = 'high-dose-monitoring-needed';
  else if (effectiveDoseMsv > annualLimit * 0.5) riskCategory = 'moderate-dose-tracking';
  else riskCategory = 'low-dose-within-limits';
  if (pregnancy && effectiveDoseMsv > 1) riskCategory = 'fetal-dose-exceeded-investigation';
  return { effectiveDoseMsv, riskCategory, recommendation: riskCategory.includes('exceeds') ? 'urgent-dosimetry-review' : (riskCategory === 'high-dose-monitoring-needed' ? 'dosimetry-followup-3mo' : 'standard-radiation-safety') };
};

// 2) Hyperthyroidism severity for RAI
Engine.ThyrotoxicosisRadioiodine = function (input = {}) {
  const { ft4 = 30, age = 40, atrialFibrillation = false, heartFailure = false, thyroidStorm = false, recentTrauma = false } = input;
  let severity;
  if (thyroidStorm) severity = 'thyroid-storm-ICU-immediate';
  else if (ft4 > 60 && (heartFailure || atrialFibrillation)) severity = 'very-severe-thyrotoxicosis';
  else if (ft4 > 40 && (heartFailure || atrialFibrillation)) severity = 'severe-thyrotoxicosis';
  else if (ft4 > 25) severity = 'moderate-thyrotoxicosis';
  else severity = 'mild-thyrotoxicosis';
  if (age >= 65 && atrialFibrillation) severity = 'severe-elderly-high-risk';
  return { severity, recommendation: severity === 'thyroid-storm-ICU-immediate' ? 'ICU-propranolol-ptu-iodine-betablocker' : (severity === 'very-severe-thyrotoxicosis' ? 'high-dose-RAI-prep' : 'beta-blocker-antithyroid-prep-RAI') };
};

// 3) Radioiodine ablation dose
Engine.RadioiodineAblationDose = function (input = {}) {
  const { diagnosis = 'Graves', firstTime = true, goiterSize = 30, previousRAI = 0, gravesOphthalmopathy = false } = input;
  let regimen;
  if (diagnosis === 'toxic-adenoma') regimen = 'low-dose-RAI-10-15mCi';
  else if (diagnosis === 'multinodular' && goiterSize > 50) regimen = 'high-dose-RAI-30-50mCi';
  else if (diagnosis === 'Graves' && goiterSize > 50) regimen = 'high-dose-RAI-15-30mCi';
  else if (diagnosis === 'Graves' && goiterSize <= 50) regimen = 'standard-dose-RAI-10-15mCi';
  else if (diagnosis === 'thyroid-cancer-ablative') regimen = 'low-iodine-diet-30mCi-RAI';
  else if (diagnosis === 'thyroid-cancer-high-risk') regimen = 'high-dose-RAI-100-200mCi';
  else regimen = 'standard-dose-RAI-15-30mCi';
  if (previousRAI >= 2) regimen += '-second-attempt';
  if (gravesOphthalmopathy && diagnosis === 'Graves') regimen += '-steroid-cover';
  return { regimen, recommendation: regimen };
};

// 4) Renogram — renal function
Engine.RenogramDTPA = function (input = {}) {
  const { leftKidney = 50, rightKidney = 50, totalGFR = 60, obstruction = 'absent' } = input;
  let kidneyFunction;
  const total = leftKidney + rightKidney;
  if (total < 20) kidneyFunction = 'very-low-function-bilateral';
  else if (total < 35) kidneyFunction = 'low-function-bilateral';
  else if (Math.abs(leftKidney - rightKidney) >= 20) kidneyFunction = 'differential-function-loss';
  else if (totalGFR < 30) kidneyFunction = 'CKD-stage-4-5';
  else if (totalGFR < 60) kidneyFunction = 'CKD-stage-3';
  else kidneyFunction = 'normal-function';
  return { leftKidney, rightKidney, total, function: kidneyFunction, recommendation: obstruction === 'present' ? 'MAG3-with-furosemide-lasix-renogram' : (kidneyFunction.includes('low') ? 'nephrology-referral' : 'monitor') };
};

// 5) MIBG scan interpretation
Engine.MIBGScintigraphy = function (input = {}) {
  const { indication = 'paraganglioma', avidityPattern = 'focal', metastaticPattern = 'localized', uptakeIntensity = 'moderate' } = input;
  let interpretation;
  if (indication === 'pheochromocytoma' && avidityPattern === 'focal') interpretation = 'pheochromocytoma-confirmed-avid';
  else if (indication === 'pheochromocytoma' && avidityPattern === 'extensive') interpretation = 'pheochromocytoma-OVERT-avid';
  else if (indication === 'pheochromocytoma' && avidityPattern === 'absent') interpretation = 'non-MIBG-avid-physiologic-findings';
  else if (indication === 'neuroblastoma') interpretation = 'neuroblastoma-' + avidityPattern;
  else if (indication === 'paraganglioma') interpretation = 'paraganglioma-' + avidityPattern;
  else interpretation = 'unclassified';
  return { interpretation, recommendation: interpretation.includes('non-MIBG') || interpretation.includes('absent') ? 'consider-MIBG-after-blocking' : 'refer-tumor-board' };
};

// 6) V/Q lung scan
Engine.LungPerfusionV_QScan = function (input = {}) {
  const { perfusionDefectPercent = 0, ventilationMatch = 'matched', wedgePressure = 12, clinicalPretest = 'low' } = input;
  let probability;
  if (perfusionDefectPercent >= 50 && ventilationMatch === 'mismatched') probability = 'high-probability-PE';
  else if (perfusionDefectPercent >= 25 && ventilationMatch === 'mismatched') probability = 'intermediate-probability-PE';
  else if (perfusionDefectPercent < 25 && ventilationMatch === 'matched') probability = 'low-probability-PE';
  else if (perfusionDefectPercent >= 30) probability = 'intermediate-probability-PE';
  else probability = 'very-low-probability-PE';
  return { probability, recommendation: probability.startsWith('high') ? 'anticoagulate-3mo' : (probability === 'low-probability-PE' ? 'D-dimer-clinical-judgment' : 'CT-pulmonary-angiogram') };
};

// 7) Bone scan interpretation
Engine.BoneScanMetastatic = function (input = {}) {
  const { lesionCount = 0, superscanPresent = false, knownPrimary = 'breast', site = 'mixed' } = input;
  let stage;
  if (superscanPresent) stage = 'superscan-extensive-metastases-poor-prognosis';
  else if (lesionCount >= 5) stage = 'extensive-metastatic-disease';
  else if (lesionCount >= 2) stage = 'oligo-metastatic';
  else if (lesionCount === 1) stage = 'solitary-lesion-further-workup';
  else stage = 'no-metastatic-disease';
  return { stage, recommendation: stage.includes('extensive') ? 'palliative-bone-targeted-therapy-systemic' : (stage === 'solitary-lesion-further-workup' ? 'MRI-PET-biopsy' : 'monitoring-MDT') };
};

// 8) PET-CT SUVmax
Engine.PETCTSUVMax = function (input = {}) {
  const { suvMax = 3, lesionSite = 'lung', knownMalignancy = false, hba1c = 6, fastingHours = 6 } = input;
  let malignancyRisk;
  if (suvMax >= 10) malignancyRisk = 'high-suspicious-for-malignancy';
  else if (suvMax >= 4) malignancyRisk = 'moderate-suspicious-for-malignancy';
  else if (suvMax >= 2.5) malignancyRisk = 'indeterminate';
  else malignancyRisk = 'low-likely-benign';
  if (hba1c >= 8 || fastingHours < 4) malignancyRisk = 'technical-issues-re-test-needed';
  return { suvMax, malignancyRisk, recommendation: malignancyRisk === 'high-suspicious-for-malignancy' ? 'biopsy-oncology-referral' : (malignancyRisk === 'moderate-suspicious-for-malignancy' ? 'biopsy-or-short-interval-followup' : 'standard-followup') };
};

// 9) HIDA scan
Engine.HIDACholescintigraphy = function (input = {}) {
  const { gbFilling = 'present', bileDuctVisualization = 'present', ejectionFraction = 50, morphineAugmented = false } = input;
  let diagnosis;
  if (gbFilling === 'absent' && bileDuctVisualization === 'present') diagnosis = 'acute-cystic-duct-obstruction';
  else if (gbFilling === 'absent' && bileDuctVisualization === 'absent') diagnosis = 'common-bile-duct-obstruction';
  else if (gbFilling === 'present' && ejectionFraction < 35) diagnosis = 'chronic-acalculous-cholecystitis';
  else if (gbFilling === 'present' && ejectionFraction < 50) diagnosis = 'biliary-dyskinesia';
  else diagnosis = 'normal-HIDA';
  return { diagnosis, recommendation: diagnosis === 'normal-HIDA' ? 'no-action' : (diagnosis.includes('cystic-duct') ? 'laparoscopic-cholecystectomy' : 'MRCP-ERCP') };
};

// 10) Radiopharmaceutical contamination
Engine.RadiopharmaceuticalContamination = function (input = {}) {
  const { skinCount = 100, bodyBackground = 100, cleanCount = 50, isotope = 'Tc-99m' } = input;
  const ratio = skinCount / bodyBackground;
  let contaminationLevel;
  if (ratio >= 5) contaminationLevel = 'severe-contamination-evacuate-area';
  else if (ratio >= 3) contaminationLevel = 'moderate-contamination-decon';
  else if (ratio >= 1.5) contaminationLevel = 'mild-contamination';
  else contaminationLevel = 'no-contamination';
  return { ratio: Math.round(ratio * 10) / 10, contaminationLevel, recommendation: contaminationLevel.includes('severe') ? 'decontamination-team-area-shut' : (contaminationLevel === 'moderate-contamination-decon' ? 'immediate-skin-decon-rSO-log' : 'standard-monitoring') };
};
