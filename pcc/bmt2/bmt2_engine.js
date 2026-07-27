// P3-AT: Bone-Marrow-Transplant (additional) Engine — 10 pure functions
const Engine = {};

Engine.CordBloodTransplant = function ({ cordUnit = 'single', cellDose = 0.5, hlaMatch = '4-of-6', patientAge = 30 } = {}) {
  let decision;
  if (cordUnit === 'single' && cellDose >= 1 && hlaMatch === '4-of-6') decision = 'single-cord-eligible';
  else if (cordUnit === 'single' && cellDose < 1) decision = 'low-cell-dose-consider-double-cord';
  else if (cordUnit === 'double') decision = 'double-cord-acceptable-for-lower-cell-dose';
  else if (hlaMatch === '5-of-6' || hlaMatch === '6-of-6') decision = 'better-match-improved-outcomes';
  else if (hlaMatch === '4-of-6' && patientAge >= 60) decision = 'cord-blood-acceptable-for-older';
  else decision = 'cord-blood-evaluation-pending';
  return { decision, recommendation: decision.includes('eligible') || decision.includes('acceptable') ? 'proceed' : 'reassess' };
};

Engine.PBSCCollection = function ({ cd34 = 2, donorWeight = 70, day = 5, plerixaforUsed = false } = {}) {
  let decision;
  if (cd34 >= 4) decision = 'excellent-collection';
  else if (cd34 >= 2) decision = 'adequate-collection-2-target';
  else if (cd34 < 2 && day < 5) decision = 'early-collection-monitor-and-recollect';
  else if (cd34 < 2 && plerixaforUsed) decision = 'plerixafor-failed-consider-BM';
  else if (cd34 < 2) decision = 'consider-plerixafor-or-BM';
  return { decision, recommendation: decision.includes('excellent') || decision.includes('adequate') ? 'proceed' : 'reassess-and-consider-alternate' };
};

Engine.PTCyGVHDProphylaxis = function ({ donorType = 'haplo', regimen = 'PTCy-tacrolimus-MMF', dayCount = 0 } = {}) {
  let status;
  if (regimen === 'PTCy-tacrolimus-MMF' && donorType === 'haplo') status = 'PTCy-standard-for-haplo-and-mismatched';
  else if (regimen === 'PTCy-tacrolimus-MMF' && donorType === 'matched-related') status = 'PTCy-acceptable-also-for-matched';
  else if (regimen === 'CNI-MTX-ATG') status = 'standard-CNI-MTX-for-matched';
  else if (regimen === 'PTCy-sirolimus-MMF') status = 'PTCy-with-sirolimus-alternative';
  else status = 'unspecified-regimen';
  return { status, recommendation: 'follow-PTCy-protocol-and-monitor' };
};

Engine.CARTCellTherapy = function ({ indication = 'ALL', cellDose = 1, bridgeNeeded = false } = {}) {
  let plan;
  if (indication === 'ALL' && cellDose >= 1) plan = 'CAR-T-pediatric-ALL-tisagenlecleucel';
  else if (indication === 'DLBCL') plan = 'CAR-T-DLBCL-axicabtagene-or-tisagenlecleucel';
  else if (indication === 'MM') plan = 'CAR-T-MM-idecabtagene';
  else plan = 'CAR-T-investigational';
  if (bridgeNeeded) plan += '-with-bridge-therapy';
  return { plan, recommendation: 'CAR-T-center-evaluation' };
};

Engine.PeriTransplantAntifungal = function ({ daysPost = 0, neutrophils = 500, mucositis = false, aspergillusSuspected = false } = {}) {
  let antifungal;
  if (daysPost < 30 && neutrophils < 500) antifungal = 'micafungin-or-caspofungin-empiric';
  else if (daysPost < 30 && mucositis) antifungal = 'fluconazole-prophylaxis';
  else if (daysPost >= 30 && aspergillusSuspected) antifungal = 'voriconazole-or-isavuconazole';
  else if (daysPost >= 30) antifungal = 'fluconazole-prophylaxis-until-day-75';
  else antifungal = 'standard-prophylaxis';
  return { antifungal, recommendation: 'ID-consult-and-therapeutic-drug-monitoring' };
};

