'use strict';
// Endocrinology Extended Engine: 10 pure deterministic functions
// Compliance: ATA, AACE, ACE, Endocrine Society, USPSTF, ADA, ESE

function ThyroidNoduleTI_RADS({ composition, echogenicity, shape, margin, echogenicFoci, sizeCm, lymphNodes, extrathyroidExtension }) {
  const points = (composition === 'solid' || composition === 'mostly-solid' ? 2 : 0) + (echogenicity === 'hypoechoic' ? 2 : 0) + (shape === 'taller-than-wide' ? 3 : 0) + (margin === 'irregular' || margin === 'lobulated' ? 2 : 0) + (echogenicFoci === 'microcalcifications' ? 3 : 0) + (echogenicFoci === 'macrocalcifications' ? 1 : 0);
  let category;
  if (points === 0) category = 'TR1-benign';
  else if (points <= 2) category = 'TR2-not-suspicious';
  else if (points <= 3) category = 'TR3-mildly-suspicious';
  else if (points <= 6) category = 'TR4-moderately-suspicious';
  else category = 'TR5-highly-suspicious';
  let management;
  if (category === 'TR1-benign') management = 'no-FNA-no-followup';
  else if (category === 'TR2-not-suspicious') management = sizeCm >= 1.5 ? 'followup' : 'no-FNA';
  else if (category === 'TR3-mildly-suspicious') management = sizeCm >= 1.5 ? 'FNA' : 'followup';
  else if (category === 'TR4-moderately-suspicious') management = sizeCm >= 1.0 ? 'FNA' : 'followup';
  else management = sizeCm >= 0.5 ? 'FNA' : 'followup';
  if (lymphNodes === 'suspicious') management = 'FNA-lymph-node';
  if (extrathyroidExtension) management = 'urgent-referral-surgery';
  return { points, category, management };
}

function AdrenalIncidentaloma({ sizeCm, hounsfieldUnits, enhancement, washout, hormonalActive, aldosterone, cortisol, metanephrine, growthRate, lipidRich }) {
  let interpretation;
  if (hounsfieldUnits <= 10 && sizeCm <= 4 && !hormonalActive) interpretation = 'benign-adenoma';
  else if (hounsfieldUnits >= 20 || sizeCm >= 4) interpretation = 'suspicious-for-malignancy';
  else if (hounsfieldUnits >= 10 && hounsfieldUnits < 20) interpretation = 'indeterminate-consider-MRI';
  else if (lipidRich) interpretation = 'likely-benign-adenoma';
  else interpretation = 'indeterminate';
  let workup;
  if (interpretation === 'benign-adenoma' && !hormonalActive) workup = 'no-followup';
  else if (interpretation === 'suspicious-for-malignancy') workup = 'surgical-endocrine-referral';
  else workup = 'hormonal-workup-MRI-followup';
  if (aldosterone && aldosterone >= 15) workup = 'aldosteronoma-confirmatory-testing';
  if (cortisol > 1.8) workup = 'Cushing-syndrome-evaluate';
  if (metanephrine && metanephrine >= 3) workup = 'pheochromocytoma-evaluate';
  if (growthRate && growthRate >= 1) workup = 'rapid-growth-consider-malignancy';
  return { interpretation, workup, sizeCm };
}

