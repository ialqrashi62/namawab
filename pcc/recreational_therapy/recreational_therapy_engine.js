// P3-AX: Recreational-Therapy Engine — 10 pure functions
const Engine = {};

Engine.RTAssessment = function ({ age = 30, diagnosis = 'spinal-cord-injury', leisureHistory = 'active', goals = 'community-reintegration' } = {}) {
  let plan;
  if (leisureHistory === 'active' && goals === 'community-reintegration') plan = 'community-reintegration-and-leisure-re-education';
  else if (leisureHistory === 'sedentary' && goals === 'wellness') plan = 'leisure-awareness-and-intro-to-active-leisure';
  else if (goals === 'mood') plan = 'mood-enhancing-leisure-and-pleasure-activation';
  else if (goals === 'social') plan = 'social-leisure-and-group-recreation';
  else plan = 'comprehensive-leisure-assessment-and-plan';
  return { plan, recommendation: `RT-for-${diagnosis}-${goals}` };
};

Engine.LeisureBarriers = function ({ physical = 'wheelchair', cognitive = 'none', social = 'limited-support', financial = 'moderate' } = {}) {
  let barriers = [];
  if (physical === 'wheelchair' || physical === 'limited') barriers.push('physical-access-environment');
  if (cognitive === 'mild-impairment') barriers.push('cognitive-task-oversight');
  if (social === 'limited-support') barriers.push('social-isolation-and-caregiver-engagement');
  if (financial === 'moderate' || financial === 'low') barriers.push('financial-assistance-and-adapted-equipment');
  let priority;
  if (barriers.length >= 3) priority = 'comprehensive-barriers-multi-disciplinary';
  else if (barriers.length >= 1) priority = 'targeted-barrier-resolution';
  else priority = 'no-major-barriers-monitor';
  return { barriers, priority, recommendation: `${priority}-${barriers.length}-barriers` };
};

Engine.CommunityReintegration = function ({ dischargeLevel = 'home', leisurePref = 'sports', family = 'supportive', accessibility = 'partial' } = {}) {
  let plan;
  if (dischargeLevel === 'home' && accessibility === 'partial') plan = 'home-leisure-modifications-and-adapted-equipment';
  else if (dischargeLevel === 'home' && family === 'supportive') plan = 'community-leisure-with-family-support';
  else if (dischargeLevel === 'group-home') plan = 'group-leisure-and-day-program-referral';
  else if (leisurePref === 'sports') plan = 'adapted-sports-and-Wheelchair-sports-intro';
  else if (leisurePref === 'arts') plan = 'community-arts-classes-and-adapted-art';
  else plan = 'community-recreation-center-orientation';
  return { plan, recommendation: `${plan}-30-to-90-days-post-discharge` };
};

Engine.AdaptedSports = function ({ sport = 'basketball', mobility = 'wheelchair', level = 'recreational', assistiveTech = 'sport-wheelchair' } = {}) {
  let plan;
  if (mobility === 'wheelchair' && sport === 'basketball') plan = 'wheelchair-basketball-league-or-intro';
  else if (sport === 'swimming' && level === 'recreational') plan = 'aquatic-therapy-and-adapted-swim-program';
  else if (sport === 'cycling' && assistiveTech === 'handcycle') plan = 'handcycling-or-adapted-cycling';
  else if (sport === 'tennis') plan = 'wheelchair-tennis-or-standing-tennis';
  else if (mobility === 'amputee' && sport === 'running') plan = 'running-club-and-prosthetic-run-coaching';
  else plan = 'general-adapted-sports-intro-clinic';
  return { plan, recommendation: `${plan}-2-to-3-times-per-week` };
};

Engine.RTPediatric = function ({ age = 8, indication = 'developmental-delay', setting = 'outpatient', familyEngagement = 'high' } = {}) {
  let plan;
  if (age < 3) plan = 'parent-child-recreation-and-play';
  else if (age < 6 && indication === 'developmental-delay') plan = 'structured-play-and-skill-building';
  else if (age < 12 && setting === 'school') plan = 'school-recreation-and-adapted-PE';
  else if (age < 18 && familyEngagement === 'high') plan = 'family-recreation-and-leisure-counseling';
  else if (indication === 'medical-procedural') plan = 'medical-play-and-coping-recreation';
  else plan = 'standard-pediatric-RT';
  return { plan, recommendation: `${plan}-weekly` };
};

