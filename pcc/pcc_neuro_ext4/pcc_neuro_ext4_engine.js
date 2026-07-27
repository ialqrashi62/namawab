// P3-EM pcc_neuro_ext4_engine v3.103.0
'use strict';
function MitochondrialDiseaseNeuro(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mitochondrialDiseaseNeuro-none';
  if (t === 'yes') plan = 'mitochondrialDiseaseNeuro-protocol';
  return { plan, t };
}
function LeukodystrophyEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'leukodystrophyEval-none';
  if (t === 'yes') plan = 'leukodystrophyEval-protocol';
  return { plan, t };
}
function NeurocutaneousSyndromes(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neurocutaneousSyndromes-none';
  if (t === 'yes') plan = 'neurocutaneousSyndromes-protocol';
  return { plan, t };
}
function CharcotMarieTooth(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'charcotMarieTooth-none';
  if (t === 'yes') plan = 'charcotMarieTooth-protocol';
  return { plan, t };
}
function MyastheniaGravisCrisis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'myastheniaGravisCrisis-none';
  if (t === 'yes') plan = 'myastheniaGravisCrisis-protocol';
  return { plan, t };
}
function GuillainBarreSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'guillainBarreSyndrome-none';
  if (t === 'yes') plan = 'guillainBarreSyndrome-protocol';
  return { plan, t };
}
function CIDPEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cIDPEval-none';
  if (t === 'yes') plan = 'cIDPEval-protocol';
  return { plan, t };
}
function ALSProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aLSProtocol-none';
  if (t === 'yes') plan = 'aLSProtocol-protocol';
  return { plan, t };
}
function PolymyositisDermatomyositis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'polymyositisDermatomyositis-none';
  if (t === 'yes') plan = 'polymyositisDermatomyositis-protocol';
  return { plan, t };
}
function MyotonicDystrophy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'myotonicDystrophy-none';
  if (t === 'yes') plan = 'myotonicDystrophy-protocol';
  return { plan, t };
}
module.exports = { MitochondrialDiseaseNeuro, LeukodystrophyEval, NeurocutaneousSyndromes, CharcotMarieTooth, MyastheniaGravisCrisis, GuillainBarreSyndrome, CIDPEval, ALSProtocol, PolymyositisDermatomyositis, MyotonicDystrophy };
