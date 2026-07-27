// P3-DL pcc_sedation_analgesia_engine v3.76.0
'use strict';
function SedationScale(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sedationscale-none';
  if (t === 'yes') plan = 'sedationscale-protocol';
  return { plan, t };
}
function AnalgesiaScore(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'analgesiascore-none';
  if (t === 'yes') plan = 'analgesiascore-protocol';
  return { plan, t };
}
function DailySedationInterruption(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dailysedationinterruption-none';
  if (t === 'yes') plan = 'dailysedationinterruption-protocol';
  return { plan, t };
}
function Analgosedation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'analgosedation-none';
  if (t === 'yes') plan = 'analgosedation-protocol';
  return { plan, t };
}
function WithdrawalAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'withdrawalassessment-none';
  if (t === 'yes') plan = 'withdrawalassessment-protocol';
  return { plan, t };
}
function RegionalAnalgesia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'regionalanalgesia-none';
  if (t === 'yes') plan = 'regionalanalgesia-protocol';
  return { plan, t };
}
function OpioidSparing(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'opioidsparing-none';
  if (t === 'yes') plan = 'opioidsparing-protocol';
  return { plan, t };
}
function AgitationProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'agitationprotocol-none';
  if (t === 'yes') plan = 'agitationprotocol-protocol';
  return { plan, t };
}
function ProceduralSedation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'proceduralsedation-none';
  if (t === 'yes') plan = 'proceduralsedation-protocol';
  return { plan, t };
}
function SedationWeaning(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sedationweaning-none';
  if (t === 'yes') plan = 'sedationweaning-protocol';
  return { plan, t };
}
module.exports = {
  SedationScale, AnalgesiaScore, DailySedationInterruption, Analgosedation, WithdrawalAssessment, RegionalAnalgesia, OpioidSparing, AgitationProtocol, ProceduralSedation, SedationWeaning
};
