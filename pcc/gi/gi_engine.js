/**
 * pcc/gi/gi_engine.js — PCC #17: Gastroenterology
 * 10 deterministic functions for GI emergencies & chronic management.
 *
 * Compliance: ACG · AGA · Baveno VII · Rome IV · ESGE.
 */
'use strict';

function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f) / f; }

/**
 * 1. ChildPughScore — cirrhosis severity.
 */
function ChildPughScore({ bilirubin, albumin, inr, ascites, encephalopathy }) {
  let score = 0;
  if (bilirubin < 2) score += 1;
  else if (bilirubin <= 3) score += 2;
  else score += 3;
  if (albumin > 3.5) score += 1;
  else if (albumin >= 2.8) score += 2;
  else score += 3;
  if (inr < 1.7) score += 1;
  else if (inr <= 2.3) score += 2;
  else score += 3;
  if (ascites === 'none') score += 1;
  else if (ascites === 'mild') score += 2;
  else score += 3;
  if (encephalopathy === 'none') score += 1;
  else if (encephalopathy === 'grade_1_2') score += 2;
  else score += 3;
  let classN;
  if (score >= 10) classN = 'C';
  else if (score >= 7) classN = 'B';
  else classN = 'A';
  return { score, class: classN, mortality1yr: classN === 'C' ? 55 : classN === 'B' ? 20 : 5 };
}

/**
 * 2. MELDNaScore — Model for End-Stage Liver Disease (sodium).
 */
function MELDNaScore({ bilirubin, inr, creatinine, sodium, onDialysis }) {
  if (onDialysis) creatinine = 4;
  if (creatinine < 1) creatinine = 1;
  if (creatinine > 4) creatinine = 4;
  if (sodium < 125) sodium = 125;
  if (sodium > 137) sodium = 137;
  const meld = Math.round(0.957 * Math.log(creatinine) + 0.378 * Math.log(bilirubin) + 1.12 * Math.log(inr) + 0.643) * 10;
  // Standard MELD-Na: 1.32 * (137-Na) - 0.033 * MELD * (137-Na)
  const delta = 137 - sodium;
  const meldNa = Math.max(meld, meld + 1.32 * delta - 0.033 * meld * delta * 0.01);
  return { meld, meldNa: round(meldNa, 1), transplantPriority: meldNa >= 15 };
}

/**
 * 3. BavenoVIIHepaticVenousPressure — portal hypertension screening.
 */
function BavenoVIIHepaticVenousPressure({ liverStiffness, platelets, age }) {
  const ruleOutCSPH = liverStiffness <= 20 && platelets >= 150;
  const ruleInCSPH = liverStiffness > 25;
  return {
    ruleOutCSPH,
    ruleInCSPH,
    indeterminate: !ruleOutCSPH && !ruleInCSPH,
    needEndoscopy: liverStiffness > 20 || platelets < 150 || age >= 60,
  };
}

/**
 * 4. UGIBEndoscopyTiming — timing of upper GI endoscopy.
 */
function UGIBEndoscopyTiming({ hemodynamicStable, hematemesis, melena, syncope, shock, anticoagulant, anticoagReversed }) {
  if (!hemodynamicStable) return { timing: 'emergent_within_12h', level: 'ICU' };
  if (syncope || shock) return { timing: 'emergent_within_12h', level: 'ICU' };
  if (hematemesis) return { timing: 'urgent_within_24h', level: 'ward' };
  if (melena) return { timing: 'urgent_within_24h', level: 'ward' };
  if (anticoagulant && !anticoagReversed) return { timing: 'urgent_within_24h', level: 'ward' };
  return { timing: 'elective_within_72h', level: 'outpatient' };
}

/**
 * 5. RomeIVIBSClassification — irritable bowel syndrome.
 */
function RomeIVIBSClassification({ abdominalPain, defecationRelation, stoolFrequencyChange, stoolFormChange, durationMonths, redFlags }) {
  const painRelated = abdominalPain && defecationRelation;
  if (redFlags) return { diagnosis: 'not_IBS_workup_organic', workup: 'colonoscopy_imaging_labs' };
  if (!painRelated) return { diagnosis: 'not_IBS' };
  if (durationMonths < 6) return { diagnosis: 'not_IBS_short_duration' };
  const subtype = stoolFormChange === 'loose' ? 'IBS_D' : stoolFormChange === 'hard' ? 'IBS_C' : 'IBS_M';
  return { diagnosis: subtype, treatment: subtype === 'IBS_D' ? 'loperamide_rifaximin' : subtype === 'IBS_C' ? 'osmotic_laxatives_linaclotide' : 'antispasmodics_lifestyle' };
}

/**
 * 6. HEPATITISBStage — chronic HBV disease phase.
 */
