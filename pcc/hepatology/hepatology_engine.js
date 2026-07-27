'use strict';
// Hepatology Engine: 10 pure deterministic functions
// Compliance: AASLD, EASL, APASL, MELD-Na, Baveno VI, Maddrey

function MELDNa({ bilirubin, inr, creatinine, sodium, dialysisTwiceInWeek }) {
  const meld = (3.78 * Math.log(Math.max(bilirubin, 1)) + 11.2 * Math.log(Math.max(inr, 1)) + 9.57 * Math.log(Math.max(creatinine, 1)) + 6.43);
  const score = Math.round(meld);
  let meldNa = score;
  if (sodium < 125) meldNa = score + 2;
  else if (sodium < 135) meldNa = score + 1;
  if (dialysisTwiceInWeek) meldNa = Math.max(meldNa, score);
  let category;
  if (meldNa >= 30) category = 'high-3-month-mortality-urgent-transplant';
  else if (meldNa >= 20) category = 'elevated-mortality-list-for-transplant';
  else if (meldNa >= 15) category = 'monitor-closely';
  else if (meldNa >= 10) category = 'compensated';
  else category = 'low-mortality';
  return { meld: score, meldNa, category };
}

function ChildPugh({ bilirubin, albumin, inr, ascites, hepaticEncephalopathy }) {
  let score = 0;
  if (bilirubin < 2) score += 1;
  else if (bilirubin < 3) score += 2;
  else score += 3;
  if (albumin > 3.5) score += 1;
  else if (albumin > 2.8) score += 2;
  else score += 3;
  if (inr < 1.7) score += 1;
  else if (inr < 2.3) score += 2;
  else score += 3;
  if (ascites === 'none') score += 1;
  else if (ascites === 'mild') score += 2;
  else score += 3;
  if (hepaticEncephalopathy === 'none') score += 1;
  else if (hepaticEncephalopathy === 'grade-1-2') score += 2;
  else score += 3;
  let className;
  if (score <= 6) className = 'A-compensated';
  else if (score <= 9) className = 'B-significant';
  else className = 'C-decompensated';
  return { score, class: className, oneYearSurvival: className === 'A-compensated' ? '95pct' : className === 'B-significant' ? '80pct' : '45pct' };
}

function MaddreyDF({ bilirubin, inr, age, encephalopathy, infection }) {
  const df = 4.6 * inr + bilirubin;
  let category;
  if (df >= 32) category = 'severe-alcoholic-hepatitis';
  else category = 'mild-moderate';
  let treatment;
  if (category === 'severe-alcoholic-hepatitis' && infection) treatment = 'evaluate-infection-first-steroids-contraindicated';
  else if (category === 'severe-alcoholic-hepatitis') treatment = 'prednisolone-consider-NAC';
  else treatment = 'supportive-care-nutrition';
  if (age >= 70 && df >= 32) treatment = 'consider-palliative-steroids-risks';
  return { discriminant: Math.round(df * 10) / 10, category, treatment };
}

function LilleScore({ bilirubinDay0, bilirubinDay7, age, albumin, creatinine, encephalopathy, onSteroids }) {
  // Simplified Lille approximation (0-1 scale; lower = better)
  let lille = 0.5;
  if (bilirubinDay0 > 0) {
    const ratio = bilirubinDay7 / bilirubinDay0;
    // Big drop in bilirubin → low lille; small/no drop → high lille
    lille = Math.max(0, Math.min(1, ratio));
    if (albumin < 3) lille += 0.1;
    if (creatinine > 1.3) lille += 0.1;
    if (encephalopathy) lille += 0.1;
  }
  lille = Math.max(0, Math.min(1, lille));
  let response;
  if (lille < 0.45) response = 'responder-continue-steroids';
  else if (lille < 0.56) response = 'partial-consider-extension';
  else response = 'non-responder-stop-steroids';
  return { lilleScore: Math.round(lille * 100) / 100, response, onSteroids };
}

function BavenoVI({ plateletCount, liverStiffnessKpa, fibroscanResult, esophagogastricVaricesRisk }) {
  let category;
  if (plateletCount >= 150 && liverStiffnessKpa < 20) category = 'no-endoscopy-needed-spare';
  else if (plateletCount < 150 || liverStiffnessKpa >= 20) category = 'endoscopy-needed';
  else if (esophagogastricVaricesRisk === 'high') category = 'urgent-endoscopy';
  else category = 'screen-with-endoscopy';
  let treatment;
  if (category === 'no-endoscopy-needed-spare') treatment = 'no-screening-EGD';
  else if (category === 'urgent-endoscopy') treatment = 'urgent-EGD-and-band-ligation-if-varices';
  else treatment = 'EGD-screening';
  return { category, treatment, liverStiffnessKpa, plateletCount };
}

