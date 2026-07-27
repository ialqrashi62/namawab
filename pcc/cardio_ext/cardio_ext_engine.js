'use strict';
// Cardiology Extended Engine: 10 pure deterministic functions
// Compliance: ACC/AHA, ESC, HFSA, ISHLT, NLA, SCD-Heart-Failure

function HFrEFvsHFpEF({ lvef, ntProBNP, lavi, lvmIndex, diastolicFunction, age, htnDuration, diabetes, obesity }) {
  let classification;
  if (lvef <= 40) classification = 'HFrEF-LVEF-less-than-40';
  else if (lvef < 50) classification = 'HFmrEF-LVEF-41-49';
  else {
    if (ntProBNP >= 600 && lavi >= 34 && (diastolicFunction === 'grade-2-or-3' || lvmIndex >= 96)) classification = 'HFpEF';
    else classification = 'HFpEF-uncertain';
  }
  let treatment;
  if (classification === 'HFrEF-LVEF-less-than-40') treatment = 'ARNI-ACEi-ARB-MRA-beta-blocker-SGLT2i';
  else if (classification === 'HFmrEF-LVEF-41-49') treatment = 'ARNI-or-ACEi-beta-blocker-SGLT2i';
  else treatment = 'SGLT2i-treat-comorbidities-diuretics';
  return { lvef, classification, treatment };
}

function HeartFailureStage({ lvef, symptoms, hospitalizationPastYear, biomarkers, cardiacStructure, compliance, onOptimalTherapy }) {
  let stage;
  if (!symptoms && lvef >= 50) stage = 'Stage-A-at-risk';
  else if (!symptoms && lvef < 50) stage = 'Stage-B-pre-HF';
  else if (symptoms && hospitalizationPastYear >= 2) stage = 'Stage-D-advanced';
  else if (symptoms && hospitalizationPastYear >= 1) stage = 'Stage-C-hospitalization';
  else if (symptoms && onOptimalTherapy) stage = 'Stage-C-stable';
  else if (symptoms) stage = 'Stage-C';
  else stage = 'Stage-B-pre-HF';
  let treatment;
  if (stage === 'Stage-A-at-risk') treatment = 'risk-factor-control';
  else if (stage === 'Stage-B-pre-HF') treatment = 'GDMT-initiation';
  else if (stage === 'Stage-C-stable') treatment = 'continue-GDMT';
  else if (stage === 'Stage-C-hospitalization') treatment = 'intensify-GDMT-IV-diuretic';
  else if (stage === 'Stage-D-advanced') treatment = 'advanced-therapies-LVAD-transplant-evaluation';
  return { stage, treatment };
}

function LVADIndication({ lvef, inotropicDependence, candidateForTransplant, destinationTherapy, age, comorbidities, rampStudy, endOrganFunction, INTERMACSProfile }) {
  let indication;
  if (inotropicDependence && candidateForTransplant) indication = 'bridge-to-transplant';
  else if (destinationTherapy) indication = 'destination-therapy-DT';
  else if (inotropicDependence && !candidateForTransplant) indication = 'destination-therapy-eligible';
  else if (INTERMACSProfile === '1-critical-cardiogenic-shock') indication = 'bridge-to-decision-BTD';
  else if (INTERMACSProfile === '2-progressive-decline') indication = 'bridge-to-candidacy-BTC';
  else if (lvef < 25 && symptoms) indication = 'possible-DT-consider';
  else indication = 'not-LVAD-candidate';
  let contraindication = false;
  const reasons = [];
  if (age >= 80) { contraindication = true; reasons.push('age-80-plus'); }
  if (comorbidities >= 3) { contraindication = true; reasons.push('multiple-comorbidities'); }
  if (endOrganFunction === 'failure') { contraindication = true; reasons.push('end-organ-failure'); }
  return { indication, contraindication, reasons };
}

