// P3-AZ: Prosthetics-Orthotics Engine — 10 pure functions
const Engine = {};

Engine.ProstheticPrescription = function ({ level = 'trans-tibial', side = 'right', activity = 'K3', comorbidities = 'none' } = {}) {
  let prescription;
  if (level === 'trans-tibial' && activity === 'K3') prescription = 'trans-tibial-prosthesis-ptb-suspension-K3-feet';
  else if (level === 'trans-femoral' && activity === 'K3') prescription = 'trans-femoral-prosthesis-ischial-containment-K3';
  else if (level === 'trans-humeral') prescription = 'trans-humeral-prosthesis-cable-and-myoe';
  else if (level === 'trans-radial') prescription = 'trans-radial-self-suspending-or-muenster';
  else if (comorbidities === 'diabetic' && level === 'trans-tibial') prescription = 'diabetic-friendly-PTD-with-silicone-liner';
  else if (activity === 'K1' && level === 'trans-tibial') prescription = 'K1-SACH-feet-and-ptb';
  else prescription = 'standard-prosthetic-prescription';
  return { prescription, recommendation: 'certified-prosthetist-and-physiatrist' };
};

Engine.SocketFit = function ({ suspension = 'pin-lock', liner = 'silicone', stumpVolume = 'stable', pressure = 'even' } = {}) {
  let result;
  if (pressure !== 'even') result = 'socket-pressure-revisit-socket';
  else if (stumpVolume === 'unstable') result = 'volume-management-24-hour-wear-and-socks';
  else if (suspension === 'suction' && liner === 'silicone') result = 'suction-with-silicone-liner-excellent-fit';
  else if (suspension === 'pin-lock' && liner === 'silicone') result = 'pin-lock-silicone-good-fit';
  else if (suspension === 'lanyard') result = 'lanyard-suspension-acceptable-fit';
  else result = 'standard-suspension-and-liner';
  return { result, recommendation: 're-eval-every-3-months-or-socket-change' };
};

Engine.OrthoticPrescription = function ({ condition = 'drop-foot', side = 'right', activity = 'community-ambulator', skin = 'intact' } = {}) {
  let prescription;
  if (condition === 'drop-foot' && activity === 'community-ambulator') prescription = 'ankle-FO-or-AFO-with-articulating-joint';
  else if (condition === 'plantar-fasciitis') prescription = 'night-splint-and-custom-orthotic';
  else if (condition === 'cerebral-palsy' && side === 'both') prescription = 'solid-ankle-AFO-bilateral';
  else if (condition === 'stroke' && skin === 'intact') prescription = 'posterior-leaf-spring-AFO';
  else if (condition === 'knee-OA') prescription = 'unloader-knee-orthosis-and-PT';
  else if (condition === 'scoliosis') prescription = 'Boston-or-Cheneau-brace';
  else prescription = 'standard-orthotic-prescription';
  return { prescription, recommendation: 'certified-orthotist-and-physiatrist' };
};

Engine.OrthoticScoliosis = function ({ cobbAngle = 30, age = 12, growth = 'Risser-2', curvePattern = 'thoracic' } = {}) {
  let plan;
  if (cobbAngle >= 45) plan = 'spine-fusion-eval-not-brace';
  else if (cobbAngle >= 25 && growth !== 'Risser-5' && age < 16) plan = 'TLSO-full-time-18-to-23-hours';
  else if (cobbAngle >= 20 && age < 14) plan = 'TLSO-night-time-or-part-time';
  else if (cobbAngle < 20) plan = 'observation-and-physiotherapy';
  else if (growth === 'Risser-5') plan = 'observation-and-physiotherapy';
  else plan = 'scoliosis-team-eval';
  return { plan, recommendation: 'orthotist-and-pediatric-spine-team' };
};

Engine.ProstheticGait = function ({ deviation = 'lateral-trunk-bend', prostheticSide = 'right', weeksPost = 6 } = {}) {
  let result;
  if (deviation === 'lateral-trunk-bend' && prostheticSide === 'right') result = 'right-prosthesis-short-or-socket-loose';
  else if (deviation === 'lateral-trunk-bend' && prostheticSide === 'left') result = 'left-prosthesis-short-or-socket-loose';
  else if (deviation === 'circumduction') result = 'prosthesis-too-long-or-knee-stiff';
  else if (deviation === 'wide-based') result = 'balance-or-suspension-issue';
  else if (deviation === 'foot-slap' || deviation === 'knee-buckling') result = 'knee-component-or-heel-softness';
  else result = 'standard-gait-eval';
  return { result, recommendation: 'prosthetist-and-PT-gait-re-training' };
};

