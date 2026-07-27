// P3-ER pcc_pediatric_neuro_ext_engine v3.108.0
'use strict';
function PediatricEpilepsyExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEpilepsyExt-none';
  if (t === 'yes') plan = 'pediatricEpilepsyExt-protocol';
  return { plan, t };
}
function PediatricSeizureEvalExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSeizureEvalExt-none';
  if (t === 'yes') plan = 'pediatricSeizureEvalExt-protocol';
  return { plan, t };
}
function PediatricHeadacheEvalExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHeadacheEvalExt-none';
  if (t === 'yes') plan = 'pediatricHeadacheEvalExt-protocol';
  return { plan, t };
}
function PediatricMigraineExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMigraineExt-none';
  if (t === 'yes') plan = 'pediatricMigraineExt-protocol';
  return { plan, t };
}
function PediatricStrokeExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricStrokeExt-none';
  if (t === 'yes') plan = 'pediatricStrokeExt-protocol';
  return { plan, t };
}
function PediatricMovementDisorderExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMovementDisorderExt-none';
  if (t === 'yes') plan = 'pediatricMovementDisorderExt-protocol';
  return { plan, t };
}
function PediatricNeurocutaneousExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNeurocutaneousExt-none';
  if (t === 'yes') plan = 'pediatricNeurocutaneousExt-protocol';
  return { plan, t };
}
function PediatricNeuromuscularExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNeuromuscularExt-none';
  if (t === 'yes') plan = 'pediatricNeuromuscularExt-protocol';
  return { plan, t };
}
function PediatricCerebrovascularExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCerebrovascularExt-none';
  if (t === 'yes') plan = 'pediatricCerebrovascularExt-protocol';
  return { plan, t };
}
function PediatricNeuroimmunologyExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNeuroimmunologyExt-none';
  if (t === 'yes') plan = 'pediatricNeuroimmunologyExt-protocol';
  return { plan, t };
}
module.exports = { PediatricEpilepsyExt, PediatricSeizureEvalExt, PediatricHeadacheEvalExt, PediatricMigraineExt, PediatricStrokeExt, PediatricMovementDisorderExt, PediatricNeurocutaneousExt, PediatricNeuromuscularExt, PediatricCerebrovascularExt, PediatricNeuroimmunologyExt };
