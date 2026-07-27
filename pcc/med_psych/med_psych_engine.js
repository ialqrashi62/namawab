// P3-BC: Med-Psych Engine — 10 pure functions
const Engine = {};

Engine.DepressionScreen = function ({ phq9 = 12, duration = 6, risk = 'moderate' } = {}) {
  let classification;
  if (phq9 >= 20) classification = 'severe-depression';
  else if (phq9 >= 15) classification = 'moderately-severe-depression';
  else if (phq9 >= 10) classification = 'moderate-depression';
  else if (phq9 >= 5) classification = 'mild-depression';
  else classification = 'minimal-or-no-depression';
  return { classification, recommendation: 'psychiatry-and-pharm-and-therapy' };
};

Engine.AnxietyScreen = function ({ gad7 = 12, duration = 6, panic = 'no' } = {}) {
  let classification;
  if (gad7 >= 15) classification = 'severe-anxiety';
  else if (gad7 >= 10) classification = 'moderate-anxiety';
  else if (gad7 >= 5) classification = 'mild-anxiety';
  else classification = 'minimal-anxiety';
  if (panic === 'yes') classification = 'panic-disorder-screen-positive';
  return { classification, recommendation: 'CBT-and-SSRI-and-psych-eval' };
};

Engine.SuicideScreen = function ({ cssrs = 'low', plan = 'no', access = 'means', priorAttempt = 'no' } = {}) {
  let risk;
  if (cssrs === 'high' && plan === 'yes' && access === 'means') risk = 'imminent-high-risk-and-1-to-1-and-911';
  else if (cssrs === 'high' && plan === 'yes') risk = 'high-risk-and-hospitalization-eval';
  else if (cssrs === 'high' && priorAttempt === 'yes') risk = 'high-risk-and-close-followup';
  else if (cssrs === 'moderate' && access === 'means') risk = 'moderate-risk-means-restriction';
  else if (cssrs === 'moderate') risk = 'moderate-risk-and-safety-plan';
  else if (cssrs === 'low') risk = 'low-risk-and-monitor';
  else risk = 'unspecified';
  return { risk, recommendation: 'C-SSRS-and-safety-plan-and-988' };
};

Engine.DeliriumScreen = function ({ cam = 'positive', onset = 'acute', awareness = 'fluctuating', age = 75 } = {}) {
  let classification;
  if (cam === 'positive' && onset === 'acute' && awareness === 'fluctuating') classification = 'delirium-by-CAM-and-eval';
  else if (cam === 'positive' && age >= 75) classification = 'delirium-and-dementia-differential';
  else if (cam === 'negative' && age >= 75) classification = 'screen-negative-monitor';
  else if (onset === 'acute') classification = 'acute-confusion-and-organic-eval';
  else classification = 'unspecified';
  return { classification, recommendation: 'workup-and-non-pharm-and-eval' };
};

Engine.SubstanceUse = function ({ audit = 12, dast = 4, substance = 'alcohol' } = {}) {
  let classification;
  if (substance === 'alcohol' && audit >= 20) classification = 'alcohol-dependence';
  else if (substance === 'alcohol' && audit >= 8) classification = 'hazardous-drinking';
  else if (substance === 'drug' && dast >= 6) classification = 'SUD-severe';
  else if (substance === 'drug' && dast >= 3) classification = 'SUD-moderate';
  else if (substance === 'opioid' && dast >= 3) classification = 'OUD-and-MAT-eval';
  else classification = 'low-risk-or-no-SUD';
  return { classification, recommendation: 'MAT-or-rehab-and-SBIRT' };
};

