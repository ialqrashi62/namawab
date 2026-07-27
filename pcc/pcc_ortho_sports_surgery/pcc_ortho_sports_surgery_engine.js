// P3-DU pcc_ortho_sports_surgery_engine v3.85.0
'use strict';
function ACLRRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aCLRRepair-none';
  if (t === 'yes') plan = 'aCLRRepair-protocol';
  return { plan, t };
}
function RotatorCuffRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rotatorCuffRepair-none';
  if (t === 'yes') plan = 'rotatorCuffRepair-protocol';
  return { plan, t };
}
function MeniscusRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'meniscusRepair-none';
  if (t === 'yes') plan = 'meniscusRepair-protocol';
  return { plan, t };
}
function HipArthroscopy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hipArthroscopy-none';
  if (t === 'yes') plan = 'hipArthroscopy-protocol';
  return { plan, t };
}
function AchillesTendonRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'achillesTendonRepair-none';
  if (t === 'yes') plan = 'achillesTendonRepair-protocol';
  return { plan, t };
}
function ShoulderInstability(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'shoulderInstability-none';
  if (t === 'yes') plan = 'shoulderInstability-protocol';
  return { plan, t };
}
function TennisElbowRelease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tennisElbowRelease-none';
  if (t === 'yes') plan = 'tennisElbowRelease-protocol';
  return { plan, t };
}
function HipReplacementIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hipReplacementIndication-none';
  if (t === 'yes') plan = 'hipReplacementIndication-protocol';
  return { plan, t };
}
function KneeReplacementIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'kneeReplacementIndication-none';
  if (t === 'yes') plan = 'kneeReplacementIndication-protocol';
  return { plan, t };
}
function SportInjuryReturnToPlay(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sportInjuryReturnToPlay-none';
  if (t === 'yes') plan = 'sportInjuryReturnToPlay-protocol';
  return { plan, t };
}
module.exports = { ACLRRepair, RotatorCuffRepair, MeniscusRepair, HipArthroscopy, AchillesTendonRepair, ShoulderInstability, TennisElbowRelease, HipReplacementIndication, KneeReplacementIndication, SportInjuryReturnToPlay };
