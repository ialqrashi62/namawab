// P3-EJ pcc_pediatric_infectious_engine v3.100.0
'use strict';
function PediatricMeningitisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMeningitisEval-none';
  if (t === 'yes') plan = 'pediatricMeningitisEval-protocol';
  return { plan, t };
}
function PediatricSepsis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSepsis-none';
  if (t === 'yes') plan = 'pediatricSepsis-protocol';
  return { plan, t };
}
function PediatricUTI(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricUTI-none';
  if (t === 'yes') plan = 'pediatricUTI-protocol';
  return { plan, t };
}
function PediatricPneumoniaEval2(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPneumoniaEval2-none';
  if (t === 'yes') plan = 'pediatricPneumoniaEval2-protocol';
  return { plan, t };
}
function CongenitalInfections(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'congenitalInfections-none';
  if (t === 'yes') plan = 'congenitalInfections-protocol';
  return { plan, t };
}
function PediatricTB(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTB-none';
  if (t === 'yes') plan = 'pediatricTB-protocol';
  return { plan, t };
}
function PediatricHIV(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHIV-none';
  if (t === 'yes') plan = 'pediatricHIV-protocol';
  return { plan, t };
}
function PediatricInfluenza(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricInfluenza-none';
  if (t === 'yes') plan = 'pediatricInfluenza-protocol';
  return { plan, t };
}
function PediatricSkinSoftTissue(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSkinSoftTissue-none';
  if (t === 'yes') plan = 'pediatricSkinSoftTissue-protocol';
  return { plan, t };
}
function PediatricGastroenteritis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGastroenteritis-none';
  if (t === 'yes') plan = 'pediatricGastroenteritis-protocol';
  return { plan, t };
}
module.exports = { PediatricMeningitisEval, PediatricSepsis, PediatricUTI, PediatricPneumoniaEval2, CongenitalInfections, PediatricTB, PediatricHIV, PediatricInfluenza, PediatricSkinSoftTissue, PediatricGastroenteritis };
