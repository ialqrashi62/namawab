// P3-AQ: Sleep-Ext Engine — 10 pure functions
const Engine = {};

Engine.PolysomnographyInterpretation = function ({ apneaHypopneaIndex = 0, oxygenSaturation = 95, sleepEfficiency = 0.85, remPercentage = 20 } = {}) {
  let severity;
  if (apneaHypopneaIndex >= 30) severity = 'severe-OSA';
  else if (apneaHypopneaIndex >= 15) severity = 'moderate-OSA';
  else if (apneaHypopneaIndex >= 5) severity = 'mild-OSA';
  else severity = 'no-OSA';
  const o2Ok = oxygenSaturation >= 90;
  const sleepOk = sleepEfficiency >= 0.85;
  const remOk = remPercentage >= 20;
  return { severity, oxygenOk: o2Ok, sleepOk, remOk, recommendation: severity.includes('OSA') ? 'CPAP-titration-PSG' : 'reassess-if-symptoms' };
};

Engine.ESSScore = function ({ dozingWhileSitting = 0, watchingTV = 0, sittingInactive = 0, passenger = 0, lyingDown = 0, sittingTalking = 0, sittingAfterLunch = 0, traffic = 0 } = {}) {
  const total = dozingWhileSitting + watchingTV + sittingInactive + passenger + lyingDown + sittingTalking + sittingAfterLunch + traffic;
  let category;
  if (total <= 6) category = 'normal-daytime-sleepiness';
  else if (total <= 10) category = 'mild-excessive-sleepiness';
  else if (total <= 15) category = 'moderate-excessive-sleepiness';
  else category = 'severe-excessive-sleepiness';
  return { total, category, recommendation: total >= 10 ? 'sleep-study-indicated' : 'lifestyle-modifications' };
};

Engine.CPAPTitration = function ({ initialPressure = 5, apneaResidual = 5, leakPresent = false, pressureTolerance = 'good', ahilLevel = 0 } = {}) {
  let newPressure;
  let pathway;
  if (apneaResidual > 5 && ahilLevel > 15) { newPressure = initialPressure + 1; pathway = 'increase-pressure-residual-events'; }
  else if (apneaResidual > 5) { newPressure = initialPressure + 0.5; pathway = 'mild-increase'; }
  else if (apneaResidual < 1 && pressureTolerance === 'poor') { newPressure = Math.max(4, initialPressure - 0.5); pathway = 'decrease-pressure-tolerance'; }
  else if (leakPresent) { newPressure = initialPressure; pathway = 'fix-mask-leak-first'; }
  else { newPressure = initialPressure; pathway = 'maintain-pressure'; }
  return { newPressure: Math.round(newPressure * 10) / 10, pathway, recommendation: pathway.includes('increase') ? 'titrate-up' : 'maintain-or-fix-leak' };
};

Engine.InsomniaSeverity = function ({ difficultyFallingAsleep = 0, difficultyStaying = 0, earlyMorning = 0, satisfaction = 0, interference = 0, worry = 0 } = {}) {
  const total = difficultyFallingAsleep + difficultyStaying + earlyMorning + satisfaction + interference + worry;
  let severity;
  if (total <= 7) severity = 'no-insomnia';
  else if (total <= 14) severity = 'subthreshold-insomnia';
  else if (total <= 21) severity = 'moderate-insomnia';
  else severity = 'severe-insomnia';
  return { total, severity, recommendation: severity.includes('severe') || severity.includes('moderate') ? 'CBT-I-first-line-pharmacology-second' : 'sleep-hygiene' };
};

Engine.RestlessLegsSyndrome = function ({ urgeToMove = 0, worseAtRest = 0, reliefWithMovement = 0, sleepDisturbance = 0, frequency = 0 } = {}) {
  const total = urgeToMove + worseAtRest + reliefWithMovement + sleepDisturbance + frequency;
  let severity;
  if (total >= 16) severity = 'severe-RLS';
  else if (total >= 11) severity = 'moderate-RLS';
  else if (total >= 6) severity = 'mild-RLS';
  else severity = 'no-RLS';
  return { total, severity, recommendation: severity.includes('severe') || severity.includes('moderate') ? 'consider-dopamine-agonist-and-iron' : 'sleep-hygiene' };
};

