'use strict';

// Public-Health PCC — 10 pure deterministic functions
// Compliance: WHO, CDC, ECDC, MOH-Saudi, PHAC, IDSA, ACIP, IHR-2005

const Engine = module.exports = {};

// 1) Vaccine schedule — child/teen adherence
Engine.VaccineScheduleAdherence = function (input = {}) {
  const { age = 5, dosesReceived = [], dueVaccines = ['DTaP', 'IPV', 'Hib', 'PCV13', 'MMR', 'Varicella', 'HepB'] } = input;
  const totalDue = dueVaccines.length;
  const missing = dueVaccines.filter(v => !dosesReceived.includes(v));
  const completionRate = (dosesReceived.filter(v => dueVaccines.includes(v)).length / totalDue) * 100;
  let status;
  if (completionRate >= 95) status = 'fully-immunized';
  else if (completionRate >= 80) status = 'partially-immunized';
  else if (completionRate >= 50) status = 'under-immunized';
  else status = 'unimmunized-high-risk';
  return { completionRate: Math.round(completionRate * 10) / 10, missing, status, recommendation: status === 'unimmunized-high-risk' ? 'catch-up-immunization-schedule' : 'maintain-routine-immunization' };
};

// 2) Outbreak investigation — attack rate
Engine.OutbreakAttackRate = function (input = {}) {
  const { exposed = 100, ill = 25, totalPopulation = 200, deaths = 0, secondaryCases = 0 } = input;
  const attackRate = (ill / exposed) * 100;
  const populationRate = (ill / totalPopulation) * 100;
  const caseFatalityRate = ill > 0 ? (deaths / ill) * 100 : 0;
  const r0 = secondaryCases / ill;
  let severity;
  if (r0 >= 2) severity = 'epidemic-spreading';
  else if (r0 >= 1) severity = 'cluster-active-transmission';
  else if (r0 > 0) severity = 'limited-spread';
  else severity = 'no-secondary-transmission';
  return { attackRate: Math.round(attackRate * 10) / 10, populationRate: Math.round(populationRate * 10) / 10, caseFatalityRate: Math.round(caseFatalityRate * 10) / 10, r0: Math.round(r0 * 100) / 100, severity, recommendation: severity === 'epidemic-spreading' ? 'mass-intervention-vaccination-quarantine' : 'enhanced-surveillance' };
};

// 3) Contact tracing — risk stratification
Engine.ContactTracingRisk = function (input = {}) {
  const { distance = 2, durationMinutes = 30, maskUsed = false, vaccinationStatus = 'unvaccinated', enclosedSpace = false, indexCaseSymptoms = 'asymptomatic' } = input;
  let risk;
  if (distance < 1 && durationMinutes > 15 && !maskUsed && enclosedSpace) risk = 'high-risk-close-contact';
  else if (distance < 2 && durationMinutes > 15 && !maskUsed) risk = 'moderate-risk';
  else if (vaccinationStatus === 'fully-vaccinated' && maskUsed) risk = 'low-risk';
  else if (indexCaseSymptoms === 'asymptomatic') risk = 'low-risk-asymptomatic-index';
  else risk = 'minimal-risk';
  return { risk, recommendation: risk === 'high-risk-close-contact' ? 'quarantine-14-days-test-day-5-and-14' : (risk === 'moderate-risk' ? 'self-monitor-test-if-symptoms' : 'no-action-monitor') };
};

// 4) Vaccine efficacy — clinical effectiveness
Engine.VaccineEffectiveness = function (input = {}) {
  const { vaccinatedCases = 10, unvaccinatedCases = 100, vaccinatedTotal = 1000, unvaccinatedTotal = 1000, severeBreakthrough = 1, totalSeverUnvaccinated = 30 } = input;
  const riskUnvax = unvaccinatedCases / unvaccinatedTotal;
  const riskVax = vaccinatedCases / vaccinatedTotal;
  const effectiveness = ((riskUnvax - riskVax) / riskUnvax) * 100;
  const severeEff = ((totalSeverUnvaccinated / unvaccinatedTotal) - (severeBreakthrough / vaccinatedTotal)) / (totalSeverUnvaccinated / unvaccinatedTotal) * 100;
  return { effectiveness: Math.round(effectiveness * 10) / 10, severeEffectiveness: Math.round(severeEff * 10) / 10, recommendation: effectiveness >= 70 ? 'high-efficacy-clear-benefit' : (effectiveness >= 40 ? 'moderate-efficacy-consider-booster' : 'low-efficacy-investigate') };
};

// 5) Tuberculosis screening — IGRA / TST
Engine.TuberculosisScreening = function (input = {}) {
  const { igraResult = 'negative', tstIndurationMM = 0, bcgHistory = false, exposureRisk = 'low', symptoms = 'none', chestXRay = 'normal', hivStatus = 'negative' } = input;
  let interpretation;
  if (igraResult === 'positive' || tstIndurationMM >= 15 || (tstIndurationMM >= 10 && (hivStatus === 'positive' || exposureRisk === 'high'))) interpretation = 'positive-ltbi';
  else if (tstIndurationMM >= 5 && exposureRisk !== 'low') interpretation = 'positive-ltbi';
  else if (chestXRay === 'abnormal' || symptoms !== 'none') interpretation = 'suspect-active-tb';
  else interpretation = 'negative-no-ltbi';
  return { interpretation, recommendation: interpretation === 'positive-ltbi' ? 'treat-ltbi-INH-9mo-or-3HP' : (interpretation === 'suspect-active-tb' ? 'sputum-afb-culture-mdt-treatment' : 'annual-monitoring') };
};

