'use strict';
// Ophthalmology Engine: 10 pure deterministic functions
// Compliance: AAO, NICE, Wills Eye Manual

function VisualAcuity({ snellenNumerator, snellenDenominator, distanceCm }) {
  const logMar = Math.log10(snellenDenominator / snellenNumerator);
  let category;
  if (logMar <= 0.0) category = 'normal-20-20-or-better';
  else if (logMar <= 0.3) category = 'near-normal-20-25';
  else if (logMar <= 0.5) category = 'mild-loss';
  else if (logMar <= 0.5) category = 'mild-loss';
  else if (logMar < 1.0) category = 'moderate-loss';
  else if (logMar < 1.3) category = 'severe-loss';
  else if (logMar < 2.0) category = 'profound-loss';
  else category = 'NLP-or-LP';
  return { logMar: Math.round(logMar * 100) / 100, snellen: snellenNumerator + '/' + snellenDenominator, category };
}

function IOPAssessment({ iop, cct, cornealCompensation }) {
  let category;
  if (iop > 21) category = 'ocular-hypertension';
  else if (iop < 6) category = 'hypotony';
  else category = 'normal-iop';
  if (cornealCompensation) {
    const cctFactor = (cct - 545) * 0.001;
    const correctedIop = iop + cctFactor;
    return { correctedIop: Math.round(correctedIop * 10) / 10, iop, cct, category: correctedIop > 21 ? 'corrected-ocular-hypertension' : category };
  }
  return { iop, cct, category };
}

function GlaucomaRiskAssessment({ age, iop, cct, opticDiscCupping, octRnflThickness, visualFieldDefect, familyHistory, race }) {
  let risk = 0;
  if (iop > 21) risk += 2;
  if (opticDiscCupping > 0.6) risk += 2;
  if (octRnflThickness < 80) risk += 2;
  if (visualFieldDefect) risk += 3;
  if (familyHistory) risk += 1;
  if (race === 'African') risk += 1;
  if (age > 60) risk += 1;
  if (cct < 540) risk += 1;
  let category;
  if (risk >= 5) category = 'high-risk-glaucoma';
  else if (risk >= 3) category = 'moderate-risk';
  else category = 'low-risk';
  return { riskScore: risk, category, recommendation: category === 'high-risk-glaucoma' ? 'specialist-referral-IV-timolol' : category === 'moderate-risk' ? 'monitor-6mo' : 'annual-exam' };
}

function DiabeticRetinopathy({ microaneurysms, dotBlotHemorrhages, hardExudates, cottonWoolSpots, neovascularization, vitreousHemorrhage, macularEdema }) {
  let stage;
  if (neovascularization || vitreousHemorrhage) stage = 'proliferative';
  else if (cottonWoolSpots && hardExudates) stage = 'severe-non-proliferative';
  else if (hardExudates) stage = 'moderate-non-proliferative';
  else if (microaneurysms || dotBlotHemorrhages) stage = 'mild-non-proliferative';
  else stage = 'no-DR';
  const csme = macularEdema;
  return { stage, csme, recommendation: stage === 'proliferative' ? 'urgent-retina-IV-anti-VEGF-Panretinal-photocoag' : csme ? 'anti-VEGF-for-DME' : 'annual-screening' };
}

function AMDAREDS({ drusen, geographicAtrophy, choroidalNeovascularization, visualAcuity, age, smokingHistory, familyHistory }) {
  let category;
  if (choroidalNeovascularization) category = 'wet-AMD';
  else if (geographicAtrophy) category = 'advanced-dry-AMD';
  else if (drusen === 'large') category = 'intermediate-AMD';
  else if (drusen === 'medium') category = 'early-AMD';
  else category = 'no-AMD';
  const riskFactors = (age >= 65 ? 1 : 0) + (smokingHistory ? 2 : 0) + (familyHistory ? 1 : 0);
  return { category, riskScore: riskFactors, recommendation: category === 'wet-AMD' ? 'urgent-anti-VEGF' : category === 'advanced-dry-AMD' ? 'monitor-symptoms' : 'AREDS-2-supplements' };
}