Engine.ProstheticTraining = function ({ phase = 'pre-prosthetic', weeksPost = 4, level = 'trans-tibial', comorbidity = 'none' } = {}) {
  let plan;
  if (phase === 'pre-prosthetic') plan = 'pre-prosthetic-PT-stump-conditioning-and-ROM';
  else if (phase === 'initial-donning' && weeksPost < 4) plan = 'donning-and-doffing-and-skin-care';
  else if (phase === 'gait-training' && level === 'trans-tibial') plan = 'TT-gait-training-parallel-bars-to-community';
  else if (phase === 'gait-training' && level === 'trans-femoral') plan = 'TF-gait-training-and-knee-control';
  else if (phase === 'advanced' && comorbidity === 'none') plan = 'community-ambulation-and-stair-and-ramp';
  else if (comorbidity === 'cardiac' || comorbidity === 'elderly') plan = 'low-intensity-gait-with-telemetry';
  else plan = 'standard-prosthetic-training';
  return { plan, recommendation: 'PT-and-prosthetist-team' };
};

Engine.OrthoticComplications = function ({ skinBreakdown = false, pistoning = false, volumeChange = false, pain = 'none' } = {}) {
  let result;
  if (skinBreakdown && pain === 'severe') result = 'stop-wear-and-orthotist-revisit';
  else if (skinBreakdown) result = 'skin-care-and-pad-and-revisit';
  else if (pistoning) result = 'add-suspension-or-socks';
  else if (volumeChange) result = 'volume-management-and-new-socket';
  else if (pain === 'moderate') result = 'pad-and-revisit-and-check-fit';
  else if (pain === 'mild') result = 'monitor-and-skin-check';
  else result = 'no-complication';
  return { result, recommendation: 'follow-up-orthotist-2-to-4-weeks' };
};

Engine.ActivityKLevel = function ({ community = true, household = false, age = 30, comorbidity = 'none' } = {}) {
  let level;
  if (community && age < 65 && comorbidity === 'none') level = 'K3-varied-community-and-recreational';
  else if (community && age < 65) level = 'K3-modified-or-varied-community';
  else if (community) level = 'K2-limited-community';
  else if (household) level = 'K1-household-ambulator';
  else level = 'K0-non-ambulator-not-prosthetic-candidate';
  return { level, recommendation: `${level}-K-and-componentry` };
};

Engine.PediatricProsthetic = function ({ age = 4, level = 'trans-radial', side = 'right', etiology = 'congenital' } = {}) {
  let plan;
  if (etiology === 'congenital' && age < 2) plan = 'passive-prosthesis-and-family-training';
  else if (etiology === 'congenital' && age >= 2 && age < 6) plan = 'body-powered-pediatric-prosthesis';
  else if (age < 12 && level === 'trans-radial') plan = 'myoelectric-pediatric-and-OT';
  else if (age < 12) plan = 'activity-specific-prosthesis-and-sports';
  else if (etiology === 'trauma') plan = 'definitive-prosthesis-and-PT';
  else plan = 'standard-pediatric-prosthetic';
  return { plan, recommendation: 'pediatric-prosthetist-and-OT' };
};

Engine.DeviceFollowup = function ({ monthsFit = 3, skin = 'intact', funcStatus = 'improved', volume = 'stable' } = {}) {
  let plan;
  if (monthsFit >= 12 && funcStatus === 'improved' && volume === 'stable') plan = 'annual-followup-and-pediatric-replace-12-to-18-months';
  else if (funcStatus === 'declined') plan = 're-eval-and-possible-replacement';
  else if (volume === 'changed' && skin === 'intact') plan = 'socket-adjustment-or-liner-replace';
  else if (skin !== 'intact') plan = 'urgent-orthotist-or-prosthetist-eval';
  else if (monthsFit < 3) plan = 'regular-followup-every-2-to-4-weeks';
  else plan = 'standard-followup';
  return { plan, recommendation: 'followup-cadence' };
};

module.exports = Engine;
