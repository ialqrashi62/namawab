// P3-AO: Hospice Engine — 10 pure functions
const Engine = {};

Engine.HospiceEligibility = function ({ prognosis = 6, functionalDecline = true, weightLoss = false, edVisits = 0, hospitalization = false, lifeLimiting = 'cancer' } = {}) {
  let eligibility;
  if (prognosis <= 6 && (lifeLimiting === 'cancer' || lifeLimiting === 'CHF' || lifeLimiting === 'COPD')) eligibility = 'eligible-hospice-referral';
  else if (prognosis <= 12 && functionalDecline) eligibility = 'eligible-hospice-by-decline';
  else if (prognosis <= 6 && weightLoss) eligibility = 'eligible-hospice-by-cachexia';
  else if (prognosis <= 12 && (edVisits >= 2 || hospitalization)) eligibility = 'eligible-hospice-by-utilization';
  else eligibility = 'not-eligible-continue-palliative';
  return { eligibility, prognosis, recommendation: eligibility.includes('eligible') ? 'hospice-referral-and-discussion' : 'continue-palliative-care' };
};

Engine.ContinuousHomeCare = function ({ symptom = 'pain', crisisType = 'acute', caregiverAvailable = true, familyCapable = false, equipment = 'standard' } = {}) {
  let pathway;
  if (crisisType === 'acute' && familyCapable) pathway = 'continuous-home-care-8-24h-nursing';
  else if (crisisType === 'acute' && !familyCapable && caregiverAvailable) pathway = 'continuous-home-care-extended';
  else if (crisisType === 'acute' && !caregiverAvailable) pathway = 'general-inpatient-hospice-GIP';
  else if (crisisType === 'chronic' && symptom === 'dyspnea') pathway = 'respite-care-or-GIP';
  else if (crisisType === 'chronic' && symptom === 'pain') pathway = 'pain-pump-and-nursing-support';
  else pathway = 'routine-home-care-with-visits';
  return { pathway, recommendation: pathway.includes('GIP') ? 'transfer-to-inpatient-hospice' : 'home-based-hospice' };
};

Engine.LevinePhaseModel = function ({ phase = 'stable', days = 14, decline = false } = {}) {
  let model;
  if (phase === 'stable') model = 'stable-home-based-visit-as-needed';
  else if (phase === 'transition') model = 'transition-increased-visits-and-educate-family';
  else if (phase === 'declining') model = 'declining-daily-visits-and-comfort-focus';
  else if (phase === 'dying') model = 'dying-24h-nursing-and-bereavement-prep';
  else if (phase === 'bereaved') model = 'bereaved-followup-13-months';
  else model = 'unspecified-evaluate';
  return { phase: model, recommendation: phase === 'dying' ? '24h-presence-and-family-support' : 'phase-appropriate-care' };
};

Engine.BereavementCare13Month = function ({ monthsSinceLoss = 0, familyEngaged = true, complicatedGrief = false } = {}) {
  let pathway;
  if (monthsSinceLoss < 1) pathway = 'immediate-bereavement-contact';
  else if (monthsSinceLoss < 3) pathway = 'monthly-bereavement-contact';
  else if (monthsSinceLoss < 6) pathway = 'quarterly-bereavement-contact';
  else if (monthsSinceLoss < 12) pathway = 'memorial-event-and-as-needed';
  else if (monthsSinceLoss < 13) pathway = '13-month-closure-letter';
  else pathway = 'bereavement-closed';
  if (complicatedGrief) pathway += '-and-counselor';
  return { pathway, recommendation: 'supportive-bereavement-program' };
};

Engine.SymptomCrisisAssessment = function ({ pain = 1, dyspnea = 1, agitation = 1, seizures = false, bleeding = false, hoursOnset = 1 } = {}) {
  const total = pain + dyspnea + agitation;
  let pathway;
  if (seizures || bleeding) pathway = 'emergent-crisis-911-or-GIP-transfer';
  else if (total >= 6) pathway = 'urgent-crisis-stabilization-immediate-nurse-visit';
  else if (total >= 4) pathway = 'urgent-crisis-4h-response';
  else if (total >= 2) pathway = 'moderate-24h-response';
  else pathway = 'routine-supportive';
  return { pathway, total, recommendation: pathway.includes('emergent') ? 'call-911' : 'rapid-response-nurse' };
};

