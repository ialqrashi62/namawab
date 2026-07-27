// P3-AP: Transplant-Liver Engine — 10 pure functions
const Engine = {};

Engine.MELDScore = function ({ bilirubin = 1.0, inr = 1.0, creatinine = 1.0, dialysis = false } = {}) {
  const biliScore = Math.log(Math.max(bilirubin, 0.1));
  const inrScore = Math.log(Math.max(inr, 0.1));
  const crScore = dialysis ? Math.log(4.0) : Math.log(Math.max(creatinine, 0.1));
  const meld = Math.round((0.957 * crScore + 0.378 * biliScore + 1.120 * inrScore + 0.643) * 10);
  let priority;
  if (meld >= 40) priority = 'UNOS-1A-fulminant-liver-failure';
  else if (meld >= 35) priority = 'UNOS-1B-high-MELD';
  else if (meld >= 25) priority = 'high-MELD-active-list';
  else if (meld >= 15) priority = 'moderate-MELD-list';
  else priority = 'low-MELD-list';
  return { meld, priority, recommendation: meld >= 25 ? 'high-priority-list' : 'active-monitoring' };
};

Engine.ChildPughScore = function ({ bilirubin = 1.0, albumin = 4.0, inr = 1.0, ascites = 'none', encephalopathy = 'none' } = {}) {
  let biliScore = 1, albScore = 1, inrScore = 1, ascScore = 1, encScore = 1;
  if (bilirubin > 3) biliScore = 3; else if (bilirubin > 2) biliScore = 2;
  if (albumin < 2.8) albScore = 3; else if (albumin < 3.5) albScore = 2;
  if (inr > 1.5) inrScore = 2;
  if (ascites === 'refractory') ascScore = 3; else if (ascites === 'mild-moderate') ascScore = 2;
  if (encephalopathy === 'grade-3-4') encScore = 3; else if (encephalopathy === 'grade-1-2') encScore = 2;
  const total = biliScore + albScore + inrScore + ascScore + encScore;
  let className;
  if (total <= 6) className = 'A';
  else if (total <= 9) className = 'B';
  else className = 'C';
  return { score: total, class: className, recommendation: className === 'C' ? 'transplant-evaluation' : 'monitor' };
};

Engine.AllocationMELD = function ({ meld = 15, bloodType = 'O', waitingTime = 0, exceptionStatus = 'none' } = {}) {
  let priority;
  if (exceptionStatus === 'HCC-exception') priority = 'HCC-MELD-exception-MDT-approved';
  else if (meld >= 35) priority = 'top-1-percent-priority';
  else if (meld >= 25) priority = 'top-10-percent-priority';
  else if (meld >= 15) priority = 'mid-tier-priority';
  else priority = 'low-priority-by-blood-type';
  if (waitingTime >= 365) priority += '-long-wait';
  return { priority, recommendation: 're-evaluate-every-90-days' };
};

Engine.HCCBridgeTherapy = function ({ tumorSize = 2, tumorCount = 1, afp = 10, withinMilan = true, bridgeTherapy = 'none' } = {}) {
  let pathway;
  if (!withinMilan) pathway = 'outside-Milan-downstage-or-exception-MDT';
  else if (tumorCount >= 4) pathway = 'multi-focal-bridge-TACE-or-Y90';
  else if (tumorSize > 3) pathway = 'large-tumor-TACE-or-ablation';
  else if (tumorSize > 2) pathway = 'intermediate-TACE';
  else if (afp > 1000) pathway = 'high-AFP-bridge-therapy-and-MDT';
  else pathway = 'within-Milan-bridge-TACE-if-waitlist-long';
  return { pathway, recommendation: 'MDT-hepatology-interventional-radiology' };
};

Engine.AcuteLiverFailure = function ({ encephalopathy = 'none', inr = 1.0, daysSince = 7, age = 50 } = {}) {
  let classification;
  if (encephalopathy === 'grade-3-4' && inr > 1.5 && daysSince <= 26) classification = 'fulminant-ACLF-KCH-criteria-met';
  else if (encephalopathy === 'grade-1-2' && inr > 1.5) classification = 'acute-liver-failure-monitor';
  else if (inr > 2.0) classification = 'severe-acute-injury';
  else if (inr > 1.5) classification = 'acute-liver-injury';
  else classification = 'acute-liver-dysfunction';
  return { classification, recommendation: classification.includes('fulminant') ? 'urgent-list-UNOS-1A' : 'monitor-and-consider-workup' };
};

