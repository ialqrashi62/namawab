// P3-AN: Chaplaincy Engine — 10 pure functions
const Engine = {};

Engine.SpiritualAssessment = function ({ faithTradition = 'unspecified', religiousPractice = 'moderate', spiritualDistress = false, community = 'engaged' } = {}) {
  let assessment;
  if (spiritualDistress && community === 'isolated') assessment = 'high-spiritual-distress-urgent-pastoral';
  else if (spiritualDistress) assessment = 'moderate-spiritual-distress-pastoral-support';
  else if (religiousPractice === 'high' && faithTradition !== 'unspecified') assessment = 'well-supported-by-faith';
  else if (community === 'engaged') assessment = 'community-supported';
  else assessment = 'low-spiritual-distress-routine';
  return { assessment, recommendation: assessment.includes('urgent') ? 'urgent-chaplain-referral' : 'supportive-pastoral-care' };
};

Engine.ReligiousAccommodation = function ({ accommodationRequested = 'prayer-space', patientCapacity = true, religionAffected = 'muslim', hospitalCapability = 'available' } = {}) {
  let pathway;
  if (accommodationRequested === 'prayer-space' && hospitalCapability === 'available') pathway = 'prayer-room-available';
  else if (accommodationRequested === 'dietary' && hospitalCapability === 'available') pathway = 'halal-kosher-veg-meal';
  else if (accommodationRequested === 'sabbath-observance' && hospitalCapability === 'available') pathway = 'shabbat-room-electronics-off';
  else if (accommodationRequested === 'modesty-gender-concordance' && hospitalCapability === 'available') pathway = 'gender-concordant-provider-when-possible';
  else if (hospitalCapability === 'unavailable') pathway = 'unable-to-accommodate-document-and-explain';
  else pathway = 'reasonable-accommodation-made';
  return { pathway, recommendation: pathway.includes('unable') ? 'ethics-and-risk-review' : 'document-and-accommodate' };
};

Engine.GriefBereavementStage = function ({ stage = 'denial', daysSinceLoss = 0, supportAvailable = true } = {}) {
  let stage_classification;
  const validStages = ['denial', 'anger', 'bargaining', 'depression', 'acceptance'];
  if (validStages.includes(stage)) {
    if (stage === 'acceptance' && daysSinceLoss >= 90) stage_classification = 'healthy-grief-trajectory';
    else if (daysSinceLoss < 30 && ['denial', 'anger', 'bargaining'].includes(stage)) stage_classification = 'normal-acute-grief';
    else if (daysSinceLoss > 180 && ['denial', 'anger', 'depression'].includes(stage)) stage_classification = 'prolonged-grief-disorder';
    else if (stage === 'depression' && daysSinceLoss > 60) stage_classification = 'complicated-grief';
    else stage_classification = 'normal-grief-progression';
  } else {
    stage_classification = 'unspecified';
  }
  return { stageClassification: stage_classification, recommendation: stage_classification.includes('prolonged') || stage_classification.includes('complicated') ? 'refer-bereavement-counselor' : 'supportive-pastoral-care' };
};

Engine.PrayerRitualSupport = function ({ ritualRequested = 'prayer', patientConscious = true, familyPresent = false, timeAvailable = 10 } = {}) {
  let support;
  if (!patientConscious) support = 'unable-ritual-when-conscious-skip';
  else if (ritualRequested === 'anointing-sick' && timeAvailable >= 15) support = 'anointing-of-sick-available';
  else if (ritualRequested === 'communion' && timeAvailable >= 10) support = 'communion-eucharistic-ministry';
  else if (ritualRequested === 'prayer') support = 'prayer-5min-routine';
  else if (ritualRequested === 'baptism-emergency') support = 'emergency-baptism-by-any-baptized-christian';
  else if (ritualRequested === 'confession') support = 'priest-chaplain-confession';
  else if (ritualRequested === 'last-rites') support = 'last-rites-sacrament-available';
  else support = 'unspecified-ritual-contact-chaplain';
  return { support, familyInvolvement: familyPresent, recommendation: 'chaplain-visit' };
};

