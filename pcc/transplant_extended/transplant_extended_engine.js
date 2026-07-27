// P3-BD: Transplant-Extended Engine — 10 pure functions
const Engine = {};

Engine.TransplantEval = function ({ organ = 'kidney', age = 50, comorbidities = 'none', compliance = 'good', psychosocial = 'stable' } = {}) {
  let eligibility;
  if (psychosocial === 'unstable' || compliance === 'poor') eligibility = 'not-eligible-psychosocial-or-compliance';
  else if (comorbidities === 'malignancy-active') eligibility = 'deferral-until-malignancy-controlled';
  else if (comorbidities === 'severe-cardiac') eligibility = 'not-eligible-cardiac';
  else if (age >= 75) eligibility = 'individualized-eval-and-age';
  else if (organ === 'kidney' && compliance === 'good') eligibility = 'eligible-kidney-transplant';
  else if (organ === 'liver' && compliance === 'good') eligibility = 'eligible-liver-transplant';
  else if (organ === 'heart' && compliance === 'good') eligibility = 'eligible-heart-transplant';
  else if (organ === 'lung' && compliance === 'good') eligibility = 'eligible-lung-transplant';
  else eligibility = 'individualized-eval';
  return { eligibility, recommendation: 'multidisciplinary-transplant-team' };
};

Engine.LivingDonor = function ({ age = 35, bmi = 25, gfr = 100, comorbidities = 'none', motivation = 'high' } = {}) {
  let eligibility;
  if (gfr < 90) eligibility = 'not-eligible-GFR-low';
  else if (comorbidities === 'diabetic' || comorbidities === 'hypertensive') eligibility = 'individualized-eval';
  else if (bmi >= 35) eligibility = 'not-eligible-BMI-high';
  else if (motivation === 'coerced') eligibility = 'not-eligible-coerced-motivation';
  else if (motivation === 'high' && gfr >= 90 && bmi < 35) eligibility = 'eligible-living-donor';
  else eligibility = 'standard-living-donor-eval';
  return { eligibility, recommendation: 'independent-living-donor-advocate' };
};

Engine.MMFMismatch = function ({ donorAge = 50, recipientAge = 60, donorGFR = 100, recipientWeight = 80, donorWeight = 70 } = {}) {
  const ageDelta = recipientAge - donorAge;
  const weightRatio = donorWeight / recipientWeight;
  let mismatch;
  if (ageDelta >= 30 || weightRatio < 0.7) mismatch = 'high-mismatch-eval-risk';
  else if (ageDelta >= 15 || weightRatio < 0.85) mismatch = 'moderate-mismatch';
  else if (ageDelta >= 5) mismatch = 'mild-mismatch';
  else mismatch = 'low-mismatch-good-match';
  if (donorGFR < 90) mismatch = 'high-mismatch-eval-risk';
  return { mismatch, recommendation: 'transplant-team-eval-and-acceptability' };
};

Engine.Waitlist = function ({ status = 'active', meld = 25, status1A = 'no', timeWaited = 12 } = {}) {
  let management;
  if (status1A === 'yes') management = 'Status-1A-and-ICU-monitor';
  else if (meld >= 40) management = 'high-MELD-and-priority-transplant';
  else if (meld >= 30) management = 'MELD-30-39-and-frequent-eval';
  else if (meld >= 20) management = 'MELD-20-29-and-3-monthly-eval';
  else if (meld < 15) management = 'low-MELD-and-annual-eval';
  else if (timeWaited >= 24) management = 'long-waiter-and-priority-eval';
  else management = 'standard-waitlist-monitoring';
  return { management, recommendation: 'transplant-coord-and-MD-followup' };
};

Engine.PostTransplant = function ({ weeksPost = 8, tacLevel = 8, infection = 'none', rejection = 'none', funcStatus = 'stable' } = {}) {
  let plan;
  if (weeksPost < 4 && infection === 'none' && rejection === 'none') plan = 'early-post-transplant-and-frequent-bx';
  else if (rejection === 'acute-cellular') plan = 'acute-rejection-and-steroid-pulse';
  else if (rejection === 'acute-AMR') plan = 'AMR-and-IVIG-or-rituximab';
  else if (infection === 'CMV' || infection === 'BK') plan = 'viral-eval-and-treatment';
  else if (tacLevel < 5 && funcStatus === 'declining') plan = 'low-tac-level-and-dose-adjust';
  else if (tacLevel >= 10 && funcStatus === 'stable') plan = 'tac-too-high-and-dose-reduce';
  else if (funcStatus === 'stable' && rejection === 'none') plan = 'maintenance-and-3-monthly-eval';
  else plan = 'standard-post-transplant';
  return { plan, recommendation: 'transplant-team-and-IS-protocol' };
};

