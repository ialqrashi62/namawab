// P3-BC: Home-Health Engine — 10 pure functions
const Engine = {};

Engine.HomeHealthEligibility = function ({ age = 75, postAcute = 'yes', homebound = 'homebound', skilledNeed = 'skilled-nursing' } = {}) {
  let eligibility;
  if (homebound === 'homebound' && skilledNeed === 'skilled-nursing' && postAcute === 'yes') eligibility = 'eligible-Medicare-HH-30-day-cert';
  else if (homebound === 'homebound' && skilledNeed === 'PT') eligibility = 'eligible-Medicare-HH-PT';
  else if (homebound === 'homebound-with-effort' && skilledNeed === 'skilled-nursing') eligibility = 'borderline-eval';
  else if (homebound === 'community-ambulator') eligibility = 'not-eligible-not-homebound';
  else if (skilledNeed === 'no-skilled-need') eligibility = 'not-eligible-no-skilled-need';
  else eligibility = 'eval-pending';
  return { eligibility, recommendation: 'CMS-OASIS-eval-and-certification' };
};

Engine.OASISAssessment = function ({ functional = 50, mobility = 'limited', cognition = 'normal', wounds = 'none', pain = 4 } = {}) {
  let risk;
  if (functional < 30 && mobility === 'bedbound') risk = 'high-risk-functional-decline';
  else if (wounds === 'stage-3-or-4') risk = 'wound-high-risk-OASIS-M-relevant';
  else if (pain >= 7) risk = 'pain-high-risk-OASIS-M-relevant';
  else if (functional >= 50 && mobility === 'limited' && pain < 7) risk = 'moderate-risk-OASIS-M-eval';
  else if (cognition === 'mild-impairment' && functional >= 50) risk = 'cognitive-mild-risk-OASIS-M';
  else risk = 'standard-OASIS-eval';
  return { risk, recommendation: 'OASIS-E-start-of-care-and-M-and-Outcomes' };
};

Engine.HomePT = function ({ phase = 'HHA-PT', sessionsPerWeek = 3, weeks = 4, goal = 'community-mobility' } = {}) {
  let plan;
  if (phase === 'HHA-PT' && goal === 'community-mobility') plan = 'community-mobility-and-ambulation-2-to-3x-week';
  else if (phase === 'HHA-PT' && goal === 'transfer') plan = 'transfer-training-and-bed-mobility';
  else if (phase === 'HHA-PT' && goal === 'balance') plan = 'home-balance-and-falls-prevention';
  else if (phase === 'HHA-OT') plan = 'ADL-and-IADL-home-safety';
  else if (phase === 'HHA-SLP') plan = 'home-SLP-and-swallow-or-cognition';
  else if (sessionsPerWeek >= 3 && weeks < 4) plan = 'short-term-PT-and-progress';
  else plan = 'standard-home-PT-protocol';
  return { plan, recommendation: 'discharge-to-outpatient-or-HH' };
};

Engine.HomeHealthNursing = function ({ dx = 'CHF', visitsPerWeek = 3, weeks = 4, medTeach = 'yes' } = {}) {
  let plan;
  if (dx === 'CHF') plan = 'CHF-HHNPV-and-daily-weights-and-diuretic';
  else if (dx === 'COPD') plan = 'COPD-HHNPV-and-O2-and-pulse-ox';
  else if (dx === 'diabetes') plan = 'diabetes-HHNPV-and-glucose-monitoring';
  else if (dx === 'wound') plan = 'wound-HHNPV-and-dressing-changes';
  else if (dx === 'post-surgical') plan = 'post-surgical-HHNPV-and-OSI';
  else if (medTeach === 'yes') plan = 'medication-teach-and-reconciliation';
  else plan = 'standard-HHNPV-protocol';
  return { plan, recommendation: 'HHNPV-team-and-supervising-RN' };
};

Engine.MedicationReconciliation = function ({ medCount = 8, duplications = 1, otcHerbs = 3, caregiver = 'present' } = {}) {
  let plan;
  if (medCount >= 10 && duplications >= 2) plan = 'extensive-reconciliation-and-pharmacy-referral';
  else if (medCount >= 5 && otcHerbs >= 3) plan = 'comprehensive-medication-review';
  else if (caregiver === 'none' && medCount >= 5) plan = 'medication-box-and-pill-burden-eval';
  else if (duplications >= 1) plan = 'duplicate-class-eval-and-discuss';
  else if (medCount < 5) plan = 'standard-reconciliation';
  else plan = 'standard-medication-reconciliation';
  return { plan, recommendation: 'pharmacy-and-MD-review' };
};

