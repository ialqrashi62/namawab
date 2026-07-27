// P3-BF: Transplant-Pediatric Engine — 10 pure functions
const Engine = {};

Engine.PediatricEval = function ({ organ = 'kidney', age = 8, weight = 25, etiology = 'congenital', status = 'elective' } = {}) {
  let plan;
  if (age < 2 && weight < 10) plan = 'too-small-and-pediatric-team-eval';
  else if (organ === 'kidney' && etiology === 'congenital') plan = 'pediatric-kidney-and-LRD-or-deceased';
  else if (organ === 'liver' && age < 2) plan = 'pediatric-liver-and-LDLT-or-split';
  else if (organ === 'heart' && age < 5) plan = 'pediatric-heart-and-status-1A-or-1B';
  else if (organ === 'lung' && age < 12) plan = 'pediatric-lung-and-eval';
  else if (status === 'urgent') plan = 'pediatric-urgent-transplant-and-team';
  else plan = 'standard-pediatric-eval';
  return { plan, recommendation: 'pediatric-transplant-team' };
};

Engine.PediatricLD = function ({ donor = 'parent', donorAge = 35, gfr = 100, weight = 60, blood = 'compatible' } = {}) {
  let plan;
  if (donor === 'parent' && gfr >= 90 && blood === 'compatible') plan = 'parent-to-child-LRD-and-eval';
  else if (donor === 'unrelated' && weight >= 30) plan = 'unrelated-LRD-and-eval';
  else if (donor === 'parent' && gfr < 90) plan = 'parent-eval-and-reconsider';
  else if (blood === 'incompatible') plan = 'ABOi-or-paired-exchange-eval';
  else plan = 'standard-pediatric-LD';
  return { plan, recommendation: 'pediatric-team-and-living-donor-eval' };
};

Engine.PediatricImmuno = function ({ age = 8, induction = 'basiliximab', regimen = 'tac-MMF', compliance = 'caregiver' } = {}) {
  let plan;
  if (age < 5 && induction === 'basiliximab') plan = 'basiliximab-and-low-MMF-and-tac';
  else if (age >= 5 && age < 12 && induction === 'rATG') plan = 'rATG-low-dose-and-tac-MMF';
  else if (age >= 12 && induction === 'rATG') plan = 'rATG-adult-dose-and-tac-MMF';
  else if (age < 5 && induction === 'rATG') plan = 'rATG-low-dose-and-tac-MMF-steroid';
  else if (regimen === 'tac-MMF' && compliance === 'caregiver') plan = 'tac-MMF-and-caregiver-supervised';
  else plan = 'standard-pediatric-IS';
  return { plan, recommendation: 'pediatric-transplant-pharm' };
};

Engine.PediatricGrowth = function ({ heightZ = -2, weightZ = -1, age = 8, steroids = 'low-dose' } = {}) {
  let plan;
  if (heightZ < -2 && steroids === 'low-dose') plan = 'GH-eval-and-steroid-minimization';
  else if (heightZ < -1 && weightZ < -1) plan = 'nutrition-and-GH-eval';
  else if (steroids === 'high-dose') plan = 'steroid-reduction-and-growth-eval';
  else if (heightZ >= -1) plan = 'normal-growth-and-monitor';
  else plan = 'standard-eval';
  return { plan, recommendation: 'pediatric-endocrine-and-transplant' };
};

Engine.PediatricAdherence = function ({ age = 14, missedDoses = 1, careGiver = 'engaged', school = 'impacted' } = {}) {
  let plan;
  if (age < 12 && missedDoses >= 3) plan = 'caregiver-administered-and-DME';
  else if (age >= 12 && missedDoses >= 5) plan = 'transition-and-adherence-team';
  else if (missedDoses >= 1 && school === 'impacted') plan = 'school-nurse-and-counsel';
  else if (careGiver === 'depleted') plan = 'caregiver-support-and-social-work';
  else if (missedDoses === 0) plan = 'good-adherence-and-monitor';
  else plan = 'standard-eval';
  return { plan, recommendation: 'pediatric-team-and-pharmacy' };
};

