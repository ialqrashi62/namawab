// P3_DW pcc_sports_cardiology_engine v3.87.0
'use strict';
function AthleteECGInterpretation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'athleteECGInterpretation-none';
  if (t === 'yes') plan = 'athleteECGInterpretation-protocol';
  return { plan, t };
}
function PreParticipationCardiacScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'preParticipationCardiacScreen-none';
  if (t === 'yes') plan = 'preParticipationCardiacScreen-protocol';
  return { plan, t };
}
function HypertrophicCardiomyopathyRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypertrophicCardiomyopathyRisk-none';
  if (t === 'yes') plan = 'hypertrophicCardiomyopathyRisk-protocol';
  return { plan, t };
}
function MarfanSyndromeScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'marfanSyndromeScreen-none';
  if (t === 'yes') plan = 'marfanSyndromeScreen-protocol';
  return { plan, t };
}
function CommotioCordisRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'commotioCordisRisk-none';
  if (t === 'yes') plan = 'commotioCordisRisk-protocol';
  return { plan, t };
}
function ExerciseStressTestProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'exerciseStressTestProtocol-none';
  if (t === 'yes') plan = 'exerciseStressTestProtocol-protocol';
  return { plan, t };
}
function AthleteECHOIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'athleteECHOIndication-none';
  if (t === 'yes') plan = 'athleteECHOIndication-protocol';
  return { plan, t };
}
function CardiacRehabPhaseProgression(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cardiacRehabPhaseProgression-none';
  if (t === 'yes') plan = 'cardiacRehabPhaseProgression-protocol';
  return { plan, t };
}
function ReturnToPlayCardiac(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'returnToPlayCardiac-none';
  if (t === 'yes') plan = 'returnToPlayCardiac-protocol';
  return { plan, t };
}
function SuddenCardiacDeathScreening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'suddenCardiacDeathScreening-none';
  if (t === 'yes') plan = 'suddenCardiacDeathScreening-protocol';
  return { plan, t };
}
module.exports = { AthleteECGInterpretation, PreParticipationCardiacScreen, HypertrophicCardiomyopathyRisk, MarfanSyndromeScreen, CommotioCordisRisk, ExerciseStressTestProtocol, AthleteECHOIndication, CardiacRehabPhaseProgression, ReturnToPlayCardiac, SuddenCardiacDeathScreening };
