'use strict';

// Pain-Extended PCC — 10 pure deterministic functions
// Compliance: WHO, IASP, CDC, AAPM, AAN, AHS, ACPM

const Engine = module.exports = {};

// 1) WHO analgesic ladder step
Engine.WHOLadderAnalgesic = function (input = {}) {
  const { currentPainScore = 0, opioidNaive = true, neuropathic = false, mildNeuropathic = true } = input;
  let step;
  if (currentPainScore <= 3) step = 'step-1-non-opioid';
  else if (currentPainScore <= 6) step = 'step-2-weak-opioid-or-combination';
  else if (opioidNaive) step = 'step-3-strong-opioid-low-dose';
  else step = 'step-3-strong-opioid-titration';
  if (neuropathic && mildNeuropathic) step += '-plus-adjuvant-gabapentinoid';
  return { step, recommendation: step.includes('step-3') ? 'start-morphine-equivalent-30-60mg-or-oxycodone' : 'continue-current-line' };
};

// 2) CDC opioid dose safety — MME
Engine.OpioidDoseCDC = function (input = {}) {
  const { morphineMilligramEquivalentDaily = 0, daysOnOpioid = 7, benzodiazepineConcurrent = false, naloxonePrescribed = false, priorOverdose = false } = input;
  let category;
  if (morphineMilligramEquivalentDaily >= 200) category = 'high-dose-carefully-justify';
  else if (morphineMilligramEquivalentDaily >= 50) category = 'moderate-dose-careful-monitoring';
  else if (morphineMilligramEquivalentDaily >= 20) category = 'low-dose-standard-care';
  else category = 'minimal-dose-or-naive';
  let safetyFlags = [];
  if (!naloxonePrescribed && morphineMilligramEquivalentDaily >= 50) safetyFlags.push('prescribe-naloxone');
  if (benzodiazepineConcurrent) safetyFlags.push('avoid-benzodiazepine-combination');
  if (daysOnOpioid > 7) safetyFlags.push('consider-tapering-if-chronic');
  if (priorOverdose) safetyFlags.push('high-priority-monitoring');
  return { mme: morphineMilligramEquivalentDaily, category, safetyFlags, recommendation: safetyFlags.length > 0 ? 'address-safety-flags-immediately' : 'continue-current-regimen' };
};

// 3) Opioid-induced constipation risk
Engine.ConstipationOpioidRisk = function (input = {}) {
  const { opioidDose = 0, mobility = 'normal', fiber = 25, hydration = 'normal', bowelRegimen = false } = input;
  let risk;
  if (opioidDose >= 100 && mobility === 'low') risk = 'severe-opioid-induced-constipation';
  else if (opioidDose >= 100 || !bowelRegimen) risk = 'high-risk';
  else if (fiber < 15) risk = 'moderate-risk-diet';
  else if (hydration === 'low') risk = 'moderate-risk-dehydration';
  else risk = 'low-risk';
  return { risk, recommendation: risk === 'severe-opioid-induced-constipation' ? 'stimulant-laxative-PAMORAs-MNT' : (bowelRegimen ? 'continue-bowel-regimen' : 'start-bowel-regimen-prophylactic') };
};

// 4) Neuropathic pain — DN4 questionnaire
Engine.NeuropathicPainScreening = function (input = {}) {
  const { painDN4 = {} } = input;
  const score = (painDN4.burning ? 1 : 0) + (painDN4.electric ? 1 : 0) + (painDN4.numbness ? 1 : 0) + (painDN4.tingling ? 1 : 0) + (painDN4.pinsNeedles ? 1 : 0) + (painDN4.allodynia ? 1 : 0) + (painDN4.brushing ? 1 : 0) + (painDN4.hypoesthesia ? 1 : 0);
  let diagnosis;
  if (score >= 4) diagnosis = 'neuropathic-pain-likely';
  else if (score >= 3) diagnosis = 'possible-neuropathic-pain';
  else diagnosis = 'non-neuropathic-pain';
  return { score, diagnosis, recommendation: diagnosis === 'neuropathic-pain-likely' ? 'gabapentinoid-TCAs-SNRIs-first-line' : 'continue-evaluating-different-pain-type' };
};

// 5) Fibromyalgia — 2016 ACR criteria
Engine.FibromyalgiaDiagnostic = function (input = {}) {
  const { widespreadPainIndex = 0, symptomSeverity = 0, durationMonths = 3, otherCausesExcluded = true } = input;
  const total = widespreadPainIndex + symptomSeverity;
  let diagnosis;
  if (!otherCausesExcluded) diagnosis = 'incomplete-workup-rule-out-other-causes';
  else if (durationMonths < 3) diagnosis = 'not-yet-meeting-duration-criteria';
  else if (total >= 13) diagnosis = 'fibromyalgia-probable';
  else if (total >= 8) diagnosis = 'fibromyalgia-possible';
  else diagnosis = 'no-fibromyalgia';
  return { total, diagnosis, recommendation: diagnosis === 'fibromyalgia-probable' ? 'multimodal-physical-activity-CBT-SNRI-or-gabapentinoid' : 'reassess-3-mo' };
};

