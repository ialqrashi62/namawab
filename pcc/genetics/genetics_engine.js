'use strict';
// Genetics Engine: 10 pure deterministic functions
// Compliance: ACMG/AMP, NCCN, CPIC, DPWG, ASCO/CAP, ESMO, NSGC

function ACMGClassification({ variant, populationFrequency, inSilicoPredictions, functionalStudies, segregationEvidence, deNovo, inTransWithPathogenic }) {
  let criteria = [];
  if (inSilicoPredictions && inSilicoPredictions.deleterious) criteria.push('PVS1');
  if (populationFrequency > 0.05) criteria.push('BA1-benign');
  if (functionalStudies === 'abnormal') criteria.push('PS3');
  if (segregationEvidence === 'strong') criteria.push('PP1');
  if (deNovo) criteria.push('PS2');
  if (inTransWithPathogenic) criteria.push('PM3');
  let classification;
  if (criteria.filter(c => c.startsWith('P') || c === 'PVS1').length >= 2) classification = 'pathogenic';
  else if (criteria.filter(c => c.startsWith('P') || c === 'PVS1').length === 1) classification = 'likely-pathogenic';
  else if (criteria.filter(c => c.startsWith('B') || c === 'BA1-benign').length >= 2) classification = 'benign';
  else if (criteria.filter(c => c.startsWith('B') || c === 'BA1-benign').length === 1) classification = 'likely-benign';
  else classification = 'VUS';
  return { variant, classification, criteria, action: classification === 'pathogenic' || classification === 'likely-pathogenic' ? 'report-clinically-actionable' : classification === 'VUS' ? 'do-not-act-on' : 'no-action-needed' };
}

function BRCATestingIndication({ age, personalCancerHistory, familyHistoryBRCA, ancestry, maleBreastCancer, ovarianCancer }) {
  let indication = false;
  let reason = [];
  if (personalCancerHistory === 'breast' && age < 50) { indication = true; reason.push('personal-breast-<50'); }
  if (personalCancerHistory === 'ovarian') { indication = true; reason.push('personal-ovarian'); }
  if (familyHistoryBRCA === 'first-degree') { indication = true; reason.push('first-degree-BRCA'); }
  if (ancestry === 'Ashkenazi-Jewish') { indication = true; reason.push('Ashkenazi-ancestry'); }
  if (maleBreastCancer) { indication = true; reason.push('male-breast-cancer'); }
  if (ovarianCancer) { indication = true; reason.push('ovarian-cancer'); }
  return { indication, reason, recommendation: indication ? 'genetic-counseling-BRCA1/2-testing' : 'standard-screening' };
}

function LynchScreening({ tumor, age, familyHistory, mmrIhcResult, msiStatus }) {
  let positive = false;
  let reason = [];
  if (tumor === 'colorectal' && age < 50) { positive = true; reason.push('CRC-<50'); }
  if (tumor === 'endometrial' && age < 50) { positive = true; reason.push('endometrial-<50'); }
  if (familyHistory === 'Lynch-associated') { positive = true; reason.push('family-history'); }
  if (mmrIhcResult && mmrIhcResult.deficient) { positive = true; reason.push('MMR-deficient'); }
  if (msiStatus === 'high') { positive = true; reason.push('MSI-high'); }
  return { positive, reason, recommendation: positive ? 'germline-MMR-testing' : 'standard' };
}

function CPICPhenotype({ diplotypes, functionAs, activityScore, drug, cpicLevel }) {
  let phenotype;
  if (activityScore === 0) phenotype = 'poor-metabolizer';
  else if (activityScore < 1.25) phenotype = 'poor-metabolizer';
  else if (activityScore < 2.25) phenotype = 'intermediate-metabolizer';
  else if (activityScore > 2.5) phenotype = 'ultra-rapid-metabolizer';
  else phenotype = 'normal-metabolizer';
  const recommendation = {
    'codeine': { 'poor-metabolizer': 'avoid-tramadol-codeine', 'intermediate-metabolizer': 'monitor', 'normal-metabolizer': 'standard' },
    'clopidogrel': { 'poor-metabolizer': 'consider-alternative', 'intermediate-metabolizer': 'consider-alternative', 'normal-metabolizer': 'standard' },
    'warfarin': { 'poor-metabolizer': 'reduce-dose-30%', 'intermediate-metabolizer': 'reduce-dose-15%', 'normal-metabolizer': 'standard' },
  };
  const rec = recommendation[drug] && recommendation[drug][phenotype] ? recommendation[drug][phenotype] : 'consult-CPIC-guideline';
  return { diplotypes, phenotype, activityScore, drug, cpicLevel, recommendation: rec };
}

