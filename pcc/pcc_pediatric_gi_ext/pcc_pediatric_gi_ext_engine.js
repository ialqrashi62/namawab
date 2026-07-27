// P3-EH pcc_pediatric_gi_ext_engine v3.98.0
'use strict';
function PediatricGERDEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGERDEvaluation-none';
  if (t === 'yes') plan = 'pediatricGERDEvaluation-protocol';
  return { plan, t };
}
function CeliacDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'celiacDisease-none';
  if (t === 'yes') plan = 'celiacDisease-protocol';
  return { plan, t };
}
function PediatricIBD(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricIBD-none';
  if (t === 'yes') plan = 'pediatricIBD-protocol';
  return { plan, t };
}
function HirschsprungDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hirschsprungDisease-none';
  if (t === 'yes') plan = 'hirschsprungDisease-protocol';
  return { plan, t };
}
function PyloricStenosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pyloricStenosis-none';
  if (t === 'yes') plan = 'pyloricStenosis-protocol';
  return { plan, t };
}
function Intussusception(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'intussusception-none';
  if (t === 'yes') plan = 'intussusception-protocol';
  return { plan, t };
}
function PediatricHepatology(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHepatology-none';
  if (t === 'yes') plan = 'pediatricHepatology-protocol';
  return { plan, t };
}
function PediatricPancreatitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPancreatitis-none';
  if (t === 'yes') plan = 'pediatricPancreatitis-protocol';
  return { plan, t };
}
function NeonatalCholestasis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalCholestasis-none';
  if (t === 'yes') plan = 'neonatalCholestasis-protocol';
  return { plan, t };
}
function PediatricLiverTransplant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLiverTransplant-none';
  if (t === 'yes') plan = 'pediatricLiverTransplant-protocol';
  return { plan, t };
}
module.exports = { PediatricGERDEvaluation, CeliacDisease, PediatricIBD, HirschsprungDisease, PyloricStenosis, Intussusception, PediatricHepatology, PediatricPancreatitis, NeonatalCholestasis, PediatricLiverTransplant };
