// P3-AN: Aerodigestive Engine — 10 pure functions
const Engine = {};

Engine.DysphagiaSeverity = function ({ dietLevel = 'puree', aspirationRisk = 'moderate', swallowStudy = 'modified-barium' } = {}) {
  let severity;
  if (aspirationRisk === 'severe') severity = 'severe-dysphagia-NPO';
  else if (aspirationRisk === 'high' || dietLevel === 'NPO') severity = 'high-risk-aspiration-NPO-consider-tube';
  else if (dietLevel === 'puree' && aspirationRisk === 'moderate') severity = 'moderate-pureed-only';
  else if (dietLevel === 'soft' && aspirationRisk === 'low') severity = 'mild-soft-diet';
  else if (dietLevel === 'regular') severity = 'regular-diet-no-restriction';
  else severity = 'moderate-monitoring';
  return { severity, recommendation: severity.includes('NPO') ? 'swallow-study-and-tube-feeding-eval' : 'upgrade-as-tolerated' };
};

Engine.AspirationPneumoniaRisk = function ({ dysphagia = false, gerd = false, tubeFeeding = false, alteredConsciousness = false, age = 65 } = {}) {
  let risk;
  let score = 0;
  if (dysphagia) score += 3;
  if (gerd) score += 2;
  if (tubeFeeding) score += 1;
  if (alteredConsciousness) score += 3;
  if (age >= 80) score += 2;
  else if (age >= 65) score += 1;
  if (score >= 6) risk = 'very-high-risk-aspiration-precaution';
  else if (score >= 4) risk = 'high-risk-precaution';
  else if (score >= 2) risk = 'moderate-risk-monitor';
  else risk = 'low-risk';
  return { score, risk, recommendation: risk.includes('high') ? 'elevate-head-of-bed-30-degrees-oral-care' : 'standard-precautions' };
};

Engine.AirwayCompromiseAssessment = function ({ stridor = false, dysphonia = false, dysphagia = 'mild', vocalCordMobility = 'normal', tumorSize = 0 } = {}) {
  let severity;
  if (stridor && tumorSize > 2) severity = 'severe-airway-emergent-tracheostomy-consideration';
  else if (stridor) severity = 'moderate-stridor-flexible-bronchoscopy';
  else if (dysphonia && vocalCordMobility === 'paralyzed') severity = 'vocal-cord-palsy-airway-watch';
  else if (tumorSize > 3) severity = 'mass-effect-impending-airway-loss';
  else if (tumorSize > 1) severity = 'moderate-mass-monitoring';
  else severity = 'no-immediate-airway-compromise';
  return { severity, recommendation: severity.includes('emergent') ? 'emergent-airway-MDT' : severity.includes('moderate') ? 'urgent-MDT-airway-clinic' : 'routine-followup' };
};

Engine.ENTCancerStaging = function ({ tumorSite = 'larynx', tStage = 'T1', nStage = 'N0', mStage = 'M0' } = {}) {
  const tNum = parseInt(tStage.replace('T', '')) || 0;
  const nNum = parseInt(nStage.replace('N', '')) || 0;
  const mPresent = mStage === 'M1';
  const stage = tNum + nNum * 0.1 + (mPresent ? 10 : 0);
  let stageGroup;
  if (mPresent) stageGroup = 'Stage-IV-M1-metastatic';
  else if (tNum >= 4 || nNum >= 3) stageGroup = 'Stage-IV-advanced-local';
  else if (tNum === 3 || nNum === 2) stageGroup = 'Stage-III-locally-advanced';
  else if (tNum === 2 || nNum === 1) stageGroup = 'Stage-II-moderate';
  else if (tNum === 1) stageGroup = 'Stage-I-early';
  else stageGroup = 'Stage-0-carcinoma-in-situ';
  return { stageGroup, site: tumorSite, recommendation: stageGroup.includes('IV') ? 'MDT-concurrent-chemoradiation' : 'MDT-discussion-single-modality' };
};

Engine.FeedingTubeDecision = function ({ dysphagiaSeverity = 'moderate', nutritionStatus = 'adequate', aspirationRisk = 'low', expectedRecovery = 'weeks' } = {}) {
  let decision;
  if (aspirationRisk === 'severe' && nutritionStatus === 'malnourished') decision = 'urgent-PEG-or-NGT';
  else if (dysphagiaSeverity === 'severe' && expectedRecovery === 'months') decision = 'PEG-recommended';
  else if (dysphagiaSeverity === 'severe' && expectedRecovery === 'weeks') decision = 'NGT-bridge-recovery';
  else if (nutritionStatus === 'malnourished' && expectedRecovery === 'weeks') decision = 'NGT-supplementation';
  else if (nutritionStatus === 'adequate') decision = 'oral-nutrition-acceptable';
  else decision = 'monitor-and-reassess-weekly';
  return { decision, recommendation: decision.includes('PEG') || decision.includes('NGT') ? 'tube-feeding-protocol' : 'oral-feeds-with-monitoring' };
};

