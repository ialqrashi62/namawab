'use strict';
// Hematology Engine: 10 pure deterministic functions
// Compliance: ASH, NCCN, WHO, ELN, IWCLL, ITP-ASH

function CLLRaiStaging({ lymphocytosis, lymphadenopathy, hepatomegaly, splenomegaly, anemia, thrombocytopenia }) {
  let stage = 0;
  if (lymphocytosis) stage = 0;
  if (lymphadenopathy) stage = Math.max(stage, 1);
  if (hepatomegaly || splenomegaly) stage = Math.max(stage, 2);
  if (anemia) stage = Math.max(stage, 3);
  if (thrombocytopenia) stage = Math.max(stage, 4);
  let risk;
  if (stage >= 3) risk = 'high-risk-treat';
  else if (stage >= 1) risk = 'intermediate-risk-monitor';
  else risk = 'low-risk-watchful-waiting';
  return { raiStage: stage, risk, recommendation: stage >= 3 ? 'treat-bruton-kinase-inhibitor' : 'monitor-q3mo' };
}

function AMLELNRisk({ amlType, cytogenetics, molecularMutations, age, priorTherapyRelated, wbcCount }) {
  let risk = 0;
  if (cytogenetics === 'favorable') risk -= 1;
  else if (cytogenetics === 'adverse') risk += 2;
  if (molecularMutations && molecularMutations.includes('FLT3-ITD')) risk += 2;
  if (molecularMutations && molecularMutations.includes('NPM1')) risk -= 1;
  if (molecularMutations && molecularMutations.includes('CEBPA')) risk -= 1;
  if (age >= 60) risk += 1;
  if (priorTherapyRelated) risk += 2;
  if (wbcCount >= 100000) risk += 1;
  let category;
  if (risk <= -1) category = 'favorable-eligible-standard-chemo';
  else if (risk <= 1) category = 'intermediate-eligible-clinical-trial';
  else category = 'adverse-consider-transplant';
  return { riskScore: risk, category, amlType };
}

function DICScore({ plateletCount, ptProlongation, fibrinogen, dDimer, underlyingCause }) {
  let score = 0;
  if (plateletCount < 50) score += 2;
  else if (plateletCount < 100) score += 1;
  if (ptProlongation >= 6) score += 2;
  else if (ptProlongation >= 3) score += 1;
  if (fibrinogen < 100) score += 1;
  if (dDimer >= 5) score += 3;
  else if (dDimer >= 1) score += 2;
  else if (dDimer >= 0.5) score += 1;
  let category;
  if (score >= 5) category = 'overt-DIC';
  else if (score >= 1) category = 'non-overt-DIC';
  else category = 'no-DIC';
  let treatment;
  if (category === 'overt-DIC' && underlyingCause === 'sepsis') treatment = 'treat-underlying-FFP-platelets';
  else if (category === 'overt-DIC') treatment = 'treat-underlying-component-therapy';
  else treatment = 'monitor';
  return { score, category, treatment };
}

function ITPDiagnosis({ plateletCount, bleedingSymptoms, otherCausesExcluded, boneMarrow, peripheralBlood, megakaryocytes }) {
  let diagnosis;
  if (plateletCount < 50000 && otherCausesExcluded) diagnosis = 'ITP-definite';
  else if (plateletCount < 100000 && otherCausesExcluded) diagnosis = 'ITP-likely';
  else diagnosis = 'thrombocytopenia-evaluate-other-cause';
  let treatment;
  if (plateletCount < 20000) treatment = 'urgent-IVIG-dexamethasone';
  else if (plateletCount < 50000 && bleedingSymptoms) treatment = 'corticosteroids-TPO-receptor-agonist';
  else if (diagnosis === 'ITP-likely') treatment = 'monitor';
  else treatment = 'evaluate';
  return { diagnosis, treatment, plateletCount };
}

function TTPScore({ microangiopathicHemolyticAnemia, thrombocytopenia, neurologicalSymptoms, renalInvolvement, fever, schistocytes, haptoglobinLow, ldHigh }) {
  const score = (microangiopathicHemolyticAnemia ? 1 : 0) + (thrombocytopenia ? 1 : 0) + (neurologicalSymptoms ? 1 : 0) + (renalInvolvement ? 0 : 1) + (fever ? 1 : 0);
  let category;
  if (score >= 5) category = 'high-probability-TTP';
  else if (score >= 3) category = 'intermediate-probability-TTP';
  else category = 'low-probability-not-TTP';
  let treatment;
  if (category === 'high-probability-TTP') treatment = 'urgent-plasma-exchange-caplacizumab';
  else if (category === 'intermediate-probability-TTP') treatment = 'empirical-plasma-exchange';
  else treatment = 'evaluate-alternatives';
  return { score, category, treatment };
}

function AnemiaWorkup({ hemoglobin, mcv, reticulocyteCount, iron, tibc, ferritin, b12, folate, age, gender, crp }) {
  let type;
  if (mcv < 80) type = 'microcytic';
  else if (mcv > 100) type = 'macrocytic';
  else type = 'normocytic';
  let cause;
  if (type === 'microcytic' && ferritin < 30) cause = 'iron-deficiency-anemia';
  else if (type === 'microcytic' && iron >= 100) cause = 'anemia-of-chronic-disease-or-sideroblastic';
  else if (type === 'macrocytic' && b12 < 200) cause = 'B12-deficiency';
  else if (type === 'macrocytic' && folate < 3) cause = 'folate-deficiency';
  else if (type === 'macrocytic' && crp > 10) cause = 'anemia-of-chronic-disease';
  else if (reticulocyteCount < 2) cause = 'hypoproliferative';
  else if (reticulocyteCount > 2) cause = 'hemolysis-or-blood-loss';
  else cause = 'unclear-evaluate';
  return { hemoglobin, mcv, type, cause, recommendation: cause === 'iron-deficiency-anemia' ? 'iron-replacement-workup-cause' : 'treat-underlying' };
}