function HEPATITISBStage({ hbeAg, alt, hbvDna, liverBiopsy, fibrosisScore }) {
  if (alt > 2 * 40 && hbvDna > 20000) {
    return { phase: 'immune_active_HBeAg_positive', treatment: 'antiviral_entecavir_tenofovir' };
  }
  if (fibrosisScore >= 2) return { phase: 'immune_active', treatment: 'antiviral_initiation' };
  if (hbeAg) return { phase: 'immune_tolerant', treatment: 'monitor_3_6_months' };
  if (alt < 40 && hbvDna < 2000) return { phase: 'inactive_carrier', treatment: 'monitor_6_12_months' };
  return { phase: 'indeterminate', treatment: 'reassess_with_FibroScan' };
}

/**
 * 7. NAFLDFibrosisScore — non-invasive fibrosis prediction.
 */
function NAFLDFibrosisScore({ age, bmi, ifg, ast, alt, platelets, albumin }) {
  const nfs = round(-1.675 + 0.037 * age + 0.094 * bmi + 1.13 * ifg + 0.99 * (ast / alt) - 0.013 * platelets - 0.66 * albumin, 2);
  let fibrosis;
  if (nfs < -1.455) fibrosis = 'F0_F1_indolent';
  else if (nfs < 0.676) fibrosis = 'indeterminate_F2';
  else fibrosis = 'F3_F4_advanced';
  return { nfs, fibrosis, biopsyIndicated: fibrosis === 'indeterminate_F2' };
}

/**
 * 8. IBDActivityUC — ulcerative colitis Mayo score.
 */
function IBDActivityUC({ stoolFrequency, rectalBleeding, endoscopy, physicianGlobal }) {
  let score = 0;
  if (stoolFrequency === 'normal') score += 0;
  else if (stoolFrequency === '1_2') score += 1;
  else if (stoolFrequency === '3_4') score += 2;
  else score += 3;
  if (rectalBleeding === 'none') score += 0;
  else if (rectalBleeding === 'streaks') score += 1;
  else if (rectalBleeding === 'obvious') score += 2;
  else score += 3;
  score += endoscopy;
  score += physicianGlobal;
  let activity;
  if (score >= 10) activity = 'severe';
  else if (score >= 6) activity = 'moderate';
  else if (score >= 3) activity = 'mild';
  else activity = 'remission';
  return { score, activity, treatment: activity === 'severe' ? 'IV_steroids_infliximab' : activity === 'moderate' ? 'oral_steroids_biologic' : activity === 'mild' ? 'mesalamine_5asa' : 'maintenance_only' };
}

/**
 * 9. PancreatitisSeverityBalthazar — CT severity index.
 */
function PancreatitisSeverityBalthazar({ ctGrade, necrosisPct }) {
  let score = 0;
  if (ctGrade === 'A_normal') score = 0;
  else if (ctGrade === 'B_focal') score = 1;
  else if (ctGrade === 'C_diffuse') score = 2;
  else if (ctGrade === 'D_single_fluid') score = 3;
  else score = 4;
  if (necrosisPct === 0) score += 0;
  else if (necrosisPct < 30) score += 2;
  else if (necrosisPct < 50) score += 4;
  else score += 6;
  let severity = 'mild';
  if (score >= 7) severity = 'severe';
  else if (score >= 3) severity = 'moderate';
  return { score, severity, mortality: severity === 'severe' ? 17 : severity === 'moderate' ? 4 : 1 };
}

/**
 * 10. CeliacDiseaseSerology — tTG IgA interpretation.
 */
function CeliacDiseaseSerology({ tTGIgA, totalIgA, geneticTest, biopsyFindings }) {
  if (totalIgA < 0.07) return { result: 'IgA_deficient_test_IgG', recommendation: 'IgG_based_testing' };
  if (tTGIgA >= 10) {
    if (biopsyFindings === 'Marsh_3') return { result: 'celiac_confirmed', recommendation: 'gluten_free_diet' };
    if (biopsyFindings === 'Marsh_1_2') return { result: 'celiac_likely', recommendation: 'gluten_free_diet' };
    return { result: 'positive_serology_biopsy_pending', recommendation: 'EGD_biopsy' };
  }
  if (tTGIgA >= 4) return { result: 'borderline', recommendation: 'repeat_test_gluten_intake' };
  if (geneticTest === 'HLA_DQ2_DQ8_negative') return { result: 'celiac_excluded', recommendation: 'alternative_diagnosis' };
  return { result: 'negative_low_probability', recommendation: 'monitor_symptoms' };
}

module.exports = {
  ChildPughScore, MELDNaScore, BavenoVIIHepaticVenousPressure,
  UGIBEndoscopyTiming, RomeIVIBSClassification, HEPATITISBStage,
  NAFLDFibrosisScore, IBDActivityUC, PancreatitisSeverityBalthazar,
  CeliacDiseaseSerology,
};
