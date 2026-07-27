'use strict';
// Sleep Medicine Engine: 10 pure deterministic functions
// Compliance: AASM, AHRQ, NIH, STOP-BANG, Berlin Questionnaire, ICSD-3

function STOPBANG({ snoring, tired, observedApnea, highBP, bmi, age, neckCircumference, male }) {
  let score = 0;
  if (snoring) score++;
  if (tired) score++;
  if (observedApnea) score++;
  if (highBP) score++;
  if (bmi >= 35) score++;
  if (age >= 50) score++;
  if (neckCircumference >= 40) score++;
  if (male) score++;
  let risk;
  if (score >= 5) risk = 'high-risk-OSA';
  else if (score >= 3) risk = 'intermediate-risk-OSA';
  else risk = 'low-risk-OSA';
  return { score, risk, recommendation: score >= 3 ? 'polysomnography-sleep-study' : 'clinical-followup' };
}

function EpworthSleepiness({ sittingReading, watchingTV, sittingInactive, passengerInCar, lyingDownAfternoon, sittingTalking, sittingAfterLunch, carInTraffic }) {
  const total = sittingReading + watchingTV + sittingInactive + passengerInCar + lyingDownAfternoon + sittingTalking + sittingAfterLunch + carInTraffic;
  let category;
  if (total >= 16) category = 'severe-daytime-sleepiness';
  else if (total >= 11) category = 'moderate-daytime-sleepiness';
  else if (total >= 8) category = 'mild-daytime-sleepiness';
  else category = 'normal-sleepiness';
  return { essScore: total, category, recommendation: total >= 11 ? 'urgent-sleep-study' : 'monitor' };
}

function AHISeverity({ apneaEvents, hypopneaEvents, totalSleepTimeMinutes }) {
  const ahi = (apneaEvents + hypopneaEvents) / (totalSleepTimeMinutes / 60);
  let severity;
  if (ahi >= 30) severity = 'severe-OSA';
  else if (ahi >= 15) severity = 'moderate-OSA';
  else if (ahi >= 5) severity = 'mild-OSA';
  else severity = 'normal';
  let treatment;
  if (severity === 'severe-OSA') treatment = 'CPAP-BPAP-mandibular-advancement';
  else if (severity === 'moderate-OSA') treatment = 'CPAP-OAT-positional';
  else if (severity === 'mild-OSA') treatment = 'positional-therapy-OAT';
  else treatment = 'lifestyle-sleep-hygiene';
  return { ahi: Math.round(ahi * 10) / 10, severity, treatment };
}

function BerlinQuestionnaire({ snoringFrequency, snoringLoudness, observedApnea, daytimeSleepiness, drivingDrowsiness, hypertension, bmiCategory, neckCategory }) {
  const cat1 = (snoringFrequency >= 3 ? 1 : 0) + (snoringLoudness >= 2 ? 1 : 0) + (observedApnea ? 1 : 0);
  const cat2 = (daytimeSleepiness >= 3 ? 1 : 0) + (drivingDrowsiness ? 1 : 0);
  const cat3 = (hypertension ? 1 : 0) + (bmiCategory >= 3 ? 1 : 0) + (neckCategory >= 4 ? 1 : 0);
  const positive = (cat1 >= 2) + (cat2 >= 2) + (cat3 >= 2) >= 2;
  return { cat1, cat2, cat3, highRisk: positive, recommendation: positive ? 'sleep-study-referral' : 'monitor' };
}

function InsomniaSeverity({ difficultyFallingAsleep, difficultyStayingAsleep, earlyMorningWaking, sleepSatisfaction, interferenceDaily, noticeability, distress }) {
  const total = difficultyFallingAsleep + difficultyStayingAsleep + earlyMorningWaking + sleepSatisfaction + interferenceDaily + noticeability + distress;
  let severity;
  if (total >= 22) severity = 'severe-insomnia';
  else if (total >= 15) severity = 'moderate-insomnia';
  else if (total >= 8) severity = 'mild-insomnia';
  else severity = 'no-insomnia';
  let treatment;
  if (severity === 'severe-insomnia') treatment = 'CBT-I-or-sleep-specialist';
  else if (severity === 'moderate-insomnia') treatment = 'CBT-I-sleep-hygiene';
  else if (severity === 'mild-insomnia') treatment = 'sleep-hygiene-cbt';
  else treatment = 'monitor';
  return { isiScore: total, severity, treatment };
}

