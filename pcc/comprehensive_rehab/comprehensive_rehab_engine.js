// P3-BD: Comprehensive-Rehab Engine — 10 pure functions
const Engine = {};

Engine.ComprehensiveRehab = function ({ dx = 'stroke', weeks = 6, priorFIM = 80, currentFIM = 100, goal = 'home' } = {}) {
  let plan;
  if (dx === 'stroke' && weeks >= 6 && currentFIM >= 100 && goal === 'home') plan = 'comprehensive-stroke-rehab-and-discharge';
  else if (dx === 'TBI' && weeks < 12) plan = 'intensive-TBI-rehab-and-psych';
  else if (dx === 'SCI' && weeks >= 12) plan = 'SCI-rehab-and-discharge-or-LTAC';
  else if (dx === 'amputee') plan = 'amputee-rehab-and-prosthetic';
  else if (dx === 'joint-replacement') plan = 'joint-replacement-rehab-and-HH';
  else if (currentFIM - priorFIM >= 20) plan = 'high-progress-and-progress-protocol';
  else if (currentFIM - priorFIM < 5 && weeks >= 8) plan = 'plateau-and-modify-or-discharge';
  else plan = 'standard-comprehensive-rehab';
  return { plan, recommendation: 'interdisciplinary-team-and-eval' };
};

Engine.FIMScore = function ({ motor = 50, cognition = 25, age = 60 } = {}) {
  let total = motor + cognition;
  let classification;
  if (total >= 100) classification = 'near-independent-or-modified-independent';
  else if (total >= 80) classification = 'modified-dependence';
  else if (total >= 50) classification = 'moderate-dependence';
  else if (total >= 30) classification = 'severe-dependence';
  else classification = 'very-severe-dependence';
  return { total, classification, recommendation: 'PT-OT-SLP-team-and-FIM-tracking' };
};

Engine.WeissFIMGain = function ({ admissionFIM = 60, dischargeFIM = 95, lengthOfStay = 28, dx = 'stroke' } = {}) {
  const fimGain = dischargeFIM - admissionFIM;
  const fcm = fimGain / lengthOfStay;
  let result;
  if (dx === 'stroke' && fcm >= 1.5) result = 'high-FIM-efficiency-stroke';
  else if (dx === 'stroke' && fcm >= 1.0) result = 'moderate-FIM-efficiency-stroke';
  else if (fcm >= 1.2) result = 'high-FIM-efficiency';
  else if (fcm >= 0.8) result = 'moderate-FIM-efficiency';
  else if (fcm >= 0.5) result = 'low-FIM-efficiency';
  else if (fcm < 0.5) result = 'very-low-FIM-efficiency-and-eval';
  return { fimGain, fcm: Math.round(fcm * 10) / 10, result, recommendation: 'IRF-team-and-quality-improvement' };
};

Engine.PTIntensity = function ({ sessionsPerDay = 2, minutesPerSession = 30, weeks = 4 } = {}) {
  const totalHours = (sessionsPerDay * minutesPerSession * 7 * weeks) / 60;
  let intensity;
  if (totalHours >= 56) intensity = 'high-intensity-PT-3-hours-day';
  else if (totalHours >= 28) intensity = 'standard-PT-2-hours-day';
  else if (totalHours >= 14) intensity = 'low-intensity-PT-1-hour-day';
  else intensity = 'minimal-PT-monitor';
  return { totalHours, intensity, recommendation: 'CMS-3-hour-rule-and-team' };
};

Engine.OT = function ({ goal = 'ADL', adlScore = 4, weeks = 3 } = {}) {
  let plan;
  if (goal === 'ADL' && adlScore <= 3) plan = 'ADL-training-and-adapted-equipment';
  else if (goal === 'IADL' && adlScore >= 5) plan = 'IADL-community-reintegration';
  else if (goal === 'UE-function') plan = 'UE-AROM-and-AAROM-and-task-practice';
  else if (goal === 'home-safety') plan = 'home-safety-eval-and-modifications';
  else if (weeks < 2) plan = 'short-stay-OT-and-discharge';
  else plan = 'standard-OT-protocol';
  return { plan, recommendation: 'OT-and-discharge-planning' };
};

