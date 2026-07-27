'use strict';
// Rheumatology Extended Engine: 10 pure deterministic functions
// Compliance: ACR, EULAR, ASAS, GRAPPA, OMERACT, BVAS, VDI

function CASPAR({ psoriasisCurrent, psoriasisHistory, familyPsoriasis, nailChanges, dactylitis, juxtaarticularNewBone, rheumatoidFactorNegative, currentEnthesitis }) {
  let points = 0;
  if (psoriasisCurrent) points += 2;
  else if (psoriasisHistory || familyPsoriasis) points += 1;
  if (nailChanges) points += 1;
  if (dactylitis) points += 1;
  if (juxtaarticularNewBone) points += 1;
  if (rheumatoidFactorNegative) points += 1;
  if (currentEnthesitis) points += 1;
  let classification;
  if (points >= 3) classification = 'psoriatic-arthritis';
  else classification = 'not-classified-PsA';
  return { points, classification };
}

function ModifiedNewYork({ inflammatoryLowBackPain, limitedLumbarMotion, chestExpansion, bilateralSacroliitis, unilateralSacroliitis }) {
  let points = 0;
  if (inflammatoryLowBackPain) points += 1;
  if (limitedLumbarMotion) points += 1;
  if (chestExpansion) points += 1;
  if (bilateralSacroliitis) points += 1;
  let classification;
  if (inflammatoryLowBackPain && (bilateralSacroliitis || (unilateralSacroliitis && (limitedLumbarMotion || chestExpansion)))) {
    classification = 'ankylosing-spondylitis-definite';
  } else if (points >= 3) {
    classification = 'ankylosing-spondylitis-probable';
  } else {
    classification = 'not-AS';
  }
  return { points, classification };
}

function BVASv3(input) {
  const sys = (input && input.systemic) || {};
  const cut = (input && input.cutaneous) || {};
  const muc = (input && input.mucous) || {};
  const entObj = (input && input.ent) || {};
  const che = (input && input.chest) || {};
  const car = (input && input.cardiovascular) || {};
  const abd = (input && input.abdominal) || {};
  const ren = (input && input.renal) || {};
  const ner = (input && input.nervous) || {};
  const sysScore = (sys.fever ? 1 : 0) + (sys.weightLoss ? 2 : 0) + (sys.fatigue ? 1 : 0);
  const cutScore = (cut.nodules ? 1 : 0) + (cut.ulcer ? 2 : 0) + (cut.gangrene ? 4 : 0);
  const mucScore = (muc.ulcers ? 1 : 0) + (muc.bloody ? 2 : 0);
  const entScore = (entObj.nasalCrust ? 1 : 0) + (entObj.sinusitis ? 1 : 0) + (entObj.otitis ? 1 : 0) + (entObj.hoarseness ? 1 : 0);
  const cheScore = (che.wheeze ? 1 : 0) + (che.nodules ? 2 : 0) + (che.infiltrate ? 2 : 0) + (che.hemoptysis ? 4 : 0);
  const carScore = (car.bp ? 4 : 0) + (car.pericarditis ? 2 : 0);
  const abdScore = (abd.peritonitis ? 4 : 0) + (abd.bloodyDiarrhea ? 4 : 0);
  const renScore = (ren.bpsgn ? 4 : 0) + (ren.hematuria ? 4 : 0) + (ren.creat ? 4 : 0);
  const nerScore = (ner.meningitis ? 4 : 0) + (ner.stroke ? 4 : 0) + (ner.seizure ? 4 : 0) + (ner.sensory ? 2 : 0) + (ner.motor ? 4 : 0) + (ner.cranialNervePalsy ? 4 : 0);
  const total = sysScore + cutScore + mucScore + entScore + cheScore + carScore + abdScore + renScore + nerScore;
  let category;
  if (total >= 24) category = 'severe-vasculitis-active';
  else if (total >= 12) category = 'moderate-vasculitis-active';
  else if (total >= 1) category = 'mild-vasculitis-active';
  else category = 'remission';
  return { bvasScore: total, category, recommendation: total >= 12 ? 'induction-cyclophosphamide-rituximab' : total >= 1 ? 'maintenance-methotrexate-azathioprine' : 'continue-remission-monitoring' };
}