Engine.PediatricSchool = function ({ age = 8, school = 'mainstream', iep = 'no', absentee = 0 } = {}) {
  let plan;
  if (absentee >= 20) plan = 'homebound-tutor-and-school-reintegration';
  else if (iep === 'no' && school === 'mainstream') plan = 'IEP-eval-and-504-plan';
  else if (school === 'homebound') plan = 'homebound-and-gradual-return';
  else if (school === 'impacted-by-illness') plan = 'medical-absence-team-and-reentry';
  else plan = 'standard-school-support';
  return { plan, recommendation: 'school-nurse-and-counselor' };
};

Engine.PediatricVaccines = function ({ age = 8, transplant = 'pre', liveVaccine = 'eligible' } = {}) {
  let plan;
  if (transplant === 'pre' && liveVaccine === 'eligible') plan = 'live-vaccines-pre-transplant-and-MMR-and-Varicella';
  else if (transplant === 'post' && liveVaccine === 'contra') plan = 'avoid-live-vaccines-and-killed-vaccines';
  else if (transplant === 'pre' && age < 2) plan = 'routine-pediatric-and-accelerated';
  else if (transplant === 'post' && age >= 6) plan = 'COVID-and-flu-annual';
  else if (transplant === 'pre' && liveVaccine === 'exposure') plan = 'accelerated-and-complete-before-transplant';
  else plan = 'standard-vaccine';
  return { plan, recommendation: 'pediatric-team-and-ID-and-pharm' };
};

Engine.PediatricPTLD = function ({ organ = 'kidney', ebv = 'high-load', yearsPost = 3, mass = 'none' } = {}) {
  let plan;
  if (ebv === 'high-load' && yearsPost < 5) plan = 'high-EBV-load-and-IS-reduction';
  else if (mass === 'lymphadenopathy') plan = 'PTLD-suspect-and-bx';
  else if (mass === 'biopsy-proven-PTLD') plan = 'PTLD-rituximab-and-IS-reduction';
  else if (organ === 'bowel' && yearsPost >= 5) plan = 'late-PTLD-eval-and-stage';
  else if (ebv === 'low' && mass === 'none') plan = 'low-PTLD-risk-and-monitor';
  else plan = 'standard-eval';
  return { plan, recommendation: 'pediatric-team-and-oncology' };
};

Engine.PediatricTransition = function ({ age = 18, knowledge = 'partial', independence = 'low', parent = 'engaged' } = {}) {
  let plan;
  if (age >= 18 && knowledge === 'low') plan = 'structured-transition-and-readiness-assessment';
  else if (age >= 18 && independence === 'high' && parent === 'engaged') plan = 'gradual-transition-and-shared-clinic';
  else if (age < 18 && knowledge === 'low') plan = 'transition-readiness-curriculum';
  else if (age >= 21 && independence === 'low') plan = 'transition-eval-and-referral-to-adult';
  else if (age >= 16 && knowledge === 'high') plan = 'transition-and-self-management';
  else plan = 'standard-eval';
  return { plan, recommendation: 'pediatric-and-adult-transition-team' };
};

Engine.PediatricOutcome = function ({ graftSurvival = 95, growthZ = -1, qolScore = 80, neurodev = 'normal' } = {}) {
  let result;
  if (graftSurvival >= 95 && growthZ >= -1 && qolScore >= 80 && neurodev === 'normal') result = 'excellent-pediatric-outcome';
  else if (graftSurvival >= 90 && qolScore >= 70) result = 'good-pediatric-outcome';
  else if (graftSurvival >= 80) result = 'standard-pediatric-outcome';
  else if (graftSurvival < 80) result = 'graft-loss-and-eval';
  else if (growthZ < -2) result = 'growth-failure-and-GH-eval';
  else result = 'standard-eval';
  return { result, recommendation: 'pediatric-team-and-family' };
};

module.exports = Engine;
