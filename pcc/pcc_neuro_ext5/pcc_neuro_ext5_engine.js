// P3_EN pcc_neuro_ext5_engine v3.104.0
'use strict';
function NeurofibromatosisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neurofibromatosisEval-none';
  if (t === 'yes') plan = 'neurofibromatosisEval-protocol';
  return { plan, t };
}
function TuberousSclerosisComplex(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tuberousSclerosisComplex-none';
  if (t === 'yes') plan = 'tuberousSclerosisComplex-protocol';
  return { plan, t };
}
function SturgeWeberSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sturgeWeberSyndrome-none';
  if (t === 'yes') plan = 'sturgeWeberSyndrome-protocol';
  return { plan, t };
}
function AtaxiaTelangiectasia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ataxiaTelangiectasia-none';
  if (t === 'yes') plan = 'ataxiaTelangiectasia-protocol';
  return { plan, t };
}
function VonHippelLindau(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vonHippelLindau-none';
  if (t === 'yes') plan = 'vonHippelLindau-protocol';
  return { plan, t };
}
function HuntingtonDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'huntingtonDisease-none';
  if (t === 'yes') plan = 'huntingtonDisease-protocol';
  return { plan, t };
}
function SpinocerebellarAtaxia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinocerebellarAtaxia-none';
  if (t === 'yes') plan = 'spinocerebellarAtaxia-protocol';
  return { plan, t };
}
function FriedreichAtaxia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'friedreichAtaxia-none';
  if (t === 'yes') plan = 'friedreichAtaxia-protocol';
  return { plan, t };
}
function WilsonDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'wilsonDisease-none';
  if (t === 'yes') plan = 'wilsonDisease-protocol';
  return { plan, t };
}
function PantothenateKinase(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pantothenateKinase-none';
  if (t === 'yes') plan = 'pantothenateKinase-protocol';
  return { plan, t };
}
module.exports = { NeurofibromatosisEval, TuberousSclerosisComplex, SturgeWeberSyndrome, AtaxiaTelangiectasia, VonHippelLindau, HuntingtonDisease, SpinocerebellarAtaxia, FriedreichAtaxia, WilsonDisease, PantothenateKinase };
