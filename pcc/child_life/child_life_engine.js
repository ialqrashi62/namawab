// P3-AY: Child-Life Engine — 10 pure functions
const Engine = {};

Engine.ChildLifeAssessment = function ({ age = 6, hospitalStress = 'high', coping = 'limited', family = 'present', priorExperience = 'none' } = {}) {
  let plan;
  if (age < 3) plan = 'infant-sensory-comfort-and-family-centered-care';
  else if (age < 6 && family === 'present') plan = 'parent-child-therapeutic-play';
  else if (age < 12 && hospitalStress === 'high') plan = 'medical-play-and-procedural-preparation';
  else if (age >= 12 && coping === 'limited') plan = 'adolescent-coping-and-peer-support';
  else if (priorExperience === 'none' && hospitalStress === 'high') plan = 'preparation-and-orientation-tour';
  else plan = 'standard-child-life-assessment';
  return { plan, recommendation: `${plan}-for-age-${age}-stress-${hospitalStress}` };
};

Engine.ProceduralPreparation = function ({ age = 7, procedure = 'IV-start', child = 'anxious', parent = 'present', prior = 'none' } = {}) {
  let plan;
  if (age < 4) plan = 'brief-sensory-prep-and-comfort-positioning';
  else if (age < 8 && prior === 'none') plan = 'step-by-step-medical-play-and-doll-demo';
  else if (age < 8 && prior === 'yes') plan = 'coping-plan-and-distraction';
  else if (age >= 8 && parent === 'present') plan = 'involve-parent-in-coping-and-coaching';
  else if (child === 'extremely-anxious') plan = 'sedation-eval-or-extended-prep';
  else plan = 'standard-procedural-preparation';
  return { plan, recommendation: 'positioning-comfort-and-distraction-tools' };
};

Engine.MedicalPlay = function ({ age = 5, materials = 'dolls-stethoscope', setting = 'bedside', goal = 'familiarization' } = {}) {
  let plan;
  if (age < 3) plan = 'sensory-exploration-and-parent-guided-play';
  else if (age < 6 && goal === 'familiarization') plan = 'medical-doll-and-stethoscope-exploration';
  else if (age < 6 && goal === 'procedural') plan = 'medical-play-rehearsal-of-procedure';
  else if (age >= 6 && setting === 'playroom') plan = 'group-medical-play-and-peer-modeling';
  else if (setting === 'bedside') plan = 'bedside-medical-play-and-doll-demo';
  else plan = 'standard-medical-play';
  return { plan, recommendation: 'one-to-one-with-CCLS' };
};

Engine.DistractionToolbox = function ({ age = 8, procedure = 'venipuncture', parent = 'engaged', sensory = 'visual' } = {}) {
  let toolset;
  if (age < 3) toolset = 'comfort-positioning-and-pacifier-or-rattle';
  else if (age < 6 && sensory === 'visual') toolset = 'bubbles-light-spinner-and-bubble-tubes';
  else if (age < 6 && sensory === 'auditory') toolset = 'music-and-singing';
  else if (age < 12 && parent === 'engaged') toolset = 'book-tablet-and-parent-coaching';
  else if (age >= 12) toolset = 'tablet-guided-imagery-and-music';
  else toolset = 'standard-distraction-toolbox';
  return { toolset, recommendation: 'choose-2-to-3-tools-and-train-child-pre-procedure' };
};

Engine.PainCoping = function ({ painLevel = 5, anxiety = 'high', age = 8, parent = 'present' } = {}) {
  let plan;
  if (age < 3 && painLevel >= 3) plan = 'skin-to-skin-and-sucrose-and-comfort-positioning';
  else if (anxiety === 'high' && parent === 'present') plan = 'parent-coaching-and-comfort-positioning';
  else if (painLevel >= 6) plan = 'pharmacologic-analgesia-plus-distraction';
  else if (painLevel >= 4) plan = 'distraction-plus-breathing-and-imagery';
  else if (painLevel < 4) plan = 'comfort-and-engagement';
  else plan = 'standard-pediatric-pain-coping';
  return { plan, recommendation: 'multi-modal-and-family-centered' };
};

