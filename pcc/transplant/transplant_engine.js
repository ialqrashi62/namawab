'use strict';
// Transplant Engine: 10 pure deterministic functions
// Compliance: UNOS, OPTN, KDIGO, Banff, AST, ISHLT, EBMT, IS, HLA

function KDPI_Kidney({ donorAge, donorHeight, donorWeight, donorHtn, donorDcd, donorDiabetes, donorHcv, donorCkd, donorRace, donorCreatinine, donorSex }) {
  let score = 0;
  if (donorAge >= 65) score += 35; else if (donorAge >= 50) score += 25; else if (donorAge >= 40) score += 15;
  if (donorHeight) score += Math.max(0, 170 - donorHeight) * 0.2;
  if (donorWeight) score += Math.max(0, 80 - donorWeight) * 0.2;
  if (donorHtn) score += 5;
  if (donorDiabetes) score += 8;
  if (donorCkd) score += 3;
  if (donorHcv) score += 4;
  if (donorDcd) score += 2;
  if (donorCreatinine > 1.5) score += 5;
  return { kdpi: Math.min(100, Math.round(score)), quality: score < 20 ? 'excellent' : score < 40 ? 'good' : score < 60 ? 'moderate' : score < 80 ? 'poor' : 'marginal' };
}

function HLAMatch({ aMismatch, bMismatch, drMismatch, dr1Mismatch }) {
  const totalMismatch = (aMismatch || 0) + (bMismatch || 0) + (drMismatch || 0) + (dr1Mismatch || 0);
  let grade;
  if (totalMismatch === 0) grade = 'perfect-zero-mismatch';
  else if (totalMismatch <= 2) grade = 'good';
  else if (totalMismatch <= 4) grade = 'acceptable';
  else grade = 'poor';
  return { mismatchCount: totalMismatch, grade, recommendation: grade === 'poor' ? 'consider desensitization' : 'proceed' };
}

function EPTSScore({ recipientAge, recipientDiabetes, recipientDialysisYears, recipientTransplant, recipientCmv }) {
  let score = 0;
  if (recipientAge >= 65) score += 75; else if (recipientAge >= 50) score += 50; else if (recipientAge >= 35) score += 25;
  if (recipientDiabetes) score += 25;
  score += Math.min(40, recipientDialysisYears * 6);
  if (recipientTransplant) score += 20;
  return { epts: Math.min(100, Math.round(score)), tier: score >= 80 ? 'high-priority' : score >= 50 ? 'medium' : 'low', recipientCmv };
}

function ImmunosuppressionLevel({ drugLevel, drugName, timePostTransplantDays }) {
  let targetLow, targetHigh;
  if (drugName === 'tacrolimus') {
    if (timePostTransplantDays < 90) { targetLow = 8; targetHigh = 12; }
    else if (timePostTransplantDays < 365) { targetLow = 6; targetHigh = 10; }
    else { targetLow = 4; targetHigh = 8; }
  } else if (drugName === 'cyclosporine') {
    if (timePostTransplantDays < 90) { targetLow = 200; targetHigh = 300; }
    else { targetLow = 100; targetHigh = 200; }
  } else if (drugName === 'sirolimus') { targetLow = 5; targetHigh = 10; }
  else { targetLow = 1; targetHigh = 5; }
  const inRange = drugLevel >= targetLow && drugLevel <= targetHigh;
  return { drugName, drugLevel, targetLow, targetHigh, inRange, action: drugLevel < targetLow ? 'increase' : drugLevel > targetHigh ? 'decrease' : 'maintain' };
}

function RejectionRisk({ donorSpecificAntibody, crossMatch, priorTransplant, hlaMismatch, timePostTransplantDays, immunosuppressionLevel }) {
  let risk = 0;
  if (donorSpecificAntibody) risk += 3;
  if (crossMatch === 'positive') risk += 5;
  if (priorTransplant) risk += 1;
  risk += (hlaMismatch || 0) * 0.5;
  if (timePostTransplantDays < 30) risk += 2;
  if (immunosuppressionLevel === 'subtherapeutic') risk += 3;
  let level;
  if (risk >= 5) level = 'high';
  else if (risk >= 3) level = 'moderate';
  else level = 'low';
  return { riskScore: risk, level, action: level === 'high' ? 'biopsy+augment' : level === 'moderate' ? 'monitor closely' : 'standard' };
}

