// P3-AW: Vestibular-Rehab Engine — 10 pure functions
const Engine = {};

Engine.DixHallpike = function ({ nystagmus = 'upbeating-torsional', latency = 5, duration = 30, fatigability = 'fatigable' } = {}) {
  let diagnosis;
  if (nystagmus === 'upbeating-torsional' && latency >= 1 && latency <= 20 && fatigability === 'fatigable') diagnosis = 'posterior-BPPV-right';
  else if (nystagmus === 'downbeating-torsional') diagnosis = 'anterior-canal-BPPV-or-central';
  else if (nystagmus === 'horizontal-geotropic') diagnosis = 'lateral-canal-BPPV-geotropic';
  else if (nystagmus === 'horizontal-apogeotropic') diagnosis = 'lateral-canal-BPPV-apogeotropic-cupulolithiasis';
  else if (fatigability === 'non-fatigable' || duration >= 60) diagnosis = 'central-not-BPPV-neuro-imaging';
  else diagnosis = 'BPPV-undefined-canal';
  return { diagnosis, recommendation: diagnosis.includes('posterior') ? 'Epley-maneuver' : (diagnosis.includes('lateral') ? 'BBQ-roll-or-Gufoni' : 'neuro-eval') };
};

Engine.HeadImpulse = function ({ side = 'right', gain = 0.6, correctiveSaccade = 'overt' } = {}) {
  let result;
  if (gain < 0.7 && correctiveSaccade === 'overt') result = `abnormal-HIT-${side}-vestibular-loss`;
  else if (gain < 0.7 && correctiveSaccade === 'covert') result = `abnormal-HIT-${side}-covert-saccade`;
  else if (gain >= 0.7) result = 'normal-HIT';
  else result = 'equivocal-HIT';
  return { result, recommendation: result.includes('abnormal') ? 'VRT-and-balance-training' : 'monitor' };
};

Engine.RombergTest = function ({ eyesOpen = 'stable', eyesClosed = 'falls', duration = 30 } = {}) {
  let result;
  if (eyesOpen === 'stable' && eyesClosed === 'falls') result = 'positive-Romberg-vestibular-proprioceptive-loss';
  else if (eyesClosed === 'sways') result = 'mild-Romberg-vestibular-gait-disorder';
  else if (eyesClosed === 'stable' && duration >= 30) result = 'negative-Romberg';
  else result = 'unspecified';
  return { result, recommendation: result.includes('positive') ? 'VRT-and-balance-PT' : 'monitor' };
};

Engine.DynamicVisualAcuity = function ({ staticVA = 20/20, dynamicVA = 20/50, axis = 'yaw' } = {}) {
  const linesLost = Math.round(20 * (Math.log(0.5 / Math.log(1)) - Math.log(1))); // simplified
  let classification;
  if (dynamicVA >= 20/40) classification = 'normal-DVA';
  else if (dynamicVA >= 20/70) classification = 'mild-DVA-loss-vestibular';
  else if (dynamicVA >= 20/100) classification = 'moderate-DVA-loss';
  else classification = 'severe-DVA-loss-oscillopsia';
  return { classification, recommendation: classification.includes('normal') ? 'monitor' : 'gaze-stability-VRT' };
};

Engine.GazeStability = function ({ velocity = 80, duration = 30, symptoms = 'mild' } = {}) {
  let result;
  if (velocity >= 120 && duration >= 60 && symptoms === 'none') result = 'normal-gaze-stability';
  else if (symptoms === 'moderate') result = 'reduced-gaze-stability-VRT-needed';
  else if (symptoms === 'severe') result = 'severe-oscillopsia-gaze-stability-VRT';
  else result = 'mild-impairment';
  return { result, recommendation: result.includes('severe') || result.includes('reduced') ? 'gaze-stability-exercises-VRT' : 'monitor' };
};

Engine.VestibularMigraine = function ({ vertigoDuration = 4, headache = 'migrainous', photophobia = true, aura = false } = {}) {
  let diagnosis;
  if (vertigoDuration >= 1 && headache === 'migrainous' && (photophobia || aura)) diagnosis = 'vestibular-migraine-likely';
  else if (headache === 'migrainous' && !photophobia) diagnosis = 'vestibular-migraine-possible';
  else if (aura) diagnosis = 'migraine-with-aura-vertigo';
  else if (vertigoDuration < 1) diagnosis = 'short-vertigo-not-migraine';
  else diagnosis = 'vestibular-migraine-not-met';
  return { diagnosis, recommendation: diagnosis.includes('likely') || diagnosis.includes('possible') ? 'migraine-prophylaxis-and-VRT' : 'neurology-eval' };
};

Engine.MeniereAttack = function ({ episodes = 3, hearingLoss = 'low-frequency', tinnitus = true, fullness = true } = {}) {
  let classification;
  if (episodes >= 2 && hearingLoss === 'low-frequency' && tinnitus && fullness) classification = 'definite-Meniere-by-AAO-HNS';
  else if (episodes >= 2 && hearingLoss) classification = 'probable-Meniere';
  else if (episodes === 1 && hearingLoss) classification = 'possible-Meniere-monitor';
  else classification = 'not-Meniere';
  return { classification, recommendation: classification.includes('definite') || classification.includes('probable') ? 'low-salt-diuretic-and-ENT' : 'monitor' };
};

Engine.BalanceAssessment = function ({ bergScore = 45, tugTime = 12, falls = 0 } = {}) {
  let result;
  if (bergScore >= 56 && tugTime < 10) result = 'normal-balance-low-fall-risk';
  else if (bergScore >= 45 && tugTime < 14) result = 'mild-balance-impairment-VRT';
  else if (bergScore >= 30 || tugTime < 20) result = 'moderate-balance-impairment-balance-PT';
  else if (falls >= 2) result = 'high-fall-risk-multifactorial';
  else result = 'severe-balance-impairment';
  return { result, recommendation: result.includes('normal') ? 'monitor' : 'VRT-and-balance-PT' };
};

Engine.VORAdaptation = function ({ gain = 0.8, phaseLead = 10, suppress = 0.5 } = {}) {
  let result;
  if (gain >= 0.7 && phaseLead < 15 && suppress < 0.3) result = 'normal-VOR';
  else if (gain < 0.7) result = 'reduced-VOR-gain-VRT-needed';
  else if (phaseLead >= 15) result = 'abnormal-VOR-phase-VRT';
  else if (suppress >= 0.4) result = 'poor-VOR-suppression-central';
  else result = 'mild-VOR-impairment';
  return { result, recommendation: result.includes('VOR') && !result.includes('normal') ? 'VOR-adaptation-gaze-stability-VRT' : 'monitor' };
};

Engine.PPPD = function ({ duration = 8, motionTrigger = true, visualDep = 'high', neuroWorkup = 'normal' } = {}) {
  let diagnosis;
  if (duration >= 3 && motionTrigger && visualDep === 'high' && neuroWorkup === 'normal') diagnosis = 'PPPD-by-Barany-Society-criteria';
  else if (duration >= 3 && motionTrigger) diagnosis = 'probable-PPPD';
  else if (duration < 3) diagnosis = 'acute-vestibular-syndrome-not-PPPD';
  else diagnosis = 'unspecified-chronic-dizziness';
  return { diagnosis, recommendation: diagnosis.includes('PPPD') ? 'VRT-SSRIs-SNRI-and-CBT' : 'vestibular-eval' };
};

module.exports = Engine;