Engine.HospitalSchool = function ({ age = 10, grade = 5, admission = 'extended', learning = 'typical' } = {}) {
  let plan;
  if (admission === 'extended' && age < 6) plan = 'early-childhood-play-and-learning';
  else if (admission === 'extended' && age >= 6) plan = 'hospital-school-coordination-with-home-school';
  else if (admission === 'short' && age >= 6) plan = 'short-stay-tutoring-and-make-up-work';
  else if (learning === 'special-needs') plan = 'special-ed-coordination-with-Hospital-teacher';
  else if (admission === 'chronic') plan = 'chronic-illness-school-reintegration';
  else plan = 'standard-hospital-school-coordination';
  return { plan, recommendation: 'liaison-with-home-school-and-iep' };
};

Engine.SiblingSupport = function ({ sibAge = 5, sibStress = 'high', parents = 'depleted', visitAllowed = true } = {}) {
  let plan;
  if (sibAge < 4) plan = 'sibling-play-and-orientation';
  else if (sibAge < 8 && visitAllowed) plan = 'hospital-visit-prep-and-sibling-tour';
  else if (sibStress === 'high') plan = 'sibling-support-group-and-counseling-referral';
  else if (parents === 'depleted') plan = 'respite-and-grandparent-or-volunteer-support';
  else if (visitAllowed && sibStress === 'low') plan = 'sibling-visit-and-engagement';
  else plan = 'standard-sibling-support';
  return { plan, recommendation: 'family-centered-and-sib-screen' };
};

Engine.EndOfLifeChild = function ({ age = 6, condition = 'terminal', lucidity = 'full', family = 'present', legacy = 'wanted' } = {}) {
  let plan;
  if (lucidity !== 'full') plan = 'sensory-comfort-and-familiar-presence';
  else if (legacy === 'wanted' && age >= 6) plan = 'legacy-building-handprint-molds-and-memory-book';
  else if (age < 6) plan = 'playful-farewells-and-comfort-items';
  else if (family === 'present' && condition === 'terminal') plan = 'family-centered-end-of-life-and-memory-making';
  else if (lucidity === 'full' && age >= 6) plan = 'legacy-and-life-review-with-child';
  else plan = 'standard-pediatric-palliative-child-life';
  return { plan, recommendation: 'CCLS-and-palliative-team' };
};

Engine.ChildLifeDosing = function ({ minutesPerSession = 30, sessionsPerWeek = 5, weeks = 2 } = {}) {
  const totalHours = (minutesPerSession * sessionsPerWeek * weeks) / 60;
  let intensity;
  if (totalHours >= 15) intensity = 'intensive-child-life';
  else if (totalHours >= 7) intensity = 'standard-child-life';
  else if (totalHours >= 3) intensity = 'maintenance-child-life';
  else intensity = 'supportive-child-life';
  return { totalHours, intensity, recommendation: `${intensity}-${weeks}-weeks` };
};

Engine.ChildLifeDischarge = function ({ preparationComplete = true, familyTrained = true, community = 'identified', followup = 'set' } = {}) {
  let ready;
  if (preparationComplete && familyTrained && community === 'identified' && followup === 'set') ready = 'ready-for-discharge-with-support-plan';
  else if (!preparationComplete) ready = 'pending-preparation-completion';
  else if (!familyTrained) ready = 'pending-family-training';
  else if (community !== 'identified') ready = 'pending-community-resources';
  else if (followup !== 'set') ready = 'pending-followup-and-clinic-coordination';
  else ready = 'partial-discharge-monitor';
  return { ready, recommendation: ready.includes('ready') ? 'discharge-with-plan' : 'complete-pending-items' };
};

module.exports = Engine;