Engine.RTGeriatric = function ({ age = 78, cognition = 'mild-impairment', funcStatus = 'community-ambulator', engagement = 'willing' } = {}) {
  let plan;
  if (cognition === 'mild-impairment' && engagement === 'willing') plan = 'reminiscence-and-life-review-recreation';
  else if (cognition === 'severe-impairment') plan = 'sensory-stimulation-and-familiar-recreation';
  else if (funcStatus === 'community-ambulator' && engagement === 'willing') plan = 'community-senior-center-and-group-activities';
  else if (engagement === 'reluctant') plan = 'brief-and-non-demanding-recreation-offer';
  else if (funcStatus === 'institutional') plan = 'in-room-recreation-and-favorite-activities';
  else plan = 'standard-geriatric-RT';
  return { plan, recommendation: 'group-or-individual-format' };
};

Engine.RTDosing = function ({ sessionsPerWeek = 3, minutesPerSession = 60, weeks = 12 } = {}) {
  const totalHours = (sessionsPerWeek * minutesPerSession * weeks) / 60;
  let intensity;
  if (totalHours >= 36) intensity = 'intensive-RT';
  else if (totalHours >= 18) intensity = 'standard-RT';
  else if (totalHours >= 6) intensity = 'maintenance-RT';
  else intensity = 'supportive-RT';
  return { totalHours, intensity, recommendation: `${intensity}-${weeks}-weeks` };
};

Engine.RTInpatient = function ({ setting = 'rehab', mobility = 'wheelchair', acuity = 'subacute', goal = 'community' } = {}) {
  let plan;
  if (setting === 'rehab' && acuity === 'subacute' && goal === 'community') plan = 'community-outing-rehearsal-and-leisure-trials';
  else if (setting === 'rehab' && goal === 'leisure') plan = 'in-room-leisure-and-cooking-recreation';
  else if (setting === 'LTACH' && goal === 'comfort') plan = 'in-room-favorite-recreation-and-family-visits';
  else if (setting === 'psych' && goal === 'mood') plan = 'group-recreation-and-leisure-counseling';
  else if (setting === 'burn') plan = 'scar-management-recreation-and-body-image-leisure';
  else plan = 'standard-inpatient-RT';
  return { plan, recommendation: `${plan}-5-to-7-days-per-week` };
};

Engine.RTWellness = function ({ stressLevel = 'high', burnout = 'moderate', physicalActivity = 'sedentary', socialIsolation = 'moderate' } = {}) {
  let plan;
  if (burnout === 'severe' && stressLevel === 'high') plan = 'nature-based-recreation-and-mindfulness-walk';
  else if (physicalActivity === 'sedentary') plan = 'gentle-yoga-or-tai-chi-group';
  else if (socialIsolation === 'severe') plan = 'group-recreation-and-club-referral';
  else if (burnout === 'moderate') plan = 'creative-leisure-and-pleasure-activation';
  else plan = 'wellness-recreation-and-balance-coaching';
  return { plan, recommendation: 'weekly-or-biweekly-routine' };
};

Engine.RTDischarge = function ({ planComplete = true, familyTrained = true, communityRef = 'made', equipment = 'obtained', followup = 'scheduled' } = {}) {
  let readiness;
  if (planComplete && familyTrained && communityRef === 'made' && followup === 'scheduled') readiness = 'ready-for-discharge-leisure-plan-intact';
  else if (!communityRef) readiness = 'pending-community-recreation-referral';
  else if (!familyTrained) readiness = 'pending-family-caregiver-training';
  else if (!equipment) readiness = 'pending-adapted-equipment-procurement';
  else if (followup !== 'scheduled') readiness = 'pending-outpatient-RT-followup';
  else readiness = 'partial-discharge-plan-monitor';
  return { readiness, recommendation: readiness.includes('ready') ? 'discharge-with-followup' : 'complete-pending-items-before-discharge' };
};

module.exports = Engine;
