// P3-AN: Bioethics Engine — 10 pure functions
const Engine = {};

Engine.CapacityAssessment = function ({ understanding = 5, appreciation = 5, reasoning = 5, expressingChoice = 5 } = {}) {
  const score = (understanding + appreciation + reasoning + expressingChoice) / 4;
  let capacity;
  if (score >= 4) capacity = 'full-capacity';
  else if (score >= 3) capacity = 'partial-capacity-supported-decision';
  else if (score >= 2) capacity = 'limited-capacity-surrogate-needed';
  else capacity = 'no-capacity-emergency-surrogate';
  return { score, capacity, recommendation: capacity === 'full-capacity' ? 'obtain-informed-consent' : (capacity === 'no-capacity-emergency-surrogate' ? 'activate-surrogate-implied-consent' : 'supported-decision-making-engage') };
};

Engine.DNRStatusReview = function ({ dnr = false, dni = false, codeStatus = 'full-code', polstForm = false } = {}) {
  let classification;
  if (codeStatus === 'comfort-care') classification = 'comfort-care-hospice';
  else if (codeStatus === 'dni-only') classification = 'dni-but-full-acl';
  else if (codeStatus === 'dnr-only') classification = 'dnr-but-intubate-ok';
  else if (codeStatus === 'no-cpr-no-intubation') classification = 'no-cpr-no-intubation';
  else if (codeStatus === 'limited') classification = 'limited-trial-of-therapy';
  else classification = 'full-code';
  const valid = polstForm || (codeStatus !== 'full-code' && (dnr || dni));
  return { classification, polstValid: valid, recommendation: valid ? 'honor-orders' : 're-discuss-and-document' };
};

Engine.WithdrawalOfCare = function ({ lifeSustainingTherapy = 'vasopressors', familyAgreement = true, ethicsConsult = false, daysSinceDiscussion = 1 } = {}) {
  let pathway;
  if (!familyAgreement) pathway = 'disagreement-ethics-committee';
  else if (!ethicsConsult && daysSinceDiscussion < 7) pathway = 'premature-recommend-ethics-consult';
  else if (lifeSustainingTherapy === 'vasopressors' && familyAgreement) pathway = 'withdrawal-vasopressors-comfort';
  else if (lifeSustainingTherapy === 'mechanical-ventilation' && familyAgreement) pathway = 'terminal-extubation-protocol';
  else if (lifeSustainingTherapy === 'renal-replacement' && familyAgreement) pathway = 'withdrawal-dialysis-comfort';
  else pathway = 'withdrawal-of-care-comfort-focused';
  return { pathway, recommendation: pathway.includes('disagreement') ? 'urgent-ethics-committee' : 'palliative-comfort-protocol' };
};

Engine.SurrogateDecisionMaker = function ({ hierarchyPreference = 'spouse', patientLacksCapacity = true, surrogateAvailable = true, conflictOfInterest = false } = {}) {
  let order;
  if (hierarchyPreference === 'court-appointed') order = 'court-appointed-guardian';
  else if (hierarchyPreference === 'healthcare-proxy') order = 'healthcare-proxy-durable-power';
  else if (hierarchyPreference === 'spouse') order = 'spouse-default';
  else if (hierarchyPreference === 'adult-child') order = 'adult-child';
  else if (hierarchyPreference === 'parent') order = 'parent';
  else if (hierarchyPreference === 'sibling') order = 'sibling';
  else order = 'next-of-kin-statutory';
  const valid = patientLacksCapacity && surrogateAvailable && !conflictOfInterest;
  return { surrogateOrder: order, valid, recommendation: valid ? 'engage-surrogate' : 're-evaluate-hierarchy-or-court' };
};

Engine.InformedConsentValidity = function ({ patientUnderstood = true, voluntaryDecision = true, informationDisclosed = true, capacityConfirmed = true, languageBarrier = false } = {}) {
  const valid = patientUnderstood && voluntaryDecision && informationDisclosed && capacityConfirmed && !languageBarrier;
  let issues = [];
  if (!patientUnderstood) issues.push('comprehension-failure-teach-back');
  if (!voluntaryDecision) issues.push('coercion-suspected');
  if (!informationDisclosed) issues.push('incomplete-disclosure');
  if (!capacityConfirmed) issues.push('capacity-not-confirmed');
  if (languageBarrier) issues.push('language-barrier-certified-interpreter');
  return { valid, issues, recommendation: valid ? 'proceed' : 'address-issues-first' };
};