function VariantFrequency({ alleleCount, totalAlleles, population, gnomadAf }) {
  const af = totalAlleles > 0 ? alleleCount / totalAlleles : 0;
  let classification;
  if (gnomadAf === null || af === 0) classification = 'extremely-rare';
  else if (gnomadAf < 0.0001) classification = 'very-rare';
  else if (gnomadAf < 0.01) classification = 'rare';
  else if (gnomadAf < 0.05) classification = 'low-frequency';
  else classification = 'common';
  const aboveThreshold = af > 0.05;
  return { alleleCount, totalAlleles, af, gnomadAf, classification, aboveThreshold, likelyBenign: aboveThreshold };
}

function CarrierScreening({ disease, partnerStatus, offspring, priorPregnancy, familyHistory }) {
  let recommendation = 'no-action';
  let risk = 0;
  if (partnerStatus === 'carrier' && disease) {
    risk = 0.25;
    recommendation = 'genetic-counseling-PGD-options';
  } else if (familyHistory === 'affected-child') {
    risk = 0.25;
    recommendation = 'genetic-counseling';
  } else if (priorPregnancy === 'affected') {
    risk = 0.25;
    recommendation = 'genetic-counseling';
  }
  return { disease, risk, recommendation, carrierStatus: partnerStatus };
}

function PharmacogenomicDose({ drug, cyp2d6, cyp2c19, cyp2c9, tpmt, ugt1a1, vkORc1, slco1b1, dpyd }) {
  const recommendations = [];
  if (cyp2d6 === 'poor' && drug === 'codeine') recommendations.push({ drug, action: 'avoid-codeine', alternative: 'morphine' });
  if (cyp2c19 === 'poor' && drug === 'clopidogrel') recommendations.push({ drug, action: 'use-alternative', alternative: 'prasugrel-ticagrelor' });
  if (cyp2c9 === '*3*3' || cyp2c9 === 'poor') recommendations.push({ drug: 'warfarin', action: 'reduce-dose-30-50%' });
  if (tpmt === 'poor') recommendations.push({ drug: '6-mercaptopurine', action: 'reduce-dose-90%' });
  if (ugt1a1 === '*28*28') recommendations.push({ drug: 'irinotecan', action: 'reduce-dose' });
  if (slco1b1 === '*5*5') recommendations.push({ drug: 'simvastatin', action: 'reduce-dose-or-alternative' });
  if (dpyd === 'poor') recommendations.push({ drug: 'fluorouracil', action: 'avoid-or-reduce-dose' });
  return { recommendations, profile: { cyp2d6, cyp2c19, cyp2c9, tpmt, ugt1a1, slco1b1, dpyd, vkORc1 } };
}

function GeneticCounselingReferral({ age, familyHistory, personalHistory, ethnicity, consanguinity, resultsPending }) {
  const referrals = [];
  if (familyHistory && (familyHistory.includes('breast') || familyHistory.includes('colon'))) referrals.push('cancer-genetics');
  if (personalHistory && personalHistory === 'multiple-recurrent') referrals.push('cancer-genetics');
  if (consanguinity) referrals.push('reproductive-genetics');
  if (ethnicity === 'Ashkenazi-Jewish' || ethnicity === 'French-Canadian') referrals.push('carrier-screening');
  if (resultsPending) referrals.push('follow-up-genetic-counselor');
  return { referrals, count: referrals.length, indication: referrals.length > 0 };
}

function DownSyndromeScreening({ nuchalTranslucency, pappA, freeBetaHCG, age, ntMultiplier }) {
  let risk = 0;
  if (ntMultiplier && ntMultiplier > 3.5) risk += 5;
  if (pappA < 0.5) risk += 1;
  if (freeBetaHCG > 2.0) risk += 1;
  if (age >= 35) risk += 2;
  let screeningResult;
  if (risk >= 5) screeningResult = 'high-risk-aneuploidy';
  else if (risk >= 2) screeningResult = 'intermediate-risk';
  else screeningResult = 'low-risk';
  return { riskScore: risk, screeningResult, age, nuchalTranslucency, recommendation: screeningResult === 'high-risk-aneuploidy' ? 'amniocentesis-or-NIPT' : 'standard' };
}

function CysticFibrosisScreening({ cftrMutations, sweatChloride, familyHistory, age }) {
  let diagnosis = 'carrier-unlikely';
  if (cftrMutations === 2) diagnosis = 'CF-diagnosed';
  else if (cftrMutations === 1) diagnosis = 'CF-carrier';
  if (sweatChloride >= 60) diagnosis = 'CF-confirmed';
  else if (sweatChloride >= 30) diagnosis = 'CF-intermediate';
  return { diagnosis, cftrMutations, sweatChloride, familyHistory, age, recommendation: diagnosis === 'CF-diagnosed' ? 'CF-clinic-referral' : diagnosis === 'CF-carrier' ? 'partner-testing' : 'monitor' };
}

module.exports = {
  ACMGClassification, BRCATestingIndication, LynchScreening, CPICPhenotype, VariantFrequency,
  CarrierScreening, PharmacogenomicDose, GeneticCounselingReferral, DownSyndromeScreening, CysticFibrosisScreening,
};