Engine.NarcolepsyAssessment = function ({ excessiveDaytimeSleepiness = 0, cataplexy = false, sleepParalysis = false, hypnagogic = false, msltSleepLatency = 15 } = {}) {
  let pathway;
  if (excessiveDaytimeSleepiness >= 14 && cataplexy) pathway = 'narcolepsy-type-1-with-cataplexy';
  else if (excessiveDaytimeSleepiness >= 11 && msltSleepLatency < 8) pathway = 'narcolepsy-type-2';
  else if (excessiveDaytimeSleepiness >= 11) pathway = 'possible-narcolepsy-needs-MSLT';
  else pathway = 'no-narcolepsy';
  return { pathway, recommendation: pathway.includes('narcolepsy') ? 'neurology-and-modafinil-or-sodium-oxybate' : 'reassess' };
};

Engine.PediatricSleep = function ({ age = 5, parasomnia = false, nightTerrors = false, sleepWalking = false, bedtimeResistance = false, apneaSnoring = false } = {}) {
  let pathway;
  if (apneaSnoring) pathway = 'pediatric-OSA-sleep-study';
  else if (nightTerrors || sleepWalking) pathway = 'pediatric-parasomnia-reassure-and-safety';
  else if (bedtimeResistance && age < 5) pathway = 'behavioral-insomnia-parent-education';
  else if (parasomnia) pathway = 'pediatric-parasomnia-monitor';
  else if (age < 1) pathway = 'infant-sleep-consolidation';
  else pathway = 'normal-pediatric-sleep';
  return { pathway, recommendation: pathway.includes('OSA') ? 'pediatric-ENT' : 'parental-education-and-sleep-hygiene' };
};

Engine.ShiftWorkSleepDisorder = function ({ shiftType = 'night', sleepDuration = 5, insomnia = false, sleepiness = false, performance = 'normal' } = {}) {
  let pathway;
  if (shiftType === 'night' && sleepDuration < 6 && (insomnia || sleepiness)) pathway = 'SWSD-diagnosis-likely';
  else if (shiftType === 'rotating' && (insomnia || sleepiness)) pathway = 'SWSD-rotating-shifts';
  else if (shiftType === 'night') pathway = 'night-shift-monitor';
  else pathway = 'no-SWSD';
  return { pathway, recommendation: pathway.includes('SWSD-diagnosis') ? 'sleep-medicine-and-modafinil-or-light-therapy' : 'sleep-hygiene' };
};

Engine.CircadianRhythm = function ({ preferredSleepTime = 'normal', chronotype = 'intermediate', jetLag = false, dsps = false, asps = false } = {}) {
  let pathway;
  if (dsps) pathway = 'delayed-sleep-phase-syndrome';
  else if (asps) pathway = 'advanced-sleep-phase-syndrome';
  else if (jetLag) pathway = 'jet-lag-treat-with-melatonin-and-light';
  else if (chronotype === 'extreme-lark') pathway = 'morning-chronotype';
  else if (chronotype === 'extreme-owl') pathway = 'evening-chronotype';
  else pathway = 'normal-circadian';
  return { pathway, recommendation: pathway.includes('phase-syndrome') ? 'chronotherapy-and-light-therapy' : 'sleep-hygiene' };
};

Engine.SleepHygiene = function ({ consistentBedtime = true, screenTime = false, caffeine = false, exercise = 'regular', environment = 'good' } = {}) {
  let score = 0;
  if (consistentBedtime) score += 1;
  if (!screenTime) score += 1;
  if (!caffeine) score += 1;
  if (exercise === 'regular') score += 1;
  if (environment === 'good') score += 1;
  let assessment;
  if (score >= 5) assessment = 'excellent-sleep-hygiene';
  else if (score >= 3) assessment = 'good-sleep-hygiene';
  else if (score >= 1) assessment = 'poor-sleep-hygiene';
  else assessment = 'very-poor-sleep-hygiene';
  return { score, assessment, recommendation: score < 3 ? 'CBT-I-and-sleep-hygiene-counseling' : 'maintain' };
};

module.exports = Engine;