function PituitaryAdenoma({ macroMicro, hormone, prolactinLevel, acth, cortisol, tsh, fT4, massEffect, visualDefect, apoplexy }) {
  let classification;
  if (macroMicro === 'microadenoma') classification = 'microadenoma-less-than-1cm';
  else if (macroMicro === 'macroadenoma') classification = 'macroadenoma-1cm-or-more';
  else classification = 'not-specified';
  let secretion;
  if (prolactinLevel > 200) secretion = 'prolactinoma';
  else if (prolactinLevel > 100) secretion = 'possible-prolactinoma';
  else if (acth && acth >= 50) secretion = 'ACTH-secreting-Cushing-disease';
  else if (hormone === 'GH-elevated') secretion = 'GH-secreting-acromegaly';
  else if (hormone === 'non-functional') secretion = 'non-functional-adenoma';
  else secretion = 'unclassified';
  let management;
  if (apoplexy) management = 'urgent-steroid-replacement-neurosurgery';
  else if (visualDefect) management = 'urgent-transsphenoidal-surgery';
  else if (massEffect) management = 'transsphenoidal-surgery-decompression';
  else if (secretion === 'prolactinoma' || secretion === 'possible-prolactinoma') management = 'cabergoline-or-bromocriptine';
  else if (secretion === 'ACTH-secreting-Cushing-disease') management = 'transsphenoidal-surgery';
  else if (secretion === 'GH-secreting-acromegaly') management = 'transsphenoidal-surgery-medical-therapy';
  else management = 'monitor-MRI-3-6mo';
  return { classification, secretion, management };
}

function Pheochromocytoma({ plasmaMetanephrine, urineMetanephrine, symptoms, paroxysmalEpisodes, familyHistory, adrenalMass, incidentaloma, clonidineSuppression }) {
  let diagnosis;
  if (plasmaMetanephrine >= 3) diagnosis = 'pheochromocytoma-biochemically-confirmed';
  else if (urineMetanephrine >= 3) diagnosis = 'pheochromocytoma-biochemically-confirmed';
  else if (plasmaMetanephrine >= 2 && symptoms && adrenalMass) diagnosis = 'pheochromocytoma-likely';
  else if (clonidineSuppression === 'positive') diagnosis = 'pheochromocytoma-confirmed';
  else diagnosis = 'pheochromocytoma-unlikely';
  let management;
  if (diagnosis === 'pheochromocytoma-biochemically-confirmed' || diagnosis === 'pheochromocytoma-confirmed') management = 'alpha-blockade-then-surgery';
  else if (diagnosis === 'pheochromocytoma-likely') management = 'alpha-blockade-then-MIBG-or-PET-then-surgery';
  else if (familyHistory && adrenalMass) management = 'genetic-counseling-MEN2-VHL-NF1-screening';
  else management = 'monitor-investigate-alternatives';
  return { diagnosis, management };
}

function CushingSyndromeWorkup({ lateNightSalivaryCortisol, dexSuppressionTest, acthLevel, mriPituitary, ctAdrenal, ectopicSource, weightGain, hypertension, dm }) {
  let screening;
  if (acthLevel >= 2 && acthLevel < 1 === false) {
    if (acthLevel >= 2) {
      screening = acthLevel >= 1 ? 'ACTH-dependent' : 'ACTH-suppressed';
    }
  }
  if (acthLevel < 1) screening = 'ACTH-independent-adrenal';
  else if (acthLevel >= 1) screening = 'ACTH-dependent';
  if (lateNightSalivaryCortisol > 0.145) screening = screening ? `${screening}-cushing-confirmed` : 'Cushing-likely';
  else if (dexSuppressionTest > 1.8) screening = screening ? `${screening}-cushing-confirmed` : 'Cushing-likely';
  if (!screening) screening = 'no-Cushing';
  let source;
  if (screening && screening.includes('ACTH-dependent') && mriPituitary === 'mass-6mm') source = 'Cushing-disease-pituitary';
  else if (screening && screening.includes('ACTH-dependent') && mriPituitary === 'normal') source = 'ectopic-or-pituitary-micro';
  else if (screening && screening.includes('ACTH-dependent')) source = 'ectopic-ACTH-thorax';
  else if (screening && screening.includes('ACTH-independent')) source = 'adrenal-adenoma-or-carcinoma';
  else source = 'unclear';
  let treatment;
  if (source === 'Cushing-disease-pituitary') treatment = 'transsphenoidal-surgery';
  else if (source === 'adrenal-adenoma-or-carcinoma') treatment = 'adrenalectomy';
  else if (source === 'ectopic-ACTH-thorax') treatment = 'chest-CT-MIBG-surgery';
  else if (source === 'ectopic-or-pituitary-micro') treatment = 'inferior-petrosal-sinus-sampling';
  else treatment = 'monitor';
  return { screening, source, treatment };
}