function PCIScore({ age, dm, priorMI, priorPCI, priorCABG, lvef, stents, multivesselDisease, bifurcation, leftMain, bivalirudin, accessRoute }) {
  let score = 0;
  if (age >= 75) score += 3;
  if (dm) score += 2;
  if (priorMI) score += 1;
  if (priorPCI) score += 1;
  if (priorCABG) score += 3;
  if (lvef < 30) score += 3;
  else if (lvef < 45) score += 1;
  if (multivesselDisease) score += 2;
  if (bifurcation) score += 1;
  if (leftMain) score += 3;
  if (accessRoute === 'femoral') score += 1;
  let risk;
  if (score >= 10) risk = 'very-high-MACE';
  else if (score >= 7) risk = 'high-MACE';
  else if (score >= 4) risk = 'intermediate-MACE';
  else risk = 'low-MACE';
  return { score, risk, recommendation: risk === 'very-high-MACE' || risk === 'high-MACE' ? 'consider-CABG-or-team-Heart' : 'continue-PCI' };
}

function StructuralHeartTAVR({ age, surgicalRisk, lvef, aorticAnnulusSize, annulusArea, iliofemoralAccess, bicuspid, priorValve, frailty, porcelainAorta, ageSocietyScore }) {
  let category;
  if (surgicalRisk === 'prohibitive') category = 'prohibitive-risk-TAVR-preferred';
  else if (surgicalRisk === 'high' && age >= 80) category = 'TAVR-favored';
  else if (surgicalRisk === 'intermediate' && age >= 75) category = 'TAVR-or-SAVR-acceptable';
  else if (surgicalRisk === 'low' && age < 70) category = 'SAVR-preferred';
  else category = 'shared-decision-making';
  let anatomicalFeasibility;
  if (annulusArea < 280) anatomicalFeasibility = 'too-small';
  else if (annulusArea > 680) anatomicalFeasibility = 'too-large';
  else anatomicalFeasibility = 'feasible';
  if (bicuspid) anatomicalFeasibility = 'feasible-with-caution';
  if (iliofemoralAccess === 'poor') anatomicalFeasibility = 'consider-transapical-or-transaortic';
  if (priorValve === 'TAVR') anatomicalFeasibility = 'TAVR-in-TAVR-considered';
  return { category, anatomicalFeasibility, frailty };
}

function SuddenCardiacDeathRisk({ lvef, nyha, syncope, ventricularArrhythmia, familyHistorySCD, age, icdImplanted, cardiacArrestSurvived }) {
  let indication;
  if (cardiacArrestSurvived) indication = 'secondary-prevention-ICD-mandatory';
  else if (lvef <= 35 && nyha >= 2) indication = 'primary-prevention-ICD';
  else if (syncope && ventricularArrhythmia) indication = 'consider-ICD-electrophysiology-study';
  else if (familyHistorySCD) indication = 'family-screening-electrophysiology';
  else indication = 'no-ICD-indication';
  if (age >= 80 && lvef <= 35) indication = 'individualize-ICD-decision';
  return { indication, lvef, nyha };
}

function LipidManagement({ ldl, hdl, tg, totalChol, age, diabetes, hypertension, smoking, familyHistoryCVD, priorMI, priorStroke, ascvdScore, onStatin, statinIntensity }) {
  let risk;
  if (priorMI || priorStroke) risk = 'very-high-ASCVD';
  else if (ascvdScore >= 20) risk = 'high-ASCVD';
  else if (ascvdScore >= 7.5) risk = 'intermediate-ASCVD';
  else if (ascvdScore >= 5) risk = 'borderline-ASCVD';
  else risk = 'low-ASCVD';
  let target;
  if (risk === 'very-high-ASCVD') target = 'LDL-less-than-40';
  else if (risk === 'high-ASCVD') target = 'LDL-less-than-70';
  else if (risk === 'intermediate-ASCVD') target = 'LDL-less-than-100';
  else target = 'LDL-less-than-130';
  let treatment;
  if (ldl >= target) {
    if (risk === 'very-high-ASCVD') treatment = 'high-intensity-statin-PCSK9-or-ezetimibe';
    else if (risk === 'high-ASCVD') treatment = 'high-intensity-statin-ezetimibe-if-needed';
    else if (risk === 'intermediate-ASCVD') treatment = 'moderate-to-high-intensity-statin';
    else treatment = 'lifestyle-statin-if-needed';
  } else treatment = 'continue-current-statin';
  if (tg >= 500) treatment += '-TG-omega-3-or-fibrate';
  return { risk, target, treatment, ldl };
}