// 6) Influenza severity — clinical assessment
Engine.InfluenzaSeverityScore = function (input = {}) {
  const { oxygenRequirement = 0, respiratoryRate = 18, temperature = 38, dehydration = 'mild', comorbidities = 0, age = 40, consciousness = 'alert' } = input;
  let score = 0;
  if (oxygenRequirement > 0) score += 3;
  if (respiratoryRate >= 30) score += 2; else if (respiratoryRate >= 24) score += 1;
  if (temperature >= 40) score += 1;
  if (dehydration === 'severe') score += 2; else if (dehydration === 'moderate') score += 1;
  if (comorbidities >= 2) score += 2; else if (comorbidities === 1) score += 1;
  if (age >= 65 || age < 5) score += 1;
  if (consciousness === 'altered') score += 3;
  let severity;
  if (score >= 7) severity = 'critical-ICU-oseltamivir';
  else if (score >= 4) severity = 'severe-hospitalization';
  else if (score >= 2) severity = 'moderate-outpatient-oseltamivir';
  else severity = 'mild-supportive-care';
  return { score, severity, recommendation: severity === 'critical-ICU-oseltamivir' ? 'ICU-admit-oseltamivir-150mg-bid' : (severity === 'severe-hospitalization' ? 'admit-oseltamivir-75mg-bid' : 'outpatient-oseltamivir-75mg-bid') };
};

// 7) Hepatitis B — vaccination response
Engine.HepatitisBVaccineResponse = function (input = {}) {
  const { antiHbsTiter = 0, age = 30, smoking = false, obesity = false, immunocompromised = false, dialysis = false, diabetes = false } = input;
  let response;
  if (antiHbsTiter >= 10) response = 'protective-immune';
  else if (antiHbsTiter < 10 && !immunocompromised && !dialysis) response = 'non-responder-revaccinate';
  else if (immunocompromised || dialysis) response = 'poor-responder-double-dose-or-need-booster';
  else if (age >= 60 || smoking || obesity || diabetes) response = 'weak-responder-revaccinate';
  else response = 'non-responder-recheck-and-revaccinate';
  return { antiHbsTiter, response, recommendation: response === 'protective-immune' ? 'no-action' : (response === 'non-responder-revaccinate' ? 'revaccinate-3-doses-recheck' : 'double-dose-3-doses-or-IVIG') };
};

// 8) Mosquito-borne disease risk (dengue/malaria)
Engine.VectorBorneDiseaseRisk = function (input = {}) {
  const { region = 'temperate', season = 'winter', aedesIndex = 0, anophelesIndex = 0, previousOutbreak = false, travelHistory = 'none', fever = false, thrombocytopenia = false } = input;
  let diseaseRisk;
  if (aedesIndex >= 3 && (fever || thrombocytopenia)) diseaseRisk = 'high-dengue-risk';
  else if (anophelesIndex >= 3 && fever) diseaseRisk = 'high-malaria-risk';
  else if (region === 'tropical' && season === 'rainy' && (aedesIndex >= 1 || anophelesIndex >= 1)) diseaseRisk = 'moderate-vector-borne-risk';
  else if (travelHistory === 'tropical-endemic') diseaseRisk = 'travel-related-risk';
  else diseaseRisk = 'low-risk';
  return { diseaseRisk, recommendation: diseaseRisk.includes('high') ? 'urgent-malaria-rapid-test-dengue-NS1-PCR' : (diseaseRisk === 'moderate-vector-borne-risk' ? 'vector-control-nets-repellent' : 'monitor-advice') };
};

// 9) Screening program — breast cancer
Engine.BreastCancerScreeningEligibility = function (input = {}) {
  const { age = 40, familyHistory = false, brcaMutation = false, priorBiopsy = 'none', race = 'average' } = input;
  let eligibility;
  if (brcaMutation || (familyHistory && age >= 25)) eligibility = 'high-risk-annual-MRI-and-mammogram';
  else if (age >= 50) eligibility = 'standard-mammogram-every-2-years';
  else if (age >= 40 && (familyHistory || priorBiopsy === 'high-risk-lesion')) eligibility = 'mammogram-every-1-2-years';
  else if (age >= 40) eligibility = 'shared-decision-screening-1-2-years';
  else eligibility = 'no-screening-yet';
  return { eligibility, recommendation: eligibility === 'no-screening-yet' ? 'breast-awareness-education' : 'schedule-mammogram-imaging-suite' };
};

// 10) Hand hygiene compliance audit
Engine.HandHygieneCompliance = function (input = {}) {
  const { opportunities = 100, observedActions = 80, healthcareWorkerType = 'nurse', unit = 'general-ward', gloveUse = 'appropriate', duration = 30 } = input;
  const complianceRate = (observedActions / opportunities) * 100;
  let category;
  if (complianceRate >= 90) category = 'excellent-compliance';
  else if (complianceRate >= 75) category = 'good-compliance';
  else if (complianceRate >= 60) category = 'fair-compliance';
  else category = 'poor-compliance';
  return { complianceRate: Math.round(complianceRate * 10) / 10, category, recommendation: complianceRate < 75 ? 'mandatory-retraining-weekly-audit-feedback' : 'maintain-current-practices-monthly-audit' };
};