Engine.HomeHealthDischarge = function ({ goalsMet = 'yes', familyTrained = 'yes', communityResources = 'set', followup = 'scheduled' } = {}) {
  let plan;
  if (goalsMet === 'yes' && familyTrained === 'yes' && communityResources === 'set' && followup === 'scheduled') plan = 'ready-for-discharge-comprehensive-plan';
  else if (goalsMet !== 'yes') plan = 'pending-goals-met';
  else if (familyTrained !== 'yes') plan = 'pending-family-caregiver-training';
  else if (communityResources !== 'set') plan = 'pending-community-resources';
  else if (followup !== 'scheduled') plan = 'pending-followup-and-PCP-coord';
  else plan = 'partial-discharge-monitor';
  return { plan, recommendation: 'discharge-to-PCP-and-services' };
};

Engine.HomeHealthOutcome = function ({ preOASIS = 50, postOASIS = 65, scale = 'M1860-ambulation', weeksElapsed = 6 } = {}) {
  const delta = postOASIS - preOASIS;
  const pctChange = (delta / preOASIS) * 100;
  let result;
  if (pctChange >= 50) result = 'large-functional-improvement';
  else if (pctChange >= 30) result = 'moderate-improvement';
  else if (pctChange >= 10) result = 'small-improvement';
  else if (pctChange >= 0) result = 'plateau-or-stable';
  else result = 'no-improvement-or-worsening';
  return { delta, pctChange: Math.round(pctChange), result, recommendation: result.includes('large') || result.includes('moderate') ? 'continue-and-progress' : 'modify-or-evaluate' };
};

Engine.HomeHealthWound = function ({ woundType = 'surgical', visitsPerWeek = 3, weeks = 4 } = {}) {
  let plan;
  if (woundType === 'surgical' && visitsPerWeek >= 3) plan = 'surgical-wound-HHNPV-and-sterile-technique';
  else if (woundType === 'pressure' && visitsPerWeek >= 3) plan = 'PI-HHNPV-and-offloading';
  else if (woundType === 'venous') plan = 'venous-stasis-HHNPV-and-compression';
  else if (woundType === 'arterial') plan = 'arterial-wound-and-vascular-eval';
  else plan = 'standard-wound-HH-protocol';
  return { plan, recommendation: 'WOCN-team-and-physician' };
};

Engine.HomeHealthCardiac = function ({ dx = 'CHF', ejectionFraction = 30, medsCompliant = 'partial' } = {}) {
  let plan;
  if (dx === 'CHF' && ejectionFraction < 30 && medsCompliant === 'no') plan = 'high-risk-CHF-and-HH-and-CRT';
  else if (dx === 'CHF' && ejectionFraction < 50) plan = 'CHF-HH-and-titration-team';
  else if (dx === 'post-MI') plan = 'post-MI-HH-and-CR-referral';
  else if (dx === 'CABG') plan = 'CABG-HH-and-sternal-precautions';
  else if (dx === 'AFib') plan = 'AFib-HH-and-anticoag-monitoring';
  else plan = 'standard-cardiac-HH-protocol';
  return { plan, recommendation: 'cardiology-and-HH-team' };
};

Engine.HomeHealthPedi = function ({ age = 4, dx = 'prematurity', caregivers = 'present', technology = 'none' } = {}) {
  let plan;
  if (age < 3 && technology === 'none') plan = 'early-intervention-HH-and-developmental';
  else if (age < 3 && technology === 'apnea-monitor') plan = 'apnea-monitor-and-HH-monitoring';
  else if (age < 12 && dx === 'prematurity') plan = 'premature-HH-and-feeding-and-development';
  else if (age < 18 && technology === 'ventilator') plan = 'ventilator-dependent-HH-and-team';
  else if (caregivers === 'present') plan = 'family-centered-HH-and-respite';
  else plan = 'standard-pediatric-HH';
  return { plan, recommendation: 'pediatric-HH-team-and-MD' };
};

module.exports = Engine;
