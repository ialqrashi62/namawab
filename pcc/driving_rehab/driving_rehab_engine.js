// P3-AW: Driving-Rehab Engine — 10 pure functions
const Engine = {};

Engine.FitnessToDrive = function ({ vision = '20/40', cognition = 'normal', motor = 'intact', seizures = 'controlled', license = 'current' } = {}) {
  let status;
  if (vision === '20/40' && cognition === 'normal' && motor === 'intact' && license === 'current') status = 'fit-to-drive-without-restriction';
  else if (vision === '20/40' && seizures === 'controlled-1-year') status = 'fit-to-drive-with-restriction-period';
  else if (cognition === 'mild-impairment') status = 'restricted-license-daytime-local-only';
  else if (motor === 'amputee-prosthetic-fit') status = 'fit-with-adapted-controls-evaluation';
  else if (cognition === 'moderate-impairment' || vision === '20/100') status = 'not-fit-to-drive-rehab-potential';
  else if (seizures === 'uncontrolled') status = 'not-fit-driving-suspension';
  else status = 'refer-for-comprehensive-driving-evaluation';
  return { status, recommendation: status.includes('fit-without') ? 'annual-medical-clearance' : 'on-road-assessment-required' };
};

Engine.VisionDrive = function ({ visualAcuity = '20/40', visualField = 'normal', contrast = 'normal', glare = 'none' } = {}) {
  let result;
  if (visualAcuity === '20/40' && visualField === 'normal' && contrast === 'normal' && glare === 'none') result = 'meets-vision-requirements';
  else if (visualAcuity === '20/50' && visualField === 'normal') result = 'meets-most-states-bioptic-eval';
  else if (visualAcuity === '20/100') result = 'bioptic-telescope-eval-eligible';
  else if (visualField === 'hemianopia') result = 'visual-field-deficit-on-road-eval';
  else if (contrast === 'reduced' || glare === 'severe') result = 'contrast-glare-impaired';
  else result = 'vision-eval-needed';
  return { result, recommendation: result.includes('meets-vision') ? 'monitor-annually' : 'ophthalmology-and-bioptic-eval' };
};

Engine.CognitiveDrive = function ({ mmse = 28, trailMakingB = 90, clockDraw = 'normal' } = {}) {
  let result;
  if (mmse >= 27 && trailMakingB < 120 && clockDraw === 'normal') result = 'cognitive-fit-to-drive';
  else if (mmse >= 24 && trailMakingB < 180) result = 'mild-cognitive-impairment-on-road-eval';
  else if (mmse >= 20) result = 'moderate-cognitive-impairment-restricted-license';
  else if (mmse < 20) result = 'severe-cognitive-impairment-not-fit';
  else result = 'cognitive-eval-needed';
  return { result, recommendation: result.includes('fit') ? 'monitor' : 'neuro-psych-and-on-road-eval' };
};

Engine.MotorDrive = function ({ rom = 'full', strength = '5/5', sensation = 'intact', coordination = 'normal' } = {}) {
  let result;
  if (rom === 'full' && strength === '5/5' && sensation === 'intact' && coordination === 'normal') result = 'motor-fit-to-drive';
  else if (strength === '4/5' && coordination === 'normal') result = 'fit-with-adapted-controls';
  else if (sensation === 'reduced') result = 'sensory-deficit-on-road-eval';
  else if (rom === 'limited') result = 'limited-ROM-adapted-controls-eval';
  else if (coordination === 'ataxic') result = 'ataxia-on-road-eval-likely-restriction';
  else result = 'motor-eval-needed';
  return { result, recommendation: result.includes('fit') ? 'monitor' : 'OT-driving-evaluation' };
};

Engine.SeizureDrive = function ({ seizureFreeMonths = 12, lastEvent = 'generalized', medication = 'compliant', aura = true } = {}) {
  let result;
  if (seizureFreeMonths >= 6 && lastEvent === 'generalized' && medication === 'compliant') result = 'eligible-most-states-6-month-seizure-free';
  else if (seizureFreeMonths >= 3 && lastEvent === 'focal-impaired' && aura) result = 'eligible-with-aura-waiver-some-states';
  else if (seizureFreeMonths < 3) result = 'not-eligible-minimum-3-to-6-months-seizure-free';
  else if (medication === 'non-compliant') result = 'not-eligible-medication-non-compliance';
  else result = 'neurology-clearance-needed';
  return { result, recommendation: result.includes('eligible') ? 'neurology-clearance-letter' : 'suspension-and-neurology-follow-up' };
};

