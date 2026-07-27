// P3-AX: Art-Therapy Engine — 10 pure functions
const Engine = {};

Engine.ArtTherapyAssessment = function ({ age = 35, diagnosis = 'trauma', goals = 'emotional-expression', medium = 'open', engagement = 'high' } = {}) {
  let plan;
  if (engagement === 'high' && medium === 'open') plan = 'open-studio-and-self-directed-art';
  else if (engagement === 'high' && goals === 'trauma') plan = 'structured-trauma-informed-art';
  else if (engagement === 'moderate') plan = 'directive-art-task-and-reflection';
  else if (engagement === 'low') plan = 'non-verbal-sensory-art-materials';
  else plan = 'engagement-barriers-assessment';
  let population;
  if (age < 12) population = 'child-art-therapy';
  else if (age < 18) population = 'adolescent-art-therapy';
  else if (age >= 65) population = 'older-adult-art-therapy';
  else population = 'adult-art-therapy';
  return { plan, population, recommendation: `art-therapy-for-${diagnosis}-${goals}` };
};

Engine.ArtMedium = function ({ goal = 'affect-regulation', sensory = 'tactile', mobility = 'full' } = {}) {
  let medium;
  if (goal === 'affect-regulation' && sensory === 'tactile') medium = 'clay-and-sculpture';
  else if (goal === 'trauma-narrative') medium = 'drawing-and-painting';
  else if (goal === 'cognitive-stimulation') medium = 'collage-and-mixed-media';
  else if (goal === 'motor-skill') medium = 'large-brush-painting-and-craft';
  else if (mobility !== 'full') medium = 'seated-watercolor-or-digital-art';
  else if (sensory === 'visual') medium = 'painting-and-color-mixing';
  else medium = 'open-studio-multi-medium';
  return { medium, recommendation: `${medium}-30-to-60-min-sessions` };
};

Engine.ArtTrauma = function ({ trauma = 'PTSD', safety = 'established', disclosure = 'voluntary', dissociation = 'mild' } = {}) {
  let plan;
  if (safety !== 'established') plan = 'safety-and-stabilization-phase-no-trauma-content';
  else if (dissociation === 'severe') plan = 'grounding-art-and-psychoeducation';
  else if (dissociation === 'moderate') plan = 'structured-and-brief-art-tasks';
  else if (disclosure === 'voluntary' && trauma === 'PTSD') plan = 'expressive-art-with-controlled-disclosure';
  else if (trauma === 'complex') plan = 'three-phase-trauma-informed-art-therapy';
  else plan = 'standard-expressive-art-therapy';
  return { plan, recommendation: 'AT-BC-or-trained-clinician' };
};

Engine.ArtGroup = function ({ groupSize = 8, population = 'inpatient-psych', focus = 'connection', durationWeeks = 8 } = {}) {
  let plan;
  if (population === 'inpatient-psych' && focus === 'connection') plan = 'themed-art-task-and-group-share';
  else if (population === 'oncology') plan = 'creative-arts-for-cancer-support';
  else if (population === 'dementia') plan = 'reminiscence-art-and-life-review';
  else if (population === 'burn-survivors') plan = 'scar-redesignation-and-body-image-art';
  else if (population === 'autism') plan = 'structured-art-and-social-skills';
  else if (groupSize >= 10) plan = 'small-group-format-short-tasks';
  else plan = 'standard-open-group-art-therapy';
  return { plan, recommendation: `${plan}-${durationWeeks}-weeks` };
};

Engine.ArtPediatric = function ({ age = 8, indication = 'medical-procedural', developmental = 'typical', family = 'present' } = {}) {
  let plan;
  if (age < 3) plan = 'scribble-and-finger-paint-with-caregiver';
  else if (age < 6 && family === 'present') plan = 'parent-child-joint-art-task';
  else if (age < 12 && indication === 'medical-procedural') plan = 'medical-play-with-art-and-dolls';
  else if (age < 12) plan = 'directive-art-and-storytelling';
  else if (indication === 'palliative') plan = 'legacy-art-and-memory-book';
  else plan = 'standard-pediatric-art-therapy';
  return { plan, recommendation: `${plan}-weekly` };
};

