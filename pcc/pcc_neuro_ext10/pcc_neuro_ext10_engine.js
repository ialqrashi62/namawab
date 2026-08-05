// P3_ES pcc_neuro_ext10_engine v3.109.0
'use strict';
function CerebellarAtaxiaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cerebellarAtaxiaEval-none';
  if (t === 'yes') plan = 'cerebellarAtaxiaEval-protocol';
  return { plan, t };
}
function SpinocerebellarDegeneration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinocerebellarDegeneration-none';
  if (t === 'yes') plan = 'spinocerebellarDegeneration-protocol';
  return { plan, t };
}
function OlivopontocerebellarAtrophy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'olivopontocerebellarAtrophy-none';
  if (t === 'yes') plan = 'olivopontocerebellarAtrophy-protocol';
  return { plan, t };
}
function DentatorubralPallidoluysianAtrophy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dentatorubralPallidoluysianAtrophy-none';
  if (t === 'yes') plan = 'dentatorubralPallidoluysianAtrophy-protocol';
  return { plan, t };
}
function FriedreichAtaxiaExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'friedreichAtaxiaExt-none';
  if (t === 'yes') plan = 'friedreichAtaxiaExt-protocol';
  return { plan, t };
}
function AtaxiaTelangiectasiaExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ataxiaTelangiectasiaExt-none';
  if (t === 'yes') plan = 'ataxiaTelangiectasiaExt-protocol';
  return { plan, t };
}
function CerebrotendinousXanthomatosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cerebrotendinousXanthomatosis-none';
  if (t === 'yes') plan = 'cerebrotendinousXanthomatosis-protocol';
  return { plan, t };
}
function NiemannPickDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'niemannPickDisease-none';
  if (t === 'yes') plan = 'niemannPickDisease-protocol';
  return { plan, t };
}
function GaucherDiseaseType2(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gaucherDiseaseType2-none';
  if (t === 'yes') plan = 'gaucherDiseaseType2-protocol';
  return { plan, t };
}
function MetachromaticLeukodystrophyExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'metachromaticLeukodystrophyExt-none';
  if (t === 'yes') plan = 'metachromaticLeukodystrophyExt-protocol';
  return { plan, t };
}
module.exports = { CerebellarAtaxiaEval, SpinocerebellarDegeneration, OlivopontocerebellarAtrophy, DentatorubralPallidoluysianAtrophy, FriedreichAtaxiaExt, AtaxiaTelangiectasiaExt, CerebrotendinousXanthomatosis, NiemannPickDisease, GaucherDiseaseType2, MetachromaticLeukodystrophyExt };
