// P3-EO pcc_neuro_ext6_engine v3.105.0
'use strict';
function SpinaBifidaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinaBifidaEval-none';
  if (t === 'yes') plan = 'spinaBifidaEval-protocol';
  return { plan, t };
}
function AnencephalyEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'anencephalyEval-none';
  if (t === 'yes') plan = 'anencephalyEval-protocol';
  return { plan, t };
}
function EncephaloceleEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'encephaloceleEval-none';
  if (t === 'yes') plan = 'encephaloceleEval-protocol';
  return { plan, t };
}
function HoloprosencephalyEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'holoprosencephalyEval-none';
  if (t === 'yes') plan = 'holoprosencephalyEval-protocol';
  return { plan, t };
}
function LissencephalyEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lissencephalyEval-none';
  if (t === 'yes') plan = 'lissencephalyEval-protocol';
  return { plan, t };
}
function PolymicrogyriaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'polymicrogyriaEval-none';
  if (t === 'yes') plan = 'polymicrogyriaEval-protocol';
  return { plan, t };
}
function SchizencephalyEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'schizencephalyEval-none';
  if (t === 'yes') plan = 'schizencephalyEval-protocol';
  return { plan, t };
}
function PorencephalyEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'porencephalyEval-none';
  if (t === 'yes') plan = 'porencephalyEval-protocol';
  return { plan, t };
}
function HydranencephalyEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hydranencephalyEval-none';
  if (t === 'yes') plan = 'hydranencephalyEval-protocol';
  return { plan, t };
}
function AicardiSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aicardiSyndrome-none';
  if (t === 'yes') plan = 'aicardiSyndrome-protocol';
  return { plan, t };
}
module.exports = { SpinaBifidaEval, AnencephalyEval, EncephaloceleEval, HoloprosencephalyEval, LissencephalyEval, PolymicrogyriaEval, SchizencephalyEval, PorencephalyEval, HydranencephalyEval, AicardiSyndrome };
