// P3-AP: Transplant-Heart Engine — 10 pure functions
const Engine = {};

Engine.UNOSStatus = function ({ inotropeDose = 0, mechanicalSupport = 'none', iaPct = 0, age = 50 } = {}) {
  let status;
  if (mechanicalSupport === 'total-artificial-heart') status = 'UNOS-1A-Total-Artificial-Heart';
  else if (mechanicalSupport === 'bivad') status = 'UNOS-1A-BiVAD';
  else if (mechanicalSupport === 'lvad' && iaPct > 50) status = 'UNOS-1A-LVAD-complications';
  else if (mechanicalSupport === 'ecmo') status = 'UNOS-1A-ECMO';
  else if (mechanicalSupport === 'lvad') status = 'UNOS-1B-LVAD-stable';
  else if (inotropeDose > 7) status = 'UNOS-2-high-dose-inotropes';
  else if (inotropeDose > 3) status = 'UNOS-3-low-dose-inotropes';
  else if (inotropeDose > 0) status = 'UNOS-4-stable-on-inotropes';
  else if (age >= 65) status = 'UNOS-5-older-adult';
  else status = 'UNOS-6-stable-no-support';
  return { status, recommendation: status.startsWith('UNOS-1') ? 'highest-priority-list' : 'active-list' };
};

Engine.DonorMatching = function ({ recipientABO = 'O', donorABO = 'O', recipientPRA = 0, donorCrossmatch = 'negative', weightRatio = 1.0, hlaMismatch = 4 } = {}) {
  let match;
  if (recipientABO !== donorABO) match = 'incompatible-ABO-reject';
  else if (donorCrossmatch === 'positive') match = 'positive-crossmatch-reject';
  else if (recipientPRA > 80) match = 'sensitized-high-immunologic-risk';
  else if (hlaMismatch <= 2) match = 'excellent-HLA-match';
  else if (hlaMismatch <= 4) match = 'acceptable-match';
  else match = 'poor-match-consider-defer';
  const sizeMatch = weightRatio >= 0.7 && weightRatio <= 1.3;
  return { match, sizeMatch, recommendation: match.includes('reject') ? 'decline-donor' : 'proceed-with-transplant' };
};

Engine.RightHeartFailure = function ({ cvp = 8, ci = 2.5, pap = 25, pvr = 2, inotropeScore = 0 } = {}) {
  let severity;
  if (cvp >= 18 && ci < 1.8) severity = 'severe-RV-failure-mechanical-support-needed';
  else if (cvp >= 14 && ci < 2.0) severity = 'moderate-RV-failure-inotropes';
  else if (cvp >= 10 || ci < 2.2) severity = 'mild-RV-dysfunction-monitor';
  else if (pvr > 5) severity = 'pulmonary-hypertension-risk';
  else severity = 'normal-RV-function';
  return { severity, recommendation: severity.includes('severe') ? 'RVAD-or-ECMO' : severity.includes('moderate') ? 'inotropes-and-diuresis' : 'monitor' };
};

Engine.HeartTransplantRejection = function ({ daysPostTransplant = 30, biopsyGrade = '0R', dsa = 0, symptoms = 'none' } = {}) {
  let classification;
  if (biopsyGrade === '3R' || (biopsyGrade === '2R' && symptoms !== 'none')) classification = 'acute-rejection-severe-treat';
  else if (biopsyGrade === '2R') classification = 'acute-rejection-moderate-treat';
  else if (biopsyGrade === '1R' && dsa > 0) classification = 'borderline-with-DSA-monitor';
  else if (biopsyGrade === '1R') classification = 'mild-borderline-monitor';
  else if (dsa > 0) classification = 'antibody-mediated-rejection-AMR';
  else classification = 'no-rejection';
  return { classification, recommendation: classification.includes('severe') || classification.includes('moderate') ? 'augment-immunosuppression' : 'continue-immunosuppression' };
};

Engine.CMVProphylaxisHeart = function ({ donorCMV = 'negative', recipientCMV = 'negative', daysPostTransplant = 30 } = {}) {
  let risk;
  let prophylaxis;
  if (donorCMV === 'positive' && recipientCMV === 'negative') { risk = 'high-risk-primary-CMV'; prophylaxis = 'valganciclovir-6-months'; }
  else if (donorCMV === 'positive' && recipientCMV === 'positive') { risk = 'moderate-risk-reactivation'; prophylaxis = 'valganciclovir-3-months'; }
  else if (donorCMV === 'negative' && recipientCMV === 'positive') { risk = 'low-risk'; prophylaxis = 'valganciclovir-6-weeks'; }
  else { risk = 'lowest-risk'; prophylaxis = 'monitor-only'; }
  return { risk, prophylaxis, recommendation: 'monitor-PCR-monthly' };
};