function AscitesAssessment({ ascitesPresent, ascitesSeverity, saag, asciticFluidProtein, asciticFluidAmylase, asciticFluidCellCount, cultureResult, pmnCount }) {
  let etiology;
  if (saag >= 1.1) etiology = 'portal-hypertension-related';
  else etiology = 'non-portal-hypertension';
  let classification;
  if (pmnCount >= 250) classification = 'spontaneous-bacterial-peritonitis';
  else if (pmnCount >= 100) classification = 'probable-SBP';
  else classification = 'no-SBP';
  let treatment;
  if (classification === 'spontaneous-bacterial-peritonitis') treatment = 'third-gen-cephalosporin-IV-albumin';
  else if (classification === 'probable-SBP') treatment = 'empirical-cephalosporin-repeat-paracentesis';
  else if (ascitesSeverity === 'large') treatment = 'large-volume-paracentesis-albumin';
  else if (ascitesSeverity === 'moderate') treatment = 'diuretics-sodium-restriction';
  else treatment = 'monitor';
  return { etiology, classification, treatment };
}

function HepaticEncephalopathy({ westHavenGrade, asterixis, ammonia, precipitants, priorEpisodes }) {
  let severity;
  if (westHavenGrade === 0) severity = 'covert-CHE';
  else if (westHavenGrade === 1 || westHavenGrade === 2) severity = 'overt-grade-1-2';
  else severity = 'overt-grade-3-4';
  let treatment;
  if (severity === 'covert-CHE') treatment = 'rifaximin-or-lactulose-elective';
  else if (precipitants && severity !== 'covert-CHE') treatment = 'treat-precipitant-lactulose-rifaximin';
  else if (severity === 'overt-grade-3-4') treatment = 'ICU-lactulose-IV-rifaximin-airway-protection';
  else treatment = 'lactulose-rifaximin';
  if (priorEpisodes >= 2) treatment += '-long-term-rifaximin';
  return { severity, treatment, westHavenGrade };
}

function LiverLesion({ lesionSizeCm, characteristic, multiphaseCT, mri, afp, cirrhosis, growthRate }) {
  let risk;
  if (characteristic === 'arterial-enhancement-washout') risk = 'definite-HCC';
  else if (characteristic === 'arterial-enhancement') risk = 'probable-HCC';
  else if (cirrhosis && lesionSizeCm >= 1) risk = 'surveillance-HCC';
  else risk = 'low-risk';
  let plan;
  if (risk === 'definite-HCC') plan = 'multidisciplinary-tumor-board-treatment';
  else if (risk === 'probable-HCC') plan = 'MRI-with-gadoxetate-biopsy-if-needed';
  else if (risk === 'surveillance-HCC') plan = '3-month-surveillance-imaging';
  else plan = 'routine-followup';
  if (afp > 400) plan = 'urgent-tumor-board-HCC-likely';
  return { risk, plan, afp, lesionSizeCm };
}

function HEPBManagement({ hbsag, hbeag, alt, hbvdna, liverBiopsy, fibrosisStage, treatmentNaive, pregnancy }) {
  let indication = false;
  let treatment = 'monitor';
  if (alt >= 2) indication = true;
  if (hbvdna >= 20000) indication = true;
  if (fibrosisStage === 'F2' || fibrosisStage === 'F3' || fibrosisStage === 'F4') indication = true;
  if (treatmentNaive && indication) treatment = 'entecavir-or-tenofovir';
  if (pregnancy && hbsag) treatment = 'tenofovir-prevent-transmission';
  return { indication, treatment, fibrosisStage, hbvdna };
}

function HEPCManagement({ antiHCV, hcvRna, genotype, fibrosisStage, priorTreatment, cirrhosis, hiv, hbvCoinfection }) {
  let active = false;
  if (antiHCV === 'positive' && hcvRna && hcvRna > 0) active = true;
  if (!active) return { active: false, treatment: 'no-treatment-needed', genotype };
  let regimen = 'glecaprevir-pibrentasvir-or-sofosbuvir-velpatasvir-12-weeks';
  if (cirrhosis) regimen = 'glecaprevir-pibrentasvir-or-sofosbuvir-velpatasvir-12-weeks-with-ribavirin-or-extended';
  if (genotype === '3' && cirrhosis) regimen = 'glecaprevir-pibrentasvir-or-sofosbuvir-velpatasvir-12-weeks-with-ribavirin-or-sofosbuvir-velpatasvir-24-weeks';
  if (priorTreatment) regimen = 'glecaprevir-pibrentasvir-or-sofosbuvir-velpatasvir-12-weeks';
  if (hiv) regimen += '-with-HIV-ARV-adjustment';
  if (hbvCoinfection) regimen += '-monitor-HBV-reactivation';
  return { active, treatment: regimen, genotype, fibrosisStage };
}

module.exports = {
  MELDNa, ChildPugh, MaddreyDF, LilleScore, BavenoVI,
  AscitesAssessment, HepaticEncephalopathy, LiverLesion, HEPBManagement, HEPCManagement,
};
