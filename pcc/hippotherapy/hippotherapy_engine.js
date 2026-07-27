// P3-AY: Hippotherapy Engine — 10 pure functions
const Engine = {};

Engine.HippotherapyEval = function ({ age = 8, indication = 'cerebral-palsy', gmfc = 3, contraindications = 'none', weight = 25 } = {}) {
  let eligibility;
  if (contraindications === 'severe-spinal-instability' || contraindications === 'uncontrolled-seizures') eligibility = 'contraindicated';
  else if (contraindications === 'mild') eligibility = 'precaution-eval-needed';
  else if (weight > 100) eligibility = 'weight-limit-exceeded';
  else if (age < 3) eligibility = 'too-young-traditional-hippotherapy';
  else if (age >= 3 && age < 18) eligibility = 'eligible-pediatric-hippotherapy';
  else eligibility = 'eligible-adult-hippotherapy';
  return { eligibility, recommendation: `${eligibility}-for-${indication}-GMFCS-${gmfc}` };
};

Engine.HorseSelection = function ({ riderLevel = 'beginner', indication = 'balance', horse = 'matching-needed' } = {}) {
  let pairing;
  if (riderLevel === 'beginner' && (indication === 'balance' || indication === 'core')) pairing = 'gentle-therapy-horse-smooth-gait';
  else if (riderLevel === 'intermediate' && indication === 'motor-planning') pairing = 'steady-horse-with-varied-terrain';
  else if (riderLevel === 'advanced' && indication === 'sensory-integration') pairing = 'responsive-horse-with-trails';
  else if (indication === 'speech') pairing = 'horse-with-strong-tempo-cueing';
  else pairing = 'standard-therapy-horse';
  return { pairing, recommendation: `${pairing}-weekly-or-biweekly` };
};

Engine.GaitOnHorse = function ({ cadence = 60, symmetry = 'symmetric', pelvicMotion = '3D', duration = 30 } = {}) {
  let result;
  if (cadence >= 55 && cadence <= 70 && symmetry === 'symmetric') result = 'optimal-walk-cadence-therapeutic';
  else if (symmetry === 'asymmetric') result = 'asymmetric-gait-evaluate-saddle-balance';
  else if (pelvicMotion === '3D' && duration >= 30) result = '3D-pelvic-motion-input-30-min';
  else if (cadence < 55) result = 'slow-cadence-not-therapeutic';
  else result = 'standard-hippotherapy-walk';
  return { result, recommendation: '30-to-45-min-per-session' };
};

Engine.PediatricHippotherapy = function ({ age = 6, diagnosis = 'CP-spastic-diplegia', tone = 'spastic', goals = 'balance' } = {}) {
  let plan;
  if (diagnosis === 'CP-spastic-diplegia' && tone === 'spastic' && goals === 'balance') plan = 'spastic-diplegia-balance-and-gait-hippotherapy';
  else if (diagnosis === 'CP-hemiplegia' && goals === 'UE-weight-bearing') plan = 'hemiplegia-UE-and-weight-bear-hippotherapy';
  else if (diagnosis === 'autism' && goals === 'sensory') plan = 'ASD-sensory-integration-hippotherapy';
  else if (diagnosis === 'Down-syndrome' && goals === 'postural') plan = 'Down-syndrome-postural-control-hippotherapy';
  else if (goals === 'speech') plan = 'speech-and-oral-motor-hippotherapy';
  else plan = 'standard-pediatric-hippotherapy';
  return { plan, recommendation: `${plan}-30-to-45-min-weekly` };
};

Engine.AdultHippotherapy = function ({ age = 35, indication = 'stroke', hemiparesis = 'left', balance = 'Berg-30', goals = 'gait' } = {}) {
  let plan;
  if (indication === 'stroke' && hemiparesis === 'left' && balance === 'Berg-30') plan = 'post-stroke-left-hemi-gait-and-balance-hippotherapy';
  else if (indication === 'MS') plan = 'MS-balance-and-fatigue-hippotherapy';
  else if (indication === 'spinal-cord-injury' && goals === 'core') plan = 'SCI-core-and-respiratory-hippotherapy';
  else if (indication === 'amputee') plan = 'amputee-prosthetic-comfort-hippotherapy';
  else if (indication === 'PTSD') plan = 'PTSD-equine-assisted-therapy-not-hippotherapy';
  else plan = 'standard-adult-hippotherapy';
  return { plan, recommendation: `${plan}-30-to-45-min-biweekly` };
};