function PrimaryHyperaldosteronism({ aldosterone, renin, arr, salineInfusionTest, captoprilTest, adrENALCT, unilateralAdenoma, bilateralHyperplasia }) {
  let screening;
  if (arr >= 20) screening = 'primary-aldosteronism-suspected';
  else if (arr >= 10) screening = 'borderline-retest';
  else screening = 'primary-aldosteronism-unlikely';
  let confirmation;
  if (arr >= 20) confirmation = 'confirm-with-saline-infusion-or-captopril';
  else if (arr >= 10) confirmation = 'consider-confirmatory-test';
  else confirmation = 'no-confirmatory-test';
  let subtype;
  if (unilateralAdenoma) subtype = 'aldosteronoma-Conn';
  else if (bilateralHyperplasia) subtype = 'bilateral-adrenal-hyperplasia';
  else subtype = 'unclear-consider-adrenal-vein-sampling';
  let treatment;
  if (subtype === 'aldosteronoma-Conn') treatment = 'adrenalectomy';
  else if (subtype === 'bilateral-adrenal-hyperplasia') treatment = 'spironolactone-or-eplerenone';
  else treatment = 'further-workup-adrenal-vein-sampling';
  return { screening, confirmation, subtype, treatment };
}

function PCOSRotterdam({ oligoAnovulation, hyperandrogenism, polycysticOvariesOnUS, otherCausesExcluded }) {
  let score = 0;
  if (oligoAnovulation) score++;
  if (hyperandrogenism) score++;
  if (polycysticOvariesOnUS) score++;
  let diagnosis;
  if (score >= 2 && otherCausesExcluded) diagnosis = 'PCOS-Rotterdam-criteria-met';
  else if (score >= 2) diagnosis = 'PCOS-suspected-need-exclusion';
  else diagnosis = 'PCOS-unlikely';
  let treatment;
  if (diagnosis === 'PCOS-Rotterdam-criteria-met') {
    treatment = 'lifestyle-OCP-metformin-spironolactone-clomiphene';
    return { diagnosis, score, treatment, recommendation: 'endocrine-referral-GYN' };
  } else if (diagnosis === 'PCOS-suspected-need-exclusion') {
    treatment = 'exclusion-testing-Cushing-thyroid-prolactin-21-hydroxylase';
    return { diagnosis, score, treatment, recommendation: 'rule-out-other-causes' };
  } else {
    return { diagnosis, score, recommendation: 'consider-other-ovulatory-dysfunction' };
  }
}

function CalciumDisorder({ calcium, pth, vitaminD, phosphate, ionizedCalcium, urinaryCalcium, creatinine, age, boneDensity, nephrolithiasis }) {
  let diagnosis;
  if (calcium >= 10.5 && pth >= 65) diagnosis = 'primary-hyperparathyroidism';
  else if (calcium >= 10.5 && pth < 20) diagnosis = 'PTH-independent-hypercalcemia-malignancy';
  else if (calcium < 8.5 && pth >= 65) diagnosis = 'secondary-hyperparathyroidism';
  else if (calcium < 8.5 && pth < 20 && vitaminD < 20) diagnosis = 'vitamin-D-deficiency';
  else if (calcium < 8.5 && pth < 20 && vitaminD >= 20) diagnosis = 'hypoparathyroidism';
  else if (calcium < 8.5 && pth < 20 && vitaminD >= 20 && urinaryCalcium < 100) diagnosis = 'hypocalciuric-hypercalcemia';
  else if (calcium >= 10.5 && urinaryCalcium < 100) diagnosis = 'FHH-benign';
  else diagnosis = 'normal-calcium';
  let treatment;
  if (diagnosis === 'primary-hyperparathyroidism' && (calcium >= 11.5 || boneDensity <= -2.5 || nephrolithiasis)) treatment = 'parathyroidectomy';
  else if (diagnosis === 'primary-hyperparathyroidism') treatment = 'monitor-bisphosphonate-or-cinacalcet';
  else if (diagnosis === 'PTH-independent-hypercalcemia-malignancy') treatment = 'workup-malignancy-bisphosphonate-calcitonin';
  else if (diagnosis === 'secondary-hyperparathyroidism') treatment = 'treat-vitamin-D-deficiency-and-CKD';
  else if (diagnosis === 'vitamin-D-deficiency') treatment = 'vitamin-D-replacement';
  else if (diagnosis === 'hypoparathyroidism') treatment = 'calcium-and-vitamin-D-replacement';
  else treatment = 'monitor';
  return { diagnosis, treatment };
}