Engine.EthicsConsultation = function ({ urgency = 'routine', dilemma = 'other', multidisciplinary = true } = {}) {
  let responseTime;
  if (urgency === 'emergent') responseTime = 'immediate-1h';
  else if (urgency === 'urgent') responseTime = 'within-4h';
  else if (urgency === 'routine') responseTime = 'within-24-48h';
  else responseTime = 'within-1-week';
  let framework;
  if (dilemma === 'end-of-life') framework = 'principlism-four-box';
  else if (dilemma === 'resource-allocation') framework = 'utilitarian-fair-innings';
  else if (dilemma === 'informed-refusal') framework = 'autonomy-vs-paternalism';
  else if (dilemma === 'futility') framework = 'physician-conscience-vs-family';
  else framework = 'principlism-general';
  return { responseTime, framework, recommendation: multidisciplinary ? 'convene-ethics-committee' : 'single-consultant' };
};

Engine.AdvanceDirectiveReview = function ({ livingWill = false, healthcareProxy = false, polst = false, datedWithin5Years = true } = {}) {
  const components = (livingWill ? 1 : 0) + (healthcareProxy ? 1 : 0) + (polst ? 1 : 0);
  let completeness;
  if (components >= 3) completeness = 'complete-triple-document';
  else if (components === 2) completeness = 'partial-two-documents';
  else if (components === 1) completeness = 'single-document-incomplete';
  else completeness = 'no-advance-directive';
  const valid = datedWithin5Years && components >= 1;
  return { components, completeness, valid, recommendation: valid ? 'honor-and-document' : 're-discuss-and-update' };
};

Engine.MedicalFutilityAssessment = function ({ quantitativeFutility = false, qualitativeFutility = false, physiologicFutility = false, physicianConsensus = 0 } = {}) {
  const isFutile = quantitativeFutility || qualitativeFutility || physiologicFutility;
  const consensus = physicianConsensus >= 2;
  let pathway;
  if (quantitativeFutility && consensus) pathway = 'quantitative-futile-multidisciplinary-discussion';
  else if (qualitativeFutility && consensus) pathway = 'qualitative-futile-ethics-and-family-meeting';
  else if (physiologicFutility && consensus) pathway = 'physiologic-futile-comfort-transition';
  else if (isFutile) pathway = 'preliminary-futility-build-consensus';
  else pathway = 'not-futile-continue';
  return { isFutile, pathway, recommendation: pathway.includes('futile') ? 'transition-to-comfort-care' : 'continue-current-treatment' };
};

Engine.MinimallyConsciousState = function ({ consciousnessLevel = 'conscious', responseConsistency = 'consistent', communicationAbility = 'verbal', motorFunction = 'purposeful' } = {}) {
  let diagnosis;
  if (consciousnessLevel === 'vegetative') diagnosis = 'vegetative-state';
  else if (consciousnessLevel === 'minimally-conscious' && responseConsistency === 'inconsistent') diagnosis = 'minimally-conscious-state';
  else if (consciousnessLevel === 'locked-in') diagnosis = 'locked-in-syndrome';
  else if (consciousnessLevel === 'conscious' && communicationAbility === 'verbal') diagnosis = 'conscious-communicative';
  else diagnosis = 'disorder-of-consciousness-unspecified';
  return { diagnosis, recommendation: diagnosis === 'conscious-communicative' ? 'engage-in-shared-decision' : 'surrogate-decision-maker-and-neuro-assessment' };
};

Engine.PediatricBestInterest = function ({ childAge = 5, parentalDecision = 'consent', matureMinorDoctrine = false, harm = 'minimal' } = {}) {
  let framework;
  if (childAge >= 18) framework = 'adult-autonomy';
  else if (childAge >= 14 && matureMinorDoctrine) framework = 'mature-minor-doctrine';
  else if (childAge >= 7) framework = 'pediatric-assent-plus-parental-consent';
  else if (parentalDecision === 'refusal-of-life-saving') framework = 'court-order-consider';
  else framework = 'parental-consent-with-best-interest';
  const valid = parentalDecision === 'consent' || (parentalDecision === 'refusal-of-life-saving' && harm === 'severe');
  return { framework, valid, recommendation: valid ? 'proceed' : 'ethics-and-legal-review' };
};

module.exports = Engine;