Engine.FaithCommunityLiaison = function ({ liaisonRequested = false, religionAffected = 'unspecified', familyContact = 'present' } = {}) {
  let action;
  if (liaisonRequested && familyContact === 'present') action = 'contact-family-faith-leader';
  else if (liaisonRequested && familyContact === 'absent') action = 'patient-consent-for-liaison';
  else if (religionAffected !== 'unspecified' && familyContact === 'present') action = 'family-may-invite-own-leader';
  else action = 'chaplain-as-interim-faith-leader';
  return { action, recommendation: 'document-preference-and-contact' };
};

Engine.MedicalMoralObjection = function ({ providerObjection = 'none', procedure = 'standard', patientInformed = true, alternativeProvider = true } = {}) {
  let pathway;
  if (providerObjection === 'none') pathway = 'proceed-no-objection';
  else if (providerObjection === 'conscience' && alternativeProvider) pathway = 'transfer-care-to-colleague';
  else if (providerObjection === 'conscience' && !alternativeProvider) pathway = 'institutional-ethics-review';
  else if (providerObjection === 'religious' && alternativeProvider) pathway = 'transfer-care-and-document';
  else if (providerObjection === 'religious' && !alternativeProvider) pathway = 'institutional-review-of-mandate';
  else if (providerObjection === 'futility' && patientInformed) pathway = 'second-opinion-and-discussion';
  else pathway = 'standard-care-no-objection';
  return { pathway, recommendation: pathway.includes('transfer') ? 'transfer-and-document' : 'proceed-or-review' };
};

Engine.SpiritualDistressScale = function ({ meaninglessness = 1, despair = 1, angerAtGod = 1, isolation = 1 } = {}) {
  const total = meaninglessness + despair + angerAtGod + isolation;
  let severity;
  if (total >= 16) severity = 'severe-spiritual-distress-existential-crisis';
  else if (total >= 12) severity = 'moderate-spiritual-distress-urgent-pastoral';
  else if (total >= 8) severity = 'mild-spiritual-distress-supportive';
  else if (total >= 4) severity = 'minimal-distress-monitor';
  else severity = 'no-spiritual-distress';
  return { total, severity, recommendation: severity.includes('urgent') || severity.includes('severe') ? 'urgent-chaplain-and-mental-health' : 'supportive-pastoral-care' };
};

Engine.BereavementFollowup = function ({ daysSinceLoss = 0, familyEngagement = 'engaged', complicatedGrief = false } = {}) {
  let pathway;
  if (daysSinceLoss < 7) pathway = 'acute-condolence-call';
  else if (daysSinceLoss < 30) pathway = 'sympathy-card-and-call';
  else if (daysSinceLoss < 90) pathway = 'bereavement-followup-1-month';
  else if (daysSinceLoss < 365) pathway = 'memorial-event-invitation';
  else pathway = 'annual-memorial';
  if (complicatedGrief) pathway += '-and-counselor-referral';
  return { pathway, recommendation: 'pastoral-followup' };
};

Engine.CulturalCompetency = function ({ patientCulture = 'unspecified', language = 'arabic', interpreterAvailable = true, dietary = 'halal', modesty = 'required' } = {}) {
  let competency;
  if (language === 'arabic' && interpreterAvailable) competency = 'language-concordant';
  else if (language !== 'arabic' && interpreterAvailable) competency = 'interpreter-services-active';
  else if (language !== 'arabic' && !interpreterAvailable) competency = 'language-barrier-must-engage-interpreter';
  else competency = 'language-concordant';
  const culturalFactors = (dietary !== 'standard' ? 1 : 0) + (modesty !== 'standard' ? 1 : 0);
  return { competency, culturalFactors, recommendation: culturalFactors > 0 ? 'cultural-care-plan-documented' : 'standard-care' };
};

Engine.SacredSpaceProvision = function ({ spaceRequested = false, religion = 'unspecified', roomType = 'private', available = true } = {}) {
  let provision;
  if (!spaceRequested) provision = 'no-space-requested';
  else if (!available) provision = 'no-space-available-creative-solution-bedside';
  else if (roomType === 'private') provision = 'private-room-sacred-space-provided';
  else if (roomType === 'semi-private') provision = 'semi-private-curtain-area';
  else if (roomType === 'shared') provision = 'shared-curtain-area-minimal-space';
  else provision = 'chapel-available-on-floor';
  return { provision, recommendation: provision.includes('no-space-available') ? 'bedside-spiritual-care' : 'sacred-space-granted' };
};

module.exports = Engine;
