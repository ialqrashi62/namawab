// P3-BA: Chronic-Pain-Rehab Engine — 10 pure functions
const Engine = {};

Engine.PainBiopsychosocial = function ({ painDuration = 6, bpsDomains = { emotional: 'high', social: 'moderate', functional: 'low' } } = {}) {
  let plan;
  if (painDuration >= 6 && bpsDomains.emotional === 'high') plan = 'interdisciplinary-pain-rehab-and-CBT';
  else if (painDuration >= 3 && bpsDomains.social === 'high') plan = 'social-reintegration-and-OT';
  else if (painDuration >= 3 && bpsDomains.functional === 'low') plan = 'PT-and-functional-restoration';
  else if (bpsDomains.emotional === 'moderate') plan = 'CBT-and-mindfulness-and-pharm';
  else plan = 'standard-pain-eval';
  return { plan, recommendation: `${plan}-${painDuration}-months` };
};

Engine.OpioidStewardship = function ({ morphineEquivalent = 50, duration = 12, indication = 'chronic-non-cancer', risk = 'moderate' } = {}) {
  let plan;
  if (indication === 'cancer' && risk === 'low') plan = 'cancer-pain-Opioid-appropriate';
  else if (indication === 'end-of-life') plan = 'end-of-life-palliative-Opioid-appropriate';
  else if (morphineEquivalent >= 90) plan = 'high-dose-Opioid-taper-recommend';
  else if (duration >= 12 && risk !== 'low') plan = 'long-term-Opioid-eval-taper-or-rotation';
  else if (risk === 'high') plan = 'high-risk-Opioid-taper-and-naloxone';
  else if (risk === 'moderate') plan = 'monitor-and-consider-taper';
  else plan = 'continue-and-monitor';
  return { plan, recommendation: 'PDMP-check-and-UDS-eval' };
};

Engine.PainMedication = function ({ medClass = 'NSAID', giRisk = 'moderate', renal = 'normal', duration = 30 } = {}) {
  let plan;
  if (medClass === 'NSAID' && renal !== 'normal') plan = 'NSAID-contraindicated-consider-acetaminophen';
  else if (medClass === 'NSAID' && giRisk === 'high') plan = 'NSAID-with-PPI-or-avoid';
  else if (medClass === 'gabapentinoid' && renal !== 'normal') plan = 'renal-dose-gabapentin-and-monitor';
  else if (medClass === 'muscle-relaxant') plan = 'short-term-only-baclofen-or-tizanidine';
  else if (medClass === 'antidepressant-SNRI' && duration >= 60) plan = 'monitor-BP-and-liver-function';
  else if (medClass === 'opioid') plan = 'opioid-stewardship-protocol';
  else plan = 'standard-medication-eval';
  return { plan, recommendation: 'pharmacy-and-pain-team-review' };
};

Engine.FunctionalRestoration = function ({ oswestry = 40, pcm = 'cannot', returnToWork = 'no', weeksIn = 4 } = {}) {
  let plan;
  if (oswestry >= 50 && returnToWork === 'no') plan = 'intensive-FRP-3-to-4-weeks-full-day';
  else if (oswestry >= 30 && pcm === 'limited') plan = 'standard-FRP-and-quota-based-exercise';
  else if (oswestry < 30) plan = 'maintenance-and-self-management';
  else if (returnToWork === 'no' && weeksIn >= 8) plan = 'vocational-rehab-and-FCE';
  else plan = 'standard-FRP-protocol';
  return { plan, recommendation: 'interdisciplinary-pain-team' };
};

Engine.PainEducation = function ({ healthLiteracy = 'high', motivation = 'high', fear = 'low' } = {}) {
  let plan;
  if (fear === 'high') plan = 'graded-exposure-and-pain-neuroscience-education';
  else if (healthLiteracy === 'low') plan = 'visual-and-metaphor-pain-education';
  else if (motivation === 'low') plan = 'MI-and-stages-of-change-interview';
  else if (healthLiteracy === 'high' && fear === 'low') plan = 'comprehensive-pain-neuroscience-and-self-management';
  else plan = 'standard-pain-education';
  return { plan, recommendation: 'PNE-graded-1-to-2-sessions' };
};

