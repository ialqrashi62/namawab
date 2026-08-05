// P3_EH pcc_voice_swallowing_engine v3.98.0
'use strict';
function VocalCordNoduleEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vocalCordNoduleEvaluation-none';
  if (t === 'yes') plan = 'vocalCordNoduleEvaluation-protocol';
  return { plan, t };
}
function LaryngopharyngealReflux(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'laryngopharyngealReflux-none';
  if (t === 'yes') plan = 'laryngopharyngealReflux-protocol';
  return { plan, t };
}
function MuscleTensionDysphonia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'muscleTensionDysphonia-none';
  if (t === 'yes') plan = 'muscleTensionDysphonia-protocol';
  return { plan, t };
}
function SpasmodicDysphonia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spasmodicDysphonia-none';
  if (t === 'yes') plan = 'spasmodicDysphonia-protocol';
  return { plan, t };
}
function VocalCordParalysis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vocalCordParalysis-none';
  if (t === 'yes') plan = 'vocalCordParalysis-protocol';
  return { plan, t };
}
function SubglotticStenosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'subglotticStenosis-none';
  if (t === 'yes') plan = 'subglotticStenosis-protocol';
  return { plan, t };
}
function TracheoesophagealFistula(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tracheoesophagealFistula-none';
  if (t === 'yes') plan = 'tracheoesophagealFistula-protocol';
  return { plan, t };
}
function ZenkerDiverticulum(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'zenkerDiverticulum-none';
  if (t === 'yes') plan = 'zenkerDiverticulum-protocol';
  return { plan, t };
}
function DysphagiaSwallowEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dysphagiaSwallowEval-none';
  if (t === 'yes') plan = 'dysphagiaSwallowEval-protocol';
  return { plan, t };
}
function VocalCordPolyps(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vocalCordPolyps-none';
  if (t === 'yes') plan = 'vocalCordPolyps-protocol';
  return { plan, t };
}
function VoiceTherapyProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'voiceTherapyProtocol-none';
  if (t === 'yes') plan = 'voiceTherapyProtocol-protocol';
  return { plan, t };
}
module.exports = { VocalCordNoduleEvaluation, LaryngopharyngealReflux, MuscleTensionDysphonia, SpasmodicDysphonia, VocalCordParalysis, SubglotticStenosis, TracheoesophagealFistula, ZenkerDiverticulum, DysphagiaSwallowEval, VocalCordPolyps, VoiceTherapyProtocol };
