// P3-EL pcc_neuro_ext3_engine v3.102.0
'use strict';
function NeuroSarcoidosisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuroSarcoidosisEval-none';
  if (t === 'yes') plan = 'neuroSarcoidosisEval-protocol';
  return { plan, t };
}
function NeuroBehcetEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuroBehcetEval-none';
  if (t === 'yes') plan = 'neuroBehcetEval-protocol';
  return { plan, t };
}
function NeurosyphilisProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neurosyphilisProtocol-none';
  if (t === 'yes') plan = 'neurosyphilisProtocol-protocol';
  return { plan, t };
}
function NeuroLymeDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuroLymeDisease-none';
  if (t === 'yes') plan = 'neuroLymeDisease-protocol';
  return { plan, t };
}
function NeuromyelitisOptica(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuromyelitisOptica-none';
  if (t === 'yes') plan = 'neuromyelitisOptica-protocol';
  return { plan, t };
}
function ProgressiveMS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'progressiveMS-none';
  if (t === 'yes') plan = 'progressiveMS-protocol';
  return { plan, t };
}
function MOGAntibodyDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mOGAntibodyDisease-none';
  if (t === 'yes') plan = 'mOGAntibodyDisease-protocol';
  return { plan, t };
}
function CLIPPERSProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cLIPPERSProtocol-none';
  if (t === 'yes') plan = 'cLIPPERSProtocol-protocol';
  return { plan, t };
}
function AutoimmuneEncephalitisExtended(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'autoimmuneEncephalitisExtended-none';
  if (t === 'yes') plan = 'autoimmuneEncephalitisExtended-protocol';
  return { plan, t };
}
function CNSVasculitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cNSVasculitis-none';
  if (t === 'yes') plan = 'cNSVasculitis-protocol';
  return { plan, t };
}
module.exports = { NeuroSarcoidosisEval, NeuroBehcetEval, NeurosyphilisProtocol, NeuroLymeDisease, NeuromyelitisOptica, ProgressiveMS, MOGAntibodyDisease, CLIPPERSProtocol, AutoimmuneEncephalitisExtended, CNSVasculitis };