Engine.TransplantImmuno = function ({ regimen = 'tac-MMF-steroid', timeSince = 12, infectionHistory = 'none', rejectionHistory = 'none' } = {}) {
  let plan;
  if (timeSince >= 12 && rejectionHistory === 'none' && infectionHistory === 'none') plan = 'consider-steroid-withdrawal';
  else if (regimen === 'tac-MMF-steroid' && infectionHistory === 'recurrent') plan = 'MMF-reduce-or-stop';
  else if (regimen === 'tac-MMF-steroid' && timeSince < 6) plan = 'triple-therapy-maintenance';
  else if (regimen === 'cyclosporine') plan = 'cyclosporine-versus-tac-eval';
  else if (rejectionHistory === 'recurrent') plan = 'intensify-or-add-mTOR';
  else plan = 'standard-immunosuppression';
  return { plan, recommendation: 'transplant-pharm-and-IS-clinic' };
};

Engine.TransplantInfect = function ({ pathogen = 'CMV', weeksPost = 8, viralLoad = 5000, prophylaxis = 'valganciclovir' } = {}) {
  let plan;
  if (pathogen === 'CMV' && viralLoad >= 1000) plan = 'CMV-treatment-and-IV-ganciclovir';
  else if (pathogen === 'BK' && viralLoad >= 10000) plan = 'BK-nephropathy-and-IS-reduce';
  else if (pathogen === 'EBV' && viralLoad >= 1000) plan = 'EBV-PTLD-eval-and-bx';
  else if (pathogen === 'CMV' && prophylaxis === 'valganciclovir' && weeksPost < 12) plan = 'continue-prophylaxis';
  else if (pathogen === 'PJP' && weeksPost > 12) plan = 'PJP-prophylaxis-withdrawal-eval';
  else plan = 'standard-eval';
  return { plan, recommendation: 'ID-and-transplant-team' };
};

Engine.TransplantRejection = function ({ type = 'cellular', grade = 'IA', weeksPost = 8, responsive = 'unknown' } = {}) {
  let plan;
  if (type === 'cellular' && grade === 'IA' && weeksPost < 12) plan = 'steroid-pulse-and-recheck';
  else if (type === 'cellular' && grade === 'IB' && responsive === 'no') plan = 'thymoglobulin-or-rATG';
  else if (type === 'AMR' && grade === 'severe') plan = 'IVIG-and-rituximab-and-plasmapheresis';
  else if (type === 'chronic' && weeksPost >= 52) plan = 'mTOR-or-IS-intensify';
  else if (type === 'borderline') plan = 'consider-steroid-and-IS-optimize';
  else plan = 'standard-rejection-eval';
  return { plan, recommendation: 'transplant-team-and-IS-protocol' };
};

Engine.TransplantSurgery = function ({ organ = 'kidney', donorType = 'living', ischemia = 8, recipient = 'first' } = {}) {
  let plan;
  if (organ === 'kidney' && donorType === 'living') plan = 'living-donor-kidney-transplant-and-LDN';
  else if (organ === 'kidney' && donorType === 'deceased') plan = 'deceased-donor-kidney-and-cold-storage';
  else if (organ === 'liver' && donorType === 'deceased') plan = 'deceased-donor-liver-and-cold-storage';
  else if (organ === 'liver' && donorType === 'LDLT') plan = 'living-donor-LDLT-and-evaluation';
  else if (organ === 'heart') plan = 'orthotopic-heart-transplant-and-bypass';
  else if (organ === 'lung') plan = 'single-or-double-lung-transplant';
  else if (ischemia >= 24) plan = 'high-ischemia-time-and-eval';
  else if (recipient === 'retransplant') plan = 'retransplant-and-IS-protocol';
  else plan = 'standard-transplant';
  return { plan, recommendation: 'transplant-surgery-team' };
};

Engine.TransplantOutcome = function ({ preGFR = 12, postGFR = 60, scale = 'GFR', weeksElapsed = 12 } = {}) {
  const delta = postGFR - preGFR;
  const pctChange = (delta / preGFR) * 100;
  let result;
  if (pctChange >= 200) result = 'large-transplant-success';
  else if (pctChange >= 100) result = 'moderate-transplant-success';
  else if (pctChange >= 50) result = 'small-improvement';
  else if (pctChange >= 0) result = 'plateau-or-stable';
  else result = 'graft-dysfunction-or-loss';
  return { delta, pctChange: Math.round(pctChange), result, recommendation: result.includes('success') ? 'maintain-and-IS' : 'biopsy-and-eval' };
};

module.exports = Engine;
