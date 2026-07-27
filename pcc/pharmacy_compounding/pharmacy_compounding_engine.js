// P3-AS: Pharmacy-Compounding Engine — 10 pure functions
const Engine = {};

Engine.SterileCompounding = function ({ beyondUseDate = 14, isoClass = 5, hazardous = false, batchSize = 1 } = {}) {
  let pathway;
  if (hazardous && isoClass > 5) pathway = 'Hazardous-require-C-PEC-and-ISO-5-or-better';
  else if (isoClass > 5) pathway = 'non-sterile-conditions-not-acceptable';
  else if (batchSize > 25 && hazardous === false) pathway = 'batch-compounding-beyond-use-14-days-if-non-hazardous';
  else if (hazardous && isoClass === 5) pathway = 'Hazardous-beyond-use-30-days-C-PEC-isolator';
  else if (batchSize > 25) pathway = 'batch-beyond-use-30-days-sterile';
  else if (batchSize <= 25) pathway = 'single-patient-beyond-use-14-days';
  else pathway = 'unspecified';
  return { pathway, recommendation: 'USP-797-and-800-compliance' };
};

Engine.NonSterileCompounding = function ({ beyondUseDate = 30, dosageForm = 'oral', waterActivity = 0.4, batchSize = 1 } = {}) {
  let pathway;
  if (waterActivity >= 0.6) pathway = 'aqueous-non-sterile-14-days-BUD';
  else if (waterActivity >= 0.4) pathway = 'non-aqueous-non-sterile-30-days-BUD';
  else if (waterActivity < 0.4) pathway = 'dry-non-sterile-90-days-BUD';
  else pathway = 'unspecified';
  if (dosageForm === 'topical') pathway += '-topical-formulation';
  if (batchSize > 50) pathway += '-and-batch-record';
  return { pathway, recommendation: 'USP-795-compliance-and-documentation' };
};

Engine.IVAdmixtureCompatibility = function ({ drug1 = 'morphine', drug2 = 'ondansetron', concentration1 = 1, concentration2 = 0.5 } = {}) {
  let compatibility;
  const compat = {
    'morphine-ondansetron': 'compatible',
    'morphine-furosemide': 'incompatible-precipitation',
    'morphine-midazolam': 'compatible',
    'ondansetron-dexamethasone': 'incompatible-precipitation',
    'morphine-phenytoin': 'incompatible-precipitation',
    'morphine-vancomycin': 'compatible-separate-line',
    'vancomycin-piperacillin': 'incompatible-precipitation',
    'insulin-dextrose': 'compatible',
    'morphine-ketorolac': 'compatible',
    'morphine-heparin': 'compatible-separate-line'
  };
  const key1 = `${drug1}-${drug2}`;
  const key2 = `${drug2}-${drug1}`;
  compatibility = compat[key1] || compat[key2] || 'unspecified-manual-review';
  return { compatibility, recommendation: compatibility.startsWith('incompatible') ? 'separate-lines-or-y-sites' : 'co-administer-OK' };
};

Engine.HazardousDrug = function ({ drug = 'cyclophosphamide', formulation = 'iv', dose = 1000, frequency = 'weekly' } = {}) {
  let handling;
  if (drug === 'cyclophosphamide' || drug === 'doxorubicin' || drug === 'cisplatin') {
    handling = 'NIOSH-Group-1-antineoplastic-C-PEC-required';
  } else if (drug === 'methotrexate') {
    handling = 'NIOSH-Group-1-antineoplastic-or-Group-3-reproductive';
  } else if (drug === 'warfarin') {
    handling = 'NIOSH-Group-3-teratogenic';
  } else if (drug === 'finasteride') {
    handling = 'NIOSH-Group-3-reproductive-hazard';
  } else {
    handling = 'standard-handling';
  }
  return { handling, recommendation: 'USP-800-and-PPE-per-protocol' };
};

