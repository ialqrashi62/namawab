// P3_ES pcc_pediatric_cardio_ext2_engine v3.109.0
'use strict';
function PediatricASDEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricASDEval-none';
  if (t === 'yes') plan = 'pediatricASDEval-protocol';
  return { plan, t };
}
function PediatricVSDPostRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricVSDPostRepair-none';
  if (t === 'yes') plan = 'pediatricVSDPostRepair-protocol';
  return { plan, t };
}
function PediatricAVCanal(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAVCanal-none';
  if (t === 'yes') plan = 'pediatricAVCanal-protocol';
  return { plan, t };
}
function PediatricTOFRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTOFRepair-none';
  if (t === 'yes') plan = 'pediatricTOFRepair-protocol';
  return { plan, t };
}
function PediatricTranspositionGreatArteries(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTranspositionGreatArteries-none';
  if (t === 'yes') plan = 'pediatricTranspositionGreatArteries-protocol';
  return { plan, t };
}
function PediatricTruncusArteriosus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTruncusArteriosus-none';
  if (t === 'yes') plan = 'pediatricTruncusArteriosus-protocol';
  return { plan, t };
}
function PediatricTAPVR(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTAPVR-none';
  if (t === 'yes') plan = 'pediatricTAPVR-protocol';
  return { plan, t };
}
function PediatricHLHS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHLHS-none';
  if (t === 'yes') plan = 'pediatricHLHS-protocol';
  return { plan, t };
}
function PediatricCoarctationAorta(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCoarctationAorta-none';
  if (t === 'yes') plan = 'pediatricCoarctationAorta-protocol';
  return { plan, t };
}
function PediatricEbsteinAnomaly(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEbsteinAnomaly-none';
  if (t === 'yes') plan = 'pediatricEbsteinAnomaly-protocol';
  return { plan, t };
}
module.exports = { PediatricASDEval, PediatricVSDPostRepair, PediatricAVCanal, PediatricTOFRepair, PediatricTranspositionGreatArteries, PediatricTruncusArteriosus, PediatricTAPVR, PediatricHLHS, PediatricCoarctationAorta, PediatricEbsteinAnomaly };