function RestlessLegsSeverity({ urgeToMove, reliefWithMovement, worseAtRest, worseAtNight, frequency, sleepDisturbance }) {
  const total = urgeToMove + reliefWithMovement + worseAtRest + worseAtNight + frequency + sleepDisturbance;
  let severity;
  if (total >= 24) severity = 'very-severe-RLS';
  else if (total >= 20) severity = 'severe-RLS';
  else if (total >= 12) severity = 'moderate-RLS';
  else if (total >= 1) severity = 'mild-RLS';
  else severity = 'no-RLS';
  let treatment;
  if (severity === 'very-severe-RLS' || severity === 'severe-RLS') treatment = 'dopamine-agonist-pramipexole-gabapentin';
  else if (severity === 'moderate-RLS') treatment = 'iron-replacement-gabapentin';
  else treatment = 'lifestyle-massage';
  return { irlsScore: total, severity, treatment };
}

function CPAPTitration({ ahiBefore, pressureCmH2O, leak, maskType, complianceHoursPerNight, residualEvents }) {
  let effectiveness;
  if (ahiBefore >= 30 && residualEvents < 5) effectiveness = 'excellent-response';
  else if (residualEvents < 10) effectiveness = 'good-response';
  else effectiveness = 'suboptimal-consider-BPAP';
  const compliance = complianceHoursPerNight >= 4 ? 'good-compliance' : 'poor-compliance';
  return { effectiveness, compliance, pressure: pressureCmH2O, maskType, recommendation: effectiveness === 'excellent-response' && compliance === 'good-compliance' ? 'continue-current' : effectiveness === 'suboptimal-consider-BPAP' ? 'BPAP-referral' : 'compliance-counseling' };
}

function NarcolepsyAssessment({ excessiveDaytimeSleepiness, cataplexy, sleepParalysis, hypnagogicHallucinations, sleepOnsetREM, msltMeanLatency }) {
  const total = excessiveDaytimeSleepiness + cataplexy + sleepParalysis + hypnagogicHallucinations;
  let category;
  if (cataplexy && sleepOnsetREM === 'yes' && msltMeanLatency < 8) category = 'narcolepsy-type-1';
  else if (!cataplexy && sleepOnsetREM === 'yes' && msltMeanLatency < 8) category = 'narcolepsy-type-2';
  else if (total >= 2) category = 'idiopathic-hypersomnia';
  else category = 'no-narcolepsy';
  let treatment;
  if (category === 'narcolepsy-type-1') treatment = 'modafinil-sodium-oxybate';
  else if (category === 'narcolepsy-type-2') treatment = 'modafinil-stimulant';
  else treatment = 'sleep-hygiene-consider-MSLT';
  return { category, treatment, total };
}

function CircadianRhythm({ sleepPhase, normalPhase, difficultyWaking, daytimeFatigue, sleepOnsetInsomnia, sleepMaintenance }) {
  let type;
  if (sleepPhase === 'delayed' && difficultyWaking) type = 'delayed-sleep-phase';
  else if (sleepPhase === 'advanced' && sleepOnsetInsomnia) type = 'advanced-sleep-phase';
  else if (sleepPhase === 'shiftwork' && daytimeFatigue) type = 'shiftwork-disorder';
  else if (sleepPhase === 'irregular' && sleepMaintenance) type = 'irregular-sleep-wake';
  else type = 'normal-circadian';
  let treatment;
  if (type === 'delayed-sleep-phase') treatment = 'morning-bright-light-melatonin-evening';
  else if (type === 'advanced-sleep-phase') treatment = 'evening-bright-light';
  else if (type === 'shiftwork-disorder') treatment = 'modafinil-circadian-alignment';
  else treatment = 'sleep-hygiene';
  return { type, treatment };
}

function PediatricSleep({ age, totalSleepHours, bedtime, waketime, daytimeSleepiness, behavioralIssues, snoring, schoolPerformance, apneaEvents }) {
  let totalExpected = 0;
  if (age <= 2) totalExpected = 12;
  else if (age <= 5) totalExpected = 11;
  else if (age <= 12) totalExpected = 10;
  else totalExpected = 9;
  const deficit = totalExpected - totalSleepHours;
  let recommendation;
  if (deficit >= 2) recommendation = 'urgent-sleep-counseling-school-support';
  else if (deficit >= 1) recommendation = 'sleep-hygiene-counseling';
  else if (snoring && apneaEvents > 0) recommendation = 'pediatric-sleep-study-OSA';
  else if (behavioralIssues && schoolPerformance === 'poor') recommendation = 'sleep-specialist-pediatric-psych';
  else recommendation = 'maintain-schedule';
  return { age, totalExpected, actual: totalSleepHours, deficit, recommendation };
}

module.exports = {
  STOPBANG, EpworthSleepiness, AHISeverity, BerlinQuestionnaire, InsomniaSeverity,
  RestlessLegsSeverity, CPAPTitration, NarcolepsyAssessment, CircadianRhythm, PediatricSleep,
};