Engine.HepaticSOSVOD = function ({ defibrotideStarted = false, weightGain = 3, bilirubin = 1.5, painRUQ = false } = {}) {
  let management;
  if (weightGain >= 5 && bilirubin >= 2 && painRUQ) management = 'VOD-confirmed-start-defibrotide';
  else if (weightGain >= 3 && bilirubin >= 1.5) management = 'VOD-suspected-start-defibrotide';
  else if (bilirubin >= 1.5) management = 'monitor-and-consider-defibrotide';
  else if (weightGain >= 2) management = 'fluid-balance-monitor';
  else management = 'no-VOD';
  return { management, recommendation: management.includes('defibrotide') ? 'start-defibrotide-and-monitor' : 'monitor' };
};

Engine.EngraftmentSyndrome = function ({ daysPost = 5, fever = true, rash = false, hypoxia = false, weightGain = 2 } = {}) {
  let syndrome;
  if (daysPost >= 5 && daysPost <= 14 && fever && rash && hypoxia) syndrome = 'engraftment-syndrome-severe-steroid';
  else if (daysPost >= 5 && daysPost <= 14 && fever && rash) syndrome = 'engraftment-syndrome-mild-monitor';
  else if (daysPost < 5) syndrome = 'pre-engraftment-evaluate-other';
  else if (daysPost > 14) syndrome = 'post-engraftment-evaluate-other';
  else syndrome = 'no-engraftment-syndrome';
  return { syndrome, recommendation: syndrome.includes('severe') ? 'IV-steroids-and-monitor' : syndrome.includes('mild') ? 'monitor' : 'evaluate-other-cause' };
};

Engine.SecondTransplant = function ({ daysPost = 100, relapse = false, donorChimerism = 100, priorGVHD = false } = {}) {
  let decision;
  if (relapse && donorChimerism < 95) decision = 'second-transplant-consider';
  else if (relapse && priorGVHD) decision = 'second-transplant-high-risk';
  else if (relapse && daysPost < 365) decision = 'second-transplant-consider-DLI-first';
  else if (relapse) decision = 'salvage-chemo-consider-second';
  else decision = 'no-second-transplant-needed';
  return { decision, recommendation: decision.includes('consider') ? 'transplant-team-MDT' : 'monitor' };
};

Engine.SurvivorshipLateEffects = function ({ yearsPost = 1, primaryDisease = 'AML', chronicGVHD = false, ageAtTransplant = 30 } = {}) {
  let screening;
  if (chronicGVHD) screening = 'aggressive-chronic-GVHD-screening-and-immunosuppression';
  else if (yearsPost >= 1 && yearsPost < 5) screening = 'annual-LTFU-clinic-immunity-and-secondary-cancers';
  else if (yearsPost >= 5) screening = 'long-term-survivorship-clinic';
  if (ageAtTransplant < 18) screening += '-pediatric-transition';
  return { screening, recommendation: 'LTFU-clinic-and-coordinated-care' };
};

Engine.HCTCIComorbidity = function ({ comorbidityCount = 0, age = 30, diseaseRisk = 'low', kps = 100 } = {}) {
  let score;
  if (comorbidityCount === 0 && age < 40) score = 'HCTCI-0-low-risk';
  else if (comorbidityCount <= 2) score = 'HCTCI-1-or-2-intermediate-risk';
  else if (comorbidityCount >= 3) score = 'HCTCI-3-or-more-high-risk';
  if (kps < 80) score += '-and-low-KPS';
  if (diseaseRisk === 'high') score += '-and-high-disease-risk';
  return { score, recommendation: score.includes('low') ? 'standard-transplant' : score.includes('intermediate') ? 'RICT-or-consider-alternate' : 'high-risk-MDT' };
};

module.exports = Engine;