Engine.SepsisInCirrhosis = function ({ sofaScore = 0, ascites = 'none', map = 70, lactate = 1.0, hepaticEncephalopathy = 0 } = {}) {
  let severity;
  if (sofaScore >= 10 || map < 65) severity = 'septic-shock-icu';
  else if (sofaScore >= 5 || hepaticEncephalopathy >= 2) severity = 'severe-sepsis-icu-monitoring';
  else if (sofaScore >= 2 || lactate > 2) severity = 'early-sepsis-floor-monitoring';
  else severity = 'no-sepsis';
  return { severity, recommendation: severity.includes('shock') || severity.includes('severe') ? 'icu-early-goal-directed' : 'monitor-and-workup' };
};

Engine.PortalHypertension = function ({ hvg = 12, platelets = 100000, ascites = 'none', varices = 'none' } = {}) {
  let severity;
  if (hvg >= 12 || varices === 'high-risk') severity = 'clinically-significant-portal-hypertension';
  else if (hvg >= 10 || varices === 'small') severity = 'subclinical-portal-hypertension';
  else if (hvg >= 8 || platelets < 100000) severity = 'mild-portal-hypertension';
  else severity = 'no-portal-hypertension';
  return { severity, recommendation: severity.includes('clinically-significant') ? 'beta-blocker-or-band-ligation' : 'monitor' };
};

Engine.HepatorenalSyndrome = function ({ cirrhosis = true, creatinine = 1.0, urineNa = 10, noResponse = true, diureticWithdrawal = true } = {}) {
  let type;
  if (cirrhosis && creatinine > 1.5 && noResponse && diureticWithdrawal) type = 'HRS-AKI-terlipressin-or-norepinephrine';
  else if (cirrhosis && creatinine > 1.5) type = 'HRS-rule-out-and-treat';
  else if (cirrhosis && creatinine > 1.2) type = 'AKI-cirrhosis-stage-1';
  else type = 'no-HRS';
  return { type, recommendation: type.includes('HRS-AKI') ? 'vasoconstrictor-and-albumin' : 'supportive' };
};

Engine.PostTransplantRejectionLiver = function ({ daysPost = 30, alt = 30, biopsy = 'no-rejection' } = {}) {
  let classification;
  if (daysPost < 7) classification = 'early-preservation-injury-or-rare-rejection';
  else if (daysPost < 90 && biopsy === 'acute-rejection-mild') classification = 'acute-cellular-rejection-mild-steroid-bolus';
  else if (biopsy === 'acute-rejection-moderate' || biopsy === 'severe') classification = 'acute-rejection-thymoglobulin';
  else if (biopsy === 'chronic-rejection') classification = 'chronic-rejection-evaluate-retransplant';
  else if (alt > 200) classification = 'hepatitis-evaluate-other-cause';
  else classification = 'stable-allograft';
  return { classification, recommendation: classification.includes('acute') || classification.includes('chronic') ? 'augment-immunosuppression' : 'continue-immunosuppression' };
};

Engine.LiveDonorLiver = function ({ age = 35, remnantLiver = 70, donorLiverFat = 5, donorBMI = 25, donorABO = 'O' } = {}) {
  let suitability;
  if (remnantLiver < 30) suitability = 'inadequate-remnant-reject';
  else if (donorLiverFat > 30) suitability = 'severe-steatosis-reject';
  else if (age > 60) suitability = 'age-caution-MDT';
  else if (donorBMI > 35) suitability = 'high-BMI-consider-biopsy';
  else if (donorLiverFat > 10) suitability = 'mild-steatosis-acceptable';
  else if (age < 50 && donorBMI < 30) suitability = 'ideal-donor';
  else suitability = 'acceptable-donor';
  return { suitability, recommendation: suitability.includes('reject') ? 'decline-and-find-other' : 'proceed-with-MDT-clearance' };
};

module.exports = Engine;