Engine.IVStability = function ({ drug = 'amiodarone', temperature = 'room', diluent = 'D5W', hours = 24 } = {}) {
  let stability;
  if (drug === 'amiodarone' && diluent === 'D5W') stability = 'stable-24-hours-room-temp';
  else if (drug === 'diltiazem' && diluent === 'NS') stability = 'stable-24-hours-room-temp';
  else if (drug === 'morphine' && diluent === 'NS') stability = 'stable-48-hours-room-temp';
  else if (drug === 'epinephrine' && temperature === 'room') stability = 'stable-24-hours-protect-from-light';
  else if (drug === 'norepinephrine' && diluent === 'D5W') stability = 'stable-24-hours-room-temp';
  else if (diluent === 'lipid') stability = 'stable-12-hours';
  else stability = 'unspecified-manual-review';
  return { stability, recommendation: 'check-actual-BUD-on-label' };
};

Engine.CompoundingAccuracy = function ({ weightMeasured = 100, weightExpected = 100, formulation = 'capsule' } = {}) {
  let accuracy;
  const percentDiff = Math.abs(weightMeasured - weightExpected) / weightExpected * 100;
  if (percentDiff <= 5) accuracy = 'within-acceptable-range-5-percent';
  else if (percentDiff <= 10) accuracy = 'borderline-acceptable-5-10-percent';
  else if (percentDiff <= 20) accuracy = 'borderline-unacceptable-10-20-percent';
  else accuracy = 'unacceptable-20-percent-or-more';
  return { accuracy, recommendation: accuracy.includes('unacceptable') ? 'redo-or-discard' : 'document-and-dispense' };
};

Engine.BatchDocumentation = function ({ batchSize = 1, ingredients = ['drug-A', 'drug-B'], masterFormula = 'on-file', checks = 3 } = {}) {
  let completeness;
  if (masterFormula === 'on-file' && checks >= 3 && ingredients.length >= 1) completeness = 'complete-batch-record';
  else if (masterFormula === 'on-file' && checks >= 2) completeness = 'mostly-complete-minor-gaps';
  else if (masterFormula === 'on-file') completeness = 'partial-record';
  else completeness = 'incomplete-record-do-not-dispense';
  return { completeness, recommendation: completeness.includes('complete') ? 'sign-and-release' : 'complete-record' };
};

Engine.Repackaging = function ({ originalContainer = 'manufacturer', unitOfUse = false, beyondUseDate = 0, lightSensitive = false } = {}) {
  let pathway;
  if (originalContainer === 'manufacturer' && !unitOfUse) pathway = 'repackage-into-unit-dose-6-month-BUD';
  else if (unitOfUse) pathway = 'unit-of-use-no-repackaging-needed';
  else if (originalContainer === 'bulk') pathway = 'bulk-repackage-6-month-BUD-or-12-month-stability';
  else if (lightSensitive && beyondUseDate > 30) pathway = 'light-sensitive-shorten-BUD';
  else pathway = 'unspecified';
  return { pathway, recommendation: 'USP-1178-and-pharmacy-policy' };
};

Engine.QualityControl = function ({ endotoxin = 0.25, sterility = 'pass', potency = 100, ph = 7.0 } = {}) {
  let status;
  if (endotoxin > 0.5 || sterility === 'fail') status = 'failed-QC-do-not-dispense';
  else if (endotoxin > 0.25 || potency < 90 || potency > 110) status = 'borderline-QC-retest';
  else if (sterility === 'pass' && endotoxin <= 0.25) status = 'passed-QC-release';
  else status = 'unspecified';
  return { status, recommendation: status.includes('failed') ? 'discard-and-investigate' : status.includes('borderline') ? 'retest' : 'release' };
};

Engine.PediatricCompounding = function ({ age = 5, weight = 20, availableStrength = 100, desiredDose = 50 } = {}) {
  let decision;
  const doseInMl = desiredDose / availableStrength * 1;
  if (age < 1) decision = 'neonatal-compounding-pharmacy-and-pediatric';
  else if (weight < 10) decision = 'small-pediatric-compounding-low-volume-syringe';
  else if (availableStrength < 10) decision = 'low-strength-available-no-compounding';
  else if (age >= 12) decision = 'adult-dosing-acceptable';
  else decision = 'pediatric-compounding-needed';
  return { decision, recommendation: 'pediatric-pharmacy-and-document' };
};

module.exports = Engine;