Engine.CardiacAllograftVasculopathy = function ({ yearsPostTransplant = 1, ivusFindings = 'normal', stressTest = 'normal', lvef = 60 } = {}) {
  let severity;
  if (ivusFindings.includes('severe') || lvef < 40) severity = 'severe-CAV-revascularization-or-retransplant';
  else if (ivusFindings.includes('moderate') || lvef < 50) severity = 'moderate-CAV-statins-and-monitor';
  else if (ivusFindings.includes('mild')) severity = 'mild-CAV-annual-IVUS';
  else if (yearsPostTransplant > 5) severity = 'long-term-surveillance';
  else severity = 'no-CAV';
  return { severity, recommendation: severity.includes('severe') ? 'coronary-angiography' : 'annual-surveillance' };
};

Engine.ImmunosuppressionHeart = function ({ yearsPostTransplant = 1, rejection = 'none', infection = 'none' } = {}) {
  let regimen;
  if (yearsPostTransplant < 0.5) regimen = 'triple-therapy-tacrolimus-MMF-steroid';
  else if (yearsPostTransplant < 2) regimen = 'taper-steroid-by-6-months';
  else if (yearsPostTransplant < 5) regimen = 'dual-tacrolimus-MMF-or-mTOR';
  else regimen = 'maintenance-monotherapy-or-dual';
  if (rejection.includes('moderate') || rejection.includes('severe')) regimen += '-augment-with-pulsed-steroid';
  if (infection === 'active') regimen = 'reduce-immunosuppression-until-clearance';
  return { regimen, recommendation: 'monitor-drug-levels-monthly' };
};

Engine.PostTransplantLymphoma = function ({ ebvStatus = 'positive', immunosuppression = 'standard', lymphadenopathy = false, massSize = 0 } = {}) {
  let risk;
  if (ebvStatus === 'negative' && immunosuppression === 'high') risk = 'very-high-PTLD-risk-reduction-needed';
  else if (ebvStatus === 'negative' && immunosuppression === 'standard') risk = 'high-PTLD-risk-monitor-EBV-PCR';
  else if (lymphadenopathy || massSize > 1) risk = 'suspicious-PTLD-biopsy';
  else if (immunosuppression === 'high') risk = 'moderate-PTLD-risk-monitor';
  else risk = 'low-PTLD-risk';
  return { risk, recommendation: risk.includes('suspicious') ? 'biopsy-and-oncology' : 'monitor-EBV-load' };
};

Engine.HeartWaitlistMortality = function ({ age = 50, bloodType = 'O', status = 'UNOS-3', bmi = 25, egfr = 60 } = {}) {
  let mortalityRisk;
  let score = 0;
  if (age >= 70) score += 3;
  else if (age >= 60) score += 2;
  else if (age >= 50) score += 1;
  if (bloodType === 'O') score += 1;
  if (status === 'UNOS-6') score += 3;
  else if (status === 'UNOS-3') score += 1;
  if (bmi >= 35) score += 2;
  if (egfr < 30) score += 3;
  else if (egfr < 60) score += 1;
  if (score >= 8) mortalityRisk = 'very-high-1-year-mortality';
  else if (score >= 5) mortalityRisk = 'high-1-year-mortality';
  else if (score >= 3) mortalityRisk = 'moderate-1-year-mortality';
  else mortalityRisk = 'low-1-year-mortality';
  return { score, mortalityRisk, recommendation: mortalityRisk.includes('very-high') || mortalityRisk.includes('high') ? 'urgent-upgrade-status' : 'continue-monitoring' };
};

Engine.PediatricHeartTransplant = function ({ age = 5, weight = 20, congenitalVsAcquired = 'congenital', pra = 0, bloodType = 'O' } = {}) {
  let pathway;
  if (age < 1) pathway = 'infant-transplant-specialized-center';
  else if (congenitalVsAcquired === 'congenital' && pra > 50) pathway = 'sensitized-pediatric-congenital-MDT';
  else if (congenitalVsAcquired === 'congenital') pathway = 'congenital-pediatric-transplant';
  else if (congenitalVsAcquired === 'acquired') pathway = 'acquired-cardiomyopathy-pediatric';
  else pathway = 'pediatric-MDT-decision';
  if (weight < 5) pathway += '-small-size-donor-mismatch-acceptable';
  return { pathway, recommendation: 'pediatric-cardiac-team-evaluation' };
};

module.exports = Engine;