Engine.ArtGeriatric = function ({ age = 78, cognition = 'mild-impairment', mobility = 'walker', engagement = 'willing' } = {}) {
  let plan;
  if (cognition === 'mild-impairment' && engagement === 'willing') plan = 'reminiscence-art-and-life-review';
  else if (cognition === 'severe-impairment') plan = 'sensory-art-and-music-combined';
  else if (mobility !== 'walker' && mobility !== 'full') plan = 'bedside-art-with-modified-tools';
  else if (engagement === 'reluctant') plan = 'brief-and-non-directive-art-offer';
  else plan = 'standard-geriatric-art-therapy';
  return { plan, recommendation: 'reminiscence-and-sensory-focused' };
};

Engine.ArtDosing = function ({ sessionsPerWeek = 2, minutesPerSession = 45, weeks = 12 } = {}) {
  const totalHours = (sessionsPerWeek * minutesPerSession * weeks) / 60;
  let intensity;
  if (totalHours >= 24) intensity = 'intensive-art-therapy';
  else if (totalHours >= 12) intensity = 'standard-art-therapy';
  else if (totalHours >= 6) intensity = 'maintenance-art-therapy';
  else intensity = 'supportive-art-therapy';
  return { totalHours, intensity, recommendation: `${intensity}-${weeks}-weeks` };
};

Engine.ArtInpatient = function ({ setting = 'burn', acuity = 'acute', phase = 'inpatient' } = {}) {
  let plan;
  if (setting === 'burn' && phase === 'inpatient') plan = 'pain-procedural-art-and-distraction';
  else if (setting === 'burn' && phase === 'rehab') plan = 'scar-and-body-image-art-therapy';
  else if (setting === 'oncology' && acuity === 'acute') plan = 'expressive-art-during-treatment';
  else if (setting === 'palliative') plan = 'legacy-art-and-meaning-making';
  else if (setting === 'psych') plan = 'structured-affect-regulation-art';
  else plan = 'standard-inpatient-art-therapy';
  return { plan, recommendation: `${plan}-3-to-5-times-per-week` };
};

Engine.ArtOutcome = function ({ preScore = 70, postScore = 40, scale = 'POMS-depression', weeksElapsed = 10 } = {}) {
  const delta = preScore - postScore;
  const pctChange = (delta / preScore) * 100;
  let result;
  if (pctChange >= 40) result = 'large-clinical-improvement';
  else if (pctChange >= 25) result = 'moderate-clinical-improvement';
  else if (pctChange >= 10) result = 'small-clinical-improvement';
  else if (pctChange >= 0) result = 'minimal-improvement-continue';
  else result = 'no-improvement-or-deterioration-reassess';
  return { delta, pctChange: Math.round(pctChange), result, recommendation: result.includes('large') || result.includes('moderate') ? 'maintenance-and-taper' : 'modify-or-evaluate' };
};

Engine.ArtDigital = function ({ techAccess = 'high', goal = 'self-expression', motor = 'intact', preference = 'traditional' } = {}) {
  let plan;
  if (techAccess === 'high' && motor === 'intact' && preference === 'digital') plan = 'digital-drawing-and-procreate-app';
  else if (techAccess === 'high' && goal === 'memory') plan = 'digital-memory-book-and-photo-art';
  else if (motor === 'limited' && techAccess === 'high') plan = 'eye-tracking-digital-art';
  else if (preference === 'traditional') plan = 'traditional-medium-with-tech-documentation';
  else plan = 'standard-hybrid-art-therapy';
  return { plan, recommendation: `${plan}-weekly-or-biweekly` };
};

module.exports = Engine;