function AtrialFibrillationStrokeCHA2DS2VASc({ age, sex, chf, hypertension, diabetes, stroke, vascularDisease }) {
  let score = 0;
  if (age >= 75) score += 2;
  else if (age >= 65) score += 1;
  if (sex === 'female') score += 1;
  if (chf) score += 1;
  if (hypertension) score += 1;
  if (diabetes) score += 1;
  if (stroke) score += 2;
  if (vascularDisease) score += 1;
  let anticoagulation;
  if (sex === 'female' && score === 1) anticoagulation = 'no-anticoagulation-female-sex-only-modifier';
  else if (score >= 2) anticoagulation = 'anticoagulation-recommended-DOAC-preferred';
  else if (score === 1) anticoagulation = 'consider-anticoagulation';
  else anticoagulation = 'no-anticoagulation-needed';
  return { score, anticoagulation };
}

function HASBLED({ hypertension, abnormalRenal, abnormalLiver, stroke, bleeding, elderly, drugs, alcohol }) {
  let score = 0;
  if (hypertension) score += 1;
  if (abnormalRenal) score += 1;
  if (abnormalLiver) score += 1;
  if (stroke) score += 1;
  if (bleeding) score += 1;
  if (elderly) score += 1;
  if (drugs) score += 1;
  if (alcohol) score += 1;
  let risk;
  if (score >= 3) risk = 'high-bleeding-risk-monitor';
  else if (score >= 1) risk = 'moderate-bleeding-risk';
  else risk = 'low-bleeding-risk';
  return { score, risk };
}

function ValvularHeartMitralRegurgitation({ etiology, severity, lvef, lvesd, symptoms, atrialFibrillation, pulmonaryHypertension, flailLeaflet }) {
  let category;
  if (severity === 'severe' && lvef <= 60) category = 'severe-MR-LV-dysfunction-surgery';
  else if (severity === 'severe' && symptoms) category = 'severe-symptomatic-MR-surgery';
  else if (severity === 'severe' && flailLeaflet) category = 'severe-acute-MR-emergency-surgery';
  else if (severity === 'severe' && atrialFibrillation) category = 'severe-MR-new-onset-AF-surgery';
  else if (severity === 'severe' && pulmonaryHypertension) category = 'severe-MR-PHT-surgery';
  else category = 'chronic-compensated-MR-monitor';
  let treatment;
  if (category.includes('severe') && symptoms) treatment = 'surgical-or-transcatheter-MV-repair-MVR';
  else if (category.includes('emergency')) treatment = 'emergency-surgery-MV-repair-or-replace';
  else if (category.includes('LV-dysfunction')) treatment = 'surgery-MV-repair-preferred';
  else if (etiology === 'primary-degenerative') treatment = 'surgical-MV-repair';
  else if (etiology === 'secondary-functional') treatment = 'GDMT-CRT-MitraClip-if-high-risk';
  else treatment = 'monitor-echo-3-6mo';
  return { category, treatment };
}

module.exports = {
  HFrEFvsHFpEF, HeartFailureStage, LVADIndication, PCIScore, StructuralHeartTAVR,
  SuddenCardiacDeathRisk, LipidManagement, AtrialFibrillationStrokeCHA2DS2VASc, HASBLED, ValvularHeartMitralRegurgitation,
};
