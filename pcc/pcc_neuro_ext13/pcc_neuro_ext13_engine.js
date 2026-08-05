// P3_EV pcc_neuro_ext13_engine v3.112.0
'use strict';
function ParkinsonDiseaseExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'parkinsonDiseaseExt-none';
  if (t === 'yes') plan = 'parkinsonDiseaseExt-protocol';
  return { plan, t };
}
function ParkinsonPlusSyndromes(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'parkinsonPlusSyndromes-none';
  if (t === 'yes') plan = 'parkinsonPlusSyndromes-protocol';
  return { plan, t };
}
function MultisystemAtrophy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'multisystemAtrophy-none';
  if (t === 'yes') plan = 'multisystemAtrophy-protocol';
  return { plan, t };
}
function ProgressiveSupranuclearPalsy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'progressiveSupranuclearPalsy-none';
  if (t === 'yes') plan = 'progressiveSupranuclearPalsy-protocol';
  return { plan, t };
}
function CorticobasalDegeneration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'corticobasalDegeneration-none';
  if (t === 'yes') plan = 'corticobasalDegeneration-protocol';
  return { plan, t };
}
function LewyBodyDementiaExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lewyBodyDementiaExt-none';
  if (t === 'yes') plan = 'lewyBodyDementiaExt-protocol';
  return { plan, t };
}
function EssentialTremor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'essentialTremor-none';
  if (t === 'yes') plan = 'essentialTremor-protocol';
  return { plan, t };
}
function DystoniaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dystoniaEval-none';
  if (t === 'yes') plan = 'dystoniaEval-protocol';
  return { plan, t };
}
function TardiveDyskinesia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tardiveDyskinesia-none';
  if (t === 'yes') plan = 'tardiveDyskinesia-protocol';
  return { plan, t };
}
function HuntingtonDiseaseExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'huntingtonDiseaseExt-none';
  if (t === 'yes') plan = 'huntingtonDiseaseExt-protocol';
  return { plan, t };
}
module.exports = { ParkinsonDiseaseExt, ParkinsonPlusSyndromes, MultisystemAtrophy, ProgressiveSupranuclearPalsy, CorticobasalDegeneration, LewyBodyDementiaExt, EssentialTremor, DystoniaEval, TardiveDyskinesia, HuntingtonDiseaseExt };