Engine.HippotherapyContra = function ({ scoliosis = 'none', hip = 'normal', fracture = 'none', seizure = 'controlled', allergy = 'none' } = {}) {
  let safe;
  if (scoliosis === 'severe' || hip === 'dislocated') safe = 'absolute-contraindication';
  else if (fracture === 'unhealed' || seizure === 'uncontrolled') safe = 'absolute-contraindication';
  else if (allergy === 'severe-horse-dander') safe = 'allergy-contraindication';
  else if (scoliosis === 'mild' || hip === 'subluxed') safe = 'precaution-ortho-clearance';
  else if (seizure === 'controlled-6-months') safe = 'precaution-seizure-action-plan';
  else safe = 'no-contraindication-clear';
  return { safe, recommendation: safe.includes('absolute') ? 'do-not-proceed' : (safe.includes('precaution') ? 'clear-and-monitor' : 'proceed') };
};

Engine.SessionStructure = function ({ phases = 'standard', minutes = 45, staffing = '1-leader-2-side-walkers' } = {}) {
  let structure;
  if (phases === 'standard' && minutes === 45) structure = 'mount-5-warm-up-10-hippotherapy-25-cool-down-5';
  else if (phases === 'intensive' && minutes >= 60) structure = 'intensive-60-to-90-min-with-breaks';
  else if (phases === 'evaluation') structure = 'pre-therapy-eval-mount-and-2-min-walk';
  else if (phases === 'short') structure = 'short-session-15-to-20-min-for-fatigue';
  else structure = 'custom-session-structure';
  return { structure, recommendation: `${staffing}-1-leader-and-1-or-2-side-walkers` };
};

Engine.ProgressMeasure = function ({ baselineBerg = 30, currentBerg = 45, weeksElapsed = 12, baselineGMFM = 50, currentGMFM = 60 } = {}) {
  const bergDelta = currentBerg - baselineBerg;
  const gmfmDelta = currentGMFM - baselineGMFM;
  let result;
  if (bergDelta >= 10 || gmfmDelta >= 8) result = 'large-improvement-hippotherapy-effective';
  else if (bergDelta >= 5 || gmfmDelta >= 4) result = 'moderate-improvement-continue';
  else if (bergDelta >= 2 || gmfmDelta >= 2) result = 'small-improvement-maintain';
  else if (bergDelta === 0 && gmfmDelta === 0) result = 'plateau-modify-approach';
  else result = 'regression-or-no-progress-reassess';
  return { bergDelta, gmfmDelta, result, recommendation: result.includes('large') || result.includes('moderate') ? 'continue-and-progress' : 'reassess-or-modify' };
};

Engine.SafetyProtocol = function ({ helmet = true, vest = true, stirrups = 'safety', weather = 'clear' } = {}) {
  let safety;
  if (!helmet) safety = 'no-helmet-not-allowed';
  else if (weather === 'storm' || weather === 'extreme-heat') safety = 'cancel-session-weather';
  else if (stirrups === 'unsafe') safety = 'replace-stirrups';
  else if (vest === false) safety = 'add-protective-vest-for-balance';
  else if (helmet && vest && stirrups === 'safety' && weather === 'clear') safety = 'all-safety-checked-proceed';
  else safety = 'review-safety-checklist';
  return { safety, recommendation: safety.includes('proceed') ? 'proceed-with-session' : 'address-safety-concerns' };
};

Engine.HippotherapyDischarge = function ({ goalsMet = true, transitionPlan = 'transition-to-riding-or-home', familyIndependence = 'high' } = {}) {
  let ready;
  if (goalsMet && transitionPlan !== 'none' && familyIndependence === 'high') ready = 'ready-for-discharge-or-transition-to-recreational-riding';
  else if (!goalsMet) ready = 'continue-hippotherapy-goals-not-met';
  else if (transitionPlan === 'none') ready = 'pending-transition-plan';
  else if (familyIndependence === 'low') ready = 'pending-family-training-or-support';
  else ready = 'partial-discharge-reassess';
  return { ready, recommendation: ready.includes('ready') ? 'transition-or-discharge' : 'continue-and-complete-pending' };
};

module.exports = Engine;