function BanffRejection({ interstitialInfiltratePct, tubulitisScore, intimalArteritisScore, glomerulitisScore, c4dScore, sv40Positive, atnPresent }) {
  let grade;
  if (interstitialInfiltratePct > 25 && tubulitisScore >= 1) grade = 'borderline';
  else if (tubulitisScore >= 2 && interstitialInfiltratePct > 5) grade = 'IA';
  else if (intimalArteritisScore >= 1) grade = intimalArteritisScore >= 2 ? 'III' : 'II';
  else if (glomerulitisScore >= 1) grade = 'glomerulitis';
  else grade = 'no-evidence';
  if (sv40Positive) grade += ' +sv40';
  if (atnPresent) grade += ' +atn';
  return { grade, components: { interstitialInfiltratePct, tubulitisScore, intimalArteritisScore, glomerulitisScore, c4dScore, sv40Positive, atnPresent } };
}

function DonorRecipientMatch({ bloodTypeDonor, bloodTypeRecipient, aboCompatible, weightRatio, ageDiffYears, cmvStatusDonor, cmvStatusRecipient, ebvStatusDonor, ebvStatusRecipient }) {
  const aboOk = aboCompatible !== false && (
    bloodTypeDonor === 'O' ||
    (bloodTypeDonor === 'A' && ['A', 'AB'].includes(bloodTypeRecipient)) ||
    (bloodTypeDonor === 'B' && ['B', 'AB'].includes(bloodTypeRecipient)) ||
    (bloodTypeDonor === 'AB' && bloodTypeRecipient === 'AB')
  );
  const weightOk = weightRatio >= 0.7 && weightRatio <= 1.5;
  const ageOk = Math.abs(ageDiffYears) <= 30;
  const cmvRisk = cmvStatusDonor === 'positive' && cmvStatusRecipient === 'negative';
  const ebvRisk = ebvStatusDonor === 'positive' && ebvStatusRecipient === 'negative';
  const allOk = aboOk && weightOk && ageOk;
  return { aboOk, weightOk, ageOk, cmvRisk, ebvRisk, allOk, recommendation: allOk ? (cmvRisk || ebvRisk ? 'proceed-with-monitoring' : 'proceed') : 'decline' };
}

function PostTransplantComplication({ daysPostTransplant, creatinine, tacrolimusLevel, fever, donorSpecificAntibody, tacrolimusTroughHigh }) {
  let complications = [];
  if (daysPostTransplant < 30) {
    if (creatinine > 2.5) complications.push('early-DGF');
    if (fever) complications.push('possible-infection');
  } else if (daysPostTransplant < 180) {
    if (donorSpecificAntibody) complications.push('AMR-risk');
    if (tacrolimusTroughHigh) complications.push('CNI-toxicity');
  } else {
    if (creatinine > 2) complications.push('chronic-allograft');
  }
  return { complications, urgent: complications.length > 0 };
}

function AllocationPriority({ bloodType, waitListDays, lifeExpectancyYears, sensitizationCpra, ageMonths, previousTransplant, status }) {
  let points = 0;
  points += Math.min(50, waitListDays / 30);
  if (sensitizationCpra >= 80) points += 50;
  else if (sensitizationCpra >= 20) points += 20;
  if (ageMonths < 18) points += 30;
  if (previousTransplant) points += 5;
  if (status === 'urgent') points += 100;
  else if (status === 'high') points += 30;
  return { points: Math.round(points), waitListDays, lifeExpectancyYears, bloodType };
}

function InductionTherapy({ sensitizationCpra, ageMonths, priorTransplant, donorType, hlaMismatch, recipientDiabetes }) {
  let recommendation;
  let risk;
  if (sensitizationCpra >= 80 || priorTransplant) {
    recommendation = 'ATG or Alemtuzumab (lymphocyte-depleting)';
    risk = 'high-immunologic';
  } else if (donorType === 'living' && hlaMismatch <= 3) {
    recommendation = 'Basiliximab (IL-2RA)';
    risk = 'low-immunologic';
  } else {
    recommendation = 'Basiliximab + standard triple';
    risk = 'moderate-immunologic';
  }
  if (recipientDiabetes && recommendation.includes('Tacrolimus')) risk = 'risk-of-NODAT';
  return { recommendation, risk, hlaMismatch };
}

module.exports = {
  KDPI_Kidney, HLAMatch, EPTSScore, ImmunosuppressionLevel, RejectionRisk,
  BanffRejection, DonorRecipientMatch, PostTransplantComplication, AllocationPriority, InductionTherapy,
};