function RedEyeTriage({ pain, visionLoss, photophobia, halos, discharge, photophobiaSeverity, trauma, contactLens, historyGlaucoma }) {
  const redFlags = (pain ? 1 : 0) + (visionLoss ? 1 : 0) + (photophobia ? 1 : 0) + (halos ? 1 : 0);
  let diagnosis;
  if (trauma || contactLens) diagnosis = 'corneal-trauma-or-keratitis';
  else if (historyGlaucoma && pain && halos) diagnosis = 'acute-angle-closure-glaucoma';
  else if (photophobiaSeverity === 'severe' && pain) diagnosis = 'anterior-uveitis';
  else if (discharge === 'purulent') diagnosis = 'bacterial-conjunctivitis';
  else if (discharge === 'watery') diagnosis = 'viral-conjunctivitis';
  else diagnosis = 'allergic-conjunctivitis';
  return { redFlags, diagnosis, urgent: redFlags >= 2 || diagnosis === 'acute-angle-closure-glaucoma' };
}

function CataractGrading({ nuclearOpacity, corticalOpacity, posteriorSubcapsular, visualAcuity, glare }) {
  let nuclearGrade = nuclearOpacity === 'mild' ? 1 : nuclearOpacity === 'moderate' ? 2 : nuclearOpacity === 'severe' ? 3 : 0;
  let corticalGrade = corticalOpacity === 'mild' ? 1 : corticalOpacity === 'moderate' ? 2 : corticalOpacity === 'severe' ? 3 : 0;
  let pscGrade = posteriorSubcapsular === 'mild' ? 1 : posteriorSubcapsular === 'moderate' ? 2 : posteriorSubcapsular === 'severe' ? 3 : 0;
  const totalGrade = nuclearGrade + corticalGrade + pscGrade;
  let recommendation;
  if (visualAcuity < 0.5 && glare === 'significant') recommendation = 'cataract-surgery';
  else if (totalGrade >= 6) recommendation = 'cataract-surgery-discuss';
  else recommendation = 'monitor-1y';
  return { nuclearGrade, corticalGrade, pscGrade, totalGrade, recommendation };
}

function RetinalDetachmentRisk({ latticeDegeneration, myopia, familyHistoryRD, priorRD, trauma, symptoms }) {
  let risk = 0;
  if (latticeDegeneration) risk += 2;
  if (myopia >= -6) risk += 1;
  if (familyHistoryRD) risk += 1;
  if (priorRD) risk += 3;
  if (trauma) risk += 2;
  if (symptoms === 'flashes-floaters-curtain') risk += 5;
  let category;
  if (risk >= 5) category = 'high-risk-emergency';
  else if (risk >= 3) category = 'moderate-risk';
  else category = 'low-risk';
  return { riskScore: risk, category, recommendation: category === 'high-risk-emergency' ? 'urgent-ophthalmology' : 'annual-dilated-exam' };
}

function StrabismusAssessment({ ageMonths, eyeDeviation, coverUncover, stereopsis, visionEachEye, cornealLightReflex }) {
  let classification;
  if (ageMonths < 6 && eyeDeviation === 'constant') classification = 'congenital-esotropia';
  else if (coverUncover === 'unilateral') classification = 'unilateral-strabismus';
  else if (cornealLightReflex === 'asymmetric') classification = 'manifest-strabismus';
  else classification = 'phoria-orthophoria';
  const amblyopiaRisk = visionEachEye && (visionEachEye.left < 0.7 || visionEachEye.right < 0.7);
  return { classification, amblyopiaRisk, recommendation: classification.includes('strabismus') && ageMonths < 84 ? 'urgent-ophthalmology-pedi' : 'monitor' };
}

function DryEyeSeverity({ schirmer, osmolarity, staining, symptoms, tearFilmBreakupTime }) {
  let severity;
  if (schirmer < 5 || osmolarity > 320 || staining === 'severe') severity = 'severe-DED';
  else if (schirmer < 10 || osmolarity > 308 || staining === 'moderate') severity = 'moderate-DED';
  else if (symptoms === 'mild' || tearFilmBreakupTime < 10) severity = 'mild-DED';
  else severity = 'minimal';
  return { severity, recommendation: severity === 'severe-DED' ? 'punctal-plugs-cyclosporine' : severity === 'moderate-DED' ? 'artificial-tears-cyclosporine' : 'artificial-tears-lifestyle' };
}

module.exports = {
  VisualAcuity, IOPAssessment, GlaucomaRiskAssessment, DiabeticRetinopathy, AMDAREDS,
  RedEyeTriage, CataractGrading, RetinalDetachmentRisk, StrabismusAssessment, DryEyeSeverity,
};