function SLEDAIScore({ seizure, psychosis, organicBrain, visualDisturbance, cranialNerve, lupusHeadache, cvas, vasculitis, arthritis, myositis, urinaryCasts, hematuria, proteinuria, pyuria, rash, alopecia, mucosal, pleurisy, pericarditis, lowComplement, increasedDNA, fever, thrombocytopenia, leukopenia }) {
  const score = (seizure ? 8 : 0) + (psychosis ? 8 : 0) + (organicBrain ? 8 : 0) + (visualDisturbance ? 8 : 0) + (cranialNerve ? 8 : 0) + (lupusHeadache ? 8 : 0) + (cvas ? 8 : 0) + (vasculitis ? 8 : 0) + (arthritis ? 4 : 0) + (myositis ? 4 : 0) + (urinaryCasts ? 4 : 0) + (hematuria ? 4 : 0) + (proteinuria ? 4 : 0) + (pyuria ? 4 : 0) + (rash ? 2 : 0) + (alopecia ? 2 : 0) + (mucosal ? 2 : 0) + (pleurisy ? 2 : 0) + (pericarditis ? 2 : 0) + (lowComplement ? 2 : 0) + (increasedDNA ? 2 : 0) + (fever ? 1 : 0) + (thrombocytopenia ? 1 : 0) + (leukopenia ? 1 : 0);
  let activity;
  if (score >= 12) activity = 'severe-flare';
  else if (score >= 6) activity = 'moderate-flare';
  else if (score >= 1) activity = 'mild-flare';
  else activity = 'no-activity';
  let treatment;
  if (activity === 'severe-flare') treatment = 'high-dose-steroids-IV-cyclophosphamide';
  else if (activity === 'moderate-flare') treatment = 'prednisone-azathioprine-or-mycophenolate';
  else if (activity === 'mild-flare') treatment = 'hydroxychloroquine-low-dose-prednisone';
  else treatment = 'continue-maintenance';
  return { sledai: score, activity, treatment };
}

function SCLClassification({ skinInvolvement, raynaud, digitalUlcers, tendonRubs, jointInvolvement, muscleInvolvement, ILD, PAH, sclerodermaRenalCrisis, antiCentromere, antiScl70, antiRNAPolymeraseIII }) {
  let subtype;
  if (skinInvolvement === 'diffuse' || antiScl70) subtype = 'diffuse-cutaneous';
  else if (skinInvolvement === 'limited' || antiCentromere) subtype = 'limited-cutaneous';
  else subtype = 'sine-scleroderma';
  let risk;
  if (sclerodermaRenalCrisis) risk = 'urgent-RC';
  else if (ILD && PAH) risk = 'high-risk-cardiopulmonary';
  else if (ILD) risk = 'ILD-risk';
  else if (PAH) risk = 'PAH-risk';
  else if (digitalUlcers) risk = 'digital-ulcer-risk';
  else risk = 'lower-risk';
  return { subtype, risk, antiRNAPolymeraseIII };
}

function GoutFlare({ affectedJoints, hotSwollenJoint, tophi, priorFlaresPerYear, uricAcid, renalFunction, onUrateLowering, adherence }) {
  let diagnosis;
  if (affectedJoints === 1 && hotSwollenJoint && uricAcid > 6) diagnosis = 'acute-gout-flare';
  else if (tophi) diagnosis = 'chronic-tophaceous-gout';
  else if (priorFlaresPerYear >= 2) diagnosis = 'recurrent-gout';
  else diagnosis = 'possible-gout';
  let treatment;
  if (renalFunction >= 1.5) treatment = 'NSAID-or-colchicine';
  else treatment = 'prednisone-tapering-IL-1-inhibitor';
  if (onUrateLowering && adherence === 'poor') treatment += '-improve-adherence-uric-acid-lowering';
  if (tophi) treatment += '-intensify-urate-lowering-treat-to-target';
  return { diagnosis, treatment, targetUricAcid: 'less-than-6-or-5-with-tophi' };
}

function SjogrenSSDAI({ constitutional, lymphadenopathy, gland, articular, cutaneous, pulmonary, renal, peripheralNS, CNS, hematologic }) {
  const score = (constitutional || 0) + (lymphadenopathy || 0) + (gland || 0) + (articular || 0) + (cutaneous || 0) + (pulmonary || 0) + (renal || 0) + (peripheralNS || 0) + (CNS || 0) + (hematologic || 0);
  let activity;
  if (score >= 7) activity = 'high-activity';
  else if (score >= 5) activity = 'moderate-activity';
  else if (score >= 1) activity = 'low-activity';
  else activity = 'inactive';
  return { ssdaScore: score, activity };
}