Engine.SLP = function ({ goal = 'dysphagia', diet = 'NPO', cog = 'mild-impairment' } = {}) {
  let plan;
  if (goal === 'dysphagia' && diet === 'NPO') plan = 'MBSS-and-dysphagia-therapy';
  else if (goal === 'dysphagia' && diet !== 'PO') plan = 'upgrade-diet-and-MBSS';
  else if (goal === 'aphasia') plan = 'aphasia-therapy-and-MIT-or-script';
  else if (goal === 'cognition' && cog === 'severe-impairment') plan = 'cognitive-therapy-and-compensatory';
  else if (goal === 'cognition' && cog === 'mild-impairment') plan = 'compensatory-strategies-and-tasks';
  else plan = 'standard-SLP-protocol';
  return { plan, recommendation: 'SLP-and-MD-team' };
};

Engine.RehabTeam = function ({ setting = 'IRF', staff = 'interdisciplinary', family = 'engaged', intensity = '3-hours' } = {}) {
  let plan;
  if (setting === 'IRF' && staff === 'interdisciplinary' && intensity === '3-hours') plan = 'standard-IRF-team-and-CMS-rule';
  else if (setting === 'IRF' && intensity !== '3-hours') plan = 'intensity-eval-and-3-hour-rule';
  else if (setting === 'SNF') plan = 'SNF-team-and-lower-intensity';
  else if (setting === 'LTACH') plan = 'LTACH-team-and-vent-or-complex';
  else if (family === 'engaged') plan = 'family-centered-and-team';
  else plan = 'standard-team';
  return { plan, recommendation: 'team-conference-and-family-meeting' };
};

Engine.RehabDischarge = function ({ fim = 100, homeSupport = 'family', equipment = 'obtained', homeMods = 'complete' } = {}) {
  let plan;
  if (fim >= 100 && homeSupport === 'family' && equipment === 'obtained' && homeMods === 'complete') plan = 'ready-for-discharge-home';
  else if (homeSupport === 'family' && equipment === 'obtained') plan = 'pending-home-mods-and-discharge';
  else if (homeSupport === 'none') plan = 'HH-and-caregiver-eval-and-discharge';
  else if (fim < 80) plan = 'SNF-or-LTAC-and-further-rehab';
  else if (homeMods !== 'complete') plan = 'pending-home-mods';
  else plan = 'partial-discharge-monitor';
  return { plan, recommendation: 'discharge-with-HH-and-family-training' };
};

Engine.RehabOutcome = function ({ preFIM = 50, postFIM = 100, preBarthel = 30, postBarthel = 70, weeksElapsed = 6 } = {}) {
  const fimDelta = postFIM - preFIM;
  const fimPct = (fimDelta / preFIM) * 100;
  const barthelDelta = postBarthel - preBarthel;
  let result;
  if (fimPct >= 80 && barthelDelta >= 30) result = 'large-functional-recovery';
  else if (fimPct >= 50 || barthelDelta >= 20) result = 'moderate-functional-recovery';
  else if (fimPct >= 20 || barthelDelta >= 10) result = 'small-functional-recovery';
  else if (fimPct < 0) result = 'no-recovery-or-worsening';
  else result = 'plateau-or-stable';
  return { fimDelta, fimPct: Math.round(fimPct), barthelDelta, result, recommendation: result.includes('large') || result.includes('moderate') ? 'discharge-with-HH' : 'modify-or-evaluate' };
};

Engine.RehabPayment = function ({ setting = 'IRF', payer = 'Medicare', caseload = 'mix' } = {}) {
  let plan;
  if (setting === 'IRF' && payer === 'Medicare') plan = 'IRF-PPS-and-60%-rule-and-3-hour';
  else if (setting === 'IRF' && payer === 'commercial') plan = 'commercial-UR-and-3-hour';
  else if (setting === 'SNF' && payer === 'Medicare') plan = 'SNF-PPS-and-PDPM-and-MDS';
  else if (setting === 'SNF' && payer === 'Medicaid') plan = 'SNF-Medicaid-RUG';
  else if (setting === 'LTACH') plan = 'LTACH-PPS-and-vent-or-complex';
  else if (caseload === 'low-utilization') plan = 'low-utilization-and-quality';
  else plan = 'standard-payment-eval';
  return { plan, recommendation: 'UR-and-CDI-team' };
};

module.exports = Engine;
