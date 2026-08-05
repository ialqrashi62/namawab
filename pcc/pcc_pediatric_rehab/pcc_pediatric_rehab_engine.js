// P3_EM pcc_pediatric_rehab_engine v3.103.0
'use strict';
function PediatricRehabAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricRehabAssessment-none';
  if (t === 'yes') plan = 'pediatricRehabAssessment-protocol';
  return { plan, t };
}
function PediatricPT(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPT-none';
  if (t === 'yes') plan = 'pediatricPT-protocol';
  return { plan, t };
}
function PediatricOT(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricOT-none';
  if (t === 'yes') plan = 'pediatricOT-protocol';
  return { plan, t };
}
function PediatricSpeechRehab(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSpeechRehab-none';
  if (t === 'yes') plan = 'pediatricSpeechRehab-protocol';
  return { plan, t };
}
function PediatricCognitiveRehab(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCognitiveRehab-none';
  if (t === 'yes') plan = 'pediatricCognitiveRehab-protocol';
  return { plan, t };
}
function PediatricAquaticTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAquaticTherapy-none';
  if (t === 'yes') plan = 'pediatricAquaticTherapy-protocol';
  return { plan, t };
}
function PediatricConstraintTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricConstraintTherapy-none';
  if (t === 'yes') plan = 'pediatricConstraintTherapy-protocol';
  return { plan, t };
}
function PediatricRoboticRehab(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricRoboticRehab-none';
  if (t === 'yes') plan = 'pediatricRoboticRehab-protocol';
  return { plan, t };
}
function PediatricGaitTraining(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGaitTraining-none';
  if (t === 'yes') plan = 'pediatricGaitTraining-protocol';
  return { plan, t };
}
function PediatricSportsRehab(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSportsRehab-none';
  if (t === 'yes') plan = 'pediatricSportsRehab-protocol';
  return { plan, t };
}
module.exports = { PediatricRehabAssessment, PediatricPT, PediatricOT, PediatricSpeechRehab, PediatricCognitiveRehab, PediatricAquaticTherapy, PediatricConstraintTherapy, PediatricRoboticRehab, PediatricGaitTraining, PediatricSportsRehab };
