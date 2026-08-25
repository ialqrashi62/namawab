/**
 * TIER3_GI-302 Liver Cirrhosis Engine
 * Child-Pugh + MELD-Na + ascites grading + hepatic encephalopathy + fibrosis staging (FibroScan)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AASLD_2023: 'AASLD Cirrhosis 2023', EASL_2024: 'EASL 2024' };

function childPugh(input) {
  const { bilirubin, albumin, inr, ascites, encephalopathy } = input;
  const points = {
    bilirubin: bilirubin < 2 ? 1 : bilirubin < 3 ? 2 : 3,
    albumin: albumin > 3.5 ? 1 : albumin > 2.8 ? 2 : 3,
    inr: inr < 1.7 ? 1 : inr < 2.3 ? 2 : 3,
    ascites: { none: 1, mild: 2, moderate: 3 }[ascites] || 1,
    encephalopathy: { none: 1, grade_1_2: 2, grade_3_4: 3 }[encephalopathy] || 1,
  };
  const total = Object.values(points).reduce((a, b) => a + b, 0);
  let class_ = 'A';
  if (total >= 10) class_ = 'C';
  else if (total >= 7) class_ = 'B';
  return { points, total, class_, mortality_1y: { A: 5, B: 20, C: 55 }[class_], citation: CITATIONS.AASLD_2023 };
}

function meldScore(input) {
  const { bilirubin, creatinine, inr, sodium } = input;
  const meld = (3.78 * Math.log(Math.max(1, bilirubin)) + 11.2 * Math.log(Math.max(1, inr)) + 9.57 * Math.log(Math.max(1, creatinine)) + 6.43) * 10;
  const meld_na = sodium ? meld + 1.59 * (137 - sodium) : meld;
  return {
    meld: Math.round(meld), meld_na: sodium ? Math.round(meld_na) : null,
    risk: meld_na >= 40 ? 'very_high_mortality' : meld_na >= 30 ? 'high' : meld_na >= 20 ? 'moderate' : 'low',
    transplant_priority: meld_na >= 15,
  };
}

function ascitesManagement(input) {
  const { grade, refractory, sodium_intake, diuretic } = input;
  let treatment = [];
  if (grade === 'grade_1' || grade === 'grade_2') treatment = ['sodium_restriction_2g/day', 'spironolactone_100mg+', 'furosemide_40mg+'];
  else if (grade === 'grade_3') treatment = ['large_volume_paracentesis + albumin', 'diuretic_optimization'];
  if (refractory) treatment = ['consider_TIPS', 'serial_LVP', 'albumin_replacement'];
  return { grade, refractory, sodium_limit_g_day: 2, treatment };
}

function hepaticEncephalopathy(input) {
  const { westhaven_grade, ammonia, precipitant } = input;
  return {
    grade: westhaven_grade,
    severity: westhaven_grade >= 3 ? 'severe' : westhaven_grade >= 2 ? 'moderate' : 'minimal_or_covert',
    treatment: ['lactulose_30ml_PO_TID', 'rifaximin_550mg_PO_BID', 'precipitant_removal', 'eval_for_TIPS_if_refractory'],
    precipitant: precipitant || ['infection', 'GI_bleeding', 'constipation', 'electrolyte_imbalance', 'sedatives'],
  };
}

function fibrosisStaging(input) {
  const { fibroscan_kpa, fib4, apri } = input;
  let stage = 'F0_F1';
  if (fibroscan_kpa >= 12 || apri >= 2) stage = 'F4_cirrhosis';
  else if (fibroscan_kpa >= 9 || apri >= 1.5) stage = 'F3_advanced_fibrosis';
  else if (fibroscan_kpa >= 7 || apri >= 0.5) stage = 'F2_significant_fibrosis';
  return {
    fibroscan_kpa, fib4: fib4 ? Math.round(fib4 * 100) / 100 : null, apri: apri ? Math.round(apri * 100) / 100 : null,
    stage, confidence: fibroscan_kpa && fib4 && apri ? 'high' : 'moderate',
  };
}

module.exports = { childPugh, meldScore, ascitesManagement, hepaticEncephalopathy, fibrosisStaging, CITATIONS, ValidationError };