function IronDeficiency({ ferritin, tsat, hemoglobin, mcv, cause, gender, age }) {
  let category;
  if (ferritin < 30 || tsat < 20) category = 'absolute-iron-deficiency';
  else if (ferritin < 100 && tsat < 20) category = 'functional-iron-deficiency';
  else category = 'no-iron-deficiency';
  let treatment;
  if (category === 'absolute-iron-deficiency' && hemoglobin < 12) treatment = 'IV-iron-or-oral-3-6-months';
  else if (category === 'absolute-iron-deficiency') treatment = 'oral-iron-replacement';
  else if (category === 'functional-iron-deficiency') treatment = 'IV-iron-if-symptoms';
  else treatment = 'monitor';
  let investigation = cause === 'menstrual' ? 'gynecology-referral' : cause === 'gi-loss' ? 'colonoscopy-endoscopy' : 'workup-occult-blood-loss';
  return { category, treatment, investigation, ferritin, tsat };
}

function SickleCellCrisis({ hemoglobin, retic, pain, temperature, oxygenSaturation, wbc, priorCrisesPerYear, hydroxyurea }) {
  let crisis;
  if (pain && temperature && oxygenSaturation < 92) crisis = 'acute-chest-syndrome';
  else if (pain && temperature) crisis = 'vaso-occlusive-with-infection';
  else if (pain) crisis = 'vaso-occlusive-crisis';
  else if (hemoglobin < 7 && retic > 10) crisis = 'hyperhemolytic-crisis';
  else if (hemoglobin < 7 && retic < 1) crisis = 'aplastic-crisis-parvovirus';
  else crisis = 'no-crisis';
  let treatment;
  if (crisis === 'acute-chest-syndrome') treatment = 'oxygen-antibiotics-analgesia-transfusion';
  else if (crisis === 'vaso-occlusive-with-infection') treatment = 'analgesia-antibiotics-hydration';
  else if (crisis === 'vaso-occlusive-crisis') treatment = 'analgesia-hydration-warmth';
  else if (crisis === 'hyperhemolytic-crisis') treatment = 'transfusion';
  else if (crisis === 'aplastic-crisis-parvovirus') treatment = 'transfusion-isolation-IVIG';
  else treatment = hydroxyurea ? 'continue-hydroxyurea' : 'start-hydroxyurea';
  return { crisis, treatment, priorCrisesPerYear };
}

function Coagulopathy({ pt, inr, ptt, fibrinogen, platelets, bleeding, thrombosis, onWarfarin, onHeparin, onDOAC, liverDisease }) {
  let cause;
  if (inr > 3 && onWarfarin) cause = 'warfarin-overanticoagulation';
  else if (ptt > 40 && onHeparin) cause = 'heparin-effect';
  else if (onDOAC) cause = 'DOAC-effect';
  else if (inr > 2 && ptt > 40 && fibrinogen < 200) cause = 'liver-disease-coagulopathy';
  else if (inr > 2 && fibrinogen < 100) cause = 'DIC';
  else if (ptt > 40 && bleeding) cause = 'factor-deficiency-evaluate';
  else if (thrombosis) cause = 'thrombophilia-evaluate';
  else cause = 'normal-coagulation';
  let treatment;
  if (cause === 'warfarin-overanticoagulation' && bleeding) treatment = '4-factor-PCC-Vitamin-K';
  else if (cause === 'warfarin-overanticoagulation') treatment = 'hold-warfarin-or-Vitamin-K';
  else if (cause === 'heparin-effect' && bleeding) treatment = 'protamine-sulfate';
  else if (cause === 'DOAC-effect' && bleeding) treatment = 'andexanet-alfa-or-4-factor-PCC';
  else if (cause === 'liver-disease-coagulopathy') treatment = 'Vitamin-K-FFP';
  else if (cause === 'DIC') treatment = 'treat-underlying';
  else treatment = 'monitor';
  return { cause, treatment };
}

function TransfusionThreshold({ hemoglobin, activeBleeding, cardiacDisease, surgery, plt, inr, onAnticoagulation }) {
  let trigger;
  if (activeBleeding) trigger = 'transfuse-now-liberally';
  else if (cardiacDisease && hemoglobin < 8) trigger = 'transfuse-restrictive-8';
  else if (surgery && hemoglobin < 9) trigger = 'transfuse-preop-9';
  else if (hemoglobin < 7) trigger = 'transfuse-restrictive-7';
  else if (plt < 10000) trigger = 'platelet-transfusion';
  else if (plt < 50000 && surgery) trigger = 'platelet-preop';
  else if (inr > 2 && activeBleeding) trigger = 'FFP-transfuse';
  else trigger = 'no-transfusion';
  return { hemoglobin, plt, inr, trigger, recommendation: trigger };
}

module.exports = {
  CLLRaiStaging, AMLELNRisk, DICScore, ITPDiagnosis, TTPScore,
  AnemiaWorkup, IronDeficiency, SickleCellCrisis, Coagulopathy, TransfusionThreshold,
};