Engine.LevelsOfCare = function ({ careLevel = 'routine', symptoms = 'controlled', caregiverBurden = 'low' } = {}) {
  let level;
  if (symptoms === 'uncontrolled' && caregiverBurden === 'high') level = 'general-inpatient-hospice-GIP';
  else if (symptoms === 'uncontrolled' && caregiverBurden === 'low') level = 'continuous-home-care-CHC-8-24h';
  else if (caregiverBurden === 'high' && symptoms === 'controlled') level = 'respite-care-5-days';
  else if (caregiverBurden === 'low' && symptoms === 'controlled') level = 'routine-home-care-RHC';
  else level = careLevel;
  return { level, recommendation: 'level-appropriate-and-monitor' };
};

Engine.VoluntaryStoppingEating = function ({ conscious = true, days = 0, hydration = 'oral', palliativeCareInvolved = true } = {}) {
  let pathway;
  if (!conscious) pathway = 'unable-to-assess-comfort-care-only';
  else if (days < 3) pathway = 'early-phase-monitor-comfort';
  else if (days < 7) pathway = 'mid-phase-oral-care-and-family-support';
  else if (days < 14) pathway = 'late-phase-actively-dying-comfort';
  else pathway = 'prolonged-evaluate-cause';
  return { pathway, recommendation: palliativeCareInvolved ? 'continue-palliative-comfort' : 'palliative-consult' };
};

Engine.PrognosticIndicator = function ({ PPS = 50, albumin = 2.5, edema = false, delirium = false, daysHospitalized = 0 } = {}) {
  let prognosis;
  let score = 0;
  if (PPS < 50) score += 3;
  if (PPS < 30) score += 2;
  if (albumin < 2.5) score += 2;
  if (edema) score += 1;
  if (delirium) score += 2;
  if (daysHospitalized > 14) score += 1;
  if (score >= 8) prognosis = 'days-1-7';
  else if (score >= 6) prognosis = 'days-7-14';
  else if (score >= 4) prognosis = 'weeks-1-4';
  else if (score >= 2) prognosis = 'months-1-6';
  else prognosis = 'months-6-plus';
  return { score, prognosis, recommendation: 'convey-prognosis-to-family-honestly' };
};

Engine.HospiceMedicationKit = function ({ symptoms = ['pain', 'dyspnea', 'agitation', 'nausea', 'secreations'] } = {}) {
  const kit = [];
  if (symptoms.includes('pain')) kit.push('morphine-solution', 'morphine-suppository');
  if (symptoms.includes('dyspnea')) kit.push('morphine-solution', 'lorazepam');
  if (symptoms.includes('agitation')) kit.push('haloperidol', 'lorazepam');
  if (symptoms.includes('nausea')) kit.push('ondansetron', 'prochlorperazine');
  if (symptoms.includes('secreations')) kit.push('hyoscine', 'glycopyrrolate');
  if (symptoms.includes('fever')) kit.push('acetaminophen-suppository');
  if (symptoms.includes('seizures')) kit.push('rectal-diazepam', 'lorazepam-sublingual');
  return { kit, recommendation: 'emergency-kit-in-home-refrigerator' };
};

Engine.FamilyMeetingGoals = function ({ familyPresent = 3, conflict = false, understanding = 'partial', decisionsPending = ['code-status', 'artificial-nutrition', 'hospice-transition'] } = {}) {
  let pathway;
  if (conflict) pathway = 'family-conference-with-ethics-and-social-work';
  else if (understanding === 'limited') pathway = 'family-meeting-with-teach-back';
  else if (decisionsPending.length >= 3) pathway = 'multi-goal-meeting-with-time';
  else if (familyPresent >= 4) pathway = 'large-family-conference-facilitator';
  else pathway = 'standard-family-meeting';
  return { pathway, familyPresent, recommendation: conflict ? 'facilitated-conversation-and-ethics' : 'collaborative-decision-making' };
};

module.exports = Engine;
