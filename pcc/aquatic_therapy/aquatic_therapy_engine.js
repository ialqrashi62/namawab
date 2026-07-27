// P3-AY: Aquatic-Therapy Engine — 10 pure functions
const Engine = {};

Engine.AquaticAssessment = function ({ age = 40, indication = 'low-back-pain', waterComfort = 'high', incontinence = 'none', wounds = 'none' } = {}) {
  let eligibility;
  if (wounds === 'open' || incontinence === 'fecal') eligibility = 'contraindicated-pool-exclusion';
  else if (waterComfort === 'fearful' || waterComfort === 'low') eligibility = 'precaution-gradual-introduction';
  else if (indication === 'low-back-pain' || indication === 'fibromyalgia') eligibility = 'ideal-aquatic-PT-indicated';
  else if (indication === 'post-surgical') eligibility = 'post-surgical-with-surgeon-clearance';
  else if (indication === 'arthritis') eligibility = 'eligible-aquatic-exercise';
  else eligibility = 'standard-aquatic-eval';
  return { eligibility, recommendation: `${eligibility}-${indication}` };
};

Engine.PoolSelection = function ({ temp = 33, depth = 'chest-depth', modality = 'therapeutic-pool', therapyType = 'aquatic-PT' } = {}) {
  let pool;
  if (modality === 'therapeutic-pool' && temp >= 32 && temp <= 34) pool = 'warm-therapeutic-pool-32-to-34-C';
  else if (temp < 30) pool = 'cool-pool-for-endurance-not-rheumatology';
  else if (modality === 'lap-pool' && therapyType === 'aquatic-PT') pool = 'use-therapeutic-pool-not-lap';
  else if (modality === 'swim-spa' && temp >= 30) pool = 'swim-spa-with-resistance-current';
  else if (depth === 'deep-water' && therapyType === 'aquatic-exercise') pool = 'deep-water-aquatic-exercise-with-belt';
  else if (modality === 'community-pool') pool = 'community-pool-limited-therapeutic';
  else pool = 'standard-aquatic-pool';
  return { pool, recommendation: `${pool}-${temp}C-${depth}` };
};

Engine.AquaticExercise = function ({ goal = 'ROM', joint = 'shoulder', resistance = 'water', minutes = 30 } = {}) {
  let plan;
  if (goal === 'ROM' && joint === 'shoulder') plan = 'shoulder-ROM-AAROM-in-water-30-min';
  else if (goal === 'strength' && joint === 'knee') plan = 'knee-strength-water-resistance-30-min';
  else if (goal === 'endurance' && resistance === 'turbulence') plan = 'endurance-turbulence-walking-or-jogging';
  else if (goal === 'gait') plan = 'gait-training-with-flotation';
  else if (goal === 'balance') plan = 'balance-with-water-turbulence-and-unstable-base';
  else if (minutes < 20) plan = 'short-aquatic-session-add-breaks';
  else plan = 'standard-aquatic-exercise';
  return { plan, recommendation: `${plan}-3x-per-week` };
};

Engine.BadelogicJoint = function ({ joint = 'knee', weeksPost = 8, load = 'partial-weight', surgery = 'TKA' } = {}) {
  let plan;
  if (joint === 'knee' && surgery === 'TKA' && weeksPost >= 6 && load === 'partial-weight') plan = 'aquatic-PT-TKA-partial-weight-bear-6-to-12-weeks';
  else if (joint === 'hip' && surgery === 'THA') plan = 'aquatic-PT-THA-early-ROM-and-gait';
  else if (joint === 'shoulder' && surgery === 'rotator-cuff') plan = 'aquatic-PT-rotator-cuff-AROM-and-AAROM';
  else if (joint === 'ankle' && surgery === 'Achilles') plan = 'aquatic-Achilles-early-closed-chain';
  else if (load === 'non-weight-bear') plan = 'non-weight-bear-aquatic-PT-eligible';
  else plan = 'standard-aquatic-PT';
  return { plan, recommendation: 'transition-to-land-when-3-to-4-weeks-stable' };
};

Engine.RheumatologyAquatic = function ({ diagnosis = 'RA', diseaseActivity = 'low', pain = 5, stiffness = 'morning' } = {}) {
  let plan;
  if (diagnosis === 'RA' && diseaseActivity === 'low' && stiffness === 'morning') plan = 'morning-warm-aquatic-for-stiffness';
  else if (diagnosis === 'fibromyalgia' && pain >= 6) plan = 'warm-aquatic-low-intensity-fibromyalgia';
  else if (diagnosis === 'ankylosing-spondylitis') plan = 'aquatic-mobility-and-extension-AS';
  else if (diagnosis === 'osteoarthritis' && diseaseActivity === 'low') plan = 'aquatic-OA-exercise-and-weight-mgmt';
  else if (diagnosis === 'lupus' && diseaseActivity === 'flaring') plan = 'low-intensity-and-rest-not-aquatic';
  else plan = 'standard-rheumatology-aquatic';
  return { plan, recommendation: `${plan}-30-to-45-min-2-to-3x-week` };
};