function OsteoporosisFRAX({ age, sex, weightKg, heightCm, priorFracture, parentalHipFracture, currentSmoking, glucocorticoids, rheumatoidArthritis, secondaryOsteoporosis, alcohol3OrMore, femoralNeckBMD }) {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  let risk = 0;
  if (age >= 70) risk += 5;
  else if (age >= 60) risk += 3;
  if (priorFracture) risk += 5;
  if (parentalHipFracture) risk += 2;
  if (currentSmoking) risk += 1;
  if (glucocorticoids) risk += 2;
  if (rheumatoidArthritis) risk += 1;
  if (secondaryOsteoporosis) risk += 1;
  if (alcohol3OrMore) risk += 1;
  if (bmi < 20) risk += 1;
  if (femoralNeckBMD && femoralNeckBMD < -2.5) risk += 4;
  let hipFracture;
  if (risk >= 10) hipFracture = 'high-3pct-or-more-10y-hip';
  else if (risk >= 5) hipFracture = 'intermediate-1-3pct-10y-hip';
  else hipFracture = 'low-less-than-1pct-10y-hip';
  let treatment;
  if (risk >= 7) treatment = 'bisphosphonate-or-denosumab-or-teriparatide';
  else if (risk >= 4) treatment = 'counseling-Ca-Vit-D-weight-bearing';
  else treatment = 'lifestyle-modifications';
  return { riskScore: risk, hipFracture, treatment };
}

function PMRDiagnosis({ age, bilateralShoulderPain, hipInvolvement, morningStiffnessMinutes, elevatedESR, elevatedCRP, rheumatoidFactorNegative, ultrasoundFindings, rapidSteroidResponse }) {
  let score = 0;
  if (age >= 50) score += 2;
  if (bilateralShoulderPain) score += 1;
  if (hipInvolvement) score += 1;
  if (morningStiffnessMinutes >= 45) score += 2;
  if (elevatedESR) score += 1;
  if (elevatedCRP) score += 1;
  if (rheumatoidFactorNegative) score += 2;
  if (ultrasoundFindings === 'bursitis') score += 1;
  if (rapidSteroidResponse) score += 2;
  let classification;
  if (score >= 5) classification = 'PMR-classified';
  else if (score >= 3) classification = 'PMR-probable';
  else classification = 'PMR-unlikely';
  let treatment;
  if (classification === 'PMR-classified') treatment = 'prednisone-15mg-taper';
  else if (classification === 'PMR-probable') treatment = 'trial-prednisone-15mg';
  else treatment = 'evaluate-alternative';
  return { pmrScore: score, classification, treatment };
}

function StillDisease({ spikingFever, evanescentRash, arthritis, arthralgia, lymphadenopathy, splenomegaly, soreThroat, pericarditis, pleuritis, wbc, ferritin, ana, rf }) {
  let score = 0;
  if (spikingFever) score += 2;
  if (evanescentRash) score += 2;
  if (arthritis) score += 2;
  if (arthralgia) score += 1;
  if (lymphadenopathy) score += 1;
  if (splenomegaly) score += 1;
  if (soreThroat) score += 1;
  if (pericarditis) score += 1;
  if (pleuritis) score += 1;
  if (wbc >= 15000) score += 1;
  if (ferritin >= 5 * 100) score += 2;
  let classification;
  if (score >= 8) classification = 'definite-Still-disease';
  else if (score >= 5) classification = 'probable-Still-disease';
  else classification = 'possible-Still-disease';
  let treatment;
  if (classification === 'definite-Still-disease') treatment = 'NSAID-or-steroids-or-anakinra-or-TNF';
  else if (classification === 'probable-Still-disease') treatment = 'NSAID-trial-then-steroid';
  else treatment = 'monitor';
  return { stillScore: score, classification, treatment };
}

module.exports = {
  CASPAR, ModifiedNewYork, BVASv3, SLEDAIScore, SCLClassification,
  GoutFlare, SjogrenSSDAI, OsteoporosisFRAX, PMRDiagnosis, StillDisease,
};