Engine.AdaptiveEquipment = function ({ handControl = 'right-only', lift = 'standard', spinnerKnob = false, leftGasBrake = false } = {}) {
  let equipment = [];
  if (handControl === 'right-only') equipment.push('right-hand-control-gas-and-brake');
  if (handControl === 'left-only') equipment.push('left-hand-control-gas-and-brake');
  if (lift === 'standard') equipment.push('standard-power-lift-or-ramp');
  if (spinnerKnob) equipment.push('spinner-knob-steering');
  if (leftGasBrake) equipment.push('left-gas-brake-pedal-extension');
  let certification;
  if (equipment.length === 0) certification = 'no-adaptive-equipment';
  else if (equipment.length === 1) certification = 'single-modification-certification';
  else if (equipment.length >= 2) certification = 'multi-modification-DMV-certified';
  return { equipment, certification, recommendation: 'CDRS-evaluation-and-DMV-modification-letter' };
};

Engine.OnRoadAssessment = function ({ roadTest = 'passed', errors = 0, instructor = 'CDRS-certified' } = {}) {
  let result;
  if (roadTest === 'passed' && errors === 0 && instructor === 'CDRS-certified') result = 'passed-on-road-driving-assessment';
  else if (roadTest === 'passed' && errors <= 3) result = 'passed-with-minor-errors-remediation';
  else if (roadTest === 'failed') result = 'failed-on-road-remedial-training-recommended';
  else if (errors >= 5) result = 'failed-multiple-critical-errors';
  else result = 'partial-pass-conditions';
  return { result, recommendation: result.includes('passed-without') ? 'license-reinstatement' : (result.includes('failed') ? 'remedial-driving-lessons' : 're-evaluation') };
};

Engine.DriverRehabPlan = function ({ deficit = 'vision', hoursTraining = 12, behindWheel = 8, simulator = 4 } = {}) {
  let plan;
  if (deficit === 'vision' && hoursTraining >= 10) plan = 'bioptic-training-and-on-road-eval';
  else if (deficit === 'cognitive' && hoursTraining >= 12) plan = 'cognitive-driving-rehab-and-on-road';
  else if (deficit === 'motor' && behindWheel >= 6) plan = 'motor-adaptive-controls-and-behind-wheel';
  else if (deficit === 'stroke' && simulator >= 4) plan = 'post-stroke-driving-simulator-and-behind-wheel';
  else if (deficit === 'amputee' && behindWheel >= 4) plan = 'amputee-driving-protocol-with-prosthetic';
  else plan = 'standard-driver-rehab-protocol';
  return { plan, recommendation: 'CDRS-supervised-driver-rehab-program' };
};

Engine.SeniorDriving = function ({ age = 75, reaction = 'normal', crashesLast5y = 0, mva = false } = {}) {
  let risk;
  if (age < 75) risk = 'low-risk-age';
  else if (age >= 75 && reaction === 'normal' && crashesLast5y === 0) risk = 'acceptable-risk-senior';
  else if (reaction === 'slow' || crashesLast5y >= 1) risk = 'elevated-risk-on-road-eval';
  else if (mva) risk = 'post-MVA-restricted-license';
  else if (age >= 85) risk = 'high-risk-on-road-eval';
  else risk = 'moderate-risk-senior';
  return { risk, recommendation: risk.includes('acceptable') ? 'annual-recheck' : 'on-road-eval-and-restricted-license' };
};

Engine.DVMSubmission = function ({ medicalLetter = true, roadEval = 'passed', adaptiveEval = 'complete', visionReport = true } = {}) {
  let status;
  if (medicalLetter && roadEval === 'passed' && adaptiveEval === 'complete' && visionReport) status = 'complete-submission-DMV-ready';
  else if (!medicalLetter) status = 'missing-medical-letter';
  else if (roadEval !== 'passed') status = 'missing-or-failed-road-eval';
  else if (adaptiveEval !== 'complete') status = 'missing-adaptive-equipment-eval';
  else if (!visionReport) status = 'missing-vision-report';
  else status = 'partial-submission';
  return { status, recommendation: status.includes('complete') ? 'submit-to-DMV-and-track' : 'complete-missing-documents' };
};

module.exports = Engine;
