// P3-BA: Telerehab Engine — 10 pure functions
const Engine = {};

Engine.TelerehabEligibility = function ({ techAccess = 'high', broadband = 'yes', cognitive = 'normal', safety = 'home' } = {}) {
  let eligibility;
  if (techAccess === 'low' || broadband === 'no') eligibility = 'not-eligible-no-tech-or-broadband';
  else if (cognitive === 'severe-impairment' && techAccess !== 'high') eligibility = 'not-eligible-cognitive-and-tech';
  else if (safety === 'unsafe') eligibility = 'not-eligible-unsafe-home';
  else if (cognitive === 'mild-impairment' && techAccess === 'high') eligibility = 'eligible-with-caregiver-support';
  else if (techAccess === 'high' && broadband === 'yes' && cognitive === 'normal') eligibility = 'fully-eligible-telerehab';
  else if (techAccess === 'moderate') eligibility = 'partially-eligible-telerehab-plus-in-person';
  return { eligibility, recommendation: 'OT-or-tech-team-eligibility-eval' };
};

Engine.TelerehabModality = function ({ goal = 'PT', condition = 'TKA-post', techAccess = 'high' } = {}) {
  let modality;
  if (goal === 'PT' && techAccess === 'high' && condition === 'TKA-post') modality = 'synchronous-video-PT-and-app-exercise';
  else if (goal === 'OT') modality = 'synchronous-video-OT-and-ADL-virtual-coaching';
  else if (goal === 'SLP') modality = 'synchronous-tele-SLP-and-app-practice';
  else if (goal === 'neuropsych') modality = 'synchronous-tele-neuropsych';
  else if (techAccess === 'moderate') modality = 'audio-only-and-app-or-phone';
  else if (condition === 'low-back-pain') modality = 'telerehab-and-self-management-app';
  else modality = 'standard-telerehab-modality';
  return { modality, recommendation: `${modality}-2-to-3x-week` };
};

Engine.TelerehabSafety = function ({ location = 'home', supervision = 'none', emergency = 'phone-911', cognition = 'normal' } = {}) {
  let safety;
  if (emergency === 'none') safety = 'no-emergency-plan-not-eligible';
  else if (supervision === 'none' && cognition === 'moderate-impairment') safety = 'need-supervisor-present';
  else if (location === 'home' && cognition === 'normal' && emergency === 'phone-911') safety = 'home-safety-with-911-protocol';
  else if (supervision === 'caregiver') safety = 'with-caregiver-supervision';
  else if (location === 'community-clinic' && cognition === 'normal') safety = 'community-clinic-safety-met';
  else safety = 'safety-review-needed';
  return { safety, recommendation: 'safety-checklist-and-emergency-protocol' };
};

Engine.TelerehabExercise = function ({ type = 'aerobic', intensity = 'moderate', duration = 30, equipment = 'none' } = {}) {
  let plan;
  if (type === 'aerobic' && intensity === 'moderate' && duration >= 30) plan = 'moderate-aerobic-30-min-walking';
  else if (type === 'resistance' && equipment === 'band') plan = 'resistance-band-and-bodyweight';
  else if (type === 'resistance' && equipment === 'none') plan = 'bodyweight-resistance-and-modified';
  else if (type === 'flexibility' && duration >= 15) plan = 'flexibility-stretching-15-min';
  else if (intensity === 'low' && duration < 20) plan = 'low-intensity-short-session-progressively';
  else if (equipment === 'home-gym') plan = 'home-gym-telerehab-and-PT-monitoring';
  else plan = 'standard-home-exercise';
  return { plan, recommendation: `${plan}-3x-week` };
};

Engine.TelerehabEval = function ({ firstVisit = 'yes', rom = 'limited', balance = 'limited', equipment = 'phone' } = {}) {
  let plan;
  if (firstVisit === 'yes' && equipment === 'phone') plan = 'phone-eval-and-screen-share-or-video';
  else if (firstVisit === 'yes' && equipment === 'tablet') plan = 'video-eval-and-real-time-correction';
  else if (rom === 'limited' || balance === 'limited') plan = 'in-person-eval-needed-telerehab-not-enough';
  else if (firstVisit === 'follow-up') plan = 'synchronous-follow-up-and-app-monitoring';
  else plan = 'standard-telerehab-eval';
  return { plan, recommendation: 'PT-and-tech-team-eval' };
};