Engine.GERDComplication = function ({ esophagitis = 'none', barretts = false, stricture = false, bleeding = false, symptoms = 'mild' } = {}) {
  let complication;
  if (bleeding && esophagitis === 'severe') complication = 'bleeding-esophagitis-emergent-endoscopy';
  else if (barretts && dysplasia === 'high') complication = 'high-grade-dysplasia-EMR-or-esophagectomy';
  else if (barretts) complication = 'barretts-surveillance-endoscopy';
  else if (stricture) complication = 'peptic-stricture-dilation';
  else if (esophagitis === 'severe') complication = 'severe-esophagitis-PPI-and-repeat';
  else if (esophagitis === 'moderate') complication = 'moderate-esophagitis-PPI-optimization';
  else if (symptoms === 'moderate') complication = 'symptomatic-GERD-PPI-trial';
  else complication = 'mild-GERD-lifestyle-and-PRN-PPI';
  return { complication, recommendation: complication.includes('emergent') ? 'urgent-endoscopy' : 'outpatient-GI-followup' };
};

Engine.VoiceTherapyPlan = function ({ diagnosis = 'nodules', severity = 'mild', voiceUse = 'normal' } = {}) {
  let plan;
  if (diagnosis === 'paralysis' && severity === 'severe') plan = 'unilateral-paralysis-injection-or-medialization';
  else if (diagnosis === 'paralysis') plan = 'vocal-fold-paralysis-voice-therapy-then-surgery-if-needed';
  else if (diagnosis === 'nodules' && voiceUse === 'professional') plan = 'voice-therapy-8-weeks-reassess';
  else if (diagnosis === 'nodules') plan = 'voice-therapy-4-weeks';
  else if (diagnosis === 'polyps') plan = 'phonomicrosurgery-consider';
  else if (diagnosis === 'laryngitis') plan = 'voice-rest-2-weeks-and-PPI-if-LPR';
  else if (diagnosis === 'spasmodic-dysphonia') plan = 'botulinum-toxin-injection';
  else plan = 'voice-therapy-referral';
  return { plan, recommendation: plan.includes('surgery') || plan.includes('injection') ? 'surgical-consult' : 'voice-therapy' };
};

Engine.EsophagealManometry = function ({ motilityPattern = 'normal', lesPressure = 15, peristalsis = 'normal' } = {}) {
  let diagnosis;
  if (motilityPattern === 'aperistalsis' && lesPressure > 15) diagnosis = 'achalasia-type-II';
  else if (motilityPattern === 'aperistalsis' && lesPressure < 15) diagnosis = 'esophagogastric-outflow-obstruction';
  else if (motilityPattern === 'jackhammer') diagnosis = 'jackhammer-esophagus';
  else if (motilityPattern === 'distal-spasm') diagnosis = 'distal-esophageal-spasm';
  else if (motilityPattern === 'ineffective') diagnosis = 'ineffective-esophageal-motility';
  else if (motilityPattern === 'normal' && peristalsis === 'normal') diagnosis = 'normal-manometry';
  else diagnosis = 'non-specific-motility-disorder';
  return { diagnosis, recommendation: diagnosis === 'achalasia-type-II' ? 'achalasia-treatment-POEM-or-pneumatic-dilation' : 'symptomatic-management' };
};

Engine.AerodigestiveClinicMDT = function ({ ent = true, gi = true, pulmonology = false, speech = true, nutrition = true, complex = false } = {}) {
  const teamSize = (ent ? 1 : 0) + (gi ? 1 : 0) + (pulmonology ? 1 : 0) + (speech ? 1 : 0) + (nutrition ? 1 : 0);
  let mdt;
  if (teamSize >= 4 && complex) mdt = 'full-aerodigestive-MDT-comprehensive';
  else if (teamSize >= 3 && complex) mdt = 'core-MDT-with-extenders';
  else if (teamSize >= 3) mdt = 'standard-MDT';
  else if (teamSize >= 2) mdt = 'limited-MDT-coordinated-care';
  else mdt = 'single-specialty-care';
  return { mdt, teamSize, recommendation: mdt.includes('comprehensive') ? 'aerodigestive-clinic-referral' : 'coordinate-with-existing-specialists' };
};

Engine.PediatricAerodigestive = function ({ age = 5, primaryIssue = 'aspiration', chronicity = 'acute' } = {}) {
  let pathway;
  if (age < 1 && primaryIssue === 'aspiration') pathway = 'infant-aspiration-workup-SLP-and-GI';
  else if (age < 3 && primaryIssue === 'aspiration') pathway = 'pediatric-aspiration-MDT-SLP-GI-pulm';
  else if (age < 12 && primaryIssue === 'dysphagia') pathway = 'pediatric-dysphagia-MDT';
  else if (primaryIssue === 'chronic-aspiration' && chronicity === 'chronic') pathway = 'chronic-aspiration-fundoplication-consider';
  else if (primaryIssue === 'stridor') pathway = 'stridor-workup-bronchoscopy-and-swallow-study';
  else if (primaryIssue === 'feeding-aversio') pathway = 'feeding-therapy-OT-SLP';
  else pathway = 'pediatric-aerodigestive-MDT';
  return { pathway, recommendation: pathway.includes('MDT') ? 'aerodigestive-clinic' : 'subspecialty-referral' };
};

module.exports = Engine;