Engine.PsychMed = function ({ med = 'SSRI', indication = 'depression', age = 35, renalHepatic = 'normal' } = {}) {
  let plan;
  if (med === 'SSRI' && indication === 'depression' && age < 25) plan = 'SSRI-with-black-box-and-monitor-suicide';
  else if (med === 'SSRI' && renalHepatic !== 'normal') plan = 'renal-or-hepatic-dose-adjust';
  else if (med === 'MAOI') plan = 'MAOI-and-tyramine-diet';
  else if (med === 'benzodiazepine' && age >= 65) plan = 'benzodiazepine-Beers-and-avoid';
  else if (med === 'antipsychotic' && age >= 65) plan = 'antipsychotic-and-metabolic-and-Beers';
  else if (med === 'lithium' && renalHepatic !== 'normal') plan = 'lithium-level-and-avoid';
  else plan = 'standard-psych-med-monitor';
  return { plan, recommendation: 'psychiatry-and-pharm-monitoring' };
};

Engine.MedPsychConsult = function ({ reason = 'capacity', capacity = 'intact', decision = 'simple', adherence = 'partial' } = {}) {
  let plan;
  if (reason === 'capacity' && capacity === 'impaired') plan = 'capacity-eval-and-surrogate';
  else if (reason === 'depression-post-MI') plan = 'post-MI-depression-and-CENTRIA';
  else if (reason === 'delirium') plan = 'delirium-workup-and-organic-eval';
  else if (reason === 'non-adherence') plan = 'motivation-and-MI-and-barriers';
  else if (reason === 'adjustment') plan = 'adjustment-disorder-and-supportive';
  else plan = 'standard-consult';
  return { plan, recommendation: 'psych-liaison-team-and-eval' };
};

Engine.SeriousMentalIllness = function ({ dx = 'schizophrenia', medsCompliant = 'partial', housing = 'stable', social = 'isolated' } = {}) {
  let plan;
  if (dx === 'schizophrenia' && medsCompliant === 'no' && housing === 'unstable') plan = 'ACT-team-and-CMOT';
  else if (dx === 'schizophrenia' && social === 'isolated') plan = 'peer-support-and-clubhouse';
  else if (dx === 'bipolar' && medsCompliant === 'no') plan = 'CMOT-and-IMR';
  else if (dx === 'schizoaffective') plan = 'CARE-team-and-Case-mgmt';
  else if (housing === 'unstable') plan = 'housing-first-and-team';
  else plan = 'standard-SMI-care';
  return { plan, recommendation: 'SMI-team-and-evidence-based-services' };
};

Engine.MedPsychPed = function ({ age = 8, dx = 'ADHD', school = 'struggling', parent = 'engaged' } = {}) {
  let plan;
  if (dx === 'ADHD' && school === 'struggling' && parent === 'engaged') plan = 'stimulant-and-parent-training-and-school-504';
  else if (dx === 'ADHD' && parent === 'depleted') plan = 'behavioral-parent-training-and-eval';
  else if (dx === 'anxiety' && age < 12) plan = 'CBT-and-parent-anxiety-management';
  else if (dx === 'depression' && age >= 12) plan = 'CBT-and-SSRI-and-family';
  else if (dx === 'autism' && school === 'struggling') plan = 'autism-eval-and-IEP-support';
  else plan = 'standard-pediatric-medpsych';
  return { plan, recommendation: 'CAP-and-pediatric-psych' };
};

Engine.PsychOutcome = function ({ prePhq9 = 18, postPhq9 = 8, preFunction = 30, postFunction = 50, weeksElapsed = 8 } = {}) {
  const phq9Delta = prePhq9 - postPhq9;
  const phq9Pct = (phq9Delta / prePhq9) * 100;
  const funcDelta = postFunction - preFunction;
  let result;
  if (phq9Pct >= 50 && funcDelta >= 15) result = 'large-depression-recovery-and-functional-gain';
  else if (phq9Pct >= 30 || funcDelta >= 10) result = 'moderate-improvement';
  else if (phq9Pct >= 10 || funcDelta >= 5) result = 'small-improvement';
  else if (phq9Pct < 0) result = 'no-improvement-or-worsening';
  else result = 'plateau-or-stable';
  return { phq9Delta, phq9Pct: Math.round(phq9Pct), funcDelta, result, recommendation: result.includes('large') || result.includes('moderate') ? 'maintain-and-taper' : 'modify-or-evaluate' };
};

module.exports = Engine;