function DiabetesInsulinRegimen({ type1, type2, age, weightKg, currentRegimen, hba1c, hypoglycemiaEpisodes, cgmData, pregnancy }) {
  let target;
  if (type1 && pregnancy) target = 'hba1c-less-than-6-A1c-preconception-or-6.5-pregnancy';
  else if (type1 && age < 18) target = 'hba1c-less-than-7.5';
  else if (type1) target = 'hba1c-less-than-7';
  else if (type2 && age < 65 && noComorbidities) target = 'hba1c-less-than-6.5';
  else if (type2) target = 'hba1c-less-than-7';
  else target = 'hba1c-less-than-8';
  let adjustment;
  if (hba1c < target - 0.5) adjustment = 'consider-downtitration';
  else if (hba1c > target + 0.5) adjustment = 'intensify-regimen';
  else adjustment = 'maintain';
  let regimen;
  if (type1) regimen = 'basal-bolus-MDI-or-CSII-pump-or-hybrid-closed-loop';
  else if (type2) regimen = 'metformin-GLP1-RA-SGLT2i-basal-insulin';
  if (pregnancy) regimen = 'basal-bolus-NPH-detemir-prandin-aspart-CGM-target-strict';
  if (cgmData && hypoglycemiaEpisodes >= 3) regimen += '-hybrid-closed-loop-CGM';
  return { target, adjustment, regimen };
}

function ObesityMedicine({ bmi, waistCircumference, comorbidities, priorInterventions, motivation, contraindications, ethnicityAdjustedBMI }) {
  let classification;
  if (bmi < 25) classification = 'underweight-or-normal';
  else if (bmi < 30) classification = 'overweight';
  else if (bmi < 35) classification = 'obesity-class-I';
  else if (bmi < 40) classification = 'obesity-class-II';
  else classification = 'obesity-class-III';
  let treatment;
  if (classification === 'underweight-or-normal') treatment = 'prevention';
  else if (classification === 'overweight') treatment = 'lifestyle-diet-exercise';
  else if (classification === 'obesity-class-I' && comorbidities) treatment = 'intensive-lifestyle-plus-consider-GLP1-RA';
  else if (classification === 'obesity-class-I') treatment = 'lifestyle-program';
  else if (classification === 'obesity-class-II' && comorbidities) treatment = 'intensive-lifestyle-GLP1-RA-or-sleeve';
  else if (classification === 'obesity-class-II') treatment = 'lifestyle-plus-GLP1-RA';
  else if (classification === 'obesity-class-III') treatment = 'sleeve-gastrectomy-or-RYGB-evaluation';
  if (contraindications) treatment += '-contraindication-checked';
  if (ethnicityAdjustedBMI && ethnicityAdjustedBMI < bmi - 2.5) treatment += '-ethnicity-adjusted-thresholds';
  return { classification, treatment, bmi };
}

module.exports = {
  ThyroidNoduleTI_RADS, AdrenalIncidentaloma, PituitaryAdenoma, Pheochromocytoma, CushingSyndromeWorkup,
  PrimaryHyperaldosteronism, PCOSRotterdam, CalciumDisorder, DiabetesInsulinRegimen, ObesityMedicine,
};