// 6) Migraine prophylaxis indication
Engine.MigraineProphylaxisIndication = function (input = {}) {
  const { monthlyMigraineDays = 0, acuteMedicationDays = 0, disability = 'moderate' } = input;
  let indication;
  if (monthlyMigraineDays >= 4 || acuteMedicationDays >= 10) indication = 'prophylaxis-indicated';
  else if (monthlyMigraineDays >= 2 && disability === 'severe') indication = 'prophylaxis-consider';
  else if (acuteMedicationDays >= 8) indication = 'medication-overuse-headache-risk';
  else indication = 'acute-treatment-only';
  return { indication, recommendation: indication === 'prophylaxis-indicated' ? 'start-beta-blocker-topiramate-amitriptyline-or-CGRP-inhibitor' : 'acute-triptan-NSAID' };
};

// 7) CGRP inhibitor response eligibility
Engine.CGRPInhibitorResponse = function (input = {}) {
  const { monthlyMigraineDays = 0, priorProphylaxisFailure = 0, episodic = true, contraindications = [] } = input;
  let response;
  if (contraindications.length > 0) response = 'contraindicated-CGRP-inhibitor';
  else if (priorProphylaxisFailure >= 2) response = 'good-candidate-CGRP-inhibitor';
  else if (monthlyMigraineDays >= 15 && !episodic) response = 'good-candidate-CGRP-inhibitor';
  else if (priorProphylaxisFailure === 1) response = 'consider-after-1st-line-failure';
  else response = 'try-traditional-prophylaxis-first';
  return { response, recommendation: response === 'good-candidate-CGRP-inhibitor' ? 'erenumab-fremanezumab-galcanezumab' : 'continue-other-therapies' };
};

// 8) Ketamine infusion indication
Engine.KetamineInfusion = function (input = {}) {
  const { diagnosis = 'CRPS', priorTherapy = 'failed-3-lines', liverFunction = 'normal', cardiac = 'cleared', psychiatricHistory = 'none' } = input;
  let indication;
  if (diagnosis !== 'CRPS' && diagnosis !== 'chronic-neuropathic' && diagnosis !== 'depression') indication = 'limited-evidence-not-recommended';
  else if (psychiatricHistory === 'active-psychosis') indication = 'contraindicated-psychiatric-history';
  else if (priorTherapy === 'failed-3-lines') indication = 'IV-ketamine-4h-protocol';
  else if (priorTherapy === 'failed-1-line') indication = 'continue-other-lines-before-ketamine';
  else if (cardiac === 'restricted') indication = 'cardiac-clearance-needed-first';
  else if (liverFunction !== 'normal') indication = 'hepatic-dose-adjustment';
  else indication = 'IV-ketamine-considered';
  return { indication, recommendation: indication === 'IV-ketamine-4h-protocol' ? 'anesthesia-supervised-4h-infusion' : 'individualized-MDT' };
};

// 9) Overdose risk score — opioid
Engine.OverdoseRiskScore = function (input = {}) {
  const { opioidDose = 0, benzodiazepine = false, substanceUse = 'none', mentalHealth = 'stable', recentHospitalization = false } = input;
  let score = 0;
  if (opioidDose >= 100) score += 2; else if (opioidDose >= 50) score += 1;
  if (benzodiazepine) score += 2;
  if (substanceUse === 'active') score += 2; else if (substanceUse === 'remission') score += 1;
  if (mentalHealth === 'unstable') score += 2;
  if (recentHospitalization) score += 1;
  let risk;
  if (score >= 6) risk = 'very-high-overdose-risk';
  else if (score >= 4) risk = 'high-overdose-risk';
  else if (score >= 2) risk = 'moderate-overdose-risk';
  else risk = 'low-overdose-risk';
  return { score, risk, recommendation: risk === 'very-high-overdose-risk' ? 'naloxone-mandate-buprenorphine-switch' : (risk === 'high-overdose-risk' ? 'naloxone-prescribe-tight-monitoring' : 'standard-monitoring') };
};

// 10) Chronic pain impact — PROMIS
Engine.ChronicPainImpactPROMIS = function (input = {}) {
  const { painInterference = 50, physicalFunction = 50, anxiety = 50, depression = 50, sleepDisturbance = 50 } = input;
  const impactScore = (painInterference * 0.4) + ((100 - physicalFunction) * 0.3) + (anxiety * 0.1) + (depression * 0.1) + (sleepDisturbance * 0.1);
  let impact;
  if (impactScore >= 70) impact = 'high-impact-chronic-pain';
  else if (impactScore >= 50) impact = 'moderate-impact-chronic-pain';
  else if (impactScore >= 30) impact = 'low-impact-chronic-pain';
  else impact = 'minimal-impact';
  return { impactScore: Math.round(impactScore * 10) / 10, impact, recommendation: impact === 'high-impact-chronic-pain' ? 'multidisciplinary-pain-clinic-referral' : 'continue-primary-care-monitoring' };
};