Engine.TelerehabAdherence = function ({ appLoginsPerWeek = 5, exerciseCompletion = 0.8, videoVisitAttended = 0.9 } = {}) {
  let adherence;
  if (appLoginsPerWeek >= 5 && exerciseCompletion >= 0.8 && videoVisitAttended >= 0.9) adherence = 'high-adherence-engaged';
  else if (appLoginsPerWeek >= 3 && exerciseCompletion >= 0.6) adherence = 'moderate-adherence-monitor';
  else if (appLoginsPerWeek < 2) adherence = 'low-adherence-barriers-and-reassess';
  else if (videoVisitAttended < 0.5) adherence = 'missed-appointments-and-eval';
  else adherence = 'inconsistent-adherence';
  return { adherence, recommendation: adherence.includes('high') ? 'progress-protocol' : 'barriers-and-modify' };
};

Engine.TelerehabBilling = function ({ modality = 'synchronous-video', minutes = 30, payer = 'CMS' } = {}) {
  let plan;
  if (payer === 'CMS' && modality === 'synchronous-video' && minutes >= 20) plan = 'CPT-97110-or-97161-synchronous-telerehab-eligible';
  else if (payer === 'commercial' && modality === 'audio-only') plan = 'audio-only-not-covered-by-most';
  else if (modality === 'asynchronous' && payer === 'CMS') plan = 'RPM-or-RTI-asynchronous-eligible';
  else if (minutes < 8) plan = 'insufficient-time-for-telerehab-billing';
  else plan = 'standard-telerehab-billing';
  return { plan, recommendation: 'verify-payer-policy-and-originating-site' };
};

Engine.TelerehabTechSupport = function ({ device = 'tablet', familiarity = 'low', caregiver = 'present' } = {}) {
  let plan;
  if (device === 'phone' && familiarity === 'low') plan = 'device-orientation-and-tech-tutor';
  else if (familiarity === 'low' && caregiver === 'present') plan = 'caregiver-tech-tutor-and-15-min-setup';
  else if (device === 'laptop' && familiarity === 'low') plan = 'laptop-orientation-and-screen-share';
  else if (familiarity === 'high' && caregiver === 'none') plan = 'standard-tech-support';
  else if (familiarity === 'moderate') plan = 'brief-tech-orientation-and-app-setup';
  else plan = 'tech-orientation-15-min';
  return { plan, recommendation: 'tech-tutor-and-IT-help-desk' };
};

Engine.TelerehabProgress = function ({ preScore = 50, postScore = 70, scale = 'DASH', weeksElapsed = 8 } = {}) {
  const delta = postScore - preScore;
  const pctChange = (delta / preScore) * 100;
  let result;
  if (pctChange >= 50) result = 'large-telerehab-improvement';
  else if (pctChange >= 30) result = 'moderate-telerehab-improvement';
  else if (pctChange >= 10) result = 'small-improvement';
  else if (pctChange >= 0) result = 'plateau-or-stable';
  else result = 'no-improvement-reassess';
  return { delta, pctChange: Math.round(pctChange), result, recommendation: result.includes('large') || result.includes('moderate') ? 'progress-protocol' : 'modify-or-evaluate' };
};

Engine.TelerehabDosing = function ({ sessionsPerWeek = 2, minutesPerSession = 30, weeks = 8 } = {}) {
  const totalHours = (sessionsPerWeek * minutesPerSession * weeks) / 60;
  let intensity;
  if (totalHours >= 12) intensity = 'intensive-telerehab';
  else if (totalHours >= 6) intensity = 'standard-telerehab';
  else if (totalHours >= 3) intensity = 'maintenance-telerehab';
  else intensity = 'supportive-telerehab';
  return { totalHours, intensity, recommendation: `${intensity}-${weeks}-weeks` };
};

module.exports = Engine;