Engine.NeuroAquatic = function ({ diagnosis = 'stroke', side = 'right', berg = 30, weeksPost = 12 } = {}) {
  let plan;
  if (diagnosis === 'stroke' && side === 'right' && berg < 45) plan = 'post-stroke-hemi-balance-aquatic';
  else if (diagnosis === 'CP' && weeksPost >= 24) plan = 'CP-aquatic-tone-and-postural-control';
  else if (diagnosis === 'MS' && berg < 45) plan = 'MS-aquatic-balance-and-cool-pool';
  else if (diagnosis === 'Parkinson') plan = 'PD-aquatic-big-movements-and-rhythm';
  else if (diagnosis === 'SCI' && weeksPost >= 12) plan = 'SCI-aquatic-PT-with-belt-and-floatation';
  else plan = 'standard-neuro-aquatic';
  return { plan, recommendation: '30-to-45-min-2-to-3x-week' };
};

Engine.AquaticSafety = function ({ depth = 'waist-depth', staff = 'CPR-certified', emergency = 'ready', poolFloor = 'non-slip' } = {}) {
  let safety;
  if (staff !== 'CPR-certified' || emergency !== 'ready') safety = 'not-ready-stand-down';
  else if (poolFloor === 'slippery') safety = 'fix-pool-floor-or-skip-session';
  else if (depth === 'overhead' && staff.length === 0) safety = 'deep-water-requires-1-to-1-or-skip';
  else if (depth === 'waist-depth' || depth === 'chest-depth') safety = 'standard-depth-with-trained-staff';
  else if (poolFloor === 'non-slip' && staff === 'CPR-certified') safety = 'all-safety-passed';
  else safety = 'review-safety-checklist';
  return { safety, recommendation: safety.includes('all-safety') || safety.includes('standard-depth') ? 'proceed' : 'address-concerns' };
};

Engine.Hallwick = function ({ age = 8, ability = 'learning', population = 'pediatric-disability' } = {}) {
  let stage;
  if (ability === 'beginner' && population === 'pediatric-disability') stage = 'Hallwick-10-point-stage-1-to-3-mental-adjustment';
  else if (ability === 'learning' && population === 'pediatric-disability') stage = 'Hallwick-4-to-7-disengagement-and-control';
  else if (ability === 'independent' && population === 'pediatric-disability') stage = 'Hallwick-8-to-10-movement-and-swimming';
  else if (population === 'adult-stroke') stage = 'Hallwick-adaptation-for-stroke-balance';
  else if (population === 'autism') stage = 'Hallwick-ASD-water-acceptance';
  else stage = 'standard-Hallwick-10-point';
  return { stage, recommendation: 'one-to-one-or-small-group-format' };
};

Engine.AquaticCardiac = function ({ cardiacStatus = 'post-MI', weeksPost = 8, intensity = 'low', ejectionFraction = 45 } = {}) {
  let plan;
  if (cardiacStatus === 'post-MI' && weeksPost < 6) plan = 'too-early-defer-aquatic-CR';
  else if (cardiacStatus === 'post-MI' && weeksPost >= 6 && intensity === 'low') plan = 'low-intensity-aquatic-CR-supervised';
  else if (cardiacStatus === 'CHF' && ejectionFraction < 30) plan = 'CHF-low-intensity-aquatic-with-monitoring';
  else if (intensity === 'moderate' && weeksPost >= 12) plan = 'moderate-aquatic-CR-eligible';
  else if (cardiacStatus === 'stable-angina') plan = 'aquatic-CR-angina-monitoring';
  else plan = 'standard-aquatic-CR-eval';
  return { plan, recommendation: 'CR-team-and-telemetry-if-needed' };
};

Engine.AquaticDosing = function ({ sessionsPerWeek = 3, minutesPerSession = 45, weeks = 12 } = {}) {
  const totalHours = (sessionsPerWeek * minutesPerSession * weeks) / 60;
  let intensity;
  if (totalHours >= 30) intensity = 'intensive-aquatic-PT';
  else if (totalHours >= 18) intensity = 'standard-aquatic-PT';
  else if (totalHours >= 6) intensity = 'maintenance-aquatic-PT';
  else intensity = 'supportive-aquatic';
  return { totalHours, intensity, recommendation: `${intensity}-${weeks}-weeks` };
};

module.exports = Engine;