Engine.PainInterventional = function ({ indication = 'radiculopathy', severity = 6, conservativeWeeks = 6 } = {}) {
  let plan;
  if (conservativeWeeks < 6) plan = 'continue-conservative-and-reassess';
  else if (indication === 'radiculopathy' && severity >= 7) plan = 'epidural-steroid-injection-eval';
  else if (indication === 'facet-arthropathy') plan = 'medial-branch-block-and-RFA-eval';
  else if (indication === 'CRPS') plan = 'stellate-ganglion-or-LSB-and-PT';
  else if (indication === 'spinal-cord-stim') plan = 'SCS-trial-if-refractory-and-psych-clearance';
  else plan = 'standard-interventional-eval';
  return { plan, recommendation: 'interventional-pain-team-eval' };
};

Engine.PainPedi = function ({ age = 8, condition = 'CRPS', parent = 'engaged', school = 'impacted' } = {}) {
  let plan;
  if (age < 6 && parent === 'engaged') plan = 'parent-led-desensitization-and-PT';
  else if (age < 12 && condition === 'CRPS' && school === 'impacted') plan = 'CRPS-intense-PT-and-graded-exposure';
  else if (age < 12) plan = 'playful-PT-and-family-therapy';
  else if (age < 18 && condition === 'functional-abdominal') plan = 'FBT-and-CBT';
  else if (age >= 12) plan = 'CBT-and-graded-exercise-and-family';
  else plan = 'standard-pediatric-pain-rehab';
  return { plan, recommendation: 'pediatric-pain-team-and-psych' };
};

Engine.PainAndSleep = function ({ insomnia = 'moderate', painPeak = 'evening', sleepHygiene = 'poor' } = {}) {
  let plan;
  if (insomnia === 'severe' && sleepHygiene === 'poor') plan = 'CBT-I-and-sleep-restriction-and-stim-control';
  else if (painPeak === 'night' && insomnia === 'moderate') plan = 'long-acting-analgesic-at-bedtime';
  else if (sleepHygiene === 'poor') plan = 'sleep-hygiene-and-environment-mod';
  else if (insomnia === 'moderate') plan = 'CBT-I-and-melatonin-eval';
  else plan = 'monitor-sleep';
  return { plan, recommendation: 'sleep-medicine-or-CBT-I-referral' };
};

Engine.PainDosing = function ({ minutesPerSession = 60, sessionsPerWeek = 3, weeks = 4 } = {}) {
  const totalHours = (minutesPerSession * sessionsPerWeek * weeks) / 60;
  let intensity;
  if (totalHours >= 36) intensity = 'intensive-pain-rehab';
  else if (totalHours >= 18) intensity = 'standard-pain-rehab';
  else if (totalHours >= 6) intensity = 'maintenance-pain-rehab';
  else intensity = 'supportive-pain-rehab';
  return { totalHours, intensity, recommendation: `${intensity}-${weeks}-weeks` };
};

Engine.PainOutcome = function ({ preNRS = 8, postNRS = 4, prePEG = 7, postPEG = 3, weeksElapsed = 12 } = {}) {
  const nrsDelta = preNRS - postNRS;
  const nrsPct = (nrsDelta / preNRS) * 100;
  const pegDelta = prePEG - postPEG;
  let result;
  if (nrsPct >= 50 && pegDelta >= 3) result = 'large-pain-reduction-and-functional-gain';
  else if (nrsPct >= 30 || pegDelta >= 2) result = 'moderate-pain-or-functional-improvement';
  else if (nrsPct >= 10 || pegDelta >= 1) result = 'small-improvement';
  else if (nrsPct < 0) result = 'no-improvement-or-worsening';
  else result = 'plateau-or-stable';
  return { nrsDelta, nrsPct: Math.round(nrsPct), pegDelta, result, recommendation: result.includes('large') || result.includes('moderate') ? 'maintain-and-taper' : 'modify-or-evaluate' };
};

module.exports = Engine;